
const express = require('express');
const router = express.Router();
const { Route } = require('../models');

// GET: View all routes
router.get('/', async (req, res) => {
  try {
    const routes = await Route.findAll();
    res.json(routes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET: View one route
router.get('/:id', async (req, res) => {
  try {
    const route = await Route.findByPk(req.params.id);

    if (!route) {
      return res.status(404).json({ message: 'Route not found' });
    }

    res.json(route);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST: Add a route
router.post('/', async (req, res) => {
  try {
    const { fromCity, toCity } = req.body;

    if (
      typeof fromCity !== 'string' ||
      !fromCity.trim() ||
      typeof toCity !== 'string' ||
      !toCity.trim()
    ) {
      return res.status(400).json({
        message: 'Departure and destination cities are required'
      });
    }

    if (fromCity.trim().toLowerCase() === toCity.trim().toLowerCase()) {
      return res.status(400).json({
        message: 'Departure and destination must be different'
      });
    }

    const route = await Route.create({
      fromCity: fromCity.trim(),
      toCity: toCity.trim()
    });

    res.status(201).json(route);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT: Update a route
router.put('/:id', async (req, res) => {
  try {
    const route = await Route.findByPk(req.params.id);

    if (!route) {
      return res.status(404).json({ message: 'Route not found' });
    }

    const { fromCity, toCity } = req.body;

    const newFromCity = fromCity === undefined
      ? route.fromCity
      : fromCity;

    const newToCity = toCity === undefined
      ? route.toCity
      : toCity;

    if (
      typeof newFromCity !== 'string' ||
      !newFromCity.trim() ||
      typeof newToCity !== 'string' ||
      !newToCity.trim()
    ) {
      return res.status(400).json({
        message: 'Departure and destination cities are required'
      });
    }

    if (
      newFromCity.trim().toLowerCase() ===
      newToCity.trim().toLowerCase()
    ) {
      return res.status(400).json({
        message: 'Departure and destination must be different'
      });
    }

    route.fromCity = newFromCity.trim();
    route.toCity = newToCity.trim();

    await route.save();

    res.json({
      message: 'Route updated successfully',
      route
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE: Delete a route
router.delete('/:id', async (req, res) => {
  try {
    const route = await Route.findByPk(req.params.id);

    if (!route) {
      return res.status(404).json({ message: 'Route not found' });
    }

    const busCount = await route.countBuses();

    if (busCount > 0) {
      return res.status(409).json({
        message: 'Cannot delete a route that has buses'
      });
    }

    await route.destroy();

    res.json({ message: 'Route deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
