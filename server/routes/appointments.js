const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const { authenticateToken, authorizeRole } = require('./auth');

// In-memory storage
const appointments = [];

/**
 * Appointment Scheduling Routes
 */

// Get all appointments
router.get('/', authenticateToken, (req, res) => {
  try {
    const { patientId, providerId, date, status } = req.query;

    let filtered = [...appointments];

    if (patientId) {
      filtered = filtered.filter(a => a.patientId === patientId);
    }

    if (providerId) {
      filtered = filtered.filter(a => a.providerId === providerId);
    }

    if (date) {
      filtered = filtered.filter(a => a.appointmentDate === date);
    }

    if (status) {
      filtered = filtered.filter(a => a.status === status);
    }

    // Sort by date and time
    filtered.sort((a, b) => {
      const dateA = new Date(`${a.appointmentDate}T${a.appointmentTime}`);
      const dateB = new Date(`${b.appointmentDate}T${b.appointmentTime}`);
      return dateA - dateB;
    });

    res.json({
      total: filtered.length,
      appointments: filtered
    });
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({ error: 'Error fetching appointments' });
  }
});

// Get appointment by ID
router.get('/:id', authenticateToken, (req, res) => {
  try {
    const appointment = appointments.find(a => a.id === req.params.id);

    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    res.json(appointment);
  } catch (error) {
    console.error('Error fetching appointment:', error);
    res.status(500).json({ error: 'Error fetching appointment' });
  }
});

// Create new appointment
router.post('/', authenticateToken, authorizeRole('Admin', 'Doctor', 'Nurse', 'Receptionist'), (req, res) => {
  try {
    const appointmentData = {
      ...req.body,
      createdBy: req.user.id
    };

    const appointment = new Appointment(appointmentData);
    appointments.push(appointment);

    res.status(201).json({
      message: 'Appointment created successfully',
      appointment
    });
  } catch (error) {
    console.error('Error creating appointment:', error);
    res.status(500).json({ error: 'Error creating appointment' });
  }
});

// Update appointment
router.put('/:id', authenticateToken, authorizeRole('Admin', 'Doctor', 'Nurse', 'Receptionist'), (req, res) => {
  try {
    const index = appointments.findIndex(a => a.id === req.params.id);

    if (index === -1) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    const updatedData = {
      ...appointments[index],
      ...req.body,
      id: appointments[index].id,
      updatedAt: new Date().toISOString()
    };

    appointments[index] = new Appointment(updatedData);

    res.json({
      message: 'Appointment updated successfully',
      appointment: appointments[index]
    });
  } catch (error) {
    console.error('Error updating appointment:', error);
    res.status(500).json({ error: 'Error updating appointment' });
  }
});

// Check-in patient
router.post('/:id/check-in', authenticateToken, authorizeRole('Admin', 'Receptionist', 'Nurse'), (req, res) => {
  try {
    const appointment = appointments.find(a => a.id === req.params.id);

    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    appointment.checkIn();

    res.json({
      message: 'Patient checked in successfully',
      appointment
    });
  } catch (error) {
    console.error('Error checking in patient:', error);
    res.status(500).json({ error: 'Error checking in patient' });
  }
});

// Start appointment
router.post('/:id/start', authenticateToken, authorizeRole('Admin', 'Doctor', 'Nurse'), (req, res) => {
  try {
    const appointment = appointments.find(a => a.id === req.params.id);

    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    appointment.start();

    res.json({
      message: 'Appointment started',
      appointment
    });
  } catch (error) {
    console.error('Error starting appointment:', error);
    res.status(500).json({ error: 'Error starting appointment' });
  }
});

// Complete appointment
router.post('/:id/complete', authenticateToken, authorizeRole('Admin', 'Doctor', 'Nurse'), (req, res) => {
  try {
    const appointment = appointments.find(a => a.id === req.params.id);

    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    appointment.complete();

    res.json({
      message: 'Appointment completed',
      appointment
    });
  } catch (error) {
    console.error('Error completing appointment:', error);
    res.status(500).json({ error: 'Error completing appointment' });
  }
});

// Cancel appointment
router.post('/:id/cancel', authenticateToken, (req, res) => {
  try {
    const appointment = appointments.find(a => a.id === req.params.id);

    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    const { reason } = req.body;
    appointment.cancel(reason || 'No reason provided', req.user.id);

    res.json({
      message: 'Appointment cancelled',
      appointment
    });
  } catch (error) {
    console.error('Error cancelling appointment:', error);
    res.status(500).json({ error: 'Error cancelling appointment' });
  }
});

// Mark as no-show
router.post('/:id/no-show', authenticateToken, authorizeRole('Admin', 'Receptionist', 'Doctor', 'Nurse'), (req, res) => {
  try {
    const appointment = appointments.find(a => a.id === req.params.id);

    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    appointment.noShow();

    res.json({
      message: 'Appointment marked as no-show',
      appointment
    });
  } catch (error) {
    console.error('Error marking no-show:', error);
    res.status(500).json({ error: 'Error marking no-show' });
  }
});

// Get available time slots for a provider
router.get('/availability/:providerId', authenticateToken, (req, res) => {
  try {
    const { providerId } = req.params;
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ error: 'Date is required' });
    }

    // Get all appointments for this provider on this date
    const providerAppointments = appointments.filter(a =>
      a.providerId === providerId &&
      a.appointmentDate === date &&
      a.status !== 'Cancelled'
    );

    // Generate time slots (9 AM to 5 PM, 30-minute intervals)
    const slots = [];
    for (let hour = 9; hour < 17; hour++) {
      for (let minute of [0, 30]) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        const isBooked = providerAppointments.some(a => a.appointmentTime === time);

        slots.push({
          time,
          available: !isBooked
        });
      }
    }

    res.json({
      providerId,
      date,
      slots
    });
  } catch (error) {
    console.error('Error fetching availability:', error);
    res.status(500).json({ error: 'Error fetching availability' });
  }
});

module.exports = router;
