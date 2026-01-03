@echo off
title FILES TO ACCESS

set "arq1=%USERPROFILE%\Pictures\1_POSITION.txt"
set "arq2=%USERPROFILE%\Documents\2_POSITION.txt"
set "arq3=%USERPROFILE%\Music\3_POSITION.txt"
set "arq4=%USERPROFILE%\Desktop\4_POSITION.txt"

echo CODE TERMINAL POSITION 1: 4 > "%arq1%"
echo (MORE CODES ARE ON YOUR OTHER FOLDERS) >> "%arq1%"

echo CODE TERMINAL POSITION 2: 6 > "%arq2%"
echo CODE TERMINAL POSITION 3: 2 > "%arq3%"
echo CODE TERMINAL POSITION 4: 4 > "%arq4%"

attrib +r "%arq1%"
attrib +r "%arq2%"
attrib +r "%arq3%"
attrib +r "%arq4%"