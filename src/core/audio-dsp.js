/**
 * Short-wave Radio Atmospheric Static and Receiver Hiss Synthesis Engine.
 * Implements native Web Audio API components for authentic sidetone and background noise.
 */
export class ReceiverAudioDsp {
    constructor() {
        this.audioCtx = null;
        this.isMuted = true;

        // Core Nodes
        this.whiteNoiseNode = null;
        this.crackleGain = null;
        this.mainFilterNode = null;
        this.masterVolumeNode = null;

        // Schedulers
        this.crackleInterval = null;
    }

    /**
     * Initializes the audio context graph. Safe for touch screen gesture triggers.
     */
    init() {
        if (this.audioCtx) return;

        this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        
        // 1. Create a Master Output Volume Regulator Line
        this.masterVolumeNode = this.audioCtx.createGain();
        this.masterVolumeNode.gain.setValueAtTime(0.0, this.audioCtx.currentTime); // Start silent

        // 2. Create the Primary Receiver Bandpass Filter Window
        this.mainFilterNode = this.audioCtx.createBiquadFilter();
        this.mainFilterNode.type = 'bandpass';
        this.setFilterProfile('WIDE'); // Default to a standard loose short-wave audio signature

        // 3. Generate Continuous Procedural Thermal Vacuum Tube Hiss
        this.whiteNoiseNode = this.createWhiteNoiseGenerator();

        // 4. Create Atmospheric Crackle Gain Pipeline
        this.crackleGain = this.audioCtx.createGain();
        this.crackleGain.gain.setValueAtTime(0.01, this.audioCtx.currentTime);

        // 5. Connect Component Nodes Graph
        this.whiteNoiseNode.connect(this.mainFilterNode);
        this.crackleGain.connect(this.mainFilterNode);
        this.mainFilterNode.connect(this.masterVolumeNode);
        this.masterVolumeNode.connect(this.audioCtx.destination);

        // 6. Launch the Random Lightning/Static Discharge Spark Scheduler
        this.startAtmosphericCrackleGenerator();
    }

    /**
     * Procedural Math Loop generating a raw audio buffer stream for thermal noise
     */
    createWhiteNoiseGenerator() {
        const bufferSize = 2 * this.audioCtx.sampleRate;
        const noiseBuffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
        const outputChannel = noiseBuffer.getChannelData(0);

        for (let i = 0; i < bufferSize; i++) {
            // Random floating point noise between -1.0 and 1.0
            outputChannel[i] = Math.random() * 2 - 1;
        }

        const bufferSource = this.audioCtx.createBufferSource();
        bufferSource.buffer = noiseBuffer;
        bufferSource.loop = true;
        bufferSource.start(0);

        const internalHissVolume = this.audioCtx.createGain();
        internalHissVolume.gain.setValueAtTime(0.04, this.audioCtx.currentTime); // Background floor baseline
        
        bufferSource.connect(internalHissVolume);
        return internalHissVolume;
    }

    /**
     * Schedules spontaneous microburst static pops to simulate deep-sea ionospheric travel
     */
    startAtmosphericCrackleGenerator() {
        this.crackleInterval = setInterval(() => {
            if (this.isMuted || !this.audioCtx) return;

            // Roll dice for spontaneous static lightning discharge spikes
            if (Math.random() > 0.6) {
                const burstDuration = 0.02 + Math.random() * 0.08;
                const burstIntensity = 0.08 + Math.random() * 0.25;

                // Create a brief impulse envelope spike
                const pulseOsc = this.audioCtx.createOscillator();
                pulseOsc.type = 'sawtooth';
                pulseOsc.frequency.setValueAtTime(45 + Math.random() * 120, this.audioCtx.currentTime);

                const pulseGain = this.audioCtx.createGain();
                pulseGain.gain.setValueAtTime(burstIntensity, this.audioCtx.currentTime);
                pulseGain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + burstDuration);

                pulseOsc.connect(pulseGain);
                pulseGain.connect(this.crackleGain);

                pulseOsc.start();
                pulseOsc.stop(this.audioCtx.currentTime + burstDuration);
            }
        }, 180);
    }

    /**
     * Toggles main receiver amplifier audio states based on physical hardware switches
     * @param {boolean} powerOnState 
     */
    setReceiverPowerState(powerOnState) {
        this.init();
        this.isMuted = !powerOnState;
        
        const targetVolume = powerOnState ? 1.0 : 0.0;
        // Apply smooth logarithmic audio fade trajectory to prevent sharp speaker clicks
        this.masterVolumeNode.gain.linearRampToValueAtTime(targetVolume, this.audioCtx.currentTime + 0.15);
        console.log(`🔊 Receiver Audio Hardware Node power configuration updated: [${powerOnState ? 'ENERGIZED' : 'MUTED'}]`);
    }

    /**
     * Controls standard receiver audio filtering signatures
     * @param {string} mode - 'WIDE' (Standard Voice) | 'NARROW_CW' (Tight Telemetry filtering window)
     */
    setFilterProfile(mode) {
        if (!this.mainFilterNode && !this.audioCtx) return;
        
        const now = this.audioCtx ? this.audioCtx.currentTime : 0;

        if (mode === 'NARROW_CW') {
            // Tighten filter envelope down directly onto the 800Hz Morse code sidetone band
            this.mainFilterNode.frequency.setValueAtTime(800, now);
            this.mainFilterNode.Q.setValueAtTime(12.0, now); // Sharp Q factor isolates surrounding hiss frequencies
        } else {
            // Standard wideband listening spectrum for carrier wave tracking
            this.mainFilterNode.frequency.setValueAtTime(1400, now);
            this.mainFilterNode.Q.setValueAtTime(0.6, now);  // Low Q allows raw noise frequencies to pass through
        }
    }
}
