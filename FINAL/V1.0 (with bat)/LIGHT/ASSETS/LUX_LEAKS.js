const blessed = require('blessed');
const fs = require('fs');
const path = require('path');
const os = require('os');

const screen = blessed.screen({ 
    smartCSR: true, 
    title: 'LUX-4_INTERNAL_FILES_REDACTED' 
});

const logBox = blessed.box({
    parent: screen, 
    top: 0, 
    left: 0, 
    width: '100%', 
    height: '100%',
    style: { fg: 'white', bg: 'black' },
    scrollable: true, 
    alwaysScroll: true,
    tags: true, 
    border: { type: 'line', fg: 'red' },
    label: ' CLASSIFIED: PROJECT FADE (1999) '
});

const leakText = `
{red-fg}LUX-4 ENERGY CORP - INTERNAL AUDIT - OCTOBER 1999{/red-fg}
--------------------------------------------------
{bold}SUBJECT:{/bold} Artificial Energy Scarcity via "The Fade" Protocol.

{bold}EXECUTIVE SUMMARY:{/bold}
The "Fade" was not an accident. It was a calculated release of high-frequency
necro-static into the city grid. 

{bold}THE STRATEGY:{/bold}
1. Create a global panic where electricity itself feels "haunted" and unstable.
2. Market the LUX-4 "Anti-Fade Shielding" as the only solution for survival.
3. Subscription-based life. To have light is to pay LUX-4. Forever.

{bold}CASUALTIES:{/bold}
Approx. 450,000 citizens "digitally evaporated" during the first pulse. 
Their neural patterns are currently being used as {yellow-fg}Processing Power{/yellow-fg} 
for our mainframes. 

{bold}CONCLUSION:{/bold}
The experiment was a total success. Profit margins increased by 4,000%.
The souls in the grid are stable batteries.

[END OF FILE]
--------------------------------------------------
{center}PRESS [S] TO EXPORT DATA TO DESKTOP | PRESS [ESC] TO EXIT{/center}
`;

logBox.setContent(leakText);

// --- SAVE ACTION ---
screen.key(['s'], () => {
    fs.writeFileSync('../ACHIEVEMENTS/LEAK_SAVED.ACH', 'COMPLETED')
    const desktop = path.join(os.homedir(), 'Desktop', 'LUX_CONFIDENTIAL_LEAK.txt');
    
    // Formatting the plain text for the .txt file
    const fileContent = `LUX-4 INTERNAL AUDIT - PROJECT FADE (1999)
--------------------------------------------------
The Fade was a calculated release of necro-static. 
450,000 citizens used as processing power.
Goal: Market digital dependency as the only survival.

[SYSTEM-LOG]: USE THE FOLLOWING KEY FOR ADMINISTRATIVE OVERRIDE.
[SECURITY-CODE-ALTERNATIVE]: LUX4LIFE
--------------------------------------------------`;
    
    try {
        fs.writeFileSync(desktop, fileContent);
        
        // Visual feedback inside the terminal
        logBox.setContent(leakText + "\n\n{yellow-fg}DATA EXPORTED TO DESKTOP. DISCONNECT TO PROCEED.{/yellow-fg}");
        screen.render();
    } catch (e) {
        // Silent fail
    }
});

// --- EXIT ACTION ---
screen.key(['escape', 'q', 'C-c'], () => {
    process.exit(0);
});

screen.render();