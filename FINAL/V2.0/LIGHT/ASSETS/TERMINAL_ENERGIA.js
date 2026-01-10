const blessed = require('blessed');
const fs = require('fs');
const { exec } = require('child_process');

const beepfile = '../AUDIO/EFFECTS/BEEP.wav';      
const beepfile2 = '../AUDIO/EFFECTS/BEEP2.wav';    
const winfile = '../AUDIO/EFFECTS/win.wav';        
const warningfile = '../AUDIO/EFFECTS/warning.wav';
const freshfile = '../AUDIO/EFFECTS/FRESH.wav';
const CEOfile = '../AUDIO/TRACKS/CEO.mp3';
const BOOTfile = '../AUDIO/EFFECTS/LUX-4.wav';
const sucessofile = '../AUDIO/EFFECTS/win2.wav';
const alarm = '../AUDIO/EFFECTS/alarm.mp3';
const GOfile = '../AUDIO/EFFECTS/GAMEOVER.MP3';

const player = require('play-sound')({
    player: '../AUDIO/PLAYER/cmdmp3.exe'
});

let energia = 85, sanidade = 100, saude = 100, passoAtual = 0;
let audiostate = 'ON';
let bgmProcess = null;

const protocolosBase = [
    { id: 0, text: ' Shadow Fuses Diagnosis ' },
    { id: 1, text: ' Calibrate Light Frequency ' },
    { id: 2, text: ' Magnetic Lock Bypass (Sector 4) ' },
    { id: 3, text: ' Energize Elevator Rails ' },
    { id: 4, text: ' RESTART SYSTEM (FINISH) ' }
];

let itensEmbaralhados = [...protocolosBase];


const screen = blessed.screen({ smartCSR: true, title: 'POWER MANAGEMENT CONSOLE - SECTOR 4' });

const container = blessed.box({
    parent: screen,
    width: '100%',
    height: '100%'
});

const logBox = blessed.log({
    parent: container,
    top: 0, left: 0, width: '70%', height: '70%',
    tags: true, label: ' SYSTEM LOG / OUTPUT ', border: { type: 'line' },
    style: { fg: 'green', border: { fg: 'green' } },
    scrollable: true, alwaysScroll: true
});

const statusBox = blessed.box({
    parent: container,
    top: 0, right: 0, width: '30%', height: '70%',
    label: ' UNIT STATUS ', border: { type: 'line' },
    style: { fg: 'green', border: { fg: 'green' } },
    tags: true
});

const menuBox = blessed.list({
    parent: container,
    bottom: 0, left: 0, width: '100%', height: '30%',
    tags: true, label: ' SEQUENCE PROTOCOLS ', border: { type: 'line' },
    items: itensEmbaralhados.map(i => i.text),
    keys: true, style: {
        fg: 'green', border: { fg: 'green' },
        selected: { bg: 'green', fg: 'black' }
    }
});

const ART_CHECK = `{green-fg}{bold}
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⡀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⣿⣿⠆⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⣾⣿⡿⠁⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣾⣿⣿⠟⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣴⣿⣿⡿⠃⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢠⣾⣿⣿⠟⠁⠀⠀⠀⠀⠀⠀
⠀⢀⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣰⣿⣿⣿⠏⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠺⣿⣷⣄⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣾⣿⣿⣿⠃⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠈⠻⣿⣿⣦⣄⠀⠀⠀⠀⠀⠀⣠⣿⣿⣿⡿⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠈⠻⣿⣿⣷⣤⡀⠀⠀⣰⣿⣿⣿⡿⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠙⢿⣿⣿⣿⣦⣼⣿⣿⣿⡿⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠙⢿⣿⣿⣿⣿⣿⡿⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠻⣿⣿⣿⡿⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⢿⡟⠁               {/}`;

const ART_X = `{red-fg}{bold}
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⣴⣿⣿⣦⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣴⣿⣿⣦⠀⠀⠀
⠀⠀⠀⠙⢿⣿⣿⣿⣦⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣴⣿⣿⣿⡿⠋⠀⠀⠀
⠀⠀⠀⠀⠈⠻⣿⣿⣿⣿⣦⡀⠀⠀⠀⠀⠀⠀⢀⣴⣿⣿⣿⣿⠟⠁⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠙⢿⣿⣿⣿⣿⣦⠀⠀⠀⠀⣴⣿⣿⣿⣿⡿⠋⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠙⢿⣿⣿⣿⣿⡄⠀⢰⣿⣿⣿⣿⠟⠁⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠻⣿⣿⣿⣿⣤⣿⣿⣿⣿⠟⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣽⣿⣿⣿⣿⣿⣿⣿⣯⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣰⣿⣿⣿⣿⣿⣿⣿⣿⣿⣆⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⣴⣿⣿⣿⣿⠟⠻⣿⣿⣿⣿⣿⣦⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⢀⣾⣿⣿⣿⣿⠏⠀⠀⠙⢿⣿⣿⣿⣿⣷⡀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⢀⣴⣿⣿⣿⣿⡿⠁⠀⠀⠀⠀⠈⠻⣿⣿⣿⣿⣿⣦⡀⠀⠀⠀⠀
⠀⠀⠀⠀⣠⣿⣿⣿⣿⡿⠋⠀⠀⠀⠀⠀⠀⠀⠀⠙⢿⣿⣿⣿⣿⣿⣄⠀⠀⠀
⠀⠀⠀⣴⣿⣿⣿⡿⠋⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠙⢿⣿⣿⣿⣿⣦⠀⠀
⠀⠀⠀⠉⠉⠉⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⠉⠉⠉⠉⠀⠀{/}`;

function stopAudio() { exec('taskkill /F /IM cmdmp3.exe /T > nul 2>&1'); }
function playBeep() { player.play(beepfile); }
function playBeep2() { player.play(beepfile2); }
function playwin() { player.play(winfile); }
function playwarning() { player.play(warningfile); }
function playBoot() { player.play(BOOTfile); }
function playsucesso() { player.play(sucessofile); }
function playGameOverSound() { player.play(GOfile); }
function playAlarm() { player.play(alarm); }


function execGameOver(reason) {
    stopAudio();
    setTimeout(() => {
        playGameOverSound();
        
        container.children.forEach(c => c.hide());
        
        const goBox = blessed.box({
            parent: screen,
            top: 'center',
            left: 'center',
            width: 'shrink',
            height: 'shrink',
            padding: 2,
            content: `{center}{red-fg}{bold}GAME OVER{/bold}{/red-fg}\n\n${reason}{/center}`,
            tags: true,
            border: {
                type: 'line',
                fg: 'red'
            },
            style: {
                bold: true,
                bg: 'black'
            }
        });

        screen.render();
        
        if (fs.existsSync('./TERMINALACCESS/POWER_ACTIVE.status')) {
            fs.unlinkSync('./TERMINALACCESS/POWER_ACTIVE.status');
        }

        setTimeout(() => process.exit(0), 2000);
    }, 200);
}

function shuffleProtocols() {
    itensEmbaralhados = [...protocolosBase].sort(() => Math.random() - 0.5);
    menuBox.setItems(itensEmbaralhados.map(i => i.text));
    updateBorderColor();
}

function showFeedback(art, isError) {
    const flash = blessed.box({
        parent: screen, top: 'center', left: 'center', width: '100%', height: '100%',
        align: 'center', valign: 'middle', content: art, tags: true, border: 'line',
        style: { border: { fg: isError ? 'red' : 'green' }, bg: 'black' }
    });
    screen.render();
    setTimeout(() => { flash.destroy(); screen.render(); menuBox.focus(); }, 800);
}

function updateBorderColor() {
    const selectedId = itensEmbaralhados[menuBox.selected].id;
    menuBox.style.border.fg = (selectedId === passoAtual) ? 'green' : 'red';
    screen.render();
}

function updateStatus() {
    statusBox.setContent(`{green-fg}ENERGY: ${energia}%\nSANITY: ${sanidade}%\nHEALTH: ${saude}%\n\nPHASE: ${passoAtual}/5{/}`);
    
    if (energia <= 0) execGameOver("CRITICAL POWER FAILURE");
    else if (sanidade <= 0) execGameOver("MIND COLLAPSE");
    else if (saude <= 0) execGameOver("UNIT TERMINATED");

    screen.render();
}

function startFinalAuth() {
    menuBox.hide();
    const finalCode = Math.random().toString().slice(2, 12);
    let timeLeft = 15;

    const overlay = blessed.box({
        parent: screen, top: 'center', left: 'center', width: 40, height: 10,
        border: 'line', label: ' {green-fg}AUTH{/green-fg} ',
        style: { border: { fg: 'green' } }, align: 'center', tags: true
    });

    const display = blessed.box({
        parent: overlay, top: 1, left: 'center', width: '90%', height: 3,
        tags: true, align: 'center', valign: 'middle',
        content: `{green-fg}KEY: ${finalCode}\nT-MINUS: ${timeLeft}s{/}`
    });

    const inputField = blessed.textbox({
        parent: overlay, top: 5, left: 'center', width: 15, height: 3,
        border: 'line', style: { border: { fg: 'green' } },
        keys: true, inputOnFocus: true, tags: true
    });

    const countdown = setInterval(() => {
        timeLeft--;
        display.setContent(`{green-fg}KEY: ${finalCode}\nT-MINUS: ${timeLeft}s{/}`);
        if (timeLeft <= 0) {
            clearInterval(countdown);
            execGameOver("AUTHENTICATION TIMEOUT");
        }
        screen.render();
    }, 1000);

    inputField.on('submit', (val) => {
        clearInterval(countdown);
        if (val === finalCode) {
            playsucesso();
            overlay.destroy();
            showFeedback(ART_CHECK, false);
            setTimeout(() => {
                if (fs.existsSync('./TERMINALACCESS/POWER_ACTIVE.status')) fs.unlinkSync('./TERMINALACCESS/POWER_ACTIVE.status');
                fs.writeFileSync('./TERMINALACCESS/ELEVATOR_OPEN.status', '1');
                process.exit(0);
            }, 1200);
        } else {
            execGameOver("INVALID SECURITY KEY");
        }
    });

    inputField.focus();
    screen.render();
}

menuBox.on('keypress', (ch, key) => {
    if (key.name === 'up' || key.name === 'down') {
        playBeep();
        setTimeout(updateBorderColor, 10);
    }
});

menuBox.on('select', (item, index) => {
    playBeep2();
    const selectedId = itensEmbaralhados[index].id;
    let success = false;

    if (selectedId === passoAtual && selectedId < 4) {
        passoAtual++;
        energia -= 5;
        sanidade -= 5;
        success = true;
    } else if (selectedId === 4 && passoAtual === 4) {
        startFinalAuth();
        return;
    }

    if (success) {
        playsucesso();
        showFeedback(ART_CHECK, false);
        logBox.add(`{green-fg}[OK]: STEP_${passoAtual} VERIFIED.{/}`);
    } else {
        playGameOverSound();
        showFeedback(ART_X, true);
        logBox.add("{red-fg}[FAILURE]: GRID RESET.{/}");
        passoAtual = 0;
        energia -= 15;
        saude -= 10;
    }
    
    shuffleProtocols();
    updateStatus();
});

screen.key(['escape', 'C-c'], () => {
    stopAudio();
    process.exit(0);
});

updateStatus();
shuffleProtocols();
menuBox.focus();
