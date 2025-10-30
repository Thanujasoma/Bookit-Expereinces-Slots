const mongoose = require('mongoose');
const Experience = require('../models/Experience');
const Booking = require('../models/Booking');

exports.createBooking = async (req, res) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ error: 'Authentication required' });

    const { experienceId, slotId, name, email, phone, quantity, totalPrice, promoCode } = req.body;

    if (!experienceId || !slotId || !name || !email || !quantity || !totalPrice) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (!mongoose.Types.ObjectId.isValid(experienceId) || !mongoose.Types.ObjectId.isValid(slotId)) {
      return res.status(400).json({ error: 'Invalid IDs' });
    }

    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const exp = await Experience.findById(experienceId).session(session);
      if (!exp) {
        await session.abortTransaction();
        session.endSession();
        return res.status(404).json({ error: 'Experience not found' });
      }

      const slot = exp.slots.id(slotId);
      if (!slot) {
        await session.abortTransaction();
        session.endSession();
        return res.status(404).json({ error: 'Slot not found' });
      }

      if (slot.availableSeats < quantity) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({ error: 'Not enough seats available' });
      }

      // decrement seats atomically in the session
      slot.availableSeats -= quantity;
      await exp.save({ session });

      const booking = new Booking({
        experienceId,
        slotId,
        userId: user.id, // associate booking to authenticated user
        name,
        email,
        phone,
        quantity,
        totalPrice,
        promoCode
      });

      await booking.save({ session });

      await session.commitTransaction();
      session.endSession();

      res.status(201).json({ success: true, bookingId: booking._id, booking });
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      console.error(err);
      res.status(500).json({ error: 'Booking failed', details: err.message });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Booking failed' });
  }
};

exports.getMyBookings = async (req, res) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ error: 'Authentication required' });

    const bookings = await Booking.find({ userId: user.id }).populate('experienceId');
    res.json({ bookings });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
};

exports.getAllBookings = async (req, res) => {
  try {
    // caller must be admin (route protected)
    const bookings = await Booking.find().populate('experienceId userId');
    res.json({ bookings });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch all bookings' });
  }
};