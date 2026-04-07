::[Bat To Exe Converter]
::
::YAwzoRdxOk+EWAjk
::fBw5plQjdCyDJGyX8VAjFDp4eSqtb0mGIrof/eX+4f6Unn44esMWRKX0/Zu9HMw6zW3QSbAE+Ft2pP1dQksLQj6CSScAlUJrkUyxCO6/nCGvQ0uGhg==
::YAwzuBVtJxjWCl3EqQJgSA==
::ZR4luwNxJguZRRnk
::Yhs/ulQjdF+5
::cxAkpRVqdFKZSDk=
::cBs/ulQjdF+5
::ZR41oxFsdFKZSDk=
::eBoioBt6dFKZSDk=
::cRo6pxp7LAbNWATEpCI=
::egkzugNsPRvcWATEpCI=
::dAsiuh18IRvcCxnZtBJQ
::cRYluBh/LU+EWAnk
::YxY4rhs+aU+JeA==
::cxY6rQJ7JhzQF1fEqQJQ
::ZQ05rAF9IBncCkqN+0xwdVs0
::ZQ05rAF9IAHYFVzEqQJQ
::eg0/rx1wNQPfEVWB+kM9LVsJDGQ=
::fBEirQZwNQPfEVWB+kM9LVsJDGQ=
::cRolqwZ3JBvQF1fEqQJQ
::dhA7uBVwLU+EWDk=
::YQ03rBFzNR3SWATElA==
::dhAmsQZ3MwfNWATElA==
::ZQ0/vhVqMQ3MEVWAtB9wSA==
::Zg8zqx1/OA3MEVWAtB9wSA==
::dhA7pRFwIByZRRnk
::Zh4grVQjdCyDJGyX8VAjFDp4eSqtb0mGIrof/eX+4f6Unn44esMWRKX0/Zu9HMw6zW3QSbAE+Ft2pP1dQksLQj6CSScAlUJrkUyxecKEtm8=
::YB416Ek+ZG8=
::
::
::978f952a14a936cc963da21a135fa983
@echo off
setlocal enabledelayedexpansion
set "ROOT=%~dp0"
set "STATUS_DIR=%ROOT%ASSETS\STATUS"
set "STATUS_FILE=%STATUS_DIR%\status.txt"
set "SCRIPT_NAME=%~nx0"

if not exist "%STATUS_DIR%" mkdir "%STATUS_DIR%"

if exist "%STATUS_FILE%" (
    findstr /C:"TRUE" "%STATUS_FILE%" >nul
    if !errorlevel! equ 0 (
        goto :BOOT_APPLICATION
    )
)

:DEPENDENCY_CHECKER
cls
echo CHECKER DE DEPENDENCIAS
echo.

echo [1/3] Verificando Windows Package Manager...
winget --version >nul 2>&1
if %errorlevel% equ 0 (
    for /f "tokens=*" %%a in ('winget --version') do set W_VER=%%a
    echo Versao detectada: !W_VER! [Compativel]
    timeout /t 3 >nul
) else (
    echo [FALHA] Winget nao encontrado ou nao compativel.
    echo FALSE > "%STATUS_FILE%"
    echo Por favor, instale o App Installer na Microsoft Store.
    pause
    exit
)

cls
echo [2/3] VERIFICANDO NODE.JS
echo.
node -v >nul 2>&1
if %errorlevel% neq 0 (
    echo [AVISO] Instalacao do Node.js nao encontrada.
    echo.
    set /p choice="Deseja instalar Node.js agora via Winget? [Y/N]: "
    
    if /i "!choice!"=="Y" (
        cls
        echo Instalando Node.js...
        winget install OpenJS.NodeJS
        if !errorlevel! equ 0 (
            echo.
            echo Instalacao concluida! O sistema precisa reiniciar este script.
            echo FALSE > "%STATUS_FILE%"
            timeout /t 3
            start "" "%SCRIPT_NAME%"
            exit
        ) else (
            cls
            echo A instalacao automatica falhou.
            echo FALSE > "%STATUS_FILE%"
            set /p browser="Abrir site oficial para download manual? [Y/N]: "
            if /i "!browser!"=="Y" (
                start https://nodejs.org/en/download
                echo Fechando em 10 segundos...
                timeout /t 10
                exit
            ) else (
                exit
            )
        )
    ) else (
        echo [INFO] Usuario recusou a instalacao. O jogo nao pode rodar.
        echo FALSE > "%STATUS_FILE%"
        pause
        exit
    )
) else (
    for /f "tokens=*" %%v in ('node -v') do set NODE_VER=%%v
    echo Node.js detectado: !NODE_VER!
    timeout /t 2 >nul
)

cls
echo [3/3] VERIFICANDO BIBLIOTECAS (NPM)
echo.

set "DEPS=blessed play-sound prompt-sync"
set "NEEDS_RESTART=0"

for %%d in (%DEPS%) do (
    echo Verificando existencia da dependencia: %%d...
    if exist "ASSETS\node_modules\%%d" (
        echo [OK] %%d ja esta presente.
        echo.
    ) else (
        echo [AVISO] Dependencia %%d nao encontrada.
        set /p dep_choice="Instalar %%d agora via NPM? [Y/N]: "
        if /i "!dep_choice!"=="Y" (
            echo Instalando %%d... Aguarde.
            call npm install %%d --silent --no-progress >nul 2>&1
            if !errorlevel! equ 0 (
                echo [SUCESSO] %%d instalada com exito.
                set "NEEDS_RESTART=1"
            ) else (
                echo [ERRO] Falha critica ao instalar %%d.
                echo FALSE > "%STATUS_FILE%"
                pause
                exit
            )
        ) else (
            echo [!] Sem as bibliotecas o jogo ira crashar.
            echo FALSE > "%STATUS_FILE%"
            pause
            exit
        )
        echo.
    )
    timeout /t 1 >nul
)

if "!NEEDS_RESTART!"=="1" (
    echo TRUE > "%STATUS_FILE%"
    echo Bibliotecas configuradas. Reiniciando Boot...
    timeout /t 3
    start "" "%SCRIPT_NAME%"
    exit
)

echo TRUE > "%STATUS_FILE%"

:BOOT_APPLICATION
cls
echo [SISTEMA] STATUS: TRUE
echo [SISTEMA] Iniciando LIGHT...
timeout /t 3 /nobreak >nul
echo.

where node >nul 2>&1 || (echo Erro: Node nao reconhecido no sistema. & pause & exit)

for /f "tokens=3" %%a in ('reg query "HKLM\SOFTWARE\Microsoft\Windows NT\CurrentVersion" /v CurrentBuild') do set BUILD=%%a
set BUILD=!BUILD: =!

if exist "ASSETS" (
    cd /d "%ROOT%ASSETS"
) else (
    echo [ERRO] Pasta ASSETS nao encontrada. Verifique os arquivos do jogo.
    pause
    exit
)

if %BUILD% GEQ 22000 (
    node MENU.JS 
    exit
) else if %BUILD% GEQ 10240 (
    if exist "TERMINALPORTATIL\WT\wt.exe" (
        start "" "TERMINALPORTATIL\WT\wt.exe" --title "LIGHT" -d "%cd%" node MENU.JS --wt
    ) else (
        start node MENU.JS --cmd
    )
    exit
) else (
    node MENU.JS --cmd
    exit
)