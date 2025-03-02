/**
 * Cursor Effects for Polytonic
 * Creates interactive cursor animations and effects
 */

class CursorEffects {
    constructor() {
        // DOM elements
        this.cursor = document.querySelector('.cursor-follower');
        this.links = document.querySelectorAll('a, button, .control-btn, input, select');
        
        // Cursor properties
        this.cursorPos = { x: 0, y: 0 };
        this.cursorVisible = false;
        this.cursorActive = false;
        this.cursorScale = 1;
        
        // Ripple properties
        this.ripples = [];
        this.maxRipples = 5;
        
        // Bind methods
        this.onMouseMove = this.onMouseMove.bind(this);
        this.onMouseDown = this.onMouseDown.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);
        this.onMouseEnter = this.onMouseEnter.bind(this);
        this.onMouseLeave = this.onMouseLeave.bind(this);
        this.updateCursor = this.updateCursor.bind(this);
        
        // Initialize
        this.init();
    }
    
    init() {
        // Add event listeners
        document.addEventListener('mousemove', this.onMouseMove);
        document.addEventListener('mousedown', this.onMouseDown);
        document.addEventListener('mouseup', this.onMouseUp);
        document.addEventListener('mouseenter', this.onMouseEnter);
        document.addEventListener('mouseleave', this.onMouseLeave);
        
        // Add event listeners to interactive elements
        this.links.forEach(link => {
            link.addEventListener('mouseenter', () => {
                this.cursorActive = true;
                this.cursorScale = 1.5;
                this.cursor.style.backgroundColor = 'rgba(255, 101, 132, 0.3)';
            });
            
            link.addEventListener('mouseleave', () => {
                this.cursorActive = false;
                this.cursorScale = 1;
                this.cursor.style.backgroundColor = 'rgba(108, 99, 255, 0.3)';
            });
            
            link.addEventListener('click', (e) => {
                this.createRipple(e.clientX, e.clientY);
            });
        });
        
        // Start animation loop
        this.updateCursor();
    }
    
    onMouseMove(e) {
        this.cursorPos.x = e.clientX;
        this.cursorPos.y = e.clientY;
    }
    
    onMouseDown() {
        this.cursorScale = 0.8;
    }
    
    onMouseUp() {
        this.cursorScale = this.cursorActive ? 1.5 : 1;
    }
    
    onMouseEnter() {
        this.cursorVisible = true;
        this.cursor.style.opacity = 1;
    }
    
    onMouseLeave() {
        this.cursorVisible = false;
        this.cursor.style.opacity = 0;
    }
    
    createRipple(x, y) {
        // Create ripple element
        const ripple = document.createElement('div');
        ripple.className = 'cursor-ripple';
        ripple.style.position = 'fixed';
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;
        ripple.style.width = '10px';
        ripple.style.height = '10px';
        ripple.style.borderRadius = '50%';
        ripple.style.backgroundColor = 'rgba(108, 99, 255, 0.5)';
        ripple.style.transform = 'translate(-50%, -50%)';
        ripple.style.zIndex = '9998';
        ripple.style.pointerEvents = 'none';
        
        // Add to DOM
        document.body.appendChild(ripple);
        
        // Animate ripple
        const animation = ripple.animate([
            { opacity: 1, transform: 'translate(-50%, -50%) scale(1)' },
            { opacity: 0, transform: 'translate(-50%, -50%) scale(15)' }
        ], {
            duration: 800,
            easing: 'cubic-bezier(0.215, 0.61, 0.355, 1)'
        });
        
        // Remove ripple after animation
        animation.onfinish = () => {
            ripple.remove();
        };
        
        // Add to ripples array
        this.ripples.push(ripple);
        
        // Remove oldest ripple if too many
        if (this.ripples.length > this.maxRipples) {
            this.ripples[0].remove();
            this.ripples.shift();
        }
    }
    
    updateCursor() {
        // Update cursor position with smooth animation
        if (this.cursorVisible) {
            this.cursor.style.transform = `translate(${this.cursorPos.x}px, ${this.cursorPos.y}px) scale(${this.cursorScale})`;
        }
        
        // Continue animation loop
        requestAnimationFrame(this.updateCursor);
    }
    
    // Add magnetic effect to an element
    addMagneticEffect(element, strength = 0.3) {
        const elementRect = element.getBoundingClientRect();
        const elementCenterX = elementRect.left + elementRect.width / 2;
        const elementCenterY = elementRect.top + elementRect.height / 2;
        
        element.addEventListener('mousemove', (e) => {
            const distanceX = e.clientX - elementCenterX;
            const distanceY = e.clientY - elementCenterY;
            
            gsap.to(element, {
                x: distanceX * strength,
                y: distanceY * strength,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
        
        element.addEventListener('mouseleave', () => {
            gsap.to(element, {
                x: 0,
                y: 0,
                duration: 0.5,
                ease: 'elastic.out(1, 0.3)'
            });
        });
    }
}

// Initialize cursor effects when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.cursorEffects = new CursorEffects();
    
    // Add magnetic effect to buttons
    const buttons = document.querySelectorAll('.cta-button');
    buttons.forEach(button => {
        window.cursorEffects.addMagneticEffect(button, 0.2);
    });
}); 