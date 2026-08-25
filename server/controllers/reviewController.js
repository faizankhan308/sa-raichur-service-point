const fs = require('fs');
const path = require('path');
const Review = require('../models/Review');
const { getIsConnected } = require('../config/db');

const MOCK_REVIEWS_FILE = path.join(__dirname, '..', 'data', 'reviews_mock.json');

const initialReviews = [
  {
    name: "Vijay R.",
    rating: 5,
    comment: "S A Raichur Service Point did an amazing job with our Home Deep Cleaning. The staff was professional, background-verified, and highly efficient. Highly recommended for anyone in Raichur!",
    service: "Home Deep Cleaning"
  },
  {
    name: "Anusha M.",
    rating: 5,
    comment: "Very happy with the Water Tank & Sump Cleaning. They cleaned it thoroughly with high pressure jet wash and sanitized it completely. Transparent pricing as promised.",
    service: "Water Tank & Sump Cleaning"
  },
  {
    name: "Kiran S.",
    rating: 5,
    comment: "Excellent sofa cleaning service! All the sweat stains and odors are completely gone. The fabric looks brand new. Very punctual team.",
    service: "Sofa Cleaning"
  }
];

// Helper to load mock reviews
const loadMockReviews = () => {
  try {
    if (fs.existsSync(MOCK_REVIEWS_FILE)) {
      const data = fs.readFileSync(MOCK_REVIEWS_FILE, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error reading mock reviews file:', error);
  }
  return [...initialReviews];
};

// Helper to save mock reviews
const saveMockReviews = (reviews) => {
  try {
    const dir = path.dirname(MOCK_REVIEWS_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(MOCK_REVIEWS_FILE, JSON.stringify(reviews, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Error writing mock reviews file:', error);
    return false;
  }
};

// Seed reviews helper
const seedReviews = async () => {
  if (!getIsConnected()) return;
  try {
    const count = await Review.countDocuments();
    if (count === 0) {
      await Review.insertMany(initialReviews);
      console.log('✅ Default customer reviews seeded successfully!');
    }
  } catch (error) {
    console.error(`❌ Failed to seed reviews database: ${error.message}`);
  }
};

// GET /api/reviews
const getReviews = async (req, res) => {
  try {
    if (getIsConnected()) {
      const reviews = await Review.find().sort({ createdAt: -1 });
      return res.json({ success: true, reviews });
    } else {
      const reviews = loadMockReviews();
      // Sort mock by simulated date or order (newest first)
      return res.json({ success: true, reviews: reviews.reverse(), mock: true });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// POST /api/reviews
const createReview = async (req, res) => {
  try {
    const { name, rating, comment, service } = req.body;

    if (!name || !rating || !comment) {
      return res.status(400).json({ error: 'Missing required fields: name, rating, and comment are required.' });
    }

    if (getIsConnected()) {
      const newReview = await Review.create({
        name,
        rating: Number(rating),
        comment,
        service: service || ''
      });
      return res.status(201).json({ success: true, review: newReview });
    } else {
      const reviews = loadMockReviews();
      const newReview = {
        name,
        rating: Number(rating),
        comment,
        service: service || '',
        createdAt: new Date().toISOString()
      };
      reviews.push(newReview);
      saveMockReviews(reviews);
      return res.status(201).json({ success: true, review: newReview, mock: true });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Placeholder GET /api/reviews/google for future Google Places API integration
const getGoogleReviews = async (req, res) => {
  try {
    // In the future, this controller will fetch live ratings and reviews
    // from the Google Places API using a configured Google API Key.
    return res.json({
      success: true,
      configured: false,
      googleBusiness: {
        rating: null,
        reviewsCount: null,
        reviews: [],
        profileUrl: "https://maps.google.com/?q=S+A+Raichur+Service+Point+Raichur"
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getReviews,
  createReview,
  seedReviews,
  getGoogleReviews
};
