import tkinter as tk
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
        self.root.mainloop()

    def launch_modules(self):
        if self.enable_transparent:
            # Launch on Screen 1 (or specify x/y in geometry)
            self.win_transparent = TransparentOLED(self.root, saved_state=False)
            
        if self.enable_status:
            # Launch on Screen 2
            # Note: You must adjust geometry("+1920+0") to move to 2nd monitor
            self.win_status = UnivacStatus(self.root, self.data_handler)

if __name__ == "__main__":
    app = KVMController()
