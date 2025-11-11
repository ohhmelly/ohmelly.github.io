const express = require('express');
const router = express.Router();
const Billing = require('../models/Billing');
const { authenticateToken, authorizeRole } = require('./auth');

// In-memory storage
const billingRecords = [];

/**
 * Billing and Claims Management Routes
 * Integrated billing system for Colorado EHR
 */

// Get all billing records
router.get('/', authenticateToken, authorizeRole('Admin', 'Billing'), (req, res) => {
  try {
    const { patientId, providerId, status, startDate, endDate } = req.query;

    let filtered = [...billingRecords];

    if (patientId) {
      filtered = filtered.filter(b => b.patientId === patientId);
    }

    if (providerId) {
      filtered = filtered.filter(b => b.providerId === providerId);
    }

    if (status) {
      filtered = filtered.filter(b => b.claimStatus === status);
    }

    if (startDate && endDate) {
      filtered = filtered.filter(b => {
        const serviceDate = new Date(b.serviceDate);
        return serviceDate >= new Date(startDate) && serviceDate <= new Date(endDate);
      });
    }

    res.json({
      total: filtered.length,
      billingRecords: filtered
    });
  } catch (error) {
    console.error('Error fetching billing records:', error);
    res.status(500).json({ error: 'Error fetching billing records' });
  }
});

// Get billing record by ID
router.get('/:id', authenticateToken, authorizeRole('Admin', 'Billing', 'Doctor'), (req, res) => {
  try {
    const record = billingRecords.find(b => b.id === req.params.id);

    if (!record) {
      return res.status(404).json({ error: 'Billing record not found' });
    }

    res.json(record);
  } catch (error) {
    console.error('Error fetching billing record:', error);
    res.status(500).json({ error: 'Error fetching billing record' });
  }
});

// Get billing records for a patient
router.get('/patient/:patientId', authenticateToken, (req, res) => {
  try {
    const records = billingRecords.filter(b => b.patientId === req.params.patientId);

    res.json({
      total: records.length,
      billingRecords: records
    });
  } catch (error) {
    console.error('Error fetching patient billing:', error);
    res.status(500).json({ error: 'Error fetching patient billing' });
  }
});

// Create new billing record
router.post('/', authenticateToken, authorizeRole('Admin', 'Billing', 'Doctor'), (req, res) => {
  try {
    const billingData = {
      ...req.body,
      createdBy: req.user.id
    };

    const billing = new Billing(billingData);
    billing.calculateTotals();

    billingRecords.push(billing);

    res.status(201).json({
      message: 'Billing record created successfully',
      billing
    });
  } catch (error) {
    console.error('Error creating billing record:', error);
    res.status(500).json({ error: 'Error creating billing record' });
  }
});

// Update billing record
router.put('/:id', authenticateToken, authorizeRole('Admin', 'Billing'), (req, res) => {
  try {
    const index = billingRecords.findIndex(b => b.id === req.params.id);

    if (index === -1) {
      return res.status(404).json({ error: 'Billing record not found' });
    }

    const updatedData = {
      ...billingRecords[index],
      ...req.body,
      id: billingRecords[index].id,
      claimNumber: billingRecords[index].claimNumber,
      updatedAt: new Date().toISOString()
    };

    billingRecords[index] = new Billing(updatedData);
    billingRecords[index].calculateTotals();

    res.json({
      message: 'Billing record updated successfully',
      billing: billingRecords[index]
    });
  } catch (error) {
    console.error('Error updating billing record:', error);
    res.status(500).json({ error: 'Error updating billing record' });
  }
});

// Add payment to billing record
router.post('/:id/payment', authenticateToken, authorizeRole('Admin', 'Billing', 'Receptionist'), (req, res) => {
  try {
    const billing = billingRecords.find(b => b.id === req.params.id);

    if (!billing) {
      return res.status(404).json({ error: 'Billing record not found' });
    }

    billing.addPayment(req.body);

    // Check if fully paid
    if (billing.balance <= 0) {
      billing.markPaid();
    }

    res.json({
      message: 'Payment added successfully',
      billing
    });
  } catch (error) {
    console.error('Error adding payment:', error);
    res.status(500).json({ error: 'Error adding payment' });
  }
});

// Add adjustment
router.post('/:id/adjustment', authenticateToken, authorizeRole('Admin', 'Billing'), (req, res) => {
  try {
    const billing = billingRecords.find(b => b.id === req.params.id);

    if (!billing) {
      return res.status(404).json({ error: 'Billing record not found' });
    }

    billing.addAdjustment(req.body);

    res.json({
      message: 'Adjustment added successfully',
      billing
    });
  } catch (error) {
    console.error('Error adding adjustment:', error);
    res.status(500).json({ error: 'Error adding adjustment' });
  }
});

// Submit claim
router.post('/:id/submit', authenticateToken, authorizeRole('Admin', 'Billing'), (req, res) => {
  try {
    const billing = billingRecords.find(b => b.id === req.params.id);

    if (!billing) {
      return res.status(404).json({ error: 'Billing record not found' });
    }

    const success = billing.submitClaim();

    if (!success) {
      return res.status(400).json({ error: 'Claim not ready for submission' });
    }

    // In production, this would send to clearinghouse
    res.json({
      message: 'Claim submitted successfully',
      billing,
      clearinghouseResponse: {
        status: 'Accepted',
        transactionId: `TXN-${Date.now()}`,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error submitting claim:', error);
    res.status(500).json({ error: 'Error submitting claim' });
  }
});

// Submit Colorado Medicaid claim
router.post('/:id/submit-medicaid', authenticateToken, authorizeRole('Admin', 'Billing'), (req, res) => {
  try {
    const billing = billingRecords.find(b => b.id === req.params.id);

    if (!billing) {
      return res.status(404).json({ error: 'Billing record not found' });
    }

    if (!billing.medicaidClaim.applicable) {
      return res.status(400).json({ error: 'Not a Medicaid claim' });
    }

    billing.medicaidClaim.submissionDate = new Date().toISOString();
    billing.medicaidClaim.mmisClaimId = `MMIS-${Date.now()}`;
    billing.submitClaim();

    // In production, submit to Colorado MMIS
    res.json({
      message: 'Medicaid claim submitted successfully',
      billing,
      mmisResponse: {
        status: 'Accepted',
        claimId: billing.medicaidClaim.mmisClaimId,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error submitting Medicaid claim:', error);
    res.status(500).json({ error: 'Error submitting Medicaid claim' });
  }
});

// Mark claim as denied
router.post('/:id/deny', authenticateToken, authorizeRole('Admin', 'Billing'), (req, res) => {
  try {
    const billing = billingRecords.find(b => b.id === req.params.id);

    if (!billing) {
      return res.status(404).json({ error: 'Billing record not found' });
    }

    const { reason, code } = req.body;
    billing.markDenied(reason, code);

    res.json({
      message: 'Claim marked as denied',
      billing
    });
  } catch (error) {
    console.error('Error marking claim as denied:', error);
    res.status(500).json({ error: 'Error marking claim as denied' });
  }
});

// Get billing summary/dashboard
router.get('/dashboard/summary', authenticateToken, authorizeRole('Admin', 'Billing'), (req, res) => {
  try {
    const today = new Date();
    const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

    const recentRecords = billingRecords.filter(b =>
      new Date(b.serviceDate) >= thirtyDaysAgo
    );

    const summary = {
      totalClaims: billingRecords.length,
      recentClaims: recentRecords.length,
      claimsByStatus: {
        draft: billingRecords.filter(b => b.claimStatus === 'Draft').length,
        ready: billingRecords.filter(b => b.claimStatus === 'Ready').length,
        submitted: billingRecords.filter(b => b.claimStatus === 'Submitted').length,
        paid: billingRecords.filter(b => b.claimStatus === 'Paid').length,
        denied: billingRecords.filter(b => b.claimStatus === 'Denied').length
      },
      financials: {
        totalCharges: billingRecords.reduce((sum, b) => sum + b.totalCharges, 0),
        totalPaid: billingRecords.reduce((sum, b) => sum + b.totalPaid, 0),
        totalBalance: billingRecords.reduce((sum, b) => sum + b.balance, 0),
        patientBalance: billingRecords.reduce((sum, b) => sum + b.patientBalance, 0)
      },
      medicaidClaims: {
        total: billingRecords.filter(b => b.medicaidClaim.applicable).length,
        submitted: billingRecords.filter(b => b.medicaidClaim.applicable && b.medicaidClaim.submissionDate).length
      }
    };

    res.json(summary);
  } catch (error) {
    console.error('Error generating billing summary:', error);
    res.status(500).json({ error: 'Error generating billing summary' });
  }
});

// Common CPT codes reference
router.get('/reference/cpt-codes', authenticateToken, (req, res) => {
  const commonCPTCodes = [
    { code: '99201', description: 'Office visit, new patient, straightforward', fee: 75 },
    { code: '99202', description: 'Office visit, new patient, low complexity', fee: 110 },
    { code: '99203', description: 'Office visit, new patient, moderate complexity', fee: 145 },
    { code: '99204', description: 'Office visit, new patient, moderate to high complexity', fee: 210 },
    { code: '99205', description: 'Office visit, new patient, high complexity', fee: 280 },
    { code: '99211', description: 'Office visit, established patient, minimal', fee: 45 },
    { code: '99212', description: 'Office visit, established patient, straightforward', fee: 75 },
    { code: '99213', description: 'Office visit, established patient, low complexity', fee: 110 },
    { code: '99214', description: 'Office visit, established patient, moderate complexity', fee: 165 },
    { code: '99215', description: 'Office visit, established patient, high complexity', fee: 220 },
    { code: '99381', description: 'Preventive care, new patient, under 1 year', fee: 170 },
    { code: '99385', description: 'Preventive care, new patient, 18-39 years', fee: 200 },
    { code: '99391', description: 'Preventive care, established patient, under 1 year', fee: 150 },
    { code: '99395', description: 'Preventive care, established patient, 18-39 years', fee: 180 }
  ];

  res.json(commonCPTCodes);
});

module.exports = router;
