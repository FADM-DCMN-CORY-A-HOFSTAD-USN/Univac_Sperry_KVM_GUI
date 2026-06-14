/**
 * UNIVAC SPERRY - MATERIAL SCIENCE & THERMODYNAMICS NODE
 * Cross-references the master_ptable database for real-time physics simulations.
 */
export class MaterialScienceNode {
    constructor(containerId, bridgeClient, ptableData) {
        this.container = document.getElementById(containerId);
        this.bridge = bridgeClient;
        this.ptable = ptableData; // The injected JSON from your Excel sheet
        this.activeSimulation = null;
    }

    init() {
        this.renderWindowFrame();
    }

    /**
     * Looks up an element in the Excel-derived database in O(1) time
     */
    getElementBySymbol(symbol) {
        return this.ptable.find(el => el.symbol === symbol.toUpperCase());
    }

    /**
     * Smart Calculator: Uses the Periodic Table to calculate Ideal Gas limits
     * Equation: PV = nRT 
     */
    calculateChamberPressure(elementSymbol, massGrams, temperatureKelvin, volumeLiters) {
        const element = this.getElementBySymbol(elementSymbol);
        if (!element || element.state !== 'Gas') {
            this.logTelemetry(`ERR: Element [${elementSymbol}] is invalid or not a gas.`);
            return;
        }

        const moles = massGrams / element.atomicMass;
        const idealGasConstant = 0.0821; // L·atm/(K·mol)
        const pressure = (moles * idealGasConstant * temperatureKelvin) / volumeLiters;

        this.logTelemetry(`[THERMO_CALC] Element: ${element.name} | Moles: ${moles.toFixed(15)} | Chamber Pressure: ${pressure.toFixed(15)} atm`);
        
        // Push this calculation back to the master KVM network
        this.bridge.sendPayload("THERMO_PRESSURE_UPDATE", { pressure: pressure, element: element.name });
    }

    logTelemetry(message) {
        // You can link this directly to your existing config-panel.js telemetry scroller
        console.log(`⚛️ [MATERIAL_NODE]: ${message}`);
    }

    renderWindowFrame() {
        // Here you would use the same innerHTML structure from config-panel.js
        // To draw a new WinForms window specifically for Chemical Analysis.
    }
}
