const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');
const { getIsConnected } = require('../config/db');

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('FATAL: JWT_SECRET environment variable is required in production environment.');
  }
  console.warn('⚠️ Warning: JWT_SECRET is not configured in development. Using dev fallback secret.');
}
const ACTUAL_JWT_SECRET = JWT_SECRET || 'saraichur_admin_jwt_secret_dev_fallback';
const MOCK_ADMIN_FILE = path.join(__dirname, '..', 'data', 'admins_mock.json');

// Helper to get mock admins from JSON file
const getMockAdmins = () => {
  if (!fs.existsSync(MOCK_ADMIN_FILE)) {
    return [];
  }
  try {
    return JSON.parse(fs.readFileSync(MOCK_ADMIN_FILE, 'utf8'));
  } catch (err) {
    return [];
  }
};

// Helper to save mock admins to JSON file
const saveMockAdmins = (admins) => {
  const dir = path.dirname(MOCK_ADMIN_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(MOCK_ADMIN_FILE, JSON.stringify(admins, null, 2), 'utf8');
};

// Seed default Admin if not exist - Disabled to allow dynamic first-time setup
const seedAdmin = async () => {
  // We do not auto-seed a hardcoded admin user so the client can setup their own credentials on first login.
  console.log('ℹ️ Dynamic admin setup enabled: first login attempt will register the administrator account.');
};

// Get admin configuration status (has any admin account been created?)
const checkAdminStatus = async (req, res) => {
  try {
    if (getIsConnected()) {
      const count = await Admin.countDocuments();
      return res.json({ hasAdmin: count > 0 });
    } else {
      const admins = getMockAdmins();
      return res.json({ hasAdmin: admins.length > 0 });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    if (getIsConnected()) {
      // Check if any admin exists in MongoDB
      const count = await Admin.countDocuments();
      if (count === 0) {
        // Automatically register the first user
        const newAdmin = new Admin({
          username,
          password
        });
        await newAdmin.save();
        
        const token = jwt.sign(
          { id: newAdmin._id, username: newAdmin.username },
          ACTUAL_JWT_SECRET,
          { expiresIn: '7d' }
        );
        return res.json({ success: true, token, username: newAdmin.username, created: true });
      }

      // Standard MongoDB Login flow
      const admin = await Admin.findOne({ username });
      if (!admin) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      
      const isMatch = await admin.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const token = jwt.sign(
        { id: admin._id, username: admin.username },
        ACTUAL_JWT_SECRET,
        { expiresIn: '7d' }
      );
      
      return res.json({ success: true, token, username: admin.username });
    } else {
      // Offline fallback check using admins_mock.json file
      const admins = getMockAdmins();
      if (admins.length === 0) {
        // Automatically register the first user offline
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        const newAdmin = { username, password: hashedPassword };
        admins.push(newAdmin);
        saveMockAdmins(admins);

        const token = jwt.sign(
          { id: 'mock-id-admin', username: username },
          ACTUAL_JWT_SECRET,
          { expiresIn: '7d' }
        );
        return res.json({ success: true, token, username: username, created: true });
      }

      const admin = admins.find(a => a.username === username);
      if (!admin) {
        return res.status(401).json({ error: 'Invalid credentials (Mock Mode)' });
      }

      const isMatch = await bcrypt.compare(password, admin.password);
      if (!isMatch) {
        return res.status(401).json({ error: 'Invalid credentials (Mock Mode)' });
      }

      const token = jwt.sign(
        { id: 'mock-id-admin', username: username },
        ACTUAL_JWT_SECRET,
        { expiresIn: '7d' }
      );
      return res.json({ success: true, token, username: username, mock: true });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Reset admin credentials using the secret ADMIN_RESET_KEY from .env
// Bookings and services data are NEVER touched by this operation.
const resetCredentials = async (req, res) => {
  try {
    const { resetKey, newUsername, newPassword } = req.body;

    if (!resetKey || !newUsername || !newPassword) {
      return res.status(400).json({ error: 'Reset key, new username, and new password are all required.' });
    }

    const ADMIN_RESET_KEY = process.env.ADMIN_RESET_KEY;
    if (!ADMIN_RESET_KEY) {
      return res.status(500).json({ error: 'Reset feature is not configured on the server. Please add ADMIN_RESET_KEY to your .env file.' });
    }

    if (resetKey !== ADMIN_RESET_KEY) {
      return res.status(401).json({ error: 'Invalid reset key. Access denied.' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'New password must be at least 6 characters long.' });
    }

    if (getIsConnected()) {
      // MongoDB mode: delete existing admin accounts and register the new one
      await Admin.deleteMany({}); // Only deletes admin credentials, NOT bookings or services
      const newAdmin = new Admin({ username: newUsername, password: newPassword });
      await newAdmin.save();

      const token = jwt.sign(
        { id: newAdmin._id, username: newAdmin.username },
        ACTUAL_JWT_SECRET,
        { expiresIn: '7d' }
      );
      return res.json({ success: true, token, username: newAdmin.username, message: 'Admin credentials have been reset successfully.' });
    } else {
      // Offline mock mode: overwrite admins_mock.json with the new credentials
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);
      saveMockAdmins([{ username: newUsername, password: hashedPassword }]);

      const token = jwt.sign(
        { id: 'mock-id-admin', username: newUsername },
        ACTUAL_JWT_SECRET,
        { expiresIn: '7d' }
      );
      return res.json({ success: true, token, username: newUsername, message: 'Admin credentials have been reset successfully (Offline Mode).' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  login,
  seedAdmin,
  checkAdminStatus,
  resetCredentials
};
