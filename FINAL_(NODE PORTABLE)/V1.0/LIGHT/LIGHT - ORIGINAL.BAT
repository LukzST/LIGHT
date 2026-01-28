@echo off
setlocal

where node >nul 2>&1 || exit

for /f "tokens=3" %%a in ('reg query "HKLM\SOFTWARE\Microsoft\Windows NT\CurrentVersion" /v CurrentBuild') do set BUILD=%%a
set BUILD=%BUILD: %=%

cd /d "%~dp0ASSETS"

if %BUILD% GEQ 22000 (
    node MENU.JS 
pause
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