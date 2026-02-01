const blessed = require('blessed');
const fs = require('fs');
const { exec, spawn } = require('child_process');
const path = require('path');
const os = require('os');
// --- CONFIGURATION LOADING ---
let COLOR_HEX = '#ff0000';
try {
    COLOR_HEX = fs.readFileSync('../CONFIG/COLORDEFAULT.txt', 'utf8').trim();
} catch (e) {}

// Paths for the File Puzzle (USING DOCUMENTS TO AVOID ADMIN PRIVILEGES)
const desktopPath = path.join(os.homedir(), 'Desktop', 'PASSWORD_ACCESS_FOLDER');
const rootPassPath = path.join(os.homedir(), 'Documents', 'passwordjob.txt');
const passwordValue = "L1GHT_SYST3M_0000_X_TR4NSM1SS1ON_S3CUR1TY_V3R1F13D_50";

const filesToClean = [
    './TERMINALACCESS/ACESSOSTATUS.LIGHT',
    './TERMINALACCESS/MEMORY_1999.bin',
    './TERMINALACCESS/GAMEOVER.status',
    './TERMINALACCESS/TERMINAL_ACTIVE.status'
];

filesToClean.forEach(file => {
    if (fs.existsSync(file)) fs.unlinkSync(file);
});

// Function to clear puzzle traces
function clearPuzzle() {
    if (fs.existsSync(rootPassPath)) try { fs.unlinkSync(rootPassPath); } catch(e) {}
    if (fs.existsSync(desktopPath)) {
        try {
            const files = fs.readdirSync(desktopPath);
            files.forEach(f => fs.unlinkSync(path.join(desktopPath, f)));
            fs.rmdirSync(desktopPath);
        } catch(e) {}
    }
}

// --- SCREEN SETUP ---
const screen = blessed.screen({
    smartCSR: true,
    title: 'LIGHT',
    fullUnicode: true
});

const style = {
    fg: COLOR_HEX,
    bg: 'black',
    border: { fg: COLOR_HEX },
    hover: { bg: COLOR_HEX, fg: 'black' },
    selected: { bg: COLOR_HEX, fg: 'black' }
};

// --- GLOBAL WIDGETS ---
const container = blessed.box({
    parent: screen,
    width: '100%',
    height: '100%',
    style: { bg: 'black' }
});

const statusBox = blessed.box({
    parent: container,
    bottom: 0,
    width: '100%',
    height: 3,
    content: ' [ARROWS] Navigate | [ENTER] Select ',
    border: { type: 'line' },
    style: { fg: 'white', border: { fg: '#333333' } }
});

const LOGO_TEXT = `
███         ███  ████████  ███  ███  █████████
███         ███  ███  ███  ███  ███       ███
███         ███  ███       ███  ███       ███
███         ███  ███ ████  ████████       ███
███         ███  ███  ███  ███  ███       ███
███         ███  ███  ███  ███  ███       ███
███         ███  ███  ███  ███  ███       ███
█████████   ███  ████████  ███  ███       ███`;

// --- HELPER FUNCTIONS ---

function execGameOver(reason) {
    clearPuzzle();
    container.children.forEach(c => c.hide());
    const goBox = blessed.box({
        parent: container,
        top: 'center',
        left: 'center',
        width: 'shrink',
        height: 'shrink',
        padding: 2,
        content: `{center}{red-fg}GAME OVER{/red-fg}\n\n${reason}{/center}`,
        tags: true,
        border: { type: 'line', fg: 'red' },
        style: { bold: true }
    });
    screen.render();
    setTimeout(() => process.exit(0), 5000);
}

async function typeWriter(box, text, delay = 30) {
    return new Promise((resolve) => {
        let i = 0;
        box.content = '';
        const interval = setInterval(() => {
            box.content += text[i];
            screen.render();
            i++;
            if (i === text.length) {
                clearInterval(interval);
                resolve();
            }
        }, delay);
    });
}


// --- PHASE 10: LUX-4 LEAKS (THE TRUTH) ---
async function accessLuxFiles(box) {
    box.setContent("");
    await typeWriter(box, "{green-fg}[SYSTEM]: Balance maintained. Neural link stable.{/green-fg}");
    await new Promise(res => setTimeout(res, 1000));
    
    await typeWriter(box, "[YOU]: I'm in. The system thinks I'm part of it. I can see the encrypted directories now.");
    await new Promise(res => screen.once('keypress', (ch, key) => { if(key.name === 'enter') res(); }));

    box.setContent("{center}ENTER ENCRYPTION KEY TO ACCESS 'PROJECT_FADE_1999_LOGS'\n\n{yellow-fg}(HINT: Check 'System Info' in the Main Menu){/yellow-fg}{/center}");
    
    const accessInput = blessed.textbox({
        parent: box, top: 'center', left: 'center', width: 25, height: 3,
        border: { type: 'line' }, style: { fg: 'yellow', bg: 'black' },
        inputOnFocus: true
    });
    accessInput.focus();
    screen.render();

    accessInput.on('submit', async (value) => {
        if (value === "lux1999files") {
            accessInput.destroy();
            box.setContent("{center}{green-fg}DECRYPTING... ACCESS GRANTED.{/green-fg}{/center}");
            fs.writeFileSync('../ACHIEVEMENTS/TRUTH_SEEKER.ACH', 'COMPLETED')
            screen.render();
            
            setTimeout(() => {
                const leakProc = spawn('cmd.exe', ['/c', 'start', '/wait', 'node', 'LUX_LEAKS.js'], { shell: false });
                
                leakProc.on('exit', () => {
                    // INSTEAD OF GAME OVER:
                    box.setContent("");
                    box.style.border.fg = "yellow";
                    box.setContent(
                        "{center}{yellow-fg}{bold}ATTENTION: DATA BREACH SUCCESSFUL{/bold}{/yellow-fg}\n\n" +
                        "The classified files have been exposed. \n" +
                        "If you saved the leak [S], check your {white-fg}DESKTOP{/white-fg} for 'LUX_CONFIDENTIAL.txt'.\n\n" +
                        "There is a hidden bypass code inside that file.\n" +
                        "{blink}Close the game and use the code at the start to change history.{/blink}{/center}"
                    );
                    screen.render();
                    
                    // Allow the user to manually exit or stay to read
                    screen.key(['enter', 'escape'], () => process.exit(0));
                });
            }, 2000);
        } else {
            accessInput.destroy();
            execGameOver("INVALID ENCRYPTION KEY. The mainframe detected your intrusion and fried your neural path.");
        }
    });
}

// --- PHASE 9: THE CORE ROOM & FINAL DESTINY ---

async function sublevelExploration() {
    container.children.forEach(c => { if(c !== statusBox) c.hide(); });
    
    const sublevelBox = blessed.box({
        parent: container, top: 'center', left: 'center', width: '90%', height: '80%',
        border: { type: 'line' }, style: style, padding: 1, tags: true
    });

    // 1. Entrada e Alarme de Segurança
    await typeWriter(sublevelBox, "[NARRATOR]: You step into the Heart of the LUX-4 Mainframe. The air is thick with static.");
    await new Promise(res => screen.once('keypress', (ch, key) => { if(key.name === 'enter') res(); }));
    
    await typeWriter(sublevelBox, "{red-fg}[ALARM]: SECURITY BREACH. DOORS LOCKED. SELF-DESTRUCT IN 5 SECONDS.{/red-fg}");
    await new Promise(res => setTimeout(res, 1000));

    // 2. Protocolo de Override (O código 6789)
    const codeToType = "6789";
    let timeLeft = 5;
    let missionFailed = false;

    const flashInterval = setInterval(() => {
        sublevelBox.style.bg = (sublevelBox.style.bg === 'black' ? 'red' : 'black');
        screen.render();
    }, 200);

    const timerInterval = setInterval(() => {
        timeLeft--;
        if (timeLeft <= 0 && !missionFailed) {
            clearInterval(timerInterval); clearInterval(flashInterval);
            missionFailed = true;
            fs.writeFileSync('../ACHIEVEMENTS/SLOWTYPIST.ACH', 'COMPLETED')
            execGameOver("TIME EXPIRED. The security system atomized the room.");
        } else {
            sublevelBox.setContent(`{center}{bold}!!! SECURITY LOCKDOWN !!!{/bold}\n\nTYPE OVERRIDE CODE:\n\n{yellow-fg}{bold}${codeToType}{/bold}{/yellow-fg}\n\nTIME: ${timeLeft}s{/center}`);
            screen.render();
        }
    }, 1000);

    const inputField = blessed.textbox({
        parent: sublevelBox, bottom: 3, left: 'center', width: 10, height: 3,
        border: { type: 'line' }, style: { fg: 'white', bg: 'black' }, inputOnFocus: true
    });
    inputField.focus(); screen.render();

    inputField.on('submit', (value) => {
        if (missionFailed) return;
        clearInterval(timerInterval); clearInterval(flashInterval);
        
        if (value === codeToType) {
            sublevelBox.style.bg = 'black';
            sublevelBox.setContent("{center}{green-fg}OVERRIDE SUCCESSFUL. ACCESSING CORE...{/green-fg}{/center}");
            screen.render();
            setTimeout(() => { 
                inputField.destroy(); 
                coreFinalSequence(sublevelBox); 
            }, 2000);
        } else {
            missionFailed = true; 
            execGameOver("INVALID CODE. Internal defenses active.");
        }
    });
}

// --- SEQUÊNCIA DE INTEGRAÇÃO E BALANCER ---

async function coreFinalSequence(box) {
    box.setContent("");
    const achPath = path.join(__dirname, '..', 'ACHIEVEMENTS', 'PACPRO.ach');
    const isElite = fs.existsSync(achPath);

    // EASTER EGG PARA ELITE
    if (isElite) {
        await typeWriter(box, "{yellow-fg}[ELITE DATA UNLOCKED]: PROJECT FADE - PRELUDE TO 1999.{/yellow-fg}");
        await new Promise(res => screen.once('keypress', (ch, key) => { if(key.name === 'enter') res(); }));
        await typeWriter(box, "{yellow-fg}[PRELUDE]: 'The city didn't lose power in 1999. It was consumed to fuel the first upload.'{/yellow-fg}");
        await new Promise(res => screen.once('keypress', (ch, key) => { if(key.name === 'enter') res(); }));
        box.setContent("");
    }

    // SEQUÊNCIA OBRIGATÓRIA (FORCED LABOR)
    await typeWriter(box, "[SYSTEM]: Administrative rights: DENIED. Manual core maintenance required.");
    await new Promise(res => screen.once('keypress', (ch, key) => { if(key.name === 'enter') res(); }));

    await typeWriter(box, "[NARRATOR]: Mechanical arms emerge from the ceiling, forcing you into the Control Chair.");
    await new Promise(res => screen.once('keypress', (ch, key) => { if(key.name === 'enter') res(); }));

    await typeWriter(box, "[SYSTEM]: Energy fluctuation detected. Initialize BALANCER.js to prevent blackout.");
    await new Promise(res => screen.once('keypress', (ch, key) => { if(key.name === 'enter') res(); }));

    box.setContent("{center}CHAIR LOCKED. USER INTEGRATED.\n\nINITIALIZING BALANCER.js...{/center}");
    screen.render();

    // Inicia o terminal secundário
    const balancerProc = spawn('cmd.exe', ['/c', 'start', '/wait', 'node', 'BALANCER.js'], { shell: false });
    
    // Inside your coreFinalSequence function:
balancerProc.on('exit', () => {
    const successFile = './BALANCER_SUCCESS.status';
    const isSecretRoute = fs.existsSync('./TERMINALACCESS/SECRET_ROUTE.status');
    
    if (fs.existsSync(successFile)) {
        fs.writeFileSync('../ACHIEVEMENTS/GHOST_GUARDIAN.ACH', 'COMPLETED')
        fs.unlinkSync(successFile);
        
        if (isSecretRoute) {
            // Secret path: Go to CEO
            fs.unlinkSync('./TERMINALACCESS/SECRET_ROUTE.status');
            ceoConfrontation(); 
        } else {
            // Normal path: Go to Leaks
            accessLuxFiles(box); 
        }
    } else {
        execGameOver("The core exploded. The Fade consumed reality.");
        fs.writeFileSync('../ACHIEVEMENTS/SHADOW_FALL.ACH', 'COMPLETED')
    }
});
}

// --- SEQUÊNCIA FINAL: O ESTER EGG ELITE + TERMINAL BALANCER ---

async function coreFinalSequence(box) {
    box.setContent("");
    const achPath = path.join(__dirname, '..', 'ACHIEVEMENTS', 'PACPRO.ach');
    const isElite = fs.existsSync(achPath);

    // --- BLOCO EASTER EGG / PRELÚDIO (SÓ PARA ELITE) ---
    if (isElite) {
        await typeWriter(box, "{yellow-fg}[ELITE DATA UNLOCKED]: PROJECT FADE - PRELUDE TO 1999.{/yellow-fg}");
        await new Promise(res => screen.once('keypress', (ch, key) => { if(key.name === 'enter') res(); }));
        
        await typeWriter(box, "{yellow-fg}[PRELUDE]: 'The city didn't lose power in 1999. It was consumed to fuel the first upload.'{/yellow-fg}");
        await new Promise(res => screen.once('keypress', (ch, key) => { if(key.name === 'enter') res(); }));
        
        await typeWriter(box, "{yellow-fg}[MESSAGE]: You know the truth now, Operator. But the machine still needs a heart.{/yellow-fg}");
        await new Promise(res => screen.once('keypress', (ch, key) => { if(key.name === 'enter') res(); }));
        box.setContent("");
    }

    // --- SEQUÊNCIA OBRIGATÓRIA PARA TODOS ---
    await typeWriter(box, "[SYSTEM]: Total system override failed. Administrative rights: REDACTED.");
    await new Promise(res => screen.once('keypress', (ch, key) => { if(key.name === 'enter') res(); }));

    await typeWriter(box, "[NARRATOR]: Mechanical arms emerge from the ceiling, forcing you into the Control Chair.");
    await new Promise(res => screen.once('keypress', (ch, key) => { if(key.name === 'enter') res(); }));

    await typeWriter(box, "[YOU]: Wait... no! I'm not a part of this!");
    await new Promise(res => screen.once('keypress', (ch, key) => { if(key.name === 'enter') res(); }));

    await typeWriter(box, "[SYSTEM]: Energy fluctuation detected. Manual balancing required.");
    await new Promise(res => screen.once('keypress', (ch, key) => { if(key.name === 'enter') res(); }));

    box.setContent("{center}CHAIR LOCKED. BIOMETRIC SYNC COMPLETE.\n\nINITIALIZING BALANCER.js SYSTEM...{/center}");
    screen.render();

    // Inicia o terminal secundário obrigatoriamente
    const balancerProc = spawn('cmd.exe', ['/c', 'start', '/wait', 'node', 'BALANCER.js'], { shell: false });
    
    // Inside your coreFinalSequence function:
balancerProc.on('exit', () => {
    const successFile = './BALANCER_SUCCESS.status';
    const isSecretRoute = fs.existsSync('./TERMINALACCESS/SECRET_ROUTE.status');
    
    if (fs.existsSync(successFile)) {
        fs.unlinkSync(successFile);
        
        if (isSecretRoute) {
            // Secret path: Go to CEO
            fs.unlinkSync('./TERMINALACCESS/SECRET_ROUTE.status');
            ceoConfrontation(); 
        } else {
            // Normal path: Go to Leaks
            accessLuxFiles(box); 
        }
    } else {
        execGameOver("The core exploded. The Fade consumed reality.");
    }
});
}
// --- FINAL BRANCHING (ELITE VS NORMAL) ---

async function finalChoicePhase(box) {
    box.setContent("");
    const achPath = path.join(__dirname, '..', 'ACHIEVEMENTS', 'PACPRO.ach');
    const isElite = fs.existsSync(achPath);

    const narrative = [
        "[SYSTEM]: Core connection stable. The violet light of the Fade is pulsating in front of you.",
        "[YOU]: This is it. The digitizing core of LUX-4."
    ];

    if (isElite) {
        narrative.push("{yellow-fg}[ELITE LOG]: Credential PACPRO detected. Secret archive unlocked.{/yellow-fg}");
        narrative.push("{yellow-fg}[REPORT 1999]: 'The Fade wasn't a mistake. We found a way to live inside the electrons.'{/yellow-fg}");
    }

    for (const line of narrative) {
        await typeWriter(box, line);
        await new Promise(res => screen.once('keypress', (ch, key) => { if(key.name === 'enter') res(); }));
    }

    const finalAction = blessed.list({
        parent: container,
        bottom: 5,
        left: 'center',
        width: '70%',
        height: 8,
        label: ' TERMINAL OVERRIDE: PROJECT FADE ',
        items: [
            ' > PURGE THE SYSTEM (Erase LUX-4/End the Fade) ',
            ' > STABILIZE THE FADE (Try to rescue the trapped souls) ',
            ' > MERGE WITH THE FADE (Become the new God of the Grid) '
        ],
        keys: true,
        border: { type: 'line' },
        style: style,
        align: 'center'
    });

    finalAction.focus();
    screen.render();

    finalAction.on('select', async (it, idx) => {
        finalAction.hide();
        box.setContent("");

        if (idx === 0) {
            await typeWriter(box, "[YOU]: This experiment ends now. For everyone.");
            execGameOver("You purged the core. The city went dark, but the cycle of the Fade was broken.");
            fs.writeFileSync('../ACHIEVEMENTS/CITY_DARK.ACH', 'COMPLETED')
        } else if (idx === 1) {
            await typeWriter(box, "[YOU]: I'll try to pull them back to reality.");
            execGameOver("You tried to stabilize the core. Thousands of digital ghosts returned, but you are now their silent guardian.");
        } else {
            await typeWriter(box, "[YOU]: The static is beautiful. I'm ready to evolve.");
            execGameOver("You merged with the core. You are no longer human. You are the LUX-4 Grid itself.");
            fs.writeFileSync('../ACHIEVEMENTS/NEW_GOD.ACH', 'COMPLETED')
        }
    });
}

async function ceoConfrontation() {
    fs.writeFileSync('../ACHIEVEMENTS/CEO_CONFRONT.ACH', 'COMPLETED')
    const vbsPath = path.join(os.tmpdir(), 'ceo_chat.vbs');
    
    // Windows Native Dialogues Script
    fs.writeFileSync(vbsPath, `
        Set objShell = CreateObject("WScript.Shell")
        res = MsgBox("LUX-4 CEO: You know everything now, don't you?", 36, "CORE_ACCESS_TERMINAL")
        If res = 7 Then
            ' User chose NO
            MsgBox "LUX-4 CEO: Hahaha... bad idea.", 16, "SYSTEM_ERROR"
            objShell.Run "shutdown /s /t 10 /c ""UNAUTHORIZED ACCESS DENIED. SYSTEM HALT.""", 0, True
        Else
            ' User chose YES
            MsgBox "LUX-4 CEO: How? How did you find out?", 48, "SYSTEM_BREACH"
            MsgBox "LUX-4 CEO: You destroyed everything I built. Know that we hate you...", 16, "LUX-4_REVENGE"
            objShell.Run "shutdown /r /t 15 /c ""PURGING LUX-4 REMNANTS. REBOOTING SYSTEM...""", 0, True
        End If
    `, { encoding: 'latin1' });

    exec(`cscript //nologo ${vbsPath}`, () => {
        try { fs.unlinkSync(vbsPath); } catch(e) {}
        
        // Clean temporary game files
        filesToClean.forEach(f => { if(fs.existsSync(f)) fs.unlinkSync(f); });
        clearPuzzle();
        
        // Leave the final message on the real Desktop
        const finalTxtPath = path.join(os.homedir(), 'Desktop', 'FINAL_MESSAGE.txt');
        fs.writeFileSync(finalTxtPath, "You won, Operator. LUX-4 is gone, but the world is now in darkness.\nDo not return.\n- CEO");
        
        // Set final status to block the game on next launch
        fs.writeFileSync('./TERMINALACCESS/FINAL.status', 'COMPLETED');
        fs.writeFileSync('../ACHIEVEMENTS/THE_END.ach', 'COMPLETED')
        
        process.exit(0);
    });
}

// --- PHASE 8: THE OFFICE AND THE CONTROL ROOM ---

async function officeChaosPhase() {
    container.children.forEach(c => { if(c !== statusBox) c.hide(); });
    
    const officeBox = blessed.box({
        parent: container, top: 'center', left: 'center', width: '85%', height: '70%', tags:true,
        border: { type: 'line' }, style: style, padding: 1, scrollable: true
    });

    const scenes = [
        "[SYSTEM]: You enter the building. The air is heavy.",
        "[CHAOS]: Coworkers are running in circles, some praying, others smashing monitors.",
        "[DESPAIR]: 'THE LIGHT ISN'T COMING BACK!', the receptionist screams as her eyes bleed shadows.",
        "[MISSION]: You ignore the screams and run to the basement.",
        "[LOCATED]: You spot a brushed metal sign: 'POWER MANAGEMENT ROOM'."
    ];

    for (const scene of scenes) {
        await typeWriter(officeBox, scene);
        await new Promise(res => screen.once('keypress', (ch, key) => { if(key.name === 'enter') res(); }));
    }

    officeBox.setContent("{center}\n\n[ FOCUSING ON SIGN ]\n\nPOWER MANAGEMENT ROOM{/center}");
    officeBox.parseTags = true;
    screen.render();
    await new Promise(res => setTimeout(res, 3000));

    const roomMenu = blessed.list({
        parent: container, top: 'center', left: 'center', width: '50%', height: 10, tags:true,
        label: ' ROOM ACTIONS ',
        items: [' 1. Sit at the Control Chair ', ' 2. Scream for help ', ' 3. Try to leave the building '],
        keys: true, border: { type: 'line' }, style: style, align: 'center'
    });

    roomMenu.on('select', async (item, index) => {
        if (index === 0) {
            roomMenu.hide();
            await typeWriter(officeBox, "[SYSTEM]: You sit in the chair. The terminal in front of you blinks green...");
            
            const terminalAction = blessed.list({
                parent: container, bottom: 5, left: 'center', width: '40%', height: 6,
                items: [' > POWER ON TERMINAL ', ' > DESTROY TERMINAL '],
                keys: true, border: { type: 'line' }, style: style
            });

            terminalAction.on('select', (it, idx) => {
                if (idx === 1) execGameOver("You destroyed the last hope for light. The darkness consumed you.");
                else {
                    const statusPath = './TERMINALACCESS/POWER_ACTIVE.status';
                    fs.writeFileSync(statusPath, '1');
                    
                    exec('start cmd /c "node TERMINAL_ENERGIA.js"');
                     
                    officeBox.setContent("{center}SYSTEM STARTED IN SECOND INSTANCE.\nAWAITING ELEVATOR UNLOCK SEQUENCE...{/center}");
                    terminalAction.hide();
                    screen.render();

                    const checkClosure = setInterval(async () => {
                        if (!fs.existsSync(statusPath)) {
                            clearInterval(checkClosure);
                            
                            if (fs.existsSync('./TERMINALACCESS/ELEVATOR_OPEN.status')) {
                                fs.unlinkSync('./TERMINALACCESS/ELEVATOR_OPEN.status');
                                
                                officeBox.hide();
                                const elevatorScene = blessed.box({
                                    parent: container, top: 'center', left: 'center', width: '80%', height: '70%',
                                    border: { type: 'line' }, style: style, padding: 1, tags: true
                                });

                                const elevatorNarration = [
                                    "[SYSTEM]: The terminal goes dark. A loud crash echoes at the end of the hallway.",
                                    "[NARRATOR]: The Sector 4 emergency lights blink in neon blue.",
                                    "[YOU]: I did it... the elevator is working.",
                                    "[NARRATOR]: You step inside the mirrored elevator. The air is cold.",
                                    "[SYSTEM]: DESCENT INITIATED. CHOOSE CABIN INTERFACE ACTIVITY."
                                ];

                                for (const f of elevatorNarration) {
                                    await typeWriter(elevatorScene, f);
                                    await new Promise(res => screen.once('keypress', (ch, key) => { if(key.name === 'enter') res(); }));
                                }

                                const elevatorMenu = blessed.list({
                                    parent: container, top: 'center', left: 'center', width: '50%', height: 8,
                                    label: ' ELEVATOR INTERFACE ',
                                    items: [' 1. PLAY PACPRO (Subsystem) ', ' 2. LISTEN TO LOCAL RADIO '],
                                    keys: true, border: { type: 'line' }, style: style, align: 'center'
                                });

                                elevatorMenu.focus();
                                screen.render();

                                elevatorMenu.on('select', async (it, eIdx) => {
                                    elevatorMenu.hide();

                                    if (eIdx === 0) {
                                        elevatorScene.setContent("{center}ELEVATOR IN MOTION...\n\nENTERTAINMENT SYSTEM ACTIVE.\nAWAITING PROCESS TERMINATION (Press F to exit game)...{/center}");
                                        screen.render();

                                        const pacmanProc = spawn('cmd.exe', ['/c', 'start', '/wait', 'node', 'PACPRO.js'], { 
                                            shell: false, 
                                            detached: false 
                                        });

                                        // MONITORAMENTO EM TEMPO REAL DA CONQUISTA
                                        const achPath = path.join(__dirname, '..', 'ACHIEVEMENTS', 'PACPRO.ach');
                                        pacmanProc.on('exit', async () => {
                                            if (fs.existsSync(achPath)) {
                                                elevatorScene.setContent("");
                                                await typeWriter(elevatorScene, "{yellow-fg}[SYSTEM]: ELITE DATA DETECTED. READING 'PACPRO.ach'...{/yellow-fg}");
                                                await new Promise(res => screen.once('keypress', (ch, key) => { if(key.name === 'enter') res(); }));
                                                
                                                await typeWriter(elevatorScene, "{yellow-fg}[NON-CANNON]: You actually cleared the simulation. Respect, Operator. You are elite.{/yellow-fg}");
                                                await new Promise(res => screen.once('keypress', (ch, key) => { if(key.name === 'enter') res(); }));
                                            }
                                            arrivalAtSublevel(elevatorScene); 
                                        });

                                    } else {
                                        elevatorScene.setContent("");
                                        fs.writeFileSync('../ACHIEVEMENTS/RADIO_LISTENER.ACH', 'COMPLETED')
                                        await typeWriter(elevatorScene, "[RADIO]: '...signal acquired. Tuning to 99.7 FM local news...'");
                                        await new Promise(res => screen.once('keypress', (ch, key) => { if(key.name === 'enter') res(); }));
                                        
                                        await typeWriter(elevatorScene, "[RADIO]: 'LUX-4 Energy Corp has issued a formal statement regarding the 1999 THE FADE incident...'");
                                        await new Promise(res => screen.once('keypress', (ch, key) => { if(key.name === 'enter') res(); }));
                                        
                                        await typeWriter(elevatorScene, "[RADIO]: 'The board officially denies any involvement, claiming the reports of anomalies are baseless conspiracy theories...'");
                                        await new Promise(res => screen.once('keypress', (ch, key) => { if(key.name === 'enter') res(); }));
                                        
                                        const vbsPath = path.join(os.tmpdir(), 'warning.vbs');
                                        fs.writeFileSync(vbsPath, `MsgBox "YOU KNOW TOO MUCH", 16, "SYSTEM CRITICAL ERROR"`);
                                        
                                        exec(`cscript //nologo ${vbsPath}`, () => {
                                            try { fs.unlinkSync(vbsPath); } catch(e) {}
                                            arrivalAtSublevel(elevatorScene);
                                        });
                                    }
                                });

                            } else {
                                execGameOver("The power terminal was closed without releasing the protocols.");
                            }
                        }
                    }, 1000);
                }
            });
            terminalAction.focus();
            screen.render();

        } else {
            execGameOver("You wasted precious time. The room was flooded by shadows.");
        }
    });

    roomMenu.focus();
    screen.render();
}

async function arrivalAtSublevel(box) {
    box.setContent("");
    
    // Frase 1
    await typeWriter(box, "[SYSTEM]: *DING*");
    await new Promise(res => screen.once('keypress', (ch, key) => { if(key.name === 'enter') res(); }));
    
    // Frase 2
    box.setContent(""); // Limpa para a próxima ou use box.content += "\n"
    await typeWriter(box, "[SYSTEM]: ARRIVAL: SUBLEVEL 7 - RESEARCH AND DEVELOPMENT.");
    await new Promise(res => screen.once('keypress', (ch, key) => { if(key.name === 'enter') res(); }));
    
    // Frase 3
    box.setContent("");
    await typeWriter(box, "[NARRATOR]: The doors slide open. The basement is submerged in absolute silence.");
    await new Promise(res => screen.once('keypress', (ch, key) => { if(key.name === 'enter') res(); }));

    // Achievement Recognition Check
    const achPath = path.join(__dirname, '..', 'ACHIEVEMENTS', 'PACPRO.ach');
    const hasAch = fs.existsSync(achPath);
    
    sublevelExploration()
}

// --- PASSWORD WORK PHASE ---

async function passwordWorkPhase() {
    container.children.forEach(c => { if(c !== statusBox) c.hide(); });
    try {
        if (!fs.existsSync(desktopPath)) fs.mkdirSync(desktopPath);
        fs.writeFileSync(rootPassPath, passwordValue);
    } catch (e) {}

    const loginBox = blessed.box({ 
        parent: container, top: 'center', left: 'center', width: '75%', height: '55%', 
        border: { type: 'line' }, tags:true, style: style, padding: 1, 
        content: `[CORPORATE ACCESS SYSTEM]\n\nSTATUS: AWAITING CREDENTIALS...\n\nHINT: Check your DOCUMENTS folder.` 
    });
    screen.render();

    const monitor = setInterval(() => {
        const files = fs.readdirSync(desktopPath).filter(f => f !== 'READ-ME.txt');
        if (files.length > 0) {
            clearInterval(monitor);
            const content = fs.readFileSync(path.join(desktopPath, files[0]), 'utf8').trim();

            if (content === passwordValue) {
                loginBox.setContent("{green-fg}ACCESS GRANTED. SECTOR 7.{/green-fg}");
                setTimeout(() => { clearPuzzle(); officeChaosPhase(); }, 2000);
            } else if (content === "LUX4LIFE") {
                // HIDDEN ROUTE ACTIVATED
                fs.writeFileSync('../ACHIEVEMENTS/REBEL_PATH.ACH', 'COMPLETED')
                fs.writeFileSync('./TERMINALACCESS/SECRET_ROUTE.status', '1');
                loginBox.setContent("{yellow-fg}ADMINISTRATIVE OVERRIDE DETECTED. HELLO, REBEL.{/yellow-fg}");
                setTimeout(() => { clearPuzzle(); officeChaosPhase(); }, 2000);
            } else {
                execGameOver("FALSE OR CORRUPTED CREDENTIAL FILE. SECURITY TRIGGERED.");
            }
        }
    }, 1000);
}
// --- PHASE 5: THE FINAL CHOICE ---

function finalChoicePhase() {
    container.children.forEach(c => { if(c !== statusBox) c.hide(); });
    
    const finalMenu = blessed.list({
        parent: container,
        top: 'center',
        left: 'center',
        width: '60%',
        height: 10,
        label: ' ARRIVAL AT WORK ',
        items: [
            ' 1. ENTER AND WORK ',
            ' 2. LEAVE AND ENJOY LIFE ',
            ' 3. RANDOM (DECIDE BY LUCK) '
        ],
        keys: true,
        border: { type: 'line' },
        style: style,
        align: 'center'
    });

    finalMenu.on('select', (item, index) => {
        if (index === 0) {
            passwordWorkPhase(); 
        } else if (index === 1) {
            container.destroy();
            console.clear();
            console.log("You chose life. As the world went dark, you felt peace for the first time.");
            process.exit(0);
        } else {
            const failChance = Math.random() < 0.15; 
            if (failChance) {
                execGameOver("The die landed on FAIL. Your instincts betrayed you and you entered the building.");
            } else {
                container.destroy();
                console.clear();
                console.log("The die saved you. You turned your back on the building and went to enjoy the end.");
                process.exit(0);
            }
        }
    });

    finalMenu.focus();
    screen.render();
}

// --- PHASE 4: THE PATH ---

async function thePathPhase() {
    container.children.forEach(c => { if(c !== statusBox) c.hide(); });
    
    const roadBox = blessed.box({
        parent: container,
        top: 'center',
        left: 'center',
        width: '80%',
        height: '60%',
        border: { type: 'line' },
        style: style,
        padding: 1
    });

    const logs = [
        "[REPORT]: You drive through the streets... the asphalt seems to absorb the headlights.",
        "[OBSERVATION]: You see a brutal car accident. The victims just stare at the dark sky.",
        "[WORLD]: Entire buildings are losing color, becoming static gray.",
        "[CHAOS]: The sky at 7:00 AM is as black as the bottom of a well.",
        "[NARRATOR]: You finally park in front of the office block.",
        "--- PRESS ENTER TO EXIT THE CAR ---"
    ];

    for (const text of logs) {
        await typeWriter(roadBox, text);
        await new Promise(res => {
            const handler = (ch, key) => {
                if (key.name === 'enter') {
                    screen.removeListener('keypress', handler);
                    res();
                }
            };
            screen.on('keypress', handler);
        });
    }

    roadBox.destroy();
    finalChoicePhase();
}


// --- PHASE 3: GAMEPLAY (TIMER + TASKS WITH DELAY) ---

async function startGameplay(initialTime) {
    container.children.forEach(child => { if(child !== statusBox) child.hide(); });

    let timeRemaining = initialTime;
    let completedTasks = new Set();
    let inProgress = false; 

    const timerBox = blessed.box({
        parent: container,
        top: 2,
        left: 'center',
        width: 20,
        height: 3,
        content: `TIME: ${timeRemaining}s`,
        align: 'center',
        border: { type: 'line' },
        style: { fg: COLOR_HEX, border: { fg: COLOR_HEX }, bold: true }
    });

    const actionsMenu = blessed.list({
        parent: container,
        top: 'center',
        left: 'center',
        width: '60%',
        height: 10,
        label: ' QUICK PREPARATION ',
        items: [
            ' 1. Take a cold shower ',
            ' 2. Put on work uniform ',
            ' 3. Look for car keys ',
            ' 4. Gulp down breakfast ',
            ' 5. Check window locks ',
            ' 6. LEAVE THE HOUSE '
        ],
        keys: true,
        border: { type: 'line' },
        style: style,
        align: 'center'
    });

    const timerInterval = setInterval(() => {
        if (!inProgress) timeRemaining--;
        timerBox.setContent(`TIME: ${timeRemaining}s`);
        
        if (timeRemaining <= 10) {
            timerBox.style.fg = 'red';
            timerBox.style.border.fg = 'red';
        }

        if (timeRemaining <= 0) {
            clearInterval(timerInterval);
            execGameOver("TIME IS UP. YOU ARRIVED LATE FOR WORK.");
        }
        screen.render();
    }, 1000);

    actionsMenu.on('select', async (item, index) => {
        if (inProgress) return; 

        if (index === 5) { 
            if (completedTasks.size >= 5) {
                clearInterval(timerInterval);
                if (timeRemaining > 38) {
                if (fs.existsSync('../ACHIEVEMENTS/NEVERMISS.ach', 'COMPLETED')) {
                    fs.unlinkSync('../ACHIEVEMENTS/NEVERMISS.ach', 'COMPLETED')
                }
                fs.writeFileSync('../ACHIEVEMENTS/NEVERMISS.ach', 'COMPLETED')  
                }
                
                thePathPhase();
            } else {
                statusBox.setContent(" ERROR: You haven't finished getting ready! ");
                screen.render();
            }
        } else if (!completedTasks.has(index)) {
            inProgress = true;
            const originalText = item.getText();
            let count = 0;
            
            const progressInterval = setInterval(() => {
                count += 20;
                item.setContent(`${originalText} [${count}%]`);
                screen.render();
                
                if (count >= 100) {
                    clearInterval(progressInterval);
                    item.style.fg = 'green';
                    completedTasks.add(index);
                    inProgress = false;
                    statusBox.setContent(` Completed: ${originalText.trim()} `);
                    screen.render();
                }
            }, 600); 
        }
    });

    actionsMenu.focus();
    screen.render();
}

// --- PHASE 2: NARRATIVE ---

async function startNarrative() {
    container.children.forEach(child => { if(child !== statusBox) child.hide(); });
    
    const narrativeBox = blessed.box({
        parent: container,
        top: 'center',
        left: 'center',
        width: '80%',
        height: '40%',
        border: { type: 'line' },
        style: style,
        padding: 1
    });

    const texts = [
        "[NARRATOR]: You wake up in your bed...",
        "[NARRATOR]: The world seems to be 'fading out' around you...",
        "[YOU]: How strange, the buildings look darker... maybe it's just my head.",
        "[NARRATOR]: You discover the worst: it's 6:30. You're late.",
        "[YOU]: Damn! I have to leave NOW!",
        "--- PRESS ENTER TO START GETTING READY ---"
    ];

    for (const text of texts) {
        await typeWriter(narrativeBox, text);
        await new Promise(res => {
            const tempHandler = (ch, key) => {
                if (key.name === 'enter') {
                    screen.removeListener('keypress', tempHandler);
                    res();
                }
            };
            screen.on('keypress', tempHandler);
        });
    }

    narrativeBox.destroy();
    startGameplay(40); 
}

// --- PHASE 1: MENU AND MONITORING ---

async function monitorSurvey() {
    const loading = blessed.loading({ 
        parent: container, top: 'center', left: 'center', 
        width: 'shrink', height: 'shrink', border: { type: 'line' }, style: style 
    });
    loading.load(' [SYSTEM AWAITING SURVEY RESPONSES...] ');
    screen.render();

    return new Promise((resolve) => {
        const check = setInterval(() => {
            const successExists = fs.existsSync('./TERMINALACCESS/ACESSOSTATUS.LIGHT');
            const fadeExists = fs.existsSync('./TERMINALACCESS/MEMORY_1999.bin');
            const failureExists = fs.existsSync('./TERMINALACCESS/GAMEOVER.status');

            if (successExists || fadeExists || failureExists) {
                clearInterval(check);
                loading.stop();
                
                if (failureExists) {
                    execGameOver("SYSTEM LOCKED: INTRUSION ATTEMPT.");
                } else if (fadeExists) {
                    // --- MEMORY 1999 RESET LOGIC ---
                    container.children.forEach(c => c.hide());
                    
                    const fadeBox = blessed.box({
                        parent: container, top: 'center', left: 'center', width: '80%', height: '40%',
                        border: { type: 'line', fg: 'yellow' }, style: { fg: 'yellow' }, padding: 1,
                        content: "{center}{bold}[WARNING] 1999 MEMORY SYNCED.{/bold}\n\nYOU ARE NOW PART OF THE FADE.\nSYSTEM IN CONFLICT.\n\n{blink}Press [ENTER] to clear cache and retry the Survey...{/blink}{/center}",
                        tags: true
                    });
                    screen.render();

                    screen.once('keypress', (ch, key) => {
                        if (key.name === 'enter') {
                            fadeBox.destroy();
                            try { fs.unlinkSync('./TERMINALACCESS/MEMORY_1999.bin'); } catch(e) {}
                            exec('start cmd /c "node SURVEY.js"');
                            resolve(monitorSurvey()); 
                        }
                    });
                } else {
                    // NORMAL SUCCESS
                    const status = fs.readFileSync('./TERMINALACCESS/ACESSOSTATUS.LIGHT', 'utf8').trim();
                    if (status === '1') {
                        resolve(true); 
                    } else {
                        execGameOver("AUTHENTICATION FAILED.");
                    }
                }
            }
        }, 500);
    });
}

function startMainMenu() {
    const logoBox = blessed.text({
        parent: container,
        top: 2,
        left: 'center',
        content: LOGO_TEXT,
        style: { fg: COLOR_HEX },
        align: 'center'
    });

    const menu = blessed.list({
        parent: container,
        top: 15,
        left: 'center',
        width: '40%',
        height: 6,
        items: [' > START SURVEY ', ' > EXIT '],
        keys: true,
        border: { type: 'line' },
        style: style,
        align: 'center'
    });

    menu.on('select', async (item, index) => {
        if (index === 1) process.exit(0);

        menu.hide();
        logoBox.hide();
        
        exec('start cmd /c "node SURVEY.js"');
        const ok = await monitorSurvey();

        if (ok) {
            startNarrative();
        } else {
            execGameOver("SYSTEM LOCKED: INTRUSION ATTEMPT DETECTED.");
        }
    });

    menu.focus();
    screen.render();
}

// --- INITIALIZATION ---
screen.key(['escape', 'C-c'], () => {
    clearPuzzle();
    process.exit(0);
});

const isGameFinished = fs.existsSync('./TERMINALACCESS/FINAL.status');

if (isGameFinished) {
    // Unique screen for finished game
    const winBox = blessed.box({
        parent: container, top: 'center', left: 'center', width: 60, height: 10,
        border: { type: 'line', fg: 'yellow' }, label: ' {bold}CONGRATULATIONS{/bold} ',
        content: '{center}\nYou have defeated LUX-4.\nThe LUX-4 system has been dismantled.{/center}', tags: true
    });

    const winMenu = blessed.list({
        parent: winBox, bottom: 1, left: 'center', width: '80%', height: 5,
        items: [' > DELETE SAVE AND RETRY ', ' > CLOSE TERMINAL '],
        keys: true, style: style
    });

    winMenu.on('select', (it, idx) => {
        if (idx === 0) {
            fs.unlinkSync('./TERMINALACCESS/FINAL.status');
            process.exit(0);
        } else { process.exit(0); }
    });

    winMenu.focus();
    screen.render();
} else {
    // Normal start
    startMainMenu(); 
}
//startMainMenu();