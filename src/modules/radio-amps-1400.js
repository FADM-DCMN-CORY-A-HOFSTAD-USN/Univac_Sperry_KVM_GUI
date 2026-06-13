import { VstKnob } from '../components/vst-knob.js';
import { VstSwitch } from '../components/vst-switch.js';
import { MorseTelegraphKey } from '../components/telegraph-key.js'; // Mount key component
import { MainframeCompaction } from '../core/compaction.js'; // Mount compaction engine


export class RadioAmps1400Panel {
    constructor(containerId, bridgeClient) {
        this.container = document.getElementById(containerId);
        this.bridge = bridgeClient;
        this.controls = {};
        
        // Instantiate Compactor Engine Instance
        this.compactor = new MainframeCompaction();
    }

    init() {
                // ... Core console frame HTML generation structures remain matching perfectly ...
        this.renderConsoleFrame(); 
    }

    renderConsoleFrame() {
        // Standard structural layout generation logic wrapper...
        // [Matches previous implementation layouts seamlessly]
    }

    mountTelegraphKeyer() {
        this.controls['MORSE_KEYER'] = new MorseTelegraphKey('radio-telegraph-key-slot', (fullString, lastChar) => {
            
            // Execute Fieldata compaction protocol routine on the character buffer string
            const compressedBlock = this.compactor.compactStringToMessageBlock(fullString);
            
            // Calculate actual byte savings efficiency metric
            const uncompressedSize = fullString.length; // Assumes 8-bit text layout base (1 byte per char)
            const compressedSize = compressedBlock.packedBlockCount * 3; // Packed payload byte metrics
            const compressionRatio = Math.round(((uncompressedSize - compressedSize) / uncompressedSize) * 100) || 0;

            console.log(`🗜️ Mainframe Compactor Active: Packed "${fullString}" -> Hex Payload Block: [${compressedBlock.hexPayload}] (Saved ${compressionRatio}%)`);
            
            // Log the dense telemetry transaction directly onto your config panel logs drawer view
            window.dispatchEvent(new CustomEvent('radio-telemetry-log', {
                detail: { 
                    param: 'FIELDATA_PACKED_HEX', 
                    value: `${compressedBlock.hexPayload} (Chars: ${uncompressedSize} -> Packed Bytes: ${compressedSize} | Efficiency: +${compressionRatio}%)` 
                }
            }));

            // Dispatch compressed compact telegram text block payload over your Univac bridge stream
            if (this.bridge && typeof this.bridge.sendPayload === 'function') {
                this.bridge.sendPayload("TELEGRAM_COMPACT_BLOCK", {
                    node: "ITT_ST1400_AMP",
                    word_count: compressedBlock.packedBlockCount,
                    hex_data: compressedBlock.hexPayload
                });
                
        this.container.innerHTML = `
             <div class="vst-console-frame gray-marine">
                <div class="vst-console-header line-navy">
                    <span class="vst-brand-text">ITT MARINE <span class="vst-star">✦</span> ST1400</span>
                    <span class="vst-model-text">HIGH-POWER RADIO TRANSMITTER & TELEGRAM AMPLIFIER</span>
                </div>

                <div class="radio-split-workspace">
                    <div class="radio-rack-column" id="rack-st1400">
                        <h2>MAIN POWER AMPLIFIER RACK (FAR RIGHT CONSOLE)</h2>
                        <div class="vst-zone">
                            <h3>FILAMENT POWER & HIGH VOLTAGE (HV) RELAYS</h3>
                            <div class="vst-grid"><div class="vst-item" id="rad-tp-1"></div><div class="vst-item" id="rad-tp-2"></div><div class="vst-item" id="rad-tp-3"></div></div>
                        </div>
                        <div class="vst-zone">
                            <h3>FREQUENCY BAND & DRIVE INTERLEAVE SELECT</h3>
                            <div class="vst-grid"><div class="vst-item" id="rad-tp-4"></div><div class="vst-item" id="rad-tp-5"></div><div class="vst-item" id="rad-tp-6"></div></div>
                        </div>
                        <div class="vst-zone">
                            <h3>TELEGRAM SIGNAL GAIN & ANTENNA COUPLER TUNING</h3>
                            <div class="vst-grid"><div class="vst-item" id="rad-tp-7"></div><div class="vst-item" id="rad-tp-8"></div></div>
                        </div>
                    </div>

                    <div class="radio-rack-column" id="rack-emergency">
                        <h2>EMERGENCY CONSOLE RACK (CENTER DESK MODULE)</h2>
                        <div class="vst-zone alert-zone-border">
                            <h3>EMERGENCY TRANSMITTER STATUS & AUDIO DRIVERS</h3>
                            <div class="vst-grid"><div class="vst-item" id="rad-tp-9"></div><div class="vst-item" id="rad-tp-10"></div><div class="vst-item" id="rad-tp-11"></div></div>
                        </div>
                        <div class="vst-zone">
                            <h3>EMERGENCY 500 KHZ / ALARM RECEIVER CONTROLS</h3>
                            <div class="vst-grid"><div class="vst-item" id="rad-tp-12"></div><div class="vst-item" id="rad-tp-13"></div><div class="vst-item" id="rad-tp-14"></div></div>
                        </div>
                        <div class="vst-zone">
                            <h3>AUTO-ALARM TELEGRAPHIC KEYER CONTROLS</h3>
                            <div class="vst-grid"><div class="vst-item" id="rad-tp-15"></div></div>
                        </div>

                        <!-- RESERVED AREA FOR THE SKEUOMORPHIC TELEGRAPH KEY INTERFACE -->
                        <div id="radio-telegraph-key-slot"></div>
                    </div>
                </div>
            </div>
            <div class="vst-console-frame gray-marine">
                <!-- Transmitter Header Brand Plate -->
                <div class="vst-console-header line-navy">
                    <span class="vst-brand-text">ITT MARINE <span class="vst-star">✦</span> ST1400</span>
                    <span class="vst-model-text">HIGH-POWER RADIO TRANSMITTER & TELEGRAM AMPLIFIER</span>
                </div>

                <div class="radio-split-workspace">
                    <!-- ======================================================= -->
                    <!-- CONSOLE PANEL 1: ITT ST1400 MAIN TRANSMITTER RACK -->
                    <!-- ======================================================= -->
                    <div class="radio-rack-column" id="rack-st1400">
                        <h2>MAIN POWER AMPLIFIER RACK (FAR RIGHT CONSOLE)</h2>
                        
                        <div class="vst-zone">
                            <h3>FILAMENT POWER & HIGH VOLTAGE (HV) RELAYS</h3>
                            <div class="vst-grid">
                                <div class="vst-item" id="rad-tp-1"></div>
                                <div class="vst-item" id="rad-tp-2"></div>
                                <div class="vst-item" id="rad-tp-3"></div>
                            </div>
                        </div>

                        <div class="vst-zone">
                            <h3>FREQUENCY BAND & DRIVE INTERLEAVE SELECT</h3>
                            <div class="vst-grid">
                                <div class="vst-item" id="rad-tp-4"></div>
                                <div class="vst-item" id="rad-tp-5"></div>
                                <div class="vst-item" id="rad-tp-6"></div>
                            </div>
                        </div>

                        <div class="vst-zone">
                            <h3>TELEGRAM SIGNAL GAIN & ANTENNA COUPLER TUNING</h3>
                            <div class="vst-grid">
                                <div class="vst-item" id="rad-tp-7"></div>
                                <div class="vst-item" id="rad-tp-8"></div>
                            </div>
                        </div>
                    </div>

                    <!-- ======================================================= -->
                    <!-- CONSOLE PANEL 2: EMERGENCY COMMUNICATIONS CONSOLE RACK -->
                    <!-- ======================================================= -->
                    <div class="radio-rack-column" id="rack-emergency">
                        <h2>EMERGENCY CONSOLE RACK (CENTER DESK MODULE)</h2>
                        
                        <div class="vst-zone alert-zone-border">
                            <h3>EMERGENCY TRANSMITTER STATUS & AUDIO DRIVERS</h3>
                            <div class="vst-grid">
                                <div class="vst-item" id="rad-tp-9"></div>
                                <div class="vst-item" id="rad-tp-10"></div>
                                <div class="vst-item" id="rad-tp-11"></div>
                            </div>
                        </div>

                        <div class="vst-zone">
                            <h3>EMERGENCY 500 KHZ / ALARM RECEIVER CONTROLS</h3>
                            <div class="vst-grid">
                                <div class="vst-item" id="rad-tp-12"></div>
                                <div class="vst-item" id="rad-tp-13"></div>
                                <div class="vst-item" id="rad-tp-14"></div>
                            </div>
                        </div>

                        <div class="vst-zone">
                            <h3>AUTO-ALARM TELEGRAPHIC KEYER CONTROLS</h3>
                            <div class="vst-grid">
                                <div class="vst-item" id="rad-tp-15"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        this.bindRadioTouchPoints();
        this.mountTelegraphKeyer();
    }

    bindRadioTouchPoints() {
        // --- CONSOLE 1: ITT ST1400 CONTROLS ---
        // TP 1: Mains Power Switch
        this.controls['ST1400_MAINS'] = new VstSwitch('rad-tp-1', 'MAINS ENERGIZE', 'OFF', 'ON', (state) => {
            this.sendRadioCommand('ST1400_MAINS', state);
        });

        // TP 2: Filament Pre-heat Relay (Needs to be active before HV power is applied)
        this.controls['ST1400_FILAMENT'] = new VstSwitch('rad-tp-2', 'FILAMENT PREHEAT', 'STANDBY', 'READY', (state) => {
            this.sendRadioCommand('ST1400_FILAMENT', state);
        });

        // TP 3: High Voltage (HV) Plate Supply Transformer Switch
        this.controls['ST1400_HV_PLATE'] = new VstSwitch('rad-tp-3', 'HV PLATE POWER', 'DISABLED', 'ACTIVE', (state) => {
            this.sendRadioCommand('ST1400_HV', state);
        });

        // TP 4: RF Waveform Band Rotary Switch
        this.controls['ST1400_RF_BAND'] = new VstKnob('rad-tp-4', 'RF FREQ BAND', 5, ['4MHZ', '6MHZ', '8MHZ', '12MHZ', '22MHZ'], (val) => {
            this.sendRadioCommand('ST1400_BAND', val);
        });

        // TP 5: Operational Emission Mode Configuration Selector
        this.controls['ST1400_EMISSION'] = new VstKnob('rad-tp-5', 'EMISSION MODE', 4, ['CW_TELEGRAPH', 'MCW', 'SSB_VOICE', 'DATA_LINK'], (val) => {
            this.sendRadioCommand('ST1400_EMISSION', val);
        });

        // TP 6: Mainframe Modulator Interleave Selector Switch
        this.controls['ST1400_INTERLEAVE'] = new VstSwitch('rad-tp-6', 'DATA INTERLEAVE', 'BYPASS', '1100_SYNC', (state) => {
            this.sendRadioCommand('ST1400_INTLV_MODE', state);
        });

        // TP 7: Driver Loading Variable Tuner Dial
        this.controls['ST1400_TUNING_LOAD'] = new VstKnob('rad-tp-7', 'PA LOADING GAIN', 11, ['0','1','2','3','4','5','6','7','8','9','10'], (val) => {
            this.sendRadioCommand('ST1400_PA_LOAD', val);
        });

        // TP 8: Antenna Matching Network Inductor Dial
        this.controls['ST1400_ANT_COUPLER'] = new VstKnob('rad-tp-8', 'ANTENNA COUPLER', 6, ['WHIP', 'LONG_WIRE', 'MAIN_MAST', 'DUMMY_LOAD', 'RESERVE', 'GROUND'], (val) => {
            this.sendRadioCommand('ST1400_COUPLER', val);
        });


        // --- CONSOLE 2: EMERGENCY CONSOLE RACK CONTROLS ---
        // TP 9: Emergency Power Battery Backup Switch
        this.controls['EMERG_BATT_POWER'] = new VstSwitch('rad-tp-9', 'EMERGENCY BATTERY', 'ISOLATED', 'CONNECTED', (state) => {
            this.sendRadioCommand('EMERG_BATT', state);
        });

        // TP 10: Reserve Transmitter Driver Mode Selector
        this.controls['EMERG_XMTR_MODE'] = new VstKnob('rad-tp-10', 'EMERG XMTR FREQ', 3, ['500KHZ_DISTRESS', '2182KHZ_GUARD', 'HF_RESERVE'], (val) => {
            this.sendRadioCommand('EMERG_XMTR_FREQ', val);
        });

        // TP 11: Emergency Telegraph Signal Gain Potentiometer
        this.controls['EMERG_DRIVE_GAIN'] = new VstKnob('rad-tp-11', 'TELEGRAM AMP DRIVE', 6, ['DIM', 'LOW', 'MED', 'HIGH', 'MAX', 'BOOST'], (val) => {
            this.sendRadioCommand('EMERG_DRIVE', val);
        });

        // TP 12: Emergency Receiver Mains Power Switch
        this.controls['EMERG_RCVR_PWR'] = new VstSwitch('rad-tp-12', 'RESERVE RCVR POWER', 'OFF', 'ON', (state) => {
            this.sendRadioCommand('EMERG_RCVR_PWR', state);
        });

        // TP 13: 500kHz Audio Bandpass Filter Select
        this.controls['EMERG_AUDIO_FILTER'] = new VstSwitch('rad-tp-13', 'BANDPASS FILTER', 'WIDE', 'NARROW_CW', (state) => {
            this.sendRadioCommand('EMERG_FILTER', state);
        });

        // TP 14: BFO (Beat Frequency Oscillator) Tuning Control Dial
        this.controls['EMERG_BFO_PITCH'] = new VstKnob('rad-tp-14', 'BFO PITCH TUNE', 7, ['-3KHZ', '-1KHZ', '0', '+1KHZ', '+3KHZ', '+5KHZ', 'SCAN'], (val) => {
            this.sendRadioCommand('EMERG_BFO', val);
        });

        // TP 15: Automatic Distress Signal Keyer Switch (Sends international 12-dash automated alarm string)
        this.controls['EMERG_AUTO_ALARM'] = new VstSwitch('rad-tp-15', 'AUTO ALARM KEYER', 'STANDBY', 'TRIGGER_DISTRESS', (state) => {
            this.sendRadioCommand('EMERG_AUTO_ALARM_EXEC', state);
        });

        mountTelegraphKeyer() {
        this.controls['MORSE_KEYER'] = new MorseTelegraphKey('radio-telegraph-key-slot', (fullString, lastChar) => {
            console.log(`✉️ Morse buffer incremented: [${lastChar}] -> Total Buffer: "${fullString}"`);
            
            // Push decoded stream parameters directly onto your configuration tab console log window in real time
            window.dispatchEvent(new CustomEvent('radio-telemetry-log', {
                detail: { param: 'TELEGRAM_BUFFER', value: fullString }
            }));

            // Dispatch telegram text blocks securely over your Univac connection stream
            if (this.bridge && typeof this.bridge.sendPayload === 'function') {
                this.bridge.sendPayload("TELEGRAM_CHAR_STREAM", {
                    raw_text: fullString,
                    appended_char: lastChar
        });
    }

    sendRadioCommand(registerKey, dataState) {
        console.log(`📡 Radio KVM Routing Event -> Address [${registerKey}] set to: ${dataState}`);
        
        // Log telemetry lines directly onto your configuration tab console log screen
        window.dispatchEvent(new CustomEvent('radio-telemetry-log', {
            detail: { param: registerKey, value: dataState }
        }));

        if (this.bridge && typeof this.bridge.writeHardwareAddress === 'function') {
            this.bridge.writeHardwareAddress(registerKey, dataState);
        }
    }
}
