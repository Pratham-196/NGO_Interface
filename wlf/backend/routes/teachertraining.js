const express = require('express');
const router = express.Router();
const TeacherTraining = require('../models/TeacherTraining');
const { body, validationResult } = require('express-validator');

// Get all Teacher Training programs
router.get('/', async (req, res) => {
  try {
    const { status, type, level, country, page = 1, limit = 10 } = req.query;
    
    const filter = {};
    if (status) filter.status = status;
    if (type) filter.type = type;
    if (level) filter.level = level;
    if (country) filter['targetAudience.countries'] = country;
    
    const skip = (page - 1) * limit;
    
    const programs = await TeacherTraining.find(filter)
      .select('-reports')
      .sort({ 'schedule.startDate': -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await TeacherTraining.countDocuments(filter);
    
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

// Get specific Teacher Training program
router.get('/:programId', async (req, res) => {
  try {
    const program = await TeacherTraining.findOne({ programId: req.params.programId });
    
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

// Create new Teacher Training program
router.post('/', [
  body('programId').notEmpty().withMessage('Program ID is required'),
  body('title').notEmpty().withMessage('Title is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('type').isIn(['workshop', 'certification', 'online-course', 'mentorship', 'conference', 'seminar']).withMessage('Invalid program type'),
  body('level').isIn(['beginner', 'intermediate', 'advanced', 'expert']).withMessage('Invalid level'),
  body('enrollment.maxParticipants').isNumeric().withMessage('Max participants must be a number'),
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
    
    const program = new TeacherTraining(req.body);
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

// Update Teacher Training program
router.put('/:programId', async (req, res) => {
  try {
    const program = await TeacherTraining.findOneAndUpdate(
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

// Enroll teacher in program
router.post('/:programId/enroll', [
  body('teacherId').notEmpty().withMessage('Teacher ID is required'),
  body('name').notEmpty().withMessage('Teacher name is required'),
  body('school').notEmpty().withMessage('School name is required'),
  body('experience').isNumeric().withMessage('Experience must be a number')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array() 
      });
    }
    
    const program = await TeacherTraining.findOne({ programId: req.params.programId });
    
    if (!program) {
      return res.status(404).json({ 
        success: false, 
        error: 'Program not found' 
      });
    }
    
    await program.enrollTeacher(req.body);
    
    res.json({ success: true, message: 'Teacher enrolled successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update teacher progress
router.put('/:programId/teachers/:teacherId', [
  body('progress').optional().isNumeric(),
  body('attendance').optional().isNumeric(),
  body('status').optional().isIn(['enrolled', 'completed', 'dropped', 'waitlisted'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array() 
      });
    }
    
    const program = await TeacherTraining.findOne({ programId: req.params.programId });
    
    if (!program) {
      return res.status(404).json({ 
        success: false, 
        error: 'Program not found' 
      });
    }
    
    await program.updateTeacherProgress(req.params.teacherId, req.body);
    
    res.json({ success: true, message: 'Teacher progress updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Add program report
router.post('/:programId/reports', [
  body('type').isIn(['progress', 'completion', 'evaluation', 'impact']).withMessage('Invalid report type'),
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
    
    const program = await TeacherTraining.findOne({ programId: req.params.programId });
    
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
    const program = await TeacherTraining.findOne({ programId: req.params.programId });
    
    if (!program) {
      return res.status(404).json({ 
        success: false, 
        error: 'Program not found' 
      });
    }
    
    const analytics = {
      programId: program.programId,
      title: program.title,
      status: program.status,
      enrollmentRate: program.enrollmentRate,
      effectivenessScore: program.effectivenessScore,
      enrollment: program.enrollment,
      outcomes: program.outcomes,
      schedule: program.schedule,
      instructors: program.instructors,
      recentReports: program.reports.slice(-5) // Last 5 reports
    };
    
    res.json({ success: true, data: analytics });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get global Teacher Training statistics
router.get('/stats/global', async (req, res) => {
  try {
    const stats = await TeacherTraining.aggregate([
      {
        $group: {
          _id: null,
          totalPrograms: { $sum: 1 },
          activePrograms: {
            $sum: { $cond: [{ $eq: ['$status', 'ongoing'] }, 1, 0] }
          },
          totalTeachers: { $sum: '$enrollment.currentEnrollment' },
          totalCapacity: { $sum: '$enrollment.maxParticipants' },
          averageCompletionRate: { $avg: '$outcomes.completion.completionRate' },
          averageEffectiveness: { $avg: '$effectivenessScore' }
        }
      }
    ]);
    
    const typeStats = await TeacherTraining.aggregate([
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 },
          totalTeachers: { $sum: '$enrollment.currentEnrollment' },
          averageCompletion: { $avg: '$outcomes.completion.completionRate' }
        }
      },
      { $sort: { count: -1 } }
    ]);
    
    const levelStats = await TeacherTraining.aggregate([
      {
        $group: {
          _id: '$level',
          count: { $sum: 1 },
          totalTeachers: { $sum: '$enrollment.currentEnrollment' },
          averageEffectiveness: { $avg: '$effectivenessScore' }
        }
      },
      { $sort: { count: -1 } }
    ]);
    
    const countryStats = await TeacherTraining.aggregate([
      { $unwind: '$targetAudience.countries' },
      {
        $group: {
          _id: '$targetAudience.countries',
          programCount: { $sum: 1 },
          totalTeachers: { $sum: '$enrollment.currentEnrollment' }
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
        levels: levelStats,
        topCountries: countryStats
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Delete Teacher Training program
router.delete('/:programId', async (req, res) => {
  try {
    const program = await TeacherTraining.findOneAndDelete({ programId: req.params.programId });
    
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
