const Experience = require('../models/Experience');
const mongoose = require('mongoose');

exports.listExperiences = async (req, res) => {
  try {
    const list = await Experience.find().select('title location images durationMinutes slots');
    res.json(list);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch experiences' });
  }
};

exports.getExperience = async (req, res) => {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ error: 'Invalid id' });

    const exp = await Experience.findById(id);
    if (!exp) return res.status(404).json({ error: 'Experience not found' });
    res.json(exp);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch experience' });
  }
};

// Dev-only: create an experience via POST /api/experiences
exports.createExperience = async (req, res) => {
  try {
    const { title, description, location, images, durationMinutes, slots } = req.body;

    if (!title || !slots || !Array.isArray(slots) || slots.length === 0) {
      return res.status(400).json({ error: 'Missing required fields: title and slots (array) are required' });
    }

    const exp = await Experience.create({
      title,
      description: description || '',
      location: location || '',
      images: Array.isArray(images) ? images : (images ? [images] : []),
      durationMinutes: durationMinutes || 120,
      slots
    });

    res.status(201).json(exp);
  } catch (err) {
    console.error('Create experience failed', err);
    res.status(500).json({ error: 'Failed to create experience', details: err.message });
  }
};