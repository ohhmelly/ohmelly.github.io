const express = require('express');
const router = express.Router();
const Patient = require('../models/Patient');
const { authenticateToken, authorizeRole } = require('./auth');

// In-memory storage (replace with database in production)
const patients = [];

/**
 * Patient Management Routes
 * HIPAA Compliant - All routes require authentication
 */

// Get all patients (paginated)
router.get('/', authenticateToken, (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const search = req.query.search || '';
    const status = req.query.status || 'Active';

    let filtered = patients.filter(p => p.status === status);

    // Search by name, MRN, or phone
    if (search) {
      filtered = filtered.filter(p =>
        p.firstName.toLowerCase().includes(search.toLowerCase()) ||
        p.lastName.toLowerCase().includes(search.toLowerCase()) ||
        p.mrn.includes(search) ||
        p.phone.includes(search)
      );
    }

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedPatients = filtered.slice(startIndex, endIndex);

    res.json({
      total: filtered.length,
      page,
      limit,
      totalPages: Math.ceil(filtered.length / limit),
      patients: paginatedPatients
    });
  } catch (error) {
    console.error('Error fetching patients:', error);
    res.status(500).json({ error: 'Error fetching patients' });
  }
});

// Get single patient by ID
router.get('/:id', authenticateToken, (req, res) => {
  try {
    const patient = patients.find(p => p.id === req.params.id);

    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    res.json(patient);
  } catch (error) {
    console.error('Error fetching patient:', error);
    res.status(500).json({ error: 'Error fetching patient' });
  }
});

// Search patients by MRN
router.get('/mrn/:mrn', authenticateToken, (req, res) => {
  try {
    const patient = patients.find(p => p.mrn === req.params.mrn);

    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    res.json(patient);
  } catch (error) {
    console.error('Error fetching patient:', error);
    res.status(500).json({ error: 'Error fetching patient' });
  }
});

// Create new patient
router.post('/', authenticateToken, authorizeRole('Admin', 'Doctor', 'Nurse', 'Receptionist'), (req, res) => {
  try {
    const patientData = {
      ...req.body,
      createdBy: req.user.id
    };

    const patient = new Patient(patientData);
    patients.push(patient);

    res.status(201).json({
      message: 'Patient created successfully',
      patient
    });
  } catch (error) {
    console.error('Error creating patient:', error);
    res.status(500).json({ error: 'Error creating patient' });
  }
});

// Update patient
router.put('/:id', authenticateToken, authorizeRole('Admin', 'Doctor', 'Nurse', 'Receptionist'), (req, res) => {
  try {
    const index = patients.findIndex(p => p.id === req.params.id);

    if (index === -1) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    const updatedData = {
      ...patients[index],
      ...req.body,
      id: patients[index].id, // Preserve ID
      mrn: patients[index].mrn, // Preserve MRN
      lastModifiedBy: req.user.id,
      updatedAt: new Date().toISOString()
    };

    patients[index] = new Patient(updatedData);

    res.json({
      message: 'Patient updated successfully',
      patient: patients[index]
    });
  } catch (error) {
    console.error('Error updating patient:', error);
    res.status(500).json({ error: 'Error updating patient' });
  }
});

// Deactivate patient (soft delete)
router.patch('/:id/deactivate', authenticateToken, authorizeRole('Admin', 'Doctor'), (req, res) => {
  try {
    const patient = patients.find(p => p.id === req.params.id);

    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    patient.status = 'Inactive';
    patient.lastModifiedBy = req.user.id;
    patient.updatedAt = new Date().toISOString();

    res.json({
      message: 'Patient deactivated successfully',
      patient
    });
  } catch (error) {
    console.error('Error deactivating patient:', error);
    res.status(500).json({ error: 'Error deactivating patient' });
  }
});

// Get patient demographics summary
router.get('/:id/demographics', authenticateToken, (req, res) => {
  try {
    const patient = patients.find(p => p.id === req.params.id);

    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    const demographics = {
      id: patient.id,
      mrn: patient.mrn,
      name: patient.getFullName(),
      dateOfBirth: patient.dateOfBirth,
      age: patient.getAge(),
      gender: patient.gender,
      address: patient.address,
      phone: patient.phone,
      email: patient.email,
      insurance: patient.insurance,
      primaryCareProvider: patient.primaryCareProvider
    };

    res.json(demographics);
  } catch (error) {
    console.error('Error fetching demographics:', error);
    res.status(500).json({ error: 'Error fetching demographics' });
  }
});

// Check Colorado Medicaid eligibility
router.post('/:id/check-medicaid', authenticateToken, authorizeRole('Admin', 'Billing', 'Receptionist'), (req, res) => {
  try {
    const patient = patients.find(p => p.id === req.params.id);

    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    // Simulate Medicaid eligibility check
    // In production, this would call Colorado's Medicaid API
    const eligibilityResponse = {
      eligible: patient.insurance.medicaid.eligible,
      medicaidId: patient.insurance.medicaid.id,
      programType: patient.insurance.medicaid.programType,
      effectiveDate: new Date().toISOString(),
      verifiedAt: new Date().toISOString(),
      status: 'Active'
    };

    res.json(eligibilityResponse);
  } catch (error) {
    console.error('Error checking Medicaid eligibility:', error);
    res.status(500).json({ error: 'Error checking Medicaid eligibility' });
  }
});

module.exports = router;
