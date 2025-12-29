const blessed = require('blessed');
const os = require('os');
const { spawn } = require('child_process');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

// Variáveis Globais de Configuração


let audiostate = 'ON';
let COLORDEFAULT = '#ff0000';
let COLORNAME = 'RED';
let CANwin = 'OFF';
let vlcProcess = null;
const audioFile = './SOUNDTRACK/1.mp3';

let winVersion = os.release();
let userName = os.userInfo().username;
let friendlyName = 'Windows';

if (winVersion.startsWith('10')) friendlyName = 'Windows 10/11';
if (winVersion.startsWith('6.3')) friendlyName = 'Windows 8.1 - NOT RECOMMENDED';
if (winVersion.startsWith('6.1')) friendlyName = 'Windows 7 - NOT RECOMMENDED';

if (audiostate === 'ON') {
    // Inicia o VLC em modo "Dummy" (sem interface) e em loop
    vlcProcess = spawn('./SOUNDTRACK/VLC/vlc.exe', ['-I', 'dummy', '--loop', audioFile]);
  }

const screen = blessed.screen({
  smartCSR: true,
  title: 'LIGHT',
  fullUnicode: true
});

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

// BOX DE DESCRIÇÃO (Agora embaixo do menu)

const mainList = blessed.list({
  parent: menuBox,
  tags: true,
  top: 1,
  left: 'center',
  width: '90%',
  height: '80%',
  keys: true,
  mouse: true,
  items: ['{center}START MISSION{/center}', '{center}SETTINGS{/center}', '{center}ERASE DATA{/center}', '{center}SYSTEM INFO{/center}', '{center}CREDITS{/center}', '{center}EXIT{/center}'],
  style: {
    selected: { bg: COLORDEFAULT, fg: 'white', bold: true },
    item: { fg: '#bbbbbb' }
  }
});


function confirmExit() {
  // 1. Criar o fundo (Background Overlay) igual ao de Settings
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
  bgOverlay.setIndex(200); // Garante que fique por cima de TUDO (inclusive logo)

  // 2. A lista de confirmação (mesmo estilo do settingsWin)
  const confirmWin = blessed.list({
    parent: bgOverlay,
    top: 'center',
    left: 'center',
    width: 40,
    height: 10,
    border: 'line',
    label: ' [ EXIT ] ',
    keys: true,
    tags: true, // Ativa o processamento de {center}
    items: [
      '{center}NO{/center}',
      '{center}YES{/center}'
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
    
    // Se selecionar TERMINATE, fecha o programa
    if (txt.includes('YES')) {
      process.exit(0);
    } 
    
    // Se selecionar REMAIN, volta ao menu
    if (txt.includes('NO')) {
      bgOverlay.destroy();
      mainList.focus();
      screen.render();
    }
  });

  // ESC também volta para o menu
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
      transparent: false // Define como false para esconder o que está atrás
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
    width: 40,
    height: 10,
    border: 'line',
    label: ' [ SETTINGS ] ',
    keys: true,
    items: [
      ' AUDIO: [' + audiostate + ']',
      ' COLOR: [' + COLORNAME + ']',
      ' CAN WIN [' + CANwin + ']',
      ' BACK TO MENU '
    ],
    selected: 0,
    style: {
      border: { fg: COLORDEFAULT },
      selected: { bg: COLORDEFAULT, fg: 'white', bold: true }
    }
  });

  settingsWin.focus();
  settingsWin.select(0);
  screen.render();

  settingsWin.on('select', (item) => {
    const txt = item.getText();
    
    if (txt.includes('BACK')) {
      bgOverlay.destroy(); // Destrói o fundo e tudo que estiver dentro dele
      mainList.focus();
      screen.render();
      return;
    }

    if (txt.includes('AUDIO')) {
      if (audiostate === 'ON') {
        audiostate = 'OFF';
        stopAudio(); // Mata o processo
      } else {
        audiostate = 'ON';
        playAudio(); // Inicia a música
      }
      settingsWin.setItem(0, ' AUDIO: [' + audiostate + ']');
    }

    if (txt.includes('COLOR')) {
      if (COLORDEFAULT === '#ff0000') { COLORDEFAULT = '#00ff00'; COLORNAME = 'GREEN'; }
      else if (COLORDEFAULT === '#00ff00') { COLORDEFAULT = '#0000ff'; COLORNAME = 'BLUE'; }
      else { COLORDEFAULT = '#ff0000'; COLORNAME = 'RED'; }
      
      settingsWin.setItem(1, ' COLOR: [' + COLORNAME + ']');
      logoBox.style.fg = COLORDEFAULT;
      mainList.style.selected.bg = COLORDEFAULT;
      settingsWin.style.border.fg = COLORDEFAULT;
      settingsWin.style.selected.bg = COLORDEFAULT;
      settingsWin.focus();
    }

    if (txt.includes('CAN WIN')) {
      CANwin = (CANwin === 'OFF') ? 'ON' : 'OFF';
      settingsWin.setItem(2, ' CAN WIN [' + CANwin + ']');
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
    ` {bold}USER:{/bold}        ${userName.toUpperCase()}`,
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

mainList.on('select', (item) => {
  const text = item.getText();
  if (text.includes('EXIT')) return confirmExit();
  if (text.includes('SETTINGS')) return showSettings();
  if (text.includes('SYSTEM INFO')) return showSystemInfo();
  if (text.includes('ERASE DATA')) return eraseData();
  if (text.includes('CREDITS')) { return credits() ; } // Implementar depois
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