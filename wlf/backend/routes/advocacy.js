const express = require('express');
const router = express.Router();
const Advocacy = require('../models/Advocacy');
const { body, validationResult } = require('express-validator');

// Get all Advocacy campaigns
router.get('/', async (req, res) => {
  try {
    const { status, category, country, priority, page = 1, limit = 10 } = req.query;
    
    const filter = {};
    if (status) filter.status = status;
    if (category) filter.category = category;
    if (country) filter['target.country'] = country;
    if (priority) filter.priority = priority;
    
    const skip = (page - 1) * limit;
    
    const campaigns = await Advocacy.find(filter)
      .select('-reports')
      .sort({ 'timeline.startDate': -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await Advocacy.countDocuments(filter);
    
    res.json({
      success: true,
      data: campaigns,
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

// Get specific Advocacy campaign
router.get('/:campaignId', async (req, res) => {
  try {
    const campaign = await Advocacy.findOne({ campaignId: req.params.campaignId });
    
    if (!campaign) {
      return res.status(404).json({ 
        success: false, 
        error: 'Campaign not found' 
      });
    }
    
    res.json({ success: true, data: campaign });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Create new Advocacy campaign
router.post('/', [
  body('campaignId').notEmpty().withMessage('Campaign ID is required'),
  body('title').notEmpty().withMessage('Title is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('category').isIn(['policy', 'awareness', 'funding', 'education', 'community', 'international']).withMessage('Invalid category'),
  body('target.region').notEmpty().withMessage('Target region is required'),
  body('target.country').notEmpty().withMessage('Target country is required'),
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
    
    const campaign = new Advocacy(req.body);
    await campaign.save();
    
    res.status(201).json({ success: true, data: campaign });
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ 
        success: false, 
        error: 'Campaign ID already exists' 
      });
    } else {
      res.status(500).json({ success: false, error: error.message });
    }
  }
});

// Update Advocacy campaign
router.put('/:campaignId', async (req, res) => {
  try {
    const campaign = await Advocacy.findOneAndUpdate(
      { campaignId: req.params.campaignId },
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!campaign) {
      return res.status(404).json({ 
        success: false, 
        error: 'Campaign not found' 
      });
    }
    
    res.json({ success: true, data: campaign });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Add milestone
router.post('/:campaignId/milestones', [
  body('name').notEmpty().withMessage('Milestone name is required'),
  body('date').isISO8601().withMessage('Date must be valid'),
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
    
    const campaign = await Advocacy.findOne({ campaignId: req.params.campaignId });
    
    if (!campaign) {
      return res.status(404).json({ 
        success: false, 
        error: 'Campaign not found' 
      });
    }
    
    await campaign.addMilestone(req.body);
    
    res.json({ success: true, message: 'Milestone added successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update milestone status
router.put('/:campaignId/milestones/:milestoneId', [
  body('status').isIn(['pending', 'in-progress', 'completed', 'overdue']).withMessage('Invalid status')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array() 
      });
    }
    
    const campaign = await Advocacy.findOne({ campaignId: req.params.campaignId });
    
    if (!campaign) {
      return res.status(404).json({ 
        success: false, 
        error: 'Campaign not found' 
      });
    }
    
    await campaign.updateMilestone(req.params.milestoneId, req.body.status);
    
    res.json({ success: true, message: 'Milestone updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Add report
router.post('/:campaignId/reports', [
  body('type').isIn(['progress', 'milestone', 'final', 'evaluation']).withMessage('Invalid report type'),
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
    
    const campaign = await Advocacy.findOne({ campaignId: req.params.campaignId });
    
    if (!campaign) {
      return res.status(404).json({ 
        success: false, 
        error: 'Campaign not found' 
      });
    }
    
    await campaign.addReport(req.body);
    
    res.json({ success: true, message: 'Report added successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update metrics
router.post('/:campaignId/metrics', async (req, res) => {
  try {
    const campaign = await Advocacy.findOne({ campaignId: req.params.campaignId });
    
    if (!campaign) {
      return res.status(404).json({ 
        success: false, 
        error: 'Campaign not found' 
      });
    }
    
    await campaign.updateMetrics(req.body);
    
    res.json({ success: true, message: 'Metrics updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get campaign analytics
router.get('/:campaignId/analytics', async (req, res) => {
  try {
    const campaign = await Advocacy.findOne({ campaignId: req.params.campaignId });
    
    if (!campaign) {
      return res.status(404).json({ 
        success: false, 
        error: 'Campaign not found' 
      });
    }
    
    const analytics = {
      campaignId: campaign.campaignId,
      title: campaign.title,
      status: campaign.status,
      progress: campaign.progress,
      effectivenessScore: campaign.effectivenessScore,
      timeline: campaign.timeline,
      objectives: campaign.objectives,
      strategies: campaign.strategies,
      metrics: campaign.metrics,
      partnerships: campaign.partnerships,
      impact: campaign.impact,
      recentReports: campaign.reports.slice(-5) // Last 5 reports
    };
    
    res.json({ success: true, data: analytics });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get global Advocacy statistics
router.get('/stats/global', async (req, res) => {
  try {
    const stats = await Advocacy.aggregate([
      {
        $group: {
          _id: null,
          totalCampaigns: { $sum: 1 },
          activeCampaigns: {
            $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] }
          },
          completedCampaigns: {
            $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
          },
          totalReach: { $sum: '$metrics.reach.socialMedia.followers' },
          totalEngagement: { $sum: '$metrics.engagement.petitionSignatures' },
          totalOutcomes: { $sum: '$metrics.outcomes.policyChanges' }
        }
      }
    ]);
    
    const categoryStats = await Advocacy.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          averageEffectiveness: { $avg: '$effectivenessScore' }
        }
      },
      { $sort: { count: -1 } }
    ]);
    
    const countryStats = await Advocacy.aggregate([
      {
        $group: {
          _id: '$target.country',
          campaignCount: { $sum: 1 },
          totalReach: { $sum: '$metrics.reach.socialMedia.followers' }
        }
      },
      { $sort: { campaignCount: -1 } },
      { $limit: 10 }
    ]);
    
    res.json({
      success: true,
      data: {
        global: stats[0] || {},
        categories: categoryStats,
        topCountries: countryStats
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Delete Advocacy campaign
router.delete('/:campaignId', async (req, res) => {
  try {
    const campaign = await Advocacy.findOneAndDelete({ campaignId: req.params.campaignId });
    
    if (!campaign) {
      return res.status(404).json({ 
        success: false, 
        error: 'Campaign not found' 
      });
    }
    
    res.json({ success: true, message: 'Campaign deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
