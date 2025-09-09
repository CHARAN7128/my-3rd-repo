// BMW Dashboard Application JavaScript

// BMW Models Data
const bmwModels = [
    {
        name: "BMW X7",
        power: "375 hp",
        acceleration: "4.7 sec",
        top_speed: "155 mph",
        price: "$131,000",
        type: "SUV",
        image: "https://pplx-res.cloudinary.com/image/upload/v1757277856/pplx_project_search_images/dbc35bb1b3542c424b0961707ee116345c2b05ef.png"
    },
    {
        name: "BMW M3 Competition",
        power: "523 hp",
        acceleration: "3.4 sec",
        top_speed: "180 mph",
        price: "$87,700",
        type: "Sedan",
        image: "https://pplx-res.cloudinary.com/image/upload/v1757394463/pplx_project_search_images/5e0860ceaa3cd904d9277328cd7ae96c001cc509.png"
    },
    {
        name: "BMW M5 Competition",
        power: "750 hp",
        acceleration: "3.2 sec",
        top_speed: "190 mph",
        price: "$199,000",
        type: "Sedan",
        image: "https://pplx-res.cloudinary.com/image/upload/v1757394463/pplx_project_search_images/534b8009f653df00dab5d9f8887bc36ddbce9ce2.png"
    },
    {
        name: "BMW 7 Series",
        power: "375 hp",
        acceleration: "4.7 sec",
        top_speed: "155 mph",
        price: "$190,000",
        type: "Sedan",
        image: "https://pplx-res.cloudinary.com/image/upload/v1757394463/pplx_project_search_images/1be532b68efb598aa4dc32c327d8cf9444050ef1.png"
    },
    {
        name: "BMW i5 eDrive40",
        power: "335 hp",
        acceleration: "6.1 sec",
        top_speed: "120 mph",
        price: "$120,000",
        type: "Electric",
        image: "https://pplx-res.cloudinary.com/image/upload/v1754720692/pplx_project_search_images/87880d66bc4d5e533dd3350e7afe0edb5d9a02d9.png"
    }
];

// iDrive menu system
const idriveMenus = [
    { title: 'Navigation', content: 'GPS Active<br>Route: Munich Center<br>ETA: 15 min', icon: '🗺️' },
    { title: 'Media', content: 'Playing: BMW Podcast<br>Volume: 65%<br>Harman Kardon', icon: '🎵' },
    { title: 'Climate', content: 'Temperature: 22°C<br>Auto Mode: ON<br>Comfort Setting', icon: '❄️' },
    { title: 'Vehicle', content: 'Range: 450km<br>All Systems OK<br>Service: 5000km', icon: '🚗' }
];

// Global state
let currentModelIndex = 0;
let currentIdriveMenu = 0;
let isDarkTheme = false;
let gaugeAnimationActive = false;

// DOM Elements
const loadingScreen = document.getElementById('loadingScreen');
const themeToggle = document.getElementById('themeToggle');
const modelItems = document.querySelectorAll('.model-item');
const selectedModelImage = document.getElementById('selectedModelImage');
const selectedModelName = document.getElementById('selectedModelName');
const selectedPower = document.getElementById('selectedPower');
const selectedAccel = document.getElementById('selectedAccel');
const selectedSpeed = document.getElementById('selectedSpeed');
const selectedPrice = document.getElementById('selectedPrice');
const speedGauge = document.getElementById('speedGauge');
const powerGauge = document.getElementById('powerGauge');
const speedValue = document.getElementById('speedValue');
const powerValue = document.getElementById('powerValue');
const accelTimer = document.getElementById('accelTimer');
const compareBtn = document.getElementById('compareBtn');
const compareModal = document.getElementById('compareModal');
const closeModal = document.getElementById('closeModal');
const idriveController = document.getElementById('idriveController');
const idriveContent = document.getElementById('idriveContent');

// Initialize Application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Hide loading screen after 3 seconds
    setTimeout(() => {
        loadingScreen.classList.add('hidden');
        startInitialAnimations();
    }, 3000);

    // Initialize event listeners
    setupEventListeners();
    
    // Setup initial model display
    updateSelectedModel(0);
    
    // Initialize iDrive display
    updateIdriveScreen(0);
    
    // Setup smooth scrolling for navigation
    setupSmoothScrolling();
    
    // Initialize performance gauges
    setTimeout(() => {
        animatePerformanceGauges();
    }, 4000);
    
    // Setup intersection observer for animations
    setupScrollAnimations();
    
    // Preload images for better performance
    preloadImages();
}

function setupEventListeners() {
    // Theme toggle
    themeToggle.addEventListener('click', toggleTheme);
    
    // Model selection
    modelItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            updateSelectedModel(index);
        });
    });
    
    // Modal controls
    compareBtn.addEventListener('click', () => {
        compareModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    });
    
    closeModal.addEventListener('click', () => {
        compareModal.classList.add('hidden');
        document.body.style.overflow = 'auto';
    });
    
    compareModal.addEventListener('click', (e) => {
        if (e.target === compareModal) {
            compareModal.classList.add('hidden');
            document.body.style.overflow = 'auto';
        }
    });
    
    // iDrive simulator with enhanced interaction
    idriveController.addEventListener('click', handleIdriveClick);
    
    // Feature card interactions
    setupFeatureCardInteractions();
    
    // Tech card interactions
    setupTechCardInteractions();
    
    // Hero CTA button
    const heroCta = document.querySelector('.hero-cta');
    if (heroCta) {
        heroCta.addEventListener('click', () => {
            document.getElementById('models').scrollIntoView({ 
                behavior: 'smooth' 
            });
        });
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', handleKeyboardNavigation);
    
    // Window resize handler
    window.addEventListener('resize', handleResize);
}

function toggleTheme() {
    isDarkTheme = !isDarkTheme;
    const body = document.body;
    
    if (isDarkTheme) {
        body.setAttribute('data-color-scheme', 'dark');
        themeToggle.textContent = '☀️';
        themeToggle.setAttribute('aria-label', 'Switch to light mode');
    } else {
        body.setAttribute('data-color-scheme', 'light');
        themeToggle.textContent = '🌙';
        themeToggle.setAttribute('aria-label', 'Switch to dark mode');
    }
    
    // Animate theme transition
    body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
    setTimeout(() => {
        body.style.transition = '';
    }, 300);
    
    // Save theme preference
    localStorage.setItem('bmw-theme', isDarkTheme ? 'dark' : 'light');
}

function updateSelectedModel(index) {
    if (index < 0 || index >= bmwModels.length) return;
    
    currentModelIndex = index;
    const model = bmwModels[index];
    
    // Update model items active state
    modelItems.forEach((item, i) => {
        if (i === index) {
            item.classList.add('active');
            item.setAttribute('aria-selected', 'true');
        } else {
            item.classList.remove('active');
            item.setAttribute('aria-selected', 'false');
        }
    });
    
    // Update selected model display with animation
    const selectedModel = document.querySelector('.selected-model');
    selectedModel.style.opacity = '0';
    selectedModel.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
        selectedModelImage.src = model.image;
        selectedModelImage.alt = model.name;
        selectedModelName.textContent = model.name;
        selectedPower.textContent = model.power;
        selectedAccel.textContent = model.acceleration;
        selectedSpeed.textContent = model.top_speed;
        selectedPrice.textContent = model.price;
        
        selectedModel.style.opacity = '1';
        selectedModel.style.transform = 'translateY(0)';
    }, 200);
    
    // Update performance gauges based on selected model
    setTimeout(() => {
        updatePerformanceGauges(model);
    }, 500);
    
    // Announce change for screen readers
    announceChange(`Selected ${model.name} with ${model.power} and ${model.acceleration} acceleration`);
}

function animatePerformanceGauges() {
    if (gaugeAnimationActive) return;
    gaugeAnimationActive = true;
    
    const model = bmwModels[currentModelIndex];
    updatePerformanceGauges(model);
}

function updatePerformanceGauges(model) {
    // Parse power value
    const power = parseInt(model.power.replace(' hp', ''));
    const maxPower = 750; // BMW M5 Competition max
    const powerPercent = (power / maxPower) * 100;
    
    // Parse speed value
    const speed = parseInt(model.top_speed.replace(' mph', ''));
    const maxSpeed = 200; // Theoretical max for display
    const speedPercent = (speed / maxSpeed) * 100;
    
    // Animate speed gauge
    animateGauge(speedGauge, speedValue, speed, speedPercent);
    
    // Animate power gauge
    animateGauge(powerGauge, powerValue, power, powerPercent);
    
    // Update acceleration timer
    animateCounter(accelTimer, parseFloat(model.acceleration.replace(' sec', '')), 's');
}

function animateGauge(gaugeElement, valueElement, finalValue, percentage) {
    const circumference = 2 * Math.PI * 80; // radius = 80
    const offset = circumference - (percentage / 100) * circumference;
    
    // Reset gauge
    gaugeElement.style.strokeDashoffset = circumference;
    
    // Animate gauge
    setTimeout(() => {
        gaugeElement.style.strokeDashoffset = offset;
    }, 100);
    
    // Animate counter
    animateCounter(valueElement, finalValue);
}

function animateCounter(element, targetValue, suffix = '') {
    const startValue = 0;
    const duration = 2000;
    const startTime = Date.now();
    
    function updateCounter() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function (easeOutCubic)
        const easeProgress = 1 - Math.pow(1 - progress, 3);
        
        const currentValue = startValue + (targetValue - startValue) * easeProgress;
        const displayValue = suffix === 's' ? currentValue.toFixed(1) : Math.round(currentValue);
        element.textContent = displayValue + suffix;
        
        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        }
    }
    
    updateCounter();
}

function handleIdriveClick() {
    // Move to next menu item
    currentIdriveMenu = (currentIdriveMenu + 1) % idriveMenus.length;
    
    // Add click animation to controller
    idriveController.style.transform = 'scale(0.95) rotate(15deg)';
    setTimeout(() => {
        idriveController.style.transform = 'scale(1) rotate(0deg)';
    }, 150);
    
    // Update screen content
    updateIdriveScreen(currentIdriveMenu);
    
    // Add visual feedback
    const controllerCenter = idriveController.querySelector('.controller-center');
    controllerCenter.style.background = 'var(--bmw-light-blue)';
    controllerCenter.style.transform = 'translate(-50%, -50%) scale(1.2)';
    
    setTimeout(() => {
        controllerCenter.style.background = 'var(--bmw-blue)';
        controllerCenter.style.transform = 'translate(-50%, -50%) scale(1)';
    }, 200);
    
    // Announce change for accessibility
    announceChange(`iDrive menu changed to ${idriveMenus[currentIdriveMenu].title}`);
}

function updateIdriveScreen(index) {
    const menu = idriveMenus[index];
    
    // Add screen update animation
    idriveContent.style.opacity = '0.7';
    idriveContent.style.transform = 'scale(0.95)';
    
    setTimeout(() => {
        idriveContent.innerHTML = `
            <div class="screen-title">${menu.icon} ${menu.title}</div>
            <div class="screen-info">${menu.content}</div>
        `;
        idriveContent.style.opacity = '1';
        idriveContent.style.transform = 'scale(1)';
    }, 150);
}

function setupFeatureCardInteractions() {
    const featureCards = document.querySelectorAll('.feature-card');
    
    featureCards.forEach(card => {
        // Add hover effects
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-5px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });
        
        // Add click interactions
        card.addEventListener('click', () => {
            // Add click animation
            card.style.transform = 'translateY(-3px) scale(0.98)';
            setTimeout(() => {
                card.style.transform = 'translateY(-5px) scale(1.02)';
            }, 150);
            
            // Show feature details
            showFeatureTooltip(card);
            
            // Add pulse effect
            card.style.boxShadow = '0 0 20px rgba(28, 105, 212, 0.3)';
            setTimeout(() => {
                card.style.boxShadow = '';
            }, 1000);
        });
        
        // Keyboard accessibility
        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'button');
        
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                card.click();
            }
        });
    });
}

function setupTechCardInteractions() {
    const techCards = document.querySelectorAll('.tech-card');
    
    techCards.forEach(card => {
        card.addEventListener('click', () => {
            // Animate progress bar
            const progressBar = card.querySelector('.progress-bar');
            const currentWidth = progressBar.style.width;
            
            progressBar.style.width = '0%';
            setTimeout(() => {
                progressBar.style.width = currentWidth;
            }, 200);
            
            // Add pulse effect
            card.style.boxShadow = '0 0 20px rgba(28, 105, 212, 0.3)';
            setTimeout(() => {
                card.style.boxShadow = '';
            }, 1000);
        });
        
        // Keyboard accessibility
        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'button');
        
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                card.click();
            }
        });
    });
}

function showFeatureTooltip(card) {
    // Create or update tooltip
    let tooltip = document.querySelector('.feature-tooltip');
    if (!tooltip) {
        tooltip = document.createElement('div');
        tooltip.className = 'feature-tooltip';
        tooltip.setAttribute('role', 'tooltip');
        document.body.appendChild(tooltip);
    }
    
    const feature = card.dataset.feature;
    const featureInfo = {
        idrive: 'Advanced curved display with gesture control and BMW Intelligent Personal Assistant integration for intuitive vehicle control.',
        seats: 'Premium Nappa leather seats with ventilation, massage function, and memory settings for ultimate comfort and luxury.',
        gesture: 'Control infotainment system with intuitive hand gestures - swipe, point, and rotate for hands-free operation.',
        audio: 'Harman Kardon 464-watt surround sound system with 16 speakers for concert-hall quality audio experience.',
        skylounge: 'Panoramic glass roof with LED ambient lighting system creating an open, luxurious atmosphere inside the cabin.',
        digitalkey: 'Share your BMW with family and friends using smartphone digital key technology with secure access control.'
    };
    
    tooltip.textContent = featureInfo[feature] || 'Premium BMW feature for enhanced driving experience and luxury comfort.';
    tooltip.style.opacity = '1';
    tooltip.style.visibility = 'visible';
    
    // Position tooltip near card
    const rect = card.getBoundingClientRect();
    tooltip.style.left = Math.max(10, rect.left) + 'px';
    tooltip.style.top = Math.max(10, rect.top - 60) + 'px';
    
    // Hide tooltip after 4 seconds
    setTimeout(() => {
        tooltip.style.opacity = '0';
        setTimeout(() => {
            tooltip.style.visibility = 'hidden';
        }, 300);
    }, 4000);
}

function setupSmoothScrolling() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            if (targetId && targetId.startsWith('#')) {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({ 
                        behavior: 'smooth',
                        block: 'start'
                    });
                    
                    // Update active nav link
                    navLinks.forEach(l => l.classList.remove('active'));
                    link.classList.add('active');
                }
            }
        });
    });
}

function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                
                // Special animation for performance panel
                if (entry.target.classList.contains('performance-panel') && !gaugeAnimationActive) {
                    setTimeout(() => animatePerformanceGauges(), 500);
                }
                
                // Animate tech progress bars when visible
                if (entry.target.classList.contains('technology-panel')) {
                    animateTechProgressBars();
                }
            }
        });
    }, observerOptions);
    
    // Observe all dashboard panels
    document.querySelectorAll('.dashboard-panel').forEach(panel => {
        panel.style.opacity = '0';
        panel.style.transform = 'translateY(30px)';
        panel.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(panel);
    });
}

function animateTechProgressBars() {
    const progressBars = document.querySelectorAll('.progress-bar');
    progressBars.forEach((bar, index) => {
        setTimeout(() => {
            const width = bar.style.width;
            bar.style.width = '0%';
            setTimeout(() => {
                bar.style.width = width;
            }, 100);
        }, index * 200);
    });
}

function startInitialAnimations() {
    // Animate hero elements if not already animated
    const heroTitle = document.querySelector('.hero-title');
    const heroSubtitle = document.querySelector('.hero-subtitle');
    const heroCta = document.querySelector('.hero-cta');
    
    if (heroTitle) {
        heroTitle.style.animationDelay = '0s';
        heroTitle.style.animationFillMode = 'both';
    }
    
    if (heroSubtitle) {
        heroSubtitle.style.animationDelay = '0.3s';
        heroSubtitle.style.animationFillMode = 'both';
    }
    
    if (heroCta) {
        heroCta.style.animationDelay = '0.6s';
        heroCta.style.animationFillMode = 'both';
    }
}

function handleKeyboardNavigation(e) {
    // Arrow key navigation for models
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        const focusedElement = document.activeElement;
        if (focusedElement && focusedElement.classList.contains('model-item')) {
            e.preventDefault();
            
            if (e.key === 'ArrowLeft') {
                currentModelIndex = currentModelIndex > 0 ? currentModelIndex - 1 : bmwModels.length - 1;
            } else {
                currentModelIndex = currentModelIndex < bmwModels.length - 1 ? currentModelIndex + 1 : 0;
            }
            
            updateSelectedModel(currentModelIndex);
        }
    }
    
    // Escape key to close modal and tooltips
    if (e.key === 'Escape') {
        compareModal.classList.add('hidden');
        document.body.style.overflow = 'auto';
        
        const tooltip = document.querySelector('.feature-tooltip');
        if (tooltip) {
            tooltip.style.opacity = '0';
            tooltip.style.visibility = 'hidden';
        }
    }
    
    // Space key to rotate iDrive when focused
    if (e.key === ' ' && e.target === idriveController) {
        e.preventDefault();
        handleIdriveClick();
    }
}

function handleResize() {
    // Recalculate tooltip positions and hide if open
    const tooltip = document.querySelector('.feature-tooltip');
    if (tooltip && tooltip.style.opacity === '1') {
        tooltip.style.opacity = '0';
        tooltip.style.visibility = 'hidden';
    }
}

function preloadImages() {
    bmwModels.forEach(model => {
        const img = new Image();
        img.src = model.image;
    });
}

function announceChange(message) {
    // Create or update screen reader announcement
    let announcer = document.getElementById('announcer');
    if (!announcer) {
        announcer = document.createElement('div');
        announcer.id = 'announcer';
        announcer.setAttribute('aria-live', 'polite');
        announcer.setAttribute('aria-atomic', 'true');
        announcer.style.position = 'absolute';
        announcer.style.left = '-10000px';
        announcer.style.width = '1px';
        announcer.style.height = '1px';
        announcer.style.overflow = 'hidden';
        document.body.appendChild(announcer);
    }
    
    announcer.textContent = message;
}

// Load saved theme preference
function loadThemePreference() {
    const savedTheme = localStorage.getItem('bmw-theme');
    if (savedTheme === 'dark') {
        toggleTheme();
    }
}

// Initialize theme on load
loadThemePreference();

// Add loading screen progress animation
function updateLoadingProgress() {
    const progressBar = document.querySelector('.loading-progress');
    if (progressBar) {
        let width = 0;
        const interval = setInterval(() => {
            if (width >= 100) {
                clearInterval(interval);
            } else {
                width += 2;
                progressBar.style.width = width + '%';
            }
        }, 60);
    }
}

// Start loading progress when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateLoadingProgress);
} else {
    updateLoadingProgress();
}

// Add CSS for tooltip and accessibility
const dynamicStyles = document.createElement('style');
dynamicStyles.textContent = `
.feature-tooltip {
    position: fixed;
    background: var(--color-surface);
    color: var(--color-text);
    padding: 12px 16px;
    border-radius: 8px;
    box-shadow: var(--shadow-lg);
    font-size: 14px;
    max-width: 300px;
    z-index: 1000;
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.3s ease, visibility 0.3s ease;
    border: 1px solid var(--color-border);
    pointer-events: none;
}

.screen-title {
    font-weight: 600;
    margin-bottom: 8px;
    color: #4A90E2;
    font-size: 14px;
}

.screen-info {
    font-size: 12px;
    line-height: 1.4;
    color: #ffffff;
}

/* Focus styles for accessibility */
.feature-card:focus,
.tech-card:focus,
.model-item:focus,
#idriveController:focus {
    outline: 2px solid var(--bmw-blue);
    outline-offset: 2px;
}

/* Enhanced mobile styles */
@media (max-width: 480px) {
    .hero-title {
        font-size: 2rem;
    }
    
    .model-details h3 {
        font-size: 1.5rem;
    }
    
    .gauge-circle {
        width: 120px;
        height: 120px;
    }
    
    .gauge-value {
        font-size: 1.2rem;
    }
}
`;
document.head.appendChild(dynamicStyles);

// Auto-rotate models demo (optional - disabled by default)
let autoRotateEnabled = false;

function startModelAutoRotation() {
    if (!autoRotateEnabled) return;
    
    setInterval(() => {
        if (document.visibilityState === 'visible') {
            const nextIndex = (currentModelIndex + 1) % bmwModels.length;
            updateSelectedModel(nextIndex);
        }
    }, 10000); // Change model every 10 seconds
}

// Performance monitoring
function initializePerformanceMonitoring() {
    // Monitor frame rate
    let frameCount = 0;
    let lastTime = performance.now();
    
    function checkFrameRate() {
        frameCount++;
        const currentTime = performance.now();
        
        if (currentTime - lastTime >= 1000) {
            const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
            
            // If FPS is low, reduce animations
            if (fps < 30) {
                document.body.classList.add('reduce-motion');
            }
            
            frameCount = 0;
            lastTime = currentTime;
        }
        
        requestAnimationFrame(checkFrameRate);
    }
    
    requestAnimationFrame(checkFrameRate);
}