const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  experienceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Experience', required: true },
  slotId: { type: mongoose.Schema.Types.ObjectId, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // new
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  quantity: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
  promoCode: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Booking', BookingSchema);