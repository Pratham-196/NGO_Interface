/* Calculator JavaScript for Greenpeace Project */

// Calculator data and state
let calculatorData = {
  currentTab: 'donation',
  calculations: {
    donation: {},
    carbon: {},
    lifestyle: {}
  }
};

// Calculator constants and formulas
const calculatorConstants = {
  // Donation impact calculations
  donationImpact: {
    treePlanted: 0.5, // $0.50 per tree
    co2Offset: 22, // kg CO2 per tree per year
    oceanCleanup: 0.1, // $0.10 per kg of plastic removed
    renewableEnergy: 0.05, // $0.05 per kWh of renewable energy
    wildlifeProtection: 0.2 // $0.20 per animal protected
  },
  
  // Carbon footprint calculations (kg CO2 per year)
  carbonFootprint: {
    electricity: 0.4, // kg CO2 per kWh
    gas: 2.3, // kg CO2 per liter
    car: 0.2, // kg CO2 per km
    flight: 0.3, // kg CO2 per km
    food: 2.5, // kg CO2 per kg of food
    shopping: 0.1 // kg CO2 per $ spent
  },
  
  // Lifestyle impact calculations
  lifestyleImpact: {
    vegetarian: 0.8, // 80% reduction in food carbon footprint
    publicTransport: 0.6, // 60% reduction in transport footprint
    renewableEnergy: 0.9, // 90% reduction in electricity footprint
    minimalWaste: 0.7, // 70% reduction in waste footprint
    sustainableFashion: 0.5, // 50% reduction in fashion footprint
    localFood: 0.3 // 30% reduction in food transport footprint
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
  
  // Carbon footprint form
  const carbonForm = document.querySelector('#carbon-calculator');
  if (carbonForm) {
    carbonForm.addEventListener('submit', function(e) {
      e.preventDefault();
      calculateCarbonFootprint();
    });
  }
  
  // Lifestyle impact form
  const lifestyleForm = document.querySelector('#lifestyle-calculator');
  if (lifestyleForm) {
    lifestyleForm.addEventListener('submit', function(e) {
      e.preventDefault();
      calculateLifestyleImpact();
    });
  }
  
  // Real-time calculation on input change
  const inputs = document.querySelectorAll('.calculator-input input');
  inputs.forEach(input => {
    input.addEventListener('input', debounce(() => {
      if (calculatorData.currentTab === 'donation') {
        calculateDonationImpact();
      } else if (calculatorData.currentTab === 'carbon') {
        calculateCarbonFootprint();
      } else if (calculatorData.currentTab === 'lifestyle') {
        calculateLifestyleImpact();
      }
    }, 500));
  });
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
    treesPlanted: Math.floor(amount / constants.treePlanted),
    co2Offset: Math.floor(amount / constants.treePlanted) * constants.co2Offset,
    oceanCleanup: Math.floor(amount / constants.oceanCleanup),
    renewableEnergy: Math.floor(amount / constants.renewableEnergy),
    wildlifeProtected: Math.floor(amount / constants.wildlifeProtection)
  };
  
  calculatorData.calculations.donation = results;
  updateCalculatorResults('donation', results);
}

// Calculate carbon footprint
function calculateCarbonFootprint() {
  const electricity = parseFloat(document.querySelector('#electricity-usage')?.value) || 0;
  const gas = parseFloat(document.querySelector('#gas-usage')?.value) || 0;
  const car = parseFloat(document.querySelector('#car-distance')?.value) || 0;
  const flight = parseFloat(document.querySelector('#flight-distance')?.value) || 0;
  const food = parseFloat(document.querySelector('#food-consumption')?.value) || 0;
  const shopping = parseFloat(document.querySelector('#shopping-amount')?.value) || 0;
  
  const constants = calculatorConstants.carbonFootprint;
  
  const totalFootprint = 
    (electricity * constants.electricity) +
    (gas * constants.gas) +
    (car * constants.car) +
    (flight * constants.flight) +
    (food * constants.food) +
    (shopping * constants.shopping);
  
  const breakdown = {
    electricity: electricity * constants.electricity,
    gas: gas * constants.gas,
    car: car * constants.car,
    flight: flight * constants.flight,
    food: food * constants.food,
    shopping: shopping * constants.shopping
  };
  
  const results = {
    total: totalFootprint,
    breakdown: breakdown,
    comparison: {
      average: 12000, // Average global carbon footprint
      sustainable: 2000 // Sustainable carbon footprint target
    }
  };
  
  calculatorData.calculations.carbon = results;
  updateCalculatorResults('carbon', results);
}

// Calculate lifestyle impact
function calculateLifestyleImpact() {
  const choices = {
    vegetarian: document.querySelector('#vegetarian')?.checked || false,
    publicTransport: document.querySelector('#public-transport')?.checked || false,
    renewableEnergy: document.querySelector('#renewable-energy')?.checked || false,
    minimalWaste: document.querySelector('#minimal-waste')?.checked || false,
    sustainableFashion: document.querySelector('#sustainable-fashion')?.checked || false,
    localFood: document.querySelector('#local-food')?.checked || false
  };
  
  const constants = calculatorConstants.lifestyleImpact;
  let totalReduction = 0;
  let impactScore = 0;
  
  Object.keys(choices).forEach(choice => {
    if (choices[choice]) {
      const reduction = constants[choice];
      totalReduction += reduction;
      impactScore += reduction * 20; // Scale to 0-100
    }
  });
  
  const results = {
    impactScore: Math.min(100, impactScore),
    totalReduction: Math.min(1, totalReduction),
    choices: choices,
    recommendations: generateRecommendations(choices)
  };
  
  calculatorData.calculations.lifestyle = results;
  updateCalculatorResults('lifestyle', results);
}

// Update calculator results
function updateCalculatorResults(tabId, results) {
  if (tabId === 'donation') {
    updateDonationResults(results);
  } else if (tabId === 'carbon') {
    updateCarbonResults(results);
  } else if (tabId === 'lifestyle') {
    updateLifestyleResults(results);
  }
}

// Update donation results
function updateDonationResults(results) {
  const elements = {
    trees: document.querySelector('#trees-planted'),
    co2: document.querySelector('#co2-offset'),
    ocean: document.querySelector('#ocean-cleanup'),
    energy: document.querySelector('#renewable-energy'),
    wildlife: document.querySelector('#wildlife-protected')
  };
  
  if (elements.trees) elements.trees.textContent = results.treesPlanted;
  if (elements.co2) elements.co2.textContent = results.co2Offset;
  if (elements.ocean) elements.ocean.textContent = results.oceanCleanup;
  if (elements.energy) elements.energy.textContent = results.renewableEnergy;
  if (elements.wildlife) elements.wildlife.textContent = results.wildlifeProtected;
  
  // Animate results
  animateResults(elements);
}

// Update carbon results
function updateCarbonResults(results) {
  const totalElement = document.querySelector('#carbon-total');
  if (totalElement) {
    animateValue(totalElement, 0, results.total, 2000);
  }
  
  // Update breakdown
  const breakdownElements = {
    electricity: document.querySelector('#breakdown-electricity'),
    gas: document.querySelector('#breakdown-gas'),
    car: document.querySelector('#breakdown-car'),
    flight: document.querySelector('#breakdown-flight'),
    food: document.querySelector('#breakdown-food'),
    shopping: document.querySelector('#breakdown-shopping')
  };
  
  Object.keys(breakdownElements).forEach(key => {
    const element = breakdownElements[key];
    if (element && results.breakdown[key]) {
      element.textContent = Math.round(results.breakdown[key]) + ' kg CO2';
    }
  });
  
  // Update comparison
  const comparisonElement = document.querySelector('#carbon-comparison');
  if (comparisonElement) {
    const percentage = (results.total / results.comparison.average) * 100;
    comparisonElement.textContent = `${Math.round(percentage)}% of global average`;
  }
}

// Update lifestyle results
function updateLifestyleResults(results) {
  const scoreElement = document.querySelector('#impact-score');
  if (scoreElement) {
    animateValue(scoreElement, 0, results.impactScore, 2000);
  }
  
  const reductionElement = document.querySelector('#reduction-percentage');
  if (reductionElement) {
    reductionElement.textContent = `${Math.round(results.totalReduction * 100)}% reduction`;
  }
  
  // Update recommendations
  const recommendationsElement = document.querySelector('#recommendations');
  if (recommendationsElement) {
    recommendationsElement.innerHTML = results.recommendations.map(rec => 
      `<li>${rec}</li>`
    ).join('');
  }
}

// Generate lifestyle recommendations
function generateRecommendations(choices) {
  const recommendations = [];
  
  if (!choices.vegetarian) {
    recommendations.push('Consider reducing meat consumption to lower your carbon footprint');
  }
  if (!choices.publicTransport) {
    recommendations.push('Use public transport or carpool to reduce emissions');
  }
  if (!choices.renewableEnergy) {
    recommendations.push('Switch to renewable energy sources for your home');
  }
  if (!choices.minimalWaste) {
    recommendations.push('Reduce waste by recycling and composting');
  }
  if (!choices.sustainableFashion) {
    recommendations.push('Choose sustainable and ethical fashion options');
  }
  if (!choices.localFood) {
    recommendations.push('Buy local and seasonal food to reduce transport emissions');
  }
  
  if (recommendations.length === 0) {
    recommendations.push('Great job! You\'re making excellent sustainable choices!');
  }
  
  return recommendations;
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
  calculateDonation: calculateDonationImpact,
  calculateCarbon: calculateCarbonFootprint,
  calculateLifestyle: calculateLifestyleImpact
};
