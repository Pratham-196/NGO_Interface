const express = require('express');
const router = express.Router();
const CommunityOutreach = require('../models/CommunityOutreach');
const { body, validationResult } = require('express-validator');

// Get all Community Outreach programs
router.get('/', async (req, res) => {
  try {
    const { status, type, country, region, page = 1, limit = 10 } = req.query;
    
    const filter = {};
    if (status) filter.status = status;
    if (type) filter.type = type;
    if (country) filter['targetCommunity.location.country'] = country;
    if (region) filter['targetCommunity.location.region'] = region;
    
    const skip = (page - 1) * limit;
    
    const programs = await CommunityOutreach.find(filter)
      .select('-evaluation.reports')
      .sort({ 'timeline.startDate': -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await CommunityOutreach.countDocuments(filter);
    
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

// Get specific Community Outreach program
router.get('/:programId', async (req, res) => {
  try {
    const program = await CommunityOutreach.findOne({ programId: req.params.programId });
    
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

// Create new Community Outreach program
router.post('/', [
  body('programId').notEmpty().withMessage('Program ID is required'),
  body('name').notEmpty().withMessage('Program name is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('type').isIn(['awareness', 'engagement', 'support', 'volunteer', 'partnership', 'advocacy']).withMessage('Invalid program type'),
  body('targetCommunity.location.region').notEmpty().withMessage('Target region is required'),
  body('targetCommunity.location.country').notEmpty().withMessage('Target country is required'),
  body('timeline.startDate').isISO8601().withMessage('Start date must be valid')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array() 
      });
    }
    
    const program = new CommunityOutreach(req.body);
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

// Update Community Outreach program
router.put('/:programId', async (req, res) => {
  try {
    const program = await CommunityOutreach.findOneAndUpdate(
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

// Add activity
router.post('/:programId/activities', [
  body('name').notEmpty().withMessage('Activity name is required'),
  body('type').isIn(['workshop', 'seminar', 'campaign', 'event', 'meeting', 'training', 'support-group']).withMessage('Invalid activity type'),
  body('description').notEmpty().withMessage('Description is required'),
  body('schedule.startDate').isISO8601().withMessage('Start date must be valid')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array() 
      });
    }
    
    const program = await CommunityOutreach.findOne({ programId: req.params.programId });
    
    if (!program) {
      return res.status(404).json({ 
        success: false, 
        error: 'Program not found' 
      });
    }
    
    await program.addActivity(req.body);
    
    res.json({ success: true, message: 'Activity added successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update impact metrics
router.post('/:programId/impact', async (req, res) => {
  try {
    const program = await CommunityOutreach.findOne({ programId: req.params.programId });
    
    if (!program) {
      return res.status(404).json({ 
        success: false, 
        error: 'Program not found' 
      });
    }
    
    await program.updateImpact(req.body);
    
    res.json({ success: true, message: 'Impact metrics updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Add evaluation report
router.post('/:programId/evaluation', [
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
    
    const program = await CommunityOutreach.findOne({ programId: req.params.programId });
    
    if (!program) {
      return res.status(404).json({ 
        success: false, 
        error: 'Program not found' 
      });
    }
    
    await program.addEvaluationReport(req.body);
    
    res.json({ success: true, message: 'Evaluation report added successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get program analytics
router.get('/:programId/analytics', async (req, res) => {
  try {
    const program = await CommunityOutreach.findOne({ programId: req.params.programId });
    
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
      reachRate: program.reachRate,
      effectivenessScore: program.effectivenessScore,
      targetCommunity: program.targetCommunity,
      activities: program.activities,
      team: program.team,
      impact: program.impact,
      timeline: program.timeline,
      sustainability: program.sustainability,
      recentReports: program.evaluation.reports.slice(-5) // Last 5 reports
    };
    
    res.json({ success: true, data: analytics });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get global Community Outreach statistics
router.get('/stats/global', async (req, res) => {
  try {
    const stats = await CommunityOutreach.aggregate([
      {
        $group: {
          _id: null,
          totalPrograms: { $sum: 1 },
          activePrograms: {
            $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] }
          },
          totalReach: { $sum: '$targetCommunity.size.actualReach' },
          totalTarget: { $sum: '$targetCommunity.size.targetReach' },
          totalActivities: { $sum: { $size: '$activities' } },
          totalVolunteers: { $sum: '$team.volunteers.total' },
          averageEffectiveness: { $avg: '$effectivenessScore' }
        }
      }
    ]);
    
    const typeStats = await CommunityOutreach.aggregate([
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 },
          totalReach: { $sum: '$targetCommunity.size.actualReach' },
          averageEffectiveness: { $avg: '$effectivenessScore' }
        }
      },
      { $sort: { count: -1 } }
    ]);
    
    const countryStats = await CommunityOutreach.aggregate([
      {
        $group: {
          _id: '$targetCommunity.location.country',
          programCount: { $sum: 1 },
          totalReach: { $sum: '$targetCommunity.size.actualReach' },
          totalActivities: { $sum: { $size: '$activities' } }
        }
      },
      { $sort: { programCount: -1 } },
      { $limit: 10 }
    ]);
    
    const activityStats = await CommunityOutreach.aggregate([
      { $unwind: '$activities' },
      {
        $group: {
          _id: '$activities.type',
          count: { $sum: 1 },
          averageParticipants: { $avg: '$activities.participants.actual' }
        }
      },
      { $sort: { count: -1 } }
    ]);
    
    res.json({
      success: true,
      data: {
        global: stats[0] || {},
        programTypes: typeStats,
        topCountries: countryStats,
        activityTypes: activityStats
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Delete Community Outreach program
router.delete('/:programId', async (req, res) => {
  try {
    const program = await CommunityOutreach.findOneAndDelete({ programId: req.params.programId });
    
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
