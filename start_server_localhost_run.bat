@echo off
echo Starting Flask app and localhost.run tunnel...

REM Start Flask app in a new window
start cmd /k "python app.py"

REM Wait for Flask to start
timeout /t 5

REM Start localhost.run tunnel in a new window
start cmd /k "ssh -R 80:localhost:5000 localhost.run"

echo.
echo ====================================
echo Flask app running at: http://localhost:5000
echo Check the localhost.run window for your public URL
echo ====================================
echo.
echo Press any key to stop servers...
pause

REM Kill all python processes
taskkill /F /IM python.exe
