const mongoose = require('mongoose');

const literacyHubSchema = new mongoose.Schema({
  hubId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  location: {
    name: {
      type: String,
      required: true,
      trim: true
    },
    address: {
      type: String,
      required: true,
      trim: true
    },
    region: {
      type: String,
      required: true,
      trim: true
    },
    country: {
      type: String,
      required: true,
      trim: true
    },
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'maintenance', 'closed'],
    default: 'active'
  },
  capacity: {
    maxStudents: {
      type: Number,
      required: true,
      min: 1
    },
    currentEnrollment: {
      type: Number,
      default: 0,
      min: 0
    },
    availableSlots: {
      type: Number,
      default: function() {
        return this.capacity.maxStudents - this.capacity.currentEnrollment;
      }
    }
  },
  programs: [{
    name: String,
    type: {
      type: String,
      enum: ['after-school', 'weekend', 'summer', 'adult-literacy', 'teacher-training']
    },
    ageGroup: {
      min: Number,
      max: Number
    },
    schedule: {
      days: [String], // ['Monday', 'Tuesday', etc.]
      startTime: String,
      endTime: String
    },
    duration: Number, // in weeks
    status: {
      type: String,
      enum: ['active', 'completed', 'upcoming', 'cancelled'],
      default: 'active'
    },
    enrollmentCount: { type: Number, default: 0 }
  }],
  staff: [{
    name: String,
    role: {
      type: String,
      enum: ['coordinator', 'tutor', 'volunteer', 'admin']
    },
    qualifications: String,
    experience: Number, // years
    contact: {
      email: String,
      phone: String
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'on-leave'],
      default: 'active'
    }
  }],
  resources: {
    books: {
      total: { type: Number, default: 0 },
      categories: [{
        category: String,
        count: Number
      }],
      languages: [{
        language: String,
        count: Number
      }]
    },
    equipment: [{
      type: String,
      count: Number,
      condition: {
        type: String,
        enum: ['excellent', 'good', 'fair', 'poor', 'needs-replacement']
      }
    }],
    technology: {
      computers: Number,
      tablets: Number,
      internet: Boolean,
      projector: Boolean
    }
  },
  performance: {
    studentProgress: {
      totalStudents: { type: Number, default: 0 },
      completedPrograms: { type: Number, default: 0 },
      improvedLiteracy: { type: Number, default: 0 },
      averageImprovement: Number // percentage
    },
    attendance: {
      averageDaily: Number,
      peakDays: [String],
      seasonalPatterns: [{
        month: String,
        attendance: Number
      }]
    },
    outcomes: {
      literacyGains: Number,
      graduationRate: Number,
      parentSatisfaction: Number,
      communityImpact: Number
    }
  },
  funding: {
    sources: [{
      type: String,
      amount: Number,
      currency: String,
      period: String
    }],
    budget: {
      total: Number,
      spent: Number,
      remaining: Number
    },
    needs: [{
      item: String,
      priority: {
        type: String,
        enum: ['high', 'medium', 'low']
      },
      estimatedCost: Number,
      status: {
        type: String,
        enum: ['needed', 'funded', 'purchased']
      }
    }]
  },
  community: {
    partnerships: [{
      organization: String,
      type: String,
      contact: String,
      status: String
    }],
    volunteers: {
      active: Number,
      total: Number,
      roles: [String]
    },
    parentEngagement: {
      participationRate: Number,
      feedbackScore: Number,
      events: [{
        name: String,
        date: Date,
        attendance: Number
      }]
    }
  },
  reports: [{
    type: {
      type: String,
      enum: ['monthly', 'quarterly', 'annual', 'incident', 'achievement']
    },
    title: String,
    content: String,
    date: Date,
    author: String,
    attachments: [String]
  }]
}, {
  timestamps: true
});

// Indexes for better query performance
literacyHubSchema.index({ 'location.country': 1, 'location.region': 1 });
literacyHubSchema.index({ status: 1 });
literacyHubSchema.index({ 'capacity.availableSlots': 1 });

// Virtual for hub utilization rate
literacyHubSchema.virtual('utilizationRate').get(function() {
  return this.capacity.maxStudents > 0 
    ? Math.round((this.capacity.currentEnrollment / this.capacity.maxStudents) * 100)
    : 0;
});

// Virtual for overall performance score
literacyHubSchema.virtual('performanceScore').get(function() {
  const attendanceWeight = 0.3;
  const progressWeight = 0.4;
  const satisfactionWeight = 0.3;
  
  const attendanceScore = this.performance.attendance.averageDaily || 0;
  const progressScore = this.performance.studentProgress.averageImprovement || 0;
  const satisfactionScore = this.performance.outcomes.parentSatisfaction || 0;
  
  return Math.round(
    (attendanceScore * attendanceWeight) +
    (progressScore * progressWeight) +
    (satisfactionScore * satisfactionWeight)
  );
});

// Method to enroll student
literacyHubSchema.methods.enrollStudent = function(programId) {
  const program = this.programs.id(programId);
  if (program && program.status === 'active') {
    program.enrollmentCount += 1;
    this.capacity.currentEnrollment += 1;
    return this.save();
  }
  throw new Error('Program not found or not active');
};

// Method to add performance report
literacyHubSchema.methods.addReport = function(reportData) {
  this.reports.push({
    type: reportData.type,
    title: reportData.title,
    content: reportData.content,
    date: new Date(),
    author: reportData.author
  });
  return this.save();
};

// Method to update student progress
literacyHubSchema.methods.updateStudentProgress = function(progressData) {
  this.performance.studentProgress.totalStudents += progressData.newStudents || 0;
  this.performance.studentProgress.completedPrograms += progressData.completed || 0;
  this.performance.studentProgress.improvedLiteracy += progressData.improved || 0;
  
  // Recalculate average improvement
  const totalStudents = this.performance.studentProgress.totalStudents;
  const improvedStudents = this.performance.studentProgress.improvedLiteracy;
  this.performance.studentProgress.averageImprovement = totalStudents > 0 
    ? Math.round((improvedStudents / totalStudents) * 100)
    : 0;
  
  return this.save();
};

module.exports = mongoose.model('LiteracyHub', literacyHubSchema);
