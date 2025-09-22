@echo off
start "Backend Server" /D "%~dp0backend" cmd /k "npm run server"
timeout /t 3 /nobreak >nul
start "Frontend Server" /D "%~dp0frontend" cmd /k "npm run dev"

echo.
echo Servers starting...
echo - Backend: http://localhost:5000
echo - Frontend: http://localhost:5173
echo.
pause
