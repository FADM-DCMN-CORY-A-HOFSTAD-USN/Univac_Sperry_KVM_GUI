/**
 * SPERRY UNIVAC KVM CONSOLE CORE MANAGER
 * Coordinates viewports, network pipelines, skeuomorphic assets, and touch routing.
 */
import { SperryTuiScreen } from '../components/tui-screen.js';
import { SperryConfigGuiPanel } from '../modules/config-panel.js';
import { RadioAmps1400Panel } from '../modules/radio-amps-1400.js'; 
import { System110080Panel } from '../modules/system-1100-80.js';
import { Scr610TransceiverPanel } from '../modules/scr610-transceiver.js'; // Mount SCR-610 Module
import { UnivacBridgeClient } from './bridge-client.js'; 
import { MainframeTelemetryMock } from './telemetry-mock.js';

export class UnivacKvmManager {
    constructor() {
        // Strict ordered sequential loop for one-way input navigation
        this.modes = ['TUI', 'GUI', 'PANEL'];
        this.currentModeIndex = 0;

        // Sub-interface controller allocations
        this.tuiScreen = null;
        this.configGui = null;
        this.hardwarePanel = null;
        
        // Network pipeline links
        this.bridge = new UnivacBridgeClient();
        this.simulator = null; 
    }

    /**
     * Entry hook: bootstraps components, hooks network states, and maps inputs.
     */
    init() {
        // 1. Establish pipeline connection with the Univac-Aegis-bridge
        this.bridge.connect();

        // 2. Instantiate and mount UI engines into their respective container nodes
        this.tuiScreen = new SperryTuiScreen('tui-matrix-container', this.bridge);
        this.configGui = new SperryConfigGuiPanel('viewport-gui', this.bridge);
        this.hardwarePanel = new System110080Panel('viewport-panel', this.bridge);

        this.configGui.init();
        this.hardwarePanel.init();
        
        // Bind logging channels across views
        window.addEventListener('radio-telemetry-log', (e) => {
            if (this.configGui) {
                this.configGui.appendTelemetryLog("RADIO_ROOM", `Transmitter array write operation: [${e.detail.param}] configured to value index state [${e.detail.value}]`);
            }
        });

        this.bindNavigationTargets();
        this.bindSimulationButtons();
        this.registerKeyboardShortcuts();
        this.updateViewportState();

        // 3. Bind WebSocket network state alerts directly to the non-scrolling TUI status row 25
        this.bridge.registerStatusListener((status) => {
            if (!this.tuiScreen) return;
            switch(status) {
                case 'ONLINE / LINKED':
                    this.tuiScreen.keyboardLocked = false;
                    this.tuiScreen.writeStatusLine("SYSTEM READY - SPERRY UNIVAC 1100 INTERFACE", 'NORMAL');
                    break;
                case 'CONNECTING...':
                    this.tuiScreen.keyboardLocked = true; 
                    this.tuiScreen.writeStatusLine("RETRY / WAIT - ACQUIRING LINK ROUTE TO BRIDGE NETWORK...", 'WARN');
                    break;
                case 'OFFLINE - RETRYING':
                    this.tuiScreen.keyboardLocked = true;
                    this.tuiScreen.writeStatusLine("LINE ERR - LINK LOST WITH UNIVAC-AEGIS-BRIDGE. RETRYING...", 'CRIT');
                    break;
            }
            this.tuiScreen.render();
        });

        // 4. Initialize and boot the error simulation test bench for standalone testing
        this.simulator = new MainframeTelemetryMock(this.bridge, this.tuiScreen);
        this.simulator.start();

        // 5. Populate initial baseline form templates onto the screen grid buffer
        this.tuiScreen.defineField(2, 5, "SPERRY UNIVAC 1100/80 MAIN KVM BRIDGE CONSOLE");
        this.tuiScreen.defineField(4, 5, "INPUT ADDRESS NODE:  ");
        this.tuiScreen.defineField(4, 26, "        ", "input");
        this.tuiScreen.render();

        // 6. Register touch interactions, dashboard triggers, and system keyboard macros
        this.bindNavigationTargets();
        this.bindSimulationButtons();
        this.registerKeyboardShortcuts();
        
        // Synchronize display layout frames to initial default (TUI Mode)
        this.updateViewportState();

        // 7. Subscribe to real-time telemetry frames coming back upstream from your mainframe nodes
        this.bridge.registerMessageListener((msg) => this.handleIncomingTelemetry(msg));
    }

    /**
     * Attaches handlers to tabs and the high-contrast crimson input cycle button.
     */
    bindNavigationTargets() {
        // Standard Tab navigation strips optimized for larger human-finger footprints
        document.querySelectorAll('.touch-tab').forEach(tab => {
            tab.addEventListener('touchstart', (e) => {
                e.preventDefault();
                const targetMode = tab.getAttribute('data-mode');
                this.currentModeIndex = this.modes.indexOf(targetMode);
                this.updateViewportState();
            }, { passive: false });
        });

        // Map interactions to the White-on-Crimson (#D1172B) KVM Cycle button
        const bigRedBtn = document.getElementById('kvm-big-red-cycle');
        if (bigRedBtn) {
            bigRedBtn.addEventListener('touchstart', (e) => {
                e.preventDefault();
                this.cycleNextInput();
            }, { passive: false });
            
            // Desktop mouse fallback execution environment click binding
            bigRedBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.cycleNextInput();
            });
        }
    }

    /**
     * Binds the local testing dashboard overlays to inject network faults on demand.
     */
    bindSimulationButtons() {
        const btnStable = document.getElementById('bench-stable');
        const btnUnstable = document.getElementById('bench-unstable');
        const btnDead = document.getElementById('bench-dead');
        
        if (!btnStable || !btnUnstable || !btnDead) return;

        const allBtns = [btnStable, btnUnstable, btnDead];
        const setVisualActive = (target) => {
            allBtns.forEach(b => b.classList.remove('active'));
            target.classList.add('active');
        };

        btnStable.addEventListener('click', () => {
            setVisualActive(btnStable);
            this.simulator.setNetworkProfile('STABLE');
        });

        btnUnstable.addEventListener('click', () => {
            setVisualActive(btnUnstable);
            this.simulator.setNetworkProfile('UNSTABLE');
        });

        btnDead.addEventListener('click', () => {
            setVisualActive(btnDead);
            this.simulator.setNetworkProfile('DEAD');
        });
    }

    /**
     * Intercepts keystroke macros to handle KVM navigation loops natively.
     */
    registerKeyboardShortcuts() {
        window.addEventListener('keydown', (e) => {
            // Listen for explicit Ctrl + N macro combinations
            if (e.ctrlKey && e.key.toLowerCase() === 'n') {
                e.preventDefault(); // Stop native browser window execution actions
                this.cycleNextInput();
            }
        });
    }

    /**
     * Advances the active viewport index forward by one step along a closed loop sequence.
     */
    cycleNextInput() {
        this.currentModeIndex = (this.currentModeIndex + 1) % this.modes.length;
        this.updateViewportState();
    }

    /**
     * Swaps display frameworks by managing CSS animation utility viewport classes.
     */
    updateViewportState() {
        const activeMode = this.modes[this.currentModeIndex];
        
        // Push telemetry state events immediately out over the active WebSocket channel
        this.bridge.sendKvmCycleEvent(this.currentModeIndex, activeMode);

        // Hide inactive layers and reveal target viewport panel canvas
        document.querySelectorAll('.kvm-screen-pane').forEach(pane => {
            pane.classList.remove('active');
        });
        document.getElementById(`viewport-${activeMode.toLowerCase()}`).classList.add('active');

        // Maintain highlighted states across the top navigation tab ribbons
        document.querySelectorAll('.touch-tab').forEach(tab => {
            if (tab.getAttribute('data-mode') === activeMode) {
                tab.classList.add('active');
            } else {
                tab.classList.remove('active');
            }
        });

        // Trigger individual UI canvas repaints if a terminal window takes focus
        if (activeMode === 'TUI' && this.tuiScreen) {
            this.tuiScreen.render();
        }
    }

    /**
     * Core router handling inbound live mainframe schema updates or register changes
     */
    handleIncomingTelemetry(envelope) {
        // Telemetry Intercept Route 1: Flight vector streams arriving from Basic-Aviation-Knowledge datasets
        if (envelope.action === "AVIATION_COMPASS_STREAM") {
            const { heading, pitch, roll, gyro_error } = envelope.payload;
            
            if (this.configGui && typeof this.configGui.updateCompassTelemetryTrack === 'function') {
                // Pipe navigation data fields straight onto the WinForms configuration dashboard view
                this.configGui.updateCompassTelemetryTrack(heading, pitch, roll, gyro_error);
            }
        }
        
        // Telemetry Intercept Route 2: Standard core register changes
        else if (envelope.action === "CORE_REG_UPDATE") {
            const { reg, val } = envelope.payload;
            console.log(`📥 Downstream Sync Receiver -> Register [${reg}] updated to [${val}]`);
            
            // Push structured text diagnostic parameters directly onto our WinForms logging console
            if (this.configGui && typeof this.configGui.appendTelemetryLog === 'function') {
                const sourceTag = reg.startsWith('Z4_CH') ? 'AVIATION' : 'AEGIS';
                this.configGui.appendTelemetryLog(sourceTag, `Transaction accepted. Register allocation address write: [${reg}] mapped to value states [${val}]`);
            }

            if (this.hardwarePanel && this.hardwarePanel.controls[reg]) {
                const controlItem = this.hardwarePanel.controls[reg];
                if (typeof controlItem.updateHardwareState === 'function') {
                    controlItem.currentStep = val;
                    controlItem.updateHardwareState();
                } else if (typeof controlItem.toggleState === 'function' && controlItem.state !== val) {
                    controlItem.toggleState();
                }
            }
        }

        // Telemetry Event 3: Dynamic metadata schema updates pushed from live repositories
        else if (envelope.action === "METADATA_SCHEMA_PUSH") {
            const { nodeId, bannerTitle, fields } = envelope.payload;
            if (this.configGui) {
                this.configGui.updateActiveNodeSchema(nodeId, bannerTitle, fields);
            }
        }
    }
}

// Automatically instantiate the application instance upon DOM assembly completion
window.addEventListener('DOMContentLoaded', () => {
    new UnivacKvmManager().init();
});
