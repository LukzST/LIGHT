const fs = require('fs');
const path = require('path');

// Caminho para a pasta ACHIEVEMENTS (ajustado para sua estrutura)
const folderPath = path.resolve(__dirname, '..', 'ACHIEVEMENTS');

function wipeBinFiles() {
    try {
        if (fs.existsSync(folderPath)) {
            const files = fs.readdirSync(folderPath);
            
            files.forEach(file => {
                // Filtro rigoroso: apenas arquivos que terminam com .bin
                if (path.extname(file).toLowerCase() === '.bin') {
                    const fullPath = path.join(folderPath, file);
                    fs.unlinkSync(fullPath);
                }
            });
        }
    } catch (err) {
        // Falha em silêncio. Sem logs, sem avisos.
    }
}

wipeBinFiles();