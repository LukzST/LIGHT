
const statusBar = document.getElementById('status-bar');
const textBox = document.getElementById('text-box');
const choiceBox = document.getElementById('choice-box');
function mudarPagina() {
    document.body.style.animation = 'none';
    document.body.offsetHeight;
    document.body.style.animation = 'fadeInPage 0.5s ease-out';
}

let nomeJogador = "Michael Nevins";
let Vida = 100;
let valorsanidade = 100;
let papega = false;
let temChave = false;
let chavedois = false;
let mapaachado = false;
let kitm = false;
let fotopega = false;
let leufoto = false;
let destruir = false;
let jafoinorte = false; 
let casafora = false;

let N = false, L = false, O = false, S = false;

let BAD_ENDING = false;
let BAD_ENDING_2 = false;
let BAD_ENDING_3 = false;
let GOOD_ENDING = false;
let REAL_ENDING = false;
let SECRET_ENDING = false;

const ASCII_GAMEOVER = [
    "",
    " ███████████████    ████████████    █████████████████████     █████████████",
    "██████             ██████  ██████   ██████  ██████  ██████   ██████",
    "██████             ██████  ██████   ██████  ██████  ██████   ██████",
    "██████  ████████   ██████████████   ██████  ██████  ██████   ██████████",
    "██████    ██████   ██████  ██████   ██████  ██████  ██████   ██████",
    "██████    ██████   ██████  ██████   ██████  ██████  ██████   ██████",
    " ███████████████   ██████  ██████   ██████  ██████  ██████    █████████████",
    "",
    "   ██████████████    ██████  ██████    █████████████   ██████████████",
    "  ████████████████   ██████  ██████   ██████           ██████   ██████",
    "  ██████    ██████   ██████  ██████   ██████           ██████   ██████",
    "  ██████    ██████   ██████  ██████   ██████████       █████████████",
    "  ██████    ██████   ██████  ██████   ██████           ███████████████",
    "  ████████████████   ██████  ██████   ██████           ██████   ██████",
    "   ██████████████    █████████████     █████████████   ██████   ██████",
    ""
];

const ASCII_SALA_ITENS = [
    "███████████████████████████████████████████████████████████████████",
    "██                                                               ██",
    "██    █      █                                                   ██",
    "██   ███     █                                                   ██",
    "██  (Pot)   ███                                                  ██",
    "██          (Shovel)                                             ██",
    "██                                                            █████",
    "██                               ██                           █  ██",
    "██                             ██████                         █  ██",
    "██                            █  ██  █                      ███  ██",
    "██                               ██                         █ █  ██",
    "██                             ██  ██                         █  ██",
    "██                            ██    ██                        █  ██",                                            
    "███████████████████████████████████████████████████████████████████"
];

const ASCII_FLORESTA_1 = [
    "██████████████████████████████████████████████████████         ████",
    "                   ██                                              ",
    "                 ██                                       /\\      ",
    "               ██                                        WEST      ",
    "         ██  ██                                                    ",
    "       ██  ██                                                      ",
    "     ██                                                            ",
    "██   ██                            ██                 NORTH >      ",
    "██   ██                          ██████                            ",
    "██   ██                         █  ██  █                           ",
    "██   ██                            ██                              ",
    "██   ██                          ██  ██                 EAST       ",
    "██   ██                         ██    ██                 \\/       ",                                            
    "██████████████████████████████████████████████████████         ████"
];


function renderAscii(asciiArray) {
    return `<div class="ascii-art">${asciiArray.join('\n')}</div>`;
}

function replaceTags(text) {
    return text
        .replace(/\{center\}/g, '<span class="center-text">') 
        .replace(/\{\/center\}/g, '</span>')                 
        .replace(/\{yellow-fg\}/g, '<span class="yellow-text">') 
        .replace(/\{green-fg\}/g, '<span class="green-text">')   
        .replace(/\{cyan-fg\}/g, '<span class="cyan-text">')     
        .replace(/\{red-fg\}/g, '<span class="red-text">')       
        .replace(/\{\/\}/g, '</span>');                      
}

function updateStatus() {
    let status = `[Health: <span class="green-text">${Vida}%</span>] | [Sanity: <span class="cyan-text">${valorsanidade}%</span>] | [Items: <span class="yellow-text">`;
    let itens = [];
    if (papega) itens.push('Shovel');
    if (temChave) itens.push('Key (Pot)');
    if (chavedois) itens.push('Key (Gravestone)');
    if (mapaachado) itens.push('Map');
    if (kitm) itens.push('Med Kit');
    if (fotopega) itens.push('Photo');

    status += itens.join(', ') || 'None';
    status += '</span> ]';
    statusBar.innerHTML = status;
}

function showAlert(message) {
    let formattedMessage = replaceTags(message);
    formattedMessage = formattedMessage.replace(/<[^>]*>/g, '');
    alert(formattedMessage);
}

function displayScene(text, choices, choiceHandler) {
    textBox.innerHTML = replaceTags(text).replace(/\n/g, '<br>');
    choiceBox.innerHTML = ''; 

    choices.forEach((c, index) => {
        const button = document.createElement('button');
        const actionValue = c.action !== undefined ? c.action : index + 1;

        button.innerHTML = replaceTags(`[${index + 1}] ${c.text}`);
        button.onclick = () => {
            choiceBox.innerHTML = ''; 
            choiceHandler(actionValue);
        };
        choiceBox.appendChild(button);
    });
    textBox.scrollTop = textBox.scrollHeight;
}



function checkGameOver() {
    if (Vida < 20) return 'DEATH';
    if (valorsanidade <= 10) return 'MADNESS';
    return null;
}

function alterarVida(valor, showPopup = true) { 
    const oldVida = Vida;
    Vida = Math.min(100, Math.max(0, Vida + valor));
    
    if (checkGameOver() === 'DEATH') {
        endGame('You lost too much health!');
        return true; 
    } 
    
    if (showPopup && Vida !== oldVida) {
        let tipo = valor < 0 ? 'DROPPED SEVERELY' : 'INCREASED';
        showAlert(`[WARNING] YOUR HEALTH ${tipo}!\nYou now have ${Vida}% health.`);
        updateStatus();
    }
    updateStatus(); 
    return checkGameOver() !== null;
}

function alterarSanidade(valor, showPopup = true) { 
    const oldSanidade = valorsanidade;
    valorsanidade = Math.min(100, Math.max(0, valorsanidade + valor));

    if (checkGameOver() === 'MADNESS') {
        endGame('Your sanity reached a critical low during the game!\nYou lost your mind and vanished into the forest forever!');
        return true; 
    } else if (showPopup && valorsanidade !== oldSanidade) {
        let tipo = valor < 0 ? 'DROPPED' : 'INCREASED';
        showAlert(`[WARNING] YOUR SANITY ${tipo}!\nYou now have ${valorsanidade}% sanity.`);
        updateStatus(); 
    }
    updateStatus(); 
    return checkGameOver() !== null;
}

function inventarioScene(currentSceneName) {
    let itensNoInventario = 0;
    
    let inventarioText = "-------------------------------------------------\n";
    inventarioText += "Your inventory contains:\n";
    inventarioText += "-------------------------------------------------\n";

    if (papega) { inventarioText += "- Shovel\n"; itensNoInventario++; }
    if (temChave) { inventarioText += "- Key (Pot)\n"; itensNoInventario++; }
    if (chavedois) { inventarioText += "- Key (Gravestone)\n"; itensNoInventario++; }
    if (mapaachado) { inventarioText += "- Map\n"; itensNoInventario++; }
    if (kitm) { inventarioText += "- Med Kit\n"; itensNoInventario++; }
    if (fotopega) { inventarioText += "- Photo\n"; itensNoInventario++; }

    if (itensNoInventario === 0) {
        inventarioText += "You haven't picked up any items yet!\n";
    }
    inventarioText += "-------------------------------------------------";

    showAlert(inventarioText);
    transitionTo(currentSceneName, 0);
}


let currentScene = 'intro';

function transitionTo(sceneName, optionSelected = 0) {
    currentScene = sceneName;
    updateStatus();

    if (checkGameOver()) {
        const type = checkGameOver();
        endGame(type === 'DEATH' ? 'You lost too much health!' : 'You lost your mind and vanished into the forest forever!');
        return;
    }
    
    switch (sceneName) {
        case 'intro': sceneIntro(); break;
        case 'salaInicial': sceneSalaInicial(optionSelected); break;
        case 'floresta1': sceneFloresta1(optionSelected); break;
        case 'floresta2': sceneFloresta2(optionSelected); break;
        case 'floresta3': sceneFloresta3(optionSelected); break;
        case 'floresta4': sceneFloresta4(optionSelected); break;
        default: break; 
    }
}

function sceneIntro() {
    let text = `{center}[CONTEXT]\n\n`;
    text += `You are {yellow-fg}${nomeJogador}{/}, an electrical engineer who was called\n`;
    text += `to fix power poles — but nothing went as planned,\n`;
    text += `and you were kidnapped by someone!\n\n`;
    text += `Your goal is to escape.{/center}`;

    textBox.innerHTML = replaceTags(text).replace(/\n/g, '<br>');
    choiceBox.innerHTML = ''; 

    const startButton = document.createElement('button');
    startButton.innerHTML = replaceTags('[1] START GAME');
    startButton.onclick = () => {
        transitionTo('salaInicial');
    };
    choiceBox.appendChild(startButton);
}

function sceneSalaInicial(choice) {
    let asciiArt = renderAscii(ASCII_SALA_ITENS);
    
    const narrativeText = "\n\n{center}You are in a dark room. Moonlight seeps through the window.\n" +
                          "There is a GOLDEN POT in the corner, along with a SHOVEL. On the other side there is a DOOR.{/center}";
    
    let currentText = asciiArt + narrativeText;

    const choices = [
        { text: `Examine SHOVEL ${papega ? '(TAKEN)' : ''}`, action: 1 },
        { text: `Examine GOLDEN POT ${temChave ? '(TAKEN)' : ''}`, action: 2 },
        { text: `Try to open the DOOR`, action: 3 },
        { text: `INVENTORY`, action: 4 },
        { text: `VIEW STATUS`, action: 5 }
    ];

    if (choice === 1) {
        if (papega) {
            showAlert('You already picked up the shovel!');
        } else {
            papega = true;
            showAlert('You picked up the shovel. It might come in handy later.');
        }
        transitionTo('salaInicial'); return;
    } else if (choice === 2) {
        if (temChave) {
            showAlert('You already picked up the golden pot and the key!');
        } else {
            temChave = true;
            showAlert('You picked up the golden pot. Inside, you found a key.');
        }
        transitionTo('salaInicial'); return;
    } else if (choice === 3) {
        if (temChave) {
            temChave = false;
            showAlert('You manage to open the door with the key you found!\n[WARNING] You used the key!');
            transitionTo('floresta1');
        } else {
            showAlert('You try to open the door, but it is locked...');
            transitionTo('salaInicial');
        }
        return;
    } else if (choice === 4) {
        inventarioScene('salaInicial');
        return;
    } else if (choice === 5) {
        showAlert(`HEALTH: {green-fg}${Vida}%{/}\nSANITY: {cyan-fg}${valorsanidade}%{/}`);
        transitionTo('salaInicial');
        return;
    }
    
    displayScene(currentText, choices, (c) => transitionTo('salaInicial', c));
}

function sceneFloresta1(choice) {
    let asciiArt = renderAscii(ASCII_FLORESTA_1);
    
    let narrativeText = "\n\n{center}Claim your reward. The pale moon smiles at you.\n";
    narrativeText += "You are in a forest. There are paths leading NORTH, WEST and EAST:{/center}";
    
    let currentText = asciiArt + narrativeText;

    const choices = [
        { text: `Go NORTH ${jafoinorte ? '(Already tried)' : ''}`, action: 1 },
        { text: `Go WEST ${O ? '(Already tried)' : ''}`, action: 2 },
        { text: `Go EAST`, action: 3 },
        { text: `INVENTORY`, action: 4 },
        { text: `VIEW STATUS`, action: 5 }
    ];

    if (choice === 1) {
        if (jafoinorte) {
            showAlert('You have already gone North!');
            transitionTo('floresta1'); return;
        }

        jafoinorte = true; 
        
        const choicesAtalho = [
            { text: 'Take the shortcut ({yellow-fg}BAD ENDING{/})', action: 1 },
            { text: 'Ignore the shortcut', action: 2 }
        ];
        
        displayScene("{center}You feel more confident heading North...\nYou find a secret shortcut!{/center}", choicesAtalho, (c) => {
            if (c === 1) {
                BAD_ENDING = true;
                endGame('You rush through the forest, but there are still secrets waiting to be uncovered...');
            } else if (c === 2) {
                showAlert('It feels dangerous. You ignore the shortcut.');
                transitionTo('floresta1');
            } else {
                showAlert('Invalid option! Returning to the path.');
                transitionTo('floresta1');
            }
        });
        return;
        
    } else if (choice === 2) {
        O = true;
        const choicesOeste = [
            { text: 'Run', action: 1 },
            { text: 'Hide', action: 2 }
        ];
        displayScene("{center}You head West...\nA tall man with an axe — and no friendly intentions — approaches you.{/center}", choicesOeste, (c) => {
            let resultado = '';
            if (c === 1 || c === 2) {
                alterarSanidade(-10, false); 
                alterarVida(-50, false);

                if (checkGameOver()) return;

                if (c === 1) {
                    resultado = 'You start running, trip over a root, and get hit with the axe.';
                } else {
                    resultado = 'You try to hide, but he spots you and strikes you with the axe!';
                }

                showAlert(`${resultado}\n\nDamage taken:\n- Current health: ${Vida}%\n- Current sanity: ${valorsanidade}%`);
                transitionTo('floresta1');
            } else {
                showAlert('Invalid option!');
                transitionTo('floresta1');
            }
        });
        return;

    } else if (choice === 3) {
        L = true;
        showAlert('After thinking it over, you decide to head East...\nYou begin pushing deeper into the dense forest...');
        transitionTo('floresta2');
        return;
    } else if (choice === 4) {
        inventarioScene('floresta1');
        return;
    } else if (choice === 5) {
        showAlert(`HEALTH: {green-fg}${Vida}%{/}\nSANITY: {cyan-fg}${valorsanidade}%{/}`);
        transitionTo('floresta1');
        return;
    }
    
    displayScene(currentText, choices, (c) => transitionTo('floresta1', c));
}

function sceneFloresta2(choice) {
    let asciiArt = renderAscii(ASCII_FLORESTA_1);
    
    let narrativeText = "\n\n{center}Claim your reward. The pale moon smiles at you.\n";
    narrativeText += "You are in a forest. There are paths leading NORTH, SOUTH and EAST:{/center}";
    
    let currentText = asciiArt + narrativeText;

    const choices = [
        { text: `Go NORTH ${N ? '(Already went)' : ''}`, action: 1 },
        { text: `Go SOUTH ${S ? '(Already went)' : ''}`, action: 2 },
        { text: `Go EAST`, action: 3 },
        { text: `INVENTORY`, action: 4 },
        { text: `VIEW STATUS`, action: 5 }
    ];

    if (choice === 1) {
        N = true;
        
        const choicesCabana = [
            { text: 'Enter the cabin', action: 1 },
            { text: 'Ignore the cabin', action: 2 }
        ];
        
        displayScene("{center}You decide to head North...\nYou find an old wooden cabin.{/center}", choicesCabana, (c) => {
            if (c === 1) {
                const choicesBau = [
                    { text: 'Take the map', action: 1 },
                    { text: 'Return to the fork', action: 2 },
                    { text: `Take Med Kit ${kitm ? '(TAKEN)' : ''} (Restores 50% health)`, action: 3 }
                ];
                
                displayScene("{center}You enter the cabin and find an old chest. Inside, a parchment with a map drawn on it.{/center}", choicesBau, (c2) => {
                    if (c2 === 1) {
                        mapaachado = true;
                        showAlert('You take the map!'); 
                        transitionTo('floresta2');
                    } else if (c2 === 2) {
                        transitionTo('floresta2');
                    } else if (c2 === 3) {
                        if (kitm) {
                            showAlert('You already took the med kit!');
                            transitionTo('floresta2');
                        } else {
                            kitm = true;
                            alterarVida(50, false); 
                            showAlert(`[MED KIT USED]\n\nYour health was restored by 50 points. Current health: ${Vida}%`);
                            transitionTo('floresta2');
                        }
                    } else {
                        showAlert('Invalid option!');
                        transitionTo('floresta2');
                    }
                });
            } else if (c === 2) {
                const choicesPonte = [
                    { text: 'Jump across the bridge', action: 1 },
                    { text: 'Return to the fork', action: 2 }
                ];
                displayScene("{center}You ignore the cabin and keep going...\nYou find a broken bridge.{/center}", choicesPonte, (c2) => {
                    if (c2 === 1) {
                        endGame('You try to jump across the bridge, but you fall and die.');
                    } else if (c2 === 2) {
                        transitionTo('floresta2');
                    } else {
                        showAlert('Invalid option!');
                        transitionTo('floresta2');
                    }
                });
            } else {
                showAlert('Invalid option!');
                transitionTo('floresta2');
            }
        });
        return;
    } else if (choice === 2) {
        S = true;
        const choicesSul = [
            { text: 'Take the boat', action: 1 },
            { text: 'Ignore the boat', action: 2 },
            { text: 'Return to the fork', action: 3 }
        ];
        
        displayScene("{center}You head South.\nYou find a lake, and a boat in front of you.{/center}", choicesSul, (c) => {
            if (c === 1) {
                const choicesCaverna = [
                    { text: 'Ignore the cave', action: 1 },
                    { text: 'Enter the cave', action: 2 }
                ];

                displayScene("{center}The boat sinks. You spot a submerged cave!{/center}", choicesCaverna, (c2) => {
                    if (c2 === 1) {
                        showAlert('You ignore the cave and decide to swim back.');
                        transitionTo('floresta2');
                    } else if (c2 === 2) {
                        const choicesPergaminho = [
                            { text: 'Read it (Loses Sanity)', action: 1 },
                            { text: 'Don\'t read it', action: 2 },
                            { text: 'DESTROY it! (Affects Secret Ending)', action: 3 }
                        ];

                        displayScene("{center}You find a submerged graveyard with an open parchment...{/center}", choicesPergaminho, (c3) => {
                            if (c3 === 1) {
                                let sanidadePerdida = false;
                                if (!destruir) {
                                    sanidadePerdida = alterarSanidade(-10, false); 
                                }
                                
                                if (checkGameOver()) return; 

                                showAlert('The diary is terrifying. You fear for whoever wrote it.' + 
                                    (sanidadePerdida ? `\n\n[WARNING] Your sanity dropped to ${valorsanidade}%` : ''));

                                const choicesVoltar = [
                                    { text: 'Try to swim back (50% chance of drowning)', action: 1 },
                                    { text: 'Stay in the cave and search (Find a Key)', action: 2 }
                                ];
                                displayScene("{center}What now?{/center}", choicesVoltar, (c4) => {
                                    if (c4 === 1) {
                                        if (Math.random() < 0.5) {
                                            showAlert('You make it back!');
                                            transitionTo('floresta2');
                                        } else {
                                            if(alterarVida(-100)) return;
                                        }
                                    } else if (c4 === 2) {
                                        chavedois = true;
                                        showAlert('You find a key on the gravestone and resurface.');
                                        transitionTo('floresta2');
                                    } else {
                                        showAlert('Invalid option!');
                                        transitionTo('floresta2');
                                    }
                                });
                            } else if (c3 === 2) {
                                showAlert('You decide not to read it and try to swim back.');
                                transitionTo('floresta2');
                            } else if (c3 === 3) {
                                destruir = true;
                                showAlert('YOU DESTROYED THE PARCHMENT! THIS WILL AFFECT THE SECRET ENDING...');
                                transitionTo('floresta2');
                            } else {
                                showAlert('Invalid option!');
                                transitionTo('floresta2');
                            }
                        });
                    } else {
                        showAlert('Invalid option!');
                        transitionTo('floresta2');
                    }
                });

            } else if (c === 2) {
                const choicesLobo = [
                    { text: 'Run', action: 1 },
                    { text: 'Hide', action: 2 }
                ];

                displayScene("{center}You ignore the boat and encounter a wolf.{/center}", choicesLobo, (c2) => {
                    let resultado = '';
                    let dano = 0;
                    if (c2 === 1) {
                        dano = -20;
                        alterarVida(dano, false);
                        resultado = 'You run, but the wolf bites you. Moderate injury!';
                    } else if (c2 === 2) {
                        dano = -70;
                        alterarVida(dano, false);
                        resultado = 'You hide in the wolf\'s den and are severely mauled!';
                    } else {
                        showAlert('Invalid option!');
                        transitionTo('floresta2');
                        return;
                    }

                    if (checkGameOver()) return;

                    showAlert(`${resultado}\n\nDamage taken:\n- Current health: ${Vida}%`);
                    transitionTo('floresta2');
                });
            } else if (c === 3) {
                transitionTo('floresta2');
            } else {
                showAlert('Invalid option!');
                transitionTo('floresta2');
            }
        });
        return;

    } else if (choice === 3) {
        L = true;
        showAlert('You push through the leaves and branches, and reach another fork in the path.');
        transitionTo('floresta3');
        return;
    } else if (choice === 4) {
        inventarioScene('floresta2');
        return;
    } else if (choice === 5) {
        showAlert(`HEALTH: {green-fg}${Vida}%{/}\nSANITY: {cyan-fg}${valorsanidade}%{/}`);
        transitionTo('floresta2');
        return;
    }

    displayScene(currentText, choices, (c) => transitionTo('floresta2', c));
}

function sceneFloresta3(choice) {
    let asciiArt = renderAscii(ASCII_FLORESTA_1);
    
    let narrativeText = "\n\n{center}Claim your reward. The pale moon smiles at you.\n";
    narrativeText += "You are in a forest. There are paths leading NORTH, SOUTH and WEST:{/center}";
    
    let currentText = asciiArt + narrativeText;

    const choices = [
        { text: `Go NORTH`, action: 1 },
        { text: `Go SOUTH`, action: 2 },
        { text: `Go WEST`, action: 3 },
        { text: `INVENTORY`, action: 4 },
        { text: `VIEW STATUS`, action: 5 }
    ];

    if (choice === 1) {
        N = true;
        const choicesObjeto = [
            { text: 'Dig the ground', action: 1 },
            { text: 'Ignore the object', action: 2 }
        ];

        displayScene("{center}You spot something shiny on the ground.{/center}", choicesObjeto, (c) => {
            if (c === 1) {
                if (papega) {
                    const choicesFoto = [
                        { text: 'Read what is written (Loses Sanity)', action: 1 },
                        { text: 'Ignore the photo', action: 2 }
                    ];

                    displayScene("{center}You dig and find a photo of a child. Something is written on the back.{/center}", choicesFoto, (c2) => {
                        fotopega = true;
                        if (c2 === 1) {
                            leufoto = true;
                            alterarSanidade(-10, false); 
                            
                            if (checkGameOver()) return;

                            showAlert(`The photo reads: 'YOU SHOULD NOT HAVE COME HERE'.\nYour sanity dropped to ${valorsanidade}%.\nYou reach a fork in the path.`);
                            transitionTo('floresta4');
                        } else if (c2 === 2) {
                            leufoto = false;
                            showAlert('You ignore the photo and move on.\nYou reach a fork in the path.');
                            transitionTo('floresta4');
                        } else {
                            showAlert('Invalid option!');
                            transitionTo('floresta3');
                        }
                    });
                } else {
                    showAlert('You cannot dig — you don\'t have a shovel!');
                    transitionTo('floresta3');
                }
            } else if (c === 2) {
                showAlert('You ignore the object and keep moving.\nYou reach a fork in the path.');
                transitionTo('floresta4');
            } else {
                showAlert('Invalid option!');
                transitionTo('floresta3');
            }
        });
        return;
    } else if (choice === 2) {
        S = true;
        const choicesLobo = [
            { text: 'Run', action: 1 },
            { text: 'Hide', action: 2 }
        ];
        
        displayScene("{center}You head South...\nYou encounter a wolf.{/center}", choicesLobo, (c) => {
            if (c === 1 || c === 2) {
                endGame('You run, but the wolf is faster — it catches and kills you!');
            } else {
                showAlert('Invalid option!');
                transitionTo('floresta3');
            }
        });
        return;
    } else if (choice === 3) {
        O = true;
        endGame('You decide to head West, fall into a river, and drown!');
        return;
    } else if (choice === 4) {
        inventarioScene('floresta3');
        return;
    } else if (choice === 5) {
        showAlert(`HEALTH: {green-fg}${Vida}%{/}\nSANITY: {cyan-fg}${valorsanidade}%{/}`);
        transitionTo('floresta3');
        return;
    }

    displayScene(currentText, choices, (c) => transitionTo('floresta3', c));
}

function sceneFloresta4(choice) {
    let text = "{center}The pale moon smiles at you.\n";
    text += "Ahead of you there are paths leading NORTH and SOUTH.{/center}";
    
    let currentText = text;

    const choices = [
        { text: `Go NORTH (Road)`, action: 1 },
        { text: `Go SOUTH (House)`, action: 2 },
        { text: `INVENTORY`, action: 3 },
        { text: `VIEW STATUS`, action: 4 }
    ];

    if (choice === 1) {
        N = true;
        const choicesCarro = [
            { text: 'Try to start the car', action: 1 },
            { text: 'Ignore the car', action: 2 },
            { text: 'Walk down the road (DEATH)', action: 3 }
        ];

        displayScene("{center}You find a car parked on the side of a road.{/center}", choicesCarro, (c) => {
            if (c === 1) {
                const choicesCarroFinal = [
                    { text: 'Drive away (Ending)', action: 1 },
                    { text: 'Go back to the path', action: 2 }
                ];
                
                displayScene("{center}You manage to start the car. Drive away?{/center}", choicesCarroFinal, (c2) => {
                    if (c2 === 1) {
                        if (fotopega && leufoto) {
                            GOOD_ENDING = true;
                            endGame('You call the police. (GOOD ENDING)');
                        } else if (fotopega && !leufoto) {
                            BAD_ENDING_2 = true;
                            endGame('You drive away, ignoring the photo. (BAD ENDING 2)');
                        } else {
                            BAD_ENDING_3 = true;
                            endGame('You drive away without a second thought. (BAD ENDING 3)');
                        }
                    } else if (c2 === 2) {
                        showAlert('You decide to go back.');
                        transitionTo('floresta4');
                    } else {
                        showAlert('Invalid option!');
                        transitionTo('floresta4');
                    }
                });
            } else if (c === 2) {
                showAlert('You ignore the car and have to return to the fork.');
                transitionTo('floresta4');
            } else if (c === 3) {
                endGame('You are hit by a car with no headlights. You died!');
            } else {
                showAlert('Invalid option!');
                transitionTo('floresta4');
            }
        });
        return;
    } else if (choice === 2) {
        S = true;
        const choicesCasa = [
            { text: 'Enter the house', action: 1 },
            { text: 'Ignore the house and follow the path', action: 2 }
        ];

        displayScene("{center}You find a house that looks ordinary.{/center}", choicesCasa, (c) => {
            if (c === 1) {
                const choicesMapa = [
                    { text: 'Follow the map', action: 1 },
                    { text: 'Ignore the map (DEATH)', action: 2 }
                ];

                displayScene("{center}You find a note with a rough map drawn with arrows.{/center}", choicesMapa, (c2) => {
                    if (c2 === 1) {
                        const choicesCavar = [
                            { text: 'Dig in search of something', action: 1 },
                            { text: 'Don\'t dig (DEATH)', action: 2 }
                        ];

                        displayScene("{center}You follow the map. At the marked 'X', the ground sounds hollow. What do you do?{/center}", choicesCavar, (c3) => {
                            if (c3 === 1) {
                                if (destruir) {
                                    SECRET_ENDING = true;
                                    endGame("The child's body rises: 'YOU DESTROYED MY PARCHMENT...' (SECRET ENDING)");
                                } else {
                                    REAL_ENDING = true;
                                    endGame("You uncover a child's body and the coordinates '—— 40.24248 —— -121.4434 ——' (REAL ENDING)");
                                }
                            } else if (c3 === 2) {
                                endGame('You decide not to dig. A figure attacks and kills you.');
                            } else {
                                showAlert('Invalid option!');
                                transitionTo('floresta4');
                            }
                        });
                    } else if (c2 === 2) {
                        endGame('You ignore the map. The owner returns and kills you.');
                    } else {
                        showAlert('Invalid option!');
                        transitionTo('floresta4');
                    }
                });
            } else if (c === 2) {
                if (!casafora) {
                    casafora = true;
                    showAlert('You ignore the house. The path leads you in circles. You have to go back.');
                    transitionTo('floresta4');
                } else {
                    showAlert('You\'ve already tried this. The path keeps leading you in circles.');
                    transitionTo('floresta4');
                }
            } else {
                showAlert('Invalid option!');
                transitionTo('floresta4');
            }
        });
        return;
    } else if (choice === 3) {
        inventarioScene('floresta4');
        return;
    } else if (choice === 4) {
        showAlert(`HEALTH: {green-fg}${Vida}%{/}\nSANITY: {cyan-fg}${valorsanidade}%{/}`);
        transitionTo('floresta4');
        return;
    }

    displayScene(currentText, choices, (c) => transitionTo('floresta4', c));
}

function endGame(message) {
    let finalType = 'DEATH / MADNESS';
    
    if (BAD_ENDING) finalType = 'BAD ENDING';
    else if (GOOD_ENDING) finalType = 'GOOD ENDING';
    else if (REAL_ENDING) finalType = 'REAL ENDING';
    else if (SECRET_ENDING) finalType = 'SECRET ENDING';
    else if (BAD_ENDING_2) finalType = 'BAD ENDING 2';
    else if (BAD_ENDING_3) finalType = 'BAD ENDING 3';

    console.log(`[ACHIEVEMENT UNLOCKED] Ending: ${finalType}`);

    let content = renderAscii(ASCII_GAMEOVER);
    content += `<br><br>{center}GAME OVER{/}<br><br>{red-fg}${message}{/}<br><br>ENDING REACHED: [{yellow-fg}${finalType}{/}]{/center}`;
    
    textBox.innerHTML = replaceTags(content).replace(/\n/g, '<br>');
    choiceBox.innerHTML = '';
    
    const restartButton = document.createElement('button');
    restartButton.textContent = 'Restart Game (Reload Page)';
    restartButton.onclick = () => window.location.reload();
    choiceBox.appendChild(restartButton);

    updateStatus();
}


document.addEventListener('DOMContentLoaded', () => {
    updateStatus();
    sceneIntro();
});