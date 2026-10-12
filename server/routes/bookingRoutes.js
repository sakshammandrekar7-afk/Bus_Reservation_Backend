
const express = require('express');
const router = express.Router();
const { Booking, Bus } = require('../models');

// GET: View all bookings
router.get('/', async (req, res) => {
  try {
    const bookings = await Booking.findAll();
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET: View one booking
router.get('/:id', async (req, res) => {
  try {
    const booking = await Booking.findByPk(req.params.id);

    if (!booking) {
      return res.status(404).json({
        message: 'Booking not found'
      });
    }

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST: Create booking
router.post('/', async (req, res) => {
  try {
    const { passengerName, seatNo, busId } = req.body;

    if (
      typeof passengerName !== 'string' ||
      !passengerName.trim()
    ) {
      return res.status(400).json({
        message: 'Passenger name is required'
      });
    }

    if (
      seatNo === undefined ||
      seatNo === null ||
      seatNo === '' ||
      !Number.isInteger(Number(seatNo)) ||
      Number(seatNo) < 1
    ) {
      return res.status(400).json({
        message: 'Seat number must be a positive integer'
      });
    }

    if (
      busId === undefined ||
      busId === null ||
      busId === '' ||
      !Number.isInteger(Number(busId)) ||
      Number(busId) < 1
    ) {
      return res.status(400).json({
        message: 'Valid bus ID is required'
      });
    }

    const bus = await Bus.findByPk(Number(busId));

    if (!bus) {
      return res.status(404).json({
        message: 'Bus not found'
      });
    }

    const existingBooking = await Booking.findOne({
      where: {
        busId: Number(busId),
        seatNo: Number(seatNo)
      }
    });

    if (existingBooking) {
      return res.status(409).json({
        message: 'This seat is already booked on this bus'
      });
    }

    const booking = await Booking.create({
      passengerName: passengerName.trim(),
      seatNo: Number(seatNo),
      busId: Number(busId)
    });

    res.status(201).json({
      message: 'Booking created successfully',
      booking
    });
  } catch (error) {
    if (
      error.name === 'SequelizeUniqueConstraintError'
    ) {
      return res.status(409).json({
        message: 'This seat is already booked on this bus'
      });
    }

    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        message: error.message
      });
    }

    res.status(500).json({
      message: 'Failed to create booking',
      error: error.message
    });
  }
});

// PUT: Update booking
router.put('/:id', async (req, res) => {
  try {
    const booking = await Booking.findByPk(req.params.id);

    if (!booking) {
      return res.status(404).json({
        message: 'Booking not found'
      });
    }

    const { passengerName, seatNo, busId } = req.body;

    if (passengerName !== undefined) {
      if (
        typeof passengerName !== 'string' ||
        !passengerName.trim()
      ) {
        return res.status(400).json({
          message: 'Passenger name cannot be empty'
        });
      }

      booking.passengerName = passengerName.trim();
    }

    if (seatNo !== undefined) {
      if (
        seatNo === null ||
        seatNo === '' ||
        !Number.isInteger(Number(seatNo)) ||
        Number(seatNo) < 1
      ) {
        return res.status(400).json({
          message: 'Invalid seat number'
        });
      }

      booking.seatNo = Number(seatNo);
    }

    if (busId !== undefined) {
      if (
        busId === null ||
        busId === '' ||
        !Number.isInteger(Number(busId)) ||
        Number(busId) < 1
      ) {
        return res.status(400).json({
          message: 'Invalid bus ID'
        });
      }

      const bus = await Bus.findByPk(Number(busId));

      if (!bus) {
        return res.status(404).json({
          message: 'Bus not found'
        });
      }

      booking.busId = Number(busId);
    }

    const duplicate = await Booking.findOne({
      where: {
        busId: booking.busId,
        seatNo: booking.seatNo
      }
    });

    if (duplicate && duplicate.id !== booking.id) {
      return res.status(409).json({
        message: 'This seat is already booked on this bus'
      });
    }

    await booking.save();

    res.json({
      message: 'Booking updated successfully',
      booking
    });
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({
        message: 'This seat is already booked on this bus'
      });
    }

    res.status(500).json({ message: error.message });
  }
});

// DELETE: Delete booking
router.delete('/:id', async (req, res) => {
  try {
    const booking = await Booking.findByPk(req.params.id);

    if (!booking) {
      return res.status(404).json({
        message: 'Booking not found'
      });
    }

    await booking.destroy();

    res.json({
      message: 'Booking deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
