const mongoose = require('mongoose');
const SunBook = require('./models/SunBook');

// Sample data for Sun Books devices
const sampleDevices = [
  {
    deviceId: 'SB-IND-001',
    location: {
      school: 'Rural Primary School',
      region: 'Northern Province',
      country: 'India',
      coordinates: { latitude: 28.6139, longitude: 77.2090 }
    },
    status: 'active',
    batteryLevel: 85,
    solarPanelEfficiency: 88,
    content: {
      books: [
        {
          title: 'Basic Hindi Reader',
          language: 'Hindi',
          category: 'Primary',
          readingLevel: 'Beginner',
          downloadDate: new Date('2024-01-15'),
          lastAccessed: new Date('2024-01-20'),
          accessCount: 45
        },
        {
          title: 'Math Stories',
          language: 'Hindi',
          category: 'Mathematics',
          readingLevel: 'Intermediate',
          downloadDate: new Date('2024-01-15'),
          lastAccessed: new Date('2024-01-19'),
          accessCount: 32
        }
      ],
      lastUpdate: new Date('2024-01-20'),
      totalBooks: 2
    },
    usage: {
      totalSessions: 127,
      totalReadingTime: 450, // minutes
      uniqueUsers: 45,
      lastActivity: new Date('2024-01-20'),
      dailyUsage: [
        { date: new Date('2024-01-20'), sessions: 8, readingTime: 35, uniqueUsers: 12 },
        { date: new Date('2024-01-19'), sessions: 12, readingTime: 48, uniqueUsers: 15 }
      ]
    },
    maintenance: {
      lastService: new Date('2024-01-01'),
      nextService: new Date('2024-04-01'),
      issues: []
    },
    performance: {
      averageSessionDuration: 3.5,
      mostPopularBooks: ['Basic Hindi Reader', 'Math Stories'],
      peakUsageHours: [9, 10, 11, 14, 15],
      userSatisfactionScore: 4.2
    }
  },
  {
    deviceId: 'SB-NEP-002',
    location: {
      school: 'Mountain Community School',
      region: 'Himalayan Region',
      country: 'Nepal',
      coordinates: { latitude: 27.7172, longitude: 85.3240 }
    },
    status: 'active',
    batteryLevel: 92,
    solarPanelEfficiency: 91,
    content: {
      books: [
        {
          title: 'Nepali Stories',
          language: 'Nepali',
          category: 'Literature',
          readingLevel: 'Beginner',
          downloadDate: new Date('2024-01-10'),
          lastAccessed: new Date('2024-01-20'),
          accessCount: 67
        }
      ],
      lastUpdate: new Date('2024-01-10'),
      totalBooks: 1
    },
    usage: {
      totalSessions: 89,
      totalReadingTime: 320,
      uniqueUsers: 28,
      lastActivity: new Date('2024-01-20'),
      dailyUsage: [
        { date: new Date('2024-01-20'), sessions: 6, readingTime: 28, uniqueUsers: 8 }
      ]
    },
    maintenance: {
      lastService: new Date('2023-12-15'),
      nextService: new Date('2024-03-15'),
      issues: []
    },
    performance: {
      averageSessionDuration: 3.6,
      mostPopularBooks: ['Nepali Stories'],
      peakUsageHours: [10, 11, 12, 15, 16],
      userSatisfactionScore: 4.5
    }
  },
  {
    deviceId: 'SB-MLI-003',
    location: {
      school: 'Desert Learning Center',
      region: 'Sahara Region',
      country: 'Mali',
      coordinates: { latitude: 12.6392, longitude: -8.0029 }
    },
    status: 'maintenance',
    batteryLevel: 45,
    solarPanelEfficiency: 75,
    content: {
      books: [
        {
          title: 'French Basics',
          language: 'French',
          category: 'Language',
          readingLevel: 'Beginner',
          downloadDate: new Date('2024-01-05'),
          lastAccessed: new Date('2024-01-18'),
          accessCount: 23
        }
      ],
      lastUpdate: new Date('2024-01-05'),
      totalBooks: 1
    },
    usage: {
      totalSessions: 45,
      totalReadingTime: 180,
      uniqueUsers: 18,
      lastActivity: new Date('2024-01-18'),
      dailyUsage: []
    },
    maintenance: {
      lastService: new Date('2023-11-20'),
      nextService: new Date('2024-02-20'),
      issues: [
        {
          type: 'Battery',
          description: 'Low battery performance in hot conditions',
          reportedAt: new Date('2024-01-15'),
          status: 'open'
        }
      ]
    },
    performance: {
      averageSessionDuration: 4.0,
      mostPopularBooks: ['French Basics'],
      peakUsageHours: [8, 9, 10, 16, 17],
      userSatisfactionScore: 3.8
    }
  }
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/wlf_db');
    console.log('Connected to MongoDB');

    // Clear existing data
    await SunBook.deleteMany({});
    console.log('Cleared existing Sun Book data');

    // Insert sample data
    await SunBook.insertMany(sampleDevices);
    console.log('Sample data inserted successfully');

    // Display summary
    const totalDevices = await SunBook.countDocuments();
    const activeDevices = await SunBook.countDocuments({ status: 'active' });
    const totalBooks = await SunBook.aggregate([
      { $group: { _id: null, total: { $sum: '$content.totalBooks' } } }
    ]);

    console.log('\n=== Database Seeded Successfully ===');
    console.log(`Total Devices: ${totalDevices}`);
    console.log(`Active Devices: ${activeDevices}`);
    console.log(`Total Books: ${totalBooks[0]?.total || 0}`);

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  seedDatabase();
}

module.exports = { sampleDevices, seedDatabase };
