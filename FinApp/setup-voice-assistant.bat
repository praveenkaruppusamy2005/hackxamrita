@echo off
echo 🎤 Setting up Interactive Voice Assistant...
echo.

REM Check if we're in the FinApp directory
if not exist "package.json" (
    echo ❌ Error: Please run this script from the FinApp directory
    exit /b 1
)

REM Install dependencies
echo 📦 Installing dependencies...
call npm install

REM Check if .env exists
if not exist ".env" (
    echo ⚠️  Warning: .env file not found
    echo Creating .env file...
    (
        echo # Google Gemini API for AI Assistant
        echo # Get your free key: https://makersuite.google.com/app/apikey
        echo GEMINI_API_KEY=your_api_key_here
        echo.
        echo # Backend server URL ^(optional^)
        echo BACKEND_URL=http://10.195.140.201:3000
    ) > .env
    echo ✅ Created .env file - Please add your GEMINI_API_KEY
) else (
    REM Check if GEMINI_API_KEY exists in .env
    findstr /C:"GEMINI_API_KEY" .env >nul
    if errorlevel 1 (
        echo ⚠️  Adding GEMINI_API_KEY to .env...
        (
            echo.
            echo # Google Gemini API for AI Assistant
            echo GEMINI_API_KEY=your_api_key_here
        ) >> .env
        echo ✅ Added GEMINI_API_KEY to .env - Please update with your key
    )
)

REM Clear cache
echo 🧹 Clearing cache...
if exist "node_modules\.cache" rmdir /s /q "node_modules\.cache"
if exist "android\app\build" rmdir /s /q "android\app\build"

echo.
echo ✅ Setup complete!
echo.
echo 📝 Next steps:
echo 1. Add your GEMINI_API_KEY to the .env file
echo    Get it from: https://makersuite.google.com/app/apikey
echo.
echo 2. Run the app:
echo    npm run android  (for Android)
echo.
echo 3. Check VOICE_ASSISTANT_GUIDE.md for usage instructions
echo.
echo 🎉 Happy coding!
pause
