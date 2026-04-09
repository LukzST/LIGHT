@echo off
cls
echo LIGHT UPDATER
echo.
echo Waiting for game to close...
timeout /t 2 /nobreak > nul

cls
echo LIGHT UPDATER
echo.
echo Copying new files...
xcopy "%~dp0_update\*" "%~dp0" /E /H /C /Y /Q > nul
timeout /t 10 /nobreak > nul

cls
echo LIGHT UPDATER
echo.
echo Cleaning temporary files...
rmdir /S /Q "%~dp0_update" 2> nul
timeout /t 5 /nobreak > nul

cls
echo LIGHT UPDATER
echo.
echo Update completed successfully!
echo.
echo Starting LIGHT...
timeout /t 3 /nobreak > nul

cd /d "%~dp0"

if exist "boot.bat" (
    start "" "boot.bat"
) else if exist "LIGHT.exe" (
    start "" "LIGHT.exe"
) else if exist "ASSETS\MENU.JS" (
    start "" node "ASSETS\MENU.JS"
) else (
    echo ERROR: Could not find game executable
    timeout /t 5 /nobreak > nul
)

exit