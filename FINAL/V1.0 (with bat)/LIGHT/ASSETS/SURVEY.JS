const blessed = require('blessed');
const fs = require('fs');
const { spawn } = require('child_process');
const path = require('path');

// Variáveis de Estado
let perfil = { sozinho: false, semPreocupacao: false };
let etapaAtual = 0;

// Configuração da Tela
const screen = blessed.screen({
    smartCSR: true,
    title: 'LUX-4 SURVEY SYSTEM',
    fullUnicode: true
});

// Caixa Principal de Texto (Terminal)
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

// Campo de Entrada
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

// Função para simular digitação no Blessed (CORRIGIDA)
async function digitar(texto, delay = 30) {
    const prefixo = terminal.getContent() ? terminal.getContent() + "\n" : "";
    
    return new Promise(resolve => {
        let i = 0;
        let acumulado = "";
        const interval = setInterval(() => {
            acumulado += texto[i];
            terminal.setContent(prefixo + acumulado);
            terminal.setScrollPerc(100); // Força o scroll para baixo
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
    await digitar(`\n[CRITICAL ERROR]: ${motivo.toUpperCase()}`);
    await digitar("RECORDING FAILURE IN DATABASE...");
    
    if (!fs.existsSync('./TERMINALACCESS')) fs.mkdirSync('./TERMINALACCESS');
    fs.writeFileSync('./TERMINALACCESS/GAMEOVER.status', 'FAILED');
    
    setTimeout(() => process.exit(), 3000);
}

async function revelarTheFade() {
    input.hide();
    terminal.setContent("");
    terminal.style.fg = 'yellow';
    await digitar("{bold}[RECOVERING ARCHIVED TRANSMISSION: 09/11/1999]{/bold}", 20);
    await digitar("--------------------------------------------------", 5);
    await digitar("OP_06: Are you listening? The clock stopped at 00:00.", 50);
    await digitar("OP_06: 'The Fade' was not a technical glitch. It was a cleanup.", 50);
    await digitar("OP_06: In 1999, the world forgot how to breathe for 10 seconds.", 50);
    await digitar("OP_06: Welcome to the void, Operator.", 70);
    
    if (!fs.existsSync('./TERMINALACCESS')) fs.mkdirSync('./TERMINALACCESS');
    fs.writeFileSync('./TERMINALACCESS/MEMORY_1999.bin', 'DATA_CORRUPTED_BY_FADE');
    
    await digitar("\n{red-fg}[SYSTEM OVERLOAD. REBOOTING...]{/red-fg}", 20);
    await digitar("PRESS [ENTER] TO ACCEPT YOUR DESTINY");
    
    screen.onceKey(['enter'], () => process.exit());
}

// Lógica Principal do Fluxo
async function processarResposta(res) {
    let rawRes = res.toLowerCase().trim();
    input.clearValue();
    
    // Evita inputs vazios em etapas críticas
    if (etapaAtual > 0 && !rawRes) {
        input.focus();
        return;
    }

    switch(etapaAtual) {
        case 0: // IS ANYONE THERE?
            etapaAtual = 1;
            await digitar(`\n> ${res}\n`);
            await digitar("ARE YOU ALONE?");
            break;

        case 1: // ARE YOU ALONE?
            if (!["yes", "sim", "no", "nao", "não"].includes(rawRes)) {
                return falhaTotal("INVALID RESPONSE.");
            }
            if (rawRes === "yes" || rawRes === "sim") perfil.sozinho = true;
            etapaAtual = 2;
            await digitar(`\n> ${res}\n`);
            await digitar("WOULD ANYONE MISS YOU IF YOU... DISAPPEARED?");
            break;

        case 2: // WOULD ANYONE MISS YOU?
            if (!["yes", "sim", "no", "nao", "não"].includes(rawRes)) {
                return falhaTotal("INCONSISTENT INPUT.");
            }
            if (rawRes === "no" || rawRes === "nao" || rawRes === "não") perfil.semPreocupacao = true;
            etapaAtual = 3;
            await digitar(`\n> ${res}\n`);
            await digitar("DO YOU KNOW WHO YOU ARE?");
            break;

        case 3: // DO YOU KNOW WHO YOU ARE?
            await digitar(`\n> ${res}\n`);
            if (rawRes === "yes" || rawRes === "sim") {
                etapaAtual = 4;
                await digitar("PROVE IT. ENTER YOUR REGISTRATION NAME:");
            } else {
                if (perfil.sozinho && perfil.semPreocupacao) {
                    await digitar("Your absence of ties makes you the perfect vessel.");
                    await digitar("Opening 1999 files...");
                    setTimeout(() => revelarTheFade(), 2000);
                } else {
                    await digitar("You still have too much noise around you.");
                    await digitar("Y̶O̶U̶R̶ ̶A̶N̶S̶W̶E̶R̶ does not serve us.");
                    await falhaTotal("ACCESS DENIED.");
                }
            }
            break;

        case 4: // NAME REGISTRATION
            if (rawRes === "operator_07") {
                etapaAtual = 5;
                await digitar("\nRECOGNIZED. MEMORY SENSOR ACTIVE.");
                spawn('cmd.exe', ['/c', 'package.bat'], { detached: true, stdio: 'ignore' }).unref();
                await digitar("[ENTER THE ACCESS CODE - 4 DIGITS]");
            } else {
                await falhaTotal("UNAUTHORIZED USER.");
            }
            break;

        case 5: // CODE VERIFICATION
            if (rawRes === "4624") {
                input.hide();
                terminal.style.fg = 'cyan';
                await digitar("\n[ACCESS GRANTED]");
                spawn('cmd.exe', ['/c', 'delpackage.bat'], { detached: true, stdio: 'ignore' }).unref();
                
                if (!fs.existsSync('./TERMINALACCESS')) fs.mkdirSync('./TERMINALACCESS');
                fs.writeFileSync('./TERMINALACCESS/ACESSOSTATUS.LIGHT', '1');
                
                await digitar("TERMINAL UNLOCKED. AWAITING INSTRUCTIONS.");
                setTimeout(() => process.exit(), 4000);
            } else {
                await falhaTotal("ACCESS DENIED.");
            }
            break;
    }
    input.focus();
    screen.render();
}

// Inicialização
input.on('submit', (value) => {
    processarResposta(value);
});

// Força o foco no input se o usuário clicar fora
screen.on('click', () => input.focus());

screen.key(['C-c'], () => process.exit());

async function iniciar() {
    terminal.setContent("");
    input.focus();
    await digitar("IS ANYONE THERE?", 60);
    screen.render();
}

iniciar();