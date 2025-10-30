/**
 * Seed script to insert sample experiences, promo codes, and an admin user
 * Run: npm run seed
 */
const dotenv = require('dotenv');
dotenv.config();

const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Experience = require('../models/Experience');
const Promo = require('../models/Promo');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

const seed = async () => {
  try {
    await connectDB();

    await Experience.deleteMany({});
    await Promo.deleteMany({});
    await User.deleteMany({});

    const experiences = [
      {
        title: 'Kayaking Adventure',
        description: 'Curated small-group experience. Certified guide. Helmet and life jackets included.',
        location: 'Udupi, Karnataka',
        images: [
          'https://images.unsplash.com/photo-1509475826633-fed577a2c71b?w=1600&q=80&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1526481280698-8a5f3d8e6a1f?w=1600&q=80&auto=format&fit=crop'
        ],
        durationMinutes: 120,
        slots: [
          { date: '2025-11-05', time: '07:00', price: 999, availableSeats: 4 },
          { date: '2025-11-05', time: '09:00', price: 999, availableSeats: 2 },
          { date: '2025-11-05', time: '11:00', price: 999, availableSeats: 5 },
          { date: '2025-11-05', time: '13:00', price: 999, availableSeats: 0 }
        ]
      },
      {
        title: 'Nandi Hills Sunrise',
        description: 'Sunrise view and guided breakfast.',
        location: 'Bangalore',
        images: [
          'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1600&q=80&auto=format&fit=crop'
        ],
        durationMinutes: 180,
        slots: [
          { date: '2025-11-06', time: '05:30', price: 899, availableSeats: 10 },
          { date: '2025-11-07', time: '05:30', price: 899, availableSeats: 8 }
        ]
      }
    ];

    await Experience.insertMany(experiences);

    await Promo.create([
      { code: 'SAVE10', type: 'percent', amount: 10 },
      { code: 'FLAT100', type: 'flat', amount: 100 }
    ]);

    // create admin user
    const adminPassword = 'admin123'; // change for production
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(adminPassword, salt);

    const admin = new User({
      name: 'Admin User',
      email: 'admin@example.com',
      password: hashed,
      isAdmin: true
    });

    await admin.save();

    console.log('Seeding complete. Admin user created: admin@example.com / admin123');
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed', err);
    process.exit(1);
  }
};

seed();