/**
 * Sperry Univac KVM & Telecom Console Automated Training Engine.
 * Programmatically triggers interface components to demonstrate system functionality.
 */
export class AutomatedTrainingBot {
    constructor(kvmManagerInstance) {
        this.kvm = kvmManagerInstance;
        this.isRunning = false;
        
        // Structured interactive lessons configuration array loop
        this.trainingScript = [
            { step: 1, action: 'LOG', msg: "🚀 TRAINING INITIATED: BOOTING SPERRY CONSOLE SIMULATION PROFILES..." },
            
            // --- LESSON 1: BLOCK MODE TERMINAL FIELDS ASSEMBLY ---
            { step: 2, action: 'SWITCH_MODE', mode: 'TUI' },
            { step: 3, action: 'LOG', msg: "LESSON 1: UTS BLOCK-MODE TERMINAL INPUT MEMORY BUFFERS" },
            { step: 4, action: 'TYPE_TUI', fieldRow: 4, fieldCol: 26, text: "TITAN_NV" },
            { step: 5, action: 'LOG', msg: "LOCAL BUFFER ENHANCED. FOCUSING ON ROW 25 HARDWARE STATUS UPDATES..." },
            { step: 6, action: 'XMIT_TUI' },
            
            // --- LESSON 2: WINFORMS DYNAMIC FACTORY CONFIGS ---
            { step: 7, action: 'SWITCH_MODE', mode: 'GUI' },
            { step: 8, action: 'LOG', msg: "LESSON 2: SPERRY SOFTWARE DYNAMIC CONFIGURATION WINDOW" },
            { step: 9, action: 'SET_INPUT_GUI', inputId: 'wf-field-air_speed_knots', text: "525" },
            { step: 10, action: 'LOG', msg: "LOCALSTORAGE SYNC ENGAGED. RECOGNIZING LIVE BASIC-AVIATION-KNOWLEDGE DATA TRACKS..." },
            { step: 11, action: 'CLICK_GUI', btnId: 'gui-btn-apply' },
            
            // --- LESSON 3: SKEUOMORPHIC TACTICAL RADIO ALIGNMENT ---
            { step: 12, action: 'SWITCH_MODE', mode: 'PANEL' },
            { step: 13, action: 'LOG', msg: "LESSON 3: MILITARY RADIO SET SCR-610 TRANSMITTER MATRIX" },
            { step: 14, action: 'SET_VST_KNOB', regKey: 'SCR610_CHAN_SEL', targetVal: 1 }, // Switch to Channel B (38.9M)
            { step: 15, action: 'SET_VST_SWITCH', regKey: 'SCR610_BATTERY_FEED', targetState: 1 }, // Connect Battery
            
            // --- LESSON 4: PRIORITY QUEUES & PARALLEL COMPUTATION ---
            { step: 16, action: 'LOG', msg: "LESSON 4: MARCONI 365EZ TRANSMISSION PAUSE & NVIDIA COMPUTATION LAYER" },
            { step: 17, action: 'TRIGGER_MARCONI' },
            { step: 18, action: 'LOG', msg: "✅ TRAINING COMPLETE: ALL COMPONENT PHASES SUCCESSFULLY ROUTED." }
        ];
    }

    /**
     * Loops through the script steps using asynchronous execution delays
     */
    async startSelfGuidedTrainingLoop() {
        if (this.isRunning) return;
        this.isRunning = true;

        this.updateUiTrainerStatus(true);

        for (let i = 0; i < this.trainingScript.length; i++) {
            const currentItem = this.trainingScript[i];
            await this.executeLessonStep(currentItem);
            // 2.2 second operational evaluation delay window in between active instruction statements
            await new Promise(resolve => setTimeout(resolve, 2200)); 
        }

        this.isRunning = false;
        this.updateUiTrainerStatus(false);
    }

    async executeLessonStep(item) {
        console.log(`🤖 Training Bot -> Step [${item.step}] executing: ${item.action}`);

        switch (currentItem.action) {
            case 'LOG':
                // Print lesson vectors directly onto the WinForms logger or TUI row 25
                if (this.kvm.configGui) {
                    this.kvm.configGui.appendTelemetryLog("TRAINING_BOT", item.msg);
                }
                break;

            case 'SWITCH_MODE':
                // Simulate pressing your crimson NEXT button or Ctrl + N to swap viewports
                this.kvm.currentModeIndex = this.kvm.modes.indexOf(item.mode);
                this.kvm.updateViewportState();
                break;

            case 'TYPE_TUI':
                // Auto-type characters one-by-one inside the local TUI text array matrix
                if (this.kvm.tuiScreen) {
                    let textBuffer = item.text;
                    for (let c = 0; c < textBuffer.length; c++) {
                        this.kvm.tuiScreen.handleCharacterInput(textBuffer[c]);
                        this.kvm.tuiScreen.render();
                        await new Promise(res => setTimeout(res, 120)); // Human typing latency simulation
                    }
                }
                break;

            case 'XMIT_TUI':
                if (this.kvm.tuiScreen) this.kvm.tuiScreen.transmitLocalBuffer();
                break;

            case 'SET_INPUT_GUI':
                const guiInput = document.getElementById(item.inputId);
                if (guiInput) {
                    guiInput.value = "";
                    for (let c = 0; c < item.text.length; c++) {
                        guiInput.value += item.text[c];
                        await new Promise(res => setTimeout(res, 80));
                    }
                }
                break;

            case 'CLICK_GUI':
                const guiBtn = document.getElementById(item.btnId);
                if (guiBtn) guiBtn.click();
                break;

            case 'SET_VST_KNOB':
                if (this.kvm.hardwarePanel && this.kvm.hardwarePanel.controls[item.regKey]) {
                    const knob = this.kvm.hardwarePanel.controls[item.regKey];
                    knob.currentStep = item.targetVal;
                    knob.updateHardwareState();
                }
                break;

            case 'SET_VST_SWITCH':
                if (this.kvm.hardwarePanel && this.kvm.hardwarePanel.controls[item.regKey]) {
                    const toggle = this.kvm.hardwarePanel.controls[item.regKey];
                    if (toggle.state !== item.targetState) {
                        toggle.toggleState();
                    }
                }
                break;

            case 'TRIGGER_MARCONI':
                // Accesses the queue structure inside the skeuomorphic radio rack modules
                if (this.kvm.hardwarePanel && this.kvm.hardwarePanel.priorityQueue) {
                    this.kvm.hardwarePanel.priorityQueue.triggerMarconiKeyerDispatch();
                }
                break;
        }
    }

    updateUiTrainerStatus(isActive) {
        const indicator = document.getElementById('training-program-status-flag');
        if (!indicator) return;
        if (isActive) {
            indicator.textContent = "TRAINING RUNNING - AUTO CONTROL";
            indicator.style.backgroundColor = "#FFB000";
            indicator.style.color = "#000";
        } else {
            indicator.textContent = "TRAINING INACTIVE - MANUAL KVM";
            indicator.style.backgroundColor = "#222";
            indicator.style.color = "#888";
        }
    }
}
