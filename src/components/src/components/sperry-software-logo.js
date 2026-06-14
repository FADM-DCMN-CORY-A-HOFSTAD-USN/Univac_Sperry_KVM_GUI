/**
 * Genuine Sperry Software Dot-Matrix Loop & Nameplate Logo Module
 * Recreates the exact branding asset from the Windows Outlook utilities.
 */
export class SperrySoftwareLogo {
    static getInlineSvg() {
        return `
            <svg class="sperry-software-branded-logo" viewBox="0 0 240 180" xmlns="http://w3.org" style="width: 140px; height: 105px;">
                <!-- DYNAMIC DOT-MATRIX 'S' WAVE COMPONENT (64-Bit FIELDATA Array Emulation) -->
                <g fill="#002094">
                    <!-- Top Loop Arc Matrix Dots -->
                    <circle cx="95" cy="20" r="2.5" /><circle cx="107" cy="22" r="2.5" /><circle cx="118" cy="26" r="2.5" />
                    <circle cx="84" cy="22" r="2.5" /><circle cx="74" cy="27" r="2.5" /><circle cx="66" cy="35" r="2.5" />
                    <circle cx="60" cy="45" r="2.5" /><circle cx="58" cy="56" r="2.5" /><circle cx="61" cy="67" r="2.5" />
                    <circle cx="68" cy="77" r="2.5" /><circle cx="78" cy="85" r="2.5" /><circle cx="90" cy="90" r="2.5" />
                    
                    <!-- Concentric Inner Accent Matrix Rings -->
                    <circle cx="92" cy="32" r="2" /><circle cx="101" cy="34" r="2" /><circle cx="110" cy="38" r="2" />
                    <circle cx="83" cy="34" r="2" /><circle cx="75" cy="39" r="2" /><circle cx="70" cy="46" r="2" />
                    <circle cx="68" cy="54" r="2" /><circle cx="71" cy="62" r="2" /><circle cx="78" cy="69" r="2" />
                    
                    <!-- Bottom Descending Loop Arc Matrix Dots -->
                    <circle cx="102" cy="94" r="2.5" /><circle cx="114" cy="99" r="2.5" /><circle cx="124" cy="107" r="2.5" />
                    <circle cx="130" cy="118" r="2.5" /><circle cx="132" cy="130" r="2.5" /><circle cx="129" cy="141" r="2.5" />
                    <circle cx="122" cy="151" r="2.5" /><circle cx="112" cy="158" r="2.5" /><circle cx="100" cy="162" r="2.5" />
                    <circle cx="88" cy="163" r="2.5" /><circle cx="76" cy="160" r="2.5" /><circle cx="65" cy="154" r="2.5" />
                    
                    <!-- Concentric Bottom Inner Matrix Rings -->
                    <circle cx="104" cy="106" r="2" /><circle cx="112" cy="112" r="2" /><circle cx="118" cy="120" r="2" />
                    <circle cx="120" cy="129" r="2" /><circle cx="117" cy="138" r="2" /><circle cx="111" cy="145" r="2" />
                    <circle cx="102" cy="149" r="2" /><circle cx="93" cy="149" r="2" />
                </g>

                <!-- SPERRY: Extra-Bold Sans-Serif Italic Corporate Blue (#002094) -->
                <text x="60" y="82" 
                      fill="#002094" 
                      font-family="'Arial Black', 'Impact', sans-serif" 
                      font-size="34" 
                      font-weight="900" 
                      font-style="italic" 
                      letter-spacing="-1">
                    Sperry
                </text>

                <!-- SOFTWARE: Heavy Sans-Serif Italic Signal Crimson Red (#D1172B) -->
                <text x="88" y="118" 
                      fill="#D1172B" 
                      font-family="'Arial Black', 'Impact', sans-serif" 
                      font-size="34" 
                      font-weight="900" 
                      font-style="italic" 
                      letter-spacing="-1">
                    Software
                </text>

                <!-- SUBTITLE: Crisp Medium Sans-Serif Dark Navy (#032E6A) -->
                <text x="88" y="146" 
                      fill="#032E6A" 
                      font-family="'Segoe UI', 'Tahoma', sans-serif" 
                      font-size="13" 
                      font-weight="bold">
                    Professional
                </text>
                <text x="88" y="164" 
                      fill="#032E6A" 
                      font-family="'Segoe UI', 'Tahoma', sans-serif" 
                      font-size="13" 
                      font-weight="bold">
                    Outlook Add-Ins
                </text>
            </svg>
        `;
    }
}
