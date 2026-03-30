const blessed = require('blessed');
const fs = require('fs');
const path = require('path');
const { exec, spawn } = require('child_process');
const os = require('os');
const { t } = require('./translate.js');

const player = require('play-sound')({
    player: '../AUDIO/PLAYER/cmdmp3.exe'
});

const beepfile = '../AUDIO/EFFECTS/BEEP.wav';
const beepfile2 = '../AUDIO/EFFECTS/BEEP2.wav';
const winfile = '../AUDIO/EFFECTS/win.wav';
const warningfile = '../AUDIO/EFFECTS/warning.wav';
const alarm = '../AUDIO/EFFECTS/alarm.mp3';
const MEMORY1999 = '../AUDIO/EFFECTS/1999.WAV';

let screen = null;
let currentStep = 0;

function playBeep() {
    player.play(beepfile, (err) => {});
}

function playBeep2() {
    player.play(beepfile2, (err) => {});
}

function playWin() {
    player.play(winfile, (err) => {});
}

function playWarning() {
    player.play(warningfile, (err) => {});
}

function playAlarm() {
    player.play(alarm, (err) => {});
}

function play1999() {
    player.play(MEMORY1999, (err) => {});
}

async function typeWriter(box, text, delay = 30) {
    return new Promise((resolve) => {
        let i = 0;
        box.content = '';
        const interval = setInterval(() => {
            if (i < text.length) {
                box.content += text[i];
                screen.render();
                i++;
            } else {
                clearInterval(interval);
                resolve();
            }
        }, delay);
    });
}

async function operator06MemorySequence() {
    screen = blessed.screen({
        smartCSR: true,
        title: 'OPERATOR 06 - MEMORY FRAGMENT',
        fullUnicode: true
    });

    const container = blessed.box({
        parent: screen,
        width: '100%',
        height: '100%',
        style: { bg: 'black' }
    });

    const mainBox = blessed.box({
        parent: container,
        top: 'center',
        left: 'center',
        width: '85%',
        height: '80%',
        border: { type: 'line', fg: 'cyan' },
        style: { bg: 'black' },
        padding: 2,
        tags: true
    });

    screen.render();

    const steps = [
        { text: t('MEMORY_STEP_1'), sound: null, delay: 2000 },
        { text: t('MEMORY_STEP_2'), sound: null, delay: 2000 },
        { text: t('MEMORY_STEP_3'), sound: 'beep', delay: 2000 },
        { text: t('MEMORY_STEP_4'), sound: 'alarm', delay: 3000 },
        { text: t('MEMORY_STEP_5'), sound: '1999', delay: 3000 },
        { text: t('MEMORY_STEP_6'), sound: null, delay: 2000 },
        { text: t('MEMORY_STEP_7'), sound: null, delay: 2000 },
        { text: t('MEMORY_STEP_8'), sound: 'win', delay: 2000 }
    ];

    for (let i = 0; i < steps.length; i++) {
        const step = steps[i];
        
        if (step.sound === 'beep') playBeep2();
        if (step.sound === 'alarm') playAlarm();
        if (step.sound === '1999') play1999();
        if (step.sound === 'win') playWin();
        
        await typeWriter(mainBox, step.text);
        
        if (i === steps.length - 1) {
            await new Promise(resolve => {
                setTimeout(resolve, 3000);
                screen.key(['enter', 'escape'], () => resolve());
            });
        } else {
            await new Promise(resolve => {
                setTimeout(resolve, step.delay);
                screen.once('keypress', (ch, key) => {
                    if (key.name === 'enter') resolve();
                });
            });
        }
        
        mainBox.setContent('');
        screen.render();
    }

    await showOperator06Choice(container);
}

async function showOperator06Choice(container) {
    mainBox.destroy();
    
    const choiceBox = blessed.box({
        parent: container,
        top: 'center',
        left: 'center',
        width: 60,
        height: 14,
        border: { type: 'line', fg: 'yellow' },
        label: t('MEMORY_CHOICE_TITLE'),
        tags: true,
        padding: 2,
        style: { bg: 'black' }
    });

    const message = blessed.box({
        parent: choiceBox,
        top: 0,
        left: 0,
        width: '100%',
        height: 6,
        tags: true,
        content: t('MEMORY_CHOICE_MESSAGE')
    });

    const options = blessed.list({
        parent: choiceBox,
        bottom: 1,
        left: 'center',
        width: '80%',
        height: 5,
        keys: true,
        tags: true,
        items: [
            t('MEMORY_CHOICE_SAVE'),
            t('MEMORY_CHOICE_LEAVE'),
            t('MEMORY_CHOICE_END')
        ],
        style: {
            selected: { bg: 'yellow', fg: 'black' },
            item: { fg: 'white' }
        }
    });

    options.focus();
    screen.render();

    options.on('select', (item, index) => {
        playBeep2();
        
        if (index === 0) {
            fs.writeFileSync('./TERMINALACCESS/OPERATOR06_SAVED.status', 'SAVED');
            fs.writeFileSync('../ACHIEVEMENTS/OPERATOR06_SAVED.ACH', 'COMPLETED');
            showEnding(container, 'save');
        } else if (index === 1) {
            showEnding(container, 'leave');
        } else {
            showEnding(container, 'end');
        }
    });

    screen.key(['escape'], () => {
        showEnding(container, 'leave');
    });
}

async function showEnding(container, type) {
    container.children.forEach(c => c.destroy());
    
    const endBox = blessed.box({
        parent: container,
        top: 'center',
        left: 'center',
        width: 60,
        height: 10,
        border: { type: 'line', fg: type === 'save' ? 'green' : 'red' },
        tags: true,
        padding: 2,
        style: { bg: 'black' }
    });

    let content = '';
    if (type === 'save') {
        content = t('MEMORY_ENDING_SAVE');
        playWin();
    } else if (type === 'leave') {
        content = t('MEMORY_ENDING_LEAVE');
        playWarning();
    } else {
        content = t('MEMORY_ENDING_END');
        playWarning();
    }

    await typeWriter(endBox, content);
    
    screen.key(['enter', 'escape'], () => {
        screen.destroy();
        process.exit(0);
    });
}

function checkUnlockConditions() {
    const hasVoiceHeard = fs.existsSync('../ACHIEVEMENTS/VOICE_HEARD.ACH');
    const hasRemembered = fs.existsSync('../ACHIEVEMENTS/REMEMBERED.ACH');
    const hasTruthSeeker = fs.existsSync('../ACHIEVEMENTS/TRUTH_SEEKER.ACH');
    
    return hasVoiceHeard && hasRemembered && hasTruthSeeker;
}

const isUnlocked = checkUnlockConditions();

if (!isUnlocked) {
    const tempScreen = blessed.screen({ smartCSR: true });
    const lockBox = blessed.box({
        parent: tempScreen,
        top: 'center',
        left: 'center',
        width: 50,
        height: 8,
        border: 'line',
        tags: true,
        content: t('MEMORY_LOCKED'),
        style: { border: { fg: 'red' } }
    });
    tempScreen.render();
    setTimeout(() => process.exit(0), 3000);
} else {
    play1999();
    operator06MemorySequence();
}