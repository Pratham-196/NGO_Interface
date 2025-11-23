const mongoose = require('mongoose');
const SunBook = require('./models/SunBook');
const LiteracyHub = require('./models/LiteracyHub');
const Advocacy = require('./models/Advocacy');
const DigitalLearning = require('./models/DigitalLearning');

// Extended sample data for all programs
const sampleLiteracyHubs = [
  {
    hubId: 'LH-IND-001',
    location: {
      name: 'Community Learning Center',
      address: '123 Education Street, Mumbai',
      region: 'Maharashtra',
      country: 'India',
      coordinates: { latitude: 19.0760, longitude: 72.8777 }
    },
    status: 'active',
    capacity: {
      maxStudents: 50,
      currentEnrollment: 45
    },
    programs: [
      {
        name: 'After-School Reading Program',
        type: 'after-school',
        ageGroup: { min: 6, max: 12 },
        schedule: {
          days: ['Monday', 'Wednesday', 'Friday'],
          startTime: '15:00',
          endTime: '17:00'
        },
        duration: 12,
        status: 'active',
        enrollmentCount: 25
      },
      {
        name: 'Weekend Literacy Workshop',
        type: 'weekend',
        ageGroup: { min: 8, max: 14 },
        schedule: {
          days: ['Saturday'],
          startTime: '10:00',
          endTime: '12:00'
        },
        duration: 8,
        status: 'active',
        enrollmentCount: 20
      }
    ],
    staff: [
      {
        name: 'Priya Sharma',
        role: 'coordinator',
        qualifications: 'M.Ed in Elementary Education',
        experience: 8,
        contact: {
          email: 'priya.sharma@wlf.org',
          phone: '+91-9876543210'
        },
        status: 'active'
      },
      {
        name: 'Raj Kumar',
        role: 'tutor',
        qualifications: 'B.Ed in English Literature',
        experience: 5,
        contact: {
          email: 'raj.kumar@wlf.org',
          phone: '+91-9876543211'
        },
        status: 'active'
      }
    ],
    resources: {
      books: {
        total: 500,
        categories: [
          { category: 'Children\'s Literature', count: 200 },
          { category: 'Educational', count: 150 },
          { category: 'Reference', count: 100 },
          { category: 'Multilingual', count: 50 }
        ],
        languages: [
          { language: 'English', count: 300 },
          { language: 'Hindi', count: 150 },
          { language: 'Marathi', count: 50 }
        ]
      },
      equipment: [
        { type: 'Tables', count: 10, condition: 'good' },
        { type: 'Chairs', count: 50, condition: 'good' },
        { type: 'Whiteboard', count: 2, condition: 'excellent' }
      ],
      technology: {
        computers: 5,
        tablets: 8,
        internet: true,
        projector: true
      }
    },
    performance: {
      studentProgress: {
        totalStudents: 45,
        completedPrograms: 12,
        improvedLiteracy: 38,
        averageImprovement: 85
      },
      attendance: {
        averageDaily: 42,
        peakDays: ['Monday', 'Wednesday', 'Friday'],
        seasonalPatterns: [
          { month: 'January', attendance: 45 },
          { month: 'February', attendance: 43 },
          { month: 'March', attendance: 40 }
        ]
      },
      outcomes: {
        literacyGains: 85,
        graduationRate: 92,
        parentSatisfaction: 4.5,
        communityImpact: 4.2
      }
    },
    funding: {
      sources: [
        { type: 'Government Grant', amount: 50000, currency: 'INR', period: 'Annual' },
        { type: 'Private Donation', amount: 25000, currency: 'INR', period: 'Annual' }
      ],
      budget: {
        total: 100000,
        spent: 75000,
        remaining: 25000
      },
      needs: [
        { item: 'New Books', priority: 'high', estimatedCost: 15000, status: 'needed' },
        { item: 'Computer Upgrade', priority: 'medium', estimatedCost: 20000, status: 'needed' }
      ]
    },
    community: {
      partnerships: [
        { organization: 'Local School District', type: 'Educational', contact: 'Dr. Mehta', status: 'Active' },
        { organization: 'Community Library', type: 'Resource Sharing', contact: 'Mrs. Patel', status: 'Active' }
      ],
      volunteers: {
        active: 8,
        total: 12,
        roles: ['Reading Assistant', 'Event Coordinator', 'Maintenance']
      },
      parentEngagement: {
        participationRate: 85,
        feedbackScore: 4.3,
        events: [
          { name: 'Parent-Teacher Meeting', date: new Date('2024-01-15'), attendance: 40 },
          { name: 'Literacy Workshop', date: new Date('2024-02-10'), attendance: 35 }
        ]
      }
    }
  }
];

const sampleAdvocacyCampaigns = [
  {
    campaignId: 'ADV-001',
    title: 'Literacy for All Initiative',
    description: 'Global campaign to promote universal literacy education and policy changes',
    category: 'policy',
    status: 'active',
    priority: 'high',
    target: {
      audience: ['government', 'public', 'educators'],
      region: 'Global',
      country: 'Worldwide',
      specificTargets: ['UNESCO', 'Education Ministers', 'NGOs']
    },
    timeline: {
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-12-31'),
      milestones: [
        {
          name: 'Policy Research Phase',
          date: new Date('2024-03-31'),
          status: 'completed',
          description: 'Complete research on current literacy policies'
        },
        {
          name: 'Public Awareness Launch',
          date: new Date('2024-06-30'),
          status: 'in-progress',
          description: 'Launch public awareness campaign'
        }
      ]
    },
    objectives: [
      {
        description: 'Increase literacy rates by 15% in target regions',
        measurable: true,
        targetValue: '15%',
        currentValue: '8%',
        status: 'in-progress'
      }
    ],
    strategies: [
      {
        type: 'social-media',
        description: 'Social media campaign to raise awareness',
        platform: 'Facebook, Twitter, Instagram',
        targetReach: 100000,
        actualReach: 75000,
        effectiveness: 8
      }
    ],
    resources: {
      budget: {
        allocated: 100000,
        spent: 45000,
        remaining: 55000,
        currency: 'USD'
      },
      team: [
        {
          name: 'Sarah Johnson',
          role: 'Campaign Director',
          responsibilities: ['Overall Strategy', 'Team Management'],
          timeCommitment: 'Full-time'
        }
      ]
    },
    metrics: {
      reach: {
        socialMedia: {
          followers: 25000,
          posts: 150,
          engagement: 8500,
          shares: 1200
        },
        events: {
          totalEvents: 12,
          totalAttendees: 500,
          averageAttendance: 42
        },
        media: {
          pressReleases: 8,
          mediaMentions: 25,
          interviews: 5
        }
      },
      engagement: {
        petitionSignatures: 15000,
        volunteerSignups: 250,
        donations: 25000,
        emailSubscribers: 5000
      },
      outcomes: {
        policyChanges: 3,
        awarenessIncrease: 40,
        partnershipFormed: 8,
        fundingSecured: 75000
      }
    }
  }
];

const sampleDigitalPrograms = [
  {
    programId: 'DL-001',
    name: 'Basic Literacy App',
    description: 'Mobile application for basic literacy skills development',
    type: 'mobile-app',
    status: 'launched',
    targetAudience: {
      primary: ['students', 'adults'],
      ageGroups: [
        { min: 6, max: 12, label: 'Children' },
        { min: 18, max: 65, label: 'Adults' }
      ],
      skillLevels: ['beginner', 'intermediate'],
      languages: ['English', 'Hindi', 'Spanish']
    },
    technology: {
      platform: 'mobile',
      devices: ['smartphone', 'tablet'],
      requirements: {
        internet: false,
        bandwidth: 'Low',
        storage: '100MB',
        operatingSystem: ['Android', 'iOS']
      },
      features: ['offline-mode', 'multimedia', 'interactive', 'gamification']
    },
    content: {
      modules: [
        {
          id: 'M001',
          title: 'Basic Alphabet',
          description: 'Learn the alphabet and basic letter recognition',
          duration: 30,
          type: 'interactive',
          difficulty: 'beginner',
          prerequisites: [],
          learningObjectives: ['Recognize letters', 'Associate sounds with letters']
        }
      ],
      totalDuration: 120,
      languages: ['English', 'Hindi'],
      subjects: ['Literacy', 'Language'],
      gradeLevels: ['K-2', 'Adult Basic']
    },
    enrollment: {
      totalUsers: 2500,
      activeUsers: 1800,
      completedUsers: 1200,
      dropoutRate: 15,
      averageCompletionTime: 45
    },
    performance: {
      completionRate: 78,
      averageScore: 85,
      userSatisfaction: 4.2,
      technicalIssues: 5,
      uptime: 99.5
    },
    analytics: {
      usage: {
        dailyActiveUsers: 450,
        weeklyActiveUsers: 1200,
        monthlyActiveUsers: 1800,
        sessionDuration: 25,
        pageViews: 50000,
        bounceRate: 20
      },
      engagement: {
        timeSpent: 1500,
        interactions: 25000,
        socialShares: 500,
        comments: 1200,
        ratings: [
          { rating: 5, count: 800 },
          { rating: 4, count: 600 },
          { rating: 3, count: 200 },
          { rating: 2, count: 50 },
          { rating: 1, count: 20 }
        ]
      },
      learning: {
        quizAttempts: 5000,
        averageQuizScore: 82,
        moduleCompletions: 1200,
        certificateEarned: 800
      }
    },
    deployment: {
      regions: ['Asia', 'Africa'],
      countries: ['India', 'Nepal', 'Mali'],
      launchDate: new Date('2024-01-15'),
      version: '1.2.0',
      updates: [
        {
          version: '1.2.0',
          date: new Date('2024-02-01'),
          changes: ['Added offline mode', 'Improved UI'],
          impact: 'Increased user engagement by 25%'
        }
      ]
    }
  }
];

async function seedAllPrograms() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/wlf_db');
    console.log('Connected to MongoDB');

    // Clear existing data
    await LiteracyHub.deleteMany({});
    await Advocacy.deleteMany({});
    await DigitalLearning.deleteMany({});
    console.log('Cleared existing program data');

    // Insert sample data
    await LiteracyHub.insertMany(sampleLiteracyHubs);
    await Advocacy.insertMany(sampleAdvocacyCampaigns);
    await DigitalLearning.insertMany(sampleDigitalPrograms);
    console.log('Sample data inserted successfully');

    // Display summary
    const hubCount = await LiteracyHub.countDocuments();
    const campaignCount = await Advocacy.countDocuments();
    const programCount = await DigitalLearning.countDocuments();

    console.log('\n=== All Programs Seeded Successfully ===');
    console.log(`Literacy Hubs: ${hubCount}`);
    console.log(`Advocacy Campaigns: ${campaignCount}`);
    console.log(`Digital Programs: ${programCount}`);

    process.exit(0);
  } catch (error) {
    console.error('Error seeding programs:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  seedAllPrograms();
}

module.exports = { sampleLiteracyHubs, sampleAdvocacyCampaigns, sampleDigitalPrograms, seedAllPrograms };
