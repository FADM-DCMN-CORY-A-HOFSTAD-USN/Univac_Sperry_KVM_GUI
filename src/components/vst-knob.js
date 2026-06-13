export class VstKnob {
    constructor(targetId, label, totalPositions, labelArray, changeCallback) {
        this.wrapper = document.getElementById(targetId);
        this.label = label;
        this.steps = totalPositions;
        this.labels = labelArray;
        this.callback = changeCallback;
        
        this.currentStep = 0;
        this.startY = 0;

        this.render();
    }

    render() {
        this.wrapper.innerHTML = `
            <div class="vst-knob-container">
                <span class="vst-ctrl-label">${this.label}</span>
                <div class="vst-knob-touch-zone">
                    <div class="vst-physical-dial">
                        <div class="vst-dial-pointer-line"></div>
                    </div>
                    <span class="vst-knob-display-val">${this.labels[this.currentStep]}</span>
                </div>
            </div>
        `;

        const touchZone = this.wrapper.querySelector('.vst-knob-touch-zone');
        
        touchZone.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.startY = e.touches[0].clientY;
        }, { passive: false });

        touchZone.addEventListener('touchmove', (e) => {
            e.preventDefault();
            const currentY = e.touches[0].clientY;
            const deltaY = this.startY - currentY; // Pull upward = step forward

            // Shift step when drag threshold breaks 25 pixels vertically
            if (Math.abs(deltaY) > 25) {
                if (deltaY > 0 && this.currentStep < this.steps - 1) {
                    this.currentStep++;
                    this.startY = currentY;
                    this.updateHardwareState();
                } else if (deltaY < 0 && this.currentStep > 0) {
                    this.currentStep--;
                    this.startY = currentY;
                    this.updateHardwareState();
                }
            }
        }, { passive: false });
    }

    updateHardwareState() {
        // Calculate degree spacing over a 240-degree dial dynamic arc range
        const arcSpread = 240;
        const degreeIncrement = arcSpread / (this.steps - 1);
        const targetDeg = -120 + (this.currentStep * degreeIncrement);

        const needle = this.wrapper.querySelector('.vst-dial-pointer-line');
        const textOut = this.wrapper.querySelector('.vst-knob-display-val');

        if (needle) needle.style.transform = `rotate(${targetDeg}deg)`;
        if (textOut) textOut.textContent = this.labels[this.currentStep];

        if (this.callback) this.callback(this.currentStep);
    }
}
