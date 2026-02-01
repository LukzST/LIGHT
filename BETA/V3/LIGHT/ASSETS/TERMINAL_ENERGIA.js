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
    label: ' SEQUENCE PROTOCOLS ', border: { type: 'line' },
    items: [
        ' > 1. Shadow Fuses Diagnosis ',
        ' > 2. Calibrate Light Frequency ',
        ' > 3. Magnetic Lock Bypass (Sector 4) ',
        ' > 4. Energize Elevator Rails ',
        ' > 5. RESTART SYSTEM (FINISH) '
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
        logBox.add("{red-fg}[FATAL]: INSUFFICIENT RESOURCES TO MAINTAIN THE ROOM.{/red-fg}");
        logBox.add("{red-fg}[SYSTEM]: Critical failure in life support.{/red-fg}");
        
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
        `{bold}ENERGY:{/bold}   ${energia}%\n` +
        `{bold}SANITY:{/bold}   ${sanidade}%\n` +
        `{bold}HEALTH:{/bold}   ${saude}%`
    );
    screen.render();
    checkDeath(); // Verifica a cada atualização
}

logBox.add("[INITIALIZING]: Sector 4 access detected.");
logBox.add("[LOCKDOWN]: Elevator without power. Sequence protocol required.");
updateStatus();

menuBox.on('select', (item, index) => {
    // Lógica de Sequência
    if (index === 0 && passoAtual === 0) {
        passoAtual = 1;
        energia -= 10;
        logBox.add("[OK]: Fuses cleared. Shadow residues removed.");
    } else if (index === 1 && passoAtual === 1) {
        passoAtual = 2;
        sanidade -= 15; // Aumentado o custo para risco
        logBox.add("[OK]: Frequency at 600THz. Shadows are screaming in the vents.");
    } else if (index === 2 && passoAtual === 2) {
        passoAtual = 3;
        energia -= 20;
        logBox.add("[OK]: Sector 4 lock deactivated. The path is clear.");
    } else if (index === 3 && passoAtual === 3) {
        passoAtual = 4;
        energia -= 25;
        logBox.add("[CRITICAL]: Elevator energized. Awaiting restart command.");
    } else if (index === 4) {
        if (passoAtual === 4) {
            logBox.add("[INFO]: Sequence complete. Releasing Main Terminal lock...");
            setTimeout(() => {
                if (fs.existsSync('./TERMINALACCESS/POWER_ACTIVE.status')) {
                    fs.unlinkSync('./TERMINALACCESS/POWER_ACTIVE.status');
                }
                fs.writeFileSync('./TERMINALACCESS/ELEVATOR_OPEN.status', '1');
                process.exit(0);
            }, 3000);
        } else {
            logBox.add("[ERROR]: Incomplete sequence. Risk of shadow short-circuit.");
            saude -= 20;
            sanidade -= 10;
        }
    } else {
        logBox.add("[FAILURE]: Protocol out of order. Resetting logic.");
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