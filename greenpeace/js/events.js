/* Events JavaScript for Greenpeace Project */

// Events data and state
let eventsData = {
  currentTab: 'recent',
  events: {
    recent: [],
    climate: [],
    ocean: [],
    forest: []
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
  // Simulated events data
  eventsData.events = {
    recent: [
      {
        id: 1,
        title: 'Global Climate Strike 2024',
        date: '2024-03-15',
        location: 'Worldwide',
        description: 'Millions of people joined the global climate strike demanding immediate action on climate change.',
        image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=2013&auto=format&fit=crop',
        category: 'climate',
        participants: 5000000,
        impact: 'High',
        status: 'completed'
      },
      {
        id: 2,
        title: 'Ocean Plastic Cleanup Campaign',
        date: '2024-02-20',
        location: 'Pacific Ocean',
        description: 'Large-scale cleanup operation removing tons of plastic waste from the Pacific Ocean.',
        image: 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?q=80&w=2070&auto=format&fit=crop',
        category: 'ocean',
        participants: 1000,
        impact: 'Medium',
        status: 'ongoing'
      },
      {
        id: 3,
        title: 'Amazon Rainforest Protection',
        date: '2024-01-10',
        location: 'Brazil',
        description: 'Direct action to protect the Amazon rainforest from illegal logging and deforestation.',
        image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2071&auto=format&fit=crop',
        category: 'forest',
        participants: 500,
        impact: 'High',
        status: 'ongoing'
      }
    ],
    climate: [
      {
        id: 4,
        title: 'Coal Plant Shutdown Protest',
        date: '2024-03-01',
        location: 'Germany',
        description: 'Peaceful protest demanding the immediate shutdown of coal-fired power plants.',
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2070&auto=format&fit=crop',
        category: 'climate',
        participants: 2000,
        impact: 'High',
        status: 'completed'
      },
      {
        id: 5,
        title: 'Renewable Energy Rally',
        date: '2024-02-15',
        location: 'United States',
        description: 'Rally promoting the transition to 100% renewable energy sources.',
        image: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?q=80&w=2070&auto=format&fit=crop',
        category: 'climate',
        participants: 5000,
        impact: 'Medium',
        status: 'completed'
      }
    ],
    ocean: [
      {
        id: 6,
        title: 'Stop Deep Sea Mining',
        date: '2024-02-28',
        location: 'International Waters',
        description: 'Campaign to stop destructive deep sea mining operations.',
        image: 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?q=80&w=2070&auto=format&fit=crop',
        category: 'ocean',
        participants: 3000,
        impact: 'High',
        status: 'ongoing'
      },
      {
        id: 7,
        title: 'Marine Sanctuary Creation',
        date: '2024-01-25',
        location: 'Antarctica',
        description: 'Successful campaign to create new marine sanctuaries in Antarctica.',
        image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?q=80&w=2070&auto=format&fit=crop',
        category: 'ocean',
        participants: 1500,
        impact: 'High',
        status: 'completed'
      }
    ],
    forest: [
      {
        id: 8,
        title: 'Borneo Forest Protection',
        date: '2024-02-05',
        location: 'Borneo',
        description: 'Direct action to protect ancient rainforests from palm oil expansion.',
        image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2071&auto=format&fit=crop',
        category: 'forest',
        participants: 800,
        impact: 'High',
        status: 'ongoing'
      },
      {
        id: 9,
        title: 'Tree Planting Initiative',
        date: '2024-01-20',
        location: 'Global',
        description: 'Massive tree planting initiative across multiple countries.',
        image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2071&auto=format&fit=crop',
        category: 'forest',
        participants: 10000,
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
  const container = document.querySelector(`[data-tab="${tabId}"] .events-grid`);
  
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
        <span class="stat">${formatNumber(event.participants)} participants</span>
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
  // Event card hover effects
  const eventCards = document.querySelectorAll('.event-card');
  eventCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-10px)';
    });
    
    card.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0)';
    });
  });
  
  // Event card click handlers
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
  
  // Create modal or detailed view
  const modal = document.createElement('div');
  modal.className = 'event-details-modal';
  modal.innerHTML = `
    <div class="modal-content">
      <span class="close">&times;</span>
      <div class="event-details">
        <div class="event-image">
          <img src="${event.image}" alt="${event.title}">
        </div>
        <div class="event-info">
          <h2>${event.title}</h2>
          <div class="event-meta">
            <span class="event-date">${formatDate(event.date)}</span>
            <span class="event-location">${event.location}</span>
            <span class="event-category">${event.category}</span>
          </div>
          <p>${event.description}</p>
          <div class="event-stats">
            <div class="stat-item">
              <span class="stat-label">Participants</span>
              <span class="stat-value">${formatNumber(event.participants)}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Impact</span>
              <span class="stat-value">${event.impact}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Status</span>
              <span class="stat-value">${event.status}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  // Add close functionality
  const closeBtn = modal.querySelector('.close');
  closeBtn.addEventListener('click', () => {
    document.body.removeChild(modal);
  });
  
  // Close on outside click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      document.body.removeChild(modal);
    }
  });
}

// Set up responsive behavior
function setupEventsResponsive() {
  const handleResize = debounce(() => {
    const grid = document.querySelector('.events-grid');
    if (grid) {
      const cardsPerRow = window.innerWidth < 768 ? 1 : 
                         window.innerWidth < 1024 ? 2 : 3;
      
      grid.style.gridTemplateColumns = `repeat(${cardsPerRow}, 1fr)`;
    }
  }, 250);
  
  window.addEventListener('resize', handleResize);
  handleResize(); // Initial call
}

// Filter events
function filterEvents(category, status, impact) {
  const allEvents = Object.values(eventsData.events).flat();
  let filteredEvents = allEvents;
  
  if (category && category !== 'all') {
    filteredEvents = filteredEvents.filter(event => event.category === category);
  }
  
  if (status && status !== 'all') {
    filteredEvents = filteredEvents.filter(event => event.status === status);
  }
  
  if (impact && impact !== 'all') {
    filteredEvents = filteredEvents.filter(event => event.impact === impact);
  }
  
  return filteredEvents;
}

// Search events
function searchEvents(query) {
  const allEvents = Object.values(eventsData.events).flat();
  
  if (!query) return allEvents;
  
  const searchTerm = query.toLowerCase();
  return allEvents.filter(event => 
    event.title.toLowerCase().includes(searchTerm) ||
    event.description.toLowerCase().includes(searchTerm) ||
    event.location.toLowerCase().includes(searchTerm)
  );
}

// Export events functions
window.Events = {
  initialize: initializeEvents,
  render: renderEvents,
  filter: filterEvents,
  search: searchEvents,
  showDetails: showEventDetails
};
