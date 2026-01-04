const fs = require('fs');
const path = require('path');

const timeFile = path.resolve(__dirname, '..', 'CONFIG', 'TIME.txt');

function resetTimeOnly() {
    try {
        if (fs.existsSync(timeFile)) {
            // Define o status como ON e o tempo acumulado como 0
            fs.writeFileSync(timeFile, "ON\n0", 'utf8');
            // Log opcional para o terminal caso queira ver o processo
            // console.log("TEMPORAL VECTORS RESET TO ZERO.");
        }
    } catch (err) {
        // Silêncio total em caso de erro
    }
}

resetTimeOnly();