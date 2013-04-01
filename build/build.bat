@echo off
:: Dependences: http://www.7-zip.org

set EXT_FILENAME=uSequential.btapp
erase %EXT_FILENAME%
7za.exe a -r -tzip %EXT_FILENAME% ..\src\* -mx9
