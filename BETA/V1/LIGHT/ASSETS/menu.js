const blessed = require('blessed');
const os = require('os');
const { spawn } = require('child_process');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const achievements = fs.readdirSync('../Achievements').filter(f => f.endsWith('.bin')).length;
let dots = 0;

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

function playSfx() {
  if (audiostate === 'ON') {
    // O comando agora será totalmente invisível para o usuário
    player.play('./SOUNDTRACK/click.mp3', (err) => {
      if (err) {
        // Se der erro (arquivo faltando), o terminal não trava
      }
    });
  }
}

function backsfx() {
   if (audiostate === 'ON') {
    // O comando agora será totalmente invisível para o usuário
    player.play('./SOUNDTRACK/click2.mp3', (err) => {
      if (err) {
        // Se der erro (arquivo faltando), o terminal não trava
      }
    });
  }
}


function fullscreen_pre_save() {
  if(FULLSCREEN === 'ON') {
    const iswin11 = winVersion.startsWith('10.0.2');
    const iswin10 = winVersion.startsWith('10.0') && !iswin11;
    
    if (iswin10||iswin11) {
const vbsPath = path.join(__dirname, 'toggle_fs.vbs');

    const BCT = `
        Set objShell = WScript.CreateObject("WScript.Shell")
        WScript.Sleep 100
        objShell.SendKeys "{F11}"
    `;

    try {
        fs.writeFileSync(vbsPath, BCT);

        const child = spawn('wscript.exe', [vbsPath]);

        child.on('exit', () => {
            setTimeout(() => {
                if (fs.existsSync(vbsPath)) fs.unlinkSync(vbsPath);
            }, 1000);
        });
    } catch (err) {
        console.error("Erro ao criar/executar script externo:", err);
    }
    } else {
      FULLSCREEN = 'OFF'
    }
}
}


if (fs.existsSync('../CONFIG/AUDIOCLICK.txt')) {
  var audioclick = fs.readFileSync(path.join('../CONFIG/AUDIOCLICK.txt'), 'utf8').trim();
} else {
  var audioclick = 'ON';
  fs.writeFileSync('../CONFIG/AUDIOCLICK.txt', audioclick, 'utf8');
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

let winVersion = '6.3'
let userName = os.userInfo().username;


let friendlyName = 'Windows';

if (winVersion.startsWith('10')) friendlyName = 'Windows 10/11';
if (winVersion.startsWith('6.3')) friendlyName = 'Windows 8.1 - NOT RECOMMENDED';
if (winVersion.startsWith('6.1')) friendlyName = 'Windows 7 - NOT RECOMMENDED';

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
  style: { fg: COLORDEFAULT, bold: true }
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
  items: ['{center}START MISSION{/center}', '{center}SETTINGS{/center}', '{center}ERASE DATA{/center}', '{center}SYSTEM INFO{/center}', '{center}CREDITS{/center}', '{center}SUPPORT THE GAME{/center}','{center}EXIT{/center}'],
  style: {
    selected: { bg: COLORDEFAULT, fg: 'white', bold: true },
    item: { fg: '#bbbbbb' }
  }
});

mainList.on('select item', (item) => {
  const rawText = item.getText().replace(/{.*?}/g, '').trim();
  
  const desc = menuDescriptions[rawText] || 'SELECT AN OPTION USING ARROW KEYS AND PRESS ENTER';
  
  descriptionBox.setContent(`{center}${desc.toUpperCase()}{/center}`);
  
  screen.render();
});



const descriptionBox = blessed.box({
  parent: screen,
  bottom: 0, // Posiciona no rodapé
  left: 'center',
  width: '100%',
  tags: true,
  height: 3, // Tamanho pequeno para a mini descrição
  content: '{center}SELECT AN OPTION USING ARROW KEYS AND PRESS ENTER{/center}',
  border: { type: 'line' },
  style: {
    fg: COLORDEFAULT,
    border: { fg: COLORDEFAULT }
  }
});

const menuDescriptions = {
  'START MISSION': 'START THE PRIMARY OPERATIONAL PROTOCOL.',
  'SETTINGS': 'AUDIO, COLOR, USER AND FULL SCREEN CONFIGURATION.',
  'ERASE DATA': 'ERASE ALL LOCAL USER DATA AND SETTINGS.',
  'SYSTEM INFO': 'VIEW SYSTEM AND TERMINAL INFORMATION.',
  'CREDITS': 'INFORMATION ABOUT THE DEVELOPMENT TEAM.',
  'SUPPORT THE GAME': 'HELP THE DEVELOPMENT OF LIGHT GAME.',
  'EXIT': 'EXIT THE APPLICATION SAFELY. (DO NOT FORCE CLOSE)'
};

const copyrightBOX2 = blessed.box({
  parent: screen,
  bottom: 3,
  left: '0',
  width: 'shrink',
  height: 3,
  content: ' © 2025 PALE LUNA DEVELOPER ',
  border: { type: 'line' },
  tags: true,
  style: {
    fg: COLORDEFAULT,
    bold: true,
    border: { fg: COLORDEFAULT }
  },
});

const copyrightBOX3 = blessed.box({
  parent: screen,
  bottom: 3,
  left: 30, // 25 colunas a partir da esquerda (ajuste conforme necessário)
  width: 'shrink', 
  height: 3,
  content: ` ACHIEVEMENTS COMPLETED: ${achievements} `, // Texto mais curto para evitar overlap
  border: { type: 'line' },
  tags: true,
  style: {
    fg: COLORDEFAULT,
    bold: true,
    border: { fg: COLORDEFAULT }
  },
});



const copyrightBOX1 = blessed.box({
  parent: screen,
  bottom: 3,
  right: '0',
  width: 'shrink',
  height: 3,
  content: ' V1_BETA ',
  border: { type: 'line' },
  tags: true,
  style: {
    fg: COLORDEFAULT,
    bold: true,
    border: { fg: COLORDEFAULT }
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
      ' CLICK AUDIO [' + audioclick + ']',
      ' COLOR: [' + COLORNAME + ']',
      ' GLITCH LOGO: [' + GLITCH + ']',
      ' USERNAME: [' + USERNAMEP + ']',
      ' FULL SCREEN: [' + FULLSCREEN + ']',
      ' DIFFICULTY: [' + DIFFICULTY + '] ',
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
      backsfx()
      bgOverlay.destroy(); // Destrói o fundo e tudo que estiver dentro dele
      mainList.focus();
      screen.render();
      return;
    }

    if (txt.includes('AUDIO')) {
      playSfx()
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
      playSfx()
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
      descriptionBox.style.fg = COLORDEFAULT;
      descriptionBox.style.border.fg = COLORDEFAULT;
      copyrightBOX1.style.fg = COLORDEFAULT
      copyrightBOX1.style.border.fg = COLORDEFAULT
      copyrightBOX2.style.fg = COLORDEFAULT
      copyrightBOX2.style.border.fg = COLORDEFAULT
      copyrightBOX3.style.fg = COLORDEFAULT
      copyrightBOX3.style.border.fg = COLORDEFAULT

      settingsWin.focus();
    }

    if (txt.includes('USERNAME')) {
      playSfx()
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

      settingsWin.setItem(2, ' USERNAME: [' + USERNAMEP + ']');
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
  playSfx()
    
    const iswin11 = winVersion.startsWith('10.0.2');
    const iswin10 = winVersion.startsWith('10.0') && !iswin11;

    if (!iswin10 && !iswin11) {
      const cleanAllKeys = () => { screen.unkey('enter'); screen.unkey('escape'); };
        const overlay = blessed.box({ parent: screen, top: 0, left: 0, width: '100%', height: '100%', style: { bg: 'black' } });
        blessed.box({
            parent: overlay, top: 'center', left: 'center', width: 60, height: 10, border: 'line', tags: true,
            content: `{center}{red-fg}FUNCTION NOT SUPPORTED{/red-fg}\n\nFullscreen requires Windows 10 or 11.\n\n{bold}[ESC] RETURN{/center}`,
            style: { border: { fg: 'red' } }
        });
        screen.onceKey(['escape'], () => { cleanAllKeys(); overlay.destroy(); settingsWin.focus(); screen.render(); });
        return screen.render();


    } else {
      FULLSCREEN = (FULLSCREEN === 'OFF') ? 'ON' : 'OFF';

    const vbsPath = path.join(__dirname, 'toggle_fs.vbs');

    const BCT = `
        Set objShell = WScript.CreateObject("WScript.Shell")
        WScript.Sleep 100
        objShell.SendKeys "{F11}"
    `;

    try {
        fs.writeFileSync(vbsPath, BCT);

        const child = spawn('wscript.exe', [vbsPath]);

        child.on('exit', () => {
            setTimeout(() => {
                if (fs.existsSync(vbsPath)) fs.unlinkSync(vbsPath);
            }, 1000);
        });
    } catch (err) {
        console.error("Erro ao criar/executar script externo:", err);
    }

    if (fs.existsSync('../CONFIG/FULLSCREEN.txt')) {
        fs.unlinkSync('../CONFIG/FULLSCREEN.txt');
    }
    fs.writeFileSync('../CONFIG/FULLSCREEN.txt', FULLSCREEN, 'utf8');
    settingsWin.setItem(4, ' FULL SCREEN: [' + FULLSCREEN + ']');
    }

}

if (txt.includes('GLITCH')) {
  playSfx()
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

if (txt.includes('DIFFICULTY')) {
  playSfx()
      if (DIFFICULTY === 'EASY') {
         DIFFICULTY = 'NORMAL';
          } else if (DIFFICULTY === 'NORMAL') {
          DIFFICULTY = 'HARD';
        } else { 
          DIFFICULTY = 'EASY'; 
        }
      if (fs.existsSync('../CONFIG/DIFFICULTY.txt')) {
          fs.unlinkSync('../CONFIG/DIFFICULTY.txt');
        }
          fs.writeFileSync('../CONFIG/DIFFICULTY.txt', DIFFICULTY, 'utf8');
      settingsWin.setItem(5, ' DIFFICULTY: [' + DIFFICULTY + '] ');
    }

if (txt.includes('RESET')) {
  backsfx()

  if (fs.existsSync('../CONFIG/AUDIOCLICK.txt')) {
    fs.unlinkSync('../CONFIG/AUDIOCLICK.txt')
  }
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
  audioclick = 'ON'
  COLORNAME = 'RED';
  COLORDEFAULT = '#ff0000';
  USERNAMEP = 'OPERATOR 07';
  FULLSCREEN = 'OFF';
  DIFFICULTY = 'NORMAL';
  GLITCH = 'ON';
  
  fs.writeFileSync('../CONFIG/AUDIOCLICK.txt', audioclick, 'utf8')
  fs.writeFileSync('../CONFIG/FULLSCREEN.txt', FULLSCREEN, 'utf8');
  fs.writeFileSync('../CONFIG/AUDIOSTATE.txt', audiostate, 'utf8');
  fs.writeFileSync('../CONFIG/COLORNAME.txt', COLORNAME, 'utf8');
  fs.writeFileSync('../CONFIG/COLORDEFAULT.txt', COLORDEFAULT, 'utf8');
  fs.writeFileSync('../CONFIG/USER.txt', USERNAMEP, 'utf8');
  fs.writeFileSync('../CONFIG/DIFFICULTY.txt', DIFFICULTY, 'utf8');
  fs.writeFileSync('../CONFIG/GLITCH.txt', GLITCH, 'utf8');

  settingsWin.setItem(0, ' AUDIO: [' + audiostate + ']');
  settingsWin.setItem(1, ' CLICK AUDIO [' + audioclick + ']');
  settingsWin.setItem(1, ' COLOR: [' + COLORNAME + ']');
  settingsWin.setItem(2, ' GLITCH LOGO: [' + GLITCH + ']');
  settingsWin.setItem(3, ' USERNAME: [' + USERNAMEP + ']');
  settingsWin.setItem(4, ' FULL SCREEN: [' + FULLSCREEN + ']');
  settingsWin.setItem(5, ' DIFFICULTY: [' + DIFFICULTY + '] ');

  
  logoBox.style.fg = COLORDEFAULT;
  mainList.style.selected.bg = COLORDEFAULT;
  settingsWin.style.border.fg = COLORDEFAULT;
  settingsWin.style.selected.bg = COLORDEFAULT;
  descriptionBox.style.fg = COLORDEFAULT;
  descriptionBox.style.border.fg = COLORDEFAULT;
  copyrightBOX1.style.fg = COLORDEFAULT
  copyrightBOX1.style.border.fg = COLORDEFAULT
  copyrightBOX2.style.fg = COLORDEFAULT
  copyrightBOX2.style.border.fg = COLORDEFAULT
  copyrightBOX3.style.fg = COLORDEFAULT
  copyrightBOX3.style.border.fg = COLORDEFAULT

  settingsWin.focus();

  if (audiostate === 'ON') {
    playAudio();
  } else {
    stopAudio();
}
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

function showSystemInfo() {
  // Criamos uma caixa que ocupa a tela toda para esconder o resto
  const backdrop = blessed.box({
    parent: screen,
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    style: { bg: 'black' } // Isso faz a logo e o menu sumirem
  });

  const info = blessed.box({
    parent: backdrop, // Anexado ao backdrop
    top: 'center',
    left: 'center',
    width: 50,
    height: 12,
    border: 'line',
    label: ' [ SYSTEM DATA ] ',
    tags: true, // FAZ O {CENTER} SUMIR E FUNCIONAR
    style: {
      border: { fg: COLORDEFAULT },
      label: { fg: COLORDEFAULT, bold: true }
    }
  });

  // Conteúdo usando tags de cores e alinhamento
  const text = [
    ` {bold}STATUS:{/bold}      {green-fg}OPERATIONAL{/green-fg}`,
    ` {bold}OS:{/bold}          ${friendlyName}`,
    ` {bold}VERSION:{/bold}     ${winVersion}`,
    ` {bold}PC-USER:{/bold}     ${userName.toUpperCase()}`,
    ` {bold}TERMINAL:{/bold}    TTY-NODE\n\n`,
    ` [ESC] TO RETURN`
  ].join('\n');

  info.setContent(text);

  function closeInfo() {
    backdrop.destroy(); // Mata o fundo e a info de uma vez
    mainList.focus();
    screen.unkey('escape', closeInfo);
    screen.unkey('escape', closeInfo);
    screen.render();
  }

  screen.key(['escape', 'escape'], closeInfo);
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

mainList.on('select', (item) => {
  const text = item.getText();
playSfx()

  if (text.includes('EXIT')) return confirmExit();
  if (text.includes('SETTINGS')) return showSettings();
  if (text.includes('SYSTEM INFO')) return showSystemInfo();
  if (text.includes('ERASE DATA')) return eraseData();
  if (text.includes('CREDITS')) { return credits() ; } // Implementar depois
  if (text.includes('SUPPORT THE GAME')) { return supportGame() ; } // Implementar depois
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