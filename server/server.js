const express = require('express');
const cors = require('cors');
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

const { connectDB } = require('./config/db');
const { seedServices } = require('./controllers/serviceController');
const { seedAdmin } = require('./controllers/authController');
const { seedReviews } = require('./controllers/reviewController');
const { errorHandler } = require('./middleware/errorMiddleware');

const authRoutes = require('./routes/authRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const reviewRoutes = require('./routes/reviewRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Database connection and seed data
const initApp = async () => {
  await connectDB();
  await seedServices();
  await seedAdmin();
  await seedReviews();
};

initApp();

// Middlewares
// Allow requests from the Vercel frontend domain (set ALLOWED_ORIGIN on Render).
// Falls back to open CORS in development so local dev proxy continues to work.
const corsOptions = {
  origin: process.env.ALLOWED_ORIGIN
    ? process.env.ALLOWED_ORIGIN.split(',')
    : true, // allow all origins when env var is not set
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/reviews', reviewRoutes);

// API health check — returned for any unmatched route so the server never
// accidentally serves frontend files. The frontend is hosted on Vercel.
app.get('/', (req, res) => {
  res.json({
    message: '🚀 S A Raichur Service Point API is running!',
    status: 'ok',
    docs: 'Frontend is served separately via Vercel.',
  });
});

// Error Middleware
app.use(errorHandler);

// Launch server
app.listen(PORT, () => {
  console.log(`==================================================`);
  console.log(`🚀 Full-Stack Express Server running on port ${PORT}`);
  console.log(`🌐 Base URL: http://localhost:${PORT}`);
  console.log(`🔒 Admin Security: First login attempt will register the administrator account.`);
  console.log(`==================================================`);
});
