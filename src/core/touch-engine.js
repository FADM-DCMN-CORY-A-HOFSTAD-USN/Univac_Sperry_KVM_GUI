export class TouchEngine {
    static initRotaryKnob(knobElement, callback) {
        let startY = 0;
        let currentVal = 0;
        const sensitivity = 0.5; // Drag speed modifier

        knobElement.addEventListener('touchstart', (e) => {
            // Stop viewport from jumping/scrolling away
            if (e.cancelable) e.preventDefault();
            startY = e.touches[0].clientY;
            currentVal = parseInt(knobElement.getAttribute('data-value')) || 0;
        }, { passive: false });

        knobElement.addEventListener('touchmove', (e) => {
            if (e.cancelable) e.preventDefault();
            const currentY = e.touches[0].clientY;
            const deltaY = startY - currentY; // Upward drag = clockwise rotation

            let targetRotation = currentVal + (deltaY * sensitivity);
            
            // Limit to logical physical dial space (-150deg to +150deg)
            if (targetRotation > 150) targetRotation = 150;
            if (targetRotation < -150) targetRotation = -150;

            // Apply direct transform rotation mapping onto the knob element
            const pointer = knobElement.querySelector('.vst-knob-indicator-line');
            if (pointer) {
                pointer.style.transform = `rotate(${targetRotation}deg)`;
            }

            // Return values normalized between 0-100 or 0-255 back to your handler
            const normalizedOutput = Math.round(((targetRotation + 150) / 300) * 100);
            if (callback) callback(normalizedOutput);
        }, { passive: false });

        knobElement.addEventListener('touchend', () => {
            // Parse configuration states or fire final state into the database registry
            const currentRotation = knobElement.querySelector('.vst-knob-indicator-line').style.transform;
            const finalDeg = parseInt(currentRotation.replace(/[^0-9-]/g, '')) || 0;
            knobElement.setAttribute('data-value', finalDeg);
        });
    }
}
