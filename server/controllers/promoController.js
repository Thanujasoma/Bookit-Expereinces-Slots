const Promo = require('../models/Promo');

/**
 * POST /api/promo/validate
 * Body: { code, subtotal }
 * Public endpoint - validates promo code and returns discount amount
 */
exports.validatePromo = async (req, res) => {
  try {
    const { code, subtotal } = req.body;
    if (!code) return res.status(400).json({ valid: false, message: 'No code provided' });

    const codeU = code.toString().toUpperCase();
    const promo = await Promo.findOne({ code: codeU });
    if (!promo) return res.status(404).json({ valid: false, message: 'Invalid code' });

    if (promo.expiresAt && promo.expiresAt < new Date()) {
      return res.status(400).json({ valid: false, message: 'Code expired' });
    }

    let discount = 0;
    if (promo.type === 'percent') {
      discount = ((promo.amount || 0) / 100) * (subtotal || 0);
    } else {
      discount = promo.amount;
    }

    res.json({ valid: true, code: promo.code, discount: Math.min(discount, subtotal || 0) });
  } catch (err) {
    console.error('Promo validation failed', err);
    res.status(500).json({ valid: false, message: 'Validation failed' });
  }
};

/**
 * POST /api/promo
 * Body: { code, type, amount, expiresAt? }
 * Admin-only: create a new promo code
 */
exports.createPromo = async (req, res) => {
  try {
    const { code, type, amount, expiresAt } = req.body;

    if (!code || !type || (amount === undefined || amount === null)) {
      return res.status(400).json({ error: 'Missing required fields: code, type, amount' });
    }

    const typeLower = type.toString().toLowerCase();
    if (!['percent', 'flat'].includes(typeLower)) {
      return res.status(400).json({ error: 'type must be "percent" or "flat"' });
    }

    const codeU = code.toString().toUpperCase();

    // prevent duplicate codes
    const exists = await Promo.findOne({ code: codeU });
    if (exists) {
      return res.status(400).json({ error: 'Promo code already exists' });
    }

    const promoData = {
      code: codeU,
      type: typeLower,
      amount: Number(amount)
    };

    if (expiresAt) {
      const d = new Date(expiresAt);
      if (isNaN(d.getTime())) {
        return res.status(400).json({ error: 'Invalid expiresAt date' });
      }
      promoData.expiresAt = d;
    }

    const promo = await Promo.create(promoData);
    res.status(201).json(promo);
  } catch (err) {
    console.error('Create promo failed', err);
    res.status(500).json({ error: 'Failed to create promo', details: err.message });
  }
};

/**
 * GET /api/promo
 * Admin-only: list all promo codes
 */
exports.listPromos = async (req, res) => {
  try {
    const promos = await Promo.find().sort({ code: 1 });
    res.json({ promos });
  } catch (err) {
    console.error('List promos failed', err);
    res.status(500).json({ error: 'Failed to fetch promos' });
  }
};

/**
 * DELETE /api/promo/:id
 * Admin-only: delete a promo code by id
 */
exports.deletePromo = async (req, res) => {
  try {
    const id = req.params.id;
    const promo = await Promo.findById(id);
    if (!promo) return res.status(404).json({ error: 'Promo not found' });

    await Promo.deleteOne({ _id: id });
    res.json({ success: true, message: 'Promo deleted' });
  } catch (err) {
    console.error('Delete promo failed', err);
    res.status(500).json({ error: 'Failed to delete promo' });
  }
};