/* Modals JavaScript for CARE International Project */

// Modal data and state
let modalData = {
  activeModal: null,
  modals: {
    donation: null,
    action: null,
    corporate: null,
    education: null,
    social: null,
    volunteer: null,
    contact: null
  }
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
  
  // Set up copy and share buttons
  setupCopyButtons();
  setupShareButtons();
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
}

// Set up modal tabs
function setupModalTabs() {
  const tabGroups = document.querySelectorAll('.tab-group');
  
  tabGroups.forEach(group => {
    const tabs = group.querySelectorAll('.tab-button');
    const contents = group.querySelectorAll('.tab-content');
    
    tabs.forEach(tab => {
      tab.addEventListener('click', function() {
        const tabId = this.getAttribute('data-tab');
        
        tabs.forEach(t => t.classList.remove('active'));
        this.classList.add('active');
        
        contents.forEach(content => {
          content.classList.toggle('active', content.getAttribute('data-tab') === tabId);
        });
      });
    });
  });
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
  
  // Prevent body scroll
  document.body.style.overflow = 'hidden';
  
  // Focus first input if available
  const firstInput = modal.querySelector('input, textarea, select');
  if (firstInput) {
    setTimeout(() => firstInput.focus(), 100);
  }
}

// Close modal
function closeModal() {
  if (!modalData.activeModal) return;
  
  console.log(`Closing modal: ${modalData.activeModal}`);
  
  const modal = modalData.modals[modalData.activeModal];
  if (modal) {
    modal.style.display = 'none';
  }
  
  // Reset state
  modalData.activeModal = null;
  
  // Restore body scroll
  document.body.style.overflow = '';
}

// Handle volunteer form submission
function handleVolunteerSubmission(form) {
  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());
  
  console.log('Volunteer form submitted:', data);
  
  // Show success message
  showNotification('Thank you for your interest in volunteering with CARE! We will contact you soon.', 'success');
  
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
  const shareButtons = document.querySelectorAll('.social-btn');
  shareButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      const platform = this.className.includes('facebook') ? 'facebook' :
                       this.className.includes('twitter') ? 'twitter' :
                       this.className.includes('linkedin') ? 'linkedin' : null;
      
      if (platform) {
        const url = encodeURIComponent(window.location.href);
        const text = encodeURIComponent('Support CARE International in fighting global poverty!');
        const shareUrls = {
          facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
          twitter: `https://twitter.com/intent/tweet?url=${url}&text=${text}`,
          linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`
        };
        
        if (shareUrls[platform]) {
          window.open(shareUrls[platform], '_blank', 'width=600,height=400');
        }
      }
    });
  });
}

// Export modal functions
window.Modals = {
  initialize: initializeModals,
  open: openModal,
  close: closeModal,
  copyToClipboard: copyToClipboard,
  showNotification: showNotification
};

