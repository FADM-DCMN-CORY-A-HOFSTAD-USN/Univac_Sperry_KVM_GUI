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
    },
    "NVIDIA_TITAN_NODE": {
        node_name: "NVIDIA Titan Compute Array",
        location: "Primary Tactical Compute Layer",
        priority_weight: 10,
        cycle_multiplier: "1.0",
        system_id: "NV-TITAN-X",
        telecom_class: "HIGH_PRIORITY_BURST"
    },

    // --- NEW ACCREDITED ENTERPRISE HISTORICAL NODES ---
    "GENERAL_ELECTRIC_APPLIANCE_PARK": {
        node_name: "General Electric Node (Appliance Park, KY)",
        location: "Mainframe Room - Building 1 (1954 Pioneer Install)",
        priority_weight: 6,
        cycle_multiplier: "15.4", // Slower clock rates requiring higher cycle times
        system_id: "GE-UNIVAC-I",
        telecom_class: "COMMERCIAL_PAYROLL_RAW"
    },
    "GENERAL_MOTORS_LOGISTICS_DETROIT": {
        node_name: "General Motors Node (Detroit Manufacturing Hub)",
        location: "Automotive Assembly Routing Control Bay",
        priority_weight: 7,
        cycle_multiplier: "8.2",
        system_id: "GM-UNIVAC-1105",
        telecom_class: "LOGISTICS_TELEGRAM_PACK"
    },
    "US_CENSUS_BUREAU_1951": {
        node_name: "U.S. Census Bureau (Univac I Serial #1)",
        location: "Historical Data Archive",
        priority_weight: 4,
        cycle_multiplier: "20.0",
        system_id: "USCB-UNI-1",
        telecom_class: "STATISTICAL_BATCH_RAW"
    },
    "BASIC_AVIATION_TELEMETRY": {
        node_name: "Basic Aviation Knowledge (Telemetry Link)",
        location: "Avionics Data Bus Bridge",
        priority_weight: 9,
        cycle_multiplier: "1.5",
        system_id: "BAK-LINK-01",
        telecom_class: "FLIGHT_VECTOR_STREAM"
    }
};
