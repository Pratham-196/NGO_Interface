/* Modals JavaScript for Greenpeace Project */

// Modal data and state
let modalData = {
  activeModal: null,
  modals: {
    donation: null,
    action: null,
    corporate: null,
    education: null,
    social: null,
    volunteer: null
  }
};

const API_BASE_URL = window.__NGO_API_BASE_URL__ || "http://localhost:3001";

const volunteerDataState = {
  isLoading: false,
  lastFetched: 0
};

// Initialize modals
function initializeModals() {
  console.log('Initializing modals...');
  
  // Set up modal triggers
  setupModalTriggers();
  
  // Set up modal close handlers
  setupModalCloseHandlers();
  
  // Set up form handlers
  setupModalForms();
  
  // Set up tab switching in modals
  setupModalTabs();

  // Set up volunteer data helpers
  setupVolunteerSupport();
}

// Set up modal triggers
function setupModalTriggers() {
  // Donation modal triggers
  const donationTriggers = document.querySelectorAll('[data-modal="donation"]');
  donationTriggers.forEach(trigger => {
    trigger.addEventListener('click', function(e) {
      e.preventDefault();
      openModal('donation');
    });
  });
  
  // Action modal triggers
  const actionTriggers = document.querySelectorAll('[data-modal="action"]');
  actionTriggers.forEach(trigger => {
    trigger.addEventListener('click', function(e) {
      e.preventDefault();
      openModal('action');
    });
  });
  
  // Corporate modal triggers
  const corporateTriggers = document.querySelectorAll('[data-modal="corporate"]');
  corporateTriggers.forEach(trigger => {
    trigger.addEventListener('click', function(e) {
      e.preventDefault();
      openModal('corporate');
    });
  });
  
  // Education modal triggers
  const educationTriggers = document.querySelectorAll('[data-modal="education"]');
  educationTriggers.forEach(trigger => {
    trigger.addEventListener('click', function(e) {
      e.preventDefault();
      openModal('education');
    });
  });
  
  // Social modal triggers
  const socialTriggers = document.querySelectorAll('[data-modal="social"]');
  socialTriggers.forEach(trigger => {
    trigger.addEventListener('click', function(e) {
      e.preventDefault();
      openModal('social');
    });
  });
  
  // Volunteer modal triggers
  const volunteerTriggers = document.querySelectorAll('[data-modal="volunteer"]');
  volunteerTriggers.forEach(trigger => {
    trigger.addEventListener('click', function(e) {
      e.preventDefault();
      openModal('volunteer');
    });
  });

  // Contact modal triggers
  const contactTriggers = document.querySelectorAll('[data-modal="contact"]');
  contactTriggers.forEach(trigger => {
    trigger.addEventListener('click', function(e) {
      e.preventDefault();
      openModal('contact');
    });
  });
}

// Set up modal close handlers
function setupModalCloseHandlers() {
  // Close buttons
  const closeButtons = document.querySelectorAll('.close');
  closeButtons.forEach(button => {
    button.addEventListener('click', function() {
      closeModal();
    });
  });
  
  // Click outside to close
  const modals = document.querySelectorAll('.modal');
  modals.forEach(modal => {
    modal.addEventListener('click', function(e) {
      if (e.target === this) {
        closeModal();
      }
    });
  });
  
  // Escape key to close
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && modalData.activeModal) {
      closeModal();
    }
  });
}

// Set up modal forms
function setupModalForms() {
  // Volunteer form
  const volunteerForm = document.querySelector('#volunteer-form');
  if (volunteerForm) {
    volunteerForm.addEventListener('submit', function(e) {
      e.preventDefault();
      handleVolunteerSubmission(this);
    });
  }
  
  // Social media form
  const socialForm = document.querySelector('#social-form');
  if (socialForm) {
    socialForm.addEventListener('submit', function(e) {
      e.preventDefault();
      handleSocialSubmission(this);
    });
  }
}

// Set up modal tabs
function setupModalTabs() {
  // Social media tabs
  const socialTabs = document.querySelectorAll('.social-tab');
  const socialContents = document.querySelectorAll('.social-tab-content');
  
  socialTabs.forEach(tab => {
    tab.addEventListener('click', function() {
      const tabId = this.getAttribute('data-tab');
      
      // Update active tab
      socialTabs.forEach(t => t.classList.remove('active'));
      this.classList.add('active');
      
      // Update active content
      socialContents.forEach(content => {
        content.classList.remove('active');
        if (content.getAttribute('data-tab') === tabId) {
          content.classList.add('active');
        }
      });
    });
  });
}

function setupVolunteerSupport() {
  const refreshButton = document.querySelector('#refresh-volunteers');
  if (refreshButton) {
    refreshButton.addEventListener('click', () => {
      fetchRecentVolunteers();
    });
  }
}

// Open modal
function openModal(modalId) {
  console.log(`Opening modal: ${modalId}`);
  
  const modal = document.getElementById(`${modalId}-modal`);
  if (!modal) {
    console.error(`Modal not found: ${modalId}`);
    return;
  }
  
  // Close any existing modal
  if (modalData.activeModal) {
    closeModal();
  }
  
  // Show modal
  modal.style.display = 'block';
  modalData.activeModal = modalId;
  modalData.modals[modalId] = modal;
  
  // Add animation
  setTimeout(() => {
    modal.classList.add('show');
  }, 10);
  
  // Prevent body scroll
  document.body.style.overflow = 'hidden';
  
  // Focus first input if available
  const firstInput = modal.querySelector('input, textarea, select');
  if (firstInput) {
    setTimeout(() => firstInput.focus(), 100);
  }
  
  if (modalId === 'volunteer') {
    fetchRecentVolunteers({ silent: true });
  }
  
  // Trigger modal opened event
  const event = new CustomEvent('modalOpened', {
    detail: { modalId: modalId }
  });
  document.dispatchEvent(event);
}

// Close modal
function closeModal() {
  if (!modalData.activeModal) return;
  
  console.log(`Closing modal: ${modalData.activeModal}`);
  
  const modal = modalData.modals[modalData.activeModal];
  if (modal) {
    modal.classList.remove('show');
    
    setTimeout(() => {
      modal.style.display = 'none';
    }, 300);
  }
  
  // Reset state
  modalData.activeModal = null;
  
  // Restore body scroll
  document.body.style.overflow = '';
  
  // Trigger modal closed event
  const event = new CustomEvent('modalClosed', {
    detail: { modalId: modalData.activeModal }
  });
  document.dispatchEvent(event);
}

// Handle volunteer form submission
async function handleVolunteerSubmission(form) {
  const formData = new FormData(form);
  const payload = {
    name: (formData.get('name') || '').trim(),
    email: (formData.get('email') || '').trim(),
    phone: (formData.get('phone') || '').trim(),
    location: (formData.get('location') || '').trim(),
    interests: formData.getAll('interests').map(value => (value || '').trim()).filter(Boolean),
    experience: (formData.get('experience') || '').trim(),
    source: 'greenpeace'
  };
  
  if (!payload.name || !payload.email || !payload.location) {
    showNotification('Name, email, and location are required.', 'error');
    return;
  }
  
  const submitButton = form.querySelector('.btn-primary');
  const originalButtonText = submitButton ? submitButton.textContent : '';
  
  if (submitButton) {
    submitButton.disabled = true;
    submitButton.textContent = 'Submitting...';
  }
  
  try {
    const response = await fetch(buildApiUrl('/volunteers'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    
    const result = await response.json().catch(() => ({}));
    
    if (!response.ok) {
      throw new Error(result.message || 'Unable to submit your application right now.');
    }
    
    showNotification('Thank you for your interest in volunteering! We will contact you soon.', 'success');
    form.reset();
    closeModal();
    fetchRecentVolunteers({ silent: true });
  } catch (error) {
    console.error('Volunteer submission failed:', error);
    showNotification(error.message || 'Something went wrong while submitting the form.', 'error');
  } finally {
    if (submitButton) {
      submitButton.disabled = false;
      submitButton.textContent = originalButtonText;
    }
  }
}

async function fetchRecentVolunteers(options = {}) {
  const { silent = false, limit = 5 } = options;
  const listElement = document.getElementById('volunteer-list');

  if (!listElement || volunteerDataState.isLoading) {
    return;
  }

  volunteerDataState.isLoading = true;
  setVolunteerEmptyState(false);
  updateVolunteerStatusMessage('Loading latest volunteer sign-ups...', 'info');

  try {
    const response = await fetch(buildApiUrl('/volunteers', { limit }));
    let payload = {};

    try {
      payload = await response.json();
    } catch {
      payload = {};
    }

    if (!response.ok) {
      throw new Error(payload.message || 'Unable to fetch volunteers right now.');
    }

    const volunteers = Array.isArray(payload.volunteers) ? payload.volunteers : [];
    renderVolunteerList(volunteers);
    volunteerDataState.lastFetched = Date.now();

    updateVolunteerStatusMessage(
      volunteers.length
        ? 'Showing the latest Greenpeace volunteer sign-ups stored in the database.'
        : 'No volunteer submissions found yet.',
      volunteers.length ? 'success' : 'info'
    );

    setVolunteerEmptyState(volunteers.length === 0);
  } catch (error) {
    console.error('Failed to load volunteer list:', error);
    updateVolunteerStatusMessage(
      'Unable to load volunteer data. Please ensure the backend server is running.',
      'error'
    );
    setVolunteerEmptyState(true);

    if (!silent) {
      showNotification('Unable to load volunteer data. Please try again later.', 'error');
    }
  } finally {
    volunteerDataState.isLoading = false;
  }
}

function renderVolunteerList(volunteers = []) {
  const listElement = document.getElementById('volunteer-list');
  if (!listElement) {
    return;
  }

  listElement.innerHTML = '';

  volunteers.forEach((volunteer) => {
    const listItem = document.createElement('li');
    listItem.className = 'volunteer-list-item';

    const interests = Array.isArray(volunteer.interests) && volunteer.interests.length
      ? volunteer.interests
      : ['General Support'];

    const interestMarkup = interests
      .slice(0, 4)
      .map((interest) => `<span class="volunteer-pill">${escapeHtml(interest)}</span>`)
      .join('');

    listItem.innerHTML = `
      <div class="volunteer-list-primary">
        <span class="volunteer-name">${escapeHtml(volunteer.name || 'Greenpeace Supporter')}</span>
        <span class="volunteer-location">${escapeHtml(volunteer.location || 'Location not shared')}</span>
      </div>
      <div class="volunteer-meta">
        ${interestMarkup}
        <span class="volunteer-date">${formatVolunteerTimestamp(volunteer.createdAt)}</span>
      </div>
    `;

    listElement.appendChild(listItem);
  });
}

function updateVolunteerStatusMessage(message, state = 'info') {
  const statusElement = document.getElementById('volunteer-status-message');
  if (!statusElement) {
    return;
  }

  statusElement.textContent = message;
  statusElement.classList.remove('success', 'error');

  if (state === 'success') {
    statusElement.classList.add('success');
  } else if (state === 'error') {
    statusElement.classList.add('error');
  }
}

function setVolunteerEmptyState(isVisible) {
  const emptyStateElement = document.getElementById('volunteer-empty-state');
  if (!emptyStateElement) {
    return;
  }

  emptyStateElement.classList.toggle('visible', Boolean(isVisible));
}

function formatVolunteerTimestamp(timestamp) {
  if (!timestamp) {
    return 'Just now';
  }

  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) {
    return 'Recently';
  }

  const diffMs = Date.now() - date.getTime();
  const diffMinutes = Math.floor(diffMs / 60000);

  if (diffMinutes < 1) return 'Just now';
  if (diffMinutes < 60) return `${diffMinutes} min${diffMinutes === 1 ? '' : 's'} ago`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`;

  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

function escapeHtml(value = '') {
  return String(value).replace(/[&<>"']/g, (char) => {
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    };
    return map[char] || char;
  });
}

function buildApiUrl(path, params = {}) {
  const trimmedBase = API_BASE_URL.replace(/\/+$/, '');
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const url = new URL(`${trimmedBase}${normalizedPath}`);

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.append(key, value);
    }
  });

  return url.toString();
}

// Handle social media form submission
function handleSocialSubmission(form) {
  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());
  
  console.log('Social media form submitted:', data);
  
  // Show success message
  showNotification('Thank you for sharing! Your message has been posted.', 'success');
  
  // Close modal
  closeModal();
  
  // Reset form
  form.reset();
}

// Show notification
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  
  // Add styles
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${type === 'success' ? '#2ecc71' : type === 'error' ? '#e74c3c' : '#3498db'};
    color: white;
    padding: 15px 20px;
    border-radius: 5px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    z-index: 10000;
    animation: slideInRight 0.3s ease-out;
  `;
  
  document.body.appendChild(notification);
  
  // Remove after 5 seconds
  setTimeout(() => {
    notification.style.animation = 'slideOutRight 0.3s ease-in';
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }, 5000);
}

// Copy to clipboard
function copyToClipboard(text) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(() => {
      showNotification('Copied to clipboard!', 'success');
    }).catch(() => {
      fallbackCopyToClipboard(text);
    });
  } else {
    fallbackCopyToClipboard(text);
  }
}

// Fallback copy to clipboard
function fallbackCopyToClipboard(text) {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.style.position = 'fixed';
  textArea.style.left = '-999999px';
  textArea.style.top = '-999999px';
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  
  try {
    document.execCommand('copy');
    showNotification('Copied to clipboard!', 'success');
  } catch (err) {
    showNotification('Failed to copy to clipboard', 'error');
  }
  
  document.body.removeChild(textArea);
}

// Share on social media
function shareOnSocial(platform, url, text) {
  const encodedUrl = encodeURIComponent(url);
  const encodedText = encodeURIComponent(text);
  
  const shareUrls = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    whatsapp: `https://wa.me/?text=${encodedText}%20${encodedUrl}`
  };
  
  if (shareUrls[platform]) {
    window.open(shareUrls[platform], '_blank', 'width=600,height=400');
  }
}

// Set up copy buttons
function setupCopyButtons() {
  const copyButtons = document.querySelectorAll('.copy-btn');
  copyButtons.forEach(button => {
    button.addEventListener('click', function() {
      const textToCopy = this.getAttribute('data-copy');
      if (textToCopy) {
        copyToClipboard(textToCopy);
      }
    });
  });
}

// Set up share buttons
function setupShareButtons() {
  const shareButtons = document.querySelectorAll('.share-btn');
  shareButtons.forEach(button => {
    button.addEventListener('click', function() {
      const platform = this.getAttribute('data-platform');
      const url = this.getAttribute('data-url') || window.location.href;
      const text = this.getAttribute('data-text') || document.title;
      
      if (platform) {
        shareOnSocial(platform, url, text);
      }
    });
  });
}

// Initialize modal functionality
function initializeModalFunctionality() {
  setupCopyButtons();
  setupShareButtons();
}

// Export modal functions
window.Modals = {
  initialize: initializeModals,
  open: openModal,
  close: closeModal,
  copyToClipboard: copyToClipboard,
  shareOnSocial: shareOnSocial,
  showNotification: showNotification
};
