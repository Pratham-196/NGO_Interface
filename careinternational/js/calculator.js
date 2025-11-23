/* Calculator JavaScript for CARE International Project */

// Calculator data and state
let calculatorData = {
  currentTab: 'donation',
  calculations: {
    donation: {},
    lives: {},
    programs: {}
  }
};

// Calculator constants and formulas
const calculatorConstants = {
  // Donation impact calculations
  donationImpact: {
    peopleHelped: 3, // $1 helps 3 people
    mealsProvided: 4, // $1 provides 4 meals
    healthVisits: 0.1, // $1 provides 0.1 health visits
    childrenEducated: 0.5, // $1 educates 0.5 children
    waterAccess: 2 // $1 provides clean water for 2 people
  }
};

// Initialize calculator
function initializeCalculator() {
  console.log('Initializing calculator...');
  
  // Set up tab switching
  setupCalculatorTabs();
  
  // Set up form handlers
  setupCalculatorForms();
  
  // Load initial calculations
  loadCalculatorData('donation');
}

// Set up calculator tabs
function setupCalculatorTabs() {
  const tabs = document.querySelectorAll('.calculator-tab');
  const contents = document.querySelectorAll('.calculator-tab-content');
  
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
      loadCalculatorData(tabId);
      calculatorData.currentTab = tabId;
    });
  });
}

// Set up calculator forms
function setupCalculatorForms() {
  // Donation calculator form
  const donationForm = document.querySelector('#donation-calculator');
  if (donationForm) {
    donationForm.addEventListener('submit', function(e) {
      e.preventDefault();
      calculateDonationImpact();
    });
  }
  
}

// Load calculator data
function loadCalculatorData(tabId) {
  const data = calculatorData.calculations[tabId];
  if (!data) return;
  
  // Update results if data exists
  if (Object.keys(data).length > 0) {
    updateCalculatorResults(tabId, data);
  }
}

// Calculate donation impact
function calculateDonationImpact() {
  const amount = parseFloat(document.querySelector('#donation-amount')?.value) || 0;
  const constants = calculatorConstants.donationImpact;
  
  const results = {
    peopleHelped: Math.floor(amount * constants.peopleHelped),
    mealsProvided: Math.floor(amount * constants.mealsProvided),
    healthVisits: Math.floor(amount * constants.healthVisits * 10) / 10,
    childrenEducated: Math.floor(amount * constants.childrenEducated * 10) / 10,
    waterAccess: Math.floor(amount * constants.waterAccess)
  };
  
  calculatorData.calculations.donation = results;
  updateCalculatorResults('donation', results);
}

// Update calculator results
function updateCalculatorResults(tabId, results) {
  if (tabId === 'donation') {
    updateDonationResults(results);
  }
}

// Update donation results
function updateDonationResults(results) {
  const elements = {
    people: document.querySelector('#people-helped'),
    meals: document.querySelector('#meals-provided'),
    health: document.querySelector('#health-visits'),
    education: document.querySelector('#children-educated'),
    water: document.querySelector('#water-access')
  };
  
  if (elements.people) {
    animateValue(elements.people, 0, results.peopleHelped, 1500);
  }
  if (elements.meals) {
    animateValue(elements.meals, 0, results.mealsProvided, 1500);
  }
  if (elements.health) {
    elements.health.textContent = results.healthVisits.toFixed(1);
  }
  if (elements.education) {
    elements.education.textContent = results.childrenEducated.toFixed(1);
  }
  if (elements.water) {
    animateValue(elements.water, 0, results.waterAccess, 1500);
  }
  
  // Animate results
  animateResults(elements);
}

// Animate results
function animateResults(elements) {
  Object.values(elements).forEach((element, index) => {
    if (element) {
      setTimeout(() => {
        element.classList.add('animate-in');
      }, index * 100);
    }
  });
}

// Export calculator functions
window.Calculator = {
  initialize: initializeCalculator,
  calculateDonation: calculateDonationImpact
};

