/**
 * Scroll Effects for Polytonic
 * Creates scroll-based animations and effects using GSAP
 */

class ScrollEffects {
    constructor() {
        // DOM elements
        this.header = document.querySelector('header');
        this.sections = document.querySelectorAll('section');
        this.parallaxElements = document.querySelectorAll('.parallax-element');
        
        // Scroll properties
        this.lastScrollTop = 0;
        this.scrollDirection = 'down';
        this.scrollProgress = 0;
        
        // Color transition properties
        this.colors = [
            { r: 255, g: 0, b: 0 },    // Primary color (red)
            { r: 200, g: 0, b: 0 },    // Darker red
            { r: 255, g: 30, b: 30 }   // Lighter red
        ];
        this.currentColorIndex = 0;
        
        // Bind methods
        this.onScroll = this.onScroll.bind(this);
        this.updateScrollDirection = this.updateScrollDirection.bind(this);
        this.updateHeaderState = this.updateHeaderState.bind(this);
        
        // Initialize
        this.init();
    }
    
    init() {
        // Initialize GSAP ScrollTrigger
        gsap.registerPlugin(ScrollTrigger);
        
        // Set up smooth scrolling
        this.setupSmoothScroll();
        
        // Add scroll event listener
        window.addEventListener('scroll', this.onScroll);
        
        // Set up scroll-based animations
        this.setupHeaderAnimation();
        this.setupSectionAnimations();
        this.setupParallaxEffects();
        this.setupColorTransitions();
        this.setupFuturisticEffects();
    }
    
    onScroll() {
        // Update scroll direction
        this.updateScrollDirection();
        
        // Update header state
        this.updateHeaderState();
        
        // Update scroll progress
        this.scrollProgress = window.scrollY / (document.body.scrollHeight - window.innerHeight);
    }
    
    updateScrollDirection() {
        const scrollTop = window.scrollY;
        
        if (scrollTop > this.lastScrollTop) {
            this.scrollDirection = 'down';
        } else {
            this.scrollDirection = 'up';
        }
        
        this.lastScrollTop = scrollTop;
    }
    
    updateHeaderState() {
        if (window.scrollY > 30) {
            this.header.classList.add('scrolled');
        } else {
            this.header.classList.remove('scrolled');
        }
    }
    
    setupSmoothScroll() {
        // Create smoother scrolling experience with GSAP
        ScrollTrigger.defaults({
            ease: "power2.out",
            duration: 0.8
        });
        
        // Smooth scroll to anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const target = document.querySelector(targetId);
                
                if (target) {
                    gsap.to(window, {
                        duration: 1.2,
                        scrollTo: {
                            y: target,
                            offsetY: 80
                        },
                        ease: "power3.inOut"
                    });
                }
            });
        });
    }
    
    setupHeaderAnimation() {
        // Animate header on scroll - make transition smoother and shorter
        gsap.to(this.header, {
            scrollTrigger: {
                trigger: 'body',
                start: 'top top',
                end: '20 top', // Reduced from 30 to 20 for even faster transition
                scrub: 0.3 // Reduced from 0.5 to 0.3 for quicker response
            },
            height: '80px',
            backgroundColor: 'rgba(0, 0, 0, 0.95)',
            boxShadow: '0 5px 20px rgba(0, 0, 0, 0.1)'
        });
        
        // Animate logo on scroll - smoother transition
        const logo = document.querySelector('.logo h1');
        if (logo) {
            gsap.to(logo, {
                scrollTrigger: {
                    trigger: 'body',
                    start: 'top top',
                    end: '20 top', // Reduced from 30 to 20
                    scrub: 0.3 // Reduced from 0.5 to 0.3
                },
                fontSize: '1.8rem',
                color: 'var(--primary-color)',
                textShadow: '0 0 5px rgba(255, 0, 0, 0.5)',
                ease: 'power2.out'
            });
        }
        
        // Animate scroll indicator - fade out on scroll
        const scrollIndicator = document.querySelector('.scroll-indicator');
        if (scrollIndicator) {
            gsap.to(scrollIndicator, {
                scrollTrigger: {
                    trigger: 'body',
                    start: 'top top',
                    end: '10 top', // Fade out quickly
                    scrub: 0.2
                },
                opacity: 0,
                visibility: 'hidden',
                ease: 'power1.out'
            });
        }
        
        // Animate navigation - ensure it only appears when scrolled
        const nav = document.querySelector('nav');
        if (nav) {
            gsap.to(nav, {
                scrollTrigger: {
                    trigger: 'body',
                    start: 'top top',
                    end: '20 top',
                    scrub: 0.3
                },
                opacity: 1,
                visibility: 'visible',
                ease: 'power2.out'
            });
        }
    }
    
    setupSectionAnimations() {
        // Animate sections on scroll - smoother transitions with less scrolling
        this.sections.forEach((section, index) => {
            // Fade in animation
            gsap.fromTo(section, 
                { opacity: 0, y: 50 },
                {
                    scrollTrigger: {
                        trigger: section,
                        start: 'top 90%', 
                        end: 'top 60%', 
                        scrub: 0.3, // Reduced from 0.5 to 0.3
                        once: true
                    },
                    opacity: 1,
                    y: 0,
                    duration: 0.8, // Reduced from 1 to 0.8
                    ease: 'power2.out'
                }
            );
            
            // Text elements animation - smoother and faster
            const textElements = section.querySelectorAll('h1, h2, p');
            gsap.fromTo(textElements, 
                { opacity: 0, y: 20 },
                {
                    scrollTrigger: {
                        trigger: section,
                        start: 'top 85%',
                        end: 'top 60%',
                        scrub: 0.3, // Reduced from 0.5 to 0.3
                        once: true
                    },
                    opacity: 1,
                    y: 0,
                    stagger: 0.06, // Reduced from 0.08 to 0.06 for faster staggering
                    duration: 0.6, // Reduced from 0.8 to 0.6
                    ease: 'power2.out'
                }
            );
        });
    }
    
    setupParallaxEffects() {
        // Create parallax effect for visual elements
        this.parallaxElements.forEach(element => {
            gsap.to(element, {
                scrollTrigger: {
                    trigger: element.parentElement,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: true
                },
                y: '100px',
                ease: 'none'
            });
        });
        
        // Parallax for hero section
        const heroVisual = document.querySelector('.hero-visual');
        if (heroVisual) {
            gsap.to(heroVisual, {
                scrollTrigger: {
                    trigger: '.hero-section',
                    start: 'top top',
                    end: 'bottom top',
                    scrub: true
                },
                y: '200px',
                ease: 'none'
            });
        }
    }
    
    setupColorTransitions() {
        // Create color transition effect on scroll
        const colorTransition = gsap.timeline({
            scrollTrigger: {
                trigger: 'body',
                start: 'top top',
                end: 'bottom bottom',
                scrub: true
            }
        });
        
        // Add color stops at different scroll positions
        const sections = document.querySelectorAll('section');
        sections.forEach((section, index) => {
            if (index < this.colors.length - 1) {
                const progress = index / (sections.length - 1);
                const nextIndex = (index + 1) % this.colors.length;
                
                colorTransition.to(':root', {
                    '--primary-color': this.rgbToHex(
                        this.colors[nextIndex].r,
                        this.colors[nextIndex].g,
                        this.colors[nextIndex].b
                    ),
                    ease: 'none'
                }, progress);
            }
        });
    }
    
    // Add futuristic effects
    setupFuturisticEffects() {
        // Add glitch effect to logo on hover
        const logo = document.querySelector('.logo h1');
        if (logo) {
            logo.addEventListener('mouseenter', () => {
                this.createGlitchEffect(logo);
            });
        }
        
        // Add scan line effect to video background
        const videoBackground = document.querySelector('.video-background');
        if (videoBackground) {
            const scanLines = document.createElement('div');
            scanLines.classList.add('scan-lines');
            videoBackground.appendChild(scanLines);
        }
    }
    
    // Create glitch effect for an element
    createGlitchEffect(element) {
        const timeline = gsap.timeline();
        
        for (let i = 0; i < 5; i++) {
            timeline.to(element, {
                x: gsap.utils.random(-5, 5),
                y: gsap.utils.random(-5, 5),
                opacity: gsap.utils.random(0.8, 1),
                textShadow: `${gsap.utils.random(-5, 5)}px ${gsap.utils.random(-5, 5)}px rgba(255, 0, 0, 0.7)`,
                duration: 0.1
            });
        }
        
        timeline.to(element, {
            x: 0,
            y: 0,
            opacity: 1,
            textShadow: 'none',
            duration: 0.2
        });
    }
    
    // Create wave effect for an element
    createWaveEffect(element, amplitude = 20, frequency = 0.1) {
        const originalY = parseFloat(gsap.getProperty(element, 'y')) || 0;
        
        gsap.to(element, {
            y: originalY + amplitude,
            duration: 2,
            ease: 'sine.inOut',
            repeat: -1,
            yoyo: true
        });
    }
    
    // Helper function to convert RGB to HEX
    rgbToHex(r, g, b) {
        return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    }
    
    // Helper function to interpolate between two colors
    interpolateColor(color1, color2, factor) {
        const result = {
            r: Math.round(color1.r + factor * (color2.r - color1.r)),
            g: Math.round(color1.g + factor * (color2.g - color1.g)),
            b: Math.round(color1.b + factor * (color2.b - color1.b))
        };
        return this.rgbToHex(result.r, result.g, result.b);
    }
}

// Initialize scroll effects when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Load GSAP ScrollTo plugin if available
    if (typeof ScrollToPlugin !== 'undefined') {
        gsap.registerPlugin(ScrollToPlugin);
    }
    
    window.scrollEffects = new ScrollEffects();
    
    // Create wave effect for waveform container
    const waveform = document.getElementById('waveform');
    if (waveform) {
        window.scrollEffects.createWaveEffect(waveform, 15, 0.05);
    }
    
    // GSAP ScrollTrigger animations
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        // Animate sections on scroll
        gsap.utils.toArray('.section-content').forEach(section => {
            gsap.fromTo(section, 
                { y: 50, opacity: 0 }, 
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.8, // Reduced from 1 to 0.8
                    scrollTrigger: {
                        trigger: section,
                        start: 'top 90%',
                        end: 'top 60%',
                        toggleActions: 'play none none reverse',
                        scrub: 0.3 // Reduced from 0.5 to 0.3
                    },
                    ease: 'power2.out'
                }
            );
        });
        
        // Parallax effect for visual elements
        gsap.utils.toArray('.parallax-element').forEach(element => {
            gsap.to(element, {
                y: -100,
                scrollTrigger: {
                    trigger: element.parentElement,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: 0.3 // Reduced from 0.5 to 0.3
                },
                ease: 'none'
            });
        });
    }
}); 