const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

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
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/reviews', reviewRoutes);

// Static client path serving
const clientBuildPath = path.join(__dirname, '..', 'client', 'dist');
app.use(express.static(clientBuildPath));

// Fallback to React index or generic welcome screen
app.get('*', (req, res) => {
  const indexPath = path.join(clientBuildPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.json({
      message: '🚀 S A Raichur Service Point Server API is running!',
      frontendStatus: 'Pending client compilation. Run "npm run build" in client directory.'
    });
  }
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
