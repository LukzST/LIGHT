const blessed = require('blessed');
const fs = require('fs');
const { exec, spawn } = require('child_process');
const path = require('path');
const os = require('os');

// --- CARREGAMENTO DE CONFIGURAÇÕES ---
let COLOR_HEX = '#ff0000';
try {
    COLOR_HEX = fs.readFileSync('../CONFIG/COLORDEFAULT.txt', 'utf8').trim();
} catch (e) {}

// Caminhos para o Puzzle de Arquivos (USANDO DOCUMENTOS PARA EVITAR PRIVILÉGIOS DE ADM)
const desktopPath = path.join(os.homedir(), 'Desktop', 'PASSWORD_ACESS_FOLDER');
const rootPassPath = path.join(os.homedir(), 'Documents', 'passwordjob.txt');
const passwordValue = "L1GHT_SYST3M_0000_X_TR4NSM1SS1ON_S3CUR1TY_V3R1F13D_50";

const arquivosParaLimpar = [
    './TERMINALACCESS/ACESSOSTATUS.LIGHT',
    './TERMINALACCESS/MEMORY_1999.bin',
    './TERMINALACCESS/GAMEOVER.status',
    './TERMINALACCESS/TERMINAL_ATIVO.status'
];

arquivosParaLimpar.forEach(arquivo => {
    if (fs.existsSync(arquivo)) fs.unlinkSync(arquivo);
});

// Função para limpar rastros do puzzle
function limparPuzzle() {
    if (fs.existsSync(rootPassPath)) try { fs.unlinkSync(rootPassPath); } catch(e) {}
    if (fs.existsSync(desktopPath)) {
        try {
            const files = fs.readdirSync(desktopPath);
            files.forEach(f => fs.unlinkSync(path.join(desktopPath, f)));
            fs.rmdirSync(desktopPath);
        } catch(e) {}
    }
}

// --- SETUP DA TELA ---
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

// --- WIDGETS GLOBAIS ---
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
    content: ' [SETAS] Navegar | [ENTER] Selecionar ',
    border: { type: 'line' },
    style: { fg: 'white', border: { fg: '#333333' } }
});

const LOGO_TEXT = `
███         ███  ████████  ███  ███  █████████
███         ███  ███  ███  ███  ███      ███
███         ███  ███       ███  ███      ███
███         ███  ███ ████  ████████      ███
███         ███  ███  ███  ███  ███      ███
███         ███  ███  ███  ███  ███      ███
███         ███  ███  ███  ███  ███      ███
█████████   ███  ████████  ███  ███      ███`;

// --- FUNÇÕES AUXILIARES ---

function execGameOver(motivo) {
    limparPuzzle();
    container.children.forEach(c => c.hide());
    const goBox = blessed.box({
        parent: container,
        top: 'center',
        left: 'center',
        width: 'shrink',
        height: 'shrink',
        padding: 2,
        content: `{center}{red-fg}GAME OVER{/red-fg}\n\n${motivo}{/center}`,
        tags: true,
        border: { type: 'line', fg: 'red' },
        style: { bold: true }
    });
    screen.render();
    setTimeout(() => process.exit(0), 5000);
}

async function digitar(box, texto, atraso = 30) {
    return new Promise((resolve) => {
        let i = 0;
        box.content = '';
        const intervalo = setInterval(() => {
            box.content += texto[i];
            screen.render();
            i++;
            if (i === texto.length) {
                clearInterval(intervalo);
                resolve();
            }
        }, atraso);
    });
}

// --- FASE 8: O ESCRITÓRIO E A SALA DE CONTROLE ---

async function faseEscritorioCaos() {
    container.children.forEach(c => { if(c !== statusBox) c.hide(); });
    
    const officeBox = blessed.box({
        parent: container, top: 'center', left: 'center', width: '85%', height: '70%', tags:true,
        border: { type: 'line' }, style: style, padding: 1, scrollable: true
    });

    const cenas = [
        "[SISTEMA]: Você entra no prédio. O ar está pesado.",
        "[CAOS]: Colegas de trabalho correm em círculos, alguns rezando, outros destruindo monitores.",
        "[DESESPERO]: 'A LUZ NÃO VOLTA!', grita a recepcionista enquanto seus olhos sangram sombras.",
        "[MISSÃO]: Você ignora os gritos e corre para o subsolo.",
        "[LOCALIZADO]: Você avista uma placa de metal escovado: 'SALA DE GERENCIAMENTO DE ENERGIA'."
    ];

    for (const cena of cenas) {
        await digitar(officeBox, cena);
        await new Promise(res => screen.once('keypress', (ch, key) => { if(key.name === 'enter') res(); }));
    }

    officeBox.setContent("{center}\n\n[ FOCO NA PLACA ]\n\nSALA DE GERENCIAMENTO DE ENERGIA{/center}");
    officeBox.parseTags = true;
    screen.render();
    await new Promise(res => setTimeout(res, 3000));

    const menuSala = blessed.list({
        parent: container, top: 'center', left: 'center', width: '50%', height: 10, tags:true,
        label: ' AÇÕES NA SALA ',
        items: [' 1. Sentar na Cadeira de Controle ', ' 2. Gritar por ajuda ', ' 3. Tentar sair do prédio '],
        keys: true, border: { type: 'line' }, style: style, align: 'center'
    });

    menuSala.on('select', async (item, index) => {
        if (index === 0) {
            menuSala.hide();
            await digitar(officeBox, "[SISTEMA]: Você senta na cadeira. O terminal à sua frente pisca em verde...");
            
            const acaoTerminal = blessed.list({
                parent: container, bottom: 5, left: 'center', width: '40%', height: 6,
                items: [' > LIGAR TERMINAL ', ' > DESTRUIR TERMINAL '],
                keys: true, border: { type: 'line' }, style: style
            });

            acaoTerminal.on('select', (it, idx) => {
                if (idx === 1) execGameOver("Você destruiu a última esperança de luz. A escuridão te devorou.");
                else {
                    // ABRE A NOVA INSTÂNCIA
                    const statusPath = './TERMINALACCESS/POWER_ACTIVE.status';
                    fs.writeFileSync(statusPath, '1');
                    
                    // Inicia o novo terminal em uma janela separada
                    exec('start cmd /c "node TERMINAL_ENERGIA.js"');
                    
                    officeBox.setContent("{center}SISTEMA LIGADO EM SEGUNDA INSTÂNCIA.\nAGUARDANDO SEQUÊNCIA DE DESBLOQUEIO DO ELEVADOR...{/center}");
                    acaoTerminal.hide();
                    screen.render();

                    // Monitora o fechamento da segunda instância e a liberação do elevador
                    const checkFechamento = setInterval(async () => {
                        if (!fs.existsSync(statusPath)) {
                            clearInterval(checkFechamento);
                            
                            // Verifica se o outro terminal criou o arquivo de sucesso
                            if (fs.existsSync('./TERMINALACCESS/ELEVATOR_OPEN.status')) {
                                fs.unlinkSync('./TERMINALACCESS/ELEVATOR_OPEN.status');
                                
                                // CONTINUAÇÃO DA HISTÓRIA
                                officeBox.hide();
                                const elevatorScene = blessed.box({
                                    parent: container, top: 'center', left: 'center', width: '80%', height: '60%',
                                    border: { type: 'line' }, style: style, padding: 1, tags: true
                                });

                                const narraElevador = [
                                    "[SISTEMA]: O terminal se apaga. Um estrondo ecoa no final do corredor.",
                                    "[NARRADOR]: As luzes de emergência do Setor 4 piscam em azul neon.",
                                    "[YOU]: Consegui... o elevador está funcionando.",
                                    "[NARRADOR]: Você corre até as portas metálicas. Elas se abrem lentamente revelando um interior espelhado.",
                                    "[YOU]: Se eu subir até o topo, talvez eu veja o que restou do sol."
                                ];

                                for (const f of narraElevador) {
                                    await digitar(elevatorScene, f);
                                    await new Promise(res => screen.once('keypress', (ch, key) => { if(key.name === 'enter') res(); }));
                                }
                                
                                execGameOver("Você entrou no elevador. A subida começou.");
                            } else {
                                execGameOver("O terminal de energia foi encerrado sem a liberação dos protocolos.");
                            }
                        }
                    }, 1000);
                }
            });
            acaoTerminal.focus();
            screen.render();

        } else {
            execGameOver("Você perdeu tempo precioso. A sala foi inundada por sombras.");
        }
    });

    menuSala.focus();
    screen.render();
}

// --- FASE DO TRABALHO COM SENHA ---

async function faseTrabalhoSenha() {
    container.children.forEach(c => { if(c !== statusBox) c.hide(); });

    // Criar arquivos do Puzzle
    try {
        if (!fs.existsSync(desktopPath)) fs.mkdirSync(desktopPath);
        fs.writeFileSync(path.join(desktopPath, 'LEIA-ME.txt'), "Jogue aqui o arquivo 'passwordjob.txt' encontrado na sua pasta DOCUMENTOS para validar seu acesso.");
        fs.writeFileSync(rootPassPath, passwordValue);
    } catch (e) {
        execGameOver("ERRO CRÍTICO: Falha ao gerar chaves de segurança na pasta Documentos.");
        return;
    }

    const loginBox = blessed.box({
        parent: container,
        top: 'center',
        left: 'center',
        width: '75%',
        height: '55%',
        border: { type: 'line' },
        tags:true,
        style: style,
        padding: 1,
        content: `[SISTEMA DE ACESSO CORPORATIVO]\n\nSTATUS: AGUARDANDO CREDENCIAIS...\n\nSENHA REQUERIDA: 50 CARACTERES.\nDICA: Verifique a sua pasta DOCUMENTOS agora.\n\nInstrução: Arraste o arquivo 'passwordjob.txt' para a pasta 'PASSWORD_ACESS_FOLDER' na sua Área de Trabalho.`
    });
    screen.render();

    const monitor = setInterval(() => {
        const files = fs.readdirSync(desktopPath).filter(f => f !== 'LEIA-ME.txt');
        
        if (files.length > 0) {
            clearInterval(monitor);
            const fileDropped = files[0];
            const content = fs.readFileSync(path.join(desktopPath, fileDropped), 'utf8').trim();

            if (content === passwordValue) {
                loginBox.setContent("{center}{green-fg}ACESSO CONCEDIDO. BEM-VINDO AO SETOR 7.{/green-fg}{/center}");
                screen.render();
                setTimeout(() => {
                    limparPuzzle();
                    faseEscritorioCaos()
                }, 4000);
            } else {
                execGameOver("ARQUIVO DE CREDENCIAL FALSO OU CORROMPIDO. SEGURANÇA ACIONADA.");
            }
        }
    }, 1000);
}

// --- FASE 5: A ESCOLHA FINAL ---

function faseEscolhaFinal() {
    container.children.forEach(c => { if(c !== statusBox) c.hide(); });
    
    const menuFinal = blessed.list({
        parent: container,
        top: 'center',
        left: 'center',
        width: '60%',
        height: 10,
        label: ' CHEGADA AO TRABALHO ',
        items: [
            ' 1. ENTRAR E TRABALHAR ',
            ' 2. SAIR E APROVEITAR A VIDA ',
            ' 3. ALEATÓRIO (DECIDIR PELA SORTE) '
        ],
        keys: true,
        border: { type: 'line' },
        style: style,
        align: 'center'
    });

    menuFinal.on('select', (item, index) => {
        if (index === 0) {
            faseTrabalhoSenha(); 
        } else if (index === 1) {
            container.destroy();
            console.clear();
            console.log("Você escolheu a vida. Enquanto o mundo escurecia, você sentiu paz pela primeira vez.");
            process.exit(0);
        } else {
            const chanceFalha = Math.random() < 0.15; 
            if (chanceFalha) {
                execGameOver("O dado caiu em FALHA. Seus instintos te traíram e você entrou no prédio.");
            } else {
                container.destroy();
                console.clear();
                console.log("O dado te salvou. Você deu as costas ao prédio e foi aproveitar o fim.");
                process.exit(0);
            }
        }
    });

    menuFinal.focus();
    screen.render();
}

// --- FASE 4: O CAMINHO ---

async function faseOCaminho() {
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

    const relatos = [
        "[RELATO]: Você dirige pelas ruas... o asfalto parece absorver a luz dos faróis.",
        "[OBSERVAÇÃO]: Você vê um acidente de carro brutal. As vítimas apenas olham para o céu escuro.",
        "[MUNDO]: Prédios inteiros estão perdendo a cor, tornando-se cinza estático.",
        "[CAOS]: O céu às 7:00 da manhã está tão preto quanto o fundo de um poço.",
        "[NARRADOR]: Você finalmente estaciona em frente ao bloco de escritórios.",
        "--- PRESSIONE ENTER PARA SAIR DO CARRO ---"
    ];

    for (const texto of relatos) {
        await digitar(roadBox, texto);
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
    faseEscolhaFinal();
}


// --- FASE 3: GAMEPLAY (TIMER + TAREFAS COM DELAY) ---

async function iniciarGameplay(tempoInicial) {
    container.children.forEach(child => { if(child !== statusBox) child.hide(); });

    let tempoRestante = tempoInicial;
    let tarefasConcluidas = new Set();
    let emProgresso = false; 

    const timerBox = blessed.box({
        parent: container,
        top: 2,
        left: 'center',
        width: 20,
        height: 3,
        content: `TEMPO: ${tempoRestante}s`,
        align: 'center',
        border: { type: 'line' },
        style: { fg: COLOR_HEX, border: { fg: COLOR_HEX }, bold: true }
    });

    const acoesMenu = blessed.list({
        parent: container,
        top: 'center',
        left: 'center',
        width: '60%',
        height: 10,
        label: ' PREPARAÇÃO RÁPIDA ',
        items: [
            ' 1. Tomar banho gelado ',
            ' 2. Vestir uniforme de trabalho ',
            ' 3. Procurar as chaves do carro ',
            ' 4. Engolir o café da manhã ',
            ' 5. Checar as trancas das janelas ',
            ' 6. SAIR DE CASA '
        ],
        keys: true,
        border: { type: 'line' },
        style: style,
        align: 'center'
    });

    const timerInterval = setInterval(() => {
        if (!emProgresso) tempoRestante--;
        timerBox.setContent(`TEMPO: ${tempoRestante}s`);
        
        if (tempoRestante <= 10) {
            timerBox.style.fg = 'red';
            timerBox.style.border.fg = 'red';
        }

        if (tempoRestante <= 0) {
            clearInterval(timerInterval);
            execGameOver("O TEMPO ACABOU. VOCÊ CHEGOU ATRASADO NO TRABALHO.");
        }
        screen.render();
    }, 1000);

    acoesMenu.on('select', async (item, index) => {
        if (emProgresso) return; 

        if (index === 5) { 
            if (tarefasConcluidas.size >= 5) {
                clearInterval(timerInterval);
                faseOCaminho();
            } else {
                statusBox.setContent(" ERRO: Você ainda não terminou de se preparar! ");
                screen.render();
            }
        } else if (!tarefasConcluidas.has(index)) {
            emProgresso = true;
            const originalText = item.getText();
            let count = 0;
            
            const progressoInterval = setInterval(() => {
                count += 20;
                item.setContent(`${originalText} [${count}%]`);
                screen.render();
                
                if (count >= 100) {
                    clearInterval(progressoInterval);
                    item.style.fg = 'green';
                    tarefasConcluidas.add(index);
                    emProgresso = false;
                    statusBox.setContent(` Concluído: ${originalText.trim()} `);
                    screen.render();
                }
            }, 600); 
        }
    });

    acoesMenu.focus();
    screen.render();
}

// --- FASE 2: NARRATIVA ---

async function iniciarNarrativa() {
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

    const textos = [
        "[NARRADOR]: Você acorda em sua cama...",
        "[NARRADOR]: O mundo parece estar se 'apagando' ao seu redor...",
        "[YOU]: Que estranho os prédios parecem mais escuros... talvez seja minha cabeça.",
        "[NARRADOR]: Você descobre o pior: são 6:30. Você está atrasado.",
        "[YOU]: Droga! Eu tenho que sair AGORA!",
        "--- PRESSIONE ENTER PARA COMEÇAR A SE ARRUMAR ---"
    ];

    for (const texto of textos) {
        await digitar(narrativeBox, texto);
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
    iniciarGameplay(40); 
}

// --- FASE 1: MENU E MONITORAMENTO ---

async function monitorarSurvey() {
    const loading = blessed.loading({ 
        parent: container, top: 'center', left: 'center', 
        width: 'shrink', height: 'shrink', border: { type: 'line' }, style: style 
    });
    loading.load(' [SISTEMA AGUARDANDO RESPOSTAS DO SURVEY...] ');
    screen.render();

    return new Promise((resolve) => {
        const check = setInterval(() => {
            const sucessoExiste = fs.existsSync('./TERMINALACCESS/ACESSOSTATUS.LIGHT');
            const fadeExiste = fs.existsSync('./TERMINALACCESS/MEMORY_1999.bin');
            const falhaExiste = fs.existsSync('./TERMINALACCESS/GAMEOVER.status');

            if (sucessoExiste || fadeExiste || falhaExiste) {
                clearInterval(check);
                loading.stop();
                
                if (falhaExiste) {
                    execGameOver("SISTEMA BLOQUEADO: TENTATIVA DE INVASÃO.");
                } else if (fadeExiste) {
                    // --- LÓGICA DE RESET DA MEMÓRIA 1999 ---
                    container.children.forEach(c => c.hide());
                    
                    const fadeBox = blessed.box({
                        parent: container, top: 'center', left: 'center', width: '80%', height: '40%',
                        border: { type: 'line', fg: 'yellow' }, style: { fg: 'yellow' }, padding: 1,
                        content: "{center}{bold}[AVISO] MEMÓRIA DE 1999 SINCRONIZADA.{/bold}\n\nVOCÊ AGORA É PARTE DO THE FADE.\nSISTEMA EM CONFLITO.\n\n{blink}Pressione [ENTER] para limpar cache e tentar o Survey novamente...{/blink}{/center}",
                        tags: true
                    });
                    screen.render();

                    screen.once('keypress', (ch, key) => {
                        if (key.name === 'enter') {
                            fadeBox.destroy();
                            // Apaga o arquivo para não dar conflito no próximo loop
                            try { fs.unlinkSync('./TERMINALACCESS/MEMORY_1999.bin'); } catch(e) {}
                            
                            // Reinicia o processo do Survey
                            exec('start cmd /c "node SURVEY.js"');
                            resolve(monitorarSurvey()); // Loop recursivo
                        }
                    });
                } else {
                    // SUCESSO NORMAL
                    const status = fs.readFileSync('./TERMINALACCESS/ACESSOSTATUS.LIGHT', 'utf8').trim();
                    if (status === '1') {
                        resolve(true); // Libera para iniciarNarrativa()
                    } else {
                        execGameOver("FALHA NA AUTENTICAÇÃO.");
                    }
                }
            }
        }, 500);
    });
}

function iniciarMenuPrincipal() {
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
        items: [' > INICIAR SURVEY ', ' > SAIR '],
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
        const ok = await monitorarSurvey();

        if (ok) {
            iniciarNarrativa();
        } else {
            execGameOver("SISTEMA BLOQUEADO: TENTATIVA DE INVASÃO DETECTADA.");
        }
    });

    menu.focus();
    screen.render();
}

// --- INICIALIZAÇÃO ---
screen.key(['escape', 'C-c'], () => {
    limparPuzzle();
    process.exit(0);
});
iniciarMenuPrincipal();