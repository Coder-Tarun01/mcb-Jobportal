@echo off
echo Starting MCB Job Portal Development Environment...
echo.

echo Starting Backend API Server...
start "Backend API" cmd /k "cd api && npm run dev"

echo Waiting for backend to start...
timeout /t 5 /nobreak > nul

echo Starting Frontend React App...
start "Frontend React" cmd /k "cd mcb && npm start"

echo.
echo Development environment started!
echo Backend API: http://localhost:4000
echo Frontend App: http://localhost:3000
echo.
pause
