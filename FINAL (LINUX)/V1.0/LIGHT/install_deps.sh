#!/bin/bash

echo "--- LIGHT SYSTEM: INSTALADOR DE DEPENDÊNCIAS (LINUX) ---"

# Detectar gerenciador de pacotes
if [ -x "$(command -v apt-get)" ]; then
    echo "[INFO] Sistema baseado em Debian/Ubuntu detectado."
    sudo apt update
    sudo apt install -y mplayer mpg123 curl alsa-utils xdg-utils nodejs npm
    chmod +x ./LIGHT.sh
elif [ -x "$(command -v pacman)" ]; then
    echo "[INFO] Sistema baseado em Arch detectado."
    sudo pacman -Syu --noconfirm mplayer mpg123 curl alsa-utils xdg-utils nodejs npm
    chmod +x ./LIGHT.sh
elif [ -x "$(command -v dnf)" ]; then
    echo "[INFO] Sistema baseado em Fedora/RPM detectado."
    sudo dnf install -y mplayer mpg123 curl alsa-utils xdg-utils nodejs npm
    chmod +x ./LIGHT.sh
else
    echo "[ERRO] Gerenciador de pacotes não suportado automaticamente."
    echo "Instale manualmente: mplayer, mpg123, curl, alsa-utils."
    exit 1
fi

# Instalar dependências do Node
echo "[INFO] Instalando bibliotecas do Node.js..."
npm install blessed play-sound

# Garantir permissões de escrita para as pastas do jogo
echo "[INFO] Ajustando permissões de arquivos..."
chmod -R +rw .

echo "[SUCESSO] Dependências instaladas. Use 'node menu.js' para iniciar."