
const express = require('express');
const router = express.Router();

const { Bus, Route, Booking } = require('../models');

// GET: View and search buses
router.get('/', async (req, res) => {
  try {
    const { fromCity, toCity } = req.query;
    const routeFilter = {};

    if (fromCity) routeFilter.fromCity = fromCity;
    if (toCity) routeFilter.toCity = toCity;

    const buses = await Bus.findAll({
      include: [{
  model: Route,
  as: 'Route',
  where: routeFilter
}],
      order: [['id', 'ASC']]
    });

    res.json(buses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET: View one bus
router.get('/:id', async (req, res) => {
  try {
    const bus = await Bus.findByPk(req.params.id, {
      include: [{
  model: Route,
  as: 'Route'
}]
    });

    if (!bus) {
      return res.status(404).json({ message: 'Bus not found' });
    }

    res.json(bus);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST: Add a bus
router.post('/', async (req, res) => {
  try {
    const { busName, price, routeId } = req.body;

    if (typeof busName !== 'string' || !busName.trim()) {
      return res.status(400).json({
        message: 'Bus name is required'
      });
    }

    if (
      price === undefined ||
      price === null ||
      price === '' ||
      !Number.isFinite(Number(price)) ||
      Number(price) <= 0
    ) {
      return res.status(400).json({
        message: 'Price must be greater than zero'
      });
    }

    if (
      routeId === undefined ||
      !Number.isInteger(Number(routeId)) ||
      Number(routeId) < 1
    ) {
      return res.status(400).json({
        message: 'A valid route ID is required'
      });
    }

    const route = await Route.findByPk(Number(routeId));

    if (!route) {
      return res.status(404).json({ message: 'Route not found' });
    }

    const bus = await Bus.create({
      busName: busName.trim(),
      price: Number(price),
      routeId: Number(routeId)
    });

    res.status(201).json({
      message: 'Bus added successfully',
      bus
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT: Update a bus
router.put('/:id', async (req, res) => {
  try {
    const bus = await Bus.findByPk(req.params.id);

    if (!bus) {
      return res.status(404).json({ message: 'Bus not found' });
    }

    const { busName, price, routeId } = req.body;

    if (busName !== undefined) {
      if (typeof busName !== 'string' || !busName.trim()) {
        return res.status(400).json({
          message: 'Bus name cannot be empty'
        });
      }
      bus.busName = busName.trim();
    }

    if (price !== undefined) {
      if (
        price === null ||
        price === '' ||
        !Number.isFinite(Number(price)) ||
        Number(price) <= 0
      ) {
        return res.status(400).json({
          message: 'Price must be greater than zero'
        });
      }
      bus.price = Number(price);
    }

    if (routeId !== undefined) {
      if (
        routeId === null ||
        routeId === '' ||
        !Number.isInteger(Number(routeId)) ||
        Number(routeId) < 1
      ) {
        return res.status(400).json({
          message: 'A valid route ID is required'
        });
      }

      const route = await Route.findByPk(Number(routeId));

      if (!route) {
        return res.status(404).json({ message: 'Route not found' });
      }

      bus.routeId = Number(routeId);
    }

    await bus.save();

    res.json({
      message: 'Bus updated successfully',
      bus
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE: Delete a bus
router.delete('/:id', async (req, res) => {
  try {
    const bus = await Bus.findByPk(req.params.id);

    if (!bus) {
      return res.status(404).json({ message: 'Bus not found' });
    }

    const bookingCount = await Booking.count({
      where: { busId: bus.id }
    });

    if (bookingCount > 0) {
      return res.status(409).json({
        message: 'Cannot delete a bus that has bookings'
      });
    }

    await bus.destroy();

    res.json({ message: 'Bus deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
