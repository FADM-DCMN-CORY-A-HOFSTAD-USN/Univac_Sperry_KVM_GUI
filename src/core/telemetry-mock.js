/**
 * Sperry Mainframe Telemetry Simulator & Network Error Test Bench
 */
export class MainframeTelemetryMock {
    constructor(bridgeClientInstance, tuiScreenInstance) {
        this.bridge = bridgeClientInstance;
        this.tui = tuiScreenInstance;
        
        this.simulationInterval = null;
        this.networkCondition = 'STABLE'; // 'STABLE' | 'UNSTABLE' | 'DEAD'
        this.packetLossRate = 0.0;        // Percentage between 0.0 and 1.0
    }

    /**
     * Boots the simulation background ticks
     */
    start() {
        console.log("🎮 Mainframe Telemetry Simulation engine active. Network Test Bench initialized.");
        
        // Simulate continuous downstream register ticks from an online Univac 1100/80
        // Add this continuous execution block inside your simulation interval loop:
    setInterval(() => {
        if (this.networkCondition === 'DEAD') return;

        // Simulate flight data drifting variables
        const mockHeading = (Date.now() / 1000) % 360; 
        const mockPitch = Math.sin(Date.now() / 5000) * 3.5;
        const mockRoll = Math.cos(Date.now() / 4000) * 8.2;
        const mockGyroError = -1.25 + Math.sin(Date.now() / 10000) * 0.5;

        this.bridge.onMessageCallbacks.forEach(callback => {
            callback({
                action: "AVIATION_COMPASS_STREAM",
                payload: {
                    heading: mockHeading,
                    pitch: mockPitch,
                    roll: mockRoll,
                    gyro_error: mockGyroError
                }
            });
        });
    }, 1500); // Push updates to the compass display panel every 1.5 seconds

        this.hijackBridgeTransmissions();
    }

    /**
     * Intercepts outbound buffers to dynamically force transmission failures
     */
    hijackBridgeTransmissions() {
        const originalXmit = this.bridge.sendBlockModeBurst.bind(this.bridge);

        this.bridge.sendBlockModeBurst = async (fieldsArray) => {
            // Test Rule 1: Link is completely dead
            if (this.networkCondition === 'DEAD') {
                await new Promise((_, reject) => setTimeout(() => reject(new Error("Link broken")), 600));
                throw new Error("KVM Link Broken");
            }

            // Test Rule 2: Intermittent frame loss spikes
            if (this.networkCondition === 'UNSTABLE' && Math.random() > 0.4) {
                await new Promise((_, reject) => setTimeout(() => reject(new Error("Frame timeout")), 1200));
                throw new Error("Frame Timeout Error");
            }

            // Standard operation pass-through simulation delay
            await new Promise(resolve => setTimeout(resolve, 400));
            return originalXmit(fieldsArray);
        };
    }

    /**
     * Updates the testing network state profile directly
     */
    setNetworkProfile(profileName) {
        this.networkCondition = profileName;
        console.log(`Tester changed network condition profile to: [${profileName}]`);

        switch (profileName) {
            case 'STABLE':
                this.packetLossRate = 0.0;
                this.bridge.updateStatus('ONLINE / LINKED');
                break;
            case 'UNSTABLE':
                this.packetLossRate = 0.65; // 65% artificial collision drops
                this.bridge.updateStatus('CONNECTING...');
                break;
            case 'DEAD':
                this.packetLossRate = 1.0;
                this.bridge.updateStatus('OFFLINE - RETRYING');
                break;
        }
    }
}
