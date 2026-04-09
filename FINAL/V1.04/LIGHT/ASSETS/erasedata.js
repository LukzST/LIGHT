const fs = require('fs');
const path = require('path');

const achievementsPath = path.resolve(__dirname, '..', 'ACHIEVEMENTS');
const terminalAccessPath = path.resolve(__dirname, 'ASSETS', 'TERMINALACCESS');
const gameoverFile = path.resolve(__dirname, 'TERMINALACCESS', 'GAMEOVER.status');

function wipeSystem() {
    try {
        
        if (fs.existsSync(achievementsPath)) {
            const files = fs.readdirSync(achievementsPath);
            files.forEach(file => {
                if (path.extname(file).toLowerCase() === '.ach') {
                    fs.unlinkSync(path.join(achievementsPath, file));
                }
            });
        }

        
        if (fs.existsSync(gameoverFile)) {
            fs.unlinkSync(gameoverFile);
        }

        
       
        if (fs.existsSync(terminalAccessPath)) {
            
            fs.rmSync(terminalAccessPath, { recursive: true, force: true });
        }

        if (fs.existsSync('../CONFIG/KEY.txt')) {
            fs.unlinkSync('../CONFIG/KEY.txt')
        }
        if (fs.existsSync('../CONFIG/PACPRO_SEEN.TXT')) {
            fs.unlinkSync('../CONFIG/PACPRO_SEEN.txt')
        }

        if (fs.existsSync('../CONFIG/CHECKPOINT.JSON')) {
            fs.unlinkSync('../CONFIG/CHECKPOINT.JSON')
        }

    } catch (err) {
    
    }
}

wipeSystem();
