::[Bat To Exe Converter]
::
::YAwzoRdxOk+EWAjk
::fBw5plQjdCyDJGqh2mMZFDd9ayy2AEKZKZsv1P3r6+uTp3ITW/UAcYzU1PqHI+9z
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
::Zh4grVQjdCyDJGqh2mMZFDd9ayy2AE2TKJQw1N6qobrUnmE0c8oLRJrL3rWaJd8d5VKqcI4otg==
::YB416Ek+ZG8=
::
::
::978f952a14a936cc963da21a135fa983
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