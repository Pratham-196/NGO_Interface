/* Events JavaScript for CARE International Project */

// Events data and state
let eventsData = {
  currentTab: 'recent',
  events: {
    recent: [],
    emergency: [],
    women: [],
    health: []
  }
};

// Initialize events
function initializeEvents() {
  console.log('Initializing events...');
  
  // Load events data
  loadEventsData();
  
  // Set up tab switching
  setupEventsTabs();
  
  // Set up event interactions
  setupEventInteractions();
  
  // Set up responsive behavior
  setupEventsResponsive();
}

// Load events data
function loadEventsData() {
  // Recent CARE projects with 2023-24 reported impact
  eventsData.events = {
    recent: [
      {
        id: 101,
        title: 'Ukraine Winterization Cash Support',
        date: '2024-01-30',
        location: 'Ukraine',
        description: 'Distributed multipurpose cash and solid fuel vouchers so 126,000 families could heat homes through sub-zero temperatures.',
        image: 'https://images.unsplash.com/photo-1454372182658-c01286cd7b84?q=80&w=2070&auto=format&fit=crop',
        category: 'emergency',
        participants: 315000,
        impact: 'High',
        status: 'ongoing'
      },
      {
        id: 102,
        title: 'Türkiye-Syria Earthquake Shelter Pods',
        date: '2024-02-18',
        location: 'Gaziantep, Türkiye',
        description: 'CARE installed 3,200 insulated shelter pods with gender-safe WASH blocks for families displaced by the 2023 earthquakes.',
        image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=2100&auto=format&fit=crop',
        category: 'emergency',
        participants: 182000,
        impact: 'High',
        status: 'ongoing'
      },
      {
        id: 103,
        title: 'Blue Schools Resilience Network',
        date: '2023-12-15',
        location: 'Madagascar & Mozambique',
        description: 'Rebuilt climate-resilient classrooms, rainwater harvesting, and hygiene stations reaching cyclone-affected learners.',
        image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=2080&auto=format&fit=crop',
        category: 'education',
        participants: 48000,
        impact: 'Medium',
        status: 'completed'
      }
    ],
    emergency: [
      {
        id: 201,
        title: 'Horn of Africa Drought Response Phase IV',
        date: '2024-03-05',
        location: 'Somalia, Ethiopia, Kenya',
        description: 'Water trucking, fodder vouchers, and cash-for-work rehabilitated 320 boreholes amid the region\'s longest drought on record.',
        image: 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?q=80&w=2050&auto=format&fit=crop',
        category: 'emergency',
        participants: 840000,
        impact: 'High',
        status: 'ongoing'
      },
      {
        id: 202,
        title: 'Cyclone Freddy Rapid Response',
        date: '2024-02-22',
        location: 'Malawi & Mozambique',
        description: 'CARE teams deployed within 48 hours delivering ready-to-eat meals, dignity kits, and shelter repair kits to flood-hit districts.',
        image: 'https://images.unsplash.com/photo-1502303756762-a401b6f17b46?q=80&w=2090&auto=format&fit=crop',
        category: 'emergency',
        participants: 265000,
        impact: 'High',
        status: 'completed'
      },
      {
        id: 203,
        title: 'Sudan Crisis Cross-Border Lifeline',
        date: '2024-03-10',
        location: 'Port Sudan · Chad border',
        description: 'Mobile clinics, nutrition screening, and safe water points served families fleeing escalating conflict.',
        image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2070&auto=format&fit=crop',
        category: 'emergency',
        participants: 190000,
        impact: 'High',
        status: 'ongoing'
      }
    ],
    women: [
      {
        id: 301,
        title: 'VSLA Digitization Pilot',
        date: '2024-02-12',
        location: 'Benin & Côte d’Ivoire',
        description: '850 Village Savings & Loan Associations adopted mobile wallets, reducing cash risk while tripling average savings per member.',
        image: 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?q=80&w=2000&auto=format&fit=crop',
        category: 'women',
        participants: 22300,
        impact: 'High',
        status: 'ongoing'
      },
      {
        id: 302,
        title: 'She Feeds the World—Peru Andes',
        date: '2024-01-28',
        location: 'Cusco, Peru',
        description: 'Quechua women farmer cooperatives installed solar greenhouses producing 7 tons of vegetables monthly for school meals.',
        image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=2060&auto=format&fit=crop',
        category: 'women',
        participants: 6800,
        impact: 'Medium',
        status: 'ongoing'
      },
      {
        id: 303,
        title: 'Afghanistan Girls’ Home-Based Learning',
        date: '2024-03-08',
        location: 'Herat & Kabul',
        description: 'CARE trained 1,200 female mentors running safe home classrooms so adolescent girls continue STEM curricula.',
        image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=2020&auto=format&fit=crop',
        category: 'education',
        participants: 31200,
        impact: 'High',
        status: 'ongoing'
      }
    ],
    health: [
      {
        id: 401,
        title: 'Sahel Malnutrition Stabilization Centers',
        date: '2024-02-02',
        location: 'Niger & Burkina Faso',
        description: '47 inpatient centers treated severe wasting with ready-to-use therapeutic food and maternal counselling.',
        image: 'https://images.unsplash.com/photo-1506443432602-ac2fcd6f54e1?q=80&w=2070&auto=format&fit=crop',
        category: 'health',
        participants: 62000,
        impact: 'High',
        status: 'ongoing'
      },
      {
        id: 402,
        title: 'Sierra Leone Maternal Waiting Homes',
        date: '2024-01-14',
        location: 'Bo & Kenema Districts',
        description: 'Six maternity waiting homes connected rural women to skilled birth attendants, cutting obstetric referrals by 32%.',
        image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?q=80&w=2070&auto=format&fit=crop',
        category: 'health',
        participants: 18400,
        impact: 'Medium',
        status: 'completed'
      },
      {
        id: 403,
        title: 'Cambodia Zero Malaria Youth Corps',
        date: '2023-12-05',
        location: 'Ratanakiri Province',
        description: 'CARE-supported youth mapped mosquito breeding sites, distributed LLINs, and digitized case tracking with Ministry of Health.',
        image: 'https://images.unsplash.com/photo-1547489432-cf93fa6c71c2?q=80&w=2060&auto=format&fit=crop',
        category: 'health',
        participants: 27000,
        impact: 'Medium',
        status: 'completed'
      }
    ]
  };
  
  // Render events for current tab
  renderEvents(eventsData.currentTab);
}

// Set up events tabs
function setupEventsTabs() {
  const tabs = document.querySelectorAll('.events-tab');
  const contents = document.querySelectorAll('.events-tab-content');
  
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
      
      // Render events for the selected tab
      renderEvents(tabId);
      eventsData.currentTab = tabId;
    });
  });
}

// Render events for a specific tab
function renderEvents(tabId) {
  const events = eventsData.events[tabId] || [];
  const container = document.querySelector(`.events-tab-content[data-tab="${tabId}"] .events-grid`);
  
  if (!container) return;
  
  // Clear existing content
  container.innerHTML = '';
  
  // Render each event
  events.forEach(event => {
    const eventElement = createEventElement(event);
    container.appendChild(eventElement);
  });
  
  // Add animation
  animateEventCards(container);
  
  // Attach interactions
  setupEventCardListeners(container);
}

// Create event element
function createEventElement(event) {
  const eventCard = document.createElement('div');
  eventCard.className = 'event-card';
  eventCard.setAttribute('data-event-id', event.id);
  
  eventCard.innerHTML = `
    <div class="event-image">
      <img src="${event.image}" alt="${event.title}" loading="lazy">
      <div class="event-overlay">
        <div class="event-date">${formatDate(event.date)}</div>
        <div class="event-location">${event.location}</div>
      </div>
    </div>
    <div class="event-content">
      <h4>${event.title}</h4>
      <p>${event.description}</p>
      <div class="event-stats">
        <span class="stat">${formatNumber(event.participants)} people reached</span>
        <span class="stat">${event.impact} impact</span>
        <span class="stat">${event.status}</span>
      </div>
    </div>
  `;
  
  return eventCard;
}

// Format date
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

// Format number
function formatNumber(num) {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}

// Animate event cards
function animateEventCards(container) {
  const cards = container.querySelectorAll('.event-card');
  
  cards.forEach((card, index) => {
    setTimeout(() => {
      card.classList.add('animate-in');
    }, index * 100);
  });
}

// Set up event interactions
function setupEventInteractions() {
  const grids = document.querySelectorAll('.events-grid');
  grids.forEach(grid => setupEventCardListeners(grid));
}

function setupEventCardListeners(container) {
  const eventCards = container.querySelectorAll('.event-card');
  eventCards.forEach(card => {
    card.addEventListener('click', function() {
      const eventId = this.getAttribute('data-event-id');
      showEventDetails(eventId);
    });
  });
}

// Show event details
function showEventDetails(eventId) {
  // Find event data
  let event = null;
  Object.values(eventsData.events).forEach(events => {
    const foundEvent = events.find(e => e.id == eventId);
    if (foundEvent) {
      event = foundEvent;
    }
  });
  
  if (!event) return;
  
  // You could create a modal or detailed view here
  console.log('Event details:', event);
}

// Set up responsive behavior
function setupEventsResponsive() {
  const handleResize = debounce(() => {
    const grids = document.querySelectorAll('.events-grid');
    grids.forEach(grid => {
      if (grid) {
        const cardsPerRow = window.innerWidth < 768 ? 1 : 
                           window.innerWidth < 1024 ? 2 : 3;
        
        grid.style.gridTemplateColumns = `repeat(${cardsPerRow}, 1fr)`;
      }
    });
  }, 250);
  
  window.addEventListener('resize', handleResize);
  handleResize(); // Initial call
}

// Export events functions
window.Events = {
  initialize: initializeEvents,
  render: renderEvents,
  showDetails: showEventDetails
};

