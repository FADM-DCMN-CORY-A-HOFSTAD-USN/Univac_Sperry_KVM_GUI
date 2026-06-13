/**
 * Touch-Screen Optimized Analog Meter Component
 * Simulates mechanical needle inertia, ballistic overshoot, and spring decay.
 */
export class AnalogMeter {
    constructor(targetId, label, unitLabel, minVal = 0, maxVal = 100) {
        this.wrapper = document.getElementById(targetId);
        this.label = label;
        this.unit = unitLabel;
        this.min = minVal;
        this.max = maxVal;

        // Dial angular constraints (-60deg to +60deg arcs matching vintage hardware meters)
        this.MIN_DEG = -60;
        this.MAX_DEG = 60;

        this.render();
    }

    render() {
        this.wrapper.innerHTML = `
            <div class="analog-meter-housing">
                <span class="meter-face-title">${this.label}</span>
                
                <div class="meter-casing">
                    <!-- Arc Line and Tick Increments -->
                    <div class="meter-scale-arc"></div>
                    <div class="meter-scale-ticks">
                        <span>0</span>
                        <span>5</span>
                        <span>10</span>
                    </div>

                    <!-- Mechanical Center Pivot Needle Pin -->
                    <div class="meter-needle-pivot">
                        <div class="meter-needle-arm" style="transform: rotate(${this.MIN_DEG}deg);"></div>
                    </div>

                    <span class="meter-unit-tag">${this.unit}</span>
                </div>
            </div>
        `;
    }

    /**
     * Ballistic Spike: Kicks the needle instantly to a target value, then falls away
     * @param {number} value - The peak power position target
     * @param {number} decayTimeMs - Settle speed duration back to baseline zero
     */
    spikeToValue(value, decayTimeMs = 350) {
        const needle = this.wrapper.querySelector('.meter-needle-arm');
        if (!needle) return;

        // Map data value domain safely into physical layout degree targets
        const percentage = (value - this.min) / (this.max - this.min);
        const clampedPercent = Math.min(Math.max(percentage, 0), 1);
        const targetDeg = this.MIN_DEG + (clampedPercent * (this.MAX_DEG - this.MIN_DEG));

        // Apply a violent mechanical impulse acceleration matrix step
        needle.style.transition = `transform 40ms cubic-bezier(0.1, 0.9, 0.2, 1.3)`; // Overshoot bounce curve
        needle.style.transform = `rotate(${targetDeg}deg)`;

        // Decay phase: After the brief impulse window concludes, ease gracefully back down to zero
        setTimeout(() => {
            // Check that the user hasn't struck the key again before transition triggers
            if (needle.style.transform === `rotate(${targetDeg}deg)`) {
                needle.style.transition = `transform ${decayTimeMs}ms cubic-bezier(0.36, 0.07, 0.19, 0.97)`;
                needle.style.transform = `rotate(${this.MIN_DEG}deg)`;
            }
        }, 80);
    }
}
