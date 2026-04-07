::[Bat To Exe Converter]
::
::YAwzoRdxOk+EWAjk
::fBw5plQjdCyDJGqh2mMZFDd9ayy2AE2TKJQw1N6qobrUnmE0c8oLRKPy/Zy6H8kwxWuqfJUitg==
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
::Zh4grVQjdCyDJGqh2mMZFDd9ayy2AE2TKJQw1N6qobrUnmE0c8oLRKPy/Zy6buUL7yU=
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
echo DEPENDENCY CHECKER
echo.

echo [1/3] Verifying Windows Package Manager...
winget --version >nul 2>&1
if %errorlevel% equ 0 (
    for /f "tokens=*" %%a in ('winget --version') do set W_VER=%%a
    echo Version detected: !W_VER! [Compatible]
    timeout /t 3 >nul
) else (
    echo [FAILED] Winget not found or not compatible.
    echo FALSE > "%STATUS_FILE%"
    echo Please install the App Installer from the Microsoft Store.
    pause
    exit
)

cls
echo [2/3] VERIFYING NODE.JS
echo.
node -v >nul 2>&1
if %errorlevel% neq 0 (
    echo [WARNING] Node.js installation not found.
    echo.
    set /p choice="Would you like to install Node.js now via Winget? [Y/N]: "
    
    if /i "!choice!"=="Y" (
        cls
        echo Installing Node.js...
        winget install OpenJS.NodeJS
        if !errorlevel! equ 0 (
            echo.
            echo Installation complete! The system needs to restart this script.
            echo FALSE > "%STATUS_FILE%"
            timeout /t 3
            start "" "%SCRIPT_NAME%"
            exit
        ) else (
            cls
            echo Automatic installation failed.
            echo FALSE > "%STATUS_FILE%"
            set /p browser="Open official website for manual download? [Y/N]: "
            if /i "!browser!"=="Y" (
                start https://nodejs.org/en/download
                echo Closing in 10 seconds...
                timeout /t 10
                exit
            ) else (
                exit
            )
        )
    ) else (
        echo [INFO] User declined installation. The game cannot run.
        echo FALSE > "%STATUS_FILE%"
        pause
        exit
    )
) else (
    for /f "tokens=*" %%v in ('node -v') do set NODE_VER=%%v
    echo Node.js detected: !NODE_VER!
    timeout /t 2 >nul
)

cls
echo [3/3] VERIFYING LIBRARIES (NPM)
echo.

set "DEPS=blessed play-sound prompt-sync"
set "NEEDS_RESTART=0"

for %%d in (%DEPS%) do (
    echo Verifying existence of dependency: %%d...
    if exist "%ROOT%ASSETS\node_modules\%%d" (
        echo [OK] %%d is already present.
        echo.
    ) else (
        echo [WARNING] Dependency %%d not found.
        set /p dep_choice="Install %%d now via NPM? [Y/N]: "
        if /i "!dep_choice!"=="Y" (
            echo Installing %%d... Please wait.
            cd /d "%ROOT%ASSETS"
            call npm install %%d --silent --no-progress >nul 2>&1
            cd /d "%ROOT%"
            if !errorlevel! equ 0 (
                echo [SUCCESS] %%d installed successfully.
                set "NEEDS_RESTART=1"
            ) else (
                echo [ERROR] Critical failure while installing %%d.
                echo FALSE > "%STATUS_FILE%"
                pause
                exit
            )
        ) else (
            echo [!] Without these libraries, the game will crash.
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
    echo Libraries configured. Restarting Boot...
    timeout /t 3
    cd /d "%ROOT%"
    start "" "%SCRIPT_NAME%"
    exit
)

echo TRUE > "%STATUS_FILE%"

:BOOT_APPLICATION
cls
echo [SYSTEM] STATUS: TRUE
echo [SYSTEM] Starting LIGHT...
timeout /t 3 /nobreak >nul
echo.

where node >nul 2>&1 || (echo Error: Node not recognized by the system. & pause & exit)

for /f "tokens=3" %%a in ('reg query "HKLM\SOFTWARE\Microsoft\Windows NT\CurrentVersion" /v CurrentBuild') do set BUILD=%%a
set BUILD=!BUILD: =!

if exist "%ROOT%ASSETS" (
    cd /d "%ROOT%ASSETS"
) else (
    echo [ERROR] ASSETS folder not found at %ROOT%ASSETS
    echo Please check game files or run from correct location.
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