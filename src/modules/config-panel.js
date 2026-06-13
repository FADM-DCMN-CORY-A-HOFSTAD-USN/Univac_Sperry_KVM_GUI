/**
 * Sperry Software Dynamic WinForms Renderer with Real-time Telemetry Data Logging
 * Renders automated fields and monitors real-time transactions from Aegis & Aviation repositories.
 */
export class SperryConfigGuiPanel {
    constructor(containerId, bridgeClient) {
        this.container = document.getElementById(containerId);
        this.bridge = bridgeClient;
        
        this.currentSchema = [];
        this.activeNodeId = "UNIVAC_DEFAULT_NODE";
        this.localSettingsCache = {};

        // Telemetry Logging Constants
        this.MAX_LOG_LINES = 100; 
    }

    /**
     * Initializes structural window frames and hooks fallback data
     */
    init() {
        this.renderWindowFrame();
        this.loadFallbackSchema();
    }

    /**
     * Renders pixel-perfect WinForms shell containing the real-time logging viewport
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
                    <div style="display: flex; padding: 6px; gap: 8px; height: calc(100% - 158px); box-sizing: border-box;">
                        
                        <!-- LEFT HAND WORKSPACE: CONNECTED TREE VIEW -->
                        <div style="width: 172px; display: flex; flex-direction: column;">
                            <div class="winforms-groupbox" style="height: 100%; margin-top: 4px; padding-top: 12px;">
                                <span class="winforms-groupbox-legend">Connected Modules</span>
                                <div class="addins-table-frame">
                                    <div class="addins-table-header">
                                        <div class="table-header-cell" style="width: 38px; text-align: center;">On</div>
                                        <div class="table-header-cell" style="flex-grow: 1; border-right: none;">Module Node ID</div>
                                    </div>
                                    <div id="winforms-module-rows-container"></div>
                                </div>
                            </div>
                        </div>

                        <!-- RIGHT HAND WORKSPACE: DYNAMIC CONTROLS FORM FACTORY -->
                        <div style="flex-grow: 1; display: flex; flex-direction: column; gap: 4px; overflow-y: auto;">
                            <div class="winforms-groupbox" style="margin-top: 4px; padding-top: 14px; flex-grow: 1;" id="winforms-dynamic-controls-root">
                                <span class="winforms-groupbox-legend">Configuration Parameters</span>
                                <div id="winforms-factory-fields-container" style="display: flex; flex-direction: column; gap: 8px; padding-left: 2px;"></div>
                            </div>
                        </div>
                    </div>

                    <!-- REAL-TIME TELEMETRY DATA LOGGING VIEWER BLOCK (WinForms RichTextBox emulation) -->
                    <div style="padding: 0 6px; box-sizing: border-box; height: 64px;">
                        <div class="winforms-groupbox" style="margin-top: 0; padding: 4px; height: 100%; background-color: #FFFFFF; border: 1px solid #7F9DB9; overflow-y: scroll; position: relative;" id="winforms-telemetry-logger">
                            <span class="winforms-groupbox-legend" style="background-color: #FFFFFF; color: #1E395B; font-weight: bold;">Real-Time Telemetry Log</span>
                            <div id="winforms-log-stream-root" style="font-family: 'Courier New', monospace; font-size: 10px; color: #333333; line-height: 12px; white-space: pre-wrap; padding-top: 4px;">
[SYSTEM INITIALIZED] Awaiting real-time stream capture frames from Univac-Aegis-bridge...
                            </div>
                        </div>
                    </div>

                    <!-- Bottom Status Tray Spacer Block Pane -->
                    <div style="height: 22px; border-top: 1px solid #D6D6D6; margin: 4px 6px 0 6px; background-color: #F0F0F0; font-size: 11px; padding: 3px 5px; box-sizing: border-box;" id="winforms-gui-statusbar">
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
                            <button class="winforms-btn" id="gui-btn-apply">Apply</button>
                        </div>
                    </div>

                </div>
            </div>
        `;

        this.bindUserInteractions();
    }

    /**
     * Append transaction logs coming across network sockets onto the streaming panel view
     * @param {string} source - Origin module identification tag (e.g., 'AEGIS', 'AVIATION')
     * @param {string} logMessage - Raw telemetry descriptor parameters
     */
    appendTelemetryLog(source, logMessage) {
        const logRoot = document.getElementById('winforms-log-stream-root');
        const loggerScroller = document.getElementById('winforms-telemetry-logger');
        if (!logRoot || !loggerScroller) return;

        const timestamp = new Date().toLocaleTimeString();
        const outputLine = `[${timestamp}][${source}] ${logMessage}\n`;

        // Inject line node safely into the container frame array tracking loop
        logRoot.innerText += outputLine;

        // Strip oldest rows if buffer breaks configuration limits
        const logLines = logRoot.innerText.split('\n');
        if (logLines.length > this.MAX_LOG_LINES) {
            logRoot.innerText = logLines.slice(logLines.length - this.MAX_LOG_LINES).join('\n');
        }

        // Force scroller to stick to bottom for live updates, unless user has scrolled up to inspect logs
        const threshold = 25; 
        const isScrolledToBottom = loggerScroller.scrollHeight - loggerScroller.clientHeight - loggerScroller.scrollTop < threshold;
        if (isScrolledToBottom) {
            loggerScroller.scrollTop = loggerScroller.scrollHeight;
        }
    }

    updateActiveNodeSchema(nodeId, bannerTitle, schemaFields) {
        this.activeNodeId = nodeId;
        this.currentSchema = schemaFields;

        const titleEl = document.getElementById('winforms-dynamic-title');
        const bannerEl = document.getElementById('winforms-banner-text');
        if (titleEl) titleEl.textContent = `Sperry Software Node Configuration [${nodeId}]`;
        if (bannerEl) bannerEl.textContent = bannerTitle;

        this.loadSettingsFromStorage();
        this.renderModuleListings();
        this.generateFormControls();
        
        this.appendTelemetryLog("SYSTEM", `Switched connection schema configuration mapping focus context to: ${nodeId}`);
    }

    loadSettingsFromStorage() {
        const storageKey = `SPERRY_GUI_CFG_${this.activeNodeId}`;
        const serialized = localStorage.getItem(storageKey);
        this.localSettingsCache = serialized ? JSON.parse(serialized) : {};
    }

    saveSettingsToStorage() {
        const storageKey = `SPERRY_GUI_CFG_${this.activeNodeId}`;
        this.currentSchema.forEach(field => {
            const inputElement = document.getElementById(`wf-field-${field.key}`);
            if (!inputElement) return;
            this.localSettingsCache[field.key] = field.type === 'boolean' ? inputElement.checked : inputElement.value;
        });

        localStorage.setItem(storageKey, JSON.stringify(this.localSettingsCache));
        
        const statusbar = document.getElementById('winforms-gui-statusbar');
        if (statusbar) statusbar.textContent = `Status: Changes committed to LocalStorage for ${this.activeNodeId}`;
        
        this.appendTelemetryLog("SYSTEM", `Configuration adjustments saved to disk and dispatched down bridge lines.`);

        if (this.bridge && typeof this.bridge.sendPayload === 'function') {
            this.bridge.sendPayload("NODE_CFG_SYNC", { node: this.activeNodeId, settings: this.localSettingsCache });
        }
    }

    generateFormControls() {
        const container = document.getElementById('winforms-factory-fields-container');
        if (!container) return;
        let htmlPayload = "";

        this.currentSchema.forEach(field => {
const activeValue = this.localSettingsCache[field.key] !== undefined ? this.localSettingsCache[field.key] : field.default;
if (field.type === 'boolean') {
htmlPayload += <label style="display: flex; align-items: center; gap: 6px; font-size: 11px; cursor: pointer;"> <input type="checkbox" id="wf-field-${field.key}" ${activeValue ? 'checked' : ''}> <span>${field.label}</span> </label>;
} else if (field.type === 'string' || field.type === 'number') {
htmlPayload += <div style="display: flex; flex-direction: column; gap: 2px;"> <label style="font-size: 11px;">${field.label}</label> <input type="text" class="winforms-input-text" id="wf-field-${field.key}" value="${activeValue}" style="width: ${field.width || '100%'};"> </div>;
}
});
container.innerHTML = htmlPayload;
}
renderModuleListings() {
const listContainer = document.getElementById('winforms-module-rows-container');
if (listContainer) {
listContainer.innerHTML = <div class="addins-table-row"> <div style="width: 38px; text-align: center;"><input type="checkbox" checked style="margin: 0;"></div> <div style="flex-grow: 1; padding-left: 4px; font-weight: bold; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${this.activeNodeId}</div> </div>;
}
}
bindUserInteractions() {
this.container.addEventListener('click', (e) => {
if (e.target.id === 'gui-btn-apply' || e.target.id === 'gui-btn-ok') {
e.preventDefault();
this.saveSettingsToStorage();
}
if (e.target.id === 'gui-btn-reset') {
e.preventDefault();
localStorage.removeItem(SPERRY_GUI_CFG_${this.activeNodeId});
this.loadSettingsFromStorage();
this.generateFormControls();
this.appendTelemetryLog("SYSTEM", "Settings storage blocks wiped clean for active module.");
}
});
}
loadFallbackSchema() {
const mockCombinedSchema = [
{ key: 'air_speed_knots', label: 'Air Speed Tracking Limit (Knots)', type: 'number', default: '450', width: '80px' },
{ key: 'altitude_hold_ft', label: 'Target Altitude Target Constraint (Feet)', type: 'number', default: '32000', width: '110px' },
{ key: 'aviation_compass_sync', label: 'Enable Aviation Bridge Gyro Autopilot Sync', type: 'boolean', default: true },
{ key: 'aegis_radar_interleave', label: 'Aegis AN/SPY-1 Radar Stream Interleave Rate (ms)', type: 'number', default: '250', width: '70px' }
];
this.updateActiveNodeSchema("AEGIS_AVIATION_BRIDGE_NODE", "Aegis & Aviation Core Control", mockCombinedSchema);
}
}

---

### 2. Upstream Core Thread Route Integration (`src/core/kvm-manager.js`)

We will update your master KVM manager's telemetry interceptor loop to automatically parse raw data lines from your connected repositories. This funnels the data into the logging viewer in real time, even when the GUI viewport is hidden or running in the background.

```javascript
    /**
     * Core router handling inbound live mainframe schema updates or register changes
     */
    handleIncomingTelemetry(envelope) {
        // Telemetry Event 1: Physical register changes (Switches and dials sync)
        if (envelope.action === "CORE_REG_UPDATE") {
            const { reg, val } = envelope.payload;
            
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
        
        // Telemetry Event 2: Dynamic metadata schema updates pushed from live repositories
        else if (envelope.action === "METADATA_SCHEMA_PUSH") {
            const { nodeId, bannerTitle, fields } = envelope.payload;
            if (this.configGui) {
                this.configGui.updateActiveNodeSchema(nodeId, bannerTitle, fields);
            }
        }
    }
