import { UnivacBridgeClient } from '.../src/core/bridge-client.js';

// Initialize the bridge (pointing to the port we opened in Python)
const bridge = new UnivacBridgeClient('ws://localhost:8765');
bridge.connect();

// Listen for connection status
bridge.registerStatusListener((status) => {
    document.getElementById('connection-status').innerText = status;
});

// Create a helper for Teletank Commands
bridge.sendTeletankCommand = function(command, value) {
    return this.sendPayload("TELETANK_CMD", {
        cmd: command,
        val: value
    });
};

// Wire up your VST switches/knobs (Example)
document.getElementById('btn-hard-left').addEventListener('click', () => {
    bridge.sendTeletankCommand("STEERING", "HARD_LEFT");
});

document.getElementById('btn-smoke-screen').addEventListener('click', () => {
    bridge.sendTeletankCommand("TACTICAL", "DEPLOY_SMOKE");
});
