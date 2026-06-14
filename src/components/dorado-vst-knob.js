/**
 * Dorado Mainframe VST Allocation Control Module with Live Status Monitoring
 * Designed for Revolutionary-Technology-Company/Univac_Sperry_KVM_GUI
 * Coordinates with Univac-Aegis-bridge to alter MIPS and monitor real-time transaction states.
 */

export class DoradoVstKnob extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        
        // Configuration parameters
        this.minMips = 10;
        this.maxMips = 1200;
        this.currentMips = 10;
        this.isDragging = false;
        this.startY = 0;
        this.startMips = 10;
        
        // Real-time polling reference
        this.pollInterval = null;
    }

    connectedCallback() {
        this.render();
        this.setupEventListeners();
        this.startStatusPolling();
    }

    disconnectedCallback() {
        // Prevent memory leaks when the component unmounts from the GUI canvas
        if (this.pollInterval) {
            clearInterval(this.pollInterval);
        }
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: inline-block;
                    background: #111;
                    border: 2px solid rgb(196, 214, 77);
                    border-radius: 8px;
                    padding: 15px;
                    width: 140px;
                    text-align: center;
                    font-family: monospace;
                    user-select: none;
                    box-shadow: 0 4px 10px rgba(0,0,0,0.5);
                }
                .vst-title {
                    font-size: 10px;
                    color: #aaa;
                    text-transform: uppercase;
                    margin-bottom: 12px;
                    letter-spacing: 1px;
                }
                
                /* LED Array Layout */
                .led-matrix {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 15px;
                    padding: 0 5px;
                }
                .led-container {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 4px;
                }
                .led-label {
                    font-size: 8px;
                    color: #888;
                }
                .led {
                    width: 10px;
                    height: 10px;
                    border-radius: 50%;
                    background-color: #222;
                    box-shadow: inset 0 1px 1px rgba(0,0,0,0.8);
                    transition: background-color 0.15s ease, box-shadow 0.15s ease;
                }
                
                /* Specific LED Color States when activated */
                .led-busy.active {
                    background-color: #00ff66;
                    box-shadow: 0 0 8px #00ff66, inset 0 1px 0px rgba(255,255,255,0.5);
                }
                .led-idle.active {
                    background-color: #0099ff;
                    box-shadow: 0 0 8px #0099ff, inset 0 1px 0px rgba(255,255,255,0.5);
                }
                .led-fault.active {
                    background-color: #ff3333;
                    box-shadow: 0 0 8px #ff3333, inset 0 1px 0px rgba(255,255,255,0.5);
                }

                .knob-container {
                    position: relative;
                    width: 80px;
                    height: 80px;
                    margin: 0 auto;
                    cursor: ns-resize;
                }
                .knob-dial {
                    width: 100%;
                    height: 100%;
                    border-radius: 50%;
                    background: radial-gradient(circle, #333 40%, #222 70%);
                    border: 4px solid #444;
                    position: relative;
                    transform: rotate(-135deg);
                    transition: transform 0.05s linear;
                }
                .knob-marker {
                    position: absolute;
                    top: 5px;
                    left: 50%;
                    width: 4px;
                    height: 15px;
                    background-color: rgb(196, 214, 77);
                    transform: translateX(-50%);
                    border-radius: 2px;
                }
                .vst-display {
                    margin-top: 12px;
                    background: #000;
                    border: 1px solid #333;
                    border-radius: 4px;
                    padding: 4px;
                    font-size: 14px;
                    color: rgb(196, 214, 77);
                    font-weight: bold;
                }
                .vst-unit {
                    font-size: 9px;
                    color: #666;
                    margin-top: 2px;
                }
            </style>
            
            <div class="vst-title">Dorado Control</div>
            
            <!-- Read-Only Telemetry Monitor Matrix -->
            <div class="led-matrix">
                <div class="led-container">
                    <div class="led led-busy" id="ledBusy"></div>
                    <div class="led-label">BUSY</div>
                </div>
                <div class="led-container">
                    <div class="led led-idle" id="ledIdle"></div>
                    <div class="led-label">IDLE</div>
                </div>
                <div class="led-container">
                    <div class="led led-fault" id="ledFault"></div>
                    <div class="led-label">FLT</div>
                </div>
            </div>

            <div class="knob-container" id="knobContainer">
                <div class="knob-dial" id="knobDial">
                    <div class="knob-marker"></div>
                </div>
            </div>
            <div class="vst-display" id="displayVal">0010</div>
            <div class="vst-unit">OS 2200 ALLOC</div>
        `;
    }

    setupEventListeners() {
        const container = this.shadowRoot.getElementById('knobContainer');
        
        container.addEventListener('mousedown', (e) => this.startInteraction(e.clientY));
        window.addEventListener('mousemove', (e) => this.handleInteraction(e.clientY));
        window.addEventListener('mouseup', () => this.stopInteraction());

        container.addEventListener('touchstart', (e) => {
            this.startInteraction(e.touches.clientY);
            e.preventDefault();
        }, { passive: false });
        window.addEventListener('touchmove', (e) => {
            this.handleInteraction(e.touches.clientY);
        }, { passive: false });
        window.addEventListener('touchend', () => this.stopInteraction());
    }

    startInteraction(clientY) {
        this.isDragging = true;
        this.startY = clientY;
        this.startMips = this.currentMips;
    }

    handleInteraction(clientY) {
        if (!this.isDragging) return;

        const deltaY = this.startY - clientY;
        const sensitivity = 2.5;
        let calculatedMips = Math.round(this.startMips + (deltaY * sensitivity));

        calculatedMips = Math.max(this.minMips, Math.min(this.maxMips, calculatedMips));
        
        if (calculatedMips !== this.currentMips) {
            this.currentMips = calculatedMips;
            this.updateUi();
            this.dispatchDmaWrite();
        }
    }

    stopInteraction() {
        if (this.isDragging) {
            this.isDragging = false;
            this.commitConfigSync();
        }
    }

    updateUi() {
        const dial = this.shadowRoot.getElementById('knobDial');
        const display = this.shadowRoot.getElementById('displayVal');

        const percent = (this.currentMips - this.minMips) / (this.maxMips - this.minMips);
        const rotation = (percent * 270) - 135;
        
        dial.style.transform = `rotate(${rotation}deg)`;
        display.textContent = String(this.currentMips).padStart(4, '0');
    }

    /**
     * Periodically queries the KVM telemetry bridge for transaction execution metrics
     */
    startStatusPolling() {
        // Poll every 350ms to match high-frequency mainframe bus monitoring
        this.pollInterval = setInterval(async () => {
            try {
                const response = await fetch('http://localhost:8081/api/bridge/status');
                if (!response.ok) throw new Error('Bridge degradation detected');
                
                const data = await response.json();
                this.updateLeds(data.state); // Expects payload structure: { state: 'BUSY' | 'IDLE' | 'FAULT' }
            } catch (err) {
                // If communication with the local bridge fails, drop to Fault mode
                this.updateLeds('FAULT');
            }
        }, 350);
    }

    /**
     * Evaluates backend processing parameters and updates visual indicators
     * @param {string} state - The system processing token
     */
    updateLeds(state) {
        const busyLed = this.shadowRoot.getElementById('ledBusy');
        const idleLed = this.shadowRoot.getElementById('ledIdle');
        const faultLed = this.shadowRoot.getElementById('ledFault');

        // Reset tracking visibility
        busyLed.classList.remove('active');
        idleLed.classList.remove('active');
        faultLed.classList.remove('active');

        // Evaluate raw token state
        switch (String(state).toUpperCase()) {
            case 'BUSY':
            case 'PROCESSING':
            case 'TRANSACTING':
                busyLed.classList.add('active');
                break;
            case 'IDLE':
            case 'WAITING':
            case 'STABLE':
                idleLed.classList.add('active');
                break;
            case 'FAULT':
            case 'ERROR':
            case 'TIMEOUT':
            default:
                faultLed.classList.add('active');
                break;
}
}
async dispatchDmaWrite() {
try {
await fetch('http://localhost:8081/api/bridge/write', {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({
reg: "DORADO_MIPS_REG",
val: this.currentMips
})
});
} catch (err) {
console.debug('Bridge DMA sink unreached:', err);
}
}
async commitConfigSync() {
this.dispatchEvent(new CustomEvent('dorado-mips-sync', {
detail: { mips: this.currentMips },
bubbles: true,
composed: true
}));
}
}
customElements.define('dorado-vst-knob', DoradoVstKnob);
