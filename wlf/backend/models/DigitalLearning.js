const mongoose = require('mongoose');

const digitalLearningSchema = new mongoose.Schema({
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
    enum: ['online-course', 'mobile-app', 'platform', 'tool', 'resource-library'],
    required: true
  },
  status: {
    type: String,
    enum: ['development', 'testing', 'launched', 'maintenance', 'archived'],
    default: 'development'
  },
  targetAudience: {
    primary: [String], // ['students', 'teachers', 'parents', 'administrators']
    ageGroups: [{
      min: Number,
      max: Number,
      label: String
    }],
    skillLevels: [String], // ['beginner', 'intermediate', 'advanced']
    languages: [String]
  },
  technology: {
    platform: {
      type: String,
      enum: ['web', 'mobile', 'desktop', 'tablet', 'mixed']
    },
    devices: [String], // ['smartphone', 'tablet', 'computer', 'laptop']
    requirements: {
      internet: Boolean,
      bandwidth: String,
      storage: String,
      operatingSystem: [String]
    },
    features: [String] // ['offline-mode', 'multimedia', 'interactive', 'gamification']
  },
  content: {
    modules: [{
      id: String,
      title: String,
      description: String,
      duration: Number, // in minutes
      type: {
        type: String,
        enum: ['video', 'text', 'interactive', 'quiz', 'assignment']
      },
      difficulty: String,
      prerequisites: [String],
      learningObjectives: [String]
    }],
    totalDuration: Number,
    languages: [String],
    subjects: [String],
    gradeLevels: [String]
  },
  enrollment: {
    totalUsers: { type: Number, default: 0 },
    activeUsers: { type: Number, default: 0 },
    completedUsers: { type: Number, default: 0 },
    dropoutRate: Number,
    averageCompletionTime: Number // in days
  },
  performance: {
    completionRate: Number,
    averageScore: Number,
    userSatisfaction: Number,
    technicalIssues: Number,
    uptime: Number // percentage
  },
  analytics: {
    usage: {
      dailyActiveUsers: Number,
      weeklyActiveUsers: Number,
      monthlyActiveUsers: Number,
      sessionDuration: Number, // average in minutes
      pageViews: Number,
      bounceRate: Number
    },
    engagement: {
      timeSpent: Number, // total hours
      interactions: Number,
      socialShares: Number,
      comments: Number,
      ratings: [{
        rating: Number,
        count: Number
      }]
    },
    learning: {
      quizAttempts: Number,
      averageQuizScore: Number,
      moduleCompletions: Number,
      certificateEarned: Number
    }
  },
  deployment: {
    regions: [String],
    countries: [String],
    launchDate: Date,
    version: String,
    updates: [{
      version: String,
      date: Date,
      changes: [String],
      impact: String
    }]
  },
  support: {
    documentation: [{
      type: String,
      title: String,
      url: String,
      language: String
    }],
    helpDesk: {
      available: Boolean,
      hours: String,
      contact: String,
      languages: [String]
    },
    community: {
      forum: Boolean,
      chat: Boolean,
      mentorship: Boolean,
      userGroups: [String]
    }
  },
  feedback: [{
    userId: String,
    rating: Number,
    comment: String,
    category: String,
    date: Date,
    helpful: Number,
    reported: Boolean
  }],
  issues: [{
    type: {
      type: String,
      enum: ['bug', 'feature-request', 'usability', 'performance', 'content']
    },
    severity: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical']
    },
    description: String,
    reportedBy: String,
    reportedDate: Date,
    status: {
      type: String,
      enum: ['open', 'in-progress', 'resolved', 'closed']
    },
    resolution: String,
    resolvedDate: Date
  }],
  partnerships: [{
    organization: String,
    type: String,
    contribution: String,
    contact: String,
    status: String,
    startDate: Date,
    endDate: Date
  }],
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
      type: String,
      period: String
    }]
  },
  impact: {
    quantitative: {
      learnersReached: Number,
      coursesCompleted: Number,
      skillsAcquired: Number,
      jobPlacements: Number
    },
    qualitative: {
      testimonials: [String],
      caseStudies: [String],
      successStories: [String]
    }
  },
  reports: [{
    type: {
      type: String,
      enum: ['usage', 'performance', 'impact', 'technical', 'financial']
    },
    title: String,
    content: String,
    data: Object,
    date: Date,
    author: String
  }]
}, {
  timestamps: true
});

// Indexes for better query performance
digitalLearningSchema.index({ type: 1, status: 1 });
digitalLearningSchema.index({ 'targetAudience.primary': 1 });
digitalLearningSchema.index({ 'deployment.countries': 1 });
digitalLearningSchema.index({ 'deployment.launchDate': 1 });

// Virtual for program health score
digitalLearningSchema.virtual('healthScore').get(function() {
  const performanceWeight = 0.4;
  const engagementWeight = 0.3;
  const technicalWeight = 0.3;
  
  const performanceScore = this.performance.completionRate || 0;
  const engagementScore = Math.min(100, (this.analytics.engagement.timeSpent / 100) * 10);
  const technicalScore = this.performance.uptime || 0;
  
  return Math.round(
    (performanceScore * performanceWeight) +
    (engagementScore * engagementWeight) +
    (technicalScore * technicalWeight)
  );
});

// Virtual for user satisfaction score
digitalLearningSchema.virtual('satisfactionScore').get(function() {
  const ratings = this.analytics.engagement.ratings;
  if (ratings.length === 0) return 0;
  
  const totalRatings = ratings.reduce((sum, rating) => sum + rating.count, 0);
  const weightedSum = ratings.reduce((sum, rating) => sum + (rating.rating * rating.count), 0);
  
  return totalRatings > 0 ? Math.round(weightedSum / totalRatings * 20) : 0; // Convert to 0-100 scale
});

// Method to add user feedback
digitalLearningSchema.methods.addFeedback = function(feedbackData) {
  this.feedback.push({
    userId: feedbackData.userId,
    rating: feedbackData.rating,
    comment: feedbackData.comment,
    category: feedbackData.category,
    date: new Date(),
    helpful: 0,
    reported: false
  });
  
  // Update analytics ratings
  const existingRating = this.analytics.engagement.ratings.find(r => r.rating === feedbackData.rating);
  if (existingRating) {
    existingRating.count += 1;
  } else {
    this.analytics.engagement.ratings.push({
      rating: feedbackData.rating,
      count: 1
    });
  }
  
  return this.save();
};

// Method to report issue
digitalLearningSchema.methods.reportIssue = function(issueData) {
  this.issues.push({
    type: issueData.type,
    severity: issueData.severity,
    description: issueData.description,
    reportedBy: issueData.reportedBy,
    reportedDate: new Date(),
    status: 'open'
  });
  return this.save();
};

// Method to update analytics
digitalLearningSchema.methods.updateAnalytics = function(analyticsData) {
  Object.keys(analyticsData).forEach(key => {
    if (this.analytics[key]) {
      Object.assign(this.analytics[key], analyticsData[key]);
    }
  });
  return this.save();
};

// Method to add program report
digitalLearningSchema.methods.addReport = function(reportData) {
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

module.exports = mongoose.model('DigitalLearning', digitalLearningSchema);
