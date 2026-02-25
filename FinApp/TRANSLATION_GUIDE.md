# Translation Service Guide

## Overview
Your app now has a comprehensive translation service that can translate any text dynamically using Google Translate API (free) via `@kan9229/react-native-translator`.

## Features
- ✅ Free translation service (Google Translate)
- ✅ Support for 8+ languages
- ✅ Static translations for common UI elements (fast, offline)
- ✅ Dynamic translation for any text (online)
- ✅ Batch translation support
- ✅ Automatic fallback to static translations
- ✅ Easy-to-use React components and hooks

## Supported Languages
- English (en-US)
- Tamil (ta-IN)
- Hindi (hi-IN)
- Telugu (te-IN)
- Kannada (kn-IN)
- Malayalam (ml-IN)
- Marathi (mr-IN)
- Bengali (bn-IN)

## Usage Methods

### Method 1: TranslatedText Component (Recommended)
The easiest way to add translations to your app.

```jsx
import TranslatedText from './components/TranslatedText';

// Basic usage
<TranslatedText>Hello World</TranslatedText>

// With styling
<TranslatedText style={styles.heading}>
  Welcome to our app
</TranslatedText>

// With static key fallback (uses offline translation if available)
<TranslatedText staticKey="greeting">
  Good Morning
</TranslatedText>

// With loading indicator
<TranslatedText showLoader={true}>
  Processing your request
</TranslatedText>
```

### Method 2: useTranslationService Hook
For more control and programmatic translations.

```jsx
import { useTranslationService } from './services/TranslationService';

const MyComponent = () => {
  const { translateText, translateBatch, isLoading } = useTranslationService();
  
  // Translate single text
  const handleTranslate = async () => {
    const result = await translateText('Hello', 'ta');
    console.log(result); // வணக்கம்
  };
  
  // Translate multiple texts
  const handleBatch = async () => {
    const texts = ['Hello', 'Welcome', 'Thank you'];
    const results = await translateBatch(texts, 'hi');
    console.log(results);
  };
  
  return (
    <Button 
      title={isLoading ? "Translating..." : "Translate"} 
      onPress={handleTranslate} 
    />
  );
};
```

### Method 3: LanguageContext (Direct)
Use the context directly for inline translations.

```jsx
import { useLanguage } from './LanguageContext';

const MyComponent = () => {
  const { translateDynamic, t } = useLanguage();
  
  // Static translation (offline, fast)
  const greeting = t('greeting');
  
  // Dynamic translation (online)
  const handleTranslate = async () => {
    const result = await translateDynamic('Custom message');
    console.log(result);
  };
  
  return <Text>{greeting}</Text>;
};
```

## Real-World Examples

### Example 1: Translating Form Labels
```jsx
<View>
  <TranslatedText style={styles.label}>Full Name</TranslatedText>
  <TextInput placeholder="Enter your name" />
  
  <TranslatedText style={styles.label}>Email Address</TranslatedText>
  <TextInput placeholder="Enter your email" />
  
  <TranslatedText style={styles.label}>Phone Number</TranslatedText>
  <TextInput placeholder="Enter your phone" />
</View>
```

### Example 2: Translating Dynamic Content
```jsx
const NotificationScreen = ({ notifications }) => {
  return (
    <FlatList
      data={notifications}
      renderItem={({ item }) => (
        <View>
          <TranslatedText style={styles.title}>
            {item.title}
          </TranslatedText>
          <TranslatedText style={styles.message}>
            {item.message}
          </TranslatedText>
        </View>
      )}
    />
  );
};
```

### Example 3: Translating API Responses
```jsx
const fetchAndTranslate = async () => {
  const response = await fetch('https://api.example.com/data');
  const data = await response.json();
  
  const { translateText } = useTranslationService();
  const translatedDescription = await translateText(
    data.description, 
    currentLanguage
  );
  
  setDescription(translatedDescription);
};
```

### Example 4: Translating Error Messages
```jsx
const handleError = async (error) => {
  const { translateDynamic } = useLanguage();
  const translatedError = await translateDynamic(error.message);
  Alert.alert('Error', translatedError);
};
```

## Performance Tips

1. **Use Static Translations for Common UI Elements**
   - Add frequently used texts to `LanguageContext.js` translations object
   - Static translations are instant and work offline

2. **Batch Translations**
   - Use `translateBatch()` for multiple texts to reduce API calls
   ```jsx
   const results = await translateBatch([text1, text2, text3], targetLang);
   ```

3. **Cache Translations**
   - Consider caching translated texts to avoid repeated API calls
   ```jsx
   const [cache, setCache] = useState({});
   
   const getCachedTranslation = async (text) => {
     if (cache[text]) return cache[text];
     const result = await translateText(text, currentLanguage);
     setCache(prev => ({ ...prev, [text]: result }));
     return result;
   };
   ```

4. **Lazy Loading**
   - Only translate visible content
   - Use `showLoader` prop to show loading states

## Adding New Static Translations

To add new static translations, edit `LanguageContext.js`:

```javascript
export const translations = {
  'en-US': {
    // Add your new keys here
    newKey: "New English Text",
  },
  'ta-IN': {
    newKey: "புதிய தமிழ் உரை",
  },
  // ... add for all languages
};
```

## Troubleshooting

### Translation not working?
1. Check internet connection (dynamic translation requires online access)
2. Verify language code is correct
3. Check console for error messages

### Slow translations?
1. Use static translations for common texts
2. Implement caching
3. Use batch translation for multiple texts

### Text not translating?
1. Ensure `TranslatorProvider` wraps your app in `App.jsx`
2. Check if the text is empty or undefined
3. Verify the target language is supported

## API Reference

### useTranslationService()
Returns:
- `translateText(text, targetLang, sourceLang)` - Translate single text
- `translateBatch(texts, targetLang, sourceLang)` - Translate multiple texts
- `isLoading` - Boolean indicating translation in progress
- `error` - Error object if translation fails

### TranslatedText Props
- `children` (string) - Text to translate
- `staticKey` (string) - Key for static translation fallback
- `style` (object) - Text styling
- `sourceLang` (string) - Source language code (default: 'en')
- `showLoader` (boolean) - Show loading indicator

### useLanguage()
Returns:
- `currentLanguage` - Current selected language
- `setCurrentLanguage(lang)` - Change language
- `t(key)` - Get static translation
- `translateDynamic(text, sourceLang)` - Translate text dynamically

## Notes
- The service uses Google Translate API which is free but has rate limits
- Static translations are preferred for better performance
- Always provide fallback text in case translation fails
- Test with different languages to ensure proper rendering
