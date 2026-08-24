const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('FATAL: JWT_SECRET environment variable is required in production environment.');
  }
  console.warn('⚠️ Warning: JWT_SECRET is not configured in development. Using dev fallback secret.');
}
const ACTUAL_JWT_SECRET = JWT_SECRET || 'saraichur_admin_jwt_secret_dev_fallback';

const protectAdmin = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Access denied. No admin token provided.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, ACTUAL_JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid or expired authentication token.' });
  }
};

module.exports = { protectAdmin };
