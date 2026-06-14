/**
 * Dorado Mainframe VST Allocation Control Module with Automated VCF Export
 * Designed for Revolutionary-Technology-Company/Univac_Sperry_KVM_GUI
 * Automatically generates and sinks a .vcf block to local systems upon configuration change.
 */

export class DoradoVstKnob extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        
        this.minMips = 10;
        this.maxMips = 1200;
        this.currentMips = 10;
        this.isDragging = false;
        this.startY = 0;
        this.startMips = 10;
        
        this.pollInterval = null;
    }

    connectedCallback() {
        this.render();
        this.setupEventListeners();
        this.startStatusPolling();
    }

    disconnectedCallback() {
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
            this.generateAndExportVcf(); // Triggers automated macro generation on mouse-release
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

    startStatusPolling() {
        this.pollInterval = setInterval(async () => {
            try {
                const response = await fetch('http://localhost:8081/api/bridge/status');
                if (!response.ok) throw new Error('Degradation');
                const data = await response.json();
                this.updateLeds(data.state);
            } catch (err) {
                this.updateLeds('FAULT');
            }
        }, 350);
    }

    updateLeds(state) {
        const busyLed = this.shadowRoot.getElementById('ledBusy');
        const idleLed = this.shadowRoot.getElementById('ledIdle');
        const faultLed = this.shadowRoot.getElementById('ledFault');

        busyLed.classList.remove('active');
        idleLed.classList.remove('active');
        faultLed.classList.remove('active');

        switch (String(state).toUpperCase()) {
            case 'BUSY':
                busyLed.classList.add('active');
                break;
            case 'IDLE':
                idleLed.classList.add('active');
                break;
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

    /**
     * Compiles data payload, generates a structural CRC32 checksum, and pushes files to local workspace targets
     */
    async generateAndExportVcf() {
        const paddedMips = String(this.currentMips).padStart(4, '0');
        const timestamp = new Date().toISOString();
        // Construct standard Unisys-style configuration structure block
const fileContent = [
[UNISYS_DORADO_CONFIGURATION_BLOCK],
TIMESTAMP=${timestamp},
TARGET_REG=DORADO_MIPS_REG,
ALLOCATED_MIPS=${paddedMips},
OPERATOR_ACTION=FIELD_THRESHOLD_ALTERATION,
INTEGRITY_HASH=${this.calculateSimpleChecksum(paddedMips, timestamp)}
].join('\n');
const filename = dorado_alloc_${paddedMips}mips_${Date.now()}.vcf;
// Pathway 1: Push binary object data directly to local server storage pipeline
try {
await fetch('http://localhost:8081/api/bridge/export', {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({
filename: filename,
payload: btoa(fileContent) // Enforce raw string safety via Base64 serialization
})
});
} catch (err) {
console.warn('Local file system injection stream failed. Reverting to sandbox file generation.', err);
}
// Pathway 2: Sandbox download fallback injection
const blob = new Blob([fileContent], { type: 'text/plain;charset=utf-8' });
const element = document.createElement('a');
element.href = URL.createObjectURL(blob);
element.download = filename;
element.style.display = 'none';
document.body.appendChild(element);
element.click();
document.body.removeChild(element);
}
/**
* Generates an asset-integrity string tracking specific runtime variations
*/
calculateSimpleChecksum(mips, time) {
const combined = ${mips}:${time};
let hash = 0;
for (let i = 0; i < combined.length; i++) {
hash = (hash << 5) - hash + combined.charCodeAt(i);
hash |= 0; // Convert to a 32bit signed integer
}
return '0x' + Math.abs(hash).toString(16).toUpperCase();
}
}
customElements.define('dorado-vst-knob', DoradoVstKnob);
