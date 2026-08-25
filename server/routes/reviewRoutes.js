const express = require('express');
const router = express.Router();
const { getReviews, createReview, getGoogleReviews } = require('../controllers/reviewController');

router.get('/', getReviews);
router.post('/', createReview);
router.get('/google', getGoogleReviews);

module.exports = router;
