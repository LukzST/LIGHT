const prompt = require('prompt-sync')();
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

// Função para parar o áudio vindo do Menu
function pararMusicaMenu() {
    spawn('taskkill', ['/F', '/IM', 'vlc.exe', '/T']);
}

const hexToAnsi = {
    '#ff0000': '\x1b[31m', // RED
    '#00ff00': '\x1b[32m', // GREEN
    '#0000ff': '\x1b[34m', // BLUE
    'DEFAULT': '\x1b[37m'  // WHITE
};

const COLOR_HEX = fs.readFileSync('../CONFIG/COLORDEFAULT.txt', 'utf8').trim();
const COLOR_NAME = fs.readFileSync('../CONFIG/COLORNAME.txt', 'utf8').trim();
const DIFFICULTY = fs.readFileSync('../CONFIG/DIFFICULTY.txt', 'utf8').trim();

// Define as cores finais
const COLORDEFAULT = hexToAnsi[COLOR_HEX] || hexToAnsi['#ff0000'];
const COLORNAME = hexToAnsi[COLOR_HEX] || hexToAnsi['#ff0000'];
const RESET = '\x1b[0m';

// --- FUNÇÕES DE INTERFACE (AS SUAS FUNÇÕES) ---

function centertext(text, cor = COLORDEFAULT) {
    const terminalWidth = process.stdout.columns || 80;
    const padding = Math.max(0, Math.floor((terminalWidth - text.length) / 2));
    console.log(' '.repeat(padding) + cor + text + RESET);
}

function displayLogo() {
    const cor = COLORDEFAULT; 
    const reset = "\x1b[0m";

    const logoText = 
        "\n\n" + 
        "███        ███  ████████  ███  ███  █████████\n" +
        "███        ███  ███  ███  ███  ███     ███\n" +
        "███        ███  ███       ███  ███     ███\n" +
        "███        ███  ███ ████  ████████     ███\n" +
        "███        ███  ███  ███  ███  ███     ███\n" +
        "███        ███  ███  ███  ███  ███     ███\n" +
        "███        ███  ███  ███  ███  ███     ███\n" +
        "█████████  ███  ████████  ███  ███     ███";
    
    const logoLines = logoText.split('\n');
    const maxLineWidth = Math.max(...logoLines.map(line => line.length));
    const terminalWidth = process.stdout.columns || 80;
    const padding = Math.max(0, Math.floor((terminalWidth - maxLineWidth) / 2));

    // Aplica a cor em cada linha individualmente
    logoLines.forEach(line => {
        console.log(' '.repeat(padding) + cor + line + reset);
    });
}

function gameover() {
    console.clear();
    const cor = COLORDEFAULT;
    const reset = "\x1b[0m";

    const logo = [
        "",
    " ███████████████    ████████████    █████████████████████     █████████████",
    "██████             ██████  ██████   ██████  ██████  ██████   ██████",
    "██████             ██████  ██████   ██████  ██████  ██████   ██████",
    "██████  ████████   ██████████████   ██████  ██████  ██████   ██████████",
    "██████    ██████   ██████  ██████   ██████  ██████  ██████   ██████",
    "██████    ██████   ██████  ██████   ██████  ██████  ██████   ██████",
    " ███████████████   ██████  ██████   ██████  ██████  ██████    █████████████",
    "",
    "   ██████████████    ██████  ██████    █████████████   ██████████████",
    "  ████████████████   ██████  ██████   ██████           ██████   ██████",
    "  ██████    ██████   ██████  ██████   ██████           ██████   ██████",
    "  ██████    ██████   ██████  ██████   ██████████       █████████████",
    "  ██████    ██████   ██████  ██████   ██████           ███████████████",
    "  ████████████████   ██████  ██████   ██████           ██████   ██████",
    "   ██████████████    █████████████     █████████████   ██████   ██████",
    ]

    const maxLineWidth = Math.max(...logo.map(line => line.length));
    const terminalWidth = process.stdout.columns || 80;
    const padding = Math.max(0, Math.floor((terminalWidth - maxLineWidth) / 2));

    logo.forEach(line => {
        console.log(' '.repeat(padding) + cor + line + reset);
    });
}

function pausarParaContinuar() {
    centertext("===========================================================================");
    centertext("-> Pressione [1] para iniciar o Protocolo Survey...");
    centertext("===========================================================================");
    while (prompt("> ") !== '1') { }
    console.clear();
}

// --- LOGICA DE ESPERA ---

async function monitorarProgresso() {
    console.clear();

    centertext("\x1b[32m[SISTEMA AGUARDANDO RESPOSTAS DO SURVEY...]\x1b[0m");
    centertext("NÃO FECHE ESTA JANELA.");

    return new Promise((resolve) => {
        const timer = setInterval(() => {
            const acessoExiste = fs.existsSync('./TERMINALACCESS/ACESSOSTATUS.LIGHT');
            const fadeExiste = fs.existsSync('./TERMINALACCESS/MEMORY_1999.bin');
            const falhaExiste = fs.existsSync('./TERMINALACCESS/GAMEOVER.status');

            if (acessoExiste || fadeExiste || falhaExiste) {
                clearInterval(timer);
                
                if (falhaExiste) {
                    resolve({ falhou: true });
                } else {
                    resolve({ 
                        sucesso: acessoExiste && fs.readFileSync('./TERMINALACCESS/ACESSOSTATUS.LIGHT', 'utf8') === '1',
                        fade: fadeExiste,
                        falhou: false
                    });
                }
            }
        }, 500);
    });
}

// --- EXECUÇÃO ---

async function main() {
const arquivosParaLimpar = [
        './TERMINALACCESS/ACESSOSTATUS.LIGHT',
        './TERMINALACCESS/MEMORY_1999.bin',
        './TERMINALACCESS/GAMEOVER.status'
    ];

    arquivosParaLimpar.forEach(arquivo => {
        if (fs.existsSync(arquivo)) fs.unlinkSync(arquivo);
    });

    displayLogo();
    centertext("")
    centertext("PRESSIONE [1] PARA INICIAR O SURVEY");
    if (prompt("> ") !== "1") process.exit();

    if (fs.existsSync('./TERMINALACCESS/ACESSOSTATUS.LIGHT')) fs.unlinkSync('./TERMINALACCESS/ACESSOSTATUS.LIGHT');
    if (fs.existsSync('./TERMINALACCESS/MEMORY_1999.bin')) fs.unlinkSync('./TERMINALACCESS/MEMORY_1999.bin');

    exec('start cmd /c "node SURVEY.js"');
    const resultado = await monitorarProgresso();

    console.clear();
    centertext("\x1b[32mVERIFICANDO REGISTROS...\x1b[0m");
    await new Promise(r => setTimeout(r, 2000));

    if (resultado.falhou) {
        gameover();
        centertext("\x1b[31m==============================================\x1b[0m");
        centertext("SISTEMA BLOQUEADO: TENTATIVA DE INVASÃO");
        centertext("\x1b[31m==============================================\x1b[0m");
    } else if (resultado.sucesso) {
        centertext("==============================================");
        centertext("BEM-VINDO DE VOLTA, OPERATOR_07");
        centertext("==============================================");
    } else if (resultado.fade) {
        centertext("\x1b[33m[AVISO] MEMÓRIA DE 1999 SINCRONIZADA.\x1b[0m");
        centertext("VOCÊ AGORA É PARTE DO THE FADE.");
    } else {
        gameover();
    }
}

main();