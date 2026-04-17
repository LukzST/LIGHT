const blessed = require('blessed');
const fs = require('fs');
const { spawn } = require('child_process');
const path = require('path');
const { t } = require('./translate.js');

let perfil = { sozinho: false, semPreocupacao: false };
let etapaAtual = 0;

const screen = blessed.screen({
    smartCSR: true,
    title: 'LUX-4 SURVEY SYSTEM',
    fullUnicode: true
});

const terminal = blessed.box({
    parent: screen,
    top: 'center',
    left: 'center',
    width: '80%',
    height: '60%',
    border: { type: 'line' },
    style: {
        fg: 'green',
        border: { fg: '#333333' }
    },
    padding: 1,
    tags: true,
    scrollable: true,
    alwaysScroll: true,
    scrollbar: {
        ch: ' ',
        track: { bg: '#222' },
        style: { inverse: true }
    }
});

const input = blessed.textbox({
    parent: screen,
    bottom: 2,
    left: 'center',
    width: '80%',
    height: 3,
    border: { type: 'line' },
    style: {
        fg: 'white',
        border: { fg: 'green' },
        focus: { border: { fg: 'white' } }
    },
    inputOnFocus: true
});

async function digitar(texto, delay = 30) {
    const prefixo = terminal.getContent() ? terminal.getContent() + "\n" : "";
    
    return new Promise(resolve => {
        let i = 0;
        let acumulado = "";
        const interval = setInterval(() => {
            acumulado += texto[i];
            terminal.setContent(prefixo + acumulado);
            terminal.setScrollPerc(100); 
            screen.render();
            i++;
            if (i === texto.length) {
                clearInterval(interval);
                resolve();
            }
        }, delay);
    });
}

async function falhaTotal(motivo) {
    terminal.style.fg = 'red';
    input.hide();
    await digitar(t('SURVEY_CRITICAL_ERROR', { reason: motivo.toUpperCase() }));
    await digitar(t('SURVEY_RECORDING'));
    
    if (!fs.existsSync('./TERMINALACCESS')) fs.mkdirSync('./TERMINALACCESS');
    fs.writeFileSync('./TERMINALACCESS/GAMEOVER.status', 'FAILED');
    
    setTimeout(() => process.exit(), 3000);
}

async function revelarTheFade() {
    input.hide();
    terminal.setContent("");
    terminal.style.fg = 'yellow';
    await digitar(t('SURVEY_RECOVERING'), 20);
    await digitar(t('SURVEY_LINE'), 5);
    await digitar(t('SURVEY_OP1'), 50);
    await digitar(t('SURVEY_OP2'), 50);
    await digitar(t('SURVEY_OP3'), 50);
    await digitar(t('SURVEY_OP4'), 70);
    
    if (!fs.existsSync('./TERMINALACCESS')) fs.mkdirSync('./TERMINALACCESS');
    fs.writeFileSync('./TERMINALACCESS/MEMORY_1999.bin', 'DATA_CORRUPTED_BY_FADE');
    
    await digitar(t('SURVEY_OVERLOAD'), 20);
    await digitar(t('SURVEY_ACCEPT'));
    
    screen.onceKey(['enter'], () => process.exit());
}

async function processarResposta(res) {
    let rawRes = res.toLowerCase().trim();
    input.clearValue();
    if (etapaAtual > 0 && !rawRes) {
        input.focus();
        return;
    }

    switch(etapaAtual) {
        case 0: 
            etapaAtual = 1;
            await digitar(`\n> ${res}\n`);
            await digitar(t('SURVEY_Q1'));
            break;

        case 1: 
            if (!["yes", "sim", "no", "nao", "não"].includes(rawRes)) {
                return falhaTotal(t('SURVEY_ACCESS_DENIED'));
            }
            if (rawRes === "yes" || rawRes === "sim") perfil.sozinho = true;
            etapaAtual = 2;
            await digitar(`\n> ${res}\n`);
            await digitar(t('SURVEY_Q2'));
            break;

        case 2: 
            if (!["yes", "sim", "no", "nao", "não"].includes(rawRes)) {
                return falhaTotal(t('SURVEY_ACCESS_DENIED'));
            }
            if (rawRes === "no" || rawRes === "nao" || rawRes === "não") perfil.semPreocupacao = true;
            etapaAtual = 3;
            await digitar(`\n> ${res}\n`);
            await digitar(t('SURVEY_Q3'));
            break;

        case 3: 
            await digitar(`\n> ${res}\n`);
            if (rawRes === "yes" || rawRes === "sim") {
                etapaAtual = 4;
                await digitar(t('SURVEY_PROVE'));
            } else {
                if (perfil.sozinho && perfil.semPreocupacao) {
                    await digitar(t('SURVEY_VESSEL'));
                    await digitar(t('SURVEY_OPENING'));
                    setTimeout(() => revelarTheFade(), 2000);
                } else {
                    await digitar(t('SURVEY_NOISE'));
                    await digitar(t('SURVEY_ANSWER'));
                    await falhaTotal(t('SURVEY_ACCESS_DENIED'));
                }
            }
            break;

        case 4: 
            if (rawRes === "operator_07" || rawRes === "operador_07") {
                etapaAtual = 5;
                await digitar(t('SURVEY_RECOGNIZED'));
                spawn('cmd.exe', ['/c', 'survey_key.bat'], { detached: true, stdio: 'ignore' }).unref();
                await digitar(t('SURVEY_ENTER_CODE'));
            } else {
                await falhaTotal(t('SURVEY_UNAUTHORIZED'));
            }
            break;

        case 5: 
            if (rawRes === "4624") {
                input.hide();
                terminal.style.fg = 'cyan';
                await digitar(t('SURVEY_ACCESS_GRANTED'));
                spawn('cmd.exe', ['/c', 'del_survey_key.bat'], { detached: true, stdio: 'ignore' }).unref();
                
                if (!fs.existsSync('./TERMINALACCESS')) fs.mkdirSync('./TERMINALACCESS');
                fs.writeFileSync('./TERMINALACCESS/ACESSOSTATUS.LIGHT', '1');
                
                await digitar(t('SURVEY_UNLOCKED'));
                setTimeout(() => process.exit(), 4000);
            } else {
                await falhaTotal(t('SURVEY_ACCESS_DENIED'));
            }
            break;
    }
    input.focus();
    screen.render();
    
}

input.on('submit', (value) => {
    processarResposta(value);
});

screen.on('click', () => input.focus());

screen.key(['C-c'], () => process.exit());

async function iniciar() {
    terminal.setContent("");
    input.focus();
    await digitar(t('SURVEY_IS_ANYONE_THERE'), 60);
    screen.render();
}

iniciar();
if (fs.existsSync('./TERMINALACCESS/SURVEY_RUNNING.status')) {
    fs.unlinkSync('./TERMINALACCESS/SURVEY_RUNNING.status');
}
