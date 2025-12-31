::[Bat To Exe Converter]
::
::YAwzoRdxOk+EWAjk
::fBw5plQjdCyDJGqh2mMZFDd9ayy2AEmfMpQg3rrHw8OginkheMsYULvk85ehDq4a6UqE
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
::Zh4grVQjdCyDJGqh2mMZFDd9ayy2AEmfMpQg3rrHw8OginkheMsYULuV36yLQA==
::YB416Ek+ZG8=
::
::
::978f952a14a936cc963da21a135fa983
@echo off
setlocal

where node >nul 2>&1 || exit

for /f "tokens=3" %%a in ('reg query "HKLM\SOFTWARE\Microsoft\Windows NT\CurrentVersion" /v CurrentBuild') do set BUILD=%%a
set BUILD=%BUILD: %=%

cd /d "%~dp0ASSETS"

if %BUILD% GEQ 22000 (
    start wt.exe --title "LIGHT" node MENU.JS --wt
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