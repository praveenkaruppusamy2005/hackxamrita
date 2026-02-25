#!/bin/bash

echo "🎤 Setting up Interactive Voice Assistant..."
echo ""

# Check if we're in the FinApp directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the FinApp directory"
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "⚠️  Warning: .env file not found"
    echo "Creating .env file..."
    cat > .env << EOF
# Google Gemini API for AI Assistant
# Get your free key: https://makersuite.google.com/app/apikey
GEMINI_API_KEY=your_api_key_here

# Backend server URL (optional)
BACKEND_URL=http://10.195.140.201:3000
EOF
    echo "✅ Created .env file - Please add your GEMINI_API_KEY"
else
    # Check if GEMINI_API_KEY exists in .env
    if ! grep -q "GEMINI_API_KEY" .env; then
        echo "⚠️  Adding GEMINI_API_KEY to .env..."
        echo "" >> .env
        echo "# Google Gemini API for AI Assistant" >> .env
        echo "GEMINI_API_KEY=your_api_key_here" >> .env
        echo "✅ Added GEMINI_API_KEY to .env - Please update with your key"
    fi
fi

# Clear cache
echo "🧹 Clearing cache..."
rm -rf node_modules/.cache
rm -rf android/app/build
rm -rf ios/build

# For iOS, install pods
if [ -d "ios" ]; then
    echo "📱 Installing iOS pods..."
    cd ios
    pod install
    cd ..
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "📝 Next steps:"
echo "1. Add your GEMINI_API_KEY to the .env file"
echo "   Get it from: https://makersuite.google.com/app/apikey"
echo ""
echo "2. Run the app:"
echo "   npm run android  (for Android)"
echo "   npm run ios      (for iOS)"
echo ""
echo "3. Check VOICE_ASSISTANT_GUIDE.md for usage instructions"
echo ""
echo "🎉 Happy coding!"
