@echo off
title CLEANING ACCESS FILES

set "arq1=%USERPROFILE%\Pictures\1_POSITION.txt"
set "arq2=%USERPROFILE%\Documents\2_POSITION.txt"
set "arq3=%USERPROFILE%\Music\3_POSITION.txt"
set "arq4=%USERPROFILE%\Desktop\4_POSITION.txt"

echo [SYSTEM]: Iniciando limpeza de arquivos de senha...

attrib -r "%arq1%" 2>nul
attrib -r "%arq2%" 2>nul
attrib -r "%arq3%" 2>nul
attrib -r "%arq4%" 2>nul

del /f /q "%arq1%" 2>nul
del /f /q "%arq2%" 2>nul
del /f /q "%arq3%" 2>nul
del /f /q "%arq4%" 2>nul

echo [SYSTEM]: Limpeza concluida.
exit