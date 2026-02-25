import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TextInput, 
  TouchableOpacity,
  ActivityIndicator 
} from 'react-native';
import { useLanguage } from './LanguageContext';
import { useTranslationService } from './services/TranslationService';
import TranslatedText from './components/TranslatedText';

/**
 * Translation Demo Screen
 * Shows practical examples of using the translation service
 */
export default function TranslationDemoScreen() {
  const { currentLanguage, translateDynamic } = useLanguage();
  const { translateText, isLoading } = useTranslationService();
  
  const [userInput, setUserInput] = useState('');
  const [translatedOutput, setTranslatedOutput] = useState('');

  const handleTranslate = async () => {
    if (!userInput.trim()) return;
    const result = await translateDynamic(userInput);
    setTranslatedOutput(result);
  };

  // Sample dynamic content that would come from API
  const notifications = [
    "Your loan application has been approved",
    "Please submit your documents by tomorrow",
    "New government scheme available for farmers"
  ];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.mainTitle}>Translation Service Demo</Text>
      <Text style={styles.subtitle}>Current Language: {currentLanguage}</Text>

      {/* Section 1: Auto-Translated Static Text */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>1. Auto-Translated UI Text</Text>
        <View style={styles.card}>
          <TranslatedText style={styles.cardText}>
            Welcome to our Financial Services App
          </TranslatedText>
          <TranslatedText style={styles.cardText}>
            We provide loans, schemes, and financial assistance
          </TranslatedText>
          <TranslatedText style={styles.cardText}>
            Available 24/7 for your convenience
          </TranslatedText>
        </View>
      </View>

      {/* Section 2: Form Labels */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>2. Translated Form Labels</Text>
        <View style={styles.card}>
          <TranslatedText style={styles.label}>Full Name</TranslatedText>
          <TextInput 
            style={styles.input} 
            placeholder="Enter your name" 
          />
          
          <TranslatedText style={styles.label}>Email Address</TranslatedText>
          <TextInput 
            style={styles.input} 
            placeholder="Enter your email" 
          />
          
          <TranslatedText style={styles.label}>Phone Number</TranslatedText>
          <TextInput 
            style={styles.input} 
            placeholder="Enter your phone" 
          />
        </View>
      </View>

      {/* Section 3: Dynamic Content (Notifications) */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>3. Dynamic Notifications</Text>
        {notifications.map((notification, index) => (
          <View key={index} style={styles.notificationCard}>
            <TranslatedText style={styles.notificationText}>
              {notification}
            </TranslatedText>
          </View>
        ))}
      </View>

      {/* Section 4: User Input Translation */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>4. Translate Your Text</Text>
        <View style={styles.card}>
          <Text style={styles.label}>Enter text in English:</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Type something..."
            value={userInput}
            onChangeText={setUserInput}
            multiline
            numberOfLines={3}
          />
          
          <TouchableOpacity 
            style={styles.translateButton}
            onPress={handleTranslate}
            disabled={isLoading || !userInput.trim()}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.translateButtonText}>Translate</Text>
            )}
          </TouchableOpacity>

          {translatedOutput ? (
            <View style={styles.outputBox}>
              <Text style={styles.outputLabel}>Translation:</Text>
              <Text style={styles.outputText}>{translatedOutput}</Text>
            </View>
          ) : null}
        </View>
      </View>

      {/* Section 5: Common Messages */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>5. Common Messages</Text>
        <View style={styles.messageContainer}>
          <View style={styles.messageCard}>
            <TranslatedText style={styles.messageText}>
              Thank you for your application
            </TranslatedText>
          </View>
          <View style={styles.messageCard}>
            <TranslatedText style={styles.messageText}>
              Your request is being processed
            </TranslatedText>
          </View>
          <View style={styles.messageCard}>
            <TranslatedText style={styles.messageText}>
              Please verify your identity
            </TranslatedText>
          </View>
          <View style={styles.messageCard}>
            <TranslatedText style={styles.messageText}>
              Documents uploaded successfully
            </TranslatedText>
          </View>
        </View>
      </View>

      {/* Section 6: Instructions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>6. Step-by-Step Instructions</Text>
        <View style={styles.card}>
          <TranslatedText style={styles.stepText}>
            Step 1: Fill out the application form
          </TranslatedText>
          <TranslatedText style={styles.stepText}>
            Step 2: Upload required documents
          </TranslatedText>
          <TranslatedText style={styles.stepText}>
            Step 3: Submit for verification
          </TranslatedText>
          <TranslatedText style={styles.stepText}>
            Step 4: Wait for approval notification
          </TranslatedText>
        </View>
      </View>

      <View style={styles.footer}>
        <TranslatedText style={styles.footerText}>
          All text on this screen is automatically translated
        </TranslatedText>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 5,
    color: '#1A1A1A',
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
    color: '#666',
  },
  section: {
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardText: {
    fontSize: 14,
    marginBottom: 10,
    color: '#555',
    lineHeight: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
    marginTop: 10,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
    backgroundColor: '#fafafa',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  translateButton: {
    backgroundColor: '#387c2c',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    marginTop: 12,
  },
  translateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  outputBox: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#e8f5e9',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#387c2c',
  },
  outputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#387c2c',
    marginBottom: 6,
  },
  outputText: {
    fontSize: 14,
    color: '#1A1A1A',
    lineHeight: 20,
  },
  notificationCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#387c2c',
  },
  notificationText: {
    fontSize: 14,
    color: '#333',
  },
  messageContainer: {
    gap: 8,
  },
  messageCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  messageText: {
    fontSize: 14,
    color: '#555',
  },
  stepText: {
    fontSize: 14,
    marginBottom: 12,
    color: '#555',
    lineHeight: 20,
  },
  footer: {
    padding: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
    textAlign: 'center',
  },
});
