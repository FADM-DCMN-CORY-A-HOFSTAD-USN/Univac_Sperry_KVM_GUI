/**
 * Dorado Mainframe VST Firewall Interface Module
 * Core Integration: Univac-Aegis-bridge (csf_defense_node.py) & ConfigServer-Security-Firewall-CSF
 * Maps real-time MIPS throttling mechanics to active network defense policies.
 */

export class DoradoVstKnob extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        
        // Match live architecture criteria
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
        this.startDefenseNodePolling();
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
                
                .telemetry-bay {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 15px;
                    background: #070707;
                    border: 1px solid #222;
                    border-radius: 4px;
                    padding: 6px;
                }

                .led-matrix {
                    display: flex;
                    gap: 6px;
                }
                .led-container {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 2px;
                }
                .led-label {
                    font-size: 7px;
                    color: #666;
                }
                .led {
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    background-color: #222;
                    box-shadow: inset 0 1px 1px rgba(0,0,0,0.8);
                    transition: background-color 0.15s ease, box-shadow 0.15s ease;
                }
                /* CSF Firewall Protected State Color Matrix */
                .led-busy.active {
                    background-color: #00ff66; /* Safe / Active Filtering */
                    box-shadow: 0 0 6px #00ff66, inset 0 1px 0px rgba(255,255,255,0.5);
                }
                .led-idle.active {
                    background-color: #ffaa00; /* Mitigating Threat Burst / Throttled */
                    box-shadow: 0 0 6px #ffaa00, inset 0 1px 0px rgba(255,255,255,0.5);
                }
                .led-fault.active {
                    background-color: #ff3333; /* Node Unreachable / Threat Compromise */
                    box-shadow: 0 0 6px #ff3333, inset 0 1px 0px rgba(255,255,255,0.5);
                }

                .tps-counter-container {
                    display: flex;
                    flex-direction: column;
                    align-items: flex-end;
                }
                .tps-display {
                    background: #000;
                    border: 1px solid #333;
                    border-radius: 2px;
                    padding: 2px 4px;
                    font-size: 11px;
                    color: #ff9900; 
                    font-weight: bold;
                    letter-spacing: 1px;
                    min-width: 32px;
                    text-align: right;
                }
                .tps-label {
                    font-size: 7px;
                    color: #666;
                    margin-top: 2px;
                    text-transform: uppercase;
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
            
            <div class="vst-title">CSF Firewall</div>
            
            <div class="telemetry-bay">
                <div class="led-matrix">
                    <div class="led-container">
                        <div class="led led-busy" id="ledBusy"></div>
                        <div class="led-label">PASS</div>
                    </div>
                    <div class="led-container">
                        <div class="led led-idle" id="ledIdle"></div>
                        <div class="led-label">MITG</div>
                    </div>
                    <div class="led-container">
                        <div class="led led-fault" id="ledFault"></div>
                        <div class="led-label">ERR</div>
                    </div>
                </div>

                <div class="tps-counter-container">
                    <div class="tps-display" id="tpsVal">0000</div>
                    <div class="tps-label">Blocked</div>
                </div>
            </div>

            <div class="knob-container" id="knobContainer">
                <div class="knob-dial" id="knobDial">
                    <div class="knob-marker"></div>
                </div>
            </div>
            <div class="vst-display" id="displayVal">0010</div>
            <div class="vst-unit">MIPS CAPACITY</div>
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
            this.dispatchCsfPolicyUpdate(); // Sync update thresholds immediately on layout change
        }
    }

    stopInteraction() {
        if (this.isDragging) {
            this.isDragging = false;
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
     * Polls the live python csf_defense_node endpoint to extract telemetry and firewall engine states
     */
    startDefenseNodePolling() {
        this.pollInterval = setInterval(async () => {
            try {
                // Route targeting the specific network layer node path from Univac-Aegis-bridge
                const response = await fetch('http://localhost:8081/api/csf/defense/status');
                if (!response.ok) throw new Error('Node Offline');
                
                const data = await response.json();
                // Maps variables: data.status ('PASS', 'MITIGATING', 'ERROR') & data.blocked_count
this.updateStatusLedMatrix(data.status);
this.updateBlockedCounter(data.blocked_count || 0);
} catch (err) {
this.updateStatusLedMatrix('ERROR');
this.updateBlockedCounter(0);
}
}, 400);
} [1]
updateStatusLedMatrix(status) {
const passLed = this.shadowRoot.getElementById('ledBusy');
const mitgLed = this.shadowRoot.getElementById('ledIdle');
const errLed = this.shadowRoot.getElementById('ledFault');
passLed.classList.remove('active');
mitgLed.classList.remove('active');
errLed.classList.remove('active');
switch (String(status).toUpperCase()) {
case 'PASS':
case 'SECURE':
passLed.classList.add('active');
break;
case 'MITG':
case 'MITIGATING':
case 'THROTTLED':
mitgLed.classList.add('active');
break;
case 'ERROR':
case 'CRITICAL':
default:
errLed.classList.add('active');
break;
}
} [1]
updateBlockedCounter(count) {
const counterDisplay = this.shadowRoot.getElementById('tpsVal');
const boundedCount = Math.min(9999, Math.max(0, Math.round(count)));
counterDisplay.textContent = String(boundedCount).padStart(4, '0');
}
/**
* Sends the operational constraints directly to the csf_defense_node pipeline
*/
async dispatchCsfPolicyUpdate() {
try {
await fetch('http://localhost:8081/api/csf/defense/policy', {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({
origin: "UNIVAC_DORADO_VST",
allocated_mips: this.currentMips,
policy_action: this.currentMips < 200 ? "ENFORCE_RATE_LIMIT" : "MONITOR_FLOW"
})
});
} catch (err) {
console.debug('Failed to route policy modification parameters to csf_defense_node:', err);
}
}
}
