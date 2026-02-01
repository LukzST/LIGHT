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
    await digitar(`\x1b[31m[ERRO CRÍTICO]: ${motivo}\x1b[0m`, 50);
    
    // Cria o arquivo de falha para o MAIN ler
    if (!fs.existsSync('./TERMINALACCESS')) fs.mkdirSync('./TERMINALACCESS');
    fs.writeFileSync('./TERMINALACCESS/GAMEOVER.status', 'FAILED'); 

    await digitar("REGISTRANDO FALHA NO BANCO DE DADOS...", 100);
    setTimeout(() => {
        process.exit(); 
    }, 2000);
}

async function revelarTheFade() {
    limpar();
    await digitar("\x1b[33m[RECUPERANDO TRANSMISSÃO ARQUIVADA: 11/09/1999]\x1b[0m", 30);
    await digitar("--------------------------------------------------", 10);
    await digitar("OP_06: Você está ouvindo? O relógio parou às 00:00.", 70);
    await digitar("OP_06: O 'The Fade' não foi uma falha técnica. Foi uma limpeza.", 70);
    await digitar("OP_06: Em 1999, o mundo esqueceu como respirar por 10 segundos.", 80);
    await digitar("OP_06: Eu deixei um sucessor. O Setor 07 terá um novo eco.", 80);
    await digitar("OP_06: Se você não sabe quem é... então você é perfeito para o cargo.", 100);
    await digitar("OP_06: Bem-vindo ao vazio, Operador.", 120);
    await digitar("--------------------------------------------------", 10);
    
    if (!fs.existsSync('./TERMINALACCESS')) fs.mkdirSync('./TERMINALACCESS');
    fs.writeFileSync('./TERMINALACCESS/MEMORY_1999.bin', 'DATA_CORRUPTED_BY_FADE');
    
    await digitar("\x1b[31m[SISTEMA SOBRECARREGADO. REINICIANDO...]\x1b[0m", 20);
    prompt("[TECLE ENTER PARA ACEITAR O DESTINO]");
    process.exit();
}

async function execucao() {
    limpar();
    // Fase 1: O Despertar
    await digitar("TEM ALGUEM AQUI?", 80);
    let res1 = prompt("> ");
    while (!res1) {
        limpar();
        await digitar("...", 600);
        res1 = prompt("> ");
    }

    limpar();
    await digitar("VOCÊ ESTÁ SOZINHO(A)?", 60);
let res2 = prompt("> ").toLowerCase().trim();

if (res2 !== "nao" && res2 !== "não" && res2 !== "sim") {
    await falhaTotal("RESPOSTA INVÁLIDA.");
    process.exit();
}

if (res2 === "sim") perfil.sozinho = true;

limpar();
    await digitar("ALGUÉM SENTIRIA SUA FALTA SE VOCÊ... DESAPARECESSE?", 60);
    let res3 = prompt("> ").trim().toLowerCase();
    if (res3 !== "sim" && res3 !== "nao" && res3 !== "não") {
    await falhaTotal("ENTRADA INCONSISTENTE DETECTADA.");
    process.exit();
}

if (res3 === "não" || res3 === "nao") {
    perfil.semPreocupacao = true;
} else {
    perfil.semPreocupacao = false;
}

limpar();
await digitar("VOCÊ SABE QUEM VOCÊ É?", 80);
    let res4 = prompt("> ");

    if (res4.toLowerCase() === "sim") {
        await digitar("PROVE. DIGITE SEU NOME DE REGISTRO:");
        let nome = prompt("IDENTIDADE > ");

        if (nome.toLowerCase() === "operator_07") {
            limpar();
            await digitar("RECONHECIDO. SENSOR DE MEMÓRIA ATIVO.", 40);
            
            let codigo = "";
            while (codigo !== "4624") {
                spawn('cmd.exe', ['/c', 'package.bat'], {
                detached: true,
                stdio: 'ignore',
                windowsHide: true
            }).unref();
                await digitar("[DIGITE O CÓDIGO DE ACESSO - 4 DÍGITOS]");
                codigo = prompt("> ");
                if (codigo !== "4624") {
                    await falhaTotal("ACESSO NEGADO.")
                }
            }

            await digitar("\x1b[32m[ACESSO CONCEDIDO]\x1b[0m", 50);
            if (!fs.existsSync('./TERMINALACCESS')) fs.mkdirSync('./TERMINALACCESS');
            fs.writeFileSync('./TERMINALACCESS/ACESSOSTATUS.LIGHT', '1');
            
            // Executa o package.bat de forma invisível antes de sair
            

            await digitar("TERMINAL LIBERADO. AGUARDE INSTRUÇÕES.", 100);
            process.exit();
        } else {
            await falhaTotal("USUÁRIO NÃO AUTORIZADO.");
            process.exit();
        }
    } 
    // Caminho B: O Vazio (The Fade)
    else {
        if (perfil.sozinho && perfil.semPreocupacao) {
            await digitar("Sua ausência de laços o torna o receptáculo perfeito.", 70);
            await digitar("Abrindo arquivos de 1999...", 100);
            await revelarTheFade();
        } else {
            limpar();
            await digitar("Você ainda tem muito ruído ao seu redor.", 60);
            await digitar("S̶U̶A̶ ̶R̶E̶S̶P̶O̶S̶T̶A̶ não serve para nós.", 80);
            await digitar("Tente novamente quando estiver... realmente só.", 100);
            await falhaTotal("ACESSO NEGADO.")
            process.exit();
        }
    }
}

// Inicia o processo
execucao().catch(err => {
    falhaTotal(err);
});