@echo off
echo Starting AI Interview Analyzer...

echo Starting Backend Server...
start "Backend" cmd /k "cd api && python run_server.py"

timeout /t 3 /nobreak > nul

echo Starting Frontend Server...
start "Frontend" cmd /k "npm run dev"

echo.
echo Both servers are starting...
echo Backend: http://localhost:8000
echo Frontend: http://localhost:3000
echo.
echo Press any key to close this window...
pause > nul
