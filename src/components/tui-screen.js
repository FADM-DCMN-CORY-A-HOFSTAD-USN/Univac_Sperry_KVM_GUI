/**
 * Sperry Univac UTS Block-Mode TUI Matrix Renderer - Error & Warning Expansion
 */
export class SperryTuiScreen {
    constructor(containerId, bridgeClient) {
        this.container = document.getElementById(containerId);
        this.bridge = bridgeClient;

        this.COLS = 80;
        this.ROWS = 25; // Row 25 (Index 24) is the dedicated Hardware Status Line

        this.charBuffer = [];  
        this.attrBuffer = [];  
        this.cursorRow = 0;
        this.cursorCol = 0;
        this.keyboardLocked = false;
        
        // Active alarm flag toggles standard line themes into high-alert states
        this.systemAlertState = 'NORMAL'; // 'NORMAL' | 'WARN' | 'CRIT'

        this.initBuffers();
        this.setupKeyboardHook();
    }

    initBuffers() {
        this.charBuffer = Array.from({ length: this.ROWS }, () => Array(this.COLS).fill(' '));
        this.attrBuffer = Array.from({ length: this.ROWS }, () => Array(this.COLS).fill('protected'));

        this.writeStatusLine("SYSTEM READY - SPERRY UNIVAC 1100 INTERFACE", 'NORMAL');
    }

    /**
     * Refined Status Line Writer with explicit semantic alarm mapping
     * @param {string} message - Text string to push into row 25
     * @param {string} alertLevel - 'NORMAL' (Green), 'WARN' (Amber), 'CRIT' (Crimson)
     */
    writeStatusLine(message, alertLevel = 'NORMAL') {
        this.systemAlertState = alertLevel;
        const cleanMsg = message.toUpperCase().substring(0, 65);
        const paddedMsg = cleanMsg.padEnd(65, ' ');
        
        // Write text characters into row index 24
        for (let i = 0; i < paddedMsg.length; i++) {
            this.charBuffer[24][i] = paddedMsg[i];
        }
        
        // Set individual cell color attributes based on the alarm state
        const attributeTag = `status-${alertLevel.toLowerCase()}`;
        for (let c = 0; c < this.COLS; c++) {
            this.attrBuffer[24][c] = attributeTag;
        }
        
        this.updateCoordsOnStatus();
    }

    updateCoordsOnStatus() {
        const coordString = `R:${String(this.cursorRow + 1).padStart(2, '0')} C:${String(this.cursorCol + 1).padStart(2, '0')}`;
        for (let i = 0; i < coordString.length; i++) {
            this.charBuffer[24][68 + i] = coordString[i];
        }
    }

    defineField(row, colStart, text, type = 'protected') {
        for (let i = 0; i < text.length; i++) {
            const targetCol = colStart + i;
            if (targetCol < this.COLS) {
                this.charBuffer[row][targetCol] = text[i];
                this.attrBuffer[row][targetCol] = type;
            }
        }
    }

    render() {
        let htmlStr = "";
        for (let r = 0; r < this.ROWS; r++) {
            htmlStr += `<div class="tui-row">`;
            for (let c = 0; c < this.COLS; c++) {
                const char = this.charBuffer[r][c];
                const attr = this.attrBuffer[r][c];
                const isCursor = (r === this.cursorRow && c === this.cursorCol && !this.keyboardLocked);
                
                const cursorClass = isCursor ? ' sperry-cursor' : '';
                const displayChar = char === ' ' ? '&nbsp;' : char;

                htmlStr += `<span class="tui-cell tui-attr-${attr}${cursorClass}">${displayChar}</span>`;
            }
            htmlStr += `</div>`;
        }
        this.container.innerHTML = htmlStr;
    }

    setupKeyboardHook() {
        window.addEventListener('keydown', (e) => {
            if (!this.container.closest('.kvm-screen-pane').classList.contains('active')) return;
            
            // If an unrecovered data link failure occurs, flash the line and refuse inputs
            if (this.keyboardLocked) {
                if (e.key === 'Enter' || e.key.length === 1) {
                    e.preventDefault();
                    this.flashStatusLineWarning();
                }
                return;
            }

            if (e.key === 'Tab') { e.preventDefault(); this.advanceToNextField(e.shiftKey); this.render(); return; }
            if (e.key === 'Backspace') { e.preventDefault(); this.handleBackspace(); this.render(); return; }
            if (e.key === 'Enter') { e.preventDefault(); this.transmitLocalBuffer(); return; }

            if (e.key.length === 1) {
                this.handleCharacterInput(e.key);
                this.render();
            }
        });
    }

    /**
     * Tactile visual pulse if an operator attempts to type on a locked/broken line
     */
    flashStatusLineWarning() {
        const rowElement = this.container.querySelector('.tui-row:last-child');
        if (rowElement) {
            rowElement.classList.add('hardware-flash-alert');
            setTimeout(() => rowElement.classList.remove('hardware-flash-alert'), 200);
        }
    }

    handleCharacterInput(char) {
        if (this.attrBuffer[this.cursorRow][this.cursorCol] === 'input') {
            this.charBuffer[this.cursorRow][this.cursorCol] = char.toUpperCase();
            this.advanceCursor();
        } else {
            this.advanceToNextField(false);
            if (this.attrBuffer[this.cursorRow][this.cursorCol] === 'input') {
                this.charBuffer[this.cursorRow][this.cursorCol] = char.toUpperCase();
                this.advanceCursor();
            }
        }
        this.updateCoordsOnStatus();
    }

    handleBackspace() {
        this.regressCursor();
        if (this.attrBuffer[this.cursorRow][this.cursorCol] === 'input') {
            this.charBuffer[this.cursorRow][this.cursorCol] = ' ';
        }
        this.updateCoordsOnStatus();
    }

    advanceCursor() {
        this.cursorCol++;
        if (this.cursorCol >= this.COLS) {
            this.cursorCol = 0;
            this.cursorRow++;
            if (this.cursorRow >= this.ROWS - 1) this.cursorRow = 0;
        }
    }

    regressCursor() {
        this.cursorCol--;
        if (this.cursorCol < 0) {
            this.cursorCol = this.COLS - 1;
            this.cursorRow--;
            if (this.cursorRow < 0) this.cursorRow = this.ROWS - 2;
        }
    }

    advanceToNextField(reverse = false) {
        let iterations = 0;
        const maxSearch = this.COLS * (this.ROWS - 1);
        while (iterations < maxSearch) {
            if (reverse) {
                this.cursorCol--;
                if (this.cursorCol < 0) { this.cursorCol = this.COLS - 1; this.cursorRow--; if (this.cursorRow < 0) this.cursorRow = this.ROWS - 2; }
            } else {
                this.cursorCol++;
                if (this.cursorCol >= this.COLS) { this.cursorCol = 0; this.cursorRow++; if (this.cursorRow >= this.ROWS - 1) this.cursorRow = 0; }
            }
            if (this.attrBuffer[this.cursorRow][this.cursorCol] === 'input') {
                const prevCol = this.cursorCol === 0 ? this.COLS - 1 : this.cursorCol - 1;
                const prevRow = this.cursorCol === 0 ? (this.cursorRow === 0 ? this.ROWS - 2 : this.cursorRow - 1) : this.cursorRow;
                if (this.attrBuffer[prevRow][prevCol] !== 'input') break;
            }
            iterations++;
        }
    }

    transmitLocalBuffer() {
        this.keyboardLocked = true;
        this.writeStatusLine("WAIT - XMIT IN PROGRESS VIA AEGIS CONSOLE BRIDGE...", 'NORMAL');
        this.render();

        const payload = [];
        for (let r = 0; r < this.ROWS - 1; r++) {
            let fieldAccumulator = "";
            let fieldStartCol = null;
            for (let c = 0; c < this.COLS; c++) {
                if (this.attrBuffer[r][c] === 'input') {
                    if (fieldStartCol === null) fieldStartCol = c;
                    fieldAccumulator += this.charBuffer[r][c];
                } else {
                    if (fieldAccumulator !== "") {
                        payload.push({ row: r, col: fieldStartCol, data: fieldAccumulator.trimEnd() });
                        fieldAccumulator = ""; fieldStartCol = null;
                    }
                }
            }
            if (fieldAccumulator !== "") payload.push({ row: r, col: fieldStartCol, data: fieldAccumulator.trimEnd() });
        }

        if (this.bridge && typeof this.bridge.sendBlockModeBurst === 'function') {
            this.bridge.sendBlockModeBurst(payload)
                .then(() => {
                    this.keyboardLocked = false;
                    this.writeStatusLine("XMIT COMPLETE - READY", 'NORMAL');
                    this.render();
                })
                .catch((err) => {
                    // Frame transmission interrupted or dropped entirely over the line:
                    this.keyboardLocked = true; // Lock local keyboard array input buffer
                    this.writeStatusLine("LINE ERR / DEV CHK - TRANSACTION ABORTED. PRESS NEXT TO CYCLE.", 'CRIT');
                    this.render();
                });
        }
    }
}
