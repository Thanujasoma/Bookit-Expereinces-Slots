const express = require('express');
const router = express.Router();
const experienceController = require('../controllers/experienceController');
const { authenticate, requireAdmin } = require('../middleware/auth');

// GET /api/experiences
router.get('/', experienceController.listExperiences);

// GET /api/experiences/:id
router.get('/:id', experienceController.getExperience);

// POST /api/experiences (DEV ONLY) - only admin can create experiences
// IMPORTANT: protect or remove in production
router.post('/', authenticate, requireAdmin, experienceController.createExperience);

module.exports = router;