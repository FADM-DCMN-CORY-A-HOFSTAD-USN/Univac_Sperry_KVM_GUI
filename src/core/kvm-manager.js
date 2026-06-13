import { SperryTuiScreen } from '../components/tui-screen.js';
import { SperryConfigGuiPanel } from '../modules/config-panel.js';
import { System110080Panel } from '../modules/system-1100-80.js';
import { UnivacBridgeClient } from './bridge-client.js'; // Import real pipeline

export class UnivacKvmManager {
    constructor() {
        this.modes = ['TUI', 'GUI', 'PANEL'];
        this.currentModeIndex = 0;

        this.tuiScreen = null;
        this.configGui = null;
        this.hardwarePanel = null;

        // Instantiate real WebSocket pipeline (Points to window host address dynamically)
        this.bridge = new UnivacBridgeClient();
    }

    init() {
        // Connect WebSocket client to the bridge network interface
        this.bridge.connect();

        // Bind system connection status messages directly into the non-scrolling row-25 status line
        this.bridge.registerStatusListener((status) => {
            if (this.tuiScreen) {
                this.tuiScreen.writeStatusLine(`AEGIS BRIDGE STATUS: ${status}`);
                this.tuiScreen.render();
            }
        });

        // Initialize component UI layout panels passing the real network client down
        this.tuiScreen = new SperryTuiScreen('tui-matrix-container', this.bridge);
        this.configGui = new SperryConfigGuiPanel('viewport-gui', this.bridge);
        this.hardwarePanel = new System110080Panel('viewport-panel', this.bridge);

        this.configGui.init();
        this.hardwarePanel.init();
        
        // Setup base layout text grids
        this.tuiScreen.defineField(2, 5, "SPERRY UNIVAC 1100/80 MAIN KVM BRIDGE CONSOLE");
        this.tuiScreen.defineField(4, 5, "INPUT ADDRESS NODE:  ");
        this.tuiScreen.defineField(4, 26, "        ", "input");
        this.tuiScreen.render();

        this.bindNavigationTargets();
        this.registerKeyboardShortcuts();
        this.updateViewportState();

        // Listen for hardware telemetry states pushed over the network back from your mainframe
        this.bridge.registerMessageListener((msg) => this.handleIncomingTelemetry(msg));
    }

    bindNavigationTargets() {
        document.querySelectorAll('.touch-tab').forEach(tab => {
            tab.addEventListener('touchstart', (e) => {
                e.preventDefault();
                this.currentModeIndex = this.modes.indexOf(tab.getAttribute('data-mode'));
                this.updateViewportState();
            }, { passive: false });
        });

        // Hook up our white-on-crimson (#D1172B) button
        const bigRedBtn = document.getElementById('kvm-big-red-cycle');
        if (bigRedBtn) {
            bigRedBtn.addEventListener('touchstart', (e) => {
                e.preventDefault();
                this.cycleNextInput();
            }, { passive: false });
            
            bigRedBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.cycleNextInput();
            });
        }
    }

    registerKeyboardShortcuts() {
        window.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key.toLowerCase() === 'n') {
                e.preventDefault();
                this.cycleNextInput();
            }
        });
    }

    cycleNextInput() {
        this.currentModeIndex = (this.currentModeIndex + 1) % this.modes.length;
        this.updateViewportState();
    }

    updateViewportState() {
        const activeMode = this.modes[this.currentModeIndex];
        
        // Stream the KVM transition telemetry event straight out across the network pipeline
        this.bridge.sendKvmCycleEvent(this.currentModeIndex, activeMode);

        document.querySelectorAll('.kvm-screen-pane').forEach(pane => pane.classList.remove('active'));
        document.getElementById(`viewport-${activeMode.toLowerCase()}`).classList.add('active');

        document.querySelectorAll('.touch-tab').forEach(tab => {
            if (tab.getAttribute('data-mode') === activeMode) {
                tab.classList.add('active');
            } else {
                tab.classList.remove('active');
            }
        });

        if (activeMode === 'TUI' && this.tuiScreen) {
            this.tuiScreen.render();
        }
    }

    /**
     * Handles downstream memory array manipulations sent directly from the mainframes
     */
    handleIncomingTelemetry(envelope) {
        // e.g., if the mainframe modifies registers, flash the hardware panels or print directly to the TUI
        if (envelope.action === "CORE_REG_UPDATE") {
            const { reg, val } = envelope.payload;
            console.log(`📥 Downstream Hardware Sync: Mainframe updated register [${reg}] to [${val}]`);
            // Update individual dial indicators here if required
        }
    }
}

window.addEventListener('DOMContentLoaded', () => {
    new UnivacKvmManager().init();
});
