/**
 * Main JavaScript for Polytonic
 * Initializes and coordinates all components
 */

document.addEventListener('DOMContentLoaded', () => {
    // DOM elements
    const playButton = document.getElementById('play-btn');
    const trackSelector = document.getElementById('track-selector');
    const trackName = document.getElementById('track-name');
    const progressBar = document.getElementById('progress-bar');
    const progressContainer = document.querySelector('.progress-container');
    const volumeControl = document.getElementById('volume');
    const startExperienceButton = document.getElementById('start-experience');
    const contactForm = document.getElementById('contact-form');
    
    // Initialize waveform visualization in hero section
    initHeroWaveform();
    
    // Set up audio player controls
    setupAudioControls();
    
    // Set up visualization modes
    setupVisualizationModes();
    
    // Set up hero section interaction
    setupHeroInteraction();
    
    // Set up contact form
    setupContactForm();
    
    // Create initial waveform in hero section
    function initHeroWaveform() {
        const waveform = document.getElementById('waveform');
        if (!waveform) return;
        
        // Create bars for waveform visualization
        for (let i = 0; i < 40; i++) {
            const bar = document.createElement('div');
            bar.className = 'waveform-bar';
            bar.style.height = `${Math.random() * 50 + 10}px`;
            bar.style.backgroundColor = 'rgba(108, 99, 255, 0.7)';
            bar.style.width = '4px';
            bar.style.margin = '0 2px';
            bar.style.borderRadius = '2px';
            bar.style.transition = 'height 0.2s ease';
            waveform.appendChild(bar);
        }
        
        // Animate waveform bars
        animateHeroWaveform();
    }
    
    // Animate waveform in hero section
    function animateHeroWaveform() {
        const bars = document.querySelectorAll('.waveform-bar');
        
        function updateBars() {
            bars.forEach(bar => {
                const height = Math.random() * 50 + 10;
                bar.style.height = `${height}px`;
            });
            
            requestAnimationFrame(() => {
                setTimeout(updateBars, 200);
            });
        }
        
        updateBars();
    }
    
    // Set up audio player controls
    function setupAudioControls() {
        if (!window.audioProcessor) return;
        
        // Play/pause button
        if (playButton) {
            playButton.addEventListener('click', () => {
                if (window.audioProcessor.isPlaying) {
                    window.audioProcessor.pause();
                    playButton.innerHTML = '<i class="fas fa-play"></i>';
                } else {
                    if (window.audioProcessor.currentTrack) {
                        window.audioProcessor.play();
                        playButton.innerHTML = '<i class="fas fa-pause"></i>';
                    } else if (trackSelector.value) {
                        loadAndPlayTrack(trackSelector.value);
                    }
                }
            });
        }
        
        // Track selector
        if (trackSelector) {
            trackSelector.addEventListener('change', () => {
                if (trackSelector.value) {
                    loadAndPlayTrack(trackSelector.value);
                }
            });
        }
        
        // Progress bar
        if (progressContainer) {
            progressContainer.addEventListener('click', (e) => {
                const rect = progressContainer.getBoundingClientRect();
                const percent = (e.clientX - rect.left) / rect.width;
                const duration = window.audioProcessor.getDuration();
                
                if (duration) {
                    window.audioProcessor.seekTo(percent * duration);
                }
            });
        }
        
        // Volume control
        if (volumeControl) {
            volumeControl.addEventListener('input', () => {
                window.audioProcessor.setVolume(volumeControl.value);
            });
            
            // Set initial volume
            window.audioProcessor.setVolume(volumeControl.value);
        }
        
        // Update progress bar during playback
        setInterval(() => {
            if (window.audioProcessor.isPlaying && progressBar) {
                const currentTime = window.audioProcessor.getCurrentTime();
                const duration = window.audioProcessor.getDuration();
                
                if (duration) {
                    const percent = (currentTime / duration) * 100;
                    progressBar.style.width = `${percent}%`;
                }
            }
        }, 100);
        
        // Handle track end
        window.audioProcessor.onTrackEnd(() => {
            playButton.innerHTML = '<i class="fas fa-play"></i>';
        });
        
        // Handle play state
        window.audioProcessor.onPlay(() => {
            playButton.innerHTML = '<i class="fas fa-pause"></i>';
            
            // Start visualizer
            if (window.visualizer) {
                window.visualizer.start();
            }
        });
        
        // Handle pause state
        window.audioProcessor.onPause(() => {
            playButton.innerHTML = '<i class="fas fa-play"></i>';
        });
    }
    
    // Load and play a track
    function loadAndPlayTrack(trackUrl) {
        if (!window.audioProcessor) return;
        
        // Update track name display
        const trackFileName = trackUrl.split('/').pop();
        const trackNameWithoutExt = trackFileName.split('.')[0];
        const formattedTrackName = trackNameWithoutExt
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
        
        trackName.textContent = formattedTrackName;
        
        // Load and play the track
        window.audioProcessor.loadTrack(trackUrl)
            .then(() => {
                window.audioProcessor.play();
                playButton.innerHTML = '<i class="fas fa-pause"></i>';
                
                // Reset progress bar
                progressBar.style.width = '0';
            })
            .catch(error => {
                console.error('Error loading track:', error);
                trackName.textContent = 'Error loading track';
            });
    }
    
    // Set up visualization modes
    function setupVisualizationModes() {
        if (!window.visualizer) return;
        
        // Create visualization mode buttons
        const visualizationContainer = document.querySelector('.visualization-container');
        if (visualizationContainer) {
            const modeControls = document.createElement('div');
            modeControls.className = 'visualization-modes';
            modeControls.innerHTML = `
                <button class="mode-btn active" data-mode="bars">Bars</button>
                <button class="mode-btn" data-mode="wave">Wave</button>
                <button class="mode-btn" data-mode="particles">Particles</button>
                <button class="mode-btn" data-mode="spectrum">Spectrum</button>
            `;
            
            visualizationContainer.appendChild(modeControls);
            
            // Add event listeners to mode buttons
            const modeButtons = document.querySelectorAll('.mode-btn');
            modeButtons.forEach(button => {
                button.addEventListener('click', () => {
                    // Update active button
                    modeButtons.forEach(btn => btn.classList.remove('active'));
                    button.classList.add('active');
                    
                    // Set visualization mode
                    const mode = button.getAttribute('data-mode');
                    window.visualizer.setVisualizationMode(mode);
                });
            });
        }
    }
    
    // Set up hero section interaction
    function setupHeroInteraction() {
        if (startExperienceButton) {
            startExperienceButton.addEventListener('click', () => {
                // Scroll to experience section
                const experienceSection = document.getElementById('experience');
                if (experienceSection) {
                    experienceSection.scrollIntoView({ behavior: 'smooth' });
                }
                
                // If we have a default track, load and play it
                if (trackSelector && trackSelector.options.length > 1) {
                    const defaultTrack = trackSelector.options[1].value;
                    loadAndPlayTrack(defaultTrack);
                    trackSelector.value = defaultTrack;
                }
            });
        }
    }
    
    // Set up contact form
    function setupContactForm() {
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                
                // Get form values
                const name = document.getElementById('name').value;
                const email = document.getElementById('email').value;
                const message = document.getElementById('message').value;
                
                // In a real application, you would send this data to a server
                console.log('Form submitted:', { name, email, message });
                
                // Show success message
                const formGroup = contactForm.querySelector('.form-group:last-child');
                const successMessage = document.createElement('div');
                successMessage.className = 'success-message';
                successMessage.textContent = 'Thank you for your message! We\'ll get back to you soon.';
                successMessage.style.color = 'var(--tertiary-color)';
                successMessage.style.marginTop = '1rem';
                
                // Add success message to form
                formGroup.appendChild(successMessage);
                
                // Reset form
                contactForm.reset();
                
                // Remove success message after 5 seconds
                setTimeout(() => {
                    successMessage.remove();
                }, 5000);
            });
        }
    }
    
    // Process audio data for visualizations
    if (window.audioProcessor && window.visualizer) {
        window.audioProcessor.onAudioProcess((frequencyData, timeData) => {
            // Update hero waveform if audio is playing
            if (window.audioProcessor.isPlaying) {
                updateHeroWaveform(frequencyData);
            }
        });
    }
    
    // Update hero waveform based on audio data
    function updateHeroWaveform(frequencyData) {
        const bars = document.querySelectorAll('.waveform-bar');
        if (!bars.length) return;
        
        const step = Math.floor(frequencyData.length / bars.length);
        
        bars.forEach((bar, index) => {
            const dataIndex = index * step;
            const value = frequencyData[dataIndex] || 0;
            const percent = value / 255;
            const height = Math.max(10, percent * 100);
            
            bar.style.height = `${height}px`;
            
            // Change color based on frequency
            const hue = 240 + (percent * 60); // Range from purple to pink
            bar.style.backgroundColor = `hsl(${hue}, 80%, 60%)`;
        });
    }
}); 