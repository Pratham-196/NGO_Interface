const mongoose = require('mongoose');

const advocacySchema = new mongoose.Schema({
  campaignId: {
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
  category: {
    type: String,
    enum: ['policy', 'awareness', 'funding', 'education', 'community', 'international'],
    required: true
  },
  status: {
    type: String,
    enum: ['planning', 'active', 'paused', 'completed', 'cancelled'],
    default: 'planning'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  target: {
    audience: [String], // ['government', 'public', 'educators', 'parents', 'students']
    region: {
      type: String,
      required: true
    },
    country: {
      type: String,
      required: true
    },
    specificTargets: [String] // Specific organizations, officials, etc.
  },
  timeline: {
    startDate: {
      type: Date,
      required: true
    },
    endDate: Date,
    milestones: [{
      name: String,
      date: Date,
      status: {
        type: String,
        enum: ['pending', 'in-progress', 'completed', 'overdue']
      },
      description: String
    }]
  },
  objectives: [{
    description: String,
    measurable: Boolean,
    targetValue: String,
    currentValue: String,
    status: {
      type: String,
      enum: ['not-started', 'in-progress', 'achieved', 'not-achieved']
    }
  }],
  strategies: [{
    type: {
      type: String,
      enum: ['social-media', 'petitions', 'events', 'meetings', 'media', 'partnerships', 'research']
    },
    description: String,
    platform: String,
    targetReach: Number,
    actualReach: Number,
    effectiveness: Number // 1-10 scale
  }],
  resources: {
    budget: {
      allocated: Number,
      spent: Number,
      remaining: Number,
      currency: String
    },
    team: [{
      name: String,
      role: String,
      responsibilities: [String],
      timeCommitment: String
    }],
    materials: [{
      type: String,
      name: String,
      quantity: Number,
      cost: Number,
      status: String
    }]
  },
  metrics: {
    reach: {
      socialMedia: {
        followers: Number,
        posts: Number,
        engagement: Number,
        shares: Number
      },
      events: {
        totalEvents: Number,
        totalAttendees: Number,
        averageAttendance: Number
      },
      media: {
        pressReleases: Number,
        mediaMentions: Number,
        interviews: Number
      }
    },
    engagement: {
      petitionSignatures: Number,
      volunteerSignups: Number,
      donations: Number,
      emailSubscribers: Number
    },
    outcomes: {
      policyChanges: Number,
      awarenessIncrease: Number,
      partnershipFormed: Number,
      fundingSecured: Number
    }
  },
  partnerships: [{
    organization: String,
    type: String,
    contact: String,
    contribution: String,
    status: String,
    startDate: Date,
    endDate: Date
  }],
  challenges: [{
    description: String,
    impact: String,
    solution: String,
    status: String,
    date: Date
  }],
  successFactors: [{
    factor: String,
    impact: String,
    lessons: String
  }],
  reports: [{
    type: {
      type: String,
      enum: ['progress', 'milestone', 'final', 'evaluation']
    },
    title: String,
    content: String,
    date: Date,
    author: String,
    attachments: [String]
  }],
  impact: {
    quantitative: {
      peopleReached: Number,
      policyInfluence: Number,
      mediaCoverage: Number,
      fundingRaised: Number
    },
    qualitative: {
      testimonials: [String],
      caseStudies: [String],
      lessonsLearned: [String]
    }
  }
}, {
  timestamps: true
});

// Indexes for better query performance
advocacySchema.index({ category: 1, status: 1 });
advocacySchema.index({ 'target.country': 1, 'target.region': 1 });
advocacySchema.index({ priority: 1 });
advocacySchema.index({ 'timeline.startDate': 1 });

// Virtual for campaign progress
advocacySchema.virtual('progress').get(function() {
  const totalMilestones = this.timeline.milestones.length;
  const completedMilestones = this.timeline.milestones.filter(m => m.status === 'completed').length;
  return totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 0;
});

// Virtual for campaign effectiveness score
advocacySchema.virtual('effectivenessScore').get(function() {
  const reachWeight = 0.3;
  const engagementWeight = 0.3;
  const outcomeWeight = 0.4;
  
  const reachScore = Math.min(100, (this.metrics.reach.socialMedia.followers / 1000) * 10);
  const engagementScore = Math.min(100, (this.metrics.engagement.petitionSignatures / 100) * 10);
  const outcomeScore = this.metrics.outcomes.policyChanges * 20;
  
  return Math.round(
    (reachScore * reachWeight) +
    (engagementScore * engagementWeight) +
    (outcomeScore * outcomeWeight)
  );
});

// Method to add milestone
advocacySchema.methods.addMilestone = function(milestoneData) {
  this.timeline.milestones.push({
    name: milestoneData.name,
    date: milestoneData.date,
    status: 'pending',
    description: milestoneData.description
  });
  return this.save();
};

// Method to update milestone status
advocacySchema.methods.updateMilestone = function(milestoneId, status) {
  const milestone = this.timeline.milestones.id(milestoneId);
  if (milestone) {
    milestone.status = status;
    return this.save();
  }
  throw new Error('Milestone not found');
};

// Method to add campaign report
advocacySchema.methods.addReport = function(reportData) {
  this.reports.push({
    type: reportData.type,
    title: reportData.title,
    content: reportData.content,
    date: new Date(),
    author: reportData.author
  });
  return this.save();
};

// Method to update metrics
advocacySchema.methods.updateMetrics = function(metricsData) {
  Object.keys(metricsData).forEach(key => {
    if (this.metrics[key]) {
      Object.assign(this.metrics[key], metricsData[key]);
    }
  });
  return this.save();
};

module.exports = mongoose.model('Advocacy', advocacySchema);
