import tkinter as tk
from datetime import datetime

class UnivacStatus(tk.Toplevel):
    def __init__(self, parent, data_handler):
        super().__init__(parent)
        self.data = data_handler
        self.title("UNIVAC SYSTEM MONITOR")
        self.geometry("1920x1080") # Adjust for 24.3" native res
        self.configure(bg="#000000")
        
        # 16-Color Palette (CGA/EGA style)
        self.pal = {
            "bg": "#000000", "fg_main": "#AAAAAA", "fg_bright": "#FFFFFF",
            "alert": "#FF5555", "data": "#55FFFF", "dim": "#555555"
        }
        
        self.setup_grid()
        self.update_loop()

    def setup_grid(self):
        # Left Col: Sensors | Right Col: Scroller
        self.columnconfigure(0, weight=1)
        self.columnconfigure(1, weight=2)
        
        # --- SENSOR BLOCK ---
        self.f_sensors = tk.Frame(self, bg=self.pal["bg"])
        self.f_sensors.grid(row=0, column=0, sticky="nsew", padx=20, pady=20)
        
        self.sensor_labels = {}
        keys = ["DATE", "TEMP_INT", "ENTRIES/SEC", "SHALLOW_WATER", 
                "VIBRATION", "AMPLITUDE", "VOLTAGE", "SCOTS_TRACKER"]
        
        for idx, key in enumerate(keys):
            lbl_title = tk.Label(self.f_sensors, text=key, fg=self.pal["dim"], bg="black", 
                                 font=("Terminal", 16), anchor="w")
            lbl_title.grid(row=idx, column=0, sticky="ew", pady=5)
            
            lbl_val = tk.Label(self.f_sensors, text="---", fg=self.pal["data"], bg="black", 
                               font=("Terminal", 20, "bold"), anchor="e")
            lbl_val.grid(row=idx, column=1, sticky="ew", pady=5)
            self.sensor_labels[key] = lbl_val

        # --- SCROLLING LOG ---
        self.f_log = tk.Frame(self, bg="#0000AA") # Classic DOS Blue background option
        self.f_log.grid(row=0, column=1, sticky="nsew", padx=20, pady=20)
        
        lbl_head = tk.Label(self.f_log, text="DISCOVERIES / FORMULAS / COMMANDS", 
                            bg="#FFFFFF", fg="#0000AA", font=("Terminal", 14, "bold"))
        lbl_head.pack(fill="x")
        
        self.txt_log = tk.Text(self.f_log, bg="#0000AA", fg="white", font=("Fixedsys", 12),
                               relief="flat", height=40)
        self.txt_log.pack(fill="both", expand=True)

    def update_loop(self):
        # Update Sensors
        sensors = self.data.get_sensors()
        now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        
        self.sensor_labels["DATE"].config(text=now)
        self.sensor_labels["TEMP_INT"].config(text=f"{sensors['temp_interior']:.1f}°F")
        self.sensor_labels["ENTRIES/SEC"].config(text=str(sensors['entries_per_sec']))
        self.sensor_labels["SHALLOW_WATER"].config(
            text="DETECTED" if sensors['shallow_water'] else "CLEAR",
            fg=self.pal["alert"] if sensors['shallow_water'] else self.pal["data"]
        )
        self.sensor_labels["VIBRATION"].config(text=f"{sensors['vibration']:.2f} Hz")
        self.sensor_labels["AMPLITUDE"].config(text=f"{sensors['amplitude']:.1f} Pwr")
        self.sensor_labels["VOLTAGE"].config(text=f"{sensors['voltage']:.1f} V")
        self.sensor_labels["SCOTS_TRACKER"].config(text=sensors['scots_tracker'])
        
        # Refresh Log (every 5 seconds roughly, here just appending)
        # Ideally, clear and redraw or just append new lines
        self.update_log_content()
        
        self.after(1000, self.update_loop)

    def update_log_content(self):
        self.txt_log.delete(1.0, tk.END)
        
        self.txt_log.insert(tk.END, "=== RECENT TYPER COMMANDS ===\n")
        for cmd in self.data.get_typer_commands():
            self.txt_log.insert(tk.END, f"> {cmd}\n")
            
        self.txt_log.insert(tk.END, "\n=== DOCS QUESTIONS ===\n")
        for q in self.data.scan_docs_questions():
            self.txt_log.insert(tk.END, f"? {q}\n")
            
        self.txt_log.insert(tk.END, "\n=== CONVERSIONS ===\n")
        self.txt_log.insert(tk.END, "1 Fathom = 6 Feet\n1 Knot = 1.15 MPH\n")
