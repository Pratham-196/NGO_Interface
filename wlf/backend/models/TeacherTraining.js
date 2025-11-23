const mongoose = require('mongoose');

const teacherTrainingSchema = new mongoose.Schema({
  programId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['workshop', 'certification', 'online-course', 'mentorship', 'conference', 'seminar'],
    required: true
  },
  status: {
    type: String,
    enum: ['scheduled', 'ongoing', 'completed', 'cancelled', 'postponed'],
    default: 'scheduled'
  },
  level: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced', 'expert'],
    required: true
  },
  targetAudience: {
    primary: [String], // ['primary-teachers', 'secondary-teachers', 'administrators', 'volunteers']
    experience: {
      min: Number,
      max: Number
    },
    subjects: [String], // ['literacy', 'mathematics', 'science', 'language']
    regions: [String],
    countries: [String]
  },
  curriculum: {
    modules: [{
      id: String,
      title: String,
      description: String,
      duration: Number, // in hours
      type: {
        type: String,
        enum: ['theory', 'practical', 'assessment', 'field-work']
      },
      learningObjectives: [String],
      resources: [String],
      prerequisites: [String]
    }],
    totalDuration: Number, // in hours
    certification: {
      required: Boolean,
      criteria: String,
      validity: Number // in months
    },
    assessment: {
      type: String,
      weightage: Number,
      passingScore: Number
    }
  },
  schedule: {
    startDate: {
      type: Date,
      required: true
    },
    endDate: Date,
    sessions: [{
      date: Date,
      time: String,
      duration: Number,
      topic: String,
      instructor: String,
      location: String,
      type: {
        type: String,
        enum: ['in-person', 'online', 'hybrid']
      }
    }],
    timezone: String,
    frequency: String // 'daily', 'weekly', 'monthly'
  },
  instructors: [{
    name: String,
    qualifications: String,
    experience: Number, // years
    specialization: [String],
    contact: {
      email: String,
      phone: String
    },
    bio: String,
    photo: String
  }],
  enrollment: {
    maxParticipants: {
      type: Number,
      required: true
    },
    currentEnrollment: {
      type: Number,
      default: 0
    },
    waitlist: {
      type: Number,
      default: 0
    },
    participants: [{
      teacherId: String,
      name: String,
      school: String,
      experience: Number,
      enrollmentDate: Date,
      status: {
        type: String,
        enum: ['enrolled', 'completed', 'dropped', 'waitlisted']
      },
      progress: Number, // percentage
      attendance: Number // percentage
    }]
  },
  resources: {
    materials: [{
      type: String,
      title: String,
      format: String, // 'pdf', 'video', 'audio', 'interactive'
      url: String,
      size: String,
      language: String
    }],
    equipment: [{
      name: String,
      quantity: Number,
      condition: String,
      location: String
    }],
    technology: {
      platform: String,
      requirements: [String],
      support: String
    }
  },
  outcomes: {
    completion: {
      totalEnrolled: Number,
      completed: Number,
      completionRate: Number,
      averageTime: Number // in days
    },
    assessment: {
      averageScore: Number,
      passRate: Number,
      distinctionRate: Number
    },
    feedback: {
      averageRating: Number,
      totalResponses: Number,
      commonThemes: [String]
    },
    impact: {
      teachersImproved: Number,
      schoolsBenefited: Number,
      studentsReached: Number,
      knowledgeRetention: Number // percentage after 6 months
    }
  },
  funding: {
    budget: {
      total: Number,
      spent: Number,
      remaining: Number,
      currency: String
    },
    sources: [{
      organization: String,
      amount: Number,
      type: String, // 'grant', 'donation', 'fee'
      status: String
    }],
    costs: {
      instructorFees: Number,
      materials: Number,
      venue: Number,
      technology: Number,
      travel: Number
    }
  },
  partnerships: [{
    organization: String,
    type: String, // 'funding', 'instructor', 'venue', 'materials'
    contribution: String,
    contact: String,
    status: String,
    startDate: Date,
    endDate: Date
  }],
  logistics: {
    venue: {
      name: String,
      address: String,
      capacity: Number,
      facilities: [String],
      accessibility: Boolean
    },
    accommodation: {
      provided: Boolean,
      details: String,
      cost: Number
    },
    meals: {
      provided: Boolean,
      type: String, // 'breakfast', 'lunch', 'dinner', 'all'
      cost: Number
    },
    transportation: {
      provided: Boolean,
      details: String,
      cost: Number
    }
  },
  evaluation: {
    preTraining: {
      assessment: String,
      baseline: Number,
      expectations: [String]
    },
    postTraining: {
      assessment: String,
      improvement: Number,
      satisfaction: Number,
      recommendations: [String]
    },
    followUp: {
      scheduled: Boolean,
      date: Date,
      method: String,
      focus: [String]
    }
  },
  reports: [{
    type: {
      type: String,
      enum: ['progress', 'completion', 'evaluation', 'impact']
    },
    title: String,
    content: String,
    data: Object,
    date: Date,
    author: String,
    attachments: [String]
  }]
}, {
  timestamps: true
});

// Indexes for better query performance
teacherTrainingSchema.index({ type: 1, status: 1 });
teacherTrainingSchema.index({ level: 1 });
teacherTrainingSchema.index({ 'targetAudience.countries': 1 });
teacherTrainingSchema.index({ 'schedule.startDate': 1 });

// Virtual for enrollment rate
teacherTrainingSchema.virtual('enrollmentRate').get(function() {
  return this.enrollment.maxParticipants > 0 
    ? Math.round((this.enrollment.currentEnrollment / this.enrollment.maxParticipants) * 100)
    : 0;
});

// Virtual for program effectiveness score
teacherTrainingSchema.virtual('effectivenessScore').get(function() {
  const completionWeight = 0.3;
  const assessmentWeight = 0.3;
  const feedbackWeight = 0.2;
  const impactWeight = 0.2;
  
  const completionScore = this.outcomes.completion.completionRate || 0;
  const assessmentScore = this.outcomes.assessment.averageScore || 0;
  const feedbackScore = (this.outcomes.feedback.averageRating || 0) * 20; // Convert 5-point to 100-point
  const impactScore = this.outcomes.impact.knowledgeRetention || 0;
  
  return Math.round(
    (completionScore * completionWeight) +
    (assessmentScore * assessmentWeight) +
    (feedbackScore * feedbackWeight) +
    (impactScore * impactWeight)
  );
});

// Method to enroll teacher
teacherTrainingSchema.methods.enrollTeacher = function(teacherData) {
  if (this.enrollment.currentEnrollment < this.enrollment.maxParticipants) {
    this.enrollment.participants.push({
      teacherId: teacherData.teacherId,
      name: teacherData.name,
      school: teacherData.school,
      experience: teacherData.experience,
      enrollmentDate: new Date(),
      status: 'enrolled',
      progress: 0,
      attendance: 0
    });
    this.enrollment.currentEnrollment += 1;
    return this.save();
  } else {
    // Add to waitlist
    this.enrollment.participants.push({
      teacherId: teacherData.teacherId,
      name: teacherData.name,
      school: teacherData.school,
      experience: teacherData.experience,
      enrollmentDate: new Date(),
      status: 'waitlisted',
      progress: 0,
      attendance: 0
    });
    this.enrollment.waitlist += 1;
    return this.save();
  }
};

// Method to update teacher progress
teacherTrainingSchema.methods.updateTeacherProgress = function(teacherId, progressData) {
  const participant = this.enrollment.participants.find(p => p.teacherId === teacherId);
  if (participant) {
    participant.progress = progressData.progress || participant.progress;
    participant.attendance = progressData.attendance || participant.attendance;
    if (progressData.status) {
      participant.status = progressData.status;
    }
    return this.save();
  }
  throw new Error('Teacher not found in program');
};

// Method to add program report
teacherTrainingSchema.methods.addReport = function(reportData) {
  this.reports.push({
    type: reportData.type,
    title: reportData.title,
    content: reportData.content,
    data: reportData.data,
    date: new Date(),
    author: reportData.author
  });
  return this.save();
};

module.exports = mongoose.model('TeacherTraining', teacherTrainingSchema);
