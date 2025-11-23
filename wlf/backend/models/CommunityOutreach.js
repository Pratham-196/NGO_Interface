const mongoose = require('mongoose');

const communityOutreachSchema = new mongoose.Schema({
  programId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  name: {
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
    enum: ['awareness', 'engagement', 'support', 'volunteer', 'partnership', 'advocacy'],
    required: true
  },
  status: {
    type: String,
    enum: ['planning', 'active', 'completed', 'paused', 'cancelled'],
    default: 'planning'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  targetCommunity: {
    demographics: {
      ageGroups: [String], // ['children', 'youth', 'adults', 'seniors']
      education: [String], // ['illiterate', 'primary', 'secondary', 'tertiary']
      income: String, // 'low', 'medium', 'high', 'mixed'
      languages: [String]
    },
    location: {
      region: {
        type: String,
        required: true
      },
      country: {
        type: String,
        required: true
      },
      specificAreas: [String], // neighborhoods, villages, districts
      coordinates: [{
        latitude: Number,
        longitude: Number,
        name: String
      }]
    },
    size: {
      estimatedPopulation: Number,
      targetReach: Number,
      actualReach: Number
    }
  },
  objectives: [{
    description: String,
    measurable: Boolean,
    targetValue: String,
    currentValue: String,
    deadline: Date,
    status: {
      type: String,
      enum: ['not-started', 'in-progress', 'achieved', 'not-achieved']
    }
  }],
  activities: [{
    name: String,
    type: {
      type: String,
      enum: ['workshop', 'seminar', 'campaign', 'event', 'meeting', 'training', 'support-group']
    },
    description: String,
    schedule: {
      startDate: Date,
      endDate: Date,
      frequency: String,
      duration: Number // in hours
    },
    location: {
      name: String,
      address: String,
      type: {
        type: String,
        enum: ['community-center', 'school', 'public-space', 'online', 'home']
      }
    },
    resources: {
      materials: [String],
      equipment: [String],
      budget: Number
    },
    participants: {
      expected: Number,
      actual: Number,
      demographics: Object
    },
    outcomes: {
      attendance: Number,
      engagement: Number,
      feedback: Number,
      followUp: Boolean
    }
  }],
  team: {
    coordinators: [{
      name: String,
      role: String,
      experience: Number,
      contact: {
        email: String,
        phone: String
      },
      availability: String
    }],
    volunteers: {
      total: Number,
      active: Number,
      roles: [String],
      training: {
        provided: Boolean,
        duration: Number,
        topics: [String]
      }
    },
    partners: [{
      organization: String,
      contact: String,
      contribution: String,
      status: String
    }]
  },
  resources: {
    budget: {
      total: Number,
      allocated: Number,
      spent: Number,
      remaining: Number,
      currency: String
    },
    materials: [{
      item: String,
      quantity: Number,
      cost: Number,
      supplier: String,
      status: String
    }],
    equipment: [{
      name: String,
      type: String,
      condition: String,
      location: String,
      maintenance: Date
    }],
    transportation: {
      vehicles: Number,
      fuel: Number,
      driver: String,
      schedule: String
    }
  },
  engagement: {
    methods: [{
      type: String, // 'door-to-door', 'community-events', 'social-media', 'word-of-mouth'
      effectiveness: Number,
      reach: Number,
      cost: Number
    }],
    communication: {
      languages: [String],
      channels: [String], // 'radio', 'television', 'print', 'digital', 'face-to-face'
      frequency: String
    },
    feedback: {
      collection: String,
      frequency: String,
      response: Number,
      improvements: [String]
    }
  },
  impact: {
    quantitative: {
      peopleReached: Number,
      eventsConducted: Number,
      materialsDistributed: Number,
      volunteersTrained: Number,
      partnershipsFormed: Number,
      awarenessIncrease: Number // percentage
    },
    qualitative: {
      testimonials: [String],
      successStories: [String],
      communityFeedback: [String],
      challenges: [String],
      lessonsLearned: [String]
    },
    sustainability: {
      communityOwnership: Number, // percentage
      localLeadership: Number,
      resourceAvailability: Number,
      longTermEngagement: Boolean
    }
  },
  challenges: [{
    type: String,
    description: String,
    impact: String,
    solution: String,
    status: String,
    date: Date
  }],
  partnerships: [{
    organization: String,
    type: String, // 'funding', 'resources', 'expertise', 'networking'
    contact: String,
    contribution: String,
    status: String,
    startDate: Date,
    endDate: Date,
    outcomes: String
  }],
  evaluation: {
    metrics: [{
      name: String,
      target: Number,
      actual: Number,
      unit: String,
      frequency: String
    }],
    assessments: [{
      type: String,
      date: Date,
      results: Object,
      recommendations: [String]
    }],
    reports: [{
      type: String,
      title: String,
      content: String,
      date: Date,
      author: String
    }]
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
    }],
    phases: [{
      name: String,
      startDate: Date,
      endDate: Date,
      activities: [String],
      status: String
    }]
  },
  sustainability: {
    communityCapacity: {
      localLeaders: Number,
      trainedVolunteers: Number,
      resources: Number,
      knowledge: Number
    },
    longTermPlan: {
      vision: String,
      goals: [String],
      timeline: String,
      resources: String
    },
    exitStrategy: {
      planned: Boolean,
      timeline: String,
      handover: String,
      support: String
    }
  }
}, {
  timestamps: true
});

// Indexes for better query performance
communityOutreachSchema.index({ type: 1, status: 1 });
communityOutreachSchema.index({ 'targetCommunity.location.country': 1, 'targetCommunity.location.region': 1 });
communityOutreachSchema.index({ priority: 1 });
communityOutreachSchema.index({ 'timeline.startDate': 1 });

// Virtual for program reach rate
communityOutreachSchema.virtual('reachRate').get(function() {
  return this.targetCommunity.size.targetReach > 0 
    ? Math.round((this.targetCommunity.size.actualReach / this.targetCommunity.size.targetReach) * 100)
    : 0;
});

// Virtual for program effectiveness score
communityOutreachSchema.virtual('effectivenessScore').get(function() {
  const reachWeight = 0.3;
  const engagementWeight = 0.3;
  const impactWeight = 0.2;
  const sustainabilityWeight = 0.2;
  
  const reachScore = this.reachRate;
  const engagementScore = this.engagement.feedback.response || 0;
  const impactScore = this.impact.quantitative.awarenessIncrease || 0;
  const sustainabilityScore = this.sustainability.communityCapacity.localLeaders * 10;
  
  return Math.round(
    (reachScore * reachWeight) +
    (engagementScore * engagementWeight) +
    (impactScore * impactWeight) +
    (sustainabilityScore * sustainabilityWeight)
  );
});

// Method to add activity
communityOutreachSchema.methods.addActivity = function(activityData) {
  this.activities.push({
    name: activityData.name,
    type: activityData.type,
    description: activityData.description,
    schedule: activityData.schedule,
    location: activityData.location,
    resources: activityData.resources,
    participants: activityData.participants,
    outcomes: activityData.outcomes
  });
  return this.save();
};

// Method to update impact metrics
communityOutreachSchema.methods.updateImpact = function(impactData) {
  Object.keys(impactData.quantitative || {}).forEach(key => {
    if (this.impact.quantitative[key] !== undefined) {
      this.impact.quantitative[key] = impactData.quantitative[key];
    }
  });
  
  if (impactData.qualitative) {
    Object.keys(impactData.qualitative).forEach(key => {
      if (this.impact.qualitative[key]) {
        this.impact.qualitative[key] = impactData.qualitative[key];
      }
    });
  }
  
  return this.save();
};

// Method to add evaluation report
communityOutreachSchema.methods.addEvaluationReport = function(reportData) {
  this.evaluation.reports.push({
    type: reportData.type,
    title: reportData.title,
    content: reportData.content,
    date: new Date(),
    author: reportData.author
  });
  return this.save();
};

module.exports = mongoose.model('CommunityOutreach', communityOutreachSchema);
