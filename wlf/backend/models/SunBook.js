const mongoose = require('mongoose');

const sunBookSchema = new mongoose.Schema({
  deviceId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  location: {
    school: {
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
    enum: ['active', 'maintenance', 'offline', 'deployed'],
    default: 'deployed'
  },
  batteryLevel: {
    type: Number,
    min: 0,
    max: 100,
    default: 100
  },
  solarPanelEfficiency: {
    type: Number,
    min: 0,
    max: 100,
    default: 85
  },
  content: {
    books: [{
      title: String,
      language: String,
      category: String,
      readingLevel: String,
      downloadDate: Date,
      lastAccessed: Date,
      accessCount: { type: Number, default: 0 }
    }],
    lastUpdate: Date,
    totalBooks: { type: Number, default: 0 }
  },
  usage: {
    totalSessions: { type: Number, default: 0 },
    totalReadingTime: { type: Number, default: 0 }, // in minutes
    uniqueUsers: { type: Number, default: 0 },
    lastActivity: Date,
    dailyUsage: [{
      date: Date,
      sessions: Number,
      readingTime: Number,
      uniqueUsers: Number
    }]
  },
  maintenance: {
    lastService: Date,
    nextService: Date,
    issues: [{
      type: String,
      description: String,
      reportedAt: Date,
      resolvedAt: Date,
      status: { type: String, enum: ['open', 'in-progress', 'resolved'] }
    }]
  },
  performance: {
    averageSessionDuration: Number,
    mostPopularBooks: [String],
    peakUsageHours: [Number],
    userSatisfactionScore: Number
  }
}, {
  timestamps: true
});

// Indexes for better query performance
sunBookSchema.index({ 'location.country': 1, 'location.region': 1 });
sunBookSchema.index({ status: 1 });
sunBookSchema.index({ 'usage.lastActivity': -1 });

// Virtual for device health score
sunBookSchema.virtual('healthScore').get(function() {
  const batteryWeight = 0.3;
  const efficiencyWeight = 0.3;
  const usageWeight = 0.2;
  const maintenanceWeight = 0.2;
  
  const batteryScore = this.batteryLevel;
  const efficiencyScore = this.solarPanelEfficiency;
  const usageScore = this.usage.totalSessions > 0 ? Math.min(100, (this.usage.totalSessions / 100) * 100) : 0;
  const maintenanceScore = this.maintenance.issues.filter(issue => issue.status === 'resolved').length === 0 ? 100 : 50;
  
  return Math.round(
    (batteryScore * batteryWeight) +
    (efficiencyScore * efficiencyWeight) +
    (usageScore * usageWeight) +
    (maintenanceScore * maintenanceWeight)
  );
});

// Method to update usage statistics
sunBookSchema.methods.updateUsage = function(sessionData) {
  this.usage.totalSessions += 1;
  this.usage.totalReadingTime += sessionData.duration || 0;
  this.usage.lastActivity = new Date();
  
  // Update daily usage
  const today = new Date().toDateString();
  const todayUsage = this.usage.dailyUsage.find(day => 
    new Date(day.date).toDateString() === today
  );
  
  if (todayUsage) {
    todayUsage.sessions += 1;
    todayUsage.readingTime += sessionData.duration || 0;
  } else {
    this.usage.dailyUsage.push({
      date: new Date(),
      sessions: 1,
      readingTime: sessionData.duration || 0,
      uniqueUsers: 1
    });
  }
  
  return this.save();
};

// Method to add maintenance issue
sunBookSchema.methods.addMaintenanceIssue = function(issueData) {
  this.maintenance.issues.push({
    type: issueData.type,
    description: issueData.description,
    reportedAt: new Date(),
    status: 'open'
  });
  
  return this.save();
};

module.exports = mongoose.model('SunBook', sunBookSchema);
