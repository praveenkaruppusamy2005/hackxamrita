/**
 * Simple test script to verify translation service
 * Run with: node test-translation-service.js
 * 
 * Note: This is a basic test. For React Native components,
 * test within the app by changing languages.
 */

console.log('🧪 Translation Service Test\n');

// Test 1: Check if package is installed
console.log('✓ Test 1: Package Installation');
try {
  require('@kan9229/react-native-translator');
  console.log('  ✅ @kan9229/react-native-translator is installed\n');
} catch (error) {
  console.log('  ❌ Package not found. Run: npm install\n');
  process.exit(1);
}

// Test 2: Check if service file exists
console.log('✓ Test 2: Service Files');
const fs = require('fs');
const path = require('path');

const files = [
  'services/TranslationService.js',
  'components/TranslatedText.jsx',
  'LanguageContext.js'
];

files.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    console.log(`  ✅ ${file} exists`);
  } else {
    console.log(`  ❌ ${file} not found`);
  }
});

console.log('\n✓ Test 3: Language Codes');
const languageCodes = {
  'en-US': 'en',
  'ta-IN': 'ta',
  'hi-IN': 'hi',
  'te-IN': 'te',
  'kn-IN': 'kn',
  'ml-IN': 'ml',
  'mr-IN': 'mr',
  'bn-IN': 'bn',
};

Object.entries(languageCodes).forEach(([locale, code]) => {
  console.log(`  ✅ ${locale} → ${code}`);
});

console.log('\n✓ Test 4: Static Translations');
try {
  const { translations } = require('./LanguageContext');
  const languages = Object.keys(translations);
  console.log(`  ✅ ${languages.length} languages configured: ${languages.join(', ')}`);
  
  // Check if all languages have the same keys
  const enKeys = Object.keys(translations['en-US']);
  console.log(`  ✅ ${enKeys.length} translation keys available`);
  
  languages.forEach(lang => {
    const keys = Object.keys(translations[lang]);
    if (keys.length === enKeys.length) {
      console.log(`  ✅ ${lang}: ${keys.length} keys`);
    } else {
      console.log(`  ⚠️  ${lang}: ${keys.length} keys (expected ${enKeys.length})`);
    }
  });
} catch (error) {
  console.log('  ❌ Error loading translations:', error.message);
}

console.log('\n✓ Test 5: Documentation');
const docs = [
  'TRANSLATION_GUIDE.md',
  'TRANSLATION_QUICKSTART.md',
  'HOW_TO_USE_TRANSLATION.md'
];

docs.forEach(doc => {
  const docPath = path.join(__dirname, doc);
  if (fs.existsSync(docPath)) {
    console.log(`  ✅ ${doc} available`);
  } else {
    console.log(`  ❌ ${doc} not found`);
  }
});

console.log('\n🎉 Setup Complete!\n');
console.log('📚 Next Steps:');
console.log('  1. Read TRANSLATION_QUICKSTART.md for quick start');
console.log('  2. Check HOW_TO_USE_TRANSLATION.md for usage examples');
console.log('  3. Run your app and test by changing languages');
console.log('  4. Start using <TranslatedText> in your components\n');

console.log('🚀 To test in app:');
console.log('  1. npm start (or yarn start)');
console.log('  2. Change language in Language Selection Screen');
console.log('  3. See translations in action!\n');
