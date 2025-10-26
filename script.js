/* ============================================
   NAOK Website JavaScript - V3.0 Codex Compliant
   Fulcrum Prime Engineering Standard v2.1
   ============================================ */

/**
 * @fileoverview Main script for NAOK V3.0 site.
 * Implements core UI behaviors, animations, and form handling.
 * Adheres to a buildless, dependency-free architecture.
 *
 * @author Claude, AI Co-Pilot for Northstar AO Keystone
 */

/**
 * Primary IIFE (Immediately Invoked Function Expression) to encapsulate all logic
 * and avoid polluting the global scope.
 */
(() => {
    'use strict';

    /**
     * @typedef {Object} DOM_ELEMENTS
     * @property {HTMLElement} nav - The main navigation element.
     * @property {HTMLElement} navToggle - The mobile navigation toggle button.
     * @property {HTMLElement} navLinks - The container for navigation links.
     * @property {HTMLElement} starfield - The hero background starfield container.
     * @property {HTMLElement} modal - The main modal container.
     * @property {HTMLElement} modalOverlay - The modal's background overlay.
     * @property {HTMLElement} modalClose - The modal's close button.
     * @property {NodeListOf<HTMLElement>} fadeInElements - All elements with the .fade-in class.
     * @property {NodeListOf<HTMLElement>} numberCounters - All elements for the number count-up animation.
     * @property {NodeListOf<HTMLElement>} tiltElements - All elements with the .interactive-card class.
     * @property {NodeListOf<HTMLElement>} modalTriggers - All buttons that open the contact modal.
     */

    /**
     * Centralized repository for all frequently accessed DOM elements.
     * This improves performance by reducing DOM queries.
     * @type {DOM_ELEMENTS}
     */
    const DOM = {
        nav: document.getElementById('nav'),
        navToggle: document.getElementById('nav-toggle'),
        navLinks: document.querySelector('.nav-links'),
        starfield: document.getElementById('starfield'),
        modal: document.getElementById('contact-modal'),
        modalOverlay: document.getElementById('modal-overlay'),
        modalClose: document.getElementById('modal-close'),
        fadeInElements: document.querySelectorAll('.fade-in'),
        numberCounters: document.querySelectorAll('.number-value[data-target]'),
        tiltElements: document.querySelectorAll('.interactive-card'),
        modalTriggers: document.querySelectorAll('#nav-cta, #challenge-cta, #early-access-btn'),
    };

    /**
     * @namespace
     * @description Contains all UI behavior modules.
     */
    const behaviors = {
        /**
         * Initializes all site behaviors on DOMContentLoaded.
         * This is the main entry point for the script.
         */
        init() {
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', this.run);
            } else {
                this.run();
            }
        },
        
        /**
         * Executes all modules.
         * Separated from init() for clarity and potential re-use.
         */
        run() {
            try {
                this.navigation.init();
                this.animations.init();
                this.modal.init();
                this.forms.init();
                
                console.log('%c[NAOK_V3.0]: All systems nominal. Codex-compliant build operational.', 'color: #10B981; font-weight: bold;');
            } catch (error) {
                console.error('[NAOK_V3.0]: Critical initialization failure.', error);
            }
        },

        /**
         * @module navigation
         * @description Handles all navigation-related functionality.
         */
        navigation: {
            init() {
                this.handleNavScroll();
                this.handleMobileNavToggle();
                this.handleSmoothScroll();
            },
            handleNavScroll() {
                if (!DOM.nav) return;
                window.addEventListener('scroll', () => {
                    DOM.nav.classList.toggle('scrolled', window.scrollY > 50);
                }, { passive: true });
            },
            handleMobileNavToggle() {
                if (!DOM.navToggle || !DOM.navLinks) return;
                DOM.navToggle.addEventListener('click', () => {
                    const isExpanded = DOM.navLinks.classList.toggle('active');
                    DOM.navToggle.setAttribute('aria-expanded', isExpanded);
                    document.body.style.overflow = isExpanded ? 'hidden' : '';
                });

                DOM.navLinks.querySelectorAll('a').forEach(link => {
                    link.addEventListener('click', () => {
                        if (DOM.navLinks.classList.contains('active')) {
                            DOM.navLinks.classList.remove('active');
                            DOM.navToggle.setAttribute('aria-expanded', 'false');
                            document.body.style.overflow = '';
                        }
                    });
                });
            },
            handleSmoothScroll() {
                document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                    anchor.addEventListener('click', function (e) {
                        const href = this.getAttribute('href');
                        if (href === '#' || href.length < 2) return;
                        const target = document.querySelector(href);
                        if (target) {
                            e.preventDefault();
                            const navHeight = DOM.nav ? DOM.nav.offsetHeight : 70;
                            const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight - 24;
                            window.scrollTo({ top: targetPosition, behavior: 'smooth' });
                        }
                    });
                });
            }
        },

        /**
         * @module animations
         * @description Handles all aesthetic and interactive animations.
         */
        animations: {
            init() {
                this.initHeroParallax();
                this.initScrollReveal();
                this.init3DTiltEffect();
                this.initNumberCounters();
                this.initTyping();
            },
            initHeroParallax() {
                if (!DOM.starfield) return;
                window.addEventListener('scroll', () => {
                    DOM.starfield.style.transform = `translateY(${window.scrollY * 0.4}px)`;
                }, { passive: true });
            },
            initScrollReveal() {
                if (DOM.fadeInElements.length === 0) return;
                const observer = new IntersectionObserver((entries, observer) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            entry.target.classList.add('visible');
                            observer.unobserve(entry.target);
                        }
                    });
                }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
                DOM.fadeInElements.forEach(el => observer.observe(el));
            },
            init3DTiltEffect() {
                if (DOM.tiltElements.length === 0 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
                DOM.tiltElements.forEach(element => {
                    element.addEventListener('mousemove', (e) => {
                        const rect = element.getBoundingClientRect();
                        const x = e.clientX - rect.left - rect.width / 2;
                        const y = e.clientY - rect.top - rect.height / 2;
                        const rotateX = -y / 30; // Reduced intensity
                        const rotateY = x / 30;
                        element.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.03)`;
                    });
                    element.addEventListener('mouseleave', () => {
                        element.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
                    });
                });
            },
            initNumberCounters() {
                if (DOM.numberCounters.length === 0) return;
                const observer = new IntersectionObserver((entries, observer) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            this.animateCounter(entry.target);
                            observer.unobserve(entry.target);
                        }
                    });
                }, { threshold: 0.8 });
                DOM.numberCounters.forEach(counter => observer.observe(counter));
            },
            animateCounter(element) {
                const target = +element.getAttribute('data-target');
                const duration = 2000;
                let start = 0;
                const stepTime = Math.abs(Math.floor(duration / target));
                const timer = setInterval(() => {
                    start += 1;
                    element.textContent = start;
                    if (start === target) {
                        clearInterval(timer);
                        element.textContent = target + "+";
                    }
                }, stepTime);
            },
            initTyping() {
                const typingElement = document.querySelector('.typing-text');
                if (!typingElement) return;
                const text = typingElement.textContent;
                typingElement.textContent = '';
                let index = 0;
                const type = () => {
                    if (index < text.length) {
                        typingElement.textContent += text.charAt(index);
                        index++;
                        setTimeout(type, 100);
                    }
                };
                setTimeout(type, 500);
            }
        },

        /**
         * @module modal
         * @description Manages all modal interactions.
         */
        modal: {
            init() {
                if (!DOM.modal) return;
                DOM.modalTriggers.forEach(trigger => trigger.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.openModal();
                }));
                DOM.modalClose.addEventListener('click', () => this.closeModal());
                DOM.modalOverlay.addEventListener('click', () => this.closeModal());
                document.addEventListener('keydown', (e) => {
                    if (e.key === 'Escape' && DOM.modal.hasAttribute('open')) {
                        this.closeModal();
                    }
                });
            },
            openModal() {
                DOM.modal.removeAttribute('hidden');
                document.body.style.overflow = 'hidden';
                DOM.modal.querySelector('input, button, textarea, a')?.focus();
            },
            closeModal() {
                DOM.modal.setAttribute('hidden', 'true');
                document.body.style.overflow = '';
            }
        },

        /**
         * @module forms
         * @description Handles form submissions.
         */
        forms: {
            init() {
                const contactForm = document.getElementById('contact-form');
                if (contactForm) {
                    contactForm.addEventListener('submit', this.handleContactFormSubmit);
                }
            },
            handleContactFormSubmit(e) {
                e.preventDefault();
                const form = e.target;
                const honeypot = form.querySelector('.honeypot');
                if (honeypot && honeypot.value) {
                    console.warn('[NAOK_V3.0]: Honeypot triggered. Spam submission blocked.');
                    return;
                }

                const formData = new FormData(form);
                const name = formData.get('name');
                const email = formData.get('email');
                const company = formData.get('company');
                const message = formData.get('message');
                const subject = `NAOK Contact from ${name}`;
                const body = `Name: ${name}\nEmail: ${email}\nCompany/Role: ${company || 'N/A'}\n\nMessage:\n${message}`;

                window.location.href = `mailto:northstaraokeystone@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
                
                setTimeout(() => {
                    behaviors.modal.closeModal();
                    form.reset();
                }, 500);
            }
        }
    };

    // Execute the main initialization function.
    behaviors.init();

})();