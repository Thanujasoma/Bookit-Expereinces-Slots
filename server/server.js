const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();
// server.js


const app = express();
app.use(cors());
app.use(express.json());

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
app.use(cors({ origin: FRONTEND_URL, credentials: true }));

// routes
const experiencesRoutes = require('./routes/experiences');
const bookingsRoutes = require('./routes/bookings');
const promoRoutes = require('./routes/promo');
const authRoutes = require('./routes/auth'); // new

app.use('/api/experiences', experiencesRoutes);
app.use('/api/bookings', bookingsRoutes);
app.use('/api/promo', promoRoutes);
app.use('/api/auth', authRoutes); // register/login

app.get('/', (req, res) => res.json({ status: 'BookIt API running' }));

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
  })
  .catch((err) => {
    console.error('Failed to connect to DB', err);
    process.exit(1);
  });