@echo off
start "Bean&Co BACKEND (4000)" cmd /k "cd /d %~dp0backend && npm run dev"
timeout /t 6 /nobreak >nul
start "Bean&Co FRONTEND (3000)" cmd /k "cd /d %~dp0frontend && npm run dev"
timeout /t 8 /nobreak >nul
start http://localhost:4000/api/health
start http://localhost:3000
