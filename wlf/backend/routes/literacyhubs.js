const express = require('express');
const router = express.Router();
const LiteracyHub = require('../models/LiteracyHub');
const { body, validationResult } = require('express-validator');

// Get all Literacy Hubs
router.get('/', async (req, res) => {
  try {
    const { status, country, region, page = 1, limit = 10 } = req.query;
    
    const filter = {};
    if (status) filter.status = status;
    if (country) filter['location.country'] = country;
    if (region) filter['location.region'] = region;
    
    const skip = (page - 1) * limit;
    
    const hubs = await LiteracyHub.find(filter)
      .select('-reports')
      .sort({ 'performance.studentProgress.totalStudents': -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await LiteracyHub.countDocuments(filter);
    
    res.json({
      success: true,
      data: hubs,
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

// Get specific Literacy Hub
router.get('/:hubId', async (req, res) => {
  try {
    const hub = await LiteracyHub.findOne({ hubId: req.params.hubId });
    
    if (!hub) {
      return res.status(404).json({ 
        success: false, 
        error: 'Hub not found' 
      });
    }
    
    res.json({ success: true, data: hub });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Create new Literacy Hub
router.post('/', [
  body('hubId').notEmpty().withMessage('Hub ID is required'),
  body('location.name').notEmpty().withMessage('Hub name is required'),
  body('location.address').notEmpty().withMessage('Address is required'),
  body('location.region').notEmpty().withMessage('Region is required'),
  body('location.country').notEmpty().withMessage('Country is required'),
  body('capacity.maxStudents').isNumeric().withMessage('Max students must be a number')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array() 
      });
    }
    
    const hub = new LiteracyHub(req.body);
    await hub.save();
    
    res.status(201).json({ success: true, data: hub });
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ 
        success: false, 
        error: 'Hub ID already exists' 
      });
    } else {
      res.status(500).json({ success: false, error: error.message });
    }
  }
});

// Update Literacy Hub
router.put('/:hubId', async (req, res) => {
  try {
    const hub = await LiteracyHub.findOneAndUpdate(
      { hubId: req.params.hubId },
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!hub) {
      return res.status(404).json({ 
        success: false, 
        error: 'Hub not found' 
      });
    }
    
    res.json({ success: true, data: hub });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Enroll student in program
router.post('/:hubId/enroll', [
  body('programId').notEmpty().withMessage('Program ID is required'),
  body('studentName').notEmpty().withMessage('Student name is required'),
  body('age').isNumeric().withMessage('Age must be a number')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array() 
      });
    }
    
    const hub = await LiteracyHub.findOne({ hubId: req.params.hubId });
    
    if (!hub) {
      return res.status(404).json({ 
        success: false, 
        error: 'Hub not found' 
      });
    }
    
    await hub.enrollStudent(req.body.programId);
    
    res.json({ success: true, message: 'Student enrolled successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update student progress
router.post('/:hubId/progress', [
  body('newStudents').optional().isNumeric(),
  body('completed').optional().isNumeric(),
  body('improved').optional().isNumeric()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array() 
      });
    }
    
    const hub = await LiteracyHub.findOne({ hubId: req.params.hubId });
    
    if (!hub) {
      return res.status(404).json({ 
        success: false, 
        error: 'Hub not found' 
      });
    }
    
    await hub.updateStudentProgress(req.body);
    
    res.json({ success: true, message: 'Progress updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Add report
router.post('/:hubId/reports', [
  body('type').notEmpty().withMessage('Report type is required'),
  body('title').notEmpty().withMessage('Report title is required'),
  body('content').notEmpty().withMessage('Report content is required'),
  body('author').notEmpty().withMessage('Author is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array() 
      });
    }
    
    const hub = await LiteracyHub.findOne({ hubId: req.params.hubId });
    
    if (!hub) {
      return res.status(404).json({ 
        success: false, 
        error: 'Hub not found' 
      });
    }
    
    await hub.addReport(req.body);
    
    res.json({ success: true, message: 'Report added successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get hub analytics
router.get('/:hubId/analytics', async (req, res) => {
  try {
    const hub = await LiteracyHub.findOne({ hubId: req.params.hubId });
    
    if (!hub) {
      return res.status(404).json({ 
        success: false, 
        error: 'Hub not found' 
      });
    }
    
    const analytics = {
      hubId: hub.hubId,
      location: hub.location,
      status: hub.status,
      utilizationRate: hub.utilizationRate,
      performanceScore: hub.performanceScore,
      capacity: hub.capacity,
      programs: hub.programs,
      staff: hub.staff,
      resources: hub.resources,
      performance: hub.performance,
      funding: hub.funding,
      community: hub.community,
      recentReports: hub.reports.slice(-5) // Last 5 reports
    };
    
    res.json({ success: true, data: analytics });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get global Literacy Hubs statistics
router.get('/stats/global', async (req, res) => {
  try {
    const stats = await LiteracyHub.aggregate([
      {
        $group: {
          _id: null,
          totalHubs: { $sum: 1 },
          activeHubs: {
            $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] }
          },
          totalStudents: { $sum: '$capacity.currentEnrollment' },
          totalCapacity: { $sum: '$capacity.maxStudents' },
          totalStaff: { $sum: { $size: '$staff' } },
          totalPrograms: { $sum: { $size: '$programs' } },
          averageUtilization: { $avg: { $divide: ['$capacity.currentEnrollment', '$capacity.maxStudents'] } }
        }
      }
    ]);
    
    const countryStats = await LiteracyHub.aggregate([
      {
        $group: {
          _id: '$location.country',
          hubCount: { $sum: 1 },
          totalStudents: { $sum: '$capacity.currentEnrollment' },
          totalPrograms: { $sum: { $size: '$programs' } }
        }
      },
      { $sort: { hubCount: -1 } },
      { $limit: 10 }
    ]);
    
    const programStats = await LiteracyHub.aggregate([
      { $unwind: '$programs' },
      {
        $group: {
          _id: '$programs.type',
          count: { $sum: 1 },
          totalEnrollment: { $sum: '$programs.enrollmentCount' }
        }
      },
      { $sort: { count: -1 } }
    ]);
    
    res.json({
      success: true,
      data: {
        global: stats[0] || {},
        topCountries: countryStats,
        programTypes: programStats
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Delete Literacy Hub
router.delete('/:hubId', async (req, res) => {
  try {
    const hub = await LiteracyHub.findOneAndDelete({ hubId: req.params.hubId });
    
    if (!hub) {
      return res.status(404).json({ 
        success: false, 
        error: 'Hub not found' 
      });
    }
    
    res.json({ success: true, message: 'Hub deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
