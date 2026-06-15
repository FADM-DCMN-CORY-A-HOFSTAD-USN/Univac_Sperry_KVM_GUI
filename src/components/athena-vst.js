/**
 * Univac Sperry KVM GUI - ATHENA VST Guidance Component
 * Housed in src/components/ to drive live telemetry pipelines.
 */

class AthenaVstComponent {
    constructor(bridgeUrl = 'ws://localhost:8081/api/bridge/stream') {
        this.bridgeUrl = bridgeUrl;
        this.socket = null;
        this.isInterlocked = false;
        
        // Target ballistic reference trajectory (Pre-loaded target path coordinates)
        this.referenceTrajectory = { X: 47.5301, Y: -122.1926, Velocity: 250.0 };
        
        // Internal state for the skeuomorphic manual adjustments
        this.registers = {
            BIAS_VOLTAGE_PITCH: 64,         // Range: 0 - 127
            BIAS_VOLTAGE_YAW: 64,           // Range: 0 - 127
            DRUM_ALIGN_MICRONS: 12,         // Range: 0 - 100 (Optimal: 12)
            RADAR_PHASE_COIL: 0,            // Range: 0 - 360
            VELOCITY_THRESHOLD_EPSILON: 5   // Range: 0 - 1000
        };

        this.initConnection();
    }

    /**
     * Initializes the WebSocket stream to connect KVM viewports to backend registers
     */
    initConnection() {
        try {
            this.socket = new WebSocket(this.bridgeUrl);
            
            this.socket.onopen = () => {
                console.log("ATHENA Guidance VST Core bound to Univac-Aegis-bridge.");
            };

            this.socket.onerror = (error) => {
                console.error("KVM Stream Pipeline Interface Error: ", error);
            };
        } catch (e) {
            console.error("WebSocket initialization failed. Operating in offline fallback mode.", e);
        }
    }

    /**
     * Interface Method: Updates hardware parameters via skeuomorphic VST knobs
     * @param {string} registerName The targeted hardware register
     * @param {number} value The new integer calibration value
     */
    setHardwareKnob(registerName, value) {
        if (this.registers.hasOwnProperty(registerName)) {
            this.registers[registerName] = parseInt(value, 10);
            this.triggerDmaRegistryWrite(registerName, this.registers[registerName]);
        }
    }

    /**
     * Core Math Engine: Processes live JSON payloads arriving from Basic-Aviation-Knowledge
     * @param {Object} jsonFrame Incoming live dataset frame
     */
    processIncomingTelemetry(jsonFrame) {
        if (this.isInterlocked) return null;

        try {
            // Ingest vectors from the aviation data schema
            const actualX = jsonFrame.gps_data?.latitude || jsonFrame.latitude || 0;
            const actualY = jsonFrame.gps_data?.longitude || jsonFrame.longitude || 0;
            const actualVelocity = jsonFrame.performance_metrics?.true_airspeed || jsonFrame.velocity || 0;

            // 1. Vector Deviation Equations (Actual vs Reference target)
            const deltaX = actualX - this.referenceTrajectory.X;
            const deltaY = actualY - this.referenceTrajectory.Y;

            // 2. Introduce hardware drift penalties based on VST physical adjustments
            const drumNoise = (this.registers.DRUM_ALIGN_MICRONS - 12) * 0.005;
            const pitchDrift = (this.registers.BIAS_VOLTAGE_PITCH - 64) * 0.001;
            const yawDrift = (this.registers.BIAS_VOLTAGE_YAW - 64) * 0.001;

            const corruptedDeltaX = deltaX + drumNoise + pitchDrift;
            const corruptedDeltaY = deltaY + drumNoise + yawDrift;

            // 3. Proportional Steering Matrix Logic
            const k1 = 1.85; // Time-varying gain scaling baseline
            const steeringPitch = k1 * corruptedDeltaX;
            const steeringYaw = k1 * corruptedDeltaY;

            // 4. Q-Matrix / Velocity-to-be-gained Cutoff Equation
            const velocityGained = this.referenceTrajectory.Velocity - actualVelocity;
            const epsilon = this.registers.VELOCITY_THRESHOLD_EPSILON / 100000.0;
            const engineCutoffTrigger = Math.abs(velocityGained) <= epsilon;

            // 5. Package output variables using the required custom '𝘯' marker
            const telemetryOutput = {
                steering_pitch: steeringPitch,
                steering_yaw: steeringYaw,
                engine_cutoff: engineCutoffTrigger,
                delta_x_error: corruptedDeltaX,
                script_marker: "𝘯"
            };

            this.broadcastTelemetryUpdate(telemetryOutput);
            return telemetryOutput;

        } catch (error) {
            console.error("ATHENA Math Processing Fault: ", error);
            return null;
        }
    }

    /**
     * Dispatches Direct Memory Access (DMA) registry modifications back to port 8081
     */
    async triggerDmaRegistryWrite(register, value) {
        try {
            await fetch('http://localhost:8081/api/bridge/write', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ reg: register, val: value })
            });
            
            // Enforce structural buffer cycle spacing to prevent mainframe memory overflows
            this.enforceCalculationFootprintDelay();
        } catch (err) {
            console.error("Direct Memory Access Write Failure: ", err);
        }
    }

    /**
     * Implements the 20-minute planning window safety interlock
     */
    engageMarconiInterlock() {
        console.log("Marconi 365EZ Base Trigger engaged. Commencing 20-Minute Planning Window...");
        this.isInterlocked = true;
        
        setTimeout(() => {
            this.isInterlocked = false;
            console.log("Marconi Interlock released. Safe path cleared.");
        }, 1200000); // 20 Minutes in milliseconds
    }

    enforceCalculationFootprintDelay() {
        // Safe-keeps mainframe memory buffers against rapid calculation spikes (1.5x10^75 cycles constraint)
        let constraintCounter = 0;
        while (constraintCounter < 1000) {
            constraintCounter++;
        }
    }

    broadcastTelemetryUpdate(computedPayload) {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify({
                action: "REG_WRITE",
                timestamp: Math.floor(Date.now() / 1000),
                payload: {
                    device_target: "ATHENA_GUI_COMPONENT",
                    telemetry_vector: computedPayload
                }
            }));
        }
    }
}

export default AthenaVstComponent;
