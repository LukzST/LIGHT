const fs = require('fs');
const path = require('path');

const ALL_ACHIEVEMENTS = [
    { id: 'PACPRO' }, { id: 'THE_END' }, { id: 'NEVERMISS' }, 
    { id: 'OVERRIDE' }, { id: 'REBEL_PATH' }, { id: 'CEO_CONFRONT' }, 
    { id: 'TRUTH_SEEKER' }, { id: 'RADIO_LISTENER' }, { id: 'GHOST_GUARDIAN' }, 
    { id: 'SLOWTYPIST' }, { id: 'SHADOW_FALL' }, { id: 'LEAK_SAVED' }, 
    { id: 'RARE_BOOT' }, { id: 'AUDIOPHOBIC' }, { id: 'COLOR_MASTER' }, 
    { id: 'DATA_MINER' }, { id: 'GLITCH_ADDICT' }, { id: 'TERMINAL_JUNKIE' }, 
    { id: 'HARD_RESET' }, 
];

const achDir = path.join(__dirname, '..', 'Achievements');

if (!fs.existsSync(achDir)) {
    fs.mkdirSync(achDir, { recursive: true });
}

console.log("--- INICIANDO PROTOCOLO DE DESBLOQUEIO ---");

ALL_ACHIEVEMENTS.forEach(ach => {
    const fileAch = path.join(achDir, `${ach.id}.ach`);

    try {
        fs.writeFileSync(fileAch, 'COMPLETED', 'utf8');
        console.log(`[OK] ${ach.id} gerado.`);
    } catch (err) {
        console.log(`[ERRO] Falha ao criar ${ach.id}: ${err.message}`);
    }
});

console.log("--- TODOS OS SETORES SINCRONIZADOS ---");