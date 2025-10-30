```markdown
# BookIt Backend (JavaScript, Express, MongoDB)

This project contains the backend for the BookIt booking app (Express + MongoDB + Mongoose).
It provides endpoints used by the frontend to list experiences, view details, validate promo codes,
and create bookings while preventing double-booking for the same slot.

Folder structure
- models/        - Mongoose models (Experience, Booking, Promo)
- controllers/   - Request handlers (experience, booking, promo)
- routes/        - Express route definitions
- config/        - DB connection (config/db.js)
- seed/          - Seed script to populate sample data
- server.js      - App entry

Quick start (local)
1. Copy .env.example to .env and set MONGODB_URI if needed.
2. Install dependencies:
   npm install
3. Seed sample data:
   npm run seed
4. Start server (development):
   npm run dev
   or production:
   npm start
5. API base: http://localhost:4000/api

API Endpoints
- GET /api/experiences
  Returns list of experiences (basic fields).

- GET /api/experiences/:id
  Returns full experience document including slots and availability.

- POST /api/promo/validate
  Body: { code: string, subtotal: number }
  Response: { valid: boolean, code?, discount?, message? }

- POST /api/bookings
  Body: {
    experienceId,
    slotId,
    name,
    email,
    phone?,
    quantity,
    totalPrice,
    promoCode?
  }
  Creates booking and atomically decrements slot.availableSeats to prevent double-booking.

Notes
- Seed script inserts sample experiences and promo codes (SAVE10, FLAT100).
- The booking flow uses mongoose sessions to make the seat decrement + booking creation atomic.
- For real deployments you should add authentication, input sanitation, rate limiting, and protect any admin endpoints.

```