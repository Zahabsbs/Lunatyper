// --- Configuration ---
const NOTE_MAPPINGS = {
    // Number row for sharps (black keys)
    'Digit2': { note: 'C#4', color: '#6E7B91' }, 'Digit3': { note: 'D#4', color: '#6E7B91' },
    'Digit5': { note: 'F#4', color: '#6E7B91' }, 'Digit6': { note: 'G#3', color: '#6E7B91' },
    'Digit7': { note: 'A#4', color: '#6E7B91' },

    // Top row (QWERTY)
    'KeyQ': { note: 'C4', color: '#4A90E2' }, 'KeyW': { note: 'D4', color: '#9013FE' },
    'KeyE': { note: 'E4', color: '#F5A623' }, 'KeyR': { note: 'F4', color: '#F8E71C' },
    'KeyT': { note: 'G4', color: '#7ED321' }, 'KeyY': { note: 'A4', color: '#50E3C2' },
    'KeyU': { note: 'B4', color: '#B8E986' }, 'KeyI': { note: 'C5', color: '#4A90E2' },
    'KeyO': { note: 'D5', color: '#9013FE' }, 'KeyP': { note: 'E5', color: '#F5A623' },
    'BracketLeft': { note: 'F5', color: '#F8E71C' }, 'BracketRight': { note: 'G5', color: '#7ED321' },
    
    // Home row (ASDF)
    'KeyA': { note: 'C3', color: '#4A90E2' }, 'KeyS': { note: 'D3', color: '#9013FE' },
    'KeyD': { note: 'E3', color: '#F5A623' }, 'KeyF': { note: 'F3', color: '#F8E71C' },
    'KeyG': { note: 'G3', color: '#7ED321' }, 'KeyH': { note: 'A3', color: '#50E3C2' },
    'KeyJ': { note: 'B3', color: '#B8E986' }, 'KeyK': { note: 'C4', color: '#4A90E2' },
    'KeyL': { note: 'D4', color: '#9013FE' }, 'Semicolon': { note: 'E4', color: '#F5A623' },
    'Quote': { note: 'F4', color: '#F8E71C' },

    // Bottom row (ZXCV)
    'KeyZ': { note: 'C2', color: '#4A90E2' }, 'KeyX': { note: 'D2', color: '#9013FE' },
    'KeyC': { note: 'E2', color: '#F5A623' }, 'KeyV': { note: 'F2', color: '#F8E71C' },
    'KeyB': { note: 'G2', color: '#7ED321' }, 'KeyN': { note: 'A2', color: '#50E3C2' },
    'KeyM': { note: 'B2', color: '#B8E986' },
};

const SONATA_COLORS = {
    'C': '#8e9aaf', 'D': '#9b8ead', 'E': '#a38eab',
    'F': '#a88e9f', 'G': '#aa8e93', 'A': '#a89d8e', 'B': '#9fa38e'
};

const MOONLIGHT_SONATA = {
    // The true opening of Moonlight Sonata in C# minor.
    // Harmonically corrected to be faithful to the original piece.
    keys: [
        // Bar 1-2: C# minor arpeggio (G#3-C#4-E4)
        'Digit6', 'Digit2', 'KeyE',  'Digit6', 'Digit2', 'KeyE',
        'Digit6', 'Digit2', 'KeyE',  'Digit6', 'Digit2', 'KeyE',

        // Bar 3-4: A major arpeggio (A3-C#4-E4)
        'KeyH', 'Digit2', 'KeyE',    'KeyH', 'Digit2', 'KeyE',
        'KeyH', 'Digit2', 'KeyE',    'KeyH', 'Digit2', 'KeyE',
        
        // Bar 5-6: G# dominant 7th arpeggio (G#3-B3-D#4) - leading back to C#m
        'Digit6', 'KeyJ', 'Digit3',  'Digit6', 'KeyJ', 'Digit3',
        'Digit6', 'KeyJ', 'Digit3',  'Digit6', 'KeyJ', 'Digit3',

        // Bar 7-8: Resolution back to C# minor
        'Digit6', 'Digit2', 'KeyE',  'Digit6', 'Digit2', 'KeyE',
        'Digit6', 'Digit2', 'KeyE',  'Digit6', 'Digit2', 'KeyE',
    ],
};

// --- Effects ---
const fxContainer = document.getElementById('fx-container');
const particleCanvas = document.getElementById('particle-canvas');
const ctx = particleCanvas.getContext('2d');
particleCanvas.width = window.innerWidth;
particleCanvas.height = window.innerHeight;

let particles = [];
const body = document.body;
let colorResetTimer = null;

function lunarRippleEffect(keyElement, color, effectType) {
    if (!keyElement || !color) return;
    gsap.timeline()
        .to(keyElement, { backgroundColor: color, boxShadow: `0 0 25px 3px ${color}`, duration: 0.1, ease: 'power2.out' })
        .to(keyElement, { backgroundColor: 'rgba(255, 255, 255, 0.05)', boxShadow: '0 0 0 rgba(100, 255, 255, 0)', duration: 0.4, ease: 'power2.in' });
    createWave(keyElement, color, effectType);
    createBurstParticles(keyElement, color);
    if (colorResetTimer) clearTimeout(colorResetTimer);
    gsap.to(body, { '--glow-color-dynamic': color, duration: 0.1 });
    colorResetTimer = setTimeout(() => {
        gsap.to(body, { '--glow-color-dynamic': 'rgba(45, 215, 255, 0.5)', duration: 1.0 });
    }, 200);
}

function createWave(keyElement, color, effectType = 'radial') {
    const wave = document.createElement('div');
    wave.className = 'ripple';
    const rect = keyElement.getBoundingClientRect();
    if (effectType === 'horizontalWave') {
        wave.style.left = '0';
        wave.style.top = `${rect.top + rect.height / 2}px`;
        wave.style.width = '100%';
        wave.style.height = '4px';
        wave.style.borderRadius = '2px';
        wave.style.background = `linear-gradient(90deg, transparent, ${color}, transparent)`;
        fxContainer.appendChild(wave);
        gsap.from(wave, { scaleX: 0, duration: 0.8, ease: 'power2.out', onComplete: () => wave.remove() });
    } else if (effectType === 'eraseWave') {
        wave.style.left = `${rect.left + rect.width / 2}px`;
        wave.style.top = `${rect.top + rect.height / 2}px`;
        wave.style.background = `radial-gradient(circle, ${color} 30%, transparent 70%)`;
        fxContainer.appendChild(wave);
        gsap.to(wave, { scale: 30, opacity: 0, duration: 1.2, ease: 'power3.out', onComplete: () => wave.remove() });
    } else {
        wave.style.left = `${rect.left + rect.width / 2}px`;
        wave.style.top = `${rect.top + rect.height / 2}px`;
        wave.style.border = `2px solid ${color}`;
        fxContainer.appendChild(wave);
        gsap.to(wave, { scale: 30, opacity: 0, duration: 0.8, ease: 'power2.out', onComplete: () => wave.remove() });
    }
}

function createBurstParticles(keyElement, color) {
    const rect = keyElement.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    for (let i = 0; i < 20; i++) { particles.push(new Particle(x, y, color)); }
}

class Particle {
    constructor(x, y, color) { this.x = x; this.y = y; this.size = Math.random() * 4 + 2; this.speedX = Math.random() * 6 - 3; this.speedY = Math.random() * 6 - 3; this.color = color; this.life = 1; }
    update() { this.x += this.speedX; this.y += this.speedY; this.life -= 0.03; this.speedY += 0.05; }
    draw() { ctx.fillStyle = this.color; ctx.globalAlpha = this.life; ctx.beginPath(); ctx.fillRect(this.x, this.y, this.size, this.size); }
}

function animateParticles() {
    ctx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);
    particles.forEach((p, i) => {
        p.update();
        p.draw();
        if (p.life <= 0) particles.splice(i, 1);
    });
    requestAnimationFrame(animateParticles);
}
animateParticles();
window.addEventListener('resize', () => { particleCanvas.width = window.innerWidth; particleCanvas.height = window.innerHeight; });

// --- Main Logic ---
document.addEventListener('DOMContentLoaded', () => {
    const DOM = {
        keys: document.querySelectorAll('.key'),
        light: document.getElementById('cursor-light'),
        body: document.body,
        dynamicBg: document.getElementById('dynamic-bg'),
        moon: document.getElementById('moon'),
        moonModeBg: document.getElementById('moon-mode-bg'),
        modeOptions: document.querySelectorAll('.mode-option'),
        loadingOverlay: document.getElementById('loading-overlay'),
        loadingText: document.querySelector('.loading-text')
    };

    // --- Tone.js Integration ---
    let synth, reverb; // Declare variables, but don't initialize yet

    // -------------------------

    let state = {
        currentMode: 'free',
        sonataIndex: 0,
        currentPromptEl: null,
    };

    async function setBackground(mode) {
        if (mode === 'free') {
            DOM.moonModeBg.style.opacity = 0;
            gsap.to(DOM.moon, { top: '110%', duration: 1.5, ease: 'power2.in' });
            
            // --- CORS FIX: Replaced the blocked NASA API with a direct link to a beautiful, reliable image ---
            const staticImageUrl = 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2944&auto=format&fit=crop';
            const img = new Image();
            img.src = staticImageUrl;
            img.onload = () => {
                DOM.dynamicBg.style.backgroundImage = `url(${staticImageUrl})`;
                DOM.dynamicBg.style.opacity = 0.3;
            };

        } else { // 'auto' mode - Moonrise
            DOM.dynamicBg.style.opacity = 0;
            DOM.moonModeBg.style.opacity = 1;
            gsap.to(DOM.moon, {
                top: '20%',
                duration: 1.5, // Made significantly faster
                ease: 'power2.out',
                delay: 0.2 // Made significantly shorter
            });
        }
    }


    function init() {
        setupEventListeners();
        setupKeys();
        setBackground(state.currentMode);
        // Initial light position and scale up
        gsap.to(DOM.light, {
            scale: 1,
            duration: 1.5,
            ease: 'power2.out'
        });
    }

    function setupKeys() {
        DOM.keys.forEach(key => {
            const keyCode = key.getAttribute('data-key');
            const mapping = NOTE_MAPPINGS[keyCode];
            if (mapping && mapping.note) {
                const noteNameEl = document.createElement('div');
                noteNameEl.className = 'note-name';
                noteNameEl.textContent = mapping.note;
                key.appendChild(noteNameEl);
            }
        });
    }

    function setupEventListeners() {
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('mousemove', (e) => {
            // --- PROJECTOR FIX ---
            // Using 'overwrite: "auto"' to prevent animation conflicts on fast mouse movements.
            // This ensures the projector follows smoothly and accurately.
            gsap.to(DOM.light, {
                x: e.clientX,
                y: e.clientY,
                xPercent: -50,
                yPercent: -50,
                duration: 0.2,
                ease: 'power3.out',
                overwrite: 'auto'
            });
        });

        DOM.keys.forEach(key => {
            key.addEventListener('click', () => {
                const keyCode = key.getAttribute('data-key');
                window.dispatchEvent(new KeyboardEvent('keydown', { 'code': keyCode, bubbles: true }));
            });
        });

        // --- New Event Listener for the new mode selector ---
        DOM.modeOptions.forEach(option => {
            option.addEventListener('click', () => {
                if (option.classList.contains('active')) return;

                // Update active class
                DOM.modeOptions.forEach(opt => opt.classList.remove('active'));
                option.classList.add('active');

                // Change the mode
                const newMode = option.dataset.value;
                state.currentMode = newMode;
                
                DOM.body.classList.toggle('sonata-mode', newMode === 'auto');
                setBackground(newMode);
                if (newMode === 'auto') {
                    startSonataMode();
                } else {
                    stopSonataMode();
                }
            });
        });
    }

    function handleKeyDown(e) {
        if (e.repeat) return;
        const { code } = e;
        const mapping = NOTE_MAPPINGS[code];
        const keyElement = document.querySelector(`div[data-key="${code}"]`);
        if (!keyElement || !mapping) return; 

        let effectColor = mapping.color;
        if (state.currentMode === 'auto' && mapping.note) {
            const noteLetter = mapping.note.charAt(0);
            effectColor = SONATA_COLORS[noteLetter] || mapping.color;
        }

        lunarRippleEffect(keyElement, effectColor, mapping.effect);

        if (mapping.note) {
            playNote(mapping.note);
        }

        if (state.currentMode === 'auto') {
            const expectedKeyCode = MOONLIGHT_SONATA.keys[state.sonataIndex];
            if (code === expectedKeyCode) {
                state.sonataIndex++;
                promptNextKey();
            }
        }
    }

    // --- New, Tone.js Powered Sound Playback ---
    function playNote(note) {
        if (!note || !synth) return;
        try {
            synth.triggerAttackRelease(note, '8n');
        } catch (error) {
            console.error(`Tone.js could not play note ${note}:`, error);
        }
    }


    function stopSonataMode() {
        if (state.currentPromptEl) {
            state.currentPromptEl.classList.remove('prompt');
        }
        state.sonataIndex = 0;
        state.currentPromptEl = null;
    }

    function promptNextKey() {
        if (state.currentPromptEl) {
            state.currentPromptEl.classList.remove('prompt');
        }
        if (state.sonataIndex >= MOONLIGHT_SONATA.keys.length) {
            state.sonataIndex = 0; // Loop the sonata
        }
        const nextKeyCode = MOONLIGHT_SONATA.keys[state.sonataIndex];
        state.currentPromptEl = document.querySelector(`div[data-key="${nextKeyCode}"]`);
        if (state.currentPromptEl) {
            state.currentPromptEl.classList.add('prompt');
        }
    }
    
    function startSonataMode() {
        stopSonataMode();
        promptNextKey();
    }
    
    // --- App Initialization with Tone.js ---
    async function startApp() {
        // We must wait for a user gesture to start the audio context.
        DOM.loadingText.textContent = 'Click anywhere to begin';
        DOM.loadingOverlay.style.cursor = 'pointer';

        DOM.loadingOverlay.addEventListener('click', async () => {
            await Tone.start();
            console.log("Audio context started");

            // --- FIX: Initialize audio components *after* user interaction ---
            
            // Add a subtle reverb to simulate a room and add "life"
            reverb = new Tone.Reverb({
                decay: 2,       // The length of the reverb tail
                preDelay: 0.01, // A short delay before the reverb starts
                wet: 0.3        // How much of the reverb is mixed in
            }).toDestination();
            
            // Add an EQ to boost the low frequencies for a richer, warmer bass
            const eq = new Tone.EQ3({
                low: 3,      // Boost the bass by 3 dB
                mid: -1.5,   // Slightly cut the mids to make bass/highs stand out
                high: 0.5    // A tiny boost to highs for clarity
            });

            // --- The most realistic option: A Sampler with real piano recordings ---
            DOM.loadingText.textContent = 'Loading Acoustic Piano...';

            synth = new Tone.Sampler({
                urls: {
                    'A0': 'A0.mp3', 'C1': 'C1.mp3', 'D#1': 'Ds1.mp3', 'F#1': 'Fs1.mp3', 'A1': 'A1.mp3', 'C2': 'C2.mp3', 'D#2': 'Ds2.mp3', 'F#2': 'Fs2.mp3', 'A2': 'A2.mp3', 'C3': 'C3.mp3', 'D#3': 'Ds3.mp3', 'F#3': 'Fs3.mp3', 'A3': 'A3.mp3', 'C4': 'C4.mp3', 'D#4': 'Ds4.mp3', 'F#4': 'Fs4.mp3', 'A4': 'A4.mp3', 'C5': 'C5.mp3', 'D#5': 'Ds5.mp3', 'F#5': 'Fs5.mp3', 'A5': 'A5.mp3', 'C6': 'C6.mp3', 'D#6': 'Ds6.mp3', 'F#6': 'Fs6.mp3', 'A6': 'A6.mp3', 'C7': 'C7.mp3', 'D#7': 'Ds7.mp3', 'F#7': 'Fs7.mp3', 'A7': 'A7.mp3', 'C8': 'C8.mp3'
                },
                release: 2.5, // Increased release time to simulate pedal sustain
                baseUrl: 'https://tonejs.github.io/audio/salamander/'
            }).chain(eq, reverb);
            
            // Wait for the samples to load before hiding the overlay and starting the app
            await Tone.loaded();
            // -----------------------------------------------------------------

            // Hide loading overlay
            gsap.to(DOM.loadingOverlay, {
                opacity: 0,
                duration: 0.5,
                onComplete: () => DOM.loadingOverlay.style.display = 'none'
            });

            // Initialize the rest of the app
            init();
        }, { once: true });
    }

    startApp();
}); 