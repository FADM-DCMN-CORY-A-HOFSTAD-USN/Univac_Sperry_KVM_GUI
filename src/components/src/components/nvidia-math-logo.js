/**
 * Historic NVIDIA 1993-2006 Math & Typography Logo Module
 * Employs exact corporate color token rgb(196, 214, 77)
 */
export class HistoricNvidiaLogo {
    static getInlineSvg() {
        return `
            <svg class="nv-historic-math-logo" viewBox="0 0 200 120" xmlns="http://w3.org" style="width: 110px; height: 66px;">
                <!-- Mathematical Claw/Spiral All-Seeing Eye Coordinate Maps -->
                <g fill="none" stroke="rgb(196, 214, 77)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                    <!-- Outer Shell Ring Arc Segment -->
                    <path d="M 30,50 Q 55,15 90,20 Q 110,22 125,35" />
                    <!-- Mid Spiral Cam Helix Curve -->
                    <path d="M 45,55 Q 65,30 92,34 Q 110,36 115,55" />
                    <!-- Inner Focal Center Core Segment -->
                    <path d="M 62,60 Q 75,46 92,48 Q 98,50 99,62" />
                    
                    <!-- Sharp Inverse Cross-Hatch Claw Stencil Cuts -->
                    <path d="M 35,25 L 50,45" />
                    <path d="M 60,18 L 72,40" />
                    <path d="M 88,15 L 92,38" />
                    <path d="M 115,20 L 108,42" />
                </g>
                
                <!-- Under-Slung Typewriter Wordmark featuring the Cursive '𝘯' -->
                <text x="18" y="102" 
                      fill="rgb(196, 214, 77)" 
                      font-family="'Courier New', 'Courier', monospace" 
                      font-size="21" 
                      font-weight="bold" 
                      letter-spacing="1">
                    <tspan font-style="italic" font-family="Georgia, 'Times New Roman', serif" font-weight="normal">𝘯</tspan>VIDIA
                </text>
            </svg>
        `;
    }
}
