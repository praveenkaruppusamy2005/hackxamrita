@echo off
echo Installing Python dependencies for AI Assistant...
cd backend
pip install -r requirements.txt
echo.
echo ========================================
echo Installation Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Get your FREE Gemini API key from: https://makersuite.google.com/app/apikey
echo 2. Add it to your .env file: GEMINI_API_KEY=your_key_here
echo 3. Restart the backend server: node backend/server.js
echo.
pause
