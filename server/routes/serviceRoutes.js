const express = require('express');
const router = express.Router();
const { 
  getServices, 
  getServiceById, 
  createService, 
  updateService, 
  deleteService 
} = require('../controllers/serviceController');
const { protectAdmin } = require('../middleware/authMiddleware');

// Public endpoints to fetch services listing
router.get('/', getServices);
router.get('/:id', getServiceById);

// Secured endpoints for admin catalog management
router.post('/', protectAdmin, createService);
router.put('/:id', protectAdmin, updateService);
router.delete('/:id', protectAdmin, deleteService);

module.exports = router;
