const express = require('express');
const router = express.Router();
const { login, checkAdminStatus, resetCredentials } = require('../controllers/authController');

router.post('/login', login);
router.get('/status', checkAdminStatus);
router.post('/reset-credentials', resetCredentials);

module.exports = router;
