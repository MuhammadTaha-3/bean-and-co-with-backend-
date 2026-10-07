@echo off
echo Installing backend...
cd /d "%~dp0backend" && call npm install
echo Installing frontend...
cd /d "%~dp0frontend" && call npm install
echo.
echo Done. Now double-click 2-start.bat
pause
