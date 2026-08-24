const fs = require('fs');
const path = require('path');

const DB_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DB_DIR, 'bookings.json');

// Helper to initialize data folder and JSON file if they don't exist
function initDb() {
  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
  }
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify([], null, 2), 'utf8');
  }
}

// Read bookings helper
async function readBookings() {
  initDb();
  try {
    const data = await fs.promises.readFile(DB_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading database file:', error);
    return [];
  }
}

// Write bookings helper
async function writeBookings(bookings) {
  initDb();
  try {
    await fs.promises.writeFile(DB_FILE, JSON.stringify(bookings, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Error writing to database file:', error);
    return false;
  }
}

// Retrieve all bookings sorted by creation date descending
async function getAllBookings() {
  const bookings = await readBookings();
  return bookings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

// Create a new booking with a unique reference ID
async function createBooking(bookingData) {
  const bookings = await readBookings();
  const shortId = Date.now().toString(36).toUpperCase() + Math.random().toString(36).substr(2, 4).toUpperCase();
  
  const newBooking = {
    id: `SABK-${shortId}`,
    customerName: bookingData.customerName,
    phone: bookingData.phone,
    email: bookingData.email || '',
    address: bookingData.address,
    date: bookingData.date,
    timeSlot: bookingData.timeSlot,
    services: bookingData.services || [], // Array of { name, price, quantity }
    totalAmount: bookingData.totalAmount || 0,
    status: 'Pending', // Pending, Confirmed, In Progress, Completed, Cancelled
    createdAt: new Date().toISOString(),
    notes: bookingData.notes || ''
  };
  
  bookings.push(newBooking);
  await writeBookings(bookings);
  return newBooking;
}

// Update the status of a specific booking by ID
async function updateBookingStatus(id, status) {
  const bookings = await readBookings();
  const index = bookings.findIndex(b => b.id === id);
  if (index !== -1) {
    bookings[index].status = status;
    bookings[index].updatedAt = new Date().toISOString();
    await writeBookings(bookings);
    return bookings[index];
  }
  return null;
}

module.exports = {
  getAllBookings,
  createBooking,
  updateBookingStatus
};
