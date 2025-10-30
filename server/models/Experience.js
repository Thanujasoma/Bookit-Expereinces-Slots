const mongoose = require('mongoose');

const SlotSchema = new mongoose.Schema(
  {
    date: { type: String, required: true }, // YYYY-MM-DD
    time: { type: String, required: true }, // "09:00"
    price: { type: Number, required: true },
    availableSeats: { type: Number, required: true, default: 0 }
  },
  { _id: true }
);

const ExperienceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  location: { type: String, default: '' },
  images: [{ type: String }],
  durationMinutes: { type: Number, default: 120 },
  slots: [SlotSchema],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Experience', ExperienceSchema);