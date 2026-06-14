/**
 * NVIDIA CUDA Parallel Execution Thread Pool & Compilation Monitor.
 * Visualizes thread blocks, grid allocations, and kernel telemetry strings in real time.
 */
import { HistoricNvidiaLogo } from './nvidia-math-logo.js';
export class NvidiaCudaThreadMonitor {
    constructor(targetId) {
        this.wrapper = document.getElementById(targetId);
        this.TOTAL_CORES = 64; // Visual representation matrix block size
        this.render();
    }
    render() {
        let gridBlocksHtml = "";
        for (let i = 0; i < this.TOTAL_CORES; i++) {
            gridBlocksHtml += `<div class="cuda-core-node" id="cuda-core-${i}"></div>`;
        }

        this.wrapper.innerHTML = `
            <div class="winforms-groupbox" style="margin-top: 10px; padding-top: 14px; background-color: #F0F5FA;">
                <span class="winforms-groupbox-legend" style="color: #1A428A; font-weight: bold;">NVIDIA NVCC Kernel Parallel Array</span>
                
                <div class="cuda-dashboard-split" style="display: flex; gap: 8px; height: 110px; box-sizing: border-box;">
                    
                    <!-- NEW HOOK: HISTORIC 1993 VECTOR MATH LOGO UNIT BLOCK -->
                    <div style="width: 110px; display: flex; align-items: center; justify-content: center; background-color: #050505; border: 1px solid #7F9DB9; border-radius: 2px; box-shadow: inset 0 2px 4px rgba(0,0,0,0.8);">
                        ${HistoricNvidiaLogo.getInlineSvg()}
                    </div>

                    <!-- CENTER PANEL: GRID THREAD ALLOCATION CORE MESH -->
                    <div style="width: 120px; display: flex; flex-direction: column; gap: 2px;">
                        <span style="font-size: 8px; color: #444; font-weight: bold; letter-spacing: -0.2px;">GRID THREAD ALLOC:</span>
                        <div class="cuda-grid-matrix-mesh">
                            ${gridBlocksHtml}
                        </div>
                        <div style="display: flex; justify-content: space-between; font-size: 8px; color: #555; margin-top: 1px;">
                            <span>Active: <strong id="cuda-lbl-active">0</strong></span>
                            <span>Matrix: <strong>1.5E75</strong></span>
                        </div>
                    </div>

                    <!-- RIGHT PANEL: NVCC COMPILER COURIER TERMINAL WINDOW -->
                    <div style="flex-grow: 1; display: flex; flex-direction: column; gap: 2px;">
                        <span style="font-size: 8px; color: #444; font-weight: bold; letter-spacing: -0.2px;">NVCC EXECUTION TELEMETRY:</span>
                        <div class="cuda-compiler-log-terminal" id="cuda-terminal-log-output">
Awaiting tactical payload vector from Aegis priority queue loop stream...
                        </div>
                    </div>

                </div>
            </div>
        `;
    }
    
    triggerKernelExecution(opName, priority) {
        const terminal = document.getElementById('cuda-terminal-log-output');
        const activeLbl = document.getElementById('cuda-lbl-active');
        if (!terminal) return;

        const ts = () => new Date().toLocaleTimeString();
        
        terminal.innerText = `[${ts()}] nvcc -arch=sm_90 -c ${opName.toLowerCase()}.cu -o ${opName.toLowerCase()}.o\n`;
        terminal.innerText += `[${ts()}] PTX Optimizers: Spawning parallel matrix pipelines for execution...\n`;
        terminal.innerText += `[${ts()}] CUDA Alloc: Memory blocks bound to context address index space.\n`;

        let coreIndex = 0;
        const threadBurstInterval = setInterval(() => {
            if (coreIndex >= this.TOTAL_CORES) {
                clearInterval(threadBurstInterval);
                terminal.innerText += `[${ts()}] Parallel Kernel execution complete. Thread exit code 0.\n`;
                terminal.scrollTop = terminal.scrollHeight;
                setTimeout(() => this.resetMatrixMesh(), 600);
                return;
            }

            for (let b = 0; b < 4; b++) {
                const targetNode = document.getElementById(`cuda-core-${coreIndex}`);
                if (targetNode) targetNode.classList.add('core-thread-firing');
                coreIndex++;
            }

            if (activeLbl) activeLbl.textContent = coreIndex;
            terminal.scrollTop = terminal.scrollHeight;
        }, 30);
    /**
     * Simulates live multi-threaded kernel compilation and parallel data block execution
     * @param {string} opName - Name of the active macro or transaction node
     * @param {number} priority - The weight of the pipeline item
     */
    triggerKernelExecution(opName, priority) {
        const terminal = document.getElementById('cuda-terminal-log-output');
        const activeLbl = document.getElementById('cuda-lbl-active');
        if (!terminal) return;

        const timestamps = () => new Date().toLocaleTimeString();
        
        // Phase 1: Output standard NVCC compiler optimization telemetry strings
        terminal.innerText = `[${timestamps()}] nvcc -arch=sm_90 -c ${opName.toLowerCase()}.cu -o ${opName.toLowerCase()}.o\n`;
        terminal.innerText += `[${timestamps()}] PTX Compiler: Optimizing parallel pipelines for execution matrix blocks...\n`;
        terminal.innerText += `[${timestamps()}] CUDA Memory Allocation: cudaMalloc managed memory array context bound securely.\n`;

        // Phase 2: Spin up the visual grid core lights loop sequentially
        let coreIndex = 0;
        const threadBurstInterval = setInterval(() => {
            if (coreIndex >= this.TOTAL_CORES) {
                clearInterval(threadBurstInterval);
                
                // Finalize sequence logs
                terminal.innerText += `[${timestamps()}] Kernel Execution complete: <<<Grid, Block>>> synchronized. Thread exit code 0.\n`;
                terminal.scrollTop = terminal.scrollHeight;
                
                // Rest the display blocks back to default inactive state after a brief cooling phase
                setTimeout(() => this.resetMatrixMesh(), 600);
                return;
            }

            // Light up a cluster of 4 parallel streams simultaneously per cycle tick
            for (let b = 0; b < 4; b++) {
                const targetNode = document.getElementById(`cuda-core-${coreIndex}`);
                if (targetNode) {
                    targetNode.classList.add('core-thread-firing');
                }
                coreIndex++;
            }

            if (activeLbl) activeLbl.textContent = coreIndex;
            terminal.scrollTop = terminal.scrollHeight;
        }, 30);
    }

    resetMatrixMesh() {
        const activeLbl = document.getElementById('cuda-lbl-active');
        if (activeLbl) activeLbl.textContent = "0";
        for (let i = 0; i < this.TOTAL_CORES; i++) {
            const core = document.getElementById(`cuda-core-${i}`);
            if (core) core.classList.remove('core-thread-firing');
        }
    }
}
