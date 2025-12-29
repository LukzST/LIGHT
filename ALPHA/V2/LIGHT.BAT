@echo off

mode con: cols=100 lines=30
where node >nul
if errorlevel 1 (
  echo Node.js not found. Install to continue.
  pause
  exit
)
cd assets
node menu.js
pause