import { VstKnob } from '../components/vst-knob.js';
import { VstSwitch } from '../components/vst-switch.js';

export class System110080Panel {
    constructor(containerId, bridgeClient) {
        this.container = document.getElementById(containerId);
        this.bridge = bridgeClient;
        this.controls = {}; // Cache map for live item lookup
    }

    init() {
        this.container.innerHTML = `
            <div class="vst-console-frame">
                <!-- Branding Header -->
                <div class="vst-console-header">
                    <span class="vst-brand-text">SPERRY <span class="vst-star">✦</span> UNIVAC</span>
                    <span class="vst-model-text">1100/80</span>
                </div>

                <!-- ZONE 1: PARTITIONING & SYSTEM CLOCK -->
                <div class="vst-zone" id="zone-partitioning">
                    <h3>PARTITIONING & SYSTEM CLOCK</h3>
                    <div class="vst-grid">
                        <div class="vst-item" id="tp-1"></div>
                        <div class="vst-item" id="tp-2"></div>
                        <div class="vst-item" id="tp-3"></div>
                        <div class="vst-item" id="tp-4"></div>
                    </div>
                </div>

                <!-- ZONE 2: INITIAL LOAD & AUTO RECOVERY -->
                <div class="vst-zone" id="zone-load">
                    <h3>INITIAL LOAD / AUTO RECOVERY CONTROL</h3>
                    <div class="vst-grid">
                        <div class="vst-item" id="tp-5"></div>
                        <div class="vst-item" id="tp-6"></div>
                        <div class="vst-item" id="tp-7"></div>
                        <div class="vst-item" id="tp-8"></div>
                    </div>
                </div>

                <!-- ZONE 3: PROCESSOR CONDITIONS & STOP SELECT -->
                <div class="vst-zone" id="zone-processors">
                    <h3>PROCESSORS DIAGNOSTIC MATRIX</h3>
                    <div class="vst-grid">
                        <div class="vst-item" id="tp-9"></div>
                        <div class="vst-item" id="tp-10"></div>
                        <div class="vst-item" id="tp-11"></div>
                    </div>
                </div>

                <!-- ZONE 4: CHANNEL MODULES & DEVICE SELECT -->
                <div class="vst-zone" id="zone-channels">
                    <h3>I/O CHANNELS & DEVICE SELECT</h3>
                    <div class="vst-grid">
                        <div class="vst-item" id="tp-12"></div>
                        <div class="vst-item" id="tp-13"></div>
                        <div class="vst-item" id="tp-14"></div>
                        <div class="vst-item" id="tp-15"></div>
                    </div>
                </div>
            </div>
        `;

        this.bindTouchPoints();
    }

    bindTouchPoints() {
        // --- ZONE 1 INITIALIZATION ---
        // TP 1: Off-Line / Maint Mode Cluster 0 (Switch)
        this.controls['CLUSTER_0_MAINT'] = new VstSwitch('tp-1', 'CLUSTER 0 MAINT', 'OFF-LINE', 'MAINT MODE', (state) => {
            this.sendToBridge('Z1_CLUS0_MODE', state);
        });

        // TP 2: Cluster 1 Segment Toggle (Switch)
        this.controls['CLUSTER_1_SEG'] = new VstSwitch('tp-2', 'CLUSTER 1 SEGMENT', 'SEG-A', 'SEG-B', (state) => {
            this.sendToBridge('Z1_CLUS1_SEG', state);
        });

        // TP 3: Panel Mode Lamp Test (Switch)
        this.controls['LAMP_TEST'] = new VstSwitch('tp-3', 'LAMP TEST', 'NORMAL', 'TEST ACTIVE', (state) => {
            this.sendToBridge('Z1_LAMP_TEST', state);
        });

        // TP 4: Processor Mode Override (Switch)
        this.controls['PROC_MODE'] = new VstSwitch('tp-4', 'PROC OVERRIDE', 'AUTO', 'MANUAL', (state) => {
            this.sendToBridge('Z1_PROC_OVR', state);
        });


        // --- ZONE 2 INITIALIZATION ---
        // TP 5: Load Path 0 Source Select (Rotary Knob)
        this.controls['LOAD_PATH_0'] = new VstKnob('tp-5', 'LOAD PATH 0', 4, ['TAPE', 'DISK-0', 'DISK-1', 'NET-BRIDGE'], (val) => {
            this.sendToBridge('Z2_LPATH0_SEL', val);
        });

        // TP 6: Load Path 1 Source Select (Rotary Knob)
        this.controls['LOAD_PATH_1'] = new VstKnob('tp-6', 'LOAD PATH 1', 4, ['TAPE', 'DISK-0', 'DISK-1', 'NET-BRIDGE'], (val) => {
            this.sendToBridge('Z2_LPATH1_SEL', val);
        });

        // TP 7: Initial Load Clear Interface (Switch)
        this.controls['CLEAR_INT'] = new VstSwitch('tp-7', 'CLEAR INTERFACE', 'DISABLE', 'ENABLE', (state) => {
            this.sendToBridge('Z2_CLR_INT', state);
        });

        // TP 8: Auto Recovery Condition (Switch)
        this.controls['AUTO_RECOVERY'] = new VstSwitch('tp-8', 'AUTO RECOVERY', 'TERM ON ERROR', 'RESET / RESUME', (state) => {
            this.sendToBridge('Z2_AUTO_RECOV', state);
        });


        // --- ZONE 3 INITIALIZATION ---
        // TP 9: Stop Select Multi-Position Dial (Rotary Knob)
        this.controls['STOP_SELECT'] = new VstKnob('tp-9', 'STOP SELECT', 8, ['0', '1', '2', '3', '4', '5', '6', 'ANY'], (val) => {
            this.sendToBridge('Z3_STOP_SEL', val);
        });

        // TP 10: Processor Step Multiplier (Rotary Knob)
        this.controls['PROC_SELECT'] = new VstKnob('tp-10', 'PROC SELECT', 4, ['PROC-0', 'PROC-1', 'PROC-2', 'PROC-3'], (val) => {
            this.sendToBridge('Z3_PROC_SEL', val);
        });

        // TP 11: Jump Selector Array Function (Switch)
        this.controls['JUMP_RELEASE'] = new VstSwitch('tp-11', 'JUMP RELEASE', 'HOLD', 'RELEASE', (state) => {
            this.sendToBridge('Z3_JMP_REL', state);
        });


        // --- ZONE 4 INITIALIZATION ---
        // TP 12: Input-Output Unit 0 Disable (Switch)
        this.controls['IOU_0_DISABLE'] = new VstSwitch('tp-12', 'IOU 0 MODULE', 'ON-LINE', 'OFF-LINE', (state) => {
            this.sendToBridge('Z4_IOU0_STAT', state);
        });

        // TP 13: Channel Module 0 Device Rotary Selector (Rotary Knob)
        this.controls['CHAN_0_SELECT'] = new VstKnob('tp-13', 'CHAN 0 DEV SELECT', 6, ['A', 'B', 'C', 'D', 'E', 'F'], (val) => {
            this.sendToBridge('Z4_CH0_DEV', val);
        });

        // TP 14: Input-Output Unit 1 Disable (Switch)
        this.controls['IOU_1_DISABLE'] = new VstSwitch('tp-14', 'IOU 1 MODULE', 'ON-LINE', 'OFF-LINE', (state) => {
            this.sendToBridge('Z4_IOU1_STAT', state);
        });

        // TP 15: Channel Module 1 Device Rotary Selector (Rotary Knob)
        this.controls['CHAN_1_SELECT'] = new VstKnob('tp-15', 'CHAN 1 DEV SELECT', 6, ['A', 'B', 'C', 'D', 'E', 'F'], (val) => {
            this.sendToBridge('Z4_CH1_DEV', val);
        });
    }

    sendToBridge(register, value) {
        console.log(`📡 KVM Event -> Core Register [${register}] value updated to: ${value}`);
        if (this.bridge && typeof this.bridge.writeHardwareAddress === 'function') {
            this.bridge.writeHardwareAddress(register, value);
        }
    }
}
