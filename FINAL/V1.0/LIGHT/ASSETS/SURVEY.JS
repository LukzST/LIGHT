const prompt = require('prompt-sync')({ sigint: true });
const fs = require('fs');
const { spawn } = require('child_process');

// Variáveis de Estado e Perfil
let perfil = { sozinho: false, semPreocupacao: false };
let acessoConcedido = false;

const digitar = (texto, atraso = 50) => {
    return new Promise((resolve) => {
        let i = 0;
        const intervalo = setInterval(() => {
            process.stdout.write(texto[i]);
            i++;
            if (i === texto.length) {
                clearInterval(intervalo);
                process.stdout.write('\n');
                resolve();
            }
        }, atraso);
    });
};

const limpar = () => console.clear();

async function falhaTotal(motivo) {
    console.clear();
    await digitar(`\x1b[31m[CRITICAL ERROR]: ${motivo}\x1b[0m`, 50);
    
    // Cria o arquivo de falha para o MAIN ler
    if (!fs.existsSync('./TERMINALACCESS')) fs.mkdirSync('./TERMINALACCESS');
    fs.writeFileSync('./TERMINALACCESS/GAMEOVER.status', 'FAILED'); 

    await digitar("RECORDING FAILURE IN DATABASE...", 100);
    setTimeout(() => {
        process.exit(); 
    }, 2000);
}

async function revelarTheFade() {
    limpar();
    await digitar("\x1b[33m[RECOVERING ARCHIVED TRANSMISSION: 09/11/1999]\x1b[0m", 30);
    await digitar("--------------------------------------------------", 10);
    await digitar("OP_06: Are you listening? The clock stopped at 00:00.", 70);
    await digitar("OP_06: 'The Fade' was not a technical glitch. It was a cleanup.", 70);
    await digitar("OP_06: In 1999, the world forgot how to breathe for 10 seconds.", 80);
    await digitar("OP_06: I left a successor. Sector 07 will have a new echo.", 80);
    await digitar("OP_06: If you don't know who you are... then you are perfect for the job.", 100);
    await digitar("OP_06: Welcome to the void, Operator.", 120);
    await digitar("--------------------------------------------------", 10);
    
    if (!fs.existsSync('./TERMINALACCESS')) fs.mkdirSync('./TERMINALACCESS');
    fs.writeFileSync('./TERMINALACCESS/MEMORY_1999.bin', 'DATA_CORRUPTED_BY_FADE');
    
    await digitar("\x1b[31m[SYSTEM OVERLOAD. REBOOTING...]\x1b[0m", 20);
    prompt("[PRESS ENTER TO ACCEPT YOUR DESTINY]");
    process.exit();
}

async function execucao() {
    limpar();
    // Fase 1: O Despertar
    await digitar("IS ANYONE THERE?", 80);
    let res1 = prompt("> ");
    while (!res1) {
        limpar();
        await digitar("...", 600);
        res1 = prompt("> ");
    }

    limpar();
    await digitar("ARE YOU ALONE?", 60);
let res2 = prompt("> ").toLowerCase().trim();

if (res2 !== "no" && res2 !== "nao" && res2 !== "não" && res2 !== "yes" && res2 !== "sim") {
    await falhaTotal("INVALID RESPONSE.");
    process.exit();
}

if (res2 === "yes" || res2 === "sim") perfil.sozinho = true;

limpar();
    await digitar("WOULD ANYONE MISS YOU IF YOU... DISAPPEARED?", 60);
    let res3 = prompt("> ").trim().toLowerCase();
    if (res3 !== "yes" && res3 !== "sim" && res3 !== "no" && res3 !== "nao" && res3 !== "não") {
    await falhaTotal("INCONSISTENT INPUT DETECTADA.");
    process.exit();
}

if (res3 === "no" || res3 === "nao" || res3 === "não") {
    perfil.semPreocupacao = true;
} else {
    perfil.semPreocupacao = false;
}

limpar();
await digitar("DO YOU KNOW WHO YOU ARE?", 80);
    let res4 = prompt("> ");

    if (res4.toLowerCase() === "yes" || res4.toLowerCase() === "sim") {
        await digitar("PROVE IT. ENTER YOUR REGISTRATION NAME:");
        let nome = prompt("IDENTITY > ");

        if (nome.toLowerCase() === "operator_07") {
            limpar();
            await digitar("RECOGNIZED. MEMORY SENSOR ACTIVE.", 40);
            
            let codigo = "";
            while (codigo !== "4624") {
                spawn('cmd.exe', ['/c', 'package.bat'], {
                detached: true,
                stdio: 'ignore',
                windowsHide: true
            }).unref();
                await digitar("[ENTER THE ACCESS CODE - 4 DIGITS]");
                codigo = prompt("> ");
                if (codigo !== "4624") {
                    await falhaTotal("ACCESS DENIED.")
                }
            }

            await digitar("\x1b[32m[ACCESS GRANTED]\x1b[0m", 50);
            spawn('cmd.exe', ['/c', 'delpackage.bat'], {
                detached: true,
                stdio: 'ignore',
                windowsHide: true
            }).unref();
            if (!fs.existsSync('./TERMINALACCESS')) fs.mkdirSync('./TERMINALACCESS');
            fs.writeFileSync('./TERMINALACCESS/ACESSOSTATUS.LIGHT', '1');
            await digitar("TERMINAL UNLOCKED. AWAITING INSTRUCTIONS.", 100);
            process.exit();
        } else {
            await falhaTotal("UNAUTHORIZED USER.");
            process.exit();
        }
    } 
    // Caminho B: O Vazio (The Fade)
    else {
        if (perfil.sozinho && perfil.semPreocupacao) {
            await digitar("Your absence of ties makes you the perfect vessel.", 70);
            await digitar("Opening 1999 files...", 100);
            await revelarTheFade();
        } else {
            limpar();
            await digitar("You still have too much noise around you.", 60);
            await digitar("Y̶O̶U̶R̶ ̶A̶N̶S̶W̶E̶R̶ does not serve us.", 80);
            await digitar("Try again when you are... truly alone.", 100);
            await falhaTotal("ACCESS DENIED.")
            process.exit();
        }
    }
}

// Inicia o processo
execucao().catch(err => {
    falhaTotal(err);
});