import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Mic, MicOff, ChevronLeft, Bot, Volume2 } from 'lucide-react-native';
import * as VoiceToText from '@ascendtis/react-native-voice-to-text';
import Tts from 'react-native-tts';
import { useLanguage } from './LanguageContext';

export default function VoiceAgentScreen({ navigation }) {
  const { currentLanguage, translateDynamic, t } = useLanguage();
  const [messages, setMessages] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const flatListRef = useRef(null);
  const isListeningRef = useRef(false);


  const getLanguageCodes = () => {
    const langMap = {
      'en-US': { tts: 'en-US', speech: 'en-US' },
      'hi-IN': { tts: 'hi-IN', speech: 'hi-IN' },
      'ta-IN': { tts: 'ta-IN', speech: 'ta-IN' },
      'te-IN': { tts: 'te-IN', speech: 'te-IN' },
      'kn-IN': { tts: 'kn-IN', speech: 'kn-IN' },
      'ml-IN': { tts: 'ml-IN', speech: 'ml-IN' },
      'mr-IN': { tts: 'mr-IN', speech: 'mr-IN' },
      'bn-IN': { tts: 'bn-IN', speech: 'bn-IN' },
    };
    return langMap[currentLanguage] || langMap['en-US'];
  };

  useEffect(() => {
    const codes = getLanguageCodes();


    Tts.setDefaultLanguage(codes.tts);
    Tts.setDefaultRate(0.5);
    Tts.setDefaultPitch(1.0);


    Tts.addEventListener('tts-start', () => setIsSpeaking(true));
    Tts.addEventListener('tts-finish', () => setIsSpeaking(false));
    Tts.addEventListener('tts-cancel', () => setIsSpeaking(false));


    const onResultsListener = VoiceToText.addEventListener('onSpeechResults', (event) => {
      console.log('Speech results received:', event);
      if (event && event.value && event.value.length > 0) {
        const finalText = event.value[event.value.length - 1];
        if (finalText && finalText.trim().length > 0) {
          console.log('Final text:', finalText);
          isListeningRef.current = false;
          setIsListening(false);
          onSpeechResults(finalText);
        }
      }
    });

    const onErrorListener = VoiceToText.addEventListener('onSpeechError', (event) => {
      console.log('Speech error:', event);
      isListeningRef.current = false;
      setIsListening(false);
    });

    const onEndListener = VoiceToText.addEventListener('onSpeechEnd', () => {
      console.log('Speech ended');
      setTimeout(() => {
        if (isListeningRef.current) {
          isListeningRef.current = false;
          setIsListening(false);
        }
      }, 500);
    });


    addWelcomeMessage();


    VoiceToText.setRecognitionLanguage(codes.speech).catch(console.error);

    return () => {
      Tts.stop();
      Tts.removeAllListeners('tts-start');
      Tts.removeAllListeners('tts-finish');
      Tts.removeAllListeners('tts-cancel');

      if (onResultsListener) onResultsListener.remove();
      if (onErrorListener) onErrorListener.remove();
      if (onEndListener) onEndListener.remove();

      VoiceToText.destroy().catch(console.error);
    };
  }, [currentLanguage]);

  const addWelcomeMessage = async () => {
    const welcomeMsg = await translateDynamic(
      "Hello! I'm your financial assistant. How can I help you today?",
      'en'
    );
    addMessage(welcomeMsg, 'bot');

    Tts.speak(welcomeMsg);
  };

  const onSpeechResults = async (text) => {
    if (text) {
      addMessage(text, 'user');
      await processQuery(text);
    }
  };

  const addMessage = (text, sender) => {
    setMessages((prev) => [...prev, { id: Date.now().toString(), text, sender }]);
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const handleMicPress = async () => {
    if (isListening) {
      await stopListening();
    } else {
      await startListening();
    }
  };

  const startListening = async () => {
    try {
      const available = await VoiceToText.isRecognitionAvailable();
      if (!available) {
        const errorMsg = await translateDynamic('Speech recognition is not available on this device.', 'en');
        addMessage(errorMsg, 'bot');
        Tts.speak(errorMsg);
        return;
      }

      if (isListeningRef.current) {
        await VoiceToText.stopListening();
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      console.log('Starting to listen...');
      isListeningRef.current = true;
      setIsListening(true);

      await VoiceToText.startListening();
      console.log('Listening started');


      setTimeout(async () => {
        if (isListeningRef.current) {
          await stopListening();
        }
      }, 10000);
    } catch (error) {
      console.error('Error starting voice recognition:', error);
      isListeningRef.current = false;
      setIsListening(false);
      const errorMsg = await translateDynamic('Could not start microphone. Please try again.', 'en');
      addMessage(errorMsg, 'bot');
      Tts.speak(errorMsg);
    }
  };

  const stopListening = async () => {
    try {
      console.log('Stopping listening...');
      isListeningRef.current = false;
      setIsListening(false);
      await VoiceToText.stopListening();
    } catch (error) {
      console.error('Error stopping voice recognition:', error);
    }
  };

  const processQuery = async (query) => {
    try {
      setIsLoading(true);


      const englishQuery = currentLanguage === 'en-US'
        ? query
        : await translateDynamic(query, currentLanguage.split('-')[0]);

      console.log('Original query:', query);
      console.log('English query:', englishQuery);


      const englishResponse = getResponse(englishQuery);


      const response = currentLanguage === 'en-US'
        ? englishResponse
        : await translateDynamic(englishResponse, 'en');

      addMessage(response, 'bot');


      Tts.speak(response);

    } catch (error) {
      console.error('Error processing query:', error);
      const fallbackMsg = await translateDynamic('Sorry, I encountered an error. Please try again.', 'en');
      addMessage(fallbackMsg, 'bot');
      Tts.speak(fallbackMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const getResponse = (query) => {
    const lowerQuery = query.toLowerCase();


    if (lowerQuery.match(/\b(what is your name|your name|who are you|what are you called)\b/)) {
      return 'I am your financial assistant, here to help you with all your money matters. You can call me FinBot. How can I help you today?';
    }


    if (lowerQuery.match(/\b(hello|hi|hey|good morning|good evening|namaste)\b/)) {
      return 'Hello! How can I assist you with your finances today?';
    }


    if (lowerQuery.match(/\b(expense|spent|spending|cost|money spent)\b/)) {
      return 'I can help you track your expenses. You can view your spending history, add new expenses, and analyze your spending patterns in the expenses section of the app.';
    }


    if (lowerQuery.match(/\b(budget|save|saving|savings)\b/)) {
      return 'Managing your budget is important for financial health. You can set spending limits, track your savings goals, and get insights on where to cut costs in the budget section.';
    }


    if (lowerQuery.match(/\b(loan|borrow|credit|emi)\b/)) {
      return 'We offer various loan options including personal loans, home loans, and business loans. Interest rates start from 10 percent per annum. You can check your eligibility and apply directly through the app.';
    }


    if (lowerQuery.match(/\b(invest|investment|mutual fund|stock|share|fd|fixed deposit)\b/)) {
      return 'Investment options include mutual funds with 12 to 15 percent returns, fixed deposits with guaranteed 6 to 7 percent returns, government bonds, and gold. Each option has different risk and return profiles. Would you like to know more about any specific option?';
    }


    if (lowerQuery.match(/\b(scheme|government scheme|subsidy|benefit)\b/)) {
      return 'There are several government schemes available for financial assistance, education, housing, and business. You can check your eligibility for schemes like Pradhan Mantri Awas Yojana, Mudra Loan, and others in the schemes section.';
    }


    if (lowerQuery.match(/\b(upi|payment|pay|transfer|send money)\b/)) {
      return 'You can make instant payments using UPI. Simply scan a QR code or enter the recipient\'s UPI ID. Payments are secure and instant. You can also practice UPI payments in our simulation section.';
    }


    if (lowerQuery.match(/\b(account|balance|bank|statement)\b/)) {
      return 'You can check your account balance, view transaction history, and download statements from the accounts section. All your financial information is securely stored and easily accessible.';
    }


    if (lowerQuery.match(/\b(help|what can you do|features|assist)\b/)) {
      return 'I can help you with tracking expenses, managing budgets, checking loan eligibility, exploring investment options, finding government schemes, making UPI payments, and answering financial questions. Just ask me anything!';
    }


    if (lowerQuery.match(/\b(thank|thanks|appreciate)\b/)) {
      return 'You\'re welcome! I\'m here to help whenever you need financial assistance. Feel free to ask me anything else.';
    }


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
      {}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ChevronLeft color="#1E293B" size={28} />
        </TouchableOpacity>
        <View style={styles.botIcon}>
          <Bot size={24} color="#FFF" />
        </View>
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle}>{t('aiAssistant')}</Text>
          <View style={styles.statusRow}>
            {isSpeaking && (
              <>
                <Volume2 size={12} color="#3B82F6" />
                <Text style={[styles.headerSubtitle, { color: '#3B82F6' }]}>Speaking...</Text>
              </>
            )}
            {isListening && (
              <>
                <View style={styles.listeningDot} />
                <Text style={[styles.headerSubtitle, { color: '#EF4444' }]}>{t('listening')}</Text>
              </>
            )}
            {!isSpeaking && !isListening && (
              <Text style={styles.headerSubtitle}>{t('active')}</Text>
            )}
          </View>
        </View>
      </View>

      {}
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Bot size={64} color="#CBD5E1" />
            <Text style={styles.emptyText}>{t('tapToSpeak')}</Text>
          </View>
        }
      />

      {}
      {isLoading && (
        <View style={styles.typingContainer}>
          <ActivityIndicator size="small" color="#666" />
          <Text style={styles.typingText}>{t('aiAssistant')} is thinking...</Text>
        </View>
      )}

      {}
      <View style={styles.controlContainer}>
        <Text style={styles.instructionText}>
          {isListening ? t('listening') + '...' : t('tapToSpeak')}
        </Text>
        <TouchableOpacity
          style={[styles.largeMicButton, isListening && styles.micActive]}
          onPress={handleMicPress}
          disabled={isSpeaking || isLoading}
        >
          {isListening ? (
            <MicOff size={40} color="#FFF" />
          ) : (
            <Mic size={40} color="#FFF" />
          )}
        </TouchableOpacity>
        {isListening && (
          <View style={styles.pulseRing} />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
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
    backgroundColor: '#3B82F6',
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
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
    gap: 4,
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#10B981',
  },
  listeningDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
  },
  listContent: {
    padding: 16,
    gap: 12,
    flexGrow: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#94A3B8',
    marginTop: 16,
    textAlign: 'center',
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
    backgroundColor: '#3B82F6',
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
  controlContainer: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  instructionText: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 16,
    textAlign: 'center',
  },
  largeMicButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  micActive: {
    backgroundColor: '#EF4444',
  },
  pulseRing: {
    position: 'absolute',
    bottom: 24,
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: '#EF4444',
    opacity: 0.5,
  },
});
