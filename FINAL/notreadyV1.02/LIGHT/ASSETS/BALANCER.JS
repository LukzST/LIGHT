const blessed = require('blessed');
const fs = require('fs');
const { exec } = require('child_process');
const { t } = require('./translate.js');

const beepfile = '../AUDIO/EFFECTS/BEEP.wav';      
const beepfile2 = '../AUDIO/EFFECTS/BEEP2.wav';    
const winfile = '../AUDIO/EFFECTS/win.wav';        
const BOOTfile = '../AUDIO/EFFECTS/LUX-4.wav';     
const sucessofile = '../AUDIO/EFFECTS/win2.wav';   
const GOfile = '../AUDIO/EFFECTS/GAMEOVER.MP3';    

const player = require('play-sound')({
    player: '../AUDIO/PLAYER/cmdmp3.exe'
});

const screen = blessed.screen({
    smartCSR: true,
    title: 'LUX-4_CORE_STABILIZER_V12_DYNAMIC',
    style: { bg: 'black' }
});

let timeLeft = 30;
let modeTimer = 5;
let gameActive = false; 
let integrity = 100;
let currentPhase = 0; 
let barPos = 50;
let barTarget = 50;
let pulseVal = 0;
let pulseTargetPos = 75;
let hackChar = '';

const mainBox = blessed.box({
    parent: screen,
    top: 'center', left: 'center', width: '95%', height: '90%',
    border: { type: 'line', fg: '#00ff00' },
    label: t('BALANCER_TITLE'),
    tags: true, style: { fg: '#00ff00' },
    hidden: true 
});

const timerText = blessed.text({
    parent: mainBox, top: 1, right: 2, content: '', tags: true, bold: true
});

const integrityBar = blessed.progressbar({
    parent: mainBox,
    top: 1,
    left: 2,
    width: '40%',
    height: 1,
    content: t('BALANCER_INTEGRITY'), 
    tags: true,
    barBg: 'green',
    bg: '#222',
    filled: 100,
    style: {
        text: {
            fg: 'black',
        }
    }
});

const infoBox = blessed.box({
    parent: mainBox, bottom: 1, left: 'center', width: '90%', height: 3,
    content: '', tags: true, border: { type: 'line', fg: 'green' },
    style: { fg: 'green' }
});

const track = blessed.box({
    parent: mainBox, top: 'center', left: 'center', width: '80%', height: 3,
    style: { bg: '#111' }, border: { type: 'line', fg: '#333' }, hidden: true
});
const targetBar = blessed.box({ parent: track, top: 0, left: '50%', width: '20%', height: '100%', style: { bg: 'yellow' } });
const playerIndicator = blessed.box({ parent: track, top: 0, left: '50%', width: 2, height: '100%', style: { bg: 'green' } });

const pulseTrack = blessed.box({
    parent: mainBox, top: 'center', left: 'center', width: '80%', height: 7,
    border: { type: 'line', fg: 'cyan' }, hidden: true, label: t('BALANCER_PULSE_TITLE')
});
const pulseBg = blessed.box({ parent: pulseTrack, top: 2, left: 'center', width: '90%', height: 1, style: { bg: '#222' } });
const pulseTargetZone = blessed.box({ parent: pulseBg, top: 0, left: '75%', width: '15%', height: 1, style: { bg: 'white' }, tags: true, content: t('BALANCER_PULSE_ZONE'), align: 'center' });
const pulseCursor = blessed.box({ parent: pulseBg, top: 0, left: 0, width: 2, height: 1, style: { bg: 'cyan' } });

const hackDisplay = blessed.box({
    parent: mainBox, top: 'center', left: 'center', width: '40%', height: 5,
    border: { type: 'line', fg: 'magenta' }, hidden: true, align: 'center', valign: 'middle', tags: true
});

function stopAudio() { exec('taskkill /F /IM cmdmp3.exe /T > nul 2>&1'); }
function playBeep() { player.play(beepfile); }
function playBeep2() { player.play(beepfile2); }
function playWin() { player.play(winfile); }
function playBoot() { player.play(BOOTfile); }
function playSucessoFinal() { player.play(sucessofile); }
function playGameOverSound() { player.play(GOfile); }

function execGameOver(reason) {
    gameActive = false;
    stopAudio();
    setTimeout(() => {
        playGameOverSound();
        mainBox.hide();
        const goBox = blessed.box({
            parent: screen,
            top: 'center', left: 'center', width: 'shrink', height: 'shrink',
            padding: 2,
            content: t('BALANCER_GAME_OVER', { reason }),
            tags: true,
            border: { type: 'line', fg: 'red' },
            style: { bold: true, bg: 'black' }
        });
        screen.render();
        setTimeout(() => process.exit(0), 5000);
    }, 200);
}

function showBootSequence() {
    playBoot();
    const bootContainer = blessed.box({
        parent: screen, top: 'center', left: 'center', width: '100%', height: '100%', style: { bg: 'black' }
    });
    const msgBox = blessed.box({
        parent: bootContainer, top: 'center', left: 'center', width: 65, height: 10,
        border: 'line', tags: true,
        content: t('BALANCER_WARNING'),
        style: { border: { fg: 'yellow' } }
    }); 

    screen.render();
    screen.onceKey(['enter'], () => {
        playBeep2();
        bootContainer.destroy();
        startGame();
    });
}

function startGame() {
    mainBox.show();
    gameActive = true;
    switchPhase();
    setInterval(update, 30);
    setInterval(tick, 1000);
}

function switchPhase() {
    currentPhase = (currentPhase + 1) % 3;
    modeTimer = 5;
    track.hide(); pulseTrack.hide(); hackDisplay.hide();
    mainBox.style.border.fg = '#00ff00';
    
    if (currentPhase === 0) { 
        track.show(); 
        infoBox.setContent(t('BALANCER_MODE_BAR')); 
    }
    else if (currentPhase === 1) { 
        pulseTrack.show(); 
        pulseVal = 0; 
        randomizePulseTarget();
        infoBox.setContent(t('BALANCER_MODE_PULSE')); 
    }
    else if (currentPhase === 2) { 
        hackDisplay.show(); 
        generateHack(); 
        infoBox.setContent(t('BALANCER_MODE_HACK')); 
    }
}

function randomizePulseTarget() {
    pulseTargetPos = 20 + Math.floor(Math.random() * 60);
    pulseTargetZone.left = `${pulseTargetPos}%`;
}

function generateHack() {
    hackChar = String.fromCharCode(65 + Math.floor(Math.random() * 26));
    hackDisplay.setContent(t('BALANCER_HACK_KEY', { key: hackChar }));
}

function update() {
    if (!gameActive) return;

    if (currentPhase === 0) {
        barTarget = 50 + Math.sin(Date.now() / 600) * 35;
        targetBar.left = `${barTarget - 10}%`;
        playerIndicator.left = `${barPos}%`;
        if (Math.abs(barPos - barTarget) < 12) { 
            integrity = Math.min(100, integrity + 0.4); 
            playerIndicator.style.bg = 'green';
        } else { 
            integrity -= 0.8; 
            playerIndicator.style.bg = 'red'; 
        }
    } 
    else if (currentPhase === 1) {
        pulseVal += 1.8;
        if (pulseVal > 98) { 
            pulseVal = 0; 
            integrity -= 10; 
            playGameOverSound();
            randomizePulseTarget();
        }
        pulseCursor.left = `${pulseVal}%`;
    }
    else if (currentPhase === 2) {
        integrity -= 0.3;
    }

    integrityBar.setProgress(integrity);
    if (integrity <= 0) execGameOver(t('BALANCER_INTEGRITY_FAIL'));
    screen.render();
}

function tick() {
    if (!gameActive) return;
    timeLeft--; modeTimer--;
    timerText.setContent(t('BALANCER_TIME', { time: timeLeft, shift: modeTimer }));
    if (modeTimer <= 0) switchPhase();
    if (timeLeft <= 0) finish(true);
}

function finish(success) {
    gameActive = false;
    stopAudio();
    if (success) {
        setTimeout(() => playWin(), 200);
        fs.writeFileSync('./BALANCER_SUCCESS.status', '1');
        const endBox = blessed.box({
            parent: screen, top: 'center', left: 'center', width: 60, height: 10,
            border: 'line', tags: true, align: 'center', valign: 'middle',
            content: t('BALANCER_SUCCESS'),
            style: { border: { fg: 'green' }, bg: 'black' }
        });
        screen.render();
        setTimeout(() => process.exit(0), 4000);
    }
}

screen.on('keypress', (ch, key) => {
    if (!gameActive) return;
    
    if (currentPhase === 0) {
        if (['a', 'left', 'd', 'right'].includes(key.name)) {
            playBeep();
            if (key.name === 'a' || key.name === 'left') barPos = Math.max(0, barPos - 7);
            if (key.name === 'd' || key.name === 'right') barPos = Math.min(98, barPos + 7);
        }
    } 
    else if (currentPhase === 1 && key.name === 'enter') {
        if (pulseVal >= (pulseTargetPos - 2) && pulseVal <= (pulseTargetPos + 13)) { 
            playBeep2();
            integrity = Math.min(100, integrity + 15); 
            mainBox.style.border.fg = 'white';
        } else { 
            playGameOverSound();
            integrity -= 12; 
            mainBox.style.border.fg = 'red';
        }
        pulseVal = 0;
        randomizePulseTarget();
        setTimeout(() => { if(gameActive) mainBox.style.border.fg = 'cyan'; }, 150);
    } 
    else if (currentPhase === 2 && ch) {
        if (ch.toUpperCase() === hackChar) { 
            playBeep2();
            integrity = Math.min(100, integrity + 8); 
            generateHack(); 
        } else { 
            playGameOverSound();
            integrity -= 10; 
        }
    }
});

screen.key(['escape', 'C-c'], () => { stopAudio(); process.exit(0); });
showBootSequence();