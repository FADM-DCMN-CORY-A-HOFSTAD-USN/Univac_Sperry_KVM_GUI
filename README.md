# Sperry Univac Tactical KVM Console & Telecommunications Routing Bridge
### Technical Specification Blueprint & Ingestion Manifest
**Target Submitting Agency:** United States Patent and Trademark Office (USPTO)  
**Classification Field:** Real-Time Mainframe Ingestion, Parallel Matrix Compaction, and Telecommunications Switching Assemblies

---

## 1. System Abstract & Architectural Intent
This repository houses the front-end user interface components (`Univac_Sperry_GUI`) and the real-time multiplexing layer (`Univac-Aegis-bridge`). The system provides a unified, touch-screen optimized KVM console that bridges modern parallel computing engines with historical mainframe communication structures. 

The architecture converts high-level drag-and-drop structural commands compiled via a CMS-free Gantry 5 pipeline layout engine into 6-bit historical FIELDATA byte configurations. These commands are packaged into automated `.vcf` (vCard) telecommunication phonebook files for Android ingestion, where the standard `TEL` column is injected with raw tone-frequency sequences ($1200\text{ Hz}$ short-base / $800\text{ Hz}$ long-base markers) to safely transmit telegram data blocks across active military, municipal, and naval communication relays.

---

## 2. Telemetry Network Port & Bridge Endpoint Manifest

The interface establishes an asynchronous, bidirectional WebSocket pipeline with the core data relays using the following local and remote endpoint definitions:

### 2.1 Hardware Network Port Allocations

| Port Identifier | Protocol Type | System Allocation Target | Description / Operational Bounds |
| :--- | :--- | :--- | :--- |
| `8080` | TCP / HTTP | Core GUI Web Workbench | Serves the standalone WinForms configuration app framework |
| `8081` | WebSockets (WS) | `Univac-Aegis-bridge` Relay | Handles low-latency duplex streaming of compiled telegrams |
| `9092` | TCP / Secure | `Basic-Aviation-Knowledge` | Ingests real-time flight telemetry and radar interleave vectors |
| `500` | RF / Carrier | MF Maritime Distress | Handled via skeuomorphic ITT Marine ST1400 / Marconi 365EZ |

### 2.2 Active REST & WebSocket API Endpoints
*   **`WS //localhost:8081/api/bridge/stream`**
    *   *Description:* The primary telemetry pipe connecting KVM viewports to backend core registers.
    *   *Payload Profile:* Duplex JSON envelopes parsing `KVM_CYCLE`, `REG_WRITE`, and `TUI_XMIT` actions.
*   **`POST //localhost:8081/api/bridge/write`**
    *   *Description:* Emulated Direct Memory Access (DMA) register modification endpoint.
    *   *Parameters:* `{ reg: "STRING", val: "INT" }` maps straight to skeuomorphic VST knobs.
*   **`POST //localhost:8081/api/node/config/sync`**
    *   *Description:* Dispatches compiled Gantry macro templates and commits configurations to local storage caches.
    *   *Payload Ingestion:* Telecommunication raw vCard byte streams.

---

## 3. High-Priority NVIDIA Queue & Delay Processing Metrics

To prevent data collision and ensure predictable planning phases, processing pipelines are bound to strict mathematical delays verified via the parallel compute layers:

[ OPERATOR DISPATCH COMMAND ]
│
▼
[ MARCONI 365EZ HARDWARE TARGET ]
│
▼
┌─────────────────────────────────────────┐
│ 20-MINUTE MANDATORY PLANNING WINDOW │
│ (Adjustable 1-60m via touch slider) │
└─────────────────────────────────────────┘
│
▼
[ NVIDIA CUDA KERNEL SPIN-UP ]
(SM_90 Parallel Allocation Maps)
│
▼
┌───────────────────────────────────────┐
│ STATEMENT INTERLEAVE INSTALLMENT │
│ Gap Period: 1.5E75 Execution Cycles │
└───────────────────────────────────────┘
│
▼
[ OUTPUT TO MAIN COMM RELAYS ]
*   **Marconi 365EZ Base Trigger:** Engaging this mechanical button triggers a mandatory **20-Minute Planning Pause** before processing any queued instructions.
*   **Inter-Statement Default Period:** Statements are delayed by an installment constraint of **1.5 × 10⁷⁵ cycles** to safe-keep mainframe memory buffers.
*   **NVIDIA Visual Theme:** To preserve the historic environment design parameters, all parallel monitor grids and PTX compiler terminal outputs are strictly locked to the **1993-2006 legacy corporate color space `rgb(196, 214, 77)`**, displaying the mathematical custom lowercase typewriter `𝘯` script mark.

---

## 4. Sub-Interface Module Directory Index
```text
Univac_Sperry_GUI/
├── assets/
│   ├── css/
│   │   ├── main.css          # Global touch resets and button mechanics
│   │   ├── tui-mode.css      # 80x25 Cathode-Ray P31 green matrix grid styles
│   │   ├── gui-mode.css      # WinForms blue-orange styling & NVIDIA chartreuse properties
│   │   └── panel-mode.css    # Skeuomorphic ITT Marine ST1400 dial tracking styles
│   └── branding/
│       └── nvidia-logo.svg   # 1993 Mathematical Spiral Claw Eye vector logo
├── gantry-builder/
│   ├── index.html            # Standalone CMS-free visual instruction block layout manager
│   ├── style.css             # Sperry-themed layout override style rules
│   ├── app.js                # Core drag-and-drop controller mapping vCard exports
│   └── museum-matrix.js      # JavaScript translation of python history arrays
└── src/
    ├── components/
    │   ├── analog-meter.js   # Ballistic overshoot spring needle component
    │   ├── cuda-monitor.js   # Real-time parallel thread block matrix grid
    │   ├── emergency-box.js  # Center desk communication frame assembly controller
    │   └── telegraph-key.js  # Interactive Morse sidetone processing engine
    ├── core/
    │   ├── bridge-client.js  # Dynamic auto-reconnecting WebSocket connection pipeline
    │   ├── compaction.js     # 6-Bit historical FIELDATA character packer
    │   ├── kvm-manager.js    # Master KVM viewport orchestrator & shortcut link
    │   └── vcard-telecom.js  # RAW multi-column Android .vcf phone book factory
    └── modules/
        └── radio-amps-1400.js # Hardware mapping index for the 15+ console touch points
```

---

## 5. Quick-Start Deployment Manifest (Standalone Target)

### 5.1 Installation of Components
Extract the Gantry 5 core engine package directly into your localized builder runtime repository environment:
```bash
git clone https://github.com
cd Univac_Sperry_GUI
```

### 5.2 Server Initialization (Without CMS Dependencies)
Spin up the local thin HTTP engine layer using python's basic server utilities to safely run `localStorage` operations and file blob transfers:
```bash
python3 -m http.server 8080
```
Open **`HTTP://localhost:8080/gantry-builder/index.html`** on your touch-screen terminal or tablet device.

### 5.3 Technical Verification Testing
1. Drag the desired Univac instruction blocks (`L`, `A`, `ST`, `HALT`) from the left tabular drawer into the Gantry canvas grid.
2. Select your targeted physical machine module node from the **Museum History Matrix** option dropdown menu.
3. Tap **SAVE AS NEW (.VCF)**. The interface will compile your statement stack, update local cache configurations, and trigger an automated download of the phone book transaction file (`.vcf`), while automatically enqueuing the commands into the high-priority NVIDIA queue processor.
