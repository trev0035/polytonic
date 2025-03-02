/**
 * Audio Processor for Polytonic
 * Handles audio loading, playback, and frequency analysis
 */

class AudioProcessor {
    constructor() {
        // Initialize audio context
        this.audioContext = null;
        this.audioElement = null;
        this.audioSource = null;
        this.analyser = null;
        this.gainNode = null;
        this.frequencyData = null;
        this.timeData = null;
        this.isPlaying = false;
        this.currentTrack = null;
        
        // Visualization settings
        this.fftSize = 1024;
        this.smoothingTimeConstant = 0.85;
        
        // Event callbacks
        this.onPlayCallback = null;
        this.onPauseCallback = null;
        this.onAudioProcessCallback = null;
        this.onTrackEndCallback = null;
        
        this.init();
    }
    
    init() {
        // Create audio context
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        this.audioContext = new AudioContext();
        
        // Create audio element
        this.audioElement = new Audio();
        this.audioElement.crossOrigin = 'anonymous';
        
        // Create nodes
        this.audioSource = this.audioContext.createMediaElementSource(this.audioElement);
        this.analyser = this.audioContext.createAnalyser();
        this.gainNode = this.audioContext.createGain();
        
        // Configure analyser
        this.analyser.fftSize = this.fftSize;
        this.analyser.smoothingTimeConstant = this.smoothingTimeConstant;
        
        // Connect nodes
        this.audioSource.connect(this.analyser);
        this.analyser.connect(this.gainNode);
        this.gainNode.connect(this.audioContext.destination);
        
        // Create data arrays
        this.frequencyData = new Uint8Array(this.analyser.frequencyBinCount);
        this.timeData = new Uint8Array(this.analyser.frequencyBinCount);
        
        // Set up event listeners
        this.audioElement.addEventListener('ended', () => {
            this.isPlaying = false;
            if (this.onTrackEndCallback) this.onTrackEndCallback();
        });
        
        // Start animation loop
        this.animate();
    }
    
    loadTrack(trackUrl) {
        return new Promise((resolve, reject) => {
            if (this.isPlaying) {
                this.pause();
            }
            
            this.currentTrack = trackUrl;
            this.audioElement.src = trackUrl;
            
            this.audioElement.addEventListener('canplaythrough', () => {
                resolve();
            }, { once: true });
            
            this.audioElement.addEventListener('error', (error) => {
                reject(error);
            }, { once: true });
            
            this.audioElement.load();
        });
    }
    
    play() {
        if (this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
        
        this.audioElement.play()
            .then(() => {
                this.isPlaying = true;
                if (this.onPlayCallback) this.onPlayCallback();
            })
            .catch(error => {
                console.error('Error playing audio:', error);
            });
    }
    
    pause() {
        this.audioElement.pause();
        this.isPlaying = false;
        if (this.onPauseCallback) this.onPauseCallback();
    }
    
    togglePlayPause() {
        if (this.isPlaying) {
            this.pause();
        } else {
            this.play();
        }
    }
    
    setVolume(value) {
        this.gainNode.gain.value = value;
    }
    
    getCurrentTime() {
        return this.audioElement.currentTime;
    }
    
    getDuration() {
        return this.audioElement.duration;
    }
    
    seekTo(time) {
        if (time >= 0 && time <= this.audioElement.duration) {
            this.audioElement.currentTime = time;
        }
    }
    
    getFrequencyData() {
        this.analyser.getByteFrequencyData(this.frequencyData);
        return this.frequencyData;
    }
    
    getTimeData() {
        this.analyser.getByteTimeDomainData(this.timeData);
        return this.timeData;
    }
    
    animate() {
        // Get frequency data
        this.analyser.getByteFrequencyData(this.frequencyData);
        this.analyser.getByteTimeDomainData(this.timeData);
        
        // Call callback with data
        if (this.onAudioProcessCallback) {
            this.onAudioProcessCallback(this.frequencyData, this.timeData);
        }
        
        // Continue animation loop
        requestAnimationFrame(this.animate.bind(this));
    }
    
    // Event handlers
    onPlay(callback) {
        this.onPlayCallback = callback;
    }
    
    onPause(callback) {
        this.onPauseCallback = callback;
    }
    
    onAudioProcess(callback) {
        this.onAudioProcessCallback = callback;
    }
    
    onTrackEnd(callback) {
        this.onTrackEndCallback = callback;
    }
}

// Export as global variable
window.audioProcessor = new AudioProcessor(); 