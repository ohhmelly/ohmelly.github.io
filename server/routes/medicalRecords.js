const express = require('express');
const router = express.Router();
const MedicalRecord = require('../models/MedicalRecord');
const { authenticateToken, authorizeRole } = require('./auth');

// In-memory storage
const medicalRecords = [];

/**
 * Medical Records Routes
 * HIPAA Compliant - Strict access control
 */

// Get all records for a patient
router.get('/patient/:patientId', authenticateToken, authorizeRole('Admin', 'Doctor', 'Nurse'), (req, res) => {
  try {
    const records = medicalRecords.filter(r => r.patientId === req.params.patientId);

    // Sort by encounter date (newest first)
    records.sort((a, b) => new Date(b.encounterDate) - new Date(a.encounterDate));

    res.json({
      total: records.length,
      records
    });
  } catch (error) {
    console.error('Error fetching medical records:', error);
    res.status(500).json({ error: 'Error fetching medical records' });
  }
});

// Get single medical record
router.get('/:id', authenticateToken, authorizeRole('Admin', 'Doctor', 'Nurse'), (req, res) => {
  try {
    const record = medicalRecords.find(r => r.id === req.params.id);

    if (!record) {
      return res.status(404).json({ error: 'Medical record not found' });
    }

    res.json(record);
  } catch (error) {
    console.error('Error fetching medical record:', error);
    res.status(500).json({ error: 'Error fetching medical record' });
  }
});

// Create new medical record
router.post('/', authenticateToken, authorizeRole('Admin', 'Doctor', 'Nurse'), (req, res) => {
  try {
    const recordData = {
      ...req.body,
      createdBy: req.user.id
    };

    const record = new MedicalRecord(recordData);

    // Auto-calculate BMI if vitals provided
    record.calculateBMI();

    medicalRecords.push(record);

    res.status(201).json({
      message: 'Medical record created successfully',
      record
    });
  } catch (error) {
    console.error('Error creating medical record:', error);
    res.status(500).json({ error: 'Error creating medical record' });
  }
});

// Update medical record
router.put('/:id', authenticateToken, authorizeRole('Admin', 'Doctor', 'Nurse'), (req, res) => {
  try {
    const index = medicalRecords.findIndex(r => r.id === req.params.id);

    if (index === -1) {
      return res.status(404).json({ error: 'Medical record not found' });
    }

    // Only allow updates to unsigned records
    if (medicalRecords[index].status === 'Signed' || medicalRecords[index].status === 'Final') {
      return res.status(403).json({ error: 'Cannot modify signed or finalized records. Create an amendment instead.' });
    }

    const updatedData = {
      ...medicalRecords[index],
      ...req.body,
      id: medicalRecords[index].id,
      encounterId: medicalRecords[index].encounterId,
      updatedAt: new Date().toISOString()
    };

    medicalRecords[index] = new MedicalRecord(updatedData);
    medicalRecords[index].calculateBMI();

    res.json({
      message: 'Medical record updated successfully',
      record: medicalRecords[index]
    });
  } catch (error) {
    console.error('Error updating medical record:', error);
    res.status(500).json({ error: 'Error updating medical record' });
  }
});

// Sign medical record
router.post('/:id/sign', authenticateToken, authorizeRole('Doctor'), (req, res) => {
  try {
    const record = medicalRecords.find(r => r.id === req.params.id);

    if (!record) {
      return res.status(404).json({ error: 'Medical record not found' });
    }

    if (record.status === 'Signed' || record.status === 'Final') {
      return res.status(400).json({ error: 'Record is already signed' });
    }

    record.sign(req.user.id);

    res.json({
      message: 'Medical record signed successfully',
      record
    });
  } catch (error) {
    console.error('Error signing medical record:', error);
    res.status(500).json({ error: 'Error signing medical record' });
  }
});

// Finalize medical record
router.post('/:id/finalize', authenticateToken, authorizeRole('Doctor'), (req, res) => {
  try {
    const record = medicalRecords.find(r => r.id === req.params.id);

    if (!record) {
      return res.status(404).json({ error: 'Medical record not found' });
    }

    record.finalize();

    res.json({
      message: 'Medical record finalized successfully',
      record
    });
  } catch (error) {
    console.error('Error finalizing medical record:', error);
    res.status(500).json({ error: 'Error finalizing medical record' });
  }
});

// Add prescription
router.post('/:id/prescriptions', authenticateToken, authorizeRole('Doctor'), (req, res) => {
  try {
    const record = medicalRecords.find(r => r.id === req.params.id);

    if (!record) {
      return res.status(404).json({ error: 'Medical record not found' });
    }

    const prescription = {
      id: `RX-${Date.now()}`,
      medication: req.body.medication,
      dosage: req.body.dosage,
      frequency: req.body.frequency,
      duration: req.body.duration,
      refills: req.body.refills || 0,
      notes: req.body.notes || '',
      prescribedBy: req.user.id,
      prescribedDate: new Date().toISOString()
    };

    record.prescriptions.push(prescription);
    record.updatedAt = new Date().toISOString();

    // If controlled substance, mark for PDMP reporting
    if (req.body.controlledSubstance) {
      record.reportedToPDMP = false; // Will be reported in batch process
    }

    res.json({
      message: 'Prescription added successfully',
      prescription,
      record
    });
  } catch (error) {
    console.error('Error adding prescription:', error);
    res.status(500).json({ error: 'Error adding prescription' });
  }
});

// Get patient history summary
router.get('/patient/:patientId/summary', authenticateToken, authorizeRole('Admin', 'Doctor', 'Nurse'), (req, res) => {
  try {
    const records = medicalRecords.filter(r =>
      r.patientId === req.params.patientId &&
      (r.status === 'Signed' || r.status === 'Final')
    );

    // Collect all diagnoses
    const allDiagnoses = [];
    records.forEach(r => {
      r.diagnoses.forEach(d => {
        if (!allDiagnoses.find(ad => ad.code === d.code)) {
          allDiagnoses.push(d);
        }
      });
    });

    // Collect all prescriptions
    const allPrescriptions = [];
    records.forEach(r => {
      r.prescriptions.forEach(p => allPrescriptions.push(p));
    });

    // Recent vital signs (from last visit)
    const lastVisit = records[0] || null;

    const summary = {
      patientId: req.params.patientId,
      totalEncounters: records.length,
      diagnoses: allDiagnoses,
      activePrescriptions: allPrescriptions.slice(0, 10), // Last 10
      lastVisit: lastVisit ? {
        date: lastVisit.encounterDate,
        provider: lastVisit.providerId,
        vitalSigns: lastVisit.vitalSigns
      } : null
    };

    res.json(summary);
  } catch (error) {
    console.error('Error generating summary:', error);
    res.status(500).json({ error: 'Error generating summary' });
  }
});

module.exports = router;
