/**
 * Sperry Software Dynamic WinForms Renderer with Real-time Telemetry Data Logging
 * Integrates direct instrumentation track feeds from Basic-Aviation-Knowledge.
 */
import { SperrySoftwareLogo } from '../components/sperry-software-logo.js';
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

    init() {
        this.renderWindowFrame();
        this.loadFallbackSchema();
    }

           <div class="sperry-software-window">
                <div class="winforms-titlebar">
                    <div class="titlebar-left">
                        <div class="sperry-app-icon-slot"></div>
                        <span id="winforms-dynamic-title">Sperry Software Node Configuration [${this.activeNodeId}]</span>
                    </div>
                </div>

                <div class="winforms-canvas">
                    <!-- GRADIENT BANNER HEADER ASSEMBLY MOUNTING GENUINE LOGO VECTOR ARRAYS -->
                    <div class="sperry-brand-banner" style="background: linear-gradient(to right, #F7931E 0%, #FFD200 45%, #FFFFFF 85%); height: 110px;">
                        
                        <!-- NEW ACTIVE LOGO ELEMENT SLOT -->
                        <div style="position: absolute; left: 8px; top: 2px; z-index: 10;">
                            ${SperrySoftwareLogo.getInlineSvg()}
                        </div>
                        
                        <!-- Adjusted text margin layout parameters to account for the new logo scale bounds -->
                        <span class="banner-title-text" id="winforms-banner-text" style="margin-left: 156px; font-size: 16px; margin-top: 12px; display: inline-block;">
                            Telecom Instruction Scripting
                        </span>
                        
                        <div class="banner-right-photo-slot" style="height: 110px;"></div>
                    </div>
                    
                    <!-- Split views workspace layouts continue below cleanly ... -->
                            
                    <div style="display: flex; padding: 6px; gap: 8px; height: calc(100% - 176px); box-sizing: border-box;">
                        
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

                        <div style="flex-grow: 1; display: flex; flex-direction: column; gap: 4px; overflow-y: auto;">
                            <div class="winforms-groupbox" style="margin-top: 4px; padding-top: 14px; flex-grow: 1;" id="winforms-dynamic-controls-root">
                                <span class="winforms-groupbox-legend">Configuration Parameters</span>
                                <div id="winforms-factory-fields-container" style="display: flex; flex-direction: column; gap: 8px; padding-left: 2px;"></div>
                            </div>
                        </div>
                    </div>

                    <div style="padding: 0 6px; box-sizing: border-box; height: 32px;">
                        <div style="background-color: #E9EEF4; border: 1px solid #7F9DB9; padding: 4px 8px; display: flex; justify-content: space-between; font-family: monospace; font-size: 11px; color: #032E6A; font-weight: bold; box-sizing: border-box;">
                            <span>HDG: <span id="nav-lbl-hdg">000°</span></span>
                            <span>PITCH: <span id="nav-lbl-pitch">0.0°</span></span>
                            <span>ROLL: <span id="nav-lbl-roll">0.0°</span></span>
                            <span>GYRO_ERR: <span id="nav-lbl-gyro">+0.0°</span></span>
                        </div>
                    </div>

                    <div style="padding: 0 6px; box-sizing: border-box; height: 50px; margin-top: 4px;">
                        <div class="winforms-groupbox" style="margin-top: 0; padding: 4px; height: 100%; background-color: #FFFFFF; border: 1px solid #7F9DB9; overflow-y: scroll; position: relative;" id="winforms-telemetry-logger">
                            <span class="winforms-groupbox-legend" style="background-color: #FFFFFF; color: #1E395B; font-weight: bold;">Real-Time Telemetry Log</span>
                            <div id="winforms-log-stream-root" style="font-family: 'Courier New', monospace; font-size: 10px; color: #333333; line-height: 12px; white-space: pre-wrap; padding-top: 4px;">
[SYSTEM INITIALIZED] Awaiting real-time stream capture frames from aviation bridge channels...
                            </div>
                        </div>
                    </div>

                    <div style="height: 22px; border-top: 1px solid #D6D6D6; margin: 4px 6px 0 6px; background-color: #F0F0F0; font-size: 11px; padding: 3px 5px; box-sizing: border-box;" id="winforms-gui-statusbar">
                        Status: Synchronization verified with Local Storage cache.
                    </div>

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
     * Ingests dynamic instrumentation variables from Basic-Aviation-Knowledge datasets
     * @param {number} heading - Gyro compass orientation degree track (000-359)
     * @param {number} pitch - Flight climb/descent inclination level
     * @param {number} roll - Airframe banking angle rotation
     * @param {number} gyroError - Calculation delta tracking offset values
     */
updateCompassTelemetryTrack(heading, pitch, roll, gyroError) {
        // 1. Refresh explicit WinForms display elements text content
        const lblHdg = document.getElementById('nav-lbl-hdg');
        const lblPitch = document.getElementById('nav-lbl-pitch');
        const lblRoll = document.getElementById('nav-lbl-roll');
        const lblGyro = document.getElementById('nav-lbl-gyro');

        // Note: For heading, if you still want the integer part padded to 3 digits (e.g., "045.123..."), 
        // we can check if it's less than 100/10 and pad it before attaching the 15 decimals.
        let hdgPad = heading < 10 ? '00' : (heading < 100 ? '0' : '');

        if (lblHdg) lblHdg.textContent = `${hdgPad}${heading.toFixed(15)}°`;
        if (lblPitch) lblPitch.textContent = `${pitch.toFixed(15)}°`;
        if (lblRoll) lblRoll.textContent = `${roll.toFixed(15)}°`;
        if (lblGyro) lblGyro.textContent = `${gyroError >= 0 ? '+' : ''}${gyroError.toFixed(15)}°`;

        // 2. Format a raw telemetry string entry and write it into the main scroller
        const telemetryPayloadString = `NAV_TRACK: HDG=${heading.toFixed(15)} P=${pitch.toFixed(15)} R=${roll.toFixed(15)} | GYRO_OFFSET=${gyroError.toFixed(15)}`;
        this.appendTelemetryLog("AVIATION_CORE", telemetryPayloadString);
    }

    appendTelemetryLog(source, logMessage) {
        const logRoot = document.getElementById('winforms-log-stream-root');
        const loggerScroller = document.getElementById('winforms-telemetry-logger');
        if (!logRoot || !loggerScroller) return;

        const timestamp = new Date().toLocaleTimeString();
        logRoot.innerText += `\n[${timestamp}][${source}] ${logMessage}`;

        const logLines = logRoot.innerText.split('\n');
        if (logLines.length > this.MAX_LOG_LINES) {
            logRoot.innerText = logLines.slice(logLines.length - this.MAX_LOG_LINES).join('\n');
        }

        const isScrolledToBottom = loggerScroller.scrollHeight - loggerScroller.clientHeight - loggerScroller.scrollTop < 25;
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
            if (inputElement) {
                this.localSettingsCache[field.key] = field.type === 'boolean' ? inputElement.checked : inputElement.value;
            }
        });

        localStorage.setItem(storageKey, JSON.stringify(this.localSettingsCache));
        
        const statusbar = document.getElementById('winforms-gui-statusbar');
        if (statusbar) statusbar.textContent = `Status: Changes committed to LocalStorage for ${this.activeNodeId}`;
        
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
                htmlPayload += `<label style="display: flex; align-items: center; gap: 6px; font-size: 11px;"><input type="checkbox" id="wf-field-${field.key}" ${activeValue ? 'checked' : ''}><span>${field.label}</span></label>`;
            } else {
                htmlPayload += `<div style="display: flex; flex-direction: column; gap: 2px;"><label style="font-size: 11px;">${field.label}</label><input type="text" class="winforms-input-text" id="wf-field-${field.key}" value="${activeValue}" style="width: ${field.width || '100%'};"></div>`;
            }
        });
        container.innerHTML = htmlPayload;
    }

    renderModuleListings() {
        const listContainer = document.getElementById('winforms-module-rows-container');
        if (listContainer) {
            listContainer.innerHTML = `<div class="addins-table-row"><div style="width: 38px; text-align: center;"><input type="checkbox" checked style="margin: 0;"></div><div style="flex-grow: 1; padding-left: 4px; font-weight: bold;">${this.activeNodeId}</div></div>`;
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
                localStorage.removeItem(`SPERRY_GUI_CFG_${this.activeNodeId}`); 
                this.loadSettingsFromStorage(); 
                this.generateFormControls(); 
            }
        });
    }

    loadFallbackSchema() {
        const mockCombinedSchema = [
            { key: 'aviation_compass_sync', label: 'Enable Aviation Bridge Gyro Autopilot Sync', type: 'boolean', default: true },
            { key: 'air_speed_knots', label: 'Air Speed Tracking Limit (Knots)', type: 'number', default: '450', width: '80px' },
            { key: 'aegis_radar_interleave', label: 'Aegis AN/SPY-1 Radar Stream Interleave Rate (ms)', type: 'number', default: '250', width: '70px' }
        ];
        this.updateActiveNodeSchema("AEGIS_AVIATION_BRIDGE_NODE", "Aegis & Aviation Core Control", mockCombinedSchema);
    }
}
