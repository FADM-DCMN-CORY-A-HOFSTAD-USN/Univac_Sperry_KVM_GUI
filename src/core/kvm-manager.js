import { SperryTuiScreen } from '../components/tui-screen.js';
import { SperryConfigGuiPanel } from '../modules/config-panel.js';
import { System110080Panel } from '../modules/system-1100-80.js';

export class UnivacKvmManager {
    constructor() {
        // Strict Ordered Array for One-Way Input Cycling Sequential Tracking
        this.modes = ['TUI', 'GUI', 'PANEL'];
        this.currentModeIndex = 0;

        // Class Reference Allocations
        this.tuiScreen = null;
        this.configGui = null;
        this.hardwarePanel = null;

        // Bridge Configuration Stubs (Pass your active network bridge instance here)
        this.mockBridge = {
            sendBlockModeBurst: async (p) => { console.log("TUI Block Broadcast", p); return true; },
            writeHardwareAddress: (r, v) => { console.log(`Register Write [${r}]: ${v}`); }
        };
    }

    /**
     * Initializes systems, boots sub-modules, and maps interactive UI elements.
     */
    init() {
        // 1. Boot up the standalone component UI frameworks
        this.tuiScreen = new SperryTuiScreen('tui-matrix-container', this.mockBridge);
        this.configGui = new SperryConfigGuiPanel('viewport-gui', this.mockBridge);
        this.hardwarePanel = new System110080Panel('viewport-panel', this.mockBridge);

        // 2. Render initial static states inside unmounted nodes
        this.configGui.init();
        this.hardwarePanel.init();
        
        // Build an interactive placeholder template within the TUI workspace view
        this.tuiScreen.defineField(2, 5, "SPERRY UNIVAC 1100/80 MAIN KVM BRIDGE CONSOLE");
        this.tuiScreen.defineField(4, 5, "INPUT ADDRESS NODE:  ");
        this.tuiScreen.defineField(4, 26, "        ", "input");
        this.tuiScreen.defineField(6, 5, "AEGIS BRIDGE STATUS: ");
        this.tuiScreen.defineField(6, 26, "ONLINE  ");
        this.tuiScreen.render();

        // 3. Wire up UI touch triggers and global key event hooks
        this.bindNavigationTargets();
        this.registerKeyboardShortcuts();

        // Force initial layout synchronization to default state [0] (TUI Mode)
        this.updateViewportState();
    }

    /**
     * Maps action handlers to tabs, buttons, and custom KVM controls.
     */
    bindNavigationTargets() {
        // Map the structural top navigation tab elements
        document.querySelectorAll('.touch-tab').forEach(tab => {
            tab.addEventListener('touchstart', (e) => {
                e.preventDefault();
                const targetMode = tab.getAttribute('data-mode');
                this.currentModeIndex = this.modes.indexOf(targetMode);
                this.updateViewportState();
            }, { passive: false });
        });

        // Hook up the Big Red Cycle Button
        const bigRedBtn = document.getElementById('kvm-big-red-cycle');
        if (bigRedBtn) {
            bigRedBtn.addEventListener('touchstart', (e) => {
                e.preventDefault();
                this.cycleNextInput();
            }, { passive: false });
            
            // Standard fallback click handler for non-touch system environments
            bigRedBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.cycleNextInput();
            });
        }
    }

    /**
     * Intercepts global keyboard inputs to parse KVM shortcut patterns.
     */
    registerKeyboardShortcuts() {
        window.addEventListener('keydown', (e) => {
            // Check for Ctrl + N macro combinations safely
            if (e.ctrlKey && e.key.toLowerCase() === 'n') {
                e.preventDefault(); // Stop native browser window openings
                this.cycleNextInput();
            }
        });
    }

    /**
     * Advances the active frame pointer forward by one step along a closed loop.
     */
    cycleNextInput() {
        this.currentModeIndex = (this.currentModeIndex + 1) % this.modes.length;
        this.updateViewportState();
    }

    /**
     * Swaps rendering contexts by managing viewport class flags.
     */
    updateViewportState() {
        const activeMode = this.modes[this.currentModeIndex];
        console.log(`🔌 KVM Switching Target Frame -> [${activeMode}]`);

        // Synchronize display layout viewports
        document.querySelectorAll('.kvm-screen-pane').forEach(pane => {
            pane.classList.remove('active');
        });
        
        const targetPaneId = `viewport-${activeMode.toLowerCase()}`;
        document.getElementById(targetPaneId).classList.add('active');

        // Synchronize header navigation tab items
        document.querySelectorAll('.touch-tab').forEach(tab => {
            if (tab.getAttribute('data-mode') === activeMode) {
                tab.classList.add('active');
            } else {
                tab.classList.remove('active');
            }
        });

        // Trigger individual UI repaint events if required
        if (activeMode === 'TUI' && this.tuiScreen) {
            this.tuiScreen.render();
        }
    }
}

// Auto-instantiate and map interface entry hooks into structural components
window.addEventListener('DOMContentLoaded', () => {
    const kvmApp = new UnivacKvmManager();
    kvmApp.init();
});
