/**
 * Isolated Standalone Gantry Layout & Morse Macro State Compiler Engine.
 * Saves configuration templates directly to a localized JSON file context.
 */
import { UnivacMorseInstructions } from './instruction-set-map.js';
import { VCardTelecomFactory } from '../core/vcard-telecom.js';
import { UnivacPriorityQueue } from '../core/priority-queue.js';
import { MuseumHistoryMatrix } from './museum-matrix.js'; // Import the matrix parameters
const vcfFactory = new VCardTelecomFactory();
const priorityQueue = new UnivacPriorityQueue();
const cudaEngine = new NvidiaCudaThreadMonitor('gantry-nvidia-cuda-monitor-slot');
this.priorityQueue.registerCudaMonitor(cudaEngine);

// Connect UI Elements to the priority queue engine modules
const saveBtn = document.getElementById('kvm-big-red-cycle');
saveBtn.addEventListener('click', () => {
    // Generate the raw Gantry template layout dictionary parameters...
    const templateConfigPayload = {
        templateStyleName: document.getElementById('macro-style-name').value.trim(),
        targetNode: document.getElementById('macro-node-target').value.trim(),
        timestamp: new Date().toISOString(),
        instructionCount: 6, // Active count array
        compiledMorseString: ".-.. .- .-.. -" // Sample load statement string
    };

    // 1. Generate and compile the contact file array directly to Android phone book storage format
    vcfFactory.downloadVcfAsset(templateConfigPayload);

    // 2. Feed the configuration block directly into the high-priority NVIDIA queue pipeline
    priorityQueue.enqueueStatement(templateConfigPayload, 'NVIDIA_TITAN_NODE');
});

// Hook up the physical Marconi 365EZ Short Base button interface element
const marconiKeyBtn = document.getElementById('keyer-lever-target');
if (marconiKeyBtn) {
    marconiKeyBtn.addEventListener('click', () => {
        // Enforce the 20-minute planning pause and process queued statements
        priorityQueue.triggerMarconiKeyerDispatch();
    });
}

class GantryTemplateEngine {
    constructor() {
        this.canvas = document.getElementById('gantry-dropzone-canvas');
        this.drawer = document.getElementById('gantry-sidebar-drawer');
        
        // Active visual vertical layout block stack collection tracking loop
        this.activeStack = [];
        this.draggedData = null;
    }

class SperryGantryBuilderApp {
    constructor() {
        // Core structural element anchors
        this.nodeSelect = document.getElementById('macro-node-target-select');
        this.activeStack = [];
        
        // Setup initial default selected profile reference
        this.selectedNodeKey = "NVIDIA_TITAN_NODE";
    }

    init() {
        this.renderInstructionSidebar();
        this.setupDragAndDropListeners();
        this.bindSaveAction();
        this.populateMatrixDropdown();
        this.bindMatrixSelectionEngine();
    }

    /**
     * Builds draggable items using historical instruction arrays
     */
    populateMatrixDropdown() {
        if (!this.nodeSelect) return;

        let optionsHtml = "";
        Object.keys(MuseumHistoryMatrix).forEach(key => {
            const node = MuseumHistoryMatrix[key];
            optionsHtml += `<option value="${key}">${node.node_name}</option>`;
        });

        this.nodeSelect.innerHTML = optionsHtml;
        this.updateMetadataDisplayPanel(); // Force sync of initial text parameters
    }
    renderInstructionSidebar() {
        let sidebarHtml = "<h3>INSTRUCTIONS</h3>";
        
        UnivacMorseInstructions.forEach(inst => {
            sidebarHtml += `
                <div class="draggable-instruction-block" draggable="true" data-op="${inst.op}" data-mnemonic="${inst.mnemonic}">
                    <strong>${inst.mnemonic}</strong> - ${inst.op}<br>
                    <span style="color: #888;">Morse: ${inst.latin_morse}</span>
                </div>
            `;
        });

        this.drawer.innerHTML = sidebarHtml;
    }

    setupDragAndDropListeners() {
        // Track the source element when an item is picked up from the sidebar drawer
        this.drawer.addEventListener('dragstart', (e) => {
            const targetBlock = e.target.closest('.draggable-instruction-block');
            if (!targetBlock) return;
            
            this.draggedData = {
                op: targetBlock.getAttribute('data-op'),
                mnemonic: targetBlock.getAttribute('data-mnemonic')
            };
        });

        // Allow drops by overriding default safety interception blockers
        this.canvas.addEventListener('dragover', (e) => {
            e.preventDefault();
        });

        this.canvas.addEventListener('drop', (e) => {
            e.preventDefault();
            if (!this.draggedData) return;

            // Strip out greeting placeholders upon receiving the first component drop event
            const placeholder = document.getElementById('canvas-placeholder');
            if (placeholder) placeholder.remove();

            this.addInstructionToStack(this.draggedData);
            this.draggedData = null; // Clear working reference
        });
    }

    addInstructionToStack(itemData) {
        // Locate matching full specification arrays
        const spec = UnivacMorseInstructions.find(x => x.op === itemData.op);
        if (!spec) return;

        const uniqueId = 'inst-' + Date.now();
        const stackObject = {
            id: uniqueId,
            mnemonic: spec.mnemonic,
            op: spec.op,
            morse: spec.latin_morse
        };

        this.activeStack.push(stackObject);
        this.renderCanvasView();
    }

    removeInstructionFromStack(uniqueId) {
        this.activeStack = this.activeStack.filter(item => item.id !== uniqueId);
        this.renderCanvasView();
    }

    /**
     * Re-renders the drag-and-drop workspace UI view
     */
    renderCanvasView() {
        if (this.activeStack.length === 0) {
            this.canvas.innerHTML = `
                <div style="color: #666; text-align: center; margin-top: 20%;" id="canvas-placeholder">
                    [ DROP MACHINE INSTRUCTIONS HERE TO BUILD TRANSMISSION STACK ]
                </div>`;
            return;
        }

        let canvasHtml = "";
        this.activeStack.forEach((item, index) => {
            canvasHtml += `
                <div class="gantry-dropped-row">
                    <span style="color: #FFD200; margin-right: 15px; font-weight: bold;">[${String(index).padStart(2,'0')}]</span>
                    <div>
                        <strong>${item.mnemonic} (Op: ${item.op})</strong><br>
                        <span style="color: #4AD2FF; font-size: 11px;">CW Command Vector: ${item.morse}</span>
                    </div>
                    <button class="remove-btn" data-id="${item.id}">X</button>
                </div>
            `;
        });

        this.canvas.innerHTML = canvasHtml;

        // Bind removal click commands back onto the structural trash buttons
        this.canvas.querySelectorAll('.remove-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.removeInstructionFromStack(btn.getAttribute('data-id'));
            });
        });
    }

    /**
     * Passes the current profile settings directly into the file compiler during saves
     */
    executeSaveAction() {
        if (this.activeStack.length === 0) return;

        const nodeMeta = MuseumHistoryMatrix[this.selectedNodeKey];
        const macroCompiledMorse = this.activeStack.map(x => x.morse).join(' ');

        // Incorporate the exact python dictionary variables inside the active vCard configuration envelope
        const compiledConfigBlock = {
            templateStyleName: document.getElementById('macro-style-name').value.trim(),
            targetNode: this.selectedNodeKey,
            systemId: nodeMeta.system_id,
            priorityWeight: nodeMeta.priority_weight,
            timestamp: new Date().toISOString(),
            instructionCount: this.activeStack.length,
            compiledMorseString: macroCompiledMorse
        };

        // Export standard .vcf address telecom file layout format asset block
        this.vcfFactory.downloadVcfAsset(compiledConfigBlock);

        // Queue into the priority compute pipeline matrix loop using exact matrix weights
        this.priorityQueue.enqueueStatement(compiledConfigBlock, this.selectedNodeKey);
    /**
     * Saves the current layout stack configuration to a localized JSON file context
     */
    bindMatrixSelectionEngine() {
        this.nodeSelect.addEventListener('change', (e) => {
            this.selectedNodeKey = e.target.value;
            this.updateMetadataDisplayPanel();
            
            const nodeMeta = MuseumHistoryMatrix[this.selectedNodeKey];
            this.logToMonitor("MUSEUM_MATRIX", `Active hardware context switched to: [${nodeMeta.node_name}]`);
        });
    updateMetadataDisplayPanel() {
        const nodeMeta = MuseumHistoryMatrix[this.selectedNodeKey];
        if (!nodeMeta) return;

        document.getElementById('lbl-sys-id').textContent = nodeMeta.system_id;
        document.getElementById('lbl-prio-weight').textContent = nodeMeta.priority_weight;
        document.getElementById('lbl-cycle-factor').textContent = `${nodeMeta.cycle_multiplier}x multiplier`;
    }

    bindSaveAction() {
        const saveBtn = document.getElementById('kvm-big-red-cycle');
        
        saveBtn.addEventListener('click', () => {
            if (this.activeStack.length === 0) {
                alert("Cannot commit empty instruction stacks.");
                return;
            }

            const styleName = document.getElementById('macro-style-name').value.trim();
            const targetNode = document.getElementById('macro-node-target').value.trim();

            // Extract sequence parameters into a clean, continuous Morse code message string
            const concatenatedMorseSequence = this.activeStack.map(item => item.morse).join(' ');

            const templateConfigPayload = {
                templateStyleName: styleName,
                targetNode: targetNode,
                timestamp: new Date().toISOString(),
                instructionCount: this.activeStack.length,
                compiledMorseString: concatenatedMorseSequence,
                executionStack: this.activeStack.map(item => ({
                    mnemonic: item.mnemonic,
                    opCode: item.op,
                    morseRepresentation: item.morse
                }))
            };

            // Convert the configured data payload to a local blob file stream
            const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(templateConfigPayload, null, 4));
            const downloadAnchor = document.createElement('a');
            downloadAnchor.setAttribute("href", dataStr);
            downloadAnchor.setAttribute("download", `${styleName.toLowerCase()}_morse_macro.json`);
            document.body.appendChild(downloadAnchor);
            
            downloadAnchor.click(); // Trigger browser file download prompt
            downloadAnchor.remove();

            console.log("💾 Morse script template generation complete. JSON database output exported successfully.");
        });
    }
}

window.addEventListener('DOMContentLoaded', () => {
    new GantryTemplateEngine().init();
});
