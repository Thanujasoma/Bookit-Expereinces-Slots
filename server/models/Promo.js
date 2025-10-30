const mongoose = require('mongoose');

const PromoSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  type: { type: String, enum: ['percent', 'flat'], required: true },
  amount: { type: Number, required: true },
  expiresAt: { type: Date }
});

module.exports = mongoose.model('Promo', PromoSchema);