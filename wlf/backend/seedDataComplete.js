const mongoose = require('mongoose');
const SunBook = require('./models/SunBook');
const LiteracyHub = require('./models/LiteracyHub');
const Advocacy = require('./models/Advocacy');
const DigitalLearning = require('./models/DigitalLearning');
const TeacherTraining = require('./models/TeacherTraining');
const CommunityOutreach = require('./models/CommunityOutreach');

// Complete sample data for all programs
const sampleTeacherTraining = [
  {
    programId: 'TT-001',
    title: 'Literacy Teaching Methods Workshop',
    description: 'Comprehensive workshop on innovative literacy teaching methods for primary school teachers',
    type: 'workshop',
    status: 'ongoing',
    level: 'intermediate',
    targetAudience: {
      primary: ['primary-teachers'],
      experience: { min: 2, max: 10 },
      subjects: ['literacy', 'language'],
      regions: ['Asia', 'Africa'],
      countries: ['India', 'Nepal', 'Mali']
    },
    curriculum: {
      modules: [
        {
          id: 'M001',
          title: 'Phonics and Phonemic Awareness',
          description: 'Understanding and teaching phonics effectively',
          duration: 4,
          type: 'theory',
          difficulty: 'intermediate',
          prerequisites: [],
          learningObjectives: ['Understand phonics principles', 'Apply phonics in teaching']
        },
        {
          id: 'M002',
          title: 'Reading Comprehension Strategies',
          description: 'Methods to improve reading comprehension',
          duration: 6,
          type: 'practical',
          difficulty: 'intermediate',
          prerequisites: ['M001'],
          learningObjectives: ['Teach comprehension strategies', 'Assess reading comprehension']
        }
      ],
      totalDuration: 40,
      certification: {
        required: true,
        criteria: 'Complete all modules with 80% score',
        validity: 24
      },
      assessment: {
        type: 'practical',
        weightage: 100,
        passingScore: 80
      }
    },
    schedule: {
      startDate: new Date('2024-02-01'),
      endDate: new Date('2024-03-15'),
      sessions: [
        {
          date: new Date('2024-02-01'),
          time: '09:00',
          duration: 4,
          topic: 'Introduction to Literacy Teaching',
          instructor: 'Dr. Sarah Johnson',
          location: 'Community Center',
          type: 'in-person'
        }
      ],
      timezone: 'IST',
      frequency: 'weekly'
    },
    instructors: [
      {
        name: 'Dr. Sarah Johnson',
        qualifications: 'PhD in Education, 15 years experience',
        experience: 15,
        specialization: ['Literacy Education', 'Teacher Training'],
        contact: {
          email: 'sarah.johnson@wlf.org',
          phone: '+1-555-0123'
        },
        bio: 'Expert in literacy education with extensive experience in teacher training',
        photo: 'https://example.com/sarah.jpg'
      }
    ],
    enrollment: {
      maxParticipants: 30,
      currentEnrollment: 25,
      waitlist: 5,
      participants: [
        {
          teacherId: 'T001',
          name: 'Priya Sharma',
          school: 'Delhi Public School',
          experience: 5,
          enrollmentDate: new Date('2024-01-15'),
          status: 'enrolled',
          progress: 60,
          attendance: 95
        }
      ]
    },
    resources: {
      materials: [
        {
          type: 'pdf',
          title: 'Literacy Teaching Handbook',
          format: 'pdf',
          url: 'https://example.com/handbook.pdf',
          size: '5MB',
          language: 'English'
        }
      ],
      equipment: [
        { name: 'Projector', quantity: 2, condition: 'excellent', location: 'Training Room' }
      ],
      technology: {
        platform: 'Hybrid',
        requirements: ['Laptop', 'Internet'],
        support: 'Technical support available'
      }
    },
    outcomes: {
      completion: {
        totalEnrolled: 25,
        completed: 20,
        completionRate: 80,
        averageTime: 35
      },
      assessment: {
        averageScore: 85,
        passRate: 90,
        distinctionRate: 25
      },
      feedback: {
        averageRating: 4.5,
        totalResponses: 20,
        commonThemes: ['Practical approach', 'Expert instructors', 'Useful materials']
      },
      impact: {
        teachersImproved: 20,
        schoolsBenefited: 15,
        studentsReached: 500,
        knowledgeRetention: 85
      }
    },
    funding: {
      budget: {
        total: 50000,
        spent: 35000,
        remaining: 15000,
        currency: 'USD'
      },
      sources: [
        { organization: 'Education Foundation', amount: 30000, type: 'grant', status: 'received' }
      ],
      costs: {
        instructorFees: 20000,
        materials: 5000,
        venue: 10000,
        technology: 5000,
        travel: 10000
      }
    }
  }
];

const sampleCommunityOutreach = [
  {
    programId: 'CO-001',
    name: 'Family Literacy Initiative',
    description: 'Comprehensive program engaging families in literacy development through community-based activities',
    type: 'engagement',
    status: 'active',
    priority: 'high',
    targetCommunity: {
      demographics: {
        ageGroups: ['children', 'adults'],
        education: ['illiterate', 'primary'],
        income: 'low',
        languages: ['Hindi', 'English', 'Local dialects']
      },
      location: {
        region: 'Urban District',
        country: 'India',
        specificAreas: ['Slum areas', 'Low-income neighborhoods'],
        coordinates: [
          { latitude: 28.6139, longitude: 77.2090, name: 'Central Delhi' }
        ]
      },
      size: {
        estimatedPopulation: 10000,
        targetReach: 5000,
        actualReach: 2500
      }
    },
    objectives: [
      {
        description: 'Increase family literacy engagement by 50%',
        measurable: true,
        targetValue: '50%',
        currentValue: '30%',
        deadline: new Date('2024-12-31'),
        status: 'in-progress'
      }
    ],
    activities: [
      {
        name: 'Family Reading Sessions',
        type: 'workshop',
        description: 'Weekly reading sessions for families',
        schedule: {
          startDate: new Date('2024-01-15'),
          endDate: new Date('2024-12-31'),
          frequency: 'weekly',
          duration: 2
        },
        location: {
          name: 'Community Center',
          address: '123 Community Street',
          type: 'community-center'
        },
        resources: {
          materials: ['Books', 'Reading guides'],
          equipment: ['Tables', 'Chairs'],
          budget: 5000
        },
        participants: {
          expected: 50,
          actual: 35,
          demographics: { families: 25, children: 40, adults: 30 }
        },
        outcomes: {
          attendance: 70,
          engagement: 85,
          feedback: 4.2,
          followUp: true
        }
      }
    ],
    team: {
      coordinators: [
        {
          name: 'Rajesh Kumar',
          role: 'Program Coordinator',
          experience: 8,
          contact: {
            email: 'rajesh.kumar@wlf.org',
            phone: '+91-9876543210'
          },
          availability: 'Full-time'
        }
      ],
      volunteers: {
        total: 25,
        active: 20,
        roles: ['Reading Assistant', 'Event Coordinator', 'Community Liaison'],
        training: {
          provided: true,
          duration: 20,
          topics: ['Literacy basics', 'Community engagement', 'Child development']
        }
      },
      partners: [
        { organization: 'Local NGO', contact: 'Mrs. Patel', contribution: 'Venue and volunteers', status: 'Active' }
      ]
    },
    resources: {
      budget: {
        total: 100000,
        allocated: 75000,
        spent: 50000,
        remaining: 25000,
        currency: 'INR'
      },
      materials: [
        { item: 'Books', quantity: 500, cost: 25000, supplier: 'Local Bookstore', status: 'Delivered' }
      ],
      equipment: [
        { name: 'Audio System', type: 'Electronics', condition: 'Good', location: 'Community Center', maintenance: new Date('2024-06-01') }
      ],
      transportation: {
        vehicles: 2,
        fuel: 5000,
        driver: 'Local driver',
        schedule: 'Daily 9 AM - 5 PM'
      }
    },
    engagement: {
      methods: [
        { type: 'door-to-door', effectiveness: 8, reach: 1000, cost: 5000 },
        { type: 'community-events', effectiveness: 9, reach: 2000, cost: 10000 }
      ],
      communication: {
        languages: ['Hindi', 'English'],
        channels: ['face-to-face', 'community-events'],
        frequency: 'weekly'
      },
      feedback: {
        collection: 'Monthly surveys',
        frequency: 'monthly',
        response: 75,
        improvements: ['More evening sessions', 'Childcare support']
      }
    },
    impact: {
      quantitative: {
        peopleReached: 2500,
        eventsConducted: 50,
        materialsDistributed: 1000,
        volunteersTrained: 25,
        partnershipsFormed: 5,
        awarenessIncrease: 40
      },
      qualitative: {
        testimonials: ['This program changed our family', 'My children love reading now'],
        successStories: ['Family of 5 all learned to read', 'Community reading club formed'],
        communityFeedback: ['Very helpful program', 'Need more sessions'],
        challenges: ['Low attendance initially', 'Language barriers'],
        lessonsLearned: ['Community engagement is key', 'Family involvement crucial']
      },
      sustainability: {
        communityOwnership: 70,
        localLeadership: 60,
        resourceAvailability: 80,
        longTermEngagement: true
      }
    },
    challenges: [
      {
        type: 'attendance',
        description: 'Low initial attendance',
        impact: 'Reduced program effectiveness',
        solution: 'Door-to-door outreach',
        status: 'resolved',
        date: new Date('2024-02-15')
      }
    ],
    partnerships: [
      {
        organization: 'Local School District',
        type: 'resources',
        contact: 'Dr. Mehta',
        contribution: 'Teachers and materials',
        status: 'Active',
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-12-31'),
        outcomes: 'Increased teacher involvement'
      }
    ],
    evaluation: {
      metrics: [
        { name: 'Family Participation', target: 100, actual: 75, unit: 'families', frequency: 'monthly' }
      ],
      assessments: [
        { type: 'quarterly', date: new Date('2024-03-31'), results: { participation: 75, satisfaction: 4.2 }, recommendations: ['Increase evening sessions'] }
      ],
      reports: [
        { type: 'progress', title: 'Q1 Progress Report', content: 'Program showing good progress', date: new Date('2024-03-31'), author: 'Rajesh Kumar' }
      ]
    },
    timeline: {
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-12-31'),
      milestones: [
        { name: 'Program Launch', date: new Date('2024-01-15'), status: 'completed', description: 'Official program launch' },
        { name: 'First 100 Families', date: new Date('2024-06-30'), status: 'in-progress', description: 'Reach first 100 families' }
      ],
      phases: [
        { name: 'Planning', startDate: new Date('2024-01-01'), endDate: new Date('2024-01-14'), activities: ['Recruitment', 'Training'], status: 'completed' }
      ]
    },
    sustainability: {
      communityCapacity: {
        localLeaders: 10,
        trainedVolunteers: 20,
        resources: 80,
        knowledge: 85
      },
      longTermPlan: {
        vision: 'Self-sustaining community literacy program',
        goals: ['Community ownership', 'Local funding', 'Expanded reach'],
        timeline: '2 years',
        resources: 'Community contributions'
      },
      exitStrategy: {
        planned: true,
        timeline: '2025-12-31',
        handover: 'Community leaders',
        support: 'Ongoing technical support'
      }
    }
  }
];

async function seedAllProgramsComplete() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/wlf_db');
    console.log('Connected to MongoDB');

    // Clear existing data
    await TeacherTraining.deleteMany({});
    await CommunityOutreach.deleteMany({});
    console.log('Cleared existing program data');

    // Insert sample data
    await TeacherTraining.insertMany(sampleTeacherTraining);
    await CommunityOutreach.insertMany(sampleCommunityOutreach);
    console.log('Sample data inserted successfully');

    // Display summary
    const teacherCount = await TeacherTraining.countDocuments();
    const communityCount = await CommunityOutreach.countDocuments();

    console.log('\n=== All Programs Seeded Successfully ===');
    console.log(`Teacher Training Programs: ${teacherCount}`);
    console.log(`Community Outreach Programs: ${communityCount}`);

    process.exit(0);
  } catch (error) {
    console.error('Error seeding programs:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  seedAllProgramsComplete();
}

module.exports = { sampleTeacherTraining, sampleCommunityOutreach, seedAllProgramsComplete };
