const fs = require('fs');
const path = require('path');
const Service = require('../models/Service');
const initialServices = require('../data/initialServices');
const { getIsConnected } = require('../config/db');

const MOCK_SERVICES_FILE = path.join(__dirname, '..', 'data', 'services_mock.json');

// Helper to load mock services
const loadMockServices = () => {
  try {
    if (fs.existsSync(MOCK_SERVICES_FILE)) {
      const data = fs.readFileSync(MOCK_SERVICES_FILE, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error reading mock services file:', error);
  }
  // Initialize with initialServices
  return [...initialServices];
};

// Helper to save mock services
const saveMockServices = (services) => {
  try {
    const dir = path.dirname(MOCK_SERVICES_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(MOCK_SERVICES_FILE, JSON.stringify(services, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Error writing mock services file:', error);
    return false;
  }
};

// Seed services helper
const seedServices = async () => {
  if (!getIsConnected()) return;
  try {
    const seedIds = initialServices.map(s => s.id);
    
    // 1. Delete legacy services not in the 15-item catalog
    const deleteResult = await Service.deleteMany({ id: { $nin: seedIds } });
    if (deleteResult.deletedCount > 0) {
      console.log(`🧹 Cleared ${deleteResult.deletedCount} legacy service(s) from database.`);
    }

    // 2. Upsert each of the 15 services to ensure they have correct default details and image paths
    for (const service of initialServices) {
      await Service.findOneAndUpdate(
        { id: service.id },
        { $set: service },
        { upsert: true, new: true }
      );
    }
    console.log('✅ Services collection synchronized with final 15-item catalog!');
  } catch (error) {
    console.error(`❌ Failed to synchronize services database: ${error.message}`);
  }
};

// GET /api/services
const getServices = async (req, res) => {
  try {
    const { category, search } = req.query;

    if (getIsConnected()) {
      let query = {};
      if (category) {
        query.category = category;
      }
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } }
        ];
      }
      const services = await Service.find(query);
      return res.json({ success: true, services });
    } else {
      // Mock mode fallback
      let services = loadMockServices();
      if (category) {
        services = services.filter(s => s.category === category);
      }
      if (search) {
        const term = search.toLowerCase();
        services = services.filter(s => 
          s.name.toLowerCase().includes(term) || 
          s.description.toLowerCase().includes(term)
        );
      }
      return res.json({ success: true, services, mock: true });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET /api/services/:id
const getServiceById = async (req, res) => {
  try {
    const { id } = req.params;

    if (getIsConnected()) {
      const service = await Service.findOne({ id });
      if (!service) {
        return res.status(404).json({ error: 'Service not found' });
      }
      return res.json({ success: true, service });
    } else {
      // Mock mode fallback
      const services = loadMockServices();
      const service = services.find(s => s.id === id);
      if (!service) {
        return res.status(404).json({ error: 'Service not found (Mock Mode)' });
      }
      return res.json({ success: true, service, mock: true });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// POST /api/services
const createService = async (req, res) => {
  try {
    const { id, name, category, description, price, originalPrice, rating, reviewCount, image, benefits, inclusions } = req.body;

    if (!id || !name || !category || price === undefined) {
      return res.status(400).json({ error: 'Missing required fields: id, name, category, and price are required.' });
    }

    if (getIsConnected()) {
      const existing = await Service.findOne({ id });
      if (existing) {
        return res.status(400).json({ error: `Service ID "${id}" already exists.` });
      }

      const newService = await Service.create({
        id,
        name,
        category,
        description,
        price,
        originalPrice,
        rating: rating || 4.8,
        reviewCount: reviewCount || 150,
        image,
        benefits: benefits || [],
        inclusions: inclusions || []
      });

      return res.status(201).json({ success: true, service: newService });
    } else {
      // Mock mode persistence
      const services = loadMockServices();
      const existing = services.find(s => s.id === id);
      if (existing) {
        return res.status(400).json({ error: `Service ID "${id}" already exists.` });
      }

      const newService = {
        id,
        name,
        category,
        description,
        price: Number(price),
        originalPrice: originalPrice ? Number(originalPrice) : undefined,
        rating: Number(rating) || 4.8,
        reviewCount: Number(reviewCount) || 150,
        image,
        benefits: benefits || [],
        inclusions: inclusions || []
      };

      services.push(newService);
      saveMockServices(services);
      return res.status(201).json({ success: true, service: newService, mock: true });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// PUT /api/services/:id
const updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (getIsConnected()) {
      const updatedService = await Service.findOneAndUpdate(
        { id },
        { $set: updateData },
        { new: true, runValidators: true }
      );

      if (!updatedService) {
        return res.status(404).json({ error: 'Service not found' });
      }

      return res.json({ success: true, service: updatedService });
    } else {
      // Mock mode persistence
      const services = loadMockServices();
      const index = services.findIndex(s => s.id === id);
      if (index === -1) {
        return res.status(404).json({ error: 'Service not found (Mock Mode)' });
      }

      // Convert pricing/numeric inputs to Number just in case
      if (updateData.price !== undefined) updateData.price = Number(updateData.price);
      if (updateData.originalPrice !== undefined) updateData.originalPrice = Number(updateData.originalPrice);
      if (updateData.rating !== undefined) updateData.rating = Number(updateData.rating);
      if (updateData.reviewCount !== undefined) updateData.reviewCount = Number(updateData.reviewCount);

      const updatedService = {
        ...services[index],
        ...updateData,
        id // enforce primary key match
      };

      services[index] = updatedService;
      saveMockServices(services);
      return res.json({ success: true, service: updatedService, mock: true });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE /api/services/:id
const deleteService = async (req, res) => {
  try {
    const { id } = req.params;

    if (getIsConnected()) {
      const deletedService = await Service.findOneAndDelete({ id });
      if (!deletedService) {
        return res.status(404).json({ error: 'Service not found' });
      }
      return res.json({ success: true, message: 'Service deleted successfully' });
    } else {
      // Mock mode persistence
      const services = loadMockServices();
      const index = services.findIndex(s => s.id === id);
      if (index === -1) {
        return res.status(404).json({ error: 'Service not found (Mock Mode)' });
      }

      services.splice(index, 1);
      saveMockServices(services);
      return res.json({ success: true, message: 'Service deleted successfully (Mock Mode)', mock: true });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
  seedServices
};
