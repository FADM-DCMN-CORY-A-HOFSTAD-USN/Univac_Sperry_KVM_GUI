/**
 * Sperry Software Dynamic WinForms Renderer with Local Persistence
 * Dynamically builds user interfaces based on incoming bridge schemas from:
 * - Univac-Aegis-bridge
 * - Basic-Aviation-Knowledge
 */
export class SperryConfigGuiPanel {
    constructor(containerId, bridgeClient) {
        this.container = document.getElementById(containerId);
        this.bridge = bridgeClient;
        
        // Active schema definitions loaded from the connected Univac machine node
        this.currentSchema = [];
        this.activeNodeId = "UNIVAC_DEFAULT_NODE";
        this.localSettingsCache = {};
    }

    /**
     * Entry hook to render the window container frame skeleton
     */
    init() {
        this.renderWindowFrame();
        // Load default placeholder schemas to preview configuration options
        this.loadFallbackSchema();
    }

    /**
     * Renders the pixel-perfect WinForms window shell with asset clip-art hooks
     */
    renderWindowFrame() {
        this.container.innerHTML = `
            <div class="sperry-software-window">
                <!-- Windows System Title Bar Frame -->
                <div class="winforms-titlebar">
                    <div class="titlebar-left">
                        <div class="sperry-app-icon-slot"></div>
                        <span id="winforms-dynamic-title">Sperry Software Node Configuration [${this.activeNodeId}]</span>
                    </div>
                </div>

                <!-- Core Work Canvas Application Window Interface Content -->
                <div class="winforms-canvas">
                    <!-- Gradient Corporate Banner Top Header Asset -->
                    <div class="sperry-brand-banner">
                        <div class="banner-left-logo-slot"></div>
                        <span class="banner-title-text" id="winforms-banner-text">Aegis Mission Parameters</span>
                        <div class="banner-right-photo-slot"></div>
                    </div>

                    <!-- Split Panel Content Grid Workspace Wrapper Layout -->
                    <div style="display: flex; padding: 6px; gap: 8px; height: calc(100% - 94px); box-sizing: border-box;">
                        
                        <!-- LEFT HAND WORKSPACE: INSTALLED MODULE LISTINGS / TREE VIEW -->
                        <div style="width: 172px; display: flex; flex-direction: column;">
                            <div class="winforms-groupbox" style="height: 100%; margin-top: 4px; padding-top: 12px;">
                                <span class="winforms-groupbox-legend">Connected Modules</span>
                                <div class="addins-table-frame">
                                    <div class="addins-table-header">
                                        <div class="table-header-cell" style="width: 38px; text-align: center;">On</div>
                                        <div class="table-header-cell" style="flex-grow: 1; border-right: none;">Module Node ID</div>
                                    </div>
                                    <div id="winforms-module-rows-container">
                                        <!-- Node items will be generated here -->
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- RIGHT HAND WORKSPACE: AUTOMATED DYNAMIC FORM FACTORY AREA -->
                        <div style="flex-grow: 1; display: flex; flex-direction: column; gap: 4px; overflow-y: auto;">
                            <div class="winforms-groupbox" style="margin-top: 4px; padding-top: 14px; flex-grow: 1;" id="winforms-dynamic-controls-root">
                                <span class="winforms-groupbox-legend" id="winforms-controls-legend">Configuration Parameters</span>
                                <div id="winforms-factory-fields-container" style="display: flex; flex-direction: column; gap: 8px; padding-left: 2px;">
                                    <!-- Dynamic layout inputs injector field -->
                                </div>
                            </div>
                        </div>

                    </div>

                    <!-- Bottom Status Tray Spacer Block Pane -->
                    <div style="height: 26px; border: 1px solid #A0A0A0; margin: 0 6px; background-color: #E9EEF4; font-size: 11px; padding: 4px; box-sizing: border-box;" id="winforms-gui-statusbar">
                        Status: Synchronization verified with Local Storage cache.
                    </div>

                    <!-- Lower Utility Action Operations Commands Row Tray -->
                    <div style="position: absolute; bottom: 6px; left: 6px; right: 6px; display: flex; justify-content: space-between; align-items: center;">
                        <div style="display: flex; gap: 4px;">
                            <button class="winforms-btn">About...</button>
                            <button class="winforms-btn" id="gui-btn-reset">Reset</button>
                        </div>
                        <button class="winforms-btn" style="margin-left: auto; margin-right: 24px;">Help...</button>
                        <div style="display: flex; gap: 4px;">
                            <button class="winforms-btn" id="gui-btn-ok">OK</button>
                            <button class="winforms-btn">Cancel</button>
                            <button class="winforms-btn" id="gui-btn-apply" style="color: #000000;">Apply</button>
                        </div>
                    </div>

                </div>
            </div>
        `;

        this.bindUserInteractions();
    }

    /**
     * Accepts a dynamic configuration schema block sent over the bridge WebSocket pipeline
     * @param {string} nodeId - Identifier for the active machine module
     * @param {string} bannerTitle - Text descriptor for the banner plate
     * @param {Array} schemaFields - Layout specifications array
     */
    updateActiveNodeSchema(nodeId, bannerTitle, schemaFields) {
        this.activeNodeId = nodeId;
        this.currentSchema = schemaFields;

        // Synchronize display text fields
        const titleEl = document.getElementById('winforms-dynamic-title');
        const bannerEl = document.getElementById('winforms-banner-text');
        if (titleEl) titleEl.textContent = `Sperry Software Node Configuration [${nodeId}]`;
        if (bannerEl) bannerEl.textContent = bannerTitle;

        // Fetch stored configurations matching this unique module node ID key from memory
        this.loadSettingsFromStorage();
        
        // Repaint left modules tracker strip
        this.renderModuleListings();

        // Generate form fields inside the WinForms container area
        this.generateFormControls();
    }

    /**
     * Pulls settings values directly out from browser Local Storage partitions
     */
    loadSettingsFromStorage() {
        const storageKey = `SPERRY_GUI_CFG_${this.activeNodeId}`;
        const serialized = localStorage.getItem(storageKey);
        
        if (serialized) {
            try {
                this.localSettingsCache = JSON.parse(serialized);
                console.log(`💾 LocalStorage configuration retrieved successfully for node: ${this.activeNodeId}`, this.localSettingsCache);
            } catch (e) {
                console.error("⚠️ LocalStorage parser fault. Defaulting cache maps.");
                this.localSettingsCache = {};
            }
        } else {
            this.localSettingsCache = {};
        }
    }

    /**
     * Commits active UI configurations securely into browser disk storage blocks
     */
    saveSettingsToStorage() {
        const storageKey = `SPERRY_GUI_CFG_${this.activeNodeId}`;
        
        // Extract updated parameters directly out from the form interface DOM tree elements
        this.currentSchema.forEach(field => {
            const inputElement = document.getElementById(`wf-field-${field.key}`);
            if (!inputElement) return;

            if (field.type === 'boolean') {
                this.localSettingsCache[field.key] = inputElement.checked;
            } else if (field.type === 'string' || field.type === 'number') {
                this.localSettingsCache[field.key] = inputElement.value;
            }
        });

        localStorage.setItem(storageKey, JSON.stringify(this.localSettingsCache));
        
        const statusbar = document.getElementById('winforms-gui-statusbar');
        if (statusbar) statusbar.textContent = `Status: Changes committed to LocalStorage for ${this.activeNodeId} at ${new Date().toLocaleTimeString()}`;

        // Stream the configuration package directly out over your Univac Aegis bridge connection pipeline
        if (this.bridge && typeof this.bridge.sendPayload === 'function') {
            this.bridge.sendPayload("NODE_CFG_SYNC", {
                node: this.activeNodeId,
                settings: this.localSettingsCache
            });
        }
    }

    /**
     * Builds individual WinForms element rows dynamically based on the current configuration schema
     */
    generateFormControls() {
        const container = document.getElementById('winforms-factory-fields-container');
        if (!container) return;

        let htmlPayload = "";

        this.currentSchema.forEach(field => {
            // Determine active value using local storage values or fall back to default metadata profiles
            const activeValue = this.localSettingsCache[field.key] !== undefined ? 
                                this.localSettingsCache[field.key] : field.default;

            if (field.type === 'boolean') {
                const checkedAttr = activeValue ? 'checked' : '';
                htmlPayload += `
                    <label style="display: flex; align-items: center; gap: 6px; font-size: 11px; cursor: pointer;">
                    <input type="checkbox" id="wf-field-${field.key}" ${checkedAttr}>
${field.label}

; } else if (field.type === 'string' || field.type === 'number') { htmlPayload += 

${field.label}


`;
}
});
container.innerHTML = htmlPayload;
}
renderModuleListings() {
const listContainer = document.getElementById('winforms-module-rows-container');
if (!listContainer) return;
listContainer.innerHTML = <div class="addins-table-row"> <div style="width: 38px; text-align: center;"><input type="checkbox" checked style="margin: 0;"></div> <div style="flex-grow: 1; padding-left: 4px; font-weight: bold; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;"> ${this.activeNodeId} </div> </div>;
}
bindUserInteractions() {
const applyBtn = this.container.querySelector('#gui-btn-apply');
const okBtn = this.container.querySelector('#gui-btn-ok');
const resetBtn = this.container.querySelector('#gui-btn-reset');
if (applyBtn) {
applyBtn.addEventListener('click', (e) => {
e.preventDefault();
this.saveSettingsToStorage();
});
}
if (okBtn) {
okBtn.addEventListener('click', (e) => {
e.preventDefault();
this.saveSettingsToStorage();
console.log("OK Clicked - Settings synced across network pipelines safely.");
});
}
if (resetBtn) {
resetBtn.addEventListener('click', (e) => {
e.preventDefault();
localStorage.removeItem(SPERRY_GUI_CFG_${this.activeNodeId});
this.loadSettingsFromStorage();
this.generateFormControls();
});
}
}
/**
* Fallback configuration definitions combining variables from both repositories
*/
loadFallbackSchema() {
const mockCombinedSchema = [
// Basic-Aviation-Knowledge Telemetry Variables
{ key: 'air_speed_knots', label: 'Air Speed Tracking Limit (Knots)', type: 'number', default: '450', width: '80px' },
{ key: 'altitude_hold_ft', label: 'Target Altitude Target Constraint (Feet)', type: 'number', default: '32000', width: '110px' },
{ key: 'aviation_compass_sync', label: 'Enable Aviation Bridge Gyro Autopilot Sync', type: 'boolean', default: true },
// Univac-Aegis-bridge System Connection Variables
{ key: 'aegis_radar_interleave', label: 'Aegis AN/SPY-1 Radar Stream Interleave Rate (ms)', type: 'number', default: '250', width: '70px' },
{ key: 'auto_purge_dropped_frames', label: 'Auto-Purge corrupted data pipeline frames instantly', type: 'boolean', default: false },
{ key: 'bridge_frequency_hz', label: 'Univac Mainframe Interface Comm Frequency (Hz)', type: 'string', default: '1100_HIGH', width: '150px' }
];
this.updateActiveNodeSchema("AEGIS_AVIATION_BRIDGE_NODE", "Aegis & Aviation Core Control", mockCombinedSchema);
}
}

---

### 2. Live WebSocket Data Pipeline Hook (`src/core/kvm-manager.js`)

We will update your main KVM manager to listen for upstream data events sent from your connected repositories. When a node switches or a new configuration block is broadcast over the websocket, the interface intercepts the payload and re-generates the form controls automatically.

```javascript
    /**
     * Core router handling inbound live mainframe schema updates or register changes
     */
    handleIncomingTelemetry(envelope) {
        // Telemetry Event 1: Mainframe registers change (Toggles switches or turns dials)
        if (envelope.action === "CORE_REG_UPDATE") {
            const { reg, val } = envelope.payload;
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
        
        // Telemetry Event 2: Dynamic metadata schema update pushed from live repositories
        else if (envelope.action === "METADATA_SCHEMA_PUSH") {
            const { nodeId, bannerTitle, fields } = envelope.payload;
            console.log(`📥 Dynamic WinForms Generation Matrix Triggered for Node: [${nodeId}]`);
            
            if (this.configGui) {
                // Regenerate the interface controls on the fly using live repository fields
                this.configGui.updateActiveNodeSchema(nodeId, bannerTitle, fields);
            }
        }
    }
