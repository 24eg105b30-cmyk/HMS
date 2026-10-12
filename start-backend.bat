@echo off
echo Starting Spring Boot Backend on http://localhost:8080 ...
cd /d %~dp0hospital-management-system\backend
.\mvnw.cmd spring-boot:run
pause
