export const UnivacMorseInstructions = [
    // --- LOAD OPERATORS (Latin-Morse representations mapped strictly to instruction profiles) ---
    { mnemonic: 'L',   op: '10', description: 'Load Accumulator', latin_morse: ".-.." },
    { mnemonic: 'LN',  op: '11', description: 'Load Negative Accumulator', latin_morse: ".-.. -." },
    { mnemonic: 'LM',  op: '12', description: 'Load Magnitude Accumulator', latin_morse: ".-.. --" },
    { mnemonic: 'LR',  op: '13', description: 'Load R-Register', latin_morse: ".-.. .-." },
    
    // --- ARITHMETIC OPERATORS ---
    { mnemonic: 'A',   op: '20', description: 'Add Memory to Accumulator', latin_morse: ".-" },
    { mnemonic: 'S',   op: '21', description: 'Subtract Memory from Accumulator', latin_morse: "..." },
    { mnemonic: 'M',   op: '22', description: 'Multiply Memory with R-Register', latin_morse: "--" },
    { mnemonic: 'D',   op: '23', description: 'Divide Accumulator by Memory', latin_morse: "-.." },
    
    // --- STORE OPERATORS ---
    { mnemonic: 'ST',  op: '30', description: 'Store Accumulator to Memory Location', latin_morse: "... -" },
    { mnemonic: 'STR', op: '31', description: 'Store R-Register to Memory Location', latin_morse: "... .-." },
    
    // --- JUMP / LOGIC OPERATORS ---
    { mnemonic: 'J',   op: '40', description: 'Unconditional Jump Vector', latin_morse: ".---" },
    { mnemonic: 'JZ',  op: '41', description: 'Jump if Accumulator Is Equal to Zero', latin_morse: ".--- --.." },
    { mnemonic: 'JP',  op: '42', description: 'Jump if Accumulator Is Positive Sign', latin_morse: ".--- .--." },
    
    // --- SYSTEM CONTROL / PERIPHERAL INPUT APPLIANCES ---
    { mnemonic: 'IOW', op: '50', description: 'Input Output Write Telegram Block Out', latin_morse: ".. --- .--" },
    { mnemonic: 'IOR', op: '51', description: 'Input Output Read Stream In from Bridge', latin_morse: ".. --- .-." },
    { mnemonic: 'HALT',op: '77', description: 'Halt Processing Core Cycle Engine Clock', latin_morse: ".... .- .-.. -" }
];
