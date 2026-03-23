        // Theme toggle functionality
        const themeToggle = document.getElementById('theme-toggle');
        const themeIcon = themeToggle.querySelector('i');
        
        // Check for saved theme preference or respect OS preference
        if (localStorage.getItem('theme') === 'dark' || 
            (window.matchMedia('(prefers-color-scheme: dark)').matches && !localStorage.getItem('theme'))) {
            document.body.classList.add('dark-mode');
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        }
        
        // Theme toggle button event listener
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            
            if (document.body.classList.contains('dark-mode')) {
                localStorage.setItem('theme', 'dark');
                themeIcon.classList.remove('fa-moon');
                themeIcon.classList.add('fa-sun');
            } else {
                localStorage.setItem('theme', 'light');
                themeIcon.classList.remove('fa-sun');
                themeIcon.classList.add('fa-moon');
            }
        });
        
        // Sticky Header
        window.addEventListener('scroll', function() {
            const header = document.getElementById('header');
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
        
        // Mobile Menu Toggle
        const hamburger = document.getElementById('hamburger');
        const navMenu = document.getElementById('nav-menu');
        
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            
            // Change icon
            const icon = hamburger.querySelector('i');
            if (navMenu.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
        
        // Close mobile menu when clicking on a nav link
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                hamburger.querySelector('i').classList.remove('fa-times');
                hamburger.querySelector('i').classList.add('fa-bars');
            });
        });
        
        // Form submission
        emailjs.init('QDdiCS0ZE06L4_Hpt'); // 🔑 Replace with your actual public key

const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();

        // --- Email Validation ---
        const emailField = contactForm.querySelector('input[name="from_email"]');
        const emailValue = emailField.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(emailValue)) {
            emailField.style.borderColor = '#FF0066';
            emailField.focus();
            showFormMessage('Please enter a valid email address.', 'error');
            return;
        } else {
            emailField.style.borderColor = '';
        }

        // --- Disable button while sending ---
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';

        // --- Send via EmailJS ---
        emailjs.sendForm(
            'service_x5tgade',   // 🔑 Replace with your Service ID
            'template_6bb7s6h',  // 🔑 Replace with your Template ID
            contactForm
        )
        .then(function () {
            showFormMessage('Message sent successfully! I\'ll get back to you soon.', 'success');
            contactForm.reset();
        })
        .catch(function (error) {
            console.error('EmailJS error:', error);
            showFormMessage('Something went wrong. Please try again.', 'error');
        })
        .finally(function () {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Send Message';
        });
    });
}

// Helper: show success/error message below the form
function showFormMessage(message, type) {
    // Remove any existing message
    const existing = document.getElementById('form-message');
    if (existing) existing.remove();

    const msg = document.createElement('p');
    msg.id = 'form-message';
    msg.textContent = message;
    msg.style.cssText = `
        margin-top: 12px;
        font-weight: 600;
        font-size: 0.95rem;
        color: ${type === 'success' ? '#28a745' : '#FF0066'};
    `;

    contactForm.appendChild(msg);

    // Auto-remove after 5 seconds
    setTimeout(() => msg.remove(), 5000);
}
        

        // Education & Experience Tab Switching
        function switchTab(tabName) {
            document.querySelectorAll('.tab-btn').forEach(function(b) { b.classList.remove('active'); });
            var activeBtn = document.querySelector('.tab-btn[data-tab="' + tabName + '"]');
            if (activeBtn) activeBtn.classList.add('active');
            document.querySelectorAll('.timeline').forEach(function(t) { t.classList.add('hidden'); });
            var activeTab = document.getElementById('tab-' + tabName);
            if (!activeTab) return;
            activeTab.classList.remove('hidden');
            activeTab.querySelectorAll('.timeline-item').forEach(function(item, i) {
                item.style.animation = 'none';
                void item.offsetHeight;
                item.style.animation = 'fadeSlideIn 0.5s ease ' + (i * 0.1) + 's both';
            });
        }

        document.querySelectorAll('.tab-btn').forEach(function(btn) {
            btn.onclick = function() {
                var tabName = this.getAttribute('data-tab');
                if (tabName) switchTab(tabName);
            };
        });
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            });
        });
        // --- Secret Garden Logic ---
const gardenCanvas = document.getElementById('gardenCanvas');
const gCtx = gardenCanvas.getContext('2d');
const island = document.getElementById('garden-island');
const plantBtn = document.getElementById('plantFlower');
const clearBtn = document.getElementById('clearGarden');
const colorDots = document.querySelectorAll('.color-dot');

let isDrawing = false;
let currentColor = '#FF0066';

// Set color
colorDots.forEach(dot => {
    dot.addEventListener('click', () => {
        colorDots.forEach(d => d.classList.remove('active'));
        dot.classList.add('active');
        currentColor = dot.dataset.color;
    });
});

// Drawing logic
const getCoords = (e) => {
    const rect = gardenCanvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
        x: clientX - rect.left,
        y: clientY - rect.top
    };
};

const startDrawing = (e) => {
    isDrawing = true;
    const coords = getCoords(e);
    gCtx.beginPath();
    gCtx.moveTo(coords.x, coords.y);
};

const draw = (e) => {
    if (!isDrawing) return;
    const coords = getCoords(e);
    gCtx.lineWidth = 4;
    gCtx.lineCap = 'round';
    gCtx.strokeStyle = currentColor;
    gCtx.lineTo(coords.x, coords.y);
    gCtx.stroke();
};

const stopDrawing = () => {
    isDrawing = false;
    gCtx.closePath();
};

gardenCanvas.addEventListener('mousedown', startDrawing);
gardenCanvas.addEventListener('mousemove', draw);
window.addEventListener('mouseup', stopDrawing);

// Touch support for mobile
gardenCanvas.addEventListener('touchstart', (e) => { e.preventDefault(); startDrawing(e); });
gardenCanvas.addEventListener('touchmove', (e) => { e.preventDefault(); draw(e); });
gardenCanvas.addEventListener('touchend', stopDrawing);

clearBtn.addEventListener('click', () => {
    gCtx.clearRect(0, 0, gardenCanvas.width, gardenCanvas.height);
});

// plantBtn.addEventListener('click', () => {
//     // Check if canvas is empty
//     const blank = document.createElement('canvas');
//     blank.width = gardenCanvas.width;
//     blank.height = gardenCanvas.height;
//     if (gardenCanvas.toDataURL() === blank.toDataURL()) return;

//     const dataURL = gardenCanvas.toDataURL();
//     const flower = document.createElement('img');
//     flower.src = dataURL;
//     flower.className = 'planted-flower';
    
//     // Size and Position
//     const size = 30 + Math.random() * 40;
//     flower.style.width = `${size}px`;
    
//     // Random placement within island boundaries
//     const posX = Math.random() * (island.offsetWidth - size);
//     const posY = Math.random() * (island.offsetHeight - size);
    
//     flower.style.left = `${posX}px`;
//     flower.style.top = `${posY}px`;

//     island.appendChild(flower);
    
//     // Clear the canvas for the next drawing
//     gCtx.clearRect(0, 0, gardenCanvas.width, gardenCanvas.height);
// });
plantBtn.addEventListener('click', () => {
    // Check if canvas is actually drawn on
    const pixels = gCtx.getImageData(0, 0, gardenCanvas.width, gardenCanvas.height).data;
    let hasDrawing = false;
    for (let i = 3; i < pixels.length; i += 4) {
        if (pixels[i] > 0) { hasDrawing = true; break; }
    }
    if (!hasDrawing) return;

    // Capture as PNG (Transparent)
    const dataURL = gardenCanvas.toDataURL("image/png");
    
    const flower = document.createElement('img');
    flower.src = dataURL;
    flower.className = 'planted-flower'; // Matches the CSS above
    
    const size = 50 + Math.random() * 40;
    flower.style.width = `${size}px`;
    
    // Position within the island
    const posX = Math.random() * (island.offsetWidth - size);
    const posY = Math.random() * (island.offsetHeight - size);
    
    flower.style.left = `${posX}px`;
    flower.style.top = `${posY}px`;
    
    // Add a slight random tilt so they look hand-placed
    flower.style.transform = `rotate(${Math.random() * 20 - 10}deg)`;

    island.appendChild(flower);
    gCtx.clearRect(0, 0, gardenCanvas.width, gardenCanvas.height);
});

// Project Filter Tabs
const projectTabBtns = document.querySelectorAll('.project-tab-btn');
const projectCards = document.querySelectorAll('.project-card');

let currentFilter = 'all';
let isExpanded = false;

function applyFilter(filter) {
    currentFilter = filter;

    projectCards.forEach(card => {
        const category = card.dataset.category;
        const isHidden = card.classList.contains('hidden-project') && !isExpanded;
        const matchesFilter = filter === 'all' || category === filter;

        if (matchesFilter && !isHidden) {
            card.style.display = 'block';
        } else if (matchesFilter && card.classList.contains('hidden-project') && isExpanded) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

projectTabBtns.forEach(btn => {
    btn.addEventListener('click', function () {
        projectTabBtns.forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        applyFilter(this.dataset.filter);
    });
});

// View More Button
const viewMoreBtn = document.getElementById('view-more-btn');

viewMoreBtn.addEventListener('click', function () {
    isExpanded = !isExpanded;

    if (isExpanded) {
        this.innerHTML = 'Show Less <i class="fas fa-chevron-up"></i>';
        this.classList.add('expanded');
    } else {
        this.innerHTML = 'View More <i class="fas fa-chevron-down"></i>';
        this.classList.remove('expanded');
    }

    applyFilter(currentFilter);
});