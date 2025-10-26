/* ============================================
   NAOK Website JavaScript
   Northstar AO Keystone — One AI. Every Decision.
   ============================================ */

// ============================================
// Starfield Animation
// ============================================
function createStarfield() {
    const starfield = document.getElementById('starfield');
    if (!starfield) return;
    
    const starCount = 150;
    const colors = ['#FFFFFF', '#E6C558', '#3B82F6'];
    
    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        
        // Random position
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        
        // Random size (1-3px)
        const size = Math.random() * 2 + 1;
        star.style.width = size + 'px';
        star.style.height = size + 'px';
        
        // Random color
        star.style.background = colors[Math.floor(Math.random() * colors.length)];
        
        // Random animation delay
        star.style.animationDelay = Math.random() * 3 + 's';
        star.style.animationDuration = (Math.random() * 2 + 2) + 's';
        
        starfield.appendChild(star);
    }
}

// ============================================
// Scroll Reveal Animations
// ============================================
function initScrollReveal() {
    const elements = document.querySelectorAll('.fade-in');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    elements.forEach(el => observer.observe(el));
}

// ============================================
// Number Counter Animation
// ============================================
function animateNumbers() {
    const numberElements = document.querySelectorAll('.number-value[data-target]');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                const target = parseInt(entry.target.getAttribute('data-target'));
                const duration = 2000; // 2 seconds
                const increment = target / (duration / 16); // 60fps
                let current = 0;
                
                entry.target.classList.add('counted');
                
                const counter = setInterval(() => {
                    current += increment;
                    if (current >= target) {
                        entry.target.textContent = target + '+';
                        clearInterval(counter);
                    } else {
                        entry.target.textContent = Math.floor(current);
                    }
                }, 16);
            }
        });
    }, { threshold: 0.5 });
    
    numberElements.forEach(el => observer.observe(el));
}

// ============================================
// Navigation Scroll Effect
// ============================================
function initNavScroll() {
    const nav = document.querySelector('.nav');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });
}

// ============================================
// Mobile Navigation Toggle
// ============================================
function initMobileNav() {
    const navToggle = document.getElementById('nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
        
        // Close menu when clicking a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                navToggle.classList.remove('active');
            });
        });
    }
}

// ============================================
// Contact Modal
// ============================================
function initModal() {
    const modal = document.getElementById('contact-modal');
    const modalOverlay = document.getElementById('modal-overlay');
    const modalClose = document.getElementById('modal-close');
    
    // All buttons that should open the modal
    const modalTriggers = [
        document.getElementById('nav-cta'),
        document.getElementById('challenge-cta'),
        document.getElementById('early-access-btn'),
        ...document.querySelectorAll('[data-modal="contact"]')
    ].filter(Boolean);
    
    // Open modal
    function openModal(prefillSubject = '') {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Pre-fill subject if provided
        if (prefillSubject) {
            const messageField = document.getElementById('message');
            if (messageField && !messageField.value) {
                messageField.value = prefillSubject;
            }
        }
        
        // Focus first input
        setTimeout(() => {
            document.getElementById('name')?.focus();
        }, 100);
    }
    
    // Close modal
    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    // Event listeners
    modalTriggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Check if this is the early access button
            if (trigger.id === 'early-access-btn') {
                openModal('Subject: Notify Me - Retraining Dashboard Launch\n\nHi Matthew,\n\nI\'d like early access to the Model Retraining Signal Dashboard when it launches.\n\n');
            } else {
                openModal();
            }
        });
    });
    
    modalClose.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', closeModal);
    
    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
    
    // Prevent closing when clicking inside modal content
    document.querySelector('.modal-content').addEventListener('click', (e) => {
        e.stopPropagation();
    });
}

// ============================================
// Form Handling
// ============================================
function initForm() {
    const form = document.getElementById('contact-form');
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Honeypot check (spam prevention)
        const honeypot = form.querySelector('[name="honeypot"]');
        if (honeypot && honeypot.value) {
            console.log('Spam detected');
            return;
        }
        
        // Get form data
        const formData = new FormData(form);
        const name = formData.get('name');
        const email = formData.get('email');
        const company = formData.get('company');
        const message = formData.get('message');
        
        // Build mailto link
        const subject = `New Contact from ${name}`;
        const body = `Name: ${name}\nEmail: ${email}\nCompany/Role: ${company || 'N/A'}\n\nMessage:\n${message}`;
        
        const mailtoLink = `mailto:northstaraokeystone@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        
        // Open mailto
        window.location.href = mailtoLink;
        
        // Close modal after short delay
        setTimeout(() => {
            document.getElementById('contact-modal').classList.remove('active');
            document.body.style.overflow = '';
            form.reset();
        }, 500);
    });
}

// ============================================
// Smooth Scroll for Anchor Links
// ============================================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            
            // Skip if it's just "#" or modal trigger
            if (href === '#' || this.hasAttribute('data-modal')) {
                return;
            }
            
            e.preventDefault();
            const target = document.querySelector(href);
            
            if (target) {
                const navHeight = document.querySelector('.nav').offsetHeight;
                const targetPosition = target.offsetTop - navHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ============================================
// Scroll Depth Tracking (for Easter Egg)
// ============================================
function initScrollDepth() {
    let triggered90 = false;
    
    window.addEventListener('scroll', () => {
        const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        
        if (scrollPercent >= 90 && !triggered90) {
            triggered90 = true;
            showEasterEgg();
        }
    });
}

function showEasterEgg() {
    const nav = document.querySelector('.nav');
    const navCta = document.getElementById('nav-cta');
    
    if (navCta) {
        // Add shimmer effect
        navCta.style.animation = 'shimmer 1s ease';
        navCta.title = "You've got focus. Let's talk.";
        
        // Remove animation after it completes
        setTimeout(() => {
            navCta.style.animation = '';
        }, 1000);
    }
}

// CSS for shimmer animation (injected dynamically)
const shimmerStyle = document.createElement('style');
shimmerStyle.textContent = `
    @keyframes shimmer {
        0%, 100% { box-shadow: 0 0 0 rgba(212, 175, 55, 0); }
        50% { box-shadow: 0 0 30px rgba(212, 175, 55, 0.8); }
    }
`;
document.head.appendChild(shimmerStyle);

// ============================================
// Typing Animation for Hero
// ============================================
function initTypingAnimation() {
    const typingElement = document.querySelector('.typing-text');
    if (!typingElement) return;
    
    const text = typingElement.textContent;
    typingElement.textContent = '';
    typingElement.style.opacity = '1';
    
    let index = 0;
    
    function type() {
        if (index < text.length) {
            typingElement.textContent += text.charAt(index);
            index++;
            setTimeout(type, 100);
        }
        // Cursor code completely removed - typing stops, no cursor appears
    }
    
    // Start typing after a short delay
    setTimeout(type, 500);
}
// ============================================
// Performance: Lazy Load YouTube Videos
// ============================================
function initLazyYouTube() {
    const youtubeLinks = document.querySelectorAll('a[href*="youtube.com"], a[href*="youtu.be"]');
    
    // Add external link icon or indicator
    youtubeLinks.forEach(link => {
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noopener noreferrer');
    });
}

// ============================================
// Initialize All Functions
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    createStarfield();
    initScrollReveal();
    initNavScroll();
    initMobileNav();
    initModal();
    initForm();
    initSmoothScroll();
    initScrollDepth();
    initTrustFabric(); // Initialize the 3D scene
    initTypingAnimation();
    initLazyYouTube();
    animateNumbers();
    
    // Debug log
    console.log('%c🌟 NAOK Website Loaded', 'color: #D4AF37; font-size: 16px; font-weight: bold;');
    console.log('%cOne AI. Every Decision.', 'color: #B0B8C1; font-size: 12px;');
});

// ============================================
// Page Load Performance
// ============================================
window.addEventListener('load', () => {
    // Track page load time
    const loadTime = performance.now();
    console.log(`Page loaded in ${Math.round(loadTime)}ms`);
    
    // Send to GA4 if available
    if (typeof gtag !== 'undefined') {
        gtag('event', 'page_load', {
            'load_time': Math.round(loadTime),
            'page_path': window.location.pathname
        });
    }
});

// ============================================
// Track Outbound Links (GA4)
// ============================================
document.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (!link) return;
    
    const href = link.getAttribute('href');
    
    // Track external links
    if (href && (href.includes('gumroad.com') || href.includes('linkedin.com') || href.includes('youtube.com'))) {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'click', {
                'event_category': 'outbound',
                'event_label': href,
                'transport_type': 'beacon'
            });
        }
    }
});

// ============================================
// Service Worker Registration (Optional PWA)
// ============================================
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Uncomment if you add a service worker later
        // navigator.serviceWorker.register('/sw.js')
        //     .then(reg => console.log('Service Worker registered'))
        //     .catch(err => console.log('Service Worker registration failed')); 
      // ============================================
// MILESTONE 1: 3D Trust Fabric Network
// ============================================
function initTrustFabric() {
    const canvas = document.getElementById('trust-fabric-canvas');
    // Exit if the canvas or Three.js library isn't available.
    if (!canvas || typeof THREE === 'undefined') {
        console.error("3D Trust Fabric: Canvas or THREE.js not found.");
        return;
    }

    // 1. Scene Setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0A2540, 0.07); // Use dark-base for fog

    // 2. Camera Setup
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 15;

    // 3. Renderer Setup
    const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true, // Transparent background
        antialias: true // Smoother edges
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Optimize for high-res screens

    // Handle window resizing
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    });

    // 4. Node Creation
    const trustPrinciples = [
        "Data Integrity", "Mitigating Hallucinations", "Model Explainability",
        "Drift Detection", "Economic Observability", "Governance & Compliance",
        "Human-in-the-Loop"
    ];

    const nodesGroup = new THREE.Group();
    const nodeGeometry = new THREE.SphereGeometry(0.5, 32, 16); // Sphere with radius 0.5
    const nodeMaterial = new THREE.MeshStandardMaterial({
        color: 0xD4AF37,       // Gold
        emissive: 0xD4AF37,    // Makes it glow
        emissiveIntensity: 1.5,  // Intensity of the glow
        metalness: 0.4,
        roughness: 0.6
    });

    // Use a Spherical Fibonacci Lattice for an even, non-grid distribution
    const samples = trustPrinciples.length;
    const phi = Math.PI * (3.0 - Math.sqrt(5.0)); // The golden angle

    for (let i = 0; i < samples; i++) {
        const y = 1 - (i / (samples - 1)) * 2;  // y goes from 1 to -1
        const radiusAtY = Math.sqrt(1 - y * y); // radius at y

        const theta = phi * i;

        const x = Math.cos(theta) * radiusAtY;
        const z = Math.sin(theta) * radiusAtY;

        const nodeMesh = new THREE.Mesh(nodeGeometry, nodeMaterial);
        // Position the nodes on the surface of a sphere with radius 8
        nodeMesh.position.set(x, y, z).multiplyScalar(8);
        nodeMesh.name = trustPrinciples[i]; // Name the object for future interactivity
        nodesGroup.add(nodeMesh);
    }
    scene.add(nodesGroup);
    
    // 5. Lighting
    const ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.5); // Softer ambient light
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 1);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    // 6. Initial Render
    // This is a static render. In the next sprint, this will be replaced by an animation loop.
    renderer.render(scene, camera);
    
    // Fade in the canvas after it's rendered
    canvas.style.opacity = '1';

    console.log('%c🌌 3D Trust Fabric Initialized (Static Render Complete)', 'color: #D4AF37; font-weight: bold;');
}  
    });
}