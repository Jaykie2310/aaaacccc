@echo off
echo Starting Flask app and ngrok tunnel...

REM Start Flask app in a new window
start cmd /k "python app.py"

REM Wait for Flask to start
timeout /t 5

REM Start ngrok in a new window
start cmd /k "ngrok http 5000"

echo.
echo ====================================
echo Flask app running at: http://localhost:5000
echo Check the ngrok window for your public URL
echo ====================================
echo.
echo Press any key to stop servers...
pause

REM Kill all python and ngrok processes
taskkill /F /IM python.exe
taskkill /F /IM ngrok.exe
