@echo off
echo ========================================================
echo Starting Hospital Management System Backend & Frontend
echo ========================================================

start "HMS Spring Boot Backend (Port 8080)" cmd /k "cd /d %~dp0hospital-management-system\backend && .\mvnw.cmd spring-boot:run"
start "HMS React Frontend (Port 5173)" cmd /k "cd /d %~dp0hospital-management-system\frontend && npm run dev"

echo.
echo Launching browser to http://localhost:5173 in 5 seconds...
timeout /t 5 >nul
start http://localhost:5173
