import re
import tkinter as tk
from components.univac_math_logo import UnivacMathLogo

class TransparentOLED(tk.Toplevel):
    def __init__(self, parent, controller):
        super().__init__(parent)
        self.controller = controller
        self.title("LG 55 T-OLED Operator Console Frame")
        self.geometry("1920x1080+0+0")
        self.overrideredirect(True) 
        
        # Rigorous Chromatic Palette Setup
        self.c_univac_grey = "#D3D3D3"
        self.c_tape_blue   = "#1D70B8"  # Exact 3M ScotchBlue match
        self.c_alert_red   = "#FF0000"
        self.c_safe_green  = "#00FF00"
        
        self.configure(bg=self.c_univac_grey)
        self.create_layout()

    def create_layout(self):
        # --- 1. Top Ribbon Machine Code Status Gantry Indicator ---
        # Default initialization state to unsafe until register checks complete
        self.lbl_status = tk.Label(
            self, text="0", bg=self.c_alert_red, fg="#FFFFFF", 
            font=("Courier", 32, "bold"), height=2
        )
        self.lbl_status.pack(side="top", fill="x")

        # --- 2. Middle Operational Viewport Array ---
        container = tk.Frame(self, bg=self.c_univac_grey)
        container.pack(expand=True, fill="both")
        
        # Left Split Operator Input Array
        f_left = tk.Frame(container, bg=self.c_univac_grey)
        f_left.pack(side="left", fill="y", padx=40, pady=20)
        self.build_keypad(f_left, ["A","B","C","D","E","F","G","H","I","J","K","L","M","0","1","2","3","4"])

        # Center Column Stack
        f_center_stack = tk.Frame(container, bg=self.c_univac_grey)
        f_center_stack.pack(side="left", padx=10, fill="y")
        tk.Frame(f_center_stack, bg=self.c_univac_grey, height=25).pack()

        # Core 701x701 Pixel KVM Square Window Frame Boundary
        self.kvm_hole = tk.Frame(f_center_stack, bg="#000000", width=701, height=701)
        self.kvm_hole.pack(side="top")
        self.kvm_hole.pack_propagate(False)
        
        lbl_insert = tk.Label(
            self.kvm_hole, text="EXISTING KVM HOLE BOUNDARY\n(17.39\" x 17.39\")", 
            fg="#444444", bg="#000000", font=("Arial", 14)
        )
        lbl_insert.place(relx=0.5, rely=0.5, anchor="center")

        # Consolidated Canvas Context Box for Math Logo
        self.logo_canvas = tk.Canvas(f_center_stack, width=701, height=70, bg=self.c_univac_grey, highlightthickness=0)
        self.logo_canvas.pack(side="top", pady=10)
        self.parse_and_render_math_svg(canvas=self.logo_canvas, offset_x=175)

        # Right Split Operator Input Array
        f_right = tk.Frame(container, bg=self.c_univac_grey)
        f_right.pack(side="left", fill="y", padx=40, pady=20)
        self.build_keypad(f_right, ["N","O","P","Q","R","S","T","U","V","W","X","Y","Z","5","6","7","8","9"])

        # --- 3. Base Transmit Edge Ribbon ---
        # Expose button handle to controller context mapping loop
        self.btn_send = tk.Button(
            self, text="SEND", bg=self.c_tape_blue, fg="#FFFFFF",
            font=("Helvetica", 24, "bold"), height=2, relief="flat",
            activebackground=self.c_tape_blue, activeforeground="#FFFFFF"
        )
        self.btn_send.pack(side="bottom", fill="x")

    def update_gantry_status(self, is_saved):
        """Pipes live registry state flag changes directly into the visual window grid."""
        if is_saved:
            self.lbl_status.config(text="1", bg=self.c_safe_green, fg="#000000")
        else:
            self.lbl_status.config(text="0", bg=self.c_alert_red, fg="#FFFFFF")

    def flash_send_success(self):
        """Provides tactile/visual interface confirmation upon execution processing."""
        self.btn_send.config(bg="#FFFFFF", fg=self.c_tape_blue, text="TRANSMITTING...")
        self.after(250, lambda: self.btn_send.config(bg=self.c_tape_blue, fg="#FFFFFF", text="SEND"))

    def build_keypad(self, parent, chars):
        for i, char in enumerate(chars):
            row = i // 3
            col = i % 3
            btn = tk.Button(
                parent, text=char, width=5, height=2, 
                font=("Courier", 16, "bold"), bg="#E0E0E0", fg="#000000",
                relief="raised", borderwidth=3
            )
            btn.grid(row=row, column=col, padx=8, pady=8)

    def parse_and_render_math_svg(self, canvas, offset_x=175):
        svg_string = UnivacMathLogo.get_inline_svg()
        paths = re.findall(r'd="([^"]+)"', svg_string)
        stroke_color = "#111111"
        for path in paths:
            tokens = path.split()
            i = 0
            current_poly = []
            while i < len(tokens):
                cmd = tokens[i]
                if cmd == 'M' or cmd == 'L':
                    coords = tokens[i+1].split(',')
                    x = float(coords[0]) + offset_x
                    y = float(coords[1])
                    current_poly.append((x, y))
                    i += 2
                elif cmd == 'Q':
                    ctrl = tokens[i+1].split(',')
                    end = tokens[i+2].split(',')
                    cx = float(ctrl[0]) + offset_x
                    cy = float(ctrl[1])
                    ex = float(end[0]) + offset_x
                    ey = float(end[1])
                    if current_poly:
                        sx, sy = current_poly[-1]
                        for t in range(1, 11):
                            percent = t / 10.0
                            bx = (1-percent)**2 * sx + 2*(1-percent)*percent * cx + percent**2 * ex
                            by = (1-percent)**2 * sy + 2*(1-percent)*percent * cy + percent**2 * ey
                            current_poly.append((bx, by))
                    i += 3
                else:
                    i += 1
            for idx in range(len(current_poly) - 1):
                canvas.create_line(current_poly[idx], current_poly[idx+1], 
                                   width=4, fill=stroke_color, capstyle="round", joinstyle="miter")
