import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Send, ChevronLeft, Bot } from 'lucide-react-native';
import { useLanguage } from './LanguageContext';

export default function AIChatbotScreen({ navigation }) {
  const { currentLanguage, translateDynamic, t } = useLanguage();
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const flatListRef = useRef(null);

  useEffect(() => {
    // Add welcome message
    addWelcomeMessage();
  }, [currentLanguage]);

  const addWelcomeMessage = async () => {
    const welcomeMsg = await translateDynamic(
      "Hello! I'm your financial assistant. Ask me anything about loans, schemes, or finances.",
      'en'
    );
    addMessage(welcomeMsg, 'bot');
  };

  const addMessage = (text, sender) => {
    setMessages((prev) => [...prev, { id: Date.now().toString(), text, sender }]);
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const handleSend = () => {
    if (inputText.trim()) {
      addMessage(inputText, 'user');
      processQuery(inputText);
      setInputText('');
    }
  };

  const processQuery = async (query) => {
    try {
      setIsLoading(true);
      
      // Translate query to English for processing if needed
      const englishQuery = currentLanguage === 'en-US' 
        ? query 
        : await translateDynamic(query, currentLanguage.split('-')[0]);
      
      console.log('Original query:', query);
      console.log('English query:', englishQuery);
      
      // Get response in English
      const englishResponse = getResponse(englishQuery);
      
      // Translate response back to user's language
      const response = currentLanguage === 'en-US'
        ? englishResponse
        : await translateDynamic(englishResponse, 'en');
      
      addMessage(response, 'bot');
      
    } catch (error) {
      console.error('Error processing query:', error);
      const fallbackMsg = await translateDynamic('Sorry, I encountered an error. Please try again.', 'en');
      addMessage(fallbackMsg, 'bot');
    } finally {
      setIsLoading(false);
    }
  };

  const getResponse = (query) => {
    const lowerQuery = query.toLowerCase();
    
    // Name
    if (lowerQuery.match(/\b(what is your name|your name|who are you|what are you called)\b/)) {
      return 'I am your financial assistant, here to help you with all your money matters. You can call me FinBot. How can I help you today?';
    }
    
    // Greetings
    if (lowerQuery.match(/\b(hello|hi|hey|good morning|good evening|namaste)\b/)) {
      return 'Hello! How can I assist you with your finances today?';
    }
    
    // Expenses
    if (lowerQuery.match(/\b(expense|spent|spending|cost|money spent)\b/)) {
      return 'I can help you track your expenses. You can view your spending history, add new expenses, and analyze your spending patterns in the expenses section of the app.';
    }
    
    // Budget
    if (lowerQuery.match(/\b(budget|save|saving|savings)\b/)) {
      return 'Managing your budget is important for financial health. You can set spending limits, track your savings goals, and get insights on where to cut costs in the budget section.';
    }
    
    // Loans
    if (lowerQuery.match(/\b(loan|borrow|credit|emi)\b/)) {
      return 'We offer various loan options including personal loans, home loans, and business loans. Interest rates start from 10 percent per annum. You can check your eligibility and apply directly through the app.';
    }
    
    // Investment
    if (lowerQuery.match(/\b(invest|investment|mutual fund|stock|share|fd|fixed deposit)\b/)) {
      return 'Investment options include mutual funds with 12 to 15 percent returns, fixed deposits with guaranteed 6 to 7 percent returns, government bonds, and gold. Each option has different risk and return profiles. Would you like to know more about any specific option?';
    }
    
    // Schemes
    if (lowerQuery.match(/\b(scheme|government scheme|subsidy|benefit)\b/)) {
      return 'There are several government schemes available for financial assistance, education, housing, and business. You can check your eligibility for schemes like Pradhan Mantri Awas Yojana, Mudra Loan, and others in the schemes section.';
    }
    
    // UPI/Payment
    if (lowerQuery.match(/\b(upi|payment|pay|transfer|send money)\b/)) {
      return 'You can make instant payments using UPI. Simply scan a QR code or enter the recipient\'s UPI ID. Payments are secure and instant. You can also practice UPI payments in our simulation section.';
    }
    
    // Account/Balance
    if (lowerQuery.match(/\b(account|balance|bank|statement)\b/)) {
      return 'You can check your account balance, view transaction history, and download statements from the accounts section. All your financial information is securely stored and easily accessible.';
    }
    
    // Help
    if (lowerQuery.match(/\b(help|what can you do|features|assist)\b/)) {
      return 'I can help you with tracking expenses, managing budgets, checking loan eligibility, exploring investment options, finding government schemes, making UPI payments, and answering financial questions. Just ask me anything!';
    }
    
    // Thank you
    if (lowerQuery.match(/\b(thank|thanks|appreciate)\b/)) {
      return 'You\'re welcome! I\'m here to help whenever you need financial assistance. Feel free to ask me anything else.';
    }
    
    // Default response
    return 'I understand. I can help you with expenses, budgets, loans, investments, government schemes, and payments. What would you like to know more about?';
  };

  const renderMessage = ({ item }) => {
    const isBot = item.sender === 'bot';
    return (
      <View style={[styles.messageBubble, isBot ? styles.botBubble : styles.userBubble]}>
        <Text style={[styles.messageText, isBot ? styles.botText : styles.userText]}>
          {item.text}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <ChevronLeft color="#1E293B" size={28} />
          </TouchableOpacity>
          <View style={styles.botIcon}>
            <Bot size={24} color="#FFF" />
          </View>
          <View style={styles.headerInfo}>
            <Text style={styles.headerTitle}>{t('aiChatBot')}</Text>
            <Text style={styles.headerSubtitle}>Online • Context Aware</Text>
          </View>
        </View>

        {/* Messages */}
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        />

        {/* Typing Indicator */}
        {isLoading && (
          <View style={styles.typingContainer}>
            <ActivityIndicator size="small" color="#666" />
            <Text style={styles.typingText}>{t('aiChatBot')} is typing...</Text>
          </View>
        )}

        {/* Input Container */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Ask about loans, schemes..."
            placeholderTextColor="#999"
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={500}
          />
          <TouchableOpacity 
            style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]} 
            onPress={handleSend}
            disabled={!inputText.trim()}
          >
            <Send size={20} color="#FFF" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  flex: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    elevation: 2,
  },
  backBtn: {
    padding: 4,
    marginRight: 8,
  },
  botIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#6C5CE7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerInfo: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#10B981',
    marginTop: 2,
  },
  listContent: {
    padding: 16,
    gap: 12,
  },
  messageBubble: {
    padding: 12,
    borderRadius: 16,
    maxWidth: '80%',
    marginBottom: 4,
  },
  botBubble: {
    backgroundColor: '#FFF',
    alignSelf: 'flex-start',
    borderTopLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  userBubble: {
    backgroundColor: '#6C5CE7',
    alignSelf: 'flex-end',
    borderTopRightRadius: 4,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 22,
  },
  botText: {
    color: '#1E293B',
  },
  userText: {
    color: '#FFF',
  },
  typingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    gap: 8,
  },
  typingText: {
    color: '#666',
    fontSize: 12,
    fontStyle: 'italic',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  input: {
    flex: 1,
    backgroundColor: '#F7F9FC',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
    color: '#1E293B',
    maxHeight: 100,
    marginRight: 8,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#6C5CE7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  micButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#1E293B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  micActive: {
    backgroundColor: '#EF4444',
  },
});
