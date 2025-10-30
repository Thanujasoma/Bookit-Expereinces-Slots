const express = require('express');
const router = express.Router();
const promoController = require('../controllers/promoController');
const { authenticate, requireAdmin } = require('../middleware/auth');

// Public: validate a promo code
// POST /api/promo/validate
router.post('/validate', promoController.validatePromo);

// Admin-only: create a promo
// POST /api/promo
router.post('/', authenticate, requireAdmin, promoController.createPromo);

// Admin-only: list promos
// GET /api/promo
router.get('/', authenticate, requireAdmin, promoController.listPromos);

// Admin-only: delete promo by id
// DELETE /api/promo/:id
router.delete('/:id', authenticate, requireAdmin, promoController.deletePromo);

module.exports = router;