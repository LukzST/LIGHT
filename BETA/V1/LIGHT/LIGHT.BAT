::[Bat To Exe Converter]
::
::YAwzoRdxOk+EWAjk
::fBw5plQjdCyDJGqh2mMZFDd9ayy2AEmfMpQg3rnHw8OginkheMsYULvk85ehDq4a6UqE
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
::Zh4grVQjdCyDJGqh2mMZFDd9ayy2AEmfMpQg3rnHw8OginkheMsYULuV36yLQA==
::YB416Ek+ZG8=
::
::
::978f952a14a936cc963da21a135fa983
@echo off
setlocal

where node >nul 2>&1 || exit
for /f "tokens=4-5 delims=. " %%i in ('ver') do set VERSION=%%i.%%j


:: CASO 1: Windows 11
if "%VERSION%" GEQ "10.0.22000" (
    cd /d "%~dp0ASSETS"
    wt.exe --title "LIGHT" node MENU.JS & exit
)

:: CASO 2: Windows 10 Portátil
if "%VERSION%" GEQ "10.0.10240" (
    cd /d "%~dp0ASSETS"
    "%~dp0ASSETS\TERMINALPORTATIL\WT\wt.exe" --title "LIGHT" -d "%~dp0ASSETS" node MENU.JS & exit
)

:: CASO 3: Direto no Node (Vai abrir no CMD comum)
cd /d "%~dp0ASSETS"
node MENU.JS