const blessed = require('blessed');
const os = require('os');
const { spawn } = require('child_process');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const achievements = fs.readdirSync('../Achievements').filter(f => f.endsWith('.bin')).length;
let dots = 0;
const key = 'lux1999files'

const ALL_ACHIEVEMENTS = [
    { id: 'PACPRO', name: 'ELITE OPERATOR', desc: 'Completed the PACPRO simulation.', hint: 'Survive the PACPRO sub-process in the elevator.' },
    { id: 'THE_END', name: 'LIGHT BRINGER', desc: 'Reached the final conclusion of LIGHT.', hint: 'Reach any of the final game endings.' },
    { id: 'NEVERMISS', name: 'NEVER BE LATE', desc: 'Get past the tasks in under 38s.', hint: 'Be extremely fast during the morning tasks.' },
    { id: 'OVERRIDE', name: 'SYSTEM HACKER', desc: 'Accessed restricted developer info.', hint: 'Use the developer code in System Info.' },
    { id: 'REBEL_PATH', name: 'HELLO, REBEL', desc: 'Used the administrative override.', hint: 'Input an alternative code in the office login terminal.' },
    { id: 'CEO_CONFRONT', name: 'DIRECTOR’S CUT', desc: 'Confronted the CEO.', hint: 'Take the secret route to the CEO office.' },
    { id: 'TRUTH_SEEKER', name: 'DECRYPTOR', desc: 'Decrypted Project Fade logs.', hint: 'Find and use the encryption key correctly.' },
    { id: 'RADIO_LISTENER', name: 'STATIC VOICES', desc: 'Listened to the radio report.', hint: 'Choose to listen to the radio in the elevator.' },
    { id: 'GHOST_GUARDIAN', name: 'DIGITAL SHEPHERD', desc: 'Stabilized the Fade.', hint: 'Choose to protect the souls in the final core.' },
    { id: 'SLOWTYPIST', name: 'SLOW TYPIST', desc: 'Failed to cancel the SELF-DESTRUCT', hint: 'Let the timer reach zero during the Sublevel 7 security override.' },
    { id: 'SHADOW_FALL', name: 'CORE MELTDOWN', desc: 'The core was destroyed due to stabilization failure.', hint: 'Fail to maintain the balance during the final core sequence.' },
    { id: 'LEAK_SAVED', name: 'WHISTLEBLOWER', desc: 'Exported confidential files.', hint: 'Press [S] during the data leak phase.' },
];

//
//
//
//
//
//
//

color = '#555555'
// Verifica se o argumento --wt foi passado pelo .bat
const isModernTerminal = process.argv.includes('--wt');

// Variáveis Globais de Configuração
function startLogoAnimation() {
    setInterval(() => {
        // Só executa o efeito de glitch se a variável global GLITCH for 'ON'
        if (GLITCH === 'ON' && Math.random() > 0.85) {
            const glitchContent = logoOriginal.replace(/█/g, (char) => {
                const rand = Math.random();
                if (rand > 0.98) return ' ';
                if (rand > 0.95) return '#';
                return char;
            });
            
            logoBox.setContent(glitchContent);
            logoBox.style.fg = 'white'; 
        } else {
            // Se o glitch estiver OFF ou não cair no random, volta ao normal
            logoBox.setContent(logoOriginal);
            logoBox.style.fg = COLORDEFAULT; 
        }
        screen.render();
    }, 150);
}



// Função para tocar um som curto (SFX)
// Aqui dizemos ao play-sound para usar o executável de linha de comando
// Isso impede que o Windows abra o player padrão de interface gráfica
const player = require('play-sound')({ 
  player: './SOUNDTRACK/VLC/cmdmp3.exe' 
});



function fullscreen_pre_save() {
    // Só executa se estiver ligado E se for o terminal moderno
    if(FULLSCREEN === 'ON' && isModernTerminal) {
        const vbsPath = path.join(__dirname, 'toggle_fs.vbs');
        const BCT = `Set objShell = WScript.CreateObject("WScript.Shell")\nWScript.Sleep 100\nobjShell.SendKeys "{F11}"`;

        try {
            fs.writeFileSync(vbsPath, BCT);
            spawn('wscript.exe', [vbsPath]);
            // O unlink será feito no próximo ciclo ou manualmente
        } catch (err) {}
    } else {
        // Se não for terminal moderno, força o estado para OFF por segurança
        if (!isModernTerminal) FULLSCREEN = 'OFF';
    }
}

if (fs.existsSync('../CONFIG/SIDEBAR.txt')) {
    var SIDEBAR = fs.readFileSync(path.join('../CONFIG/SIDEBAR.txt'), 'utf8').trim();
} else {
    var SIDEBAR = 'OFF';
    fs.writeFileSync('../CONFIG/SIDEBAR.txt', SIDEBAR, 'utf8');
}

if (fs.existsSync('../CONFIG/GLITCH.txt')) {
  var GLITCH = fs.readFileSync(path.join('../CONFIG/GLITCH.txt'), 'utf8').trim();
} else {
  var GLITCH = 'ON';
  fs.writeFileSync('../CONFIG/GLITCH.txt', GLITCH, 'utf8');
}

if (fs.existsSync('../CONFIG/FULLSCREEN.txt')) {
  var FULLSCREEN = fs.readFileSync(path.join('../CONFIG/FULLSCREEN.txt'), 'utf8').trim();
} else {
  var FULLSCREEN = 'OFF';
  fs.writeFileSync('../CONFIG/FULLSCREEN.txt', FULLSCREEN, 'utf8');
}

if (fs.existsSync('../CONFIG/AUDIOSTATE.txt')) {
  var audiostate = fs.readFileSync(path.join('../CONFIG/AUDIOSTATE.txt'), 'utf8')
} else {
  var audiostate = 'ON';
  fs.writeFileSync('../CONFIG/AUDIOSTATE.txt', audiostate, 'utf8');
}

if (fs.existsSync('../CONFIG/COLORDEFAULT.txt')) {
  var COLORNAME = fs.readFileSync(path.join('../CONFIG/COLORNAME.txt'), 'utf8').trim();
  var COLORDEFAULT = fs.readFileSync(path.join('../CONFIG/COLORDEFAULT.txt'), 'utf8').trim();
} else {
  var COLORNAME = 'RED';
  var COLORDEFAULT = '#ff0000';
  fs.writeFileSync('../CONFIG/COLORNAME.txt', COLORNAME, 'utf8');
  fs.writeFileSync('../CONFIG/COLORDEFAULT.txt', COLORDEFAULT, 'utf8');
}

if (fs.existsSync('../CONFIG/USER.txt')) {
  var USERNAMEP = fs.readFileSync(path.join('../CONFIG/USER.txt'), 'utf8').trim();
} else {
  var USERNAMEP = 'OPERATOR 07';
  fs.writeFileSync('../CONFIG/USER.txt', USERNAMEP, 'utf8');
}

if (fs.existsSync('../CONFIG/DIFFICULTY.txt')) {
  var DIFFICULTY = fs.readFileSync(path.join('../CONFIG/DIFFICULTY.txt'), 'utf8').trim();
} else {
  var DIFFICULTY = 'NORMAL';
  fs.writeFileSync('../CONFIG/DIFFICULTY.txt', DIFFICULTY, 'utf8');
}

let CANwin = 'OFF';
let vlcProcess = null;
const audioFile = './SOUNDTRACK/1.mp3';

let winVersion = os.release()
let userName = os.userInfo().username;


let friendlyName = 'Windows';

if (winVersion.startsWith('10.0.2')) friendlyName = 'Windows 11';
if (winVersion.startsWith('10.0.1')) friendlyName = 'Windows 10';
if (winVersion.startsWith('6.3')) friendlyName = 'Windows 8.1 - NOT SUPPORTED';
if (winVersion.startsWith('6.1')) friendlyName = 'Windows 7 - NOT SUPPORTED';

if (audiostate === 'ON') {
    // Inicia o VLC em modo "Dummy" (sem interface) e em loop
    vlcProcess = spawn('./SOUNDTRACK/VLC/vlc.exe', ['-I', 'dummy', '--loop', audioFile]);
  }
 fullscreen_pre_save();


const screen = blessed.screen({
  smartCSR: true,
  title: 'LIGHT',
  fullUnicode: true
});



const logoOriginal = 
    "███        ███  ████████  ███  ███  █████████\n" +
    "███        ███  ███  ███  ███  ███     ███\n" +
    "███        ███  ███       ███  ███     ███\n" +
    "███        ███  ███ ████  ████████     ███\n" +
    "███        ███  ███  ███  ███  ███     ███\n" +
    "███        ███  ███  ███  ███  ███     ███\n" +
    "███        ███  ███  ███  ███  ███     ███\n" +
    "█████████  ███  ████████  ███  ███     ███";

// Versão com "Glitch" (alguns caracteres trocados)
const logoGlitch = logoOriginal.replace(/█/g, (match) => (Math.random() > 0.95 ? '@' : match));

const logoText = 
    "███        ███  ████████  ███  ███  █████████\n" +
    "███        ███  ███  ███  ███  ███     ███\n" +
    "███        ███  ███       ███  ███     ███\n" +
    "███        ███  ███ ████  ████████     ███\n" +
    "███        ███  ███  ███  ███  ███     ███\n" +
    "███        ███  ███  ███  ███  ███     ███\n" +
    "███        ███  ███  ███  ███  ███     ███\n" +
    "█████████  ███  ████████  ███  ███     ███";

const logoBox = blessed.box({
  top: 2,
  left: 'center',
  width: 'shrink',
  height: 8,
  content: logoText,
  style: { fg: COLORDEFAULT}
});

// Container Principal do Menu
const menuBox = blessed.form({
  top: 11,
  left: 'center',
  width: 45,
  height: 10,
  tags: true,
  border: { type: 'line' },
  style: {
    border: { fg: '#555555' },
    bg: 'black'
  }
});


const mainList = blessed.list({
  parent: menuBox,
  tags: true,
  top: 1,
  left: 'center',
  width: '90%',
  height: '80%',
  keys: true,
  mouse: true,
  items: ['{center}START MISSION{/center}','{center}ACHIEVEMENTS{/center}', '{center}SETTINGS{/center}', '{center}ERASE DATA{/center}', '{center}SYSTEM INFO{/center}', '{center}CREDITS{/center}', '{center}SUPPORT{/center}', '{center}EXIT{/center}'],
  style: {
    selected: { bg: COLORDEFAULT, fg: 'white', bold: true },
    item: { fg: '#bbbbbb' }
  }
});

mainList.on('select item', (item) => {
  const rawText = item.getText().replace(/{.*?}/g, '').trim();
  
  const desc = menuDescriptions[rawText] || 'SELECT AN OPTION USING ARROW KEYS AND PRESS ENTER';
  
  descriptionBox.setContent(`{bold}${desc.toUpperCase()}{/}`);
  
  screen.render();
});



const descriptionBox = blessed.box({
  parent: screen,
  bottom: 0, // Posiciona no rodapé
  left: '0',
  width: '100%',
  tags: true,
  height: 1, // Tamanho pequeno para a mini descrição
  content: '{bold}SELECT AN OPTION USING ARROW KEYS AND PRESS ENTER{/}',
  style: {
    fg: color,
  }
});

const menuDescriptions = {
  'START MISSION': 'START THE PRIMARY OPERATIONAL PROTOCOL.',
  'ACHIEVEMENTS': 'SEE YOUR ACHIEVEMENTS',
  'SETTINGS': 'AUDIO, COLOR, USER AND FULL SCREEN CONFIGURATION.',
  'ERASE DATA': 'ERASE ALL LOCAL USER DATA AND SETTINGS.',
  'SYSTEM INFO': 'VIEW SYSTEM AND TERMINAL INFORMATION.',
  'CREDITS': 'INFORMATION ABOUT THE DEVELOPMENT TEAM.',
  'SUPPORT THE GAME': 'HELP THE DEVELOPMENT OF LIGHT GAME.',
  'EXIT': 'EXIT THE APPLICATION SAFELY. (DO NOT FORCE CLOSE)'
};




const copyrightBOX1 = blessed.box({
  parent: screen,
  bottom: 0,
  right: '0',
  width: 'shrink',
  height: 1,
  content: ' V3_BETA ',
  tags: true,
  style: {
    fg: color,
    bold: true,
  },
});


function confirmExit() {
  const bgOverlay = blessed.box({
    parent: screen,
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    style: {
      bg: 'black',
      transparent: false
    }
  });
  bgOverlay.setIndex(200);

  const confirmWin = blessed.list({
    parent: bgOverlay,
    top: 'center',
    left: 'center',
    width: 40,
    height: 10,
    border: 'line',
    label: ' [ EXIT ] ',
    keys: true,
    tags: true,
    items: [
      '{center}YES{/center}',
      '{center}NO{/center}'
    ],
    selected: 0,
    style: {
      border: { fg: COLORDEFAULT },
      selected: { bg: COLORDEFAULT, fg: 'white', bold: true }
    }
  });


  confirmWin.focus();
  confirmWin.select(0);
  screen.render();

  confirmWin.on('select', (item) => {
    const txt = item.getText();
   
    if (txt.includes('YES')) {
      process.exit(0);
    } 
    
    if (txt.includes('NO')) {
      bgOverlay.destroy();
      mainList.focus();
      screen.render();
    }
  });

  screen.key(['escape'], function handleEsc() {
    bgOverlay.destroy();
    mainList.focus();
    screen.unkey('escape', handleEsc);
    screen.render();
  });
}

function credits() {
const currentYear = new Date().getFullYear();

const bg1Overlay = blessed.box({
    parent: screen,
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    style: {
      bg: 'black',
      transparent: false
    }
  });

  const creditsBox = blessed.box({
    parent: bg1Overlay,
    top: 'center',
    left: 'center',
    width: 50,
    height: 12,
    border: 'line',
    label: ' [ CREDITS ] ',
    tags: true,
    content: '{center}LIGHT GAME\n\nDeveloped by Pale Luna Developer\n\n'+currentYear+' © All Rights Reserved\n\nPress ESC to return{/center}',
    style: {
      border: { fg: COLORDEFAULT },
      label: { fg: COLORDEFAULT, bold: true }
    }
  });
    function closeCredits() {
    creditsBox.destroy();
    bg1Overlay.destroy();
    mainList.focus();
    screen.unkey('escape', closeCredits);
    screen.render();
  }
    screen.key(['escape'], closeCredits);
    screen.render();
}

function eraseData() {
 const bg1Overlay = blessed.box({
    parent: screen,
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    style: {
      bg: 'black',
      transparent: false // Define como false para esconder o que está atrás
    }
  });

   const eraseWin = blessed.list({
    parent: bg1Overlay,
    top: 'center',
    left: 'center',
    width: 40,
    height: 10,
    border: 'line',
    label: ' [ ERASE DATA ] ',
    keys: true,
    items: [
      ' YES ',
      ' NO '
    ],
    selected: 0,
    style: {
      border: { fg: COLORDEFAULT },
      selected: { bg: COLORDEFAULT, fg: 'white', bold: true }
    }
  });

  eraseWin.focus();
  eraseWin.select(0);
  screen.render();

    eraseWin.on('select', (item) => {
    const txt = item.getText();
    if (txt.includes('NO')) {
        bg1Overlay.destroy(); // Destrói o fundo e tudo que estiver dentro dele
        mainList.focus();
        screen.render();
        return;
    }
    if (txt.includes('YES')) {
        bg1Overlay.destroy();
        
        // O spawn não abre uma janela extra por padrão, ele roda no mesmo contexto
        const eraser = spawn('node', ['./EraseData.js'], {
            stdio: 'inherit', // Faz os logs de deleção aparecerem no seu terminal atual
            detached: false
        });

        eraser.on('close', (code) => {
            // Após terminar de deletar, volta o foco para o menu
            mainList.focus();
            screen.render();
        });

        eraser.on('error', (err) => {
            // Caso o arquivo EraseData.js não seja encontrado
            mainList.setItem(0, '{red-fg}ERRO AO APAGAR DADOS{/red-fg}');
            mainList.focus();
            screen.render();
        });

        return;
    }
    });
}

function showSettings() {
  // 1. Criar o fundo (Background Overlay)
  const bgOverlay = blessed.box({
    parent: screen,
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    style: {
      bg: 'black',
      transparent: false // Define como false para esconder o que está atrás
    }
  });

  // Adiciona um efeito de moldura ou sombra no fundo se quiser
  const decor = blessed.box({
    parent: bgOverlay,
    top: 'center',
    left: 'center',
    width: 50,
    height: 15,
    border: { type: 'line' },
    style: { border: { fg: '#222222' } }
  });

  // 2. A lista de configurações (agora dentro do overlay)
  const settingsWin = blessed.list({
    parent: bgOverlay,
    top: 'center',
    left: 'center',
    width: 42,
    height: 11,
    border: 'line',
    label: ' [ SETTINGS ] ',
    keys: true,
    tags:true,
    items: [
      ' AUDIO: [' + audiostate + ']',
      ' COLOR: [' + COLORNAME + ']',
      ' GLITCH LOGO: [' + GLITCH + ']',
      ' USERNAME: [' + USERNAMEP + ']',
      ' FULL SCREEN: [' + FULLSCREEN + ']',
      ' SIDEBAR: [' + SIDEBAR + ']',
      '{white-fg}─────────────────────────────────────────{/white-fg}',
      ' RESET TO DEFAULTS ',
      ' BACK TO MENU '
    ],
    selected: 0,
    style: {
      border: { fg: COLORDEFAULT },
      selected: { bg: COLORDEFAULT, fg: 'white', bold: true }
    }
  });

  settingsWin._lastIndex = 0;
  settingsWin.on('select item', (item, index) => {
    if (index === 6) { // Se cair na linha do separador
      if (settingsWin._lastIndex < index) {
        settingsWin.select(7); // Pula para baixo
      } else {
        settingsWin.select(5); // Pula para cima
      }
    }
    settingsWin._lastIndex = settingsWin.selected;
    screen.render();
  });

  settingsWin.focus();
  settingsWin.select(0);
  screen.render();

  settingsWin.on('select', (item) => {
    const txt = item.getText();

    if (txt.includes('───')) return;

    if (txt.includes('BACK')) {
      bgOverlay.destroy(); // Destrói o fundo e tudo que estiver dentro dele
      mainList.focus();
      screen.render();
      return;
    }

    if (txt.includes('AUDIO')) {
      if (audiostate === 'ON') {
        audiostate = 'OFF';
        if (fs.existsSync('../CONFIG/AUDIOSTATE.txt')) {
          fs.unlinkSync('../CONFIG/AUDIOSTATE.txt');
        }
        fs.writeFileSync('../CONFIG/AUDIOSTATE.txt', audiostate, 'utf8');
        stopAudio(); // Mata o processo
      } else {
        audiostate = 'ON';
        if (fs.existsSync('../CONFIG/AUDIOSTATE.txt')) {
          fs.unlinkSync('../CONFIG/AUDIOSTATE.txt');
        }
        fs.writeFileSync('../CONFIG/AUDIOSTATE.txt',audiostate, 'utf8');
        playAudio(); // Inicia a música

        const bg1Overlay = blessed.box({
  parent: screen,
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  tags: true,
  style: {
    bg: 'black',
    transparent: false
  }
});

const supportBox = blessed.box({
  parent: bg1Overlay,
  top: 'center',
  left: 'center',
  width: 60, // Aumentado levemente para evitar quebra de linha
  height: 12,
  border: 'line',
  label: ' [ SYSTEM ] ',
  tags: true,
  style: {
    border: { fg: COLORDEFAULT },
    label: { fg: COLORDEFAULT, bold: true }
  }
});
  // A string deve ser montada dentro do intervalo para atualizar os "dots"
  const supportContent = [
    `\n{center}{bold}WARNING{/bold}{/center}`,
    `{center}Audio settings saved.{/center}`,
    `{center}VLC (External Player) may take a moment to initialize.{/center}`,

    `\n\n{center}[ESC] TO RETURN{/center}`
  ].join('\n');

  supportBox.setContent(supportContent);
  screen.render(); // Renderizar aqui garante a animação fluida

// ... seu código de criação do supportBox e bg1Overlay ...

function closeSupport() {
  supportBox.detach(); 
  bg1Overlay.detach();
  
  // 2. Destrói para limpar memória
  supportBox.destroy();
  bg1Overlay.destroy();

  // 3. Remove a tecla de atalho para não disparar duplicado depois
  screen.unkey('escape', closeSupport);

  // 4. FORÇA o foco de volta e renderiza
  settingsWin.focus();
  screen.render();
}

// Atribui a tecla
screen.key(['escape'], closeSupport);
screen.render();
    
      }
      settingsWin.setItem(0, ' AUDIO: [' + audiostate + ']');
    }

    if (txt.includes('COLOR')) {
      if (COLORDEFAULT === '#ff0000') {
         COLORDEFAULT = '#00ff00';
         COLORNAME = 'GREEN';

         if (fs.existsSync('../CONFIG/COLORDEFAULT.txt')) {
          fs.unlinkSync('../CONFIG/COLORDEFAULT.txt');
         }

        if (fs.existsSync('../CONFIG/COLORNAME.txt')) {
          fs.unlinkSync('../CONFIG/COLORNAME.txt');
        }
          fs.writeFileSync('../CONFIG/COLORNAME.txt', COLORNAME, 'utf8');
          fs.writeFileSync('../CONFIG/COLORDEFAULT.txt', COLORDEFAULT, 'utf8');

         } else if (COLORDEFAULT === '#00ff00') { 
          COLORDEFAULT = '#0000ff'; 
          COLORNAME = 'BLUE';

          if (fs.existsSync('../CONFIG/COLORDEFAULT.txt')) {
          fs.unlinkSync('../CONFIG/COLORDEFAULT.txt');
         }

        if (fs.existsSync('../CONFIG/COLORNAME.txt')) {
          fs.unlinkSync('../CONFIG/COLORNAME.txt');
        }
          fs.writeFileSync('../CONFIG/COLORNAME.txt', COLORNAME, 'utf8');
          fs.writeFileSync('../CONFIG/COLORDEFAULT.txt', COLORDEFAULT, 'utf8');

        } else { 
          COLORDEFAULT = '#ff0000'; 
          COLORNAME = 'RED'; 
          
          if (fs.existsSync('../CONFIG/COLORDEFAULT.txt')) {
          fs.unlinkSync('../CONFIG/COLORDEFAULT.txt');
         }

        if (fs.existsSync('../CONFIG/COLORNAME.txt')) {
          fs.unlinkSync('../CONFIG/COLORNAME.txt');
        }
          fs.writeFileSync('../CONFIG/COLORNAME.txt', COLORNAME, 'utf8');
          fs.writeFileSync('../CONFIG/COLORDEFAULT.txt', COLORDEFAULT, 'utf8');
        }
      
      settingsWin.setItem(1, ' COLOR: [' + COLORNAME + ']');
      logoBox.style.fg = COLORDEFAULT;
      mainList.style.selected.bg = COLORDEFAULT;
      settingsWin.style.border.fg = COLORDEFAULT;
      settingsWin.style.selected.bg = COLORDEFAULT;
      hotkeysBar.style.border.fg = COLORDEFAULT
      statusBox.style.border.fg = COLORDEFAULT
      hotkeysBar.style.fg = COLORDEFAULT
      statusBox.style.fg = COLORDEFAULT
      hotkeysBar.style.label.fg = COLORDEFAULT
      statusBox.style.label.fg = COLORDEFAULT

      settingsWin.focus();
    }

    if (txt.includes('USERNAME')) {
  // 1. Cria o campo de texto dentro do seu quadrado/janela
    const bgOverlay1 = blessed.box({
    parent: screen,
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    style: {
      bg: 'black',
      transparent: false // Define como false para esconder o que está atrás
    }
  });


  const input = blessed.textbox({
    parent: bgOverlay1,
    top: 'center',
    left: 'center',
    height: 3,
    width: '40%',
    label: ' [ ENTER USERNAME ] ',
    content: USERNAMEP,
    border: { type: 'line' },
    style: {
      fg: 'white',
      bg: 'black',
      border: { fg: COLORDEFAULT },
      hover: { bg: 'BLACK' },
      focus: { bg: 'BLACK' }
    },
    keys: true,
    mouse: true,
    inputOnFocus: true
  });

  input.focus();
  screen.render();

  input.on('submit', (value) => {
    if (value && value.trim() !== "") {
      USERNAMEP = value.trim().toUpperCase();
      
      if (fs.existsSync('../CONFIG/USER.txt')) {
        fs.unlinkSync('../CONFIG/USER.txt');
      }
      fs.writeFileSync('../CONFIG/USER.txt', USERNAMEP, 'utf8');

      settingsWin.setItem(3, ' USERNAME: [' + USERNAMEP + ']');
    }
    
    input.destroy();
    bgOverlay1.destroy();
    screen.render();
  });

  input.on('cancel', () => {
    bgOverlay1.destroy();
    input.destroy();
    screen.render();
  });
}



if (txt.includes('FULL SCREEN')) {
    // Só permite prosseguir se o terminal detectado for o WT
    if (!isModernTerminal) {
        const overlay = blessed.box({ 
            parent: screen, 
            top: 0, left: 0, 
            width: '100%', height: '100%', 
            style: { bg: 'black' },
            transparent: false
        });
        overlay.setIndex(999);

        const warningBox = blessed.box({
            parent: overlay,
            top: 'center',
            left: 'center',
            width: 60,
            height: 10,
            tags: true,
            border: 'line',
            content: '{center}{red-fg}{bold}FEATURE LOCKED{/bold}{/red-fg}\n\n' +
                     'Fullscreen is only available via {bold}Windows Terminal{/bold}.\n' +
                     'Legacy CMD does not support this protocol.\n\n' +
                     '{yellow-fg}[ESC] TO RETURN{/}',
            style: { border: { fg: COLORDEFAULT } }
        });

        const closeWarning = () => {
            overlay.destroy();
            settingsWin.focus();
            screen.render();
        };

        screen.onceKey(['escape'], closeWarning);
        return screen.render();
    }

    // Se estiver no WT, executa o toggle normalmente
    FULLSCREEN = (FULLSCREEN === 'OFF') ? 'ON' : 'OFF';
    
    // Caminho do script VBS para simular o F11
    const vbsPath = path.join(__dirname, 'toggle_fs.vbs');
    const BCT = `Set objShell = WScript.CreateObject("WScript.Shell")\nWScript.Sleep 100\nobjShell.SendKeys "{F11}"`;

    try {
        fs.writeFileSync(vbsPath, BCT);
        const child = spawn('wscript.exe', [vbsPath]);
        child.on('exit', () => {
            setTimeout(() => { if (fs.existsSync(vbsPath)) fs.unlinkSync(vbsPath); }, 1000);
        });
    } catch (err) {
        console.error("Erro FS:", err);
    }

    // Salva a preferência
    if (fs.existsSync('../CONFIG/FULLSCREEN.txt')) fs.unlinkSync('../CONFIG/FULLSCREEN.txt');
    fs.writeFileSync('../CONFIG/FULLSCREEN.txt', FULLSCREEN, 'utf8');
    
    // Atualiza o item na lista
    settingsWin.setItem(4, ' FULL SCREEN: [' + FULLSCREEN + ']');
    screen.render();
}
if (txt.includes('GLITCH')) {
    // Alterna o estado
    GLITCH = (GLITCH === 'ON') ? 'OFF' : 'ON';

    // Salva a configuração no arquivo para persistir ao reiniciar
    if (fs.existsSync('../CONFIG/GLITCH.txt')) {
        fs.unlinkSync('../CONFIG/GLITCH.txt');
    }
    fs.writeFileSync('../CONFIG/GLITCH.txt', GLITCH, 'utf8');

    // Atualiza o texto na lista de configurações (o índice 2 no seu código)
    settingsWin.setItem(2, ' GLITCH LOGO: [' + GLITCH + ']');
    
    // Renderiza para mostrar a mudança imediatamente
    screen.render();
}

if (txt.includes('SIDEBAR')) {
    SIDEBAR = (SIDEBAR === 'ON') ? 'OFF' : 'ON';
    fs.writeFileSync('../CONFIG/SIDEBAR.txt', SIDEBAR, 'utf8');

    // Atualiza o item no menu (verifique se o índice mudou, aqui assumo Index 2)
    settingsWin.setItem(5, ' SIDEBAR: [' + SIDEBAR + ']');

    // Aplica a visibilidade em tempo real
    if (SIDEBAR === 'ON') {
        leftSidebar.show();
    } else {
        leftSidebar.hide();
    }

    screen.render();
}

if (txt.includes('RESET')) {

  if (fs.existsSync('../CONFIG/AUDIOSTATE.txt')) {
    fs.unlinkSync('../CONFIG/AUDIOSTATE.txt');
  }
  if (fs.existsSync('../CONFIG/COLORNAME.txt')) {
    fs.unlinkSync('../CONFIG/COLORNAME.txt');
  }
  if (fs.existsSync('../CONFIG/COLORDEFAULT.txt')) {
    fs.unlinkSync('../CONFIG/COLORDEFAULT.txt');
  }
  if (fs.existsSync('../CONFIG/USER.txt')) {
    fs.unlinkSync('../CONFIG/USER.txt');
  }
  if (fs.existsSync('../CONFIG/FULLSCREEN.txt')) {
    fs.unlinkSync('../CONFIG/FULLSCREEN.txt');
  }
  if (fs.existsSync('../CONFIG/DIFFICULTY.txt')) {
    fs.unlinkSync('../CONFIG/DIFFICULTY.txt');
  }

  if (fs.existsSync('../CONFIG/GLITCH.txt')) {
    fs.unlinkSync('../CONFIG/GLITCH.txt');
}



  audiostate = 'ON';
  COLORNAME = 'RED';
  COLORDEFAULT = '#ff0000';
  USERNAMEP = 'OPERATOR 07';
  FULLSCREEN = 'OFF';
  DIFFICULTY = 'NORMAL';
  GLITCH = 'ON';
  SIDEBAR = 'OFF';
  
    fs.writeFileSync('../CONFIG/FULLSCREEN.txt', FULLSCREEN, 'utf8');
    fs.writeFileSync('../CONFIG/AUDIOSTATE.txt', audiostate, 'utf8');
    fs.writeFileSync('../CONFIG/COLORNAME.txt', COLORNAME, 'utf8');
    fs.writeFileSync('../CONFIG/COLORDEFAULT.txt', COLORDEFAULT, 'utf8');
    fs.writeFileSync('../CONFIG/USER.txt', USERNAMEP, 'utf8');
    fs.writeFileSync('../CONFIG/GLITCH.txt', GLITCH, 'utf8');
    fs.writeFileSync('../CONFIG/SIDEBAR.txt', SIDEBAR, 'utf8');

  settingsWin.setItem(0, ' AUDIO: [' + audiostate + ']');
  settingsWin.setItem(1, ' COLOR: [' + COLORNAME + ']');
  settingsWin.setItem(2, ' GLITCH LOGO: [' + GLITCH + ']');
  settingsWin.setItem(3, ' USERNAME: [' + USERNAMEP + ']');
  settingsWin.setItem(4, ' FULL SCREEN: [' + FULLSCREEN + ']');
  settingsWin.setItem(5, ' SIDEBAR: [' + SIDEBAR + ']');

  
  logoBox.style.fg = COLORDEFAULT;
  mainList.style.selected.bg = COLORDEFAULT;
  settingsWin.style.border.fg = COLORDEFAULT;
  settingsWin.style.selected.bg = COLORDEFAULT;

  settingsWin.focus();

  if (audiostate === 'ON') {
    playAudio();
  } else {
    stopAudio();
}

leftSidebar.hide();
updateStatus();
}
    screen.render();
  });
}

function stopAudio() {
  // Mata qualquer instância do VLC que esteja rodando no Windows
  spawn('taskkill', ['/F', '/IM', 'vlc.exe', '/T']);
  vlcProcess = null;
}

function playAudio() {
  if (audiostate === 'ON') {
    // Inicia o VLC em modo "Dummy" (sem interface) e em loop
    vlcProcess = spawn('./SOUNDTRACK/VLC/vlc.exe', ['-I', 'dummy', '--loop', audioFile]);
  }
}

// Detecção por Variáveis e Capacidade de Cores
function getTerminalType() {
    // Busca nos argumentos da linha de comando
    const args = process.argv;
    
    if (args.includes('--wt')) {
        return 'WINDOWS TERMINAL (WT.EXE)';
    }
    
    if (args.includes('--cmd')) {
        return 'CMD (LEGACY)';
    }

    // Fallback caso seja aberto por fora do .bat
    if (process.env.WT_SESSION) return 'WINDOWS TERMINAL (WT.EXE)';
    
    return 'CMD (LEGACY)';;
}

// Atribui à variável que você usa no showSystemInfo
let terminalName = getTerminalType();

function showSystemInfo() {
  const keyFilePath = '../CONFIG/KEY.txt';
  const isUnlocked = fs.existsSync(keyFilePath);

  const backdrop = blessed.box({
    parent: screen,
    top: 0, left: 0,
    width: '100%', height: '100%',
    style: { bg: 'black' }
  });

  const infoBox = blessed.box({
    parent: backdrop,
    top: 'center', left: 'center',
    width: 60, height: 13,
    border: 'line',
    label: ' [ SYSTEM DATA ] ',
    tags: true,
    style: {
      border: { fg: COLORDEFAULT },
      label: { fg: COLORDEFAULT, bold: true }
    }
  });

  // Função para renderizar os dados técnicos
  const renderData = () => {
    const text = [
      ` {bold}STATUS:{/bold}       {green-fg}OPERATIONAL{/green-fg}`,
      ` {bold}OS:{/bold}           ${friendlyName}`,
      ` {bold}VERSION:{/bold}      ${winVersion}`,
      ` {bold}PC-USER:{/bold}      ${userName.toUpperCase()}`,
      ` {bold}TERMINAL:{/bold}     ${terminalName}`, 
      ` {bold}ACHIEVEMENTS:{/bold} ${achievements}`,
      ` {bold}ENCRYPTION KEY:{/}   ${key}\n`, // Agora visível permanentemente após unlock
      ` [ESC] TO RETURN`
    ].join('\n');
    infoBox.setContent(text);
    screen.render();
  };

  if (isUnlocked) {
    // Se já estiver desbloqueado, mostra direto
    renderData();
  } else {
    // Se não, abre o campo de texto estilo o Username
    infoBox.setContent('\n{center}{yellow-fg}ENCRYPTED SYSTEM DATA{/}\n\nINPUT DEVELOPER CODE:{/center}\n{center}{green-fg}(HINT): ROOT GAME FILES{/}{/}');
    
    const input = blessed.textbox({
      parent: infoBox,
      bottom: 2, left: 'center',
      height: 3, width: '50%',
      border: { type: 'line' },
      style: {
        fg: 'white', bg: 'black',
        border: { fg: COLORDEFAULT },
        focus: { border: { fg: 'white' } }
      },
      inputOnFocus: true
    });

    input.focus();
    screen.render();

    input.on('submit', (value) => {
      if (value === "PLDEV") {
        // Salva a permissão permanente
        fs.writeFileSync(keyFilePath, 'UNLOCKED', 'utf8');
        if (fs.existsSync('../ACHIEVEMENTS/OVERRIDE.ach', 'COMPLETED')) {
           fs.unlinkSync('../ACHIEVEMENTS/OVERRIDE.ach', 'COMPLETED')
           }
        fs.writeFileSync('../ACHIEVEMENTS/OVERRIDE.ach', 'COMPLETED')  
              
        input.destroy();
        renderData();
      } else {
        input.destroy();
        backdrop.destroy();
        mainList.focus();
        // Feedback rápido de erro
        descriptionBox.setContent('{red-fg}INVALID AUTHORIZATION CODE. ACCESS DENIED.{/}');
        screen.render();
      }
    });

    input.on('cancel', () => {
      input.destroy();
      backdrop.destroy();
      mainList.focus();
      screen.render();
    });
  }

  function closeInfo() {
    backdrop.destroy();
    mainList.focus();
    screen.unkey('escape', closeInfo);
    screen.render();
  }

  screen.key(['escape'], closeInfo);
  screen.render();
}

function supportGame() {
  const bg1Overlay = blessed.box({
    parent: screen,
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    style: {
      bg: 'black',
      transparent: false // Define como false para esconder o que está atrás
    }
  });

  const supportBox = blessed.box({
    parent: bg1Overlay,
    top: 'center',
    left: 'center',
    width: 55,
    height: 15,
    border: 'line',
    label: ' [ SUPPORT THE GAME ] ',
    tags: true,
    style: {
      border: { fg: COLORDEFAULT },
      label: { fg: COLORDEFAULT, bold: true, width: 'shrink' }
    }
  });

  const supportText = [
    `\n {bold}THANK YOU FOR CONSIDERING SUPPORTING LIGHT GAME!{/bold}`,
    `\n You can support us by sharing the game with friends,`,
    `\n leaving a positive review, or following us on social media (@PALELUNAGAME).`,
    `\n Your support helps us continue developing and improving the game!`,
    `\n [ESC] TO RETURN`
  ].join('\n');

  supportBox.setContent('{center}' + supportText + '{/center}');

    function closeSupport() {
    supportBox.destroy();
    bg1Overlay.destroy();
    mainList.focus();
    screen.unkey('escape', closeSupport);
    screen.render();
  }
    screen.key(['escape'], closeSupport);
    screen.render();
}

function Achievements() {
    const backdrop = blessed.box({
        parent: screen,
        top: 0, left: 0,
        width: '100%', height: '100%',
        style: { bg: 'black' }
    });

    let unlockedCount = 0;
    ALL_ACHIEVEMENTS.forEach(ach => {
        const achPath = path.join(__dirname, '..', 'Achievements', `${ach.id}.ach`);
        if (fs.existsSync(achPath)) unlockedCount++;
    });

    const isFullSync = unlockedCount === ALL_ACHIEVEMENTS.length;

    // Cabeçalho corrigido (Removido o erro de cor anterior)
    const header = blessed.box({
        parent: backdrop,
        top: 1, left: 'center',
        width: '94%', height: 3,
        border: 'line', tags: true,
        content: `{center}{bold}ACHIEVEMENTS: ${unlockedCount}/${ALL_ACHIEVEMENTS.length}{/}${isFullSync ? ' {blink}[MAX]{/}' : ''}{/center}`,
        style: { border: { fg: isFullSync ? 'yellow' : 'white' } }
    });

    // Container de Grid Ajustado para não estourar
    const listContainer = blessed.box({
        parent: backdrop,
        top: 4, bottom: 8, left: 'center',
        width: '96%',
        scrollable: true,
        alwaysScroll: true,
        keys: true, mouse: true,
        scrollbar: { ch: ' ', inverse: true, style: { fg: 'white' } }
    });

    // Medidas precisas para evitar o bug da imagem
    const cardWidth = 30;  // Reduzido para caber 3 colunas
    const cardHeight = 8;  // Aumentado para o texto não vazar
    const cardsPerRow = 3; 

    ALL_ACHIEVEMENTS.forEach((ach, i) => {
        const achPath = path.join(__dirname, '..', 'Achievements', `${ach.id}.ach`);
        const hasAch = fs.existsSync(achPath);
        const row = Math.floor(i / cardsPerRow);
        const col = i % cardsPerRow;

        blessed.box({
            parent: listContainer,
            top: row * (cardHeight + 1),
            left: col * (cardWidth + 2),
            width: cardWidth, height: cardHeight,
            border: 'line', tags: true,
            style: { border: { fg: hasAch ? 'green' : 'white' } },
            content: hasAch 
                ? `{center}{green-fg}{bold}[X] ${ach.name}{/}\n\n{white-fg}${ach.desc}{/center}`
                : `{center}{white-fg}[ ] ???????????{/}\n\n{white-fg}DATA LOCKED{/center}`
        });
    });

    const hintDisplay = blessed.box({
        parent: backdrop,
        bottom: 4, left: 'center',
        width: '94%', height: 3,
        border: 'line', tags: true,
        content: '{center}PRESS [H] OR CLICK "SHOW HINTS" TO DECRYPT{/center}',
        style: { border: { fg: COLORDEFAULT }, fg: COLORDEFAULT }
    });

    const hintBtn = blessed.button({
        parent: backdrop,
        bottom: 1, left: 'center',
        width: 25, height: 3,
        content: '{center}[H] SHOW HINTS{/center}',
        border: 'line', tags: true,
        style: {
            border: { fg: 'white' },
            focus: { border: { fg: 'yellow' }, bg: '#222' },
            hover: { border: { fg: 'yellow' }, bg: '#222' }
        },
        mouse: true, keys: true
    });

    // Função Unificada de Dicas
    const openHintMenu = () => {
        const hintListWin = blessed.list({
            parent: backdrop,
            top: 'center', left: 'center',
            width: 40, height: 12,
            border: 'line', label: ' [ SELECT NODE ] ',
            tags: true, keys: true, mouse: true,
            items: ALL_ACHIEVEMENTS.map(a => ` ${a.id} `),
            style: {
                border: { fg: 'yellow' },
                selected: { bg: 'yellow', fg: 'black', bold: true }
            }
        });

        hintListWin.focus();
        screen.render();

        hintListWin.on('select', (item, index) => {
            const selectedAch = ALL_ACHIEVEMENTS[index];
            hintDisplay.setContent(`{center}{yellow-fg}HINT [${selectedAch.id}]: ${selectedAch.hint}{/center}`);
            hintDisplay.style.border.fg = 'yellow';
            hintListWin.destroy();
            listContainer.focus();
            screen.render();
        });

        // Fechar sub-menu de dicas
        const closeSub = () => {
            hintListWin.destroy();
            listContainer.focus();
            screen.render();
        };
        hintListWin.key(['escape', 'h'], closeSub);
    };

    // Ativação por Clique e Teclado
    hintBtn.on('press', openHintMenu);
    screen.key(['h', 'H'], openHintMenu);

    listContainer.focus();

    // Sair da tela de conquistas
    const closeAchievements = () => {
        screen.unkey('h', openHintMenu); // Limpa a tecla ao sair
        screen.unkey('H', openHintMenu);
        backdrop.destroy();
        mainList.focus();
        screen.render();
    };

    screen.key(['escape'], closeAchievements);
    screen.render();
}

// --- SISTEMA DE ATALHOS RÁPIDOS ---
// --- SISTEMA DE ATALHOS ---
screen.on('keypress', (ch, key) => {
    // Normaliza a tecla para evitar erro com Shift/Caps Lock
    const k = key.full.toLowerCase();
    
    // [M] - Mudo Rápido
    if (k === 'm') {
        if (audiostate === 'ON') {
            audiostate = 'OFF';
            stopAudio();
        } else {
            audiostate = 'ON';
            playAudio();
        }
        fs.writeFileSync('../CONFIG/AUDIOSTATE.txt', audiostate, 'utf8');
        updateStatus();
    }

    // [F1] ou [i] - System Info
    if (k === 'f1' || k === 'i') {
        showSystemInfo();
        updateStatus();
    }

    // [C] - Ciclo de Cores
    if (k === 'c') {
        if (COLORDEFAULT === '#ff0000') { 
            COLORDEFAULT = '#00ff00'; COLORNAME = 'GREEN'; 
        } else if (COLORDEFAULT === '#00ff00') { 
            COLORDEFAULT = '#0000ff'; COLORNAME = 'BLUE'; 
        } else { 
            COLORDEFAULT = '#ff0000'; COLORNAME = 'RED'; 
        }
        
        fs.writeFileSync('../CONFIG/COLORNAME.txt', COLORNAME, 'utf8');
        fs.writeFileSync('../CONFIG/COLORDEFAULT.txt', COLORDEFAULT, 'utf8');
        
        // Atualiza a cor de todos os elementos, incluindo as boxes de status e atalhos
        [logoBox, hotkeysBar, statusBox].forEach(el => {
    if (el) {
        el.style.fg = COLORDEFAULT;
        if(el.style.border) el.style.border.fg = COLORDEFAULT;
        if(el.style.label) el.style.label.fg = COLORDEFAULT;
    }
});
        
        mainList.style.selected.bg = COLORDEFAULT;
        updateStatus(); // Atualiza cores e texto interno da box
    }

    // [G] - Toggle Glitch
    if (k === 'g') {
        GLITCH = (GLITCH === 'ON') ? 'OFF' : 'ON';
        fs.writeFileSync('../CONFIG/GLITCH.txt', GLITCH, 'utf8');
        updateStatus();
    }
});

// --- BARRA VISUAL DE ATALHOS ---
// Container invisível para agrupar as duas caixas no centro vertical
const leftSidebar = blessed.box({
    parent: screen,
    top: 'center',
    left: 0,
    width: 25,
    height: 18, 
    hidden: SIDEBAR === 'OFF',// Altura somada das duas caixas + espaçamento
    style: { bg: 'transparent' }
});

// Barra de Atalhos (agora dentro do container)
const hotkeysBar = blessed.box({
    parent: leftSidebar,
    top: 0,
    left: 0,
    width: '65%',
    height: 9,
    border: 'line',
    label: ' [ KEYS ] ',
    tags: true,
    content: ' {bold}[M] MUTE\n\n [F1] SYS\n\n [C] COLOR\n\n [G] GLITCH{/} ',
    style: { fg: COLORDEFAULT, border: { fg: COLORDEFAULT }, label: { fg: COLORDEFAULT } }
});

// Status Box (agora embaixo da hotkeysBar dentro do container)
const statusBox = blessed.box({
    parent: leftSidebar,
    top: 9, // Começa exatamente onde a hotkeysBar termina
    left: 0,
    width: '65%',
    height: 7,
    border: 'line',
    label: ' [ STATUS ] ',
    tags: true,
    style: { fg: COLORDEFAULT, border: { fg: COLORDEFAULT }, label: { fg: COLORDEFAULT } }
});

// Função para atualizar o texto da Status Box
function updateStatus() {
    const statusText = [
      ` {bold}AUDIO:{/bold} ${audiostate === 'ON' ? '{green-fg}ACTIVE{/}' : '{red-fg}MUTED{/}'}\n\n {bold}COLOR:{/bold} ${COLORNAME}\n\n {bold}GLITCH:{/bold} ${GLITCH} `
    ].join('\n\n ');

    statusBox.setContent(`${statusText}`);
    screen.render();
}



// Inicializa o conteúdo
updateStatus();

mainList.on('select', (item) => {
  const text = item.getText();

  if (text.includes('EXIT')) return confirmExit();
  if (text.includes('SETTINGS')) return showSettings();
  if (text.includes('SYSTEM INFO')) return showSystemInfo();
  if (text.includes('ERASE DATA')) return eraseData();
  if (text.includes('CREDITS')) { return credits() ; } // Implementar depois
  if (text.includes('SUPPORT')) { return supportGame() ; } // Implementar depois
  if (text.includes('ACHIEVEMENTS')) { return Achievements(); }
  if (text.includes('START MISSION')) {
    mainList.detach();
    
    let dots = 0;
    const loader = setInterval(() => {
      menuBox.setContent(`\n\n{center}INITIALIZING${".".repeat(dots)}{/center}`);
      screen.render();
      dots = (dots + 1) % 4;
    }, 300);

    setTimeout(() => {
      clearInterval(loader);
      menuBox.destroy();
      mainList.destroy();
      screen.destroy();
      const child = spawn('node', ['main.js'], {
        stdio: 'inherit',
      });
      child.on('exit', () => {
        process.exit();
      });

    }, 3000); // Tempo da animação
  }
});

screen.key(['q', 'C-c'], () => confirmExit());
screen.append(logoBox);
screen.append(menuBox);

startLogoAnimation();

mainList.focus();
screen.render();

// Captura o CTRL+C e em vez de fechar, abre o seu menu de confirmação
process.on('SIGINT', () => {
  confirmExit(); 
});

// Captura quando o terminal tenta fechar o processo de outras formas
process.on('SIGHUP', () => {
  confirmExit();
});