const express = require('express');
const router = express.Router();
const DigitalLearning = require('../models/DigitalLearning');
const { body, validationResult } = require('express-validator');

// Get all Digital Learning programs
router.get('/', async (req, res) => {
  try {
    const { status, type, country, page = 1, limit = 10 } = req.query;
    
    const filter = {};
    if (status) filter.status = status;
    if (type) filter.type = type;
    if (country) filter['deployment.countries'] = country;
    
    const skip = (page - 1) * limit;
    
    const programs = await DigitalLearning.find(filter)
      .select('-reports')
      .sort({ 'deployment.launchDate': -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await DigitalLearning.countDocuments(filter);
    
    res.json({
      success: true,
      data: programs,
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

// Get specific Digital Learning program
router.get('/:programId', async (req, res) => {
  try {
    const program = await DigitalLearning.findOne({ programId: req.params.programId });
    
    if (!program) {
      return res.status(404).json({ 
        success: false, 
        error: 'Program not found' 
      });
    }
    
    res.json({ success: true, data: program });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Create new Digital Learning program
router.post('/', [
  body('programId').notEmpty().withMessage('Program ID is required'),
  body('name').notEmpty().withMessage('Program name is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('type').isIn(['online-course', 'mobile-app', 'platform', 'tool', 'resource-library']).withMessage('Invalid program type'),
  body('targetAudience.primary').isArray().withMessage('Target audience must be an array')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array() 
      });
    }
    
    const program = new DigitalLearning(req.body);
    await program.save();
    
    res.status(201).json({ success: true, data: program });
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ 
        success: false, 
        error: 'Program ID already exists' 
      });
    } else {
      res.status(500).json({ success: false, error: error.message });
    }
  }
});

// Update Digital Learning program
router.put('/:programId', async (req, res) => {
  try {
    const program = await DigitalLearning.findOneAndUpdate(
      { programId: req.params.programId },
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!program) {
      return res.status(404).json({ 
        success: false, 
        error: 'Program not found' 
      });
    }
    
    res.json({ success: true, data: program });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Add user feedback
router.post('/:programId/feedback', [
  body('userId').notEmpty().withMessage('User ID is required'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('comment').notEmpty().withMessage('Comment is required'),
  body('category').notEmpty().withMessage('Category is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array() 
      });
    }
    
    const program = await DigitalLearning.findOne({ programId: req.params.programId });
    
    if (!program) {
      return res.status(404).json({ 
        success: false, 
        error: 'Program not found' 
      });
    }
    
    await program.addFeedback(req.body);
    
    res.json({ success: true, message: 'Feedback added successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Report issue
router.post('/:programId/issues', [
  body('type').isIn(['bug', 'feature-request', 'usability', 'performance', 'content']).withMessage('Invalid issue type'),
  body('severity').isIn(['low', 'medium', 'high', 'critical']).withMessage('Invalid severity'),
  body('description').notEmpty().withMessage('Description is required'),
  body('reportedBy').notEmpty().withMessage('Reporter is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array() 
      });
    }
    
    const program = await DigitalLearning.findOne({ programId: req.params.programId });
    
    if (!program) {
      return res.status(404).json({ 
        success: false, 
        error: 'Program not found' 
      });
    }
    
    await program.reportIssue(req.body);
    
    res.json({ success: true, message: 'Issue reported successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update analytics
router.post('/:programId/analytics', async (req, res) => {
  try {
    const program = await DigitalLearning.findOne({ programId: req.params.programId });
    
    if (!program) {
      return res.status(404).json({ 
        success: false, 
        error: 'Program not found' 
      });
    }
    
    await program.updateAnalytics(req.body);
    
    res.json({ success: true, message: 'Analytics updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Add report
router.post('/:programId/reports', [
  body('type').isIn(['usage', 'performance', 'impact', 'technical', 'financial']).withMessage('Invalid report type'),
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
    
    const program = await DigitalLearning.findOne({ programId: req.params.programId });
    
    if (!program) {
      return res.status(404).json({ 
        success: false, 
        error: 'Program not found' 
      });
    }
    
    await program.addReport(req.body);
    
    res.json({ success: true, message: 'Report added successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get program analytics
router.get('/:programId/analytics', async (req, res) => {
  try {
    const program = await DigitalLearning.findOne({ programId: req.params.programId });
    
    if (!program) {
      return res.status(404).json({ 
        success: false, 
        error: 'Program not found' 
      });
    }
    
    const analytics = {
      programId: program.programId,
      name: program.name,
      status: program.status,
      healthScore: program.healthScore,
      satisfactionScore: program.satisfactionScore,
      enrollment: program.enrollment,
      performance: program.performance,
      analytics: program.analytics,
      deployment: program.deployment,
      impact: program.impact,
      recentReports: program.reports.slice(-5) // Last 5 reports
    };
    
    res.json({ success: true, data: analytics });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get global Digital Learning statistics
router.get('/stats/global', async (req, res) => {
  try {
    const stats = await DigitalLearning.aggregate([
      {
        $group: {
          _id: null,
          totalPrograms: { $sum: 1 },
          activePrograms: {
            $sum: { $cond: [{ $eq: ['$status', 'launched'] }, 1, 0] }
          },
          totalUsers: { $sum: '$enrollment.totalUsers' },
          totalActiveUsers: { $sum: '$enrollment.activeUsers' },
          totalCompleted: { $sum: '$enrollment.completedUsers' },
          averageCompletionRate: { $avg: '$performance.completionRate' },
          averageSatisfaction: { $avg: '$performance.userSatisfaction' }
        }
      }
    ]);
    
    const typeStats = await DigitalLearning.aggregate([
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 },
          totalUsers: { $sum: '$enrollment.totalUsers' },
          averageCompletion: { $avg: '$performance.completionRate' }
        }
      },
      { $sort: { count: -1 } }
    ]);
    
    const countryStats = await DigitalLearning.aggregate([
      { $unwind: '$deployment.countries' },
      {
        $group: {
          _id: '$deployment.countries',
          programCount: { $sum: 1 },
          totalUsers: { $sum: '$enrollment.totalUsers' }
        }
      },
      { $sort: { programCount: -1 } },
      { $limit: 10 }
    ]);
    
    res.json({
      success: true,
      data: {
        global: stats[0] || {},
        programTypes: typeStats,
        topCountries: countryStats
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Delete Digital Learning program
router.delete('/:programId', async (req, res) => {
  try {
    const program = await DigitalLearning.findOneAndDelete({ programId: req.params.programId });
    
    if (!program) {
      return res.status(404).json({ 
        success: false, 
        error: 'Program not found' 
      });
    }
    
    res.json({ success: true, message: 'Program deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
