const fs = require('fs');
const path = require('path');

const timeFile = path.resolve(__dirname, '..', 'CONFIG', 'TIME.txt');

function resetTimeOnly() {
    try {
        if (fs.existsSync(timeFile)) {
            
            fs.writeFileSync(timeFile, "ON\n0", 'utf8');
            
        }
    } catch (err) {
    }
}

resetTimeOnly();
