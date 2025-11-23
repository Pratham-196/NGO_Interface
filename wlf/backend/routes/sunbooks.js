const express = require('express');
const router = express.Router();
const SunBook = require('../models/SunBook');
const { body, validationResult } = require('express-validator');

// Get all Sun Books devices
router.get('/', async (req, res) => {
  try {
    const { status, country, region, page = 1, limit = 10 } = req.query;
    
    const filter = {};
    if (status) filter.status = status;
    if (country) filter['location.country'] = country;
    if (region) filter['location.region'] = region;
    
    const skip = (page - 1) * limit;
    
    const devices = await SunBook.find(filter)
      .select('-usage.dailyUsage')
      .sort({ 'usage.lastActivity': -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await SunBook.countDocuments(filter);
    
    res.json({
      success: true,
      data: devices,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get specific Sun Book device
router.get('/:deviceId', async (req, res) => {
  try {
    const device = await SunBook.findOne({ deviceId: req.params.deviceId });
    
    if (!device) {
      return res.status(404).json({ 
        success: false, 
        error: 'Device not found' 
      });
    }
    
    res.json({ success: true, data: device });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Create new Sun Book device
router.post('/', [
  body('deviceId').notEmpty().withMessage('Device ID is required'),
  body('location.school').notEmpty().withMessage('School name is required'),
  body('location.region').notEmpty().withMessage('Region is required'),
  body('location.country').notEmpty().withMessage('Country is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array() 
      });
    }
    
    const device = new SunBook(req.body);
    await device.save();
    
    res.status(201).json({ success: true, data: device });
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ 
        success: false, 
        error: 'Device ID already exists' 
      });
    } else {
      res.status(500).json({ success: false, error: error.message });
    }
  }
});

// Update Sun Book device
router.put('/:deviceId', async (req, res) => {
  try {
    const device = await SunBook.findOneAndUpdate(
      { deviceId: req.params.deviceId },
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!device) {
      return res.status(404).json({ 
        success: false, 
        error: 'Device not found' 
      });
    }
    
    res.json({ success: true, data: device });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update device usage
router.post('/:deviceId/usage', [
  body('duration').isNumeric().withMessage('Duration must be a number'),
  body('userId').optional().isString()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array() 
      });
    }
    
    const device = await SunBook.findOne({ deviceId: req.params.deviceId });
    
    if (!device) {
      return res.status(404).json({ 
        success: false, 
        error: 'Device not found' 
      });
    }
    
    await device.updateUsage(req.body);
    
    res.json({ success: true, message: 'Usage updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Add maintenance issue
router.post('/:deviceId/maintenance', [
  body('type').notEmpty().withMessage('Issue type is required'),
  body('description').notEmpty().withMessage('Description is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array() 
      });
    }
    
    const device = await SunBook.findOne({ deviceId: req.params.deviceId });
    
    if (!device) {
      return res.status(404).json({ 
        success: false, 
        error: 'Device not found' 
      });
    }
    
    await device.addMaintenanceIssue(req.body);
    
    res.json({ success: true, message: 'Maintenance issue added successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get device analytics
router.get('/:deviceId/analytics', async (req, res) => {
  try {
    const device = await SunBook.findOne({ deviceId: req.params.deviceId });
    
    if (!device) {
      return res.status(404).json({ 
        success: false, 
        error: 'Device not found' 
      });
    }
    
    const analytics = {
      deviceId: device.deviceId,
      location: device.location,
      status: device.status,
      healthScore: device.healthScore,
      batteryLevel: device.batteryLevel,
      solarPanelEfficiency: device.solarPanelEfficiency,
      totalBooks: device.content.totalBooks,
      totalSessions: device.usage.totalSessions,
      totalReadingTime: device.usage.totalReadingTime,
      uniqueUsers: device.usage.uniqueUsers,
      lastActivity: device.usage.lastActivity,
      averageSessionDuration: device.performance.averageSessionDuration,
      mostPopularBooks: device.performance.mostPopularBooks,
      openIssues: device.maintenance.issues.filter(issue => issue.status === 'open').length,
      recentUsage: device.usage.dailyUsage.slice(-7) // Last 7 days
    };
    
    res.json({ success: true, data: analytics });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get global Sun Books statistics
router.get('/stats/global', async (req, res) => {
  try {
    const stats = await SunBook.aggregate([
      {
        $group: {
          _id: null,
          totalDevices: { $sum: 1 },
          activeDevices: {
            $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] }
          },
          totalBooks: { $sum: '$content.totalBooks' },
          totalSessions: { $sum: '$usage.totalSessions' },
          totalReadingTime: { $sum: '$usage.totalReadingTime' },
          totalUsers: { $sum: '$usage.uniqueUsers' },
          averageBatteryLevel: { $avg: '$batteryLevel' },
          averageEfficiency: { $avg: '$solarPanelEfficiency' }
        }
      }
    ]);
    
    const countryStats = await SunBook.aggregate([
      {
        $group: {
          _id: '$location.country',
          deviceCount: { $sum: 1 },
          totalSessions: { $sum: '$usage.totalSessions' },
          totalReadingTime: { $sum: '$usage.totalReadingTime' }
        }
      },
      { $sort: { deviceCount: -1 } },
      { $limit: 10 }
    ]);
    
    res.json({
      success: true,
      data: {
        global: stats[0] || {},
        topCountries: countryStats
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Delete Sun Book device
router.delete('/:deviceId', async (req, res) => {
  try {
    const device = await SunBook.findOneAndDelete({ deviceId: req.params.deviceId });
    
    if (!device) {
      return res.status(404).json({ 
        success: false, 
        error: 'Device not found' 
      });
    }
    
    res.json({ success: true, message: 'Device deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
