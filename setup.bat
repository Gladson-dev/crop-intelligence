@echo off
echo Setting up Crop Intelligence Application...
echo.

echo [1/4] Setting up backend...
cd backend
call npm install
if %errorlevel% neq 0 (
    echo Error installing backend dependencies
    exit /b %errorlevel%
)
cd ..

echo [2/4] Setting up frontend...
cd frontend
call npm install
if %errorlevel% neq 0 (
    echo Error installing frontend dependencies
    exit /b %errorlevel%
)
cd ..

echo.
echo [3/4] Creating .env files...
if not exist backend\.env (
    copy .env.example backend\.env >nul
    echo Created backend/.env - Please update with your configuration
) else (
    echo backend/.env already exists - Skipping
)

echo.
echo [4/4] Setup complete! 🎉
echo.
echo Next steps:
echo 1. Edit the configuration in backend/.env
echo 2. Start the backend server: cd backend && npm run server
echo 3. In a new terminal, start the frontend: cd frontend && npm run dev
echo 4. Open http://localhost:5173 in your browser
echo.
pause
