const express = require('express');
const path = require('path');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;
const ADMIN_PASSWORD = 'admin'; // Basic password for admin panel authentication

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Admin Authorization Middleware
function authorizeAdmin(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({ error: 'Authorization header is missing' });
  }

  // Expecting format: "Bearer <password>"
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0].toLowerCase() !== 'bearer') {
    return res.status(401).json({ error: 'Invalid authorization format. Use Bearer <token>' });
  }

  const password = parts[1];
  if (password !== ADMIN_PASSWORD) {
    return res.status(403).json({ error: 'Forbidden: Invalid admin password' });
  }

  next();
}

// REST API Endpoints

// 1. Submit a booking (Public)
app.post('/api/bookings', async (req, res) => {
  try {
    const { customerName, phone, address, date, timeSlot, services, totalAmount, notes } = req.body;

    // Validate required fields
    if (!customerName || !phone || !address || !date || !timeSlot) {
      return res.status(400).json({ error: 'Missing required fields: customerName, phone, address, date, timeSlot are required.' });
    }

    const booking = await db.createBooking({
      customerName,
      phone,
      email: req.body.email || '',
      address,
      date,
      timeSlot,
      services,
      totalAmount,
      notes
    });

    res.status(201).json({
      success: true,
      message: 'Booking submitted successfully',
      booking
    });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ error: 'Server error while processing booking' });
  }
});

// 2. Fetch all bookings (Admin only)
app.get('/api/bookings', authorizeAdmin, async (req, res) => {
  try {
    const bookings = await db.getAllBookings();
    res.json({ success: true, bookings });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ error: 'Server error while fetching bookings' });
  }
});

// 3. Update booking status (Admin only)
app.patch('/api/bookings/:id', authorizeAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['Pending', 'Confirmed', 'In Progress', 'Completed', 'Cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
    }

    const updatedBooking = await db.updateBookingStatus(id, status);
    if (!updatedBooking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    res.json({
      success: true,
      message: 'Booking status updated successfully',
      booking: updatedBooking
    });
  } catch (error) {
    console.error('Error updating booking:', error);
    res.status(500).json({ error: 'Server error while updating booking' });
  }
});

// Fallback to index.html for SPA routing (if any)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start Server
app.listen(PORT, () => {
  console.log(`==================================================`);
  console.log(`🚀 S A Raichur Service Point Server running!`);
  console.log(`🌐 Local URL: http://localhost:${PORT}`);
  console.log(`🔒 Admin Password: "${ADMIN_PASSWORD}"`);
  console.log(`==================================================`);
});
