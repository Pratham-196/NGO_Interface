/* Dashboard JavaScript for CARE International Project */

// Dashboard data and state
let dashboardData = {
  currentTab: 'poverty',
  updateInterval: null,
  isAnimating: false
};

// Dashboard data sources (simulated real-time data)
const dashboardDataSources = {
  poverty: {
    povertyRate: { value: 9.2, trend: 'down', unit: '%' },
    hunger: { value: 828, trend: 'up', unit: 'M' },
    refugees: { value: 110, trend: 'up', unit: 'M+' },
    education: { value: 244, trend: 'down', unit: 'M' }
  },
  emergencies: {
    conflicts: { value: 55, trend: 'up', unit: 'countries' },
    disasters: { value: 387, trend: 'up', unit: 'events/year' },
    displaced: { value: 110, trend: 'up', unit: 'M people' },
    aidNeeded: { value: 339, trend: 'up', unit: 'B USD' }
  },
  gender: {
    genderGap: { value: 68.1, trend: 'up', unit: '%' },
    womenPoverty: { value: 12.8, trend: 'down', unit: '%' },
    educationGap: { value: 132, trend: 'down', unit: 'M girls' },
    violence: { value: 30, trend: 'stable', unit: '% women' }
  },
  health: {
    maternalMortality: { value: 211, trend: 'down', unit: 'per 100K' },
    childMortality: { value: 38, trend: 'down', unit: 'per 1000' },
    malnutrition: { value: 149, trend: 'up', unit: 'M children' },
    hivAids: { value: 39, trend: 'down', unit: 'M people' }
  }
};

// Initialize dashboard
function initializeDashboard() {
  console.log('Initializing dashboard...');
  
  // Set up tab switching
  setupDashboardTabs();
  
  // Load initial data
  loadDashboardData('poverty');
  
  // Set up responsive behavior
  setupDashboardResponsive();
}

// Set up dashboard tabs
function setupDashboardTabs() {
  const tabs = document.querySelectorAll('.dashboard-tab');
  const contents = document.querySelectorAll('.dashboard-tab-content');
  
  tabs.forEach(tab => {
    tab.addEventListener('click', function() {
      const tabId = this.getAttribute('data-tab');
      
      // Update active tab
      tabs.forEach(t => t.classList.remove('active'));
      this.classList.add('active');
      
      // Update active content
      contents.forEach(content => {
        content.classList.remove('active');
        if (content.getAttribute('data-tab') === tabId) {
          content.classList.add('active');
        }
      });
      
      // Load data for the selected tab
      loadDashboardData(tabId);
      dashboardData.currentTab = tabId;
    });
  });
}

// Load dashboard data for a specific tab
function loadDashboardData(tabId) {
  const data = dashboardDataSources[tabId];
  if (!data) return;
  
  // Update data cards
  Object.keys(data).forEach(key => {
    const card = document.querySelector(`[data-metric="${key}"]`);
    if (card) {
      updateDataCard(card, data[key]);
    }
  });
  
  // Add loading animation
  animateDataCards();
}

// Update individual data card
function updateDataCard(card, data) {
  const valueElement = card.querySelector('.data-value');
  const trendElement = card.querySelector('.data-trend');
  const descriptionElement = card.querySelector('.data-description');
  
  if (valueElement) {
    // Animate value change
    const currentValue = parseFloat(valueElement.textContent) || 0;
    const newValue = data.value;
    
    if (Math.abs(newValue - currentValue) > 0.1) {
      animateValue(valueElement, currentValue, newValue, 1000);
    } else {
      valueElement.textContent = newValue + (data.unit ? (data.unit.startsWith('%') || data.unit.startsWith('per') ? ' ' + data.unit : data.unit) : '');
    }
  }
  
  if (trendElement) {
    if (data.trend === 'up') {
      trendElement.textContent = '↗ Increasing';
    } else if (data.trend === 'down') {
      trendElement.textContent = '↘ Decreasing';
    } else {
      trendElement.textContent = '→ Stable';
    }
    trendElement.className = `data-trend ${data.trend}`;
  }
  
  if (descriptionElement && data.description) {
    descriptionElement.textContent = data.description;
  }
}

// Animate data cards
function animateDataCards() {
  const cards = document.querySelectorAll('.data-card');
  
  cards.forEach((card, index) => {
    setTimeout(() => {
      card.classList.add('animate-in');
    }, index * 100);
  });
}

// Set up responsive behavior
function setupDashboardResponsive() {
  const handleResize = debounce(() => {
    const grid = document.querySelector('.dashboard-grid');
    if (grid) {
      const cardsPerRow = window.innerWidth < 768 ? 1 : 
                         window.innerWidth < 1024 ? 2 : 4;
      
      grid.style.gridTemplateColumns = `repeat(${cardsPerRow}, 1fr)`;
    }
  }, 250);
  
  window.addEventListener('resize', handleResize);
  handleResize(); // Initial call
}

// Clean up dashboard
function cleanupDashboard() {
  if (dashboardData.updateInterval) {
    clearInterval(dashboardData.updateInterval);
    dashboardData.updateInterval = null;
  }
}

// Export dashboard functions
window.Dashboard = {
  initialize: initializeDashboard,
  loadData: loadDashboardData,
  cleanup: cleanupDashboard
};

