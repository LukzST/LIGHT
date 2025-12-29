@echo off
title: FILES TO ACESS

set "arquivos1=%USERPROFILE%\Pictures\4 (position 1).TXT"
set "arquivos2=%USERPROFILE%\Documents\6 (position 2).TXT"
set "arquivos3=%USERPROFILE%\Music\2 (position 3).TXT"
set "arquivos4=%USERPROFILE%\desktop\4 (position 4).txt"

echo CODE TERMINAL POSITION 1: 4>> "%arquivos1%"
echo (MORE CODES ARE ON YOUR OTHER FOLDERS)>> "%arquivos1%"

echo CODE TERMINAL POSITION 2: 6>> "%arquivos2%"
echo CODE TERMINAL POSITION 3: 2>> "%arquivos3%"
echo CODE TERMINAL POSITION 4: 4>> "%arquivos4%"