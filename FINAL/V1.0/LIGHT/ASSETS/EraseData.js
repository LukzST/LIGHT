const fs = require('fs');
const path = require('path');

// Definição de caminhos
const achievementsPath = path.resolve(__dirname, '..', 'ACHIEVEMENTS');
const terminalAccessPath = path.resolve(__dirname, 'ASSETS', 'TERMINALACCESS');
const gameoverFile = path.resolve(__dirname, 'TERMINALACCESS', 'GAMEOVER.status');

function wipeSystem() {
    try {
        // 1. Limpa conquistas (.bin)
        if (fs.existsSync(achievementsPath)) {
            const files = fs.readdirSync(achievementsPath);
            files.forEach(file => {
                if (path.extname(file).toLowerCase() === '.ach') {
                    fs.unlinkSync(path.join(achievementsPath, file));
                }
            });
        }

        // 2. Limpa o status de GAMEOVER (Permite novo Reroll)
        if (fs.existsSync(gameoverFile)) {
            fs.unlinkSync(gameoverFile);
        }

        // 3. Limpa a pasta de acesso ao terminal (Operator 07 / The Fade)
        if (fs.existsSync(terminalAccessPath)) {
            // Remove a pasta e tudo dentro dela de forma recursiva
            fs.rmSync(terminalAccessPath, { recursive: true, force: true });
        }

        if (fs.existsSync('../CONFIG/KEY.txt')) {
            fs.unlinkSync('../CONFIG/KEY.txt')
        }

    } catch (err) {
        // Falha em silêncio absoluto.
    }
}

wipeSystem();