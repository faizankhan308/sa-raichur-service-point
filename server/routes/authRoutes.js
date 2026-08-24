const express = require('express');
const router = express.Router();
const { login, checkAdminStatus } = require('../controllers/authController');

router.post('/login', login);
router.get('/status', checkAdminStatus);

module.exports = router;
