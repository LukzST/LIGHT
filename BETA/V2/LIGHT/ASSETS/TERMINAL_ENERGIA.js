const blessed = require('blessed');
const fs = require('fs');

const screen = blessed.screen({ smartCSR: true, title: 'POWER MANAGEMENT CONSOLE - SECTOR 4' });

const logBox = blessed.log({
    top: 0, left: 0, width: '70%', height: '70%',
    tags: true,
    label: ' SYSTEM LOG / OUTPUT ', border: { type: 'line' },
    style: { fg: 'green', border: { fg: 'green' } },
    scrollable: true, alwaysScroll: true
});

const statusBox = blessed.box({
    top: 0, right: 0, width: '30%', height: '70%',
    label: ' UNIT STATUS ', border: { type: 'line' },
    style: { fg: 'yellow', border: { fg: 'yellow' } },
    tags: true
});

const menuBox = blessed.list({
    bottom: 0, left: 0, width: '100%', height: '30%',
    tags: true,
    label: ' PROTOCOLOS DE SEQUÊNCIA ', border: { type: 'line' },
    items: [
        ' > 1. Diagnóstico de Fusíveis Sombras ',
        ' > 2. Calibrar Frequência de Luz ',
        ' > 3. Bypass de Trava Magnética (Setor 4) ',
        ' > 4. Energizar Trilhos do Elevador ',
        ' > 5. REINICIAR SISTEMA (FINALIZAR) '
    ],
    keys: true, style: {
        fg: 'cyan', border: { fg: 'cyan' },
        selected: { bg: 'cyan', fg: 'black' }
    }
});

screen.append(logBox);
screen.append(statusBox);
screen.append(menuBox);

let energia = 85;
let sanidade = 100;
let saude = 100;
let passoAtual = 0;

// --- NOVA FUNÇÃO DE VERIFICAÇÃO DE MORTE ---
function checkDeath() {
    if (energia <= 0 || sanidade <= 0 || saude <= 0) {
        menuBox.hide();
        logBox.add("{red-fg}[FATAL]: RECURSOS INSUFICIENTES PARA MANTER A SALA.{/red-fg}");
        logBox.add("{red-fg}[SISTEMA]: Falha crítica nos suportes de vida.{/red-fg}");
        
        // Limpa o status para o Main saber que deu erro
        if (fs.existsSync('./TERMINALACCESS/POWER_ACTIVE.status')) {
            fs.unlinkSync('./TERMINALACCESS/POWER_ACTIVE.status');
        }

        setTimeout(() => {
            process.exit(0);
        }, 3000);
    }
}

function updateStatus() {
    statusBox.setContent(
        `{bold}ENERGIA:{/bold}  ${energia}%\n` +
        `{bold}SANIDADE:{/bold} ${sanidade}%\n` +
        `{bold}SAÚDE:{/bold}    ${saude}%`
    );
    screen.render();
    checkDeath(); // Verifica a cada atualização
}

logBox.add("[INICIALIZANDO]: Acesso ao Setor 4 detectado.");
logBox.add("[BLOQUEIO]: Elevador sem energia. Protocolo de sequência necessário.");
updateStatus();

menuBox.on('select', (item, index) => {
    // Lógica de Sequência
    if (index === 0 && passoAtual === 0) {
        passoAtual = 1;
        energia -= 10;
        logBox.add("[OK]: Fusíveis limpos. Resíduos de sombras removidos.");
    } else if (index === 1 && passoAtual === 1) {
        passoAtual = 2;
        sanidade -= 15; // Aumentado o custo para risco
        logBox.add("[OK]: Frequência em 600THz. As sombras estão gritando nos dutos.");
    } else if (index === 2 && passoAtual === 2) {
        passoAtual = 3;
        energia -= 20;
        logBox.add("[OK]: Trava do Setor 4 desativada. O caminho está livre.");
    } else if (index === 3 && passoAtual === 3) {
        passoAtual = 4;
        energia -= 25;
        logBox.add("[CRÍTICO]: Elevador energizado. Aguardando comando de reinicialização.");
    } else if (index === 4) {
        if (passoAtual === 4) {
            logBox.add("[INFO]: Sequência completa. Liberando trava do Main Terminal...");
            setTimeout(() => {
                if (fs.existsSync('./TERMINALACCESS/POWER_ACTIVE.status')) {
                    fs.unlinkSync('./TERMINALACCESS/POWER_ACTIVE.status');
                }
                fs.writeFileSync('./TERMINALACCESS/ELEVATOR_OPEN.status', '1');
                process.exit(0);
            }, 3000);
        } else {
            logBox.add("[ERRO]: Sequência incompleta. Risco de curto-circuito sombrio.");
            saude -= 20;
            sanidade -= 10;
        }
    } else {
        logBox.add("[FALHA]: Protocolo fora de ordem. Reinicie a lógica.");
        passoAtual = 0;
        energia -= 10;
        saude -= 5;
    }
    updateStatus();
});

screen.key(['escape', 'C-c'], () => {
    if (fs.existsSync('./TERMINALACCESS/POWER_ACTIVE.status')) fs.unlinkSync('./TERMINALACCESS/POWER_ACTIVE.status');
    process.exit(0);
});

menuBox.focus();