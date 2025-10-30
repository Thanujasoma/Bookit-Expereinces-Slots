const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();
// server.js


const app = express();
app.use(express.json());

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
const allowedOrigins = FRONTEND_URL_STRING.split(',').map(url => url.trim());

// 3. Configure CORS with the array of allowed origins
app.use(cors({ 
    origin: (origin, callback) => {
        // Check if the request origin is in our list OR if it's undefined 
        // (undefined happens for same-origin requests or tools like Postman)
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            // Optional: Log the blocked origin for debugging
            // console.log(`Blocked by CORS: ${origin}`); 
            callback(new Error('Not allowed by CORS'), false);
        }
    }, 
    credentials: true 
}));
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
