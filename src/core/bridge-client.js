/**
 * Univac Aegis Bridge WebSocket client pipeline.
 * Manages low-latency duplex streaming for TUI buffers, KVM swaps, and VST register writes.
 */
export class UnivacBridgeClient {
    constructor(bridgeUrl = `ws://${window.location.host}/api/bridge/stream`) {
        this.bridgeUrl = bridgeUrl;
        this.socket = null;
        this.reconnectTimeout = 3000;
        this.onMessageCallbacks = new Set();
        this.statusIndicatorCallback = null;
    }

    /**
     * Spawns the socket handle connection.
     */
    connect() {
        console.log(`🔌 Attempting link with Univac Aegis Bridge at: ${this.bridgeUrl}`);
        this.updateStatus("CONNECTING...");

        try {
            this.socket = new WebSocket(this.bridgeUrl);

            this.socket.onopen = () => {
                console.log("Live connection established with Univac Aegis Bridge.");
                this.updateStatus("ONLINE / LINKED");
            };

            this.socket.onmessage = (event) => {
                try {
                    const payload = JSON.parse(event.data);
                    this.onMessageCallbacks.forEach(callback => callback(payload));
                } catch (err) {
                    console.warn("Received non-JSON text stream line from bridge:", event.data);
                }
            };

            this.socket.onclose = () => {
                console.warn("Disconnected from bridge. Initiating automatic retry loop...");
                this.updateStatus("OFFLINE - RETRYING");
                setTimeout(() => this.connect(), this.reconnectTimeout);
            };

            this.socket.onerror = (error) => {
                console.error("Bridge connection fault observed:", error);
                this.socket.close();
            };

        } catch (fatalErr) {
            console.error("Socket initialization failed:", fatalErr);
            setTimeout(() => this.connect(), this.reconnectTimeout);
        }
    }

    /**
     * Binds a system status listener to mirror connection states on the UI.
     */
    registerStatusListener(callback) {
        this.statusIndicatorCallback = callback;
    }

    updateStatus(statusString) {
        if (this.statusIndicatorCallback) {
            this.statusIndicatorCallback(statusString);
        }
    }

    /**
     * Intercepts incoming messages from the bridge.
     */
    registerMessageListener(callback) {
        this.onMessageCallbacks.add(callback);
    }

    /**
     * Sends structural network payloads securely.
     */
    sendPayload(actionType, dataMap) {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            const envelope = {
                timestamp: Date.now(),
                action: actionType,
                payload: dataMap
            };
            this.socket.send(JSON.stringify(envelope));
            return true;
        }
        console.error(`Cannot transmit packet. Socket is currently down. Dropped action: ${actionType}`);
        return false;
    }

    /**
     * Action 1: Transmit KVM Input Switching Event
     */
    sendKvmCycleEvent(activeModeIndex, modeLabel) {
        return this.sendPayload("KVM_CYCLE", {
            index: activeModeIndex,
            mode: modeLabel
        });
    }

    /**
     * Action 2: Transmit Skeuomorphic Dial/Switch Register Alterations
     */
    writeHardwareAddress(registerKey, numericalState) {
        return this.sendPayload("REG_WRITE", {
            reg: registerKey,
            val: numericalState
        });
    }

    /**
     * Action 3: Transmit Local Sperry TUI Unprotected Screen Buffer Forms Block
     */
    async sendBlockModeBurst(fieldsArray) {
        const success = this.sendPayload("TUI_XMIT", {
            fields: fieldsArray
        });
        
        if (!success) throw new Error("Socket disconnected");
        return true;
    }
}
