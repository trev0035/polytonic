/**
 * Audio Visualizer for Polytonic
 * Creates visual representations of audio data
 */

class Visualizer {
    constructor(canvasId, particleContainerId) {
        // Canvas setup
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.particleContainer = document.getElementById(particleContainerId);
        
        // Visualization properties
        this.visualizationMode = 'bars'; // 'bars', 'wave', 'particles', 'circular', 'spectrum'
        this.barWidth = 4;
        this.barSpacing = 1;
        this.barMinHeight = 5;
        this.sensitivity = 1.5;
        this.particles = [];
        this.maxParticles = 100;
        
        // Colors
        this.baseColor = '#6c63ff';
        this.accentColor = '#ff6584';
        this.gradientColors = [
            { stop: 0.0, color: '#43cea2' },
            { stop: 0.5, color: '#6c63ff' },
            { stop: 1.0, color: '#ff6584' }
        ];
        
        // Animation properties
        this.animationId = null;
        this.isActive = false;
        
        // Bind methods
        this.resize = this.resize.bind(this);
        this.visualize = this.visualize.bind(this);
        this.createParticles = this.createParticles.bind(this);
        this.updateParticles = this.updateParticles.bind(this);
        
        // Initialize
        this.init();
    }
    
    init() {
        // Set up resize listener
        window.addEventListener('resize', this.resize);
        this.resize();
        
        // Create initial particles
        this.createParticles();
    }
    
    resize() {
        // Set canvas dimensions to match container
        const container = this.canvas.parentElement;
        this.canvas.width = container.offsetWidth;
        this.canvas.height = container.offsetHeight;
        
        // Recalculate bar dimensions
        this.barWidth = Math.max(2, Math.floor(this.canvas.width / 128));
        this.barSpacing = Math.max(1, Math.floor(this.barWidth / 4));
    }
    
    start() {
        if (!this.isActive) {
            this.isActive = true;
            this.animate();
        }
    }
    
    stop() {
        this.isActive = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }
    
    setVisualizationMode(mode) {
        if (['bars', 'wave', 'particles', 'spectrum'].includes(mode)) {
            this.visualizationMode = mode;
        }
    }
    
    setSensitivity(value) {
        this.sensitivity = value;
    }
    
    createGradient() {
        const gradient = this.ctx.createLinearGradient(0, this.canvas.height, 0, 0);
        this.gradientColors.forEach(color => {
            gradient.addColorStop(color.stop, color.color);
        });
        return gradient;
    }
    
    createParticles() {
        this.particles = [];
        for (let i = 0; i < this.maxParticles; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 8 + 4,
                speedX: Math.random() * 2 - 1,
                speedY: Math.random() * 2 - 1,
                color: this.gradientColors[Math.floor(Math.random() * this.gradientColors.length)].color,
                opacity: Math.random() * 0.5 + 0.2
            });
        }
    }
    
    updateParticles(frequencyData) {
        // Get average frequency value for particle speed
        let sum = 0;
        for (let i = 0; i < frequencyData.length; i++) {
            sum += frequencyData[i];
        }
        const average = sum / frequencyData.length;
        const speedFactor = average / 128 * this.sensitivity;
        
        // Update particle positions
        this.particles.forEach((particle, index) => {
            // Update position
            particle.x += particle.speedX * speedFactor;
            particle.y += particle.speedY * speedFactor;
            
            // Bounce off walls
            if (particle.x < 0 || particle.x > this.canvas.width) {
                particle.speedX *= -1;
            }
            
            if (particle.y < 0 || particle.y > this.canvas.height) {
                particle.speedY *= -1;
            }
            
            // Reset particles that go out of bounds
            if (particle.x < -50 || particle.x > this.canvas.width + 50 || 
                particle.y < -50 || particle.y > this.canvas.height + 50) {
                particle.x = Math.random() * this.canvas.width;
                particle.y = Math.random() * this.canvas.height;
            }
            
            // Modulate size based on frequency data
            const freqIndex = Math.floor(index / this.maxParticles * frequencyData.length);
            const freqValue = frequencyData[freqIndex] || 0;
            particle.size = (freqValue / 255) * 15 + 4;
            
            // Modulate opacity based on frequency
            particle.opacity = (freqValue / 255) * 0.5 + 0.2;
        });
    }
    
    drawBars(frequencyData) {
        const gradient = this.createGradient();
        this.ctx.fillStyle = gradient;
        
        const barCount = Math.min(frequencyData.length, Math.floor(this.canvas.width / (this.barWidth + this.barSpacing)));
        const frequencyStep = Math.floor(frequencyData.length / barCount);
        
        for (let i = 0; i < barCount; i++) {
            const freqIndex = i * frequencyStep;
            const value = frequencyData[freqIndex] || 0;
            const percent = value / 255;
            const barHeight = Math.max(this.barMinHeight, percent * this.canvas.height * this.sensitivity);
            
            const x = i * (this.barWidth + this.barSpacing);
            const y = this.canvas.height - barHeight;
            
            this.ctx.fillRect(x, y, this.barWidth, barHeight);
        }
    }
    
    drawWave(timeData) {
        // Create gradient for wave
        const gradient = this.ctx.createLinearGradient(0, 0, this.canvas.width, 0);
        this.gradientColors.forEach(color => {
            gradient.addColorStop(color.stop, color.color);
        });
        
        this.ctx.strokeStyle = gradient;
        this.ctx.lineWidth = 4;
        this.ctx.beginPath();
        
        const sliceWidth = this.canvas.width / timeData.length;
        let x = 0;
        
        for (let i = 0; i < timeData.length; i++) {
            const v = timeData[i] / 128.0;
            const y = v * this.canvas.height / 2;
            
            if (i === 0) {
                this.ctx.moveTo(x, y);
            } else {
                this.ctx.lineTo(x, y);
            }
            
            x += sliceWidth;
        }
        
        this.ctx.lineTo(this.canvas.width, this.canvas.height / 2);
        this.ctx.stroke();
    }
    
    drawParticles() {
        this.particles.forEach(particle => {
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fillStyle = particle.color;
            this.ctx.globalAlpha = particle.opacity;
            this.ctx.fill();
            this.ctx.globalAlpha = 1;
        });
    }
    
    drawCircular(frequencyData) {
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        const radius = Math.min(centerX, centerY) * 0.8;
        const barCount = 180;
        const angleStep = (Math.PI * 2) / barCount;
        
        // Create radial gradient
        const gradient = this.ctx.createRadialGradient(
            centerX, centerY, radius * 0.2,
            centerX, centerY, radius
        );
        
        this.gradientColors.forEach(color => {
            gradient.addColorStop(color.stop, color.color);
        });
        
        this.ctx.fillStyle = gradient;
        this.ctx.strokeStyle = gradient;
        this.ctx.lineWidth = 2;
        
        // Draw circular bars
        for (let i = 0; i < barCount; i++) {
            const angle = i * angleStep;
            const freqIndex = Math.floor(i / barCount * frequencyData.length);
            const value = frequencyData[freqIndex] || 0;
            const percent = value / 255;
            const barHeight = Math.max(this.barMinHeight, percent * radius * 0.7 * this.sensitivity);
            
            const startX = centerX + Math.cos(angle) * radius * 0.3;
            const startY = centerY + Math.sin(angle) * radius * 0.3;
            const endX = centerX + Math.cos(angle) * (radius * 0.3 + barHeight);
            const endY = centerY + Math.sin(angle) * (radius * 0.3 + barHeight);
            
            this.ctx.beginPath();
            this.ctx.moveTo(startX, startY);
            this.ctx.lineTo(endX, endY);
            this.ctx.stroke();
            
            // Add a small circle at the end of each line
            if (percent > 0.2) {
                this.ctx.beginPath();
                this.ctx.arc(endX, endY, percent * 4, 0, Math.PI * 2);
                this.ctx.fill();
            }
        }
        
        // Draw center circle
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, radius * 0.2, 0, Math.PI * 2);
        this.ctx.fill();
    }
    
    drawSpectrum(frequencyData) {
        const width = this.canvas.width;
        const height = this.canvas.height;
        const barCount = Math.min(frequencyData.length, Math.floor(width / 2));
        const barWidth = width / barCount;
        
        // Create linear gradient
        const gradient = this.ctx.createLinearGradient(0, 0, width, 0);
        gradient.addColorStop(0, '#43cea2');
        gradient.addColorStop(0.5, '#6c63ff');
        gradient.addColorStop(1, '#ff6584');
        
        this.ctx.fillStyle = gradient;
        
        // Draw mirrored spectrum
        for (let i = 0; i < barCount; i++) {
            const value = frequencyData[i] || 0;
            const percent = value / 255;
            const barHeight = Math.max(this.barMinHeight, percent * height * 0.8 * this.sensitivity);
            
            // Left side (mirrored)
            const leftX = width / 2 - i * barWidth - 1;
            const y = height / 2 - barHeight / 2;
            
            // Right side
            const rightX = width / 2 + i * barWidth;
            
            this.ctx.fillRect(leftX, y, barWidth - 1, barHeight);
            this.ctx.fillRect(rightX, y, barWidth - 1, barHeight);
        }
    }
    
    visualize(frequencyData, timeData) {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw based on current mode
        switch (this.visualizationMode) {
            case 'bars':
                this.drawBars(frequencyData);
                break;
            case 'wave':
                this.drawWave(timeData);
                break;
            case 'particles':
                this.updateParticles(frequencyData);
                this.drawParticles();
                break;
            case 'spectrum':
                this.drawSpectrum(frequencyData);
                break;
            default:
                this.drawBars(frequencyData);
        }
    }
    
    animate() {
        if (!this.isActive) return;
        
        // Get audio data from processor
        if (window.audioProcessor) {
            const frequencyData = window.audioProcessor.getFrequencyData();
            const timeData = window.audioProcessor.getTimeData();
            this.visualize(frequencyData, timeData);
        }
        
        // Continue animation loop
        this.animationId = requestAnimationFrame(this.animate.bind(this));
    }
}

// Initialize visualizer when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.visualizer = new Visualizer('visualization-canvas', 'particles');
}); 