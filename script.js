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
        const isOpenSource = card.dataset.opensource === 'true';
        const isHiddenProject = card.classList.contains('hidden-project') && !isExpanded;

        // Check if card matches the active filter
        const matchesFilter =
            filter === 'all' ||
            filter === category ||
            (filter === 'opensource' && isOpenSource);

        if (matchesFilter && !isHiddenProject) {
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


/* =====================================================
   SLICK ANIMATION ENGINE
   ===================================================== */

(function() {
    // ── Typewriter: "Siddhi Khaire" ──────────────────
    const nameSpan = document.querySelector('.hero-title span');
    if (nameSpan) {
        const fullText = nameSpan.textContent.trim();
        nameSpan.textContent = '';
        nameSpan.classList.add('typing');

        // Start after the hero-text fade-in delay (≈ 300ms)
        let i = 0;
        const typeDelay = 320; // ms before first char
        const charSpeed = 55;  // ms per character — snappy but readable

        setTimeout(() => {
            const interval = setInterval(() => {
                nameSpan.textContent = fullText.slice(0, ++i);
                if (i === fullText.length) {
                    clearInterval(interval);
                    // Small pause, then swap to shimmer
                    setTimeout(() => {
                        nameSpan.classList.remove('typing');
                        nameSpan.classList.add('typed');
                    }, 480);
                }
            }, charSpeed);
        }, typeDelay);
    }

    // ── Scroll progress bar ──────────────────────────
    const progressBar = document.getElementById('scroll-progress');
    function updateProgress() {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        progressBar.style.width = (docHeight > 0 ? (scrollTop / docHeight) * 100 : 0) + '%';
    }
    window.addEventListener('scroll', updateProgress, { passive: true });

    // ── Custom cursor ────────────────────────────────
    const dot  = document.getElementById('cursor-dot');
    const ring = document.getElementById('cursor-ring');
    let mouseX = -100, mouseY = -100;
    let ringX = -100, ringY = -100;
    let rafId;

    if (dot && ring) {
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX; mouseY = e.clientY;
            dot.style.left = mouseX + 'px';
            dot.style.top  = mouseY + 'px';
        });

        function animateRing() {
            ringX += (mouseX - ringX) * 0.14;
            ringY += (mouseY - ringY) * 0.14;
            ring.style.left = ringX + 'px';
            ring.style.top  = ringY + 'px';
            rafId = requestAnimationFrame(animateRing);
        }
        animateRing();

        const hoverEls = document.querySelectorAll('a, button, .project-card, .skill-category, .badge, .timeline-card, .social-link, input, textarea, .color-dot, #gardenCanvas');
        hoverEls.forEach(el => {
            el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hovered'));
            el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hovered'));
        });

        document.addEventListener('mouseleave', () => {
            dot.style.opacity = '0';
            ring.style.opacity = '0';
        });
        document.addEventListener('mouseenter', () => {
            dot.style.opacity = '';
            ring.style.opacity = '';
        });
    }

    // ── Heart cursor trail ───────────────────────────
    const HEART_COLORS = ['#FF0066', '#ff6b9d', '#FFDCDC', '#ff3385', '#670D2F', '#ffb3cc'];
    const HEART_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z"/></svg>`;

    let lastHeartX = -999, lastHeartY = -999;
    let heartThrottle = false;

    function spawnHeart(x, y) {
        const heart = document.createElement('div');
        heart.className = 'cursor-heart';

        // Pick color, size, drift
        const color = HEART_COLORS[Math.floor(Math.random() * HEART_COLORS.length)];
        const size  = 10 + Math.random() * 14;          // 10–24px
        const drift = (Math.random() - 0.5) * 40;       // horizontal wobble
        const rise  = 55 + Math.random() * 35;           // how far it floats up
        const dur   = 650 + Math.random() * 350;         // lifetime ms
        const rot   = (Math.random() - 0.5) * 60;        // rotation

        heart.innerHTML = HEART_SVG;
        heart.querySelector('svg').style.fill = color;

        Object.assign(heart.style, {
            left: x + 'px',
            top:  y + 'px',
            width:  size + 'px',
            height: size + 'px',
            '--drift': drift + 'px',
            '--rise':  '-' + rise + 'px',
            '--rot':   rot + 'deg',
            '--dur':   dur + 'ms',
        });

        document.body.appendChild(heart);
        // Trigger animation on next frame so CSS transition applies
        requestAnimationFrame(() => heart.classList.add('heart-fly'));
        setTimeout(() => heart.remove(), dur + 50);
    }

    document.addEventListener('mousemove', (e) => {
        const dx = e.clientX - lastHeartX;
        const dy = e.clientY - lastHeartY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        // Only spawn when moved enough distance — creates trail density
        if (dist < 18) return;
        lastHeartX = e.clientX;
        lastHeartY = e.clientY;

        // Throttle to max ~40fps spawn rate for perf
        if (heartThrottle) return;
        heartThrottle = true;
        setTimeout(() => { heartThrottle = false; }, 25);

        spawnHeart(e.clientX + window.scrollX, e.clientY + window.scrollY);
    });

    // ── Button ripple ────────────────────────────────
    document.querySelectorAll('.btn, .btn-resume, .tab-btn, .project-tab-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const ripple = document.createElement('span');
            ripple.className = 'ripple-effect';
            ripple.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX - rect.left - size/2}px;top:${e.clientY - rect.top - size/2}px`;
            this.appendChild(ripple);
            setTimeout(() => ripple.remove(), 700);
        });
    });

    // ── Theme toggle spin ────────────────────────────
    const themeToggleBtn = document.getElementById('theme-toggle');
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', function() {
            this.classList.remove('spin');
            void this.offsetWidth; // reflow to restart
            this.classList.add('spin');
            setTimeout(() => this.classList.remove('spin'), 600);
        });
    }

    // ── IntersectionObserver helpers ─────────────────
    const io = (els, callback, opts = {}) => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    callback(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15, ...opts });
        els.forEach(el => observer.observe(el));
    };

    // ── Section title underline draw ─────────────────
    io(document.querySelectorAll('.section-title'), el => el.classList.add('title-visible'));

    // ── Scroll reveal ─────────────────────────────────
    // Add reveal classes to key sections
    document.querySelectorAll('.about-text').forEach(el => el.classList.add('reveal', 'reveal-right'));
    document.querySelectorAll('.about-image').forEach(el => el.classList.add('reveal', 'reveal-left'));
    document.querySelectorAll('.skill-category').forEach(el => el.classList.add('reveal', 'reveal-scale'));
    document.querySelectorAll('.project-card').forEach((el, i) => {
        el.classList.add('reveal');
        el.style.transitionDelay = (i % 3) * 0.08 + 's';
    });
    document.querySelectorAll('.contact-info, .contact-form').forEach((el, i) => {
        el.classList.add('reveal');
        el.style.transitionDelay = i * 0.15 + 's';
    });

    io(document.querySelectorAll('.reveal'), el => el.classList.add('visible'));

    // ── Skills badge pop-in ───────────────────────────
    io(document.querySelectorAll('.badges'), el => el.classList.add('visible'), { threshold: 0.1 });

    // ── Timeline item entrance ────────────────────────
    const tlItems = document.querySelectorAll('.timeline-item');
    const tlObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, idx) => {
            if (entry.isIntersecting) {
                // stagger based on index within visible batch
                const delay = Array.from(tlItems).indexOf(entry.target) * 0.1;
                entry.target.style.transitionDelay = Math.min(delay, 0.4) + 's';
                entry.target.classList.add('tl-visible');
                tlObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    tlItems.forEach(item => tlObserver.observe(item));

    // ── Contact info items ────────────────────────────
    io(document.querySelectorAll('.info-item'), el => el.classList.add('visible'), { threshold: 0.1 });

    // ── Footer reveal ─────────────────────────────────
    io(document.querySelectorAll('footer'), el => el.classList.add('visible'), { threshold: 0.05 });

    // ── Particle canvas ───────────────────────────────
    const canvas = document.getElementById('particle-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        const COUNT = 38;

        function resize() {
            canvas.width  = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        }
        resize();
        window.addEventListener('resize', resize, { passive: true });

        class Particle {
            constructor() { this.reset(true); }
            reset(init) {
                this.x  = Math.random() * canvas.width;
                this.y  = init ? Math.random() * canvas.height : canvas.height + 10;
                this.r  = 1 + Math.random() * 2.5;
                this.vx = (Math.random() - 0.5) * 0.4;
                this.vy = -(0.3 + Math.random() * 0.5);
                this.alpha = 0.2 + Math.random() * 0.5;
                this.color = Math.random() > 0.5 ? '255,0,102' : '103,13,47';
            }
            update() {
                this.x += this.vx;
                this.y += this.vy;
                if (this.y < -10) this.reset(false);
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${this.color},${this.alpha})`;
                ctx.fill();
            }
        }

        for (let i = 0; i < COUNT; i++) particles.push(new Particle());

        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => { p.update(); p.draw(); });
            requestAnimationFrame(animateParticles);
        }
        animateParticles();
    }

    // ── Skill category 3D tilt ────────────────────────
    document.querySelectorAll('.skill-category').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const cx = rect.left + rect.width / 2;
            const cy = rect.top  + rect.height / 2;
            const dx = (e.clientX - cx) / (rect.width / 2);
            const dy = (e.clientY - cy) / (rect.height / 2);
            card.style.transform = `perspective(600px) rotateY(${dx * 5}deg) rotateX(${-dy * 5}deg) translateY(-4px)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });

    // ── Active nav link on scroll ─────────────────────
    const sections = document.querySelectorAll('section[id]');
    const navLinks  = document.querySelectorAll('.nav-link');
    function updateActiveNav() {
        let current = '';
        sections.forEach(sec => {
            if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
        });
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) link.classList.add('active');
        });
    }
    window.addEventListener('scroll', updateActiveNav, { passive: true });
    updateActiveNav();

    // Re-observe timeline items when tab switches
    // (they get re-shown so need re-triggering)
    const origSwitchTab = window.switchTab;
    // patch the global switchTab to also re-run animations
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            setTimeout(() => {
                document.querySelectorAll('.timeline-item').forEach((item, i) => {
                    if (!item.classList.contains('tl-visible') && item.offsetParent !== null) {
                        item.style.transitionDelay = i * 0.1 + 's';
                        item.classList.add('tl-visible');
                    }
                });
            }, 50);
        });
    });

})();