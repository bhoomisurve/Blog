// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Initialize all app functionality
function initializeApp() {
    initMobileMenu();
    initAlerts();
    initFormValidation();
    initTooltips();
    initAnimations();
    initTextEditor();
    initCommentSystem();
    initConfirmDialogs();
    initLoadingStates();
}

// Mobile Menu Toggle
function initMobileMenu() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuToggle && navLinks) {
        mobileMenuToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            
            // Animate hamburger menu
            const icon = this.querySelector('i') || this;
            if (navLinks.classList.contains('active')) {
                icon.innerHTML = '✕';
            } else {
                icon.innerHTML = '☰';
            }
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!mobileMenuToggle.contains(e.target) && !navLinks.contains(e.target)) {
                navLinks.classList.remove('active');
                const icon = mobileMenuToggle.querySelector('i') || mobileMenuToggle;
                icon.innerHTML = '☰';
            }
        });
    }
}

// Alert System
function initAlerts() {
    const alerts = document.querySelectorAll('.alert');
    
    alerts.forEach(alert => {
        // Auto-dismiss alerts after 5 seconds
        setTimeout(() => {
            fadeOutAlert(alert);
        }, 5000);
        
        // Close button functionality
        const closeBtn = alert.querySelector('.alert-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                fadeOutAlert(alert);
            });
        }
    });
}

function fadeOutAlert(alert) {
    alert.style.opacity = '0';
    alert.style.transform = 'translateX(100%)';
    setTimeout(() => {
        alert.remove();
    }, 300);
}

// Show alert programmatically
function showAlert(message, type = 'info') {
    const alertHTML = `
        <div class="alert alert-${type} fade-in">
            <span>${message}</span>
            <button class="alert-close">×</button>
        </div>
    `;
    
    const container = document.querySelector('.container') || document.body;
    container.insertAdjacentHTML('afterbegin', alertHTML);
    
    const newAlert = container.querySelector('.alert');
    const closeBtn = newAlert.querySelector('.alert-close');
    
    closeBtn.addEventListener('click', () => {
        fadeOutAlert(newAlert);
    });
    
    setTimeout(() => {
        fadeOutAlert(newAlert);
    }, 5000);
}

// Form Validation
function initFormValidation() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            if (!validateForm(this)) {
                e.preventDefault();
            }
        });
        
        // Real-time validation
        const inputs = form.querySelectorAll('.form-control');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
            
            input.addEventListener('input', function() {
                if (this.classList.contains('is-invalid')) {
                    validateField(this);
                }
            });
        });
    });
}

function validateForm(form) {
    let isValid = true;
    const inputs = form.querySelectorAll('.form-control[required]');
    
    inputs.forEach(input => {
        if (!validateField(input)) {
            isValid = false;
        }
    });
    
    return isValid;
}

function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';
    
    // Required field validation
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = 'This field is required.';
    }
    
    // Email validation
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address.';
        }
    }
    
    // Password validation
    if (field.type === 'password' && value) {
        if (value.length < 6) {
            isValid = false;
            errorMessage = 'Password must be at least 6 characters long.';
        }
    }
    
    // Username validation
    if (field.name === 'username' && value) {
        const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
        if (!usernameRegex.test(value)) {
            isValid = false;
            errorMessage = 'Username must be 3-20 characters long and contain only letters, numbers, and underscores.';
        }
    }
    
    // Update field appearance
    if (isValid) {
        field.classList.remove('is-invalid');
        removeFieldError(field);
    } else {
        field.classList.add('is-invalid');
        showFieldError(field, errorMessage);
    }
    
    return isValid;
}

function showFieldError(field, message) {
    removeFieldError(field);
    
    const errorElement = document.createElement('div');
    errorElement.className = 'field-error';
    errorElement.style.color = 'var(--error-color)';
    errorElement.style.fontSize = '0.875rem';
    errorElement.style.marginTop = '0.25rem';
    errorElement.textContent = message;
    
    field.parentNode.appendChild(errorElement);
}

function removeFieldError(field) {
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
}

// Tooltips
function initTooltips() {
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    
    tooltipElements.forEach(element => {
        element.addEventListener('mouseenter', showTooltip);
        element.addEventListener('mouseleave', hideTooltip);
    });
}

function showTooltip(e) {
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.textContent = e.target.getAttribute('data-tooltip');
    tooltip.style.cssText = `
        position: absolute;
        background: var(--text-primary);
        color: white;
        padding: 0.5rem 0.75rem;
        font-size: 0.875rem;
        border-radius: 4px;
        white-space: nowrap;
        z-index: 1000;
        pointer-events: none;
        opacity: 0;
        transition: opacity 0.3s ease;
    `;
    
    document.body.appendChild(tooltip);
    
    const rect = e.target.getBoundingClientRect();
    tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
    tooltip.style.top = rect.top - tooltip.offsetHeight - 8 + 'px';
    
    setTimeout(() => {
        tooltip.style.opacity = '1';
    }, 10);
    
    e.target.tooltipElement = tooltip;
}

function hideTooltip(e) {
    if (e.target.tooltipElement) {
        e.target.tooltipElement.remove();
        delete e.target.tooltipElement;
    }
}

// Animations
function initAnimations() {
    // Fade in elements on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    const animatedElements = document.querySelectorAll('.card, .post-item, .comment');
    animatedElements.forEach(el => {
        observer.observe(el);
    });
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Simple Text Editor Enhancement
function initTextEditor() {
    const textareas = document.querySelectorAll('textarea');
    
    textareas.forEach(textarea => {
        // Auto-resize textarea
        textarea.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = this.scrollHeight + 'px';
        });
        
        // Add formatting shortcuts
        textarea.addEventListener('keydown', function(e) {
            // Tab for indentation
            if (e.key === 'Tab') {
                e.preventDefault();
                const start = this.selectionStart;
                const end = this.selectionEnd;
                
                this.value = this.value.substring(0, start) + '\t' + this.value.substring(end);
                this.selectionStart = this.selectionEnd = start + 1;
            }
            
            // Ctrl+B for bold
            if (e.ctrlKey && e.key === 'b') {
                e.preventDefault();
                wrapSelectedText(this, '**', '**');
            }
            
            // Ctrl+I for italic
            if (e.ctrlKey && e.key === 'i') {
                e.preventDefault();
                wrapSelectedText(this, '*', '*');
            }
        });
    });
}

function wrapSelectedText(textarea, prefix, suffix) {
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    
    if (selectedText) {
        const newText = prefix + selectedText + suffix;
        textarea.value = textarea.value.substring(0, start) + newText + textarea.value.substring(end);
        textarea.selectionStart = start + prefix.length;
        textarea.selectionEnd = start + prefix.length + selectedText.length;
    } else {
        const placeholder = prefix === '**' ? 'bold text' : 'italic text';
        const newText = prefix + placeholder + suffix;
        textarea.value = textarea.value.substring(0, start) + newText + textarea.value.substring(end);
        textarea.selectionStart = start + prefix.length;
        textarea.selectionEnd = start + prefix.length + placeholder.length;
    }
    textarea.focus();
}

// Comment System Enhancement
function initCommentSystem() {
    const commentForms = document.querySelectorAll('form[action*="add-comment"]');
    
    commentForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            const textarea = this.querySelector('textarea');
            const submitBtn = this.querySelector('button[type="submit"]');
            
            if (textarea.value.trim().length < 10) {
                e.preventDefault();
                showAlert('Comment must be at least 10 characters long.', 'error');
                return;
            }
            
            // Add loading state
            if (submitBtn) {
                submitBtn.classList.add('loading');
                submitBtn.disabled = true;
            }
        });
    });
    
    // Character counter for comment textarea
    const commentTextareas = document.querySelectorAll('textarea[name="content"]');
    commentTextareas.forEach(textarea => {
        addCharacterCounter(textarea);
    });
}

function addCharacterCounter(textarea) {
    const counter = document.createElement('div');
    counter.className = 'character-counter';
    counter.style.cssText = `
        text-align: right;
        font-size: 0.75rem;
        color: var(--text-secondary);
        margin-top: 0.25rem;
    `;
    
    const updateCounter = () => {
        const length = textarea.value.length;
        const minLength = 10;
        const maxLength = 1000;
        
        counter.textContent = `${length}/${maxLength}`;
        
        if (length < minLength) {
            counter.style.color = 'var(--error-color)';
        } else if (length > maxLength * 0.9) {
            counter.style.color = 'var(--warning-color)';
        } else {
            counter.style.color = 'var(--text-secondary)';
        }
        
        if (length > maxLength) {
            textarea.value = textarea.value.substring(0, maxLength);
            counter.textContent = `${maxLength}/${maxLength}`;
        }
    };
    
    textarea.addEventListener('input', updateCounter);
    textarea.parentNode.appendChild(counter);
    updateCounter();
}

// Confirmation Dialogs
function initConfirmDialogs() {
    const deleteButtons = document.querySelectorAll('button[onclick*="delete"], form[action*="delete"] button');
    
    deleteButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            const itemType = this.closest('form').action.includes('post') ? 'post' : 'comment';
            const confirmMessage = `Are you sure you want to delete this ${itemType}? This action cannot be undone.`;
            
            showConfirmDialog(confirmMessage, () => {
                if (this.closest('form')) {
                    this.closest('form').submit();
                } else {
                    // Handle onclick delete
                    const onclickValue = this.getAttribute('onclick');
                    if (onclickValue) {
                        eval(onclickValue);
                    }
                }
            });
        });
    });
}

function showConfirmDialog(message, onConfirm) {
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 2000;
        animation: fadeIn 0.3s ease;
    `;
    
    const modal = document.createElement('div');
    modal.className = 'confirm-modal';
    modal.style.cssText = `
        background: var(--card-background);
        padding: 2rem;
        border-radius: var(--border-radius);
        box-shadow: var(--shadow-lg);
        max-width: 400px;
        width: 90%;
        animation: slideUp 0.3s ease;
    `;
    
    modal.innerHTML = `
        <h3 style="margin-bottom: 1rem; color: var(--text-primary);">Confirm Action</h3>
        <p style="margin-bottom: 2rem; color: var(--text-secondary);">${message}</p>
        <div style="display: flex; gap: 1rem; justify-content: flex-end;">
            <button class="btn btn-secondary cancel-btn">Cancel</button>
            <button class="btn btn-danger confirm-btn">Delete</button>
        </div>
    `;
    
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
    
    const cancelBtn = modal.querySelector('.cancel-btn');
    const confirmBtn = modal.querySelector('.confirm-btn');
    
    const closeModal = () => {
        overlay.style.opacity = '0';
        setTimeout(() => {
            document.body.removeChild(overlay);
        }, 300);
    };
    
    cancelBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeModal();
    });
    
    confirmBtn.addEventListener('click', () => {
        closeModal();
        onConfirm();
    });
    
    // Focus on cancel button by default
    setTimeout(() => cancelBtn.focus(), 100);
}

// Loading States
function initLoadingStates() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function() {
            const submitBtn = this.querySelector('button[type="submit"]');
            if (submitBtn && !submitBtn.classList.contains('loading')) {
                submitBtn.classList.add('loading');
                submitBtn.disabled = true;
                submitBtn.textContent = 'Processing...';
            }
        });
    });
}

// Utility Functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Search functionality (if search is added later)
function initSearch() {
    const searchInput = document.querySelector('#search-input');
    if (searchInput) {
        const debouncedSearch = debounce(performSearch, 300);
        searchInput.addEventListener('input', debouncedSearch);
    }
}

function performSearch(e) {
    const query = e.target.value.trim();
    if (query.length > 2) {
        // Implement search logic here
        console.log('Searching for:', query);
    }
}

// Dark mode toggle (if dark mode is implemented)
function initDarkMode() {
    const darkModeToggle = document.querySelector('#dark-mode-toggle');
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', toggleDarkMode);
        
        // Load saved preference
        if (localStorage.getItem('darkMode') === 'true') {
            document.body.classList.add('dark-mode');
        }
    }
}

function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDark);
}

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl+/ for help
    if (e.ctrlKey && e.key === '/') {
        e.preventDefault();
        showKeyboardShortcuts();
    }
    
    // Escape to close modals
    if (e.key === 'Escape') {
        const modal = document.querySelector('.modal-overlay');
        if (modal) {
            modal.click();
        }
        
        const mobileMenu = document.querySelector('.nav-links.active');
        if (mobileMenu) {
            mobileMenu.classList.remove('active');
            const icon = document.querySelector('.mobile-menu-toggle i') || document.querySelector('.mobile-menu-toggle');
            icon.innerHTML = '☰';
        }
    }
});

function showKeyboardShortcuts() {
    const shortcuts = [
        { key: 'Ctrl + B', action: 'Bold text (in textarea)' },
        { key: 'Ctrl + I', action: 'Italic text (in textarea)' },
        { key: 'Tab', action: 'Indent text (in textarea)' },
        { key: 'Ctrl + /', action: 'Show this help' },
        { key: 'Escape', action: 'Close modals/menus' }
    ];
    
    const shortcutsList = shortcuts.map(s => 
        `<div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
            <kbd style="background: var(--background-color); padding: 0.25rem 0.5rem; border-radius: 4px; font-family: monospace;">${s.key}</kbd>
            <span>${s.action}</span>
        </div>`
    ).join('');
    
    showModal('Keyboard Shortcuts', shortcutsList);
}

function showModal(title, content) {
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 2000;
        animation: fadeIn 0.3s ease;
    `;
    
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.cssText = `
        background: var(--card-background);
        padding: 2rem;
        border-radius: var(--border-radius);
        box-shadow: var(--shadow-lg);
        max-width: 500px;
        width: 90%;
        max-height: 80vh;
        overflow-y: auto;
        animation: slideUp 0.3s ease;
    `;
    
    modal.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
            <h3 style="margin: 0; color: var(--text-primary);">${title}</h3>
            <button class="modal-close" style="background: none; border: none; font-size: 1.5rem; cursor: pointer; color: var(--text-secondary);">×</button>
        </div>
        <div>${content}</div>
    `;
    
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
    
    const closeBtn = modal.querySelector('.modal-close');
    const closeModal = () => {
        overlay.style.opacity = '0';
        setTimeout(() => {
            document.body.removeChild(overlay);
        }, 300);
    };
    
    closeBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeModal();
    });
    
    setTimeout(() => closeBtn.focus(), 100);
}

// Performance optimization
function optimizeImages() {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        if (!img.hasAttribute('loading')) {
            img.setAttribute('loading', 'lazy');
        }
    });
}

// Initialize optimizations
setTimeout(() => {
    optimizeImages();
}, 1000);
