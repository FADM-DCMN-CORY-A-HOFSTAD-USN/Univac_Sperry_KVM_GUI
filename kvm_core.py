import tkinter as tk
from data_feed import UnivacData
from gui_transparent import TransparentOLED
from gui_status import UnivacStatus
from gui_transparent import TransparentOLED
from gui_status import UnivacStatus
import threading
import time
import asyncio
import websockets
import json

from data_feed import UnivacData
from gui_transparent import TransparentOLED
from gui_status import UnivacStatus

class KVMController:
    def __init__(self):
        self.root = tk.Tk()
        self.root.withdraw() # Hide the main root window, we use Toplevels
        
        self.data_handler = UnivacData()
        
        # Flags to enable/disable modules
        self.enable_transparent = True
        self.enable_status = True
        
        self.launch_modules()
        # Initialize Core Data Engine
        self.data_handler = UnivacData()
        
        # Instantiate Hardware UI Windows
        self.win_transparent = TransparentOLED(self.root, controller=self)
        self.win_status = UnivacStatus(self.root, self.data_handler)
        
        # Bind Transmit Intercept Event to the UI Action Layer
        self.win_transparent.btn_send.config(command=self.execute_transmission_sequence)
        
        # Launch Asynchronous Engine Thread
        self.running = True
        self.data_thread = threading.Thread(target=self.hardware_registry_loop, daemon=True)
        self.data_thread.start()

        # 2. NEW: Launch the WebSocket Server in a background thread
        self.ws_thread = threading.Thread(target=self.start_websocket_broker, daemon=True)
        self.ws_thread.start()
        
        self.root.mainloop()

    # --- NEW WEBSOCKET BROKER METHODS ---
    def start_websocket_broker(self):
        """Initializes the asyncio event loop for the WebSocket server."""
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        # Assuming port 8765, matches our JS client update below
        start_server = websockets.serve(self.ws_handler, "0.0.0.0", 8765)
        print("[UNIVAC BRIDGE] WebSocket Broker listening on ws://0.0.0.0:8765")
        loop.run_until_complete(start_server)
        loop.run_forever()

    async def ws_handler(self, websocket, path):
        """Handles incoming Teletank and Hardware commands from the web UI."""
        try:
            async for message in websocket:
                data = json.loads(message)
                action = data.get("action")
                payload = data.get("payload", {})

                # Intercept the scrolling event
                if action == "KVM_CYCLE":
                    active_mode = payload.get("mode")
                    print(f"[KVM SWAP]: Video routed to -> {active_mode}")
                
                    if active_mode == "CSF_FIREWALL":
                        print("[SECURITY]: Operator viewing live packet filter...")
                        # Optional: Ping WatchGuard API or update local UI status

                if action == "TELETANK_CMD":
                    print(f"[TELETANK DIRECTIVE]: {payload}")
                    # Route this to the Univac-Aegis-bridge logic controllers
                    # e.g., self.data_handler.write_plc(payload['cmd'], payload['val'])

                elif action == "REG_WRITE":
                    print(f"[HARDWARE REG WRITE]: {payload}")

                # Optional: Send telemetry back to the client
                # await websocket.send(json.dumps({"telemetry": self.data_handler.get_sensors()}))

        except websockets.exceptions.ConnectionClosed:
            print("[UNIVAC BRIDGE] Web client disconnected.")

    # ... keep existing launch_modules, hardware_registry_loop, etc. ...

    def launch_modules(self):
        if self.enable_transparent:
            # Launch on Screen 1 (or specify x/y in geometry)
            self.win_transparent = TransparentOLED(self.root, saved_state=False)
            
        if self.enable_status:
            # Launch on Screen 2
            # Note: You must adjust geometry("+1920+0") to move to 2nd monitor
            self.win_status = UnivacStatus(self.root, self.data_handler)
    def hardware_registry_loop(self):
        """Asynchronous execution loop fetching real-time machine gantry variables."""
        while self.running:
            # Poll file structure changes and registry statuses
            sensors = self.data_handler.get_sensors()
            
            # Read gantry save status flag directly from the repository data stack
            # For demonstration, we alternate or hook directly to shallow water warnings
            gantry_saved = not sensors["shallow_water"] 
            
            # Thread-safe pipeline execution to force Tkinter layout redraws
            self.root.after(0, self.win_transparent.update_gantry_status, gantry_saved)
            
            time.sleep(1.0) # Check hardware registry every 1000ms

    def execute_transmission_sequence(self):
        """Action handler executed instantly upon pressing the 3M Blue Send button."""
        print("[UNIVAC TRANSMIT INTERCEPT]: Core telemetry and active console code packaging initiated...")
        
        # Retrieve active data map snapshot
        current_telemetry = self.data_handler.get_sensors()
        recent_commands = self.data_handler.get_typer_commands()
        
        # Packaging payload to pipe out over physical KVM/TTY serial interface
        payload = {
            "timestamp": time.time(),
            "telemetry": current_telemetry,
            "bridge_commands": recent_commands,
            "operator_origin": "LG_55_TRANSPARENT_TOUCH"
        }
        
        print(f"[UNIVAC KVM TRANSMIT SUCCESS]: Payload pushed to gantry pipeline: {payload}")
        
        # Visual click indicator flash routine on the Send button
        self.win_transparent.flash_send_success()

if __name__ == "__main__":
    app = KVMController()
