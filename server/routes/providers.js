const express = require('express');
const router = express.Router();
const Provider = require('../models/Provider');
const { authenticateToken, authorizeRole } = require('./auth');

// In-memory storage
const providers = [];

/**
 * Provider Management Routes
 */

// Get all providers
router.get('/', authenticateToken, (req, res) => {
  try {
    const status = req.query.status || 'Active';
    const specialty = req.query.specialty;

    let filtered = providers.filter(p => p.status === status);

    if (specialty) {
      filtered = filtered.filter(p => p.specialties.includes(specialty));
    }

    res.json({
      total: filtered.length,
      providers: filtered
    });
  } catch (error) {
    console.error('Error fetching providers:', error);
    res.status(500).json({ error: 'Error fetching providers' });
  }
});

// Get provider by ID
router.get('/:id', authenticateToken, (req, res) => {
  try {
    const provider = providers.find(p => p.id === req.params.id);

    if (!provider) {
      return res.status(404).json({ error: 'Provider not found' });
    }

    res.json(provider);
  } catch (error) {
    console.error('Error fetching provider:', error);
    res.status(500).json({ error: 'Error fetching provider' });
  }
});

// Get providers accepting new patients
router.get('/accepting/new-patients', authenticateToken, (req, res) => {
  try {
    const accepting = providers.filter(p =>
      p.status === 'Active' && p.acceptingNewPatients
    );

    res.json({
      total: accepting.length,
      providers: accepting
    });
  } catch (error) {
    console.error('Error fetching providers:', error);
    res.status(500).json({ error: 'Error fetching providers' });
  }
});

// Create new provider
router.post('/', authenticateToken, authorizeRole('Admin'), (req, res) => {
  try {
    const provider = new Provider(req.body);
    providers.push(provider);

    res.status(201).json({
      message: 'Provider created successfully',
      provider
    });
  } catch (error) {
    console.error('Error creating provider:', error);
    res.status(500).json({ error: 'Error creating provider' });
  }
});

// Update provider
router.put('/:id', authenticateToken, authorizeRole('Admin'), (req, res) => {
  try {
    const index = providers.findIndex(p => p.id === req.params.id);

    if (index === -1) {
      return res.status(404).json({ error: 'Provider not found' });
    }

    const updatedData = {
      ...providers[index],
      ...req.body,
      id: providers[index].id,
      updatedAt: new Date().toISOString()
    };

    providers[index] = new Provider(updatedData);

    res.json({
      message: 'Provider updated successfully',
      provider: providers[index]
    });
  } catch (error) {
    console.error('Error updating provider:', error);
    res.status(500).json({ error: 'Error updating provider' });
  }
});

// Get provider schedule
router.get('/:id/schedule', authenticateToken, (req, res) => {
  try {
    const provider = providers.find(p => p.id === req.params.id);

    if (!provider) {
      return res.status(404).json({ error: 'Provider not found' });
    }

    res.json({
      providerId: provider.id,
      providerName: provider.getFullName(),
      schedule: provider.schedule
    });
  } catch (error) {
    console.error('Error fetching schedule:', error);
    res.status(500).json({ error: 'Error fetching schedule' });
  }
});

module.exports = router;
