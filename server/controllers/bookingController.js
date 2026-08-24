const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');
const Booking = require('../models/Booking');
const { getIsConnected } = require('../config/db');

// Mock database file configuration
const MOCK_FILE_PATH = path.join(__dirname, '..', 'data', 'bookings_atlas_mock.json');

const initMockDb = () => {
  const dir = path.dirname(MOCK_FILE_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(MOCK_FILE_PATH)) {
    fs.writeFileSync(MOCK_FILE_PATH, JSON.stringify([], null, 2), 'utf8');
  }
};

const getMockBookings = () => {
  initMockDb();
  try {
    const data = fs.readFileSync(MOCK_FILE_PATH, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
};

const saveMockBookings = (bookings) => {
  initMockDb();
  try {
    fs.writeFileSync(MOCK_FILE_PATH, JSON.stringify(bookings, null, 2), 'utf8');
    return true;
  } catch (err) {
    return false;
  }
};

// Nodemailer Helper
const sendEmailNotification = async (booking) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn('⚠️ SMTP Email credentials (EMAIL_USER/EMAIL_PASS) not configured. Skipping email notification.');
    return;
  }

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT || '587'),
    secure: process.env.EMAIL_PORT === '465',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const servicesList = booking.services.map(s => `- ${s.name} (Qty: ${s.quantity}) - ₹${s.price * s.quantity}`).join('\n');

  const mailOptions = {
    from: `"S A Raichur Service Point" <${process.env.EMAIL_USER}>`,
    to: [
      process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
      booking.email
    ].filter(Boolean).join(', '),
    subject: `🆕 New Home Service Booking: ${booking.id || 'SABK-NEW'}`,
    text: `
S A RAICHUR SERVICE POINT - NEW BOOKING ENQUIRY
==================================================
Booking ID: ${booking.id || 'N/A'}
Customer Name: ${booking.customerName}
Phone Number: ${booking.phone}
Email: ${booking.email || 'N/A'}
Service Requested: ${booking.service}
Preferred Date: ${booking.preferredDate}
Preferred Time Slot: ${booking.preferredTime}
Service Address: ${booking.address}

Selected Items breakdown:
${servicesList}

Total Amount: ₹${booking.totalAmount} (incl. GST if applicable)
Current Status: ${booking.status}
Additional Message: ${booking.message || 'None'}
==================================================
Submitted on: ${new Date(booking.createdAt || Date.now()).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
`
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`✉️ Email notification sent successfully: ${info.messageId}`);
  } catch (error) {
    console.error(`❌ Failed to send email alert: ${error.message}`);
  }
};

// POST /api/bookings
const createBooking = async (req, res) => {
  try {
    const { customerName, phone, email, service, services, address, preferredDate, preferredTime, message, totalAmount } = req.body;

    if (!customerName || !phone || !service || !address || !preferredDate || !preferredTime) {
      return res.status(400).json({ error: 'Missing required booking fields.' });
    }

    const bookingData = {
      customerName,
      phone,
      email: email || '',
      service,
      services: services || [],
      address,
      preferredDate,
      preferredTime,
      message: message || '',
      totalAmount: totalAmount || 0,
      status: 'New'
    };

    let savedBooking;

    if (getIsConnected()) {
      const newBooking = new Booking(bookingData);
      savedBooking = await newBooking.save();
      // Format response to include virtual or schema id
      savedBooking = savedBooking.toObject();
      savedBooking.id = `SABK-${savedBooking._id.toString().toUpperCase().slice(-8)}`;
      // Re-save or update with formatting for display uniformity
      await Booking.findByIdAndUpdate(savedBooking._id, { id: savedBooking.id });
    } else {
      // Mock db implementation
      const bookings = getMockBookings();
      const shortId = Date.now().toString(36).toUpperCase() + Math.random().toString(36).substr(2, 4).toUpperCase();
      savedBooking = {
        _id: `mock-id-${shortId}`,
        id: `SABK-${shortId}`,
        ...bookingData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      bookings.push(savedBooking);
      saveMockBookings(bookings);
    }

    // Trigger Nodemailer async
    sendEmailNotification(savedBooking);

    return res.status(201).json({
      success: true,
      message: 'Booking request submitted successfully',
      booking: savedBooking
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET /api/bookings
const getBookings = async (req, res) => {
  try {
    if (getIsConnected()) {
      const bookings = await Booking.find().sort({ createdAt: -1 });
      return res.json({ success: true, bookings });
    } else {
      const bookings = getMockBookings();
      // Sort descending by date
      const sorted = bookings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      return res.json({ success: true, bookings: sorted, mock: true });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET /api/bookings/:id
const getBookingById = async (req, res) => {
  try {
    const { id } = req.params;
    if (getIsConnected()) {
      // Find by database _id or formatted id
      const booking = await Booking.findOne({ $or: [{ _id: id }, { id: id }] });
      if (!booking) {
        return res.status(404).json({ error: 'Booking not found' });
      }
      return res.json({ success: true, booking });
    } else {
      const bookings = getMockBookings();
      const booking = bookings.find(b => b._id === id || b.id === id);
      if (!booking) {
        return res.status(404).json({ error: 'Booking not found (Mock Mode)' });
      }
      return res.json({ success: true, booking, mock: true });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// PATCH /api/bookings/:id
const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['New', 'Contacted', 'Confirmed', 'Completed', 'Cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: `Invalid status. Choose from: ${validStatuses.join(', ')}` });
    }

    if (getIsConnected()) {
      const booking = await Booking.findOneAndUpdate(
        { $or: [{ _id: id }, { id: id }] },
        { status },
        { new: true }
      );
      if (!booking) {
        return res.status(404).json({ error: 'Booking not found' });
      }
      return res.json({ success: true, booking });
    } else {
      const bookings = getMockBookings();
      const index = bookings.findIndex(b => b._id === id || b.id === id);
      if (index === -1) {
        return res.status(404).json({ error: 'Booking not found (Mock Mode)' });
      }
      bookings[index].status = status;
      bookings[index].updatedAt = new Date().toISOString();
      saveMockBookings(bookings);
      return res.json({ success: true, booking: bookings[index], mock: true });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET /api/bookings/phone/:phone
const getBookingsByPhone = async (req, res) => {
  try {
    const { phone } = req.params;
    if (!phone) {
      return res.status(400).json({ error: 'Phone number parameter is required.' });
    }

    if (getIsConnected()) {
      const bookings = await Booking.find({ phone }).sort({ createdAt: -1 });
      return res.json({ success: true, bookings });
    } else {
      const bookings = getMockBookings();
      const matched = bookings
        .filter(b => b.phone === phone)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      return res.json({ success: true, bookings: matched, mock: true });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createBooking,
  getBookings,
  getBookingById,
  updateBookingStatus,
  getBookingsByPhone
};
