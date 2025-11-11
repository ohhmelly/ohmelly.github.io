const express = require('express');
const router = express.Router();
const { authenticateToken, authorizeRole } = require('./auth');

/**
 * Reporting Routes - Colorado State Compliance
 * Handles state-required reporting including immunizations, PDMP, public health
 */

// Colorado Immunization Registry reporting
router.post('/immunization-registry', authenticateToken, authorizeRole('Admin', 'Doctor', 'Nurse'), (req, res) => {
  try {
    const { patientId, vaccines, providerId } = req.body;

    // In production, submit to Colorado Immunization Information System (CIIS)
    const report = {
      reportId: `CIIS-${Date.now()}`,
      patientId,
      vaccines,
      providerId,
      reportedAt: new Date().toISOString(),
      status: 'Submitted',
      registry: 'Colorado Immunization Information System (CIIS)'
    };

    res.json({
      message: 'Immunization data reported to CIIS successfully',
      report
    });
  } catch (error) {
    console.error('Error reporting to immunization registry:', error);
    res.status(500).json({ error: 'Error reporting to immunization registry' });
  }
});

// Colorado PDMP (Prescription Drug Monitoring Program) reporting
router.post('/pdmp', authenticateToken, authorizeRole('Admin', 'Doctor'), (req, res) => {
  try {
    const { patientId, prescriptions, providerId } = req.body;

    // In production, submit to Colorado PDMP
    const report = {
      reportId: `PDMP-${Date.now()}`,
      patientId,
      prescriptions: prescriptions.filter(p => p.controlledSubstance),
      providerId,
      reportedAt: new Date().toISOString(),
      status: 'Submitted',
      program: 'Colorado Prescription Drug Monitoring Program'
    };

    res.json({
      message: 'Controlled substance prescriptions reported to PDMP successfully',
      report
    });
  } catch (error) {
    console.error('Error reporting to PDMP:', error);
    res.status(500).json({ error: 'Error reporting to PDMP' });
  }
});

// Quality metrics reporting
router.get('/quality-metrics', authenticateToken, authorizeRole('Admin'), (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    // Sample quality metrics (HEDIS, PQRS, etc.)
    const metrics = {
      period: {
        start: startDate,
        end: endDate
      },
      patientSafety: {
        medicationReconciliation: 95.5,
        fallRiskAssessment: 89.2,
        allergyDocumentation: 98.7
      },
      preventiveCare: {
        diabeticFootExams: 87.3,
        colonoscopyScreening: 72.1,
        mammography: 81.5,
        immunizationRates: 93.2
      },
      chronicCareManagement: {
        diabetesHbA1cControl: 78.4,
        hypertensionControl: 82.6,
        asthmaControl: 85.1
      },
      patientExperience: {
        satisfactionScore: 4.6,
        waitTimeCompliance: 88.3,
        appointmentAvailability: 91.7
      },
      generatedAt: new Date().toISOString()
    };

    res.json(metrics);
  } catch (error) {
    console.error('Error generating quality metrics:', error);
    res.status(500).json({ error: 'Error generating quality metrics' });
  }
});

// Financial report
router.get('/financial', authenticateToken, authorizeRole('Admin', 'Billing'), (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const report = {
      period: {
        start: startDate,
        end: endDate
      },
      revenue: {
        totalCharges: 1250000,
        collections: 1050000,
        adjustments: 125000,
        outstanding: 75000
      },
      byPayerType: {
        medicare: { charges: 450000, collections: 385000 },
        medicaid: { charges: 350000, collections: 315000 },
        privateInsurance: { charges: 350000, collections: 280000 },
        selfPay: { charges: 100000, collections: 70000 }
      },
      denials: {
        count: 45,
        amount: 35000,
        topReasons: [
          { reason: 'Prior authorization required', count: 15 },
          { reason: 'Medical necessity', count: 12 },
          { reason: 'Incorrect coding', count: 10 }
        ]
      },
      generatedAt: new Date().toISOString()
    };

    res.json(report);
  } catch (error) {
    console.error('Error generating financial report:', error);
    res.status(500).json({ error: 'Error generating financial report' });
  }
});

// Patient demographics report
router.get('/demographics', authenticateToken, authorizeRole('Admin'), (req, res) => {
  try {
    const demographics = {
      totalPatients: 15420,
      byAge: {
        '0-17': 2850,
        '18-39': 4230,
        '40-64': 5340,
        '65+': 3000
      },
      byGender: {
        male: 7100,
        female: 8150,
        other: 170
      },
      byInsurance: {
        medicaid: 4620,
        medicare: 3200,
        privateInsurance: 6100,
        uninsured: 1500
      },
      byCounty: {
        denver: 4500,
        elpaso: 3200,
        arapahoe: 2800,
        jefferson: 2400,
        other: 2520
      },
      generatedAt: new Date().toISOString()
    };

    res.json(demographics);
  } catch (error) {
    console.error('Error generating demographics report:', error);
    res.status(500).json({ error: 'Error generating demographics report' });
  }
});

// Provider productivity report
router.get('/provider-productivity', authenticateToken, authorizeRole('Admin'), (req, res) => {
  try {
    const { providerId, startDate, endDate } = req.query;

    const productivity = {
      providerId,
      period: {
        start: startDate,
        end: endDate
      },
      appointments: {
        scheduled: 250,
        completed: 225,
        cancelled: 15,
        noShows: 10
      },
      encounters: {
        total: 225,
        byType: {
          newPatient: 45,
          followUp: 150,
          preventive: 30
        }
      },
      billing: {
        totalCharges: 45000,
        averageChargePerVisit: 200,
        collectionRate: 87.5
      },
      patientSatisfaction: 4.7,
      generatedAt: new Date().toISOString()
    };

    res.json(productivity);
  } catch (error) {
    console.error('Error generating productivity report:', error);
    res.status(500).json({ error: 'Error generating productivity report' });
  }
});

module.exports = router;
