/**
 * Sperry Univac Museum History Matrix Data Map
 * Extracted directly from museum_history_matrix.py
 */
export const MuseumHistoryMatrix = {
    "NVIDIA_TITAN_NODE": {
        node_name: "NVIDIA Titan Compute Array",
        location: "Primary Tactical Compute Layer",
        priority_weight: 10,
        cycle_multiplier: "1.0",
        system_id: "NV-TITAN-X",
        telecom_class: "HIGH_PRIORITY_BURST"
    },
    "UNIVAC_1108_CORE": {
        node_name: "Sperry Univac 1108 Console",
        location: "Mainframe Hall B (Museum Display Track)",
        priority_weight: 5,
        cycle_multiplier: "12.0",
        system_id: "U1108-MP",
        telecom_class: "STANDARD_TELEGRAM"
    },
    "UNIVAC_1218_MILITARY": {
        node_name: "Univac 1218 (MTC-16 Marine Variant)",
        location: "Shipboard Communication Bay",
        priority_weight: 8,
        cycle_multiplier: "4.5",
        system_id: "U1218-USN",
        telecom_class: "MIL_SPEC_ENCRYPTED"
    },
    "AN_SPY_1_RADAR_BRIDGE": {
        node_name: "AN/SPY-1 Radar Automation Node",
        location: "Aegis Combat System Interleaved Core",
        priority_weight: 9,
        cycle_multiplier: "2.0",
        system_id: "AEGIS-SPY1",
        telecom_class: "REAL_TIME_STREAMING"
    }
};
