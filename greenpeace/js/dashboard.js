/* Dashboard JavaScript for Greenpeace Project */

// Dashboard data and state
let dashboardData = {
  currentTab: 'climate',
  updateInterval: null,
  isAnimating: false
};

// Dashboard data sources (simulated real-time data)
const dashboardDataSources = {
  climate: {
    temperature: { value: 1.1, trend: 'up', unit: '°C' },
    co2Level: { value: 415, trend: 'up', unit: 'ppm' },
    seaLevel: { value: 3.3, trend: 'up', unit: 'mm/year' },
    iceLoss: { value: 150, trend: 'up', unit: 'Gt/year' }
  },
  airQuality: {
    pm25: { value: 35, trend: 'down', unit: 'μg/m³' },
    ozone: { value: 0.08, trend: 'up', unit: 'ppm' },
    no2: { value: 25, trend: 'down', unit: 'ppb' },
    so2: { value: 12, trend: 'down', unit: 'ppb' }
  },
  deforestation: {
    forestLoss: { value: 10.1, trend: 'down', unit: 'M hectares/year' },
    carbonStored: { value: 638, trend: 'down', unit: 'Gt CO2' },
    biodiversity: { value: 68, trend: 'down', unit: '% remaining' },
    restoration: { value: 2.3, trend: 'up', unit: 'M hectares' }
  },
  oceanHealth: {
    ph: { value: 8.1, trend: 'down', unit: 'pH' },
    temperature: { value: 0.8, trend: 'up', unit: '°C' },
    oxygen: { value: 85, trend: 'down', unit: '% saturation' },
    plastic: { value: 8.3, trend: 'up', unit: 'M tons/year' }
  }
};

// Initialize dashboard
function initializeDashboard() {
  console.log('Initializing dashboard...');
  
  // Set up tab switching
  setupDashboardTabs();
  
  // Load initial data
  loadDashboardData('climate');
  
  // Start real-time updates
  startRealTimeUpdates();
  
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
      valueElement.textContent = newValue + (data.unit ? ' ' + data.unit : '');
    }
  }
  
  if (trendElement) {
    trendElement.textContent = data.trend === 'up' ? '↗ Increasing' : '↘ Decreasing';
    trendElement.className = `data-trend ${data.trend}`;
  }
  
  if (descriptionElement) {
    descriptionElement.textContent = getDataDescription(data);
  }
}

// Get description for data point
function getDataDescription(data) {
  const descriptions = {
    temperature: 'Global average temperature rise since pre-industrial times',
    co2Level: 'Atmospheric CO2 concentration in parts per million',
    seaLevel: 'Global sea level rise rate',
    iceLoss: 'Annual ice mass loss from glaciers and ice sheets',
    pm25: 'Particulate matter 2.5 micrometers in diameter',
    ozone: 'Ground-level ozone concentration',
    no2: 'Nitrogen dioxide concentration',
    so2: 'Sulfur dioxide concentration',
    forestLoss: 'Annual forest area loss globally',
    carbonStored: 'Total carbon stored in global forests',
    biodiversity: 'Remaining biodiversity compared to baseline',
    restoration: 'Annual forest restoration efforts',
    ph: 'Ocean pH level (lower = more acidic)',
    oxygen: 'Ocean oxygen saturation level',
    plastic: 'Annual plastic waste entering oceans'
  };
  
  return descriptions[Object.keys(data)[0]] || 'Environmental data point';
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

// Start real-time updates
function startRealTimeUpdates() {
  // Update data every 30 seconds
  dashboardData.updateInterval = setInterval(() => {
    if (!dashboardData.isAnimating) {
      updateRealTimeData();
    }
  }, 30000);
}

// Update real-time data
function updateRealTimeData() {
  const currentData = dashboardDataSources[dashboardData.currentTab];
  if (!currentData) return;
  
  // Simulate real-time data changes
  Object.keys(currentData).forEach(key => {
    const data = currentData[key];
    const variation = (Math.random() - 0.5) * 0.1; // ±5% variation
    data.value = Math.max(0, data.value + (data.value * variation));
    
    // Update trend randomly
    if (Math.random() < 0.1) { // 10% chance to change trend
      data.trend = data.trend === 'up' ? 'down' : 'up';
    }
  });
  
  // Reload current tab data
  loadDashboardData(dashboardData.currentTab);
}

// Set up responsive behavior
function setupDashboardResponsive() {
  const handleResize = debounce(() => {
    const grid = document.querySelector('.dashboard-grid');
    if (grid) {
      const cardsPerRow = window.innerWidth < 768 ? 1 : 
                         window.innerWidth < 1024 ? 2 : 3;
      
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
