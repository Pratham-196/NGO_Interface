document.addEventListener('DOMContentLoaded', () => {
  // Simple counter animation for impact numbers
  const counters = document.querySelectorAll('[data-counter]');
  counters.forEach((el) => {
    const target = Number(el.getAttribute('data-counter')) || 0;
    const duration = 900;
    const start = performance.now();
    function tick(now) {
      const p = Math.min(1, (now - start) / duration);
      const value = Math.floor(target * (0.2 + 0.8 * p));
      el.textContent = value.toLocaleString();
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  });

  // Modal functionality
  const closeButtons = document.querySelectorAll('[data-modal-close]');
  closeButtons.forEach(button => {
    button.addEventListener('click', () => {
      const modalId = button.getAttribute('data-modal-close');
      closeModal(modalId);
    });
  });

  // Close modal when clicking outside
  window.addEventListener('click', (event) => {
    if (event.target.classList.contains('modal')) {
      event.target.style.display = 'none';
    }
  });
});

// Modal functions
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
    
    // Load data based on modal type
    if (modalId === 'sunbooks-modal') {
      loadSunBooksData();
    } else if (modalId === 'literacyhubs-modal') {
      loadLiteracyHubsData();
    } else if (modalId === 'advocacy-modal') {
      loadAdvocacyData();
    } else if (modalId === 'digitallearning-modal') {
      loadDigitalLearningData();
    } else if (modalId === 'teachertraining-modal') {
      loadTeacherTrainingData();
    } else if (modalId === 'communityoutreach-modal') {
      loadCommunityOutreachData();
    }
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto'; // Restore scrolling
  }
}

// Sun Books specific functions
function openSunBooksModal() {
  openModal('sunbooks-modal');
}

// Load Sun Books data from backend
async function loadSunBooksData() {
  try {
    // Load global statistics
    const statsResponse = await fetch('http://localhost:3001/api/sunbooks/stats/global');
    const statsData = await statsResponse.json();
    
    if (statsData.success) {
      const stats = statsData.data.global;
      document.getElementById('total-devices').textContent = stats.activeDevices || 0;
      document.getElementById('total-books').textContent = stats.totalBooks || 0;
      document.getElementById('total-users').textContent = stats.totalUsers || 0;
      document.getElementById('total-reading-time').textContent = Math.round((stats.totalReadingTime || 0) / 60) || 0;
    }
    
    // Load device locations
    const devicesResponse = await fetch('http://localhost:3001/api/sunbooks?limit=10');
    const devicesData = await devicesResponse.json();
    
    if (devicesData.success) {
      displayLocations(devicesData.data);
    }
    
  } catch (error) {
    console.error('Error loading Sun Books data:', error);
    // Show fallback data
    document.getElementById('total-devices').textContent = '127';
    document.getElementById('total-books').textContent = '2,450';
    document.getElementById('total-users').textContent = '3,200';
    document.getElementById('total-reading-time').textContent = '1,850';
    
    // Show fallback locations
    displayFallbackLocations();
  }
}

function displayLocations(devices) {
  const locationsList = document.getElementById('locations-list');
  
  if (devices.length === 0) {
    locationsList.innerHTML = '<div class="loading">No devices found</div>';
    return;
  }
  
  const locationsHtml = devices.map(device => `
    <div class="location-item">
      <div class="location-name">${device.location.school}</div>
      <div class="location-details">
        ${device.location.region}, ${device.location.country}<br>
        Status: ${device.status} | Battery: ${device.batteryLevel}%
      </div>
    </div>
  `).join('');
  
  locationsList.innerHTML = locationsHtml;
}

function displayFallbackLocations() {
  const locationsList = document.getElementById('locations-list');
  const fallbackLocations = [
    { school: 'Rural Primary School', region: 'Northern Province', country: 'India', status: 'active', battery: 85 },
    { school: 'Mountain Community School', region: 'Himalayan Region', country: 'Nepal', status: 'active', battery: 92 },
    { school: 'Desert Learning Center', region: 'Sahara Region', country: 'Mali', status: 'active', battery: 78 },
    { school: 'Island Elementary', region: 'Pacific Islands', country: 'Fiji', status: 'maintenance', battery: 45 }
  ];
  
  const locationsHtml = fallbackLocations.map(location => `
    <div class="location-item">
      <div class="location-name">${location.school}</div>
      <div class="location-details">
        ${location.region}, ${location.country}<br>
        Status: ${location.status} | Battery: ${location.battery}%
      </div>
    </div>
  `).join('');
  
  locationsList.innerHTML = locationsHtml;
}

function requestSunBook() {
  alert('Thank you for your interest! Please contact us at info@worldliteracyfoundation.org to request a Sun Book for your school.');
}

function viewAnalytics() {
  alert('Analytics dashboard coming soon! This will show detailed usage statistics and performance metrics.');
}

// Literacy Hubs functions
function openLiteracyHubsModal() {
  openModal('literacyhubs-modal');
}

async function loadLiteracyHubsData() {
  try {
    // Load global statistics
    const statsResponse = await fetch('http://localhost:3001/api/literacyhubs/stats/global');
    const statsData = await statsResponse.json();
    
    if (statsData.success) {
      const stats = statsData.data.global;
      document.getElementById('total-hubs').textContent = stats.activeHubs || 0;
      document.getElementById('total-students').textContent = stats.totalStudents || 0;
      document.getElementById('total-programs').textContent = stats.totalPrograms || 0;
      document.getElementById('completion-rate').textContent = Math.round((stats.averageUtilization || 0) * 100) + '%';
    }
    
    // Load hub locations
    const hubsResponse = await fetch('http://localhost:3001/api/literacyhubs?limit=10');
    const hubsData = await hubsResponse.json();
    
    if (hubsData.success) {
      displayHubLocations(hubsData.data);
    }
    
  } catch (error) {
    console.error('Error loading Literacy Hubs data:', error);
    // Show fallback data
    document.getElementById('total-hubs').textContent = '45';
    document.getElementById('total-students').textContent = '1,250';
    document.getElementById('total-programs').textContent = '120';
    document.getElementById('completion-rate').textContent = '85%';
    
    // Show fallback locations
    displayFallbackHubLocations();
  }
}

function displayHubLocations(hubs) {
  const hubsList = document.getElementById('hubs-list');
  
  if (hubs.length === 0) {
    hubsList.innerHTML = '<div class="loading">No hubs found</div>';
    return;
  }
  
  const locationsHtml = hubs.map(hub => `
    <div class="location-item">
      <div class="location-name">${hub.location.name}</div>
      <div class="location-details">
        ${hub.location.region}, ${hub.location.country}<br>
        Students: ${hub.capacity.currentEnrollment}/${hub.capacity.maxStudents} | Status: ${hub.status}
      </div>
    </div>
  `).join('');
  
  hubsList.innerHTML = locationsHtml;
}

function displayFallbackHubLocations() {
  const hubsList = document.getElementById('hubs-list');
  const fallbackHubs = [
    { name: 'Community Learning Center', region: 'Urban District', country: 'India', students: 45, maxStudents: 50, status: 'active' },
    { name: 'Rural Education Hub', region: 'Rural Province', country: 'Nepal', students: 32, maxStudents: 40, status: 'active' },
    { name: 'After-School Academy', region: 'Metro Area', country: 'Mali', students: 28, maxStudents: 35, status: 'active' }
  ];
  
  const locationsHtml = fallbackHubs.map(hub => `
    <div class="location-item">
      <div class="location-name">${hub.name}</div>
      <div class="location-details">
        ${hub.region}, ${hub.country}<br>
        Students: ${hub.students}/${hub.maxStudents} | Status: ${hub.status}
      </div>
    </div>
  `).join('');
  
  hubsList.innerHTML = locationsHtml;
}

function requestHub() {
  alert('Thank you for your interest! Please contact us at info@worldliteracyfoundation.org to request a Literacy Hub for your community.');
}

function viewHubAnalytics() {
  alert('Hub analytics dashboard coming soon! This will show detailed performance metrics and student progress.');
}

// Advocacy functions
function openAdvocacyModal() {
  openModal('advocacy-modal');
}

async function loadAdvocacyData() {
  try {
    // Load global statistics
    const statsResponse = await fetch('http://localhost:3001/api/advocacy/stats/global');
    const statsData = await statsResponse.json();
    
    if (statsData.success) {
      const stats = statsData.data.global;
      document.getElementById('total-campaigns').textContent = stats.activeCampaigns || 0;
      document.getElementById('total-reach').textContent = stats.totalReach || 0;
      document.getElementById('total-signatures').textContent = stats.totalEngagement || 0;
      document.getElementById('policy-changes').textContent = stats.totalOutcomes || 0;
    }
    
    // Load campaigns
    const campaignsResponse = await fetch('http://localhost:3001/api/advocacy?limit=10');
    const campaignsData = await campaignsResponse.json();
    
    if (campaignsData.success) {
      displayCampaigns(campaignsData.data);
    }
    
  } catch (error) {
    console.error('Error loading Advocacy data:', error);
    // Show fallback data
    document.getElementById('total-campaigns').textContent = '8';
    document.getElementById('total-reach').textContent = '125,000';
    document.getElementById('total-signatures').textContent = '45,000';
    document.getElementById('policy-changes').textContent = '12';
    
    // Show fallback campaigns
    displayFallbackCampaigns();
  }
}

function displayCampaigns(campaigns) {
  const campaignsList = document.getElementById('campaigns-list');
  
  if (campaigns.length === 0) {
    campaignsList.innerHTML = '<div class="loading">No campaigns found</div>';
    return;
  }
  
  const campaignsHtml = campaigns.map(campaign => `
    <div class="location-item">
      <div class="location-name">${campaign.title}</div>
      <div class="location-details">
        ${campaign.target.region}, ${campaign.target.country}<br>
        Status: ${campaign.status} | Progress: ${campaign.progress}%
      </div>
    </div>
  `).join('');
  
  campaignsList.innerHTML = campaignsHtml;
}

function displayFallbackCampaigns() {
  const campaignsList = document.getElementById('campaigns-list');
  const fallbackCampaigns = [
    { title: 'Literacy for All Initiative', region: 'Global', country: 'Worldwide', status: 'active', progress: 75 },
    { title: 'Digital Education Access', region: 'Asia', country: 'India', status: 'active', progress: 60 },
    { title: 'Rural Reading Program', region: 'Africa', country: 'Mali', status: 'active', progress: 85 }
  ];
  
  const campaignsHtml = fallbackCampaigns.map(campaign => `
    <div class="location-item">
      <div class="location-name">${campaign.title}</div>
      <div class="location-details">
        ${campaign.region}, ${campaign.country}<br>
        Status: ${campaign.status} | Progress: ${campaign.progress}%
      </div>
    </div>
  `).join('');
  
  campaignsList.innerHTML = campaignsHtml;
}

function joinCampaign() {
  alert('Thank you for your interest! Visit our website to join our advocacy campaigns and make a difference in literacy education.');
}

function viewAdvocacyAnalytics() {
  alert('Advocacy analytics dashboard coming soon! This will show campaign performance and impact metrics.');
}

// Digital Learning functions
function openDigitalLearningModal() {
  openModal('digitallearning-modal');
}

async function loadDigitalLearningData() {
  try {
    // Load global statistics
    const statsResponse = await fetch('http://localhost:3001/api/digitallearning/stats/global');
    const statsData = await statsResponse.json();
    
    if (statsData.success) {
      const stats = statsData.data.global;
      document.getElementById('total-programs-digital').textContent = stats.activePrograms || 0;
      document.getElementById('total-users-digital').textContent = stats.totalActiveUsers || 0;
      document.getElementById('completion-rate-digital').textContent = Math.round((stats.averageCompletionRate || 0) * 100) + '%';
      document.getElementById('satisfaction-score').textContent = Math.round(stats.averageSatisfaction || 0) + '/5';
    }
    
    // Load programs
    const programsResponse = await fetch('http://localhost:3001/api/digitallearning?limit=10');
    const programsData = await programsResponse.json();
    
    if (programsData.success) {
      displayDigitalPrograms(programsData.data);
    }
    
  } catch (error) {
    console.error('Error loading Digital Learning data:', error);
    // Show fallback data
    document.getElementById('total-programs-digital').textContent = '15';
    document.getElementById('total-users-digital').textContent = '8,500';
    document.getElementById('completion-rate-digital').textContent = '78%';
    document.getElementById('satisfaction-score').textContent = '4.2/5';
    
    // Show fallback programs
    displayFallbackDigitalPrograms();
  }
}

function displayDigitalPrograms(programs) {
  const programsList = document.getElementById('programs-list');
  
  if (programs.length === 0) {
    programsList.innerHTML = '<div class="loading">No programs found</div>';
    return;
  }
  
  const programsHtml = programs.map(program => `
    <div class="location-item">
      <div class="location-name">${program.name}</div>
      <div class="location-details">
        Type: ${program.type} | Users: ${program.enrollment.activeUsers}<br>
        Status: ${program.status} | Completion: ${Math.round(program.performance.completionRate || 0)}%
      </div>
    </div>
  `).join('');
  
  programsList.innerHTML = programsHtml;
}

function displayFallbackDigitalPrograms() {
  const programsList = document.getElementById('programs-list');
  const fallbackPrograms = [
    { name: 'Basic Literacy App', type: 'mobile-app', users: 2500, status: 'launched', completion: 85 },
    { name: 'Online Reading Course', type: 'online-course', users: 1800, status: 'launched', completion: 72 },
    { name: 'Teacher Training Platform', type: 'platform', users: 1200, status: 'launched', completion: 90 }
  ];
  
  const programsHtml = fallbackPrograms.map(program => `
    <div class="location-item">
      <div class="location-name">${program.name}</div>
      <div class="location-details">
        Type: ${program.type} | Users: ${program.users}<br>
        Status: ${program.status} | Completion: ${program.completion}%
      </div>
    </div>
  `).join('');
  
  programsList.innerHTML = programsHtml;
}

function accessDigitalLearning() {
  alert('Access our digital learning programs! Visit our learning platform to start your literacy journey.');
}

function viewDigitalAnalytics() {
  alert('Digital learning analytics dashboard coming soon! This will show program performance and user engagement metrics.');
}

// Teacher Training functions
function openTeacherTrainingModal() {
  openModal('teachertraining-modal');
}

async function loadTeacherTrainingData() {
  try {
    // Load global statistics
    const statsResponse = await fetch('http://localhost:3001/api/teachertraining/stats/global');
    const statsData = await statsResponse.json();
    
    if (statsData.success) {
      const stats = statsData.data.global;
      document.getElementById('total-programs-teacher').textContent = stats.activePrograms || 0;
      document.getElementById('total-teachers-trained').textContent = stats.totalTeachers || 0;
      document.getElementById('completion-rate-teacher').textContent = Math.round((stats.averageCompletionRate || 0) * 100) + '%';
      document.getElementById('effectiveness-score').textContent = Math.round(stats.averageEffectiveness || 0) + '/100';
    }
    
    // Load training programs
    const programsResponse = await fetch('http://localhost:3001/api/teachertraining?limit=10');
    const programsData = await programsResponse.json();
    
    if (programsData.success) {
      displayTrainingPrograms(programsData.data);
    }
    
  } catch (error) {
    console.error('Error loading Teacher Training data:', error);
    // Show fallback data
    document.getElementById('total-programs-teacher').textContent = '12';
    document.getElementById('total-teachers-trained').textContent = '450';
    document.getElementById('completion-rate-teacher').textContent = '92%';
    document.getElementById('effectiveness-score').textContent = '88/100';
    
    // Show fallback programs
    displayFallbackTrainingPrograms();
  }
}

function displayTrainingPrograms(programs) {
  const programsList = document.getElementById('training-programs-list');
  
  if (programs.length === 0) {
    programsList.innerHTML = '<div class="loading">No training programs found</div>';
    return;
  }
  
  const programsHtml = programs.map(program => `
    <div class="location-item">
      <div class="location-name">${program.title}</div>
      <div class="location-details">
        Type: ${program.type} | Level: ${program.level}<br>
        Teachers: ${program.enrollment.currentEnrollment}/${program.enrollment.maxParticipants} | Status: ${program.status}
      </div>
    </div>
  `).join('');
  
  programsList.innerHTML = programsHtml;
}

function displayFallbackTrainingPrograms() {
  const programsList = document.getElementById('training-programs-list');
  const fallbackPrograms = [
    { title: 'Literacy Teaching Methods Workshop', type: 'workshop', level: 'intermediate', teachers: 25, maxTeachers: 30, status: 'ongoing' },
    { title: 'Advanced Reading Strategies Certification', type: 'certification', level: 'advanced', teachers: 18, maxTeachers: 25, status: 'ongoing' },
    { title: 'Digital Literacy for Educators', type: 'online-course', level: 'beginner', teachers: 45, maxTeachers: 50, status: 'ongoing' }
  ];
  
  const programsHtml = fallbackPrograms.map(program => `
    <div class="location-item">
      <div class="location-name">${program.title}</div>
      <div class="location-details">
        Type: ${program.type} | Level: ${program.level}<br>
        Teachers: ${program.teachers}/${program.maxTeachers} | Status: ${program.status}
      </div>
    </div>
  `).join('');
  
  programsList.innerHTML = programsHtml;
}

function enrollInTraining() {
  alert('Thank you for your interest! Please contact us at training@worldliteracyfoundation.org to enroll in our teacher training programs.');
}

function viewTeacherAnalytics() {
  alert('Teacher training analytics dashboard coming soon! This will show detailed training metrics and teacher progress.');
}

// Community Outreach functions
function openCommunityOutreachModal() {
  openModal('communityoutreach-modal');
}

async function loadCommunityOutreachData() {
  try {
    // Load global statistics
    const statsResponse = await fetch('http://localhost:3001/api/communityoutreach/stats/global');
    const statsData = await statsResponse.json();
    
    if (statsData.success) {
      const stats = statsData.data.global;
      document.getElementById('total-programs-community').textContent = stats.activePrograms || 0;
      document.getElementById('total-people-reached').textContent = stats.totalReach || 0;
      document.getElementById('total-activities').textContent = stats.totalActivities || 0;
      document.getElementById('total-volunteers').textContent = stats.totalVolunteers || 0;
    }
    
    // Load community programs
    const programsResponse = await fetch('http://localhost:3001/api/communityoutreach?limit=10');
    const programsData = await programsResponse.json();
    
    if (programsData.success) {
      displayCommunityPrograms(programsData.data);
    }
    
  } catch (error) {
    console.error('Error loading Community Outreach data:', error);
    // Show fallback data
    document.getElementById('total-programs-community').textContent = '8';
    document.getElementById('total-people-reached').textContent = '15,000';
    document.getElementById('total-activities').textContent = '120';
    document.getElementById('total-volunteers').textContent = '85';
    
    // Show fallback programs
    displayFallbackCommunityPrograms();
  }
}

function displayCommunityPrograms(programs) {
  const programsList = document.getElementById('community-programs-list');
  
  if (programs.length === 0) {
    programsList.innerHTML = '<div class="loading">No community programs found</div>';
    return;
  }
  
  const programsHtml = programs.map(program => `
    <div class="location-item">
      <div class="location-name">${program.name}</div>
      <div class="location-details">
        Type: ${program.type} | ${program.targetCommunity.location.region}, ${program.targetCommunity.location.country}<br>
        People Reached: ${program.targetCommunity.size.actualReach} | Status: ${program.status}
      </div>
    </div>
  `).join('');
  
  programsList.innerHTML = programsHtml;
}

function displayFallbackCommunityPrograms() {
  const programsList = document.getElementById('community-programs-list');
  const fallbackPrograms = [
    { name: 'Family Literacy Initiative', type: 'engagement', region: 'Urban District', country: 'India', peopleReached: 2500, status: 'active' },
    { name: 'Community Reading Circles', type: 'support', region: 'Rural Province', country: 'Nepal', peopleReached: 1800, status: 'active' },
    { name: 'Parent Education Program', type: 'awareness', region: 'Metro Area', country: 'Mali', peopleReached: 3200, status: 'active' }
  ];
  
  const programsHtml = fallbackPrograms.map(program => `
    <div class="location-item">
      <div class="location-name">${program.name}</div>
      <div class="location-details">
        Type: ${program.type} | ${program.region}, ${program.country}<br>
        People Reached: ${program.peopleReached} | Status: ${program.status}
      </div>
    </div>
  `).join('');
  
  programsList.innerHTML = programsHtml;
}

function joinCommunityProgram() {
  alert('Thank you for your interest! Please contact us at outreach@worldliteracyfoundation.org to join our community programs.');
}

function viewCommunityAnalytics() {
  alert('Community outreach analytics dashboard coming soon! This will show detailed community engagement metrics and impact data.');
}


