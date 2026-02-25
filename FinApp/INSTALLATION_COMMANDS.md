# 📦 Installation Commands

## Quick Install (Recommended)

```bash
cd FinApp
npm install
npm run android
```

## Step-by-Step Install

### 1. Navigate to Project
```bash
cd FinApp
```

### 2. Install All Dependencies
```bash
npm install
```

This will install:
- `@google/generative-ai@^0.21.0` - Google Gemini AI
- `react-native-dotenv@^3.4.11` - Environment variables
- All other existing dependencies

### 3. Clear Cache (Optional but Recommended)
```bash
# Clear npm cache
npm cache clean --force

# Clear React Native cache
npx react-native start --reset-cache
```

### 4. Clean Build (Android)
```bash
cd android
./gradlew clean
cd ..
```

### 5. Run the App
```bash
# Android
npm run android

# iOS (if applicable)
cd ios
pod install
cd ..
npm run ios
```

## Verify Installation

Check if packages are installed:
```bash
npm list @google/generative-ai
npm list react-native-dotenv
```

Expected output:
```
FinApp@0.0.1
├── @google/generative-ai@0.21.0
└── react-native-dotenv@3.4.11
```

## Environment Setup

Your `.env` file is already configured:
```env
GEMINI_API_KEY=AIzaSyDTMfiyUG3MaaDawgDrvUkw68vAfZGNfA8
BACKEND_URL=http://10.195.140.201:3000
```

## Troubleshooting

### Module Not Found Error
```bash
# Delete node_modules and reinstall
rm -rf node_modules
npm install
```

### Build Errors (Android)
```bash
# Clean and rebuild
cd android
./gradlew clean
./gradlew assembleDebug
cd ..
npm run android
```

### Metro Bundler Issues
```bash
# Reset cache and restart
npx react-native start --reset-cache
```

### Permission Errors
```bash
# On Linux/Mac, fix permissions
chmod +x android/gradlew
```

## Platform-Specific

### Windows
```bash
# Use the batch script
setup-voice-assistant.bat
```

### Linux/Mac
```bash
# Use the shell script
chmod +x setup-voice-assistant.sh
./setup-voice-assistant.sh
```

## Manual Package Installation

If you need to install packages individually:

```bash
# Install Gemini AI
npm install @google/generative-ai@^0.21.0

# Install dotenv
npm install react-native-dotenv@^3.4.11
```

## Post-Installation

1. **Restart Metro Bundler**
   ```bash
   npx react-native start --reset-cache
   ```

2. **Rebuild App**
   ```bash
   npm run android
   ```

3. **Test Voice Assistant**
   - Open app
   - Navigate to Voice Assistant
   - Enable continuous mode
   - Start speaking

## Dependencies Summary

### New Dependencies
```json
{
  "@google/generative-ai": "^0.21.0",
  "react-native-dotenv": "^3.4.11"
}
```

### Existing Dependencies (Used)
```json
{
  "@ascendtis/react-native-voice-to-text": "^0.3.2",
  "react-native-tts": "^4.1.1",
  "@react-native-async-storage/async-storage": "^1.23.1"
}
```

## Configuration Files Modified

1. **package.json** - Added dependencies
2. **babel.config.js** - Added dotenv plugin
3. **.env** - Already configured ✅

## Ready to Go!

After installation:
```bash
npm run android
```

Then open the Voice Assistant screen and start talking! 🎤
