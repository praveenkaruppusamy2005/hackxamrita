# How to Use Translation in Your App

## ✅ Setup Complete!

Your app is already configured with:
- ✅ `@kan9229/react-native-translator` package installed
- ✅ `TranslatorProvider` wrapping your app
- ✅ Translation service ready to use

## 🚀 Start Using It Right Now!

### Option 1: Update Existing Screens (Recommended)

Pick any screen and replace `<Text>` with `<TranslatedText>`:

#### Example: Update ProfileScreen.jsx

```jsx
// Add this import at the top
import TranslatedText from './components/TranslatedText';

// Replace any <Text> component
// Before:
<Text style={styles.title}>My Profile</Text>

// After:
<TranslatedText style={styles.title}>My Profile</TranslatedText>
```

### Option 2: Add Translation Demo to Navigation

Add the demo screen to see all features in action:

#### Update MainTabs.jsx or your navigation file:

```jsx
import TranslationDemoScreen from './TranslationDemoScreen';

// Add a new tab or screen
<Tab.Screen 
  name="TranslationDemo" 
  component={TranslationDemoScreen}
  options={{ title: 'Translation Demo' }}
/>
```

### Option 3: Translate Dynamic Content

For content from APIs or user input:

```jsx
import { useLanguage } from './LanguageContext';

function MyComponent() {
  const { translateDynamic } = useLanguage();
  const [message, setMessage] = useState('');

  const loadData = async () => {
    // Get data from API
    const response = await fetch('https://api.example.com/message');
    const data = await response.json();
    
    // Translate it
    const translated = await translateDynamic(data.message);
    setMessage(translated);
  };

  return <Text>{message}</Text>;
}
```

## 📝 Common Use Cases

### 1. Form Labels
```jsx
<View>
  <TranslatedText style={styles.label}>Full Name</TranslatedText>
  <TextInput />
  
  <TranslatedText style={styles.label}>Email</TranslatedText>
  <TextInput />
</View>
```

### 2. Buttons
```jsx
<TouchableOpacity style={styles.button}>
  <TranslatedText style={styles.buttonText}>
    Submit Application
  </TranslatedText>
</TouchableOpacity>
```

### 3. Notifications/Alerts
```jsx
const notifications = [
  "Your application is approved",
  "Please upload documents",
  "Payment received"
];

return (
  <FlatList
    data={notifications}
    renderItem={({ item }) => (
      <TranslatedText style={styles.notification}>
        {item}
      </TranslatedText>
    )}
  />
);
```

### 4. Error Messages
```jsx
import { useLanguage } from './LanguageContext';

const handleError = async (error) => {
  const { translateDynamic } = useLanguage();
  const translatedError = await translateDynamic(error.message);
  Alert.alert('Error', translatedError);
};
```

### 5. Instructions/Help Text
```jsx
<View>
  <TranslatedText style={styles.instruction}>
    Step 1: Fill out the form completely
  </TranslatedText>
  <TranslatedText style={styles.instruction}>
    Step 2: Upload required documents
  </TranslatedText>
  <TranslatedText style={styles.instruction}>
    Step 3: Submit for review
  </TranslatedText>
</View>
```

## 🎯 Quick Reference

### Import Statements
```jsx
// For component-based translation
import TranslatedText from './components/TranslatedText';

// For programmatic translation
import { useLanguage } from './LanguageContext';
import { useTranslationService } from './services/TranslationService';
```

### Basic Usage
```jsx
// Simple text translation
<TranslatedText>Hello World</TranslatedText>

// With styling
<TranslatedText style={styles.heading}>Welcome</TranslatedText>

// With static key fallback
<TranslatedText staticKey="greeting">Good Morning</TranslatedText>
```

### Programmatic Translation
```jsx
const { translateDynamic } = useLanguage();

// Translate any text
const result = await translateDynamic("Your text here");
```

## 🔧 Files Created

1. **services/TranslationService.js** - Core translation logic
2. **components/TranslatedText.jsx** - React component for easy translation
3. **examples/TranslationExamples.jsx** - Comprehensive examples
4. **TranslationDemoScreen.jsx** - Interactive demo screen
5. **TRANSLATION_GUIDE.md** - Full documentation
6. **TRANSLATION_QUICKSTART.md** - Quick start guide

## 🎨 Example: Update Your Home Screen

Here's how to add translation to your existing Home.jsx:

```jsx
// Add import
import TranslatedText from './components/TranslatedText';

// Replace static text (keep t() for existing translations)
// Add new dynamic text:
<TranslatedText style={styles.description}>
  Explore government schemes and financial services
</TranslatedText>

<TranslatedText style={styles.helpText}>
  Need help? Our AI assistant is available 24/7
</TranslatedText>
```

## 🌟 Pro Tips

1. **Keep using `t()` for existing static translations** - They're faster!
2. **Use `<TranslatedText>` for new content** - Easier to maintain
3. **Use `translateDynamic()` for API responses** - Dynamic content
4. **Test with different languages** - Change language in app to see translations

## 🚦 Next Steps

1. Pick one screen to update (start small!)
2. Replace 2-3 `<Text>` components with `<TranslatedText>`
3. Change language in app and see the magic!
4. Gradually update more screens

## 💡 Need Help?

- Check `TRANSLATION_GUIDE.md` for detailed API docs
- Look at `TranslationDemoScreen.jsx` for working examples
- Review `examples/TranslationExamples.jsx` for more patterns

## 🎉 That's It!

You now have a powerful, free translation system in your app. Start small, test often, and gradually add translation to more components!
