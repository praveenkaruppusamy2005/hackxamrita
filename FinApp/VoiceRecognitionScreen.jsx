import React, { useEffect, useState, useRef } from 'react';
import { View, Text, PermissionsAndroid, Platform, Alert, TouchableOpacity, StyleSheet, ScrollView, Image, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Mic, MicOff, Volume2 } from 'lucide-react-native';
import {
    addEventListener,
    startListening,
    stopListening,
    destroy,
    setRecognitionLanguage
} from '@ascendtis/react-native-voice-to-text';
import Tts from 'react-native-tts';
import { useLanguage } from './LanguageContext';
import VoiceAssistantService from './services/VoiceAssistantService';

const LANGS = [
    { tag: 'en-US', label: 'English', flag: '🇺🇸', placeholder: 'Say something...' },
    { tag: 'ta-IN', label: 'தமிழ்', flag: '🇮🇳', placeholder: 'ஏதாவது சொல்லுங்கள்...' },
    { tag: 'hi-IN', label: 'हिन्दी', flag: '🇮🇳', placeholder: 'कुछ कहो...' },
    { tag: 'te-IN', label: 'తెలుగు', flag: '🇮🇳', placeholder: 'ఏదైనా చెప్పండి...' },
];
export default function VoiceRecognitionScreen() {
    const { currentLanguage, t, translateDynamic } = useLanguage();
    const [results, setResults] = useState('');
    const [isListening, setIsListening] = useState(false);
    const [assistantResponse, setAssistantResponse] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [conversationHistory, setConversationHistory] = useState([]);
    const [continuousMode, setContinuousMode] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const scrollViewRef = useRef();
    const silenceTimerRef = useRef(null);
    const lastResultRef = useRef('');

    // Initialize TTS
    useEffect(() => {
        const init = async () => {
            try {
                await Tts.getInitStatus();
                Tts.setDefaultRate(0.5);
                Tts.setDefaultPitch(1.0);

                // On some Android devices, requesting audio focus helps
                if (Platform.OS === 'android') {
                    Tts.setIgnoreSilentSwitch('ignore');
                }
            } catch (err) {
                if (err.code === 'no_engine') {
                    Tts.requestInstallEngine();
                }
            }
        };

        init();

        const ttsStart = Tts.addEventListener('tts-start', () => {
            console.log("TTS Start");
            setIsSpeaking(true);
        });

        const ttsFinish = Tts.addEventListener('tts-finish', () => {
            console.log("TTS Finish");
            setIsSpeaking(false);

            // Auto-restart listening in continuous mode
            if (continuousMode && !isListening) {
                setTimeout(() => {
                    restartListening();
                }, 500);
            }
        });

        const ttsCancel = Tts.addEventListener('tts-cancel', () => {
            console.log("TTS Cancel");
            setIsSpeaking(false);
        });

        return () => {
            Tts.stop();
            ttsStart.remove();
            ttsFinish.remove();
            ttsCancel.remove();
        };
    }, [continuousMode, isListening]);

    // Sync TTS language and greet user
    useEffect(() => {
        let isMounted = true;
        const lang = currentLanguage.replace('-', '_');

        const initTts = async () => {
            try {
                await Tts.getInitStatus();
                await Tts.setDefaultLanguage(lang);

                if (!isMounted) return;

                // Wait a bit for the language to apply
                setTimeout(() => {
                    if (isMounted) {
                        const greeting = t('assistGreeting') || 'Hello! How can I assist you today?';
                        Tts.stop();
                        Tts.speak(greeting);
                    }
                }, 800);

            } catch (err) {
                console.log('TTS init error:', err);
                if (isMounted) {
                    Tts.speak(t('assistGreeting') || 'Hello! How can I assist you today?');
                }
            }
        };

        initTts();
        return () => { isMounted = false; };
    }, [currentLanguage]);

    // 🎤 Request Microphone Permission
    const requestMicPermission = async () => {
        if (Platform.OS === 'android') {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
                    {
                        title: 'Microphone Permission',
                        message: 'This app needs access to your microphone',
                        buttonPositive: 'OK',
                        buttonNegative: 'Cancel',
                        buttonNeutral: 'Ask Me Later',
                    }
                );

                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    return true;
                } else {
                    Alert.alert('Permission Denied', 'Microphone permission is required');
                    return false;
                }
            } catch (err) {
                console.warn(err);
                return false;
            }
        }
        return true;
    };

    useEffect(() => {
        const resultsListener = addEventListener('onSpeechResults', (event) => {
            const result = event.value || '';
            setResults(result);
            lastResultRef.current = result;

            // Clear any existing silence timer
            if (silenceTimerRef.current) {
                clearTimeout(silenceTimerRef.current);
            }
        });

        const partialResultsListener = addEventListener('onSpeechPartialResults', (event) => {
            const partial = event.value || '';
            setResults(partial);

            // Reset silence timer on partial results
            if (silenceTimerRef.current) {
                clearTimeout(silenceTimerRef.current);
            }

            // Set timer to detect when user stops speaking (2 seconds of silence)
            silenceTimerRef.current = setTimeout(() => {
                if (isListening && partial) {
                    stopListening();
                }
            }, 2000);
        });

        const startListener = addEventListener('onSpeechStart', () => {
            setIsListening(true);
            setResults('Listening...');
            lastResultRef.current = '';
        });

        const endListener = addEventListener('onSpeechEnd', () => {
            setIsListening(false);
            if (silenceTimerRef.current) {
                clearTimeout(silenceTimerRef.current);
            }
        });

        const errorListener = addEventListener('onSpeechError', (error) => {
            console.log('Speech Error:', error);
            setIsListening(false);

            // Auto-restart in continuous mode
            if (continuousMode && !isSpeaking) {
                setTimeout(() => {
                    restartListening();
                }, 1000);
            }
        });

        return () => {
            destroy();
            if (silenceTimerRef.current) {
                clearTimeout(silenceTimerRef.current);
            }
            resultsListener.remove();
            partialResultsListener.remove();
            startListener.remove();
            endListener.remove();
            errorListener.remove();
        };
    }, [continuousMode, isSpeaking, isListening]);

    useEffect(() => {
        destroy().then(() => {
            setRecognitionLanguage(currentLanguage).catch(err => {
                console.warn('Failed to set recognition language:', err);
            });
        });
    }, [currentLanguage]);

    useEffect(() => {
        if (!isListening && results && results !== 'Listening...') {
            processUserAudio(results);
        }
    }, [isListening]);

    const translateToEnglish = async (text, langCode) => {
        try {
            if (langCode === 'en' || langCode === 'en-US') return text;
            const backendUrl = 'http://localhost:3000';
            const response = await fetch(`${backendUrl}/api/translate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    text,
                    sourceLanguageCode: langCode.split('-')[0],
                    targetLanguageCode: 'en'
                }),
            });
            const data = await response.json();
            return data.translatedText || text;
        } catch (error) {
            console.error('Translation to English failed:', error);
            return text;
        }
    };

    const processUserAudio = async (recordedText) => {
        if (!recordedText || recordedText === 'Listening...') return;

        setIsProcessing(true);
        const langCode = currentLanguage.split('-')[0];

        // Add user message to history immediately
        const userMessage = { role: 'user', text: recordedText, timestamp: Date.now() };
        setConversationHistory(prev => [...prev, userMessage]);

        try {
            // Translate user's speech to English for the AI engine
            const englishUserText = await translateToEnglish(recordedText, currentLanguage);
            console.log("User said (en): ", englishUserText);

            // Fetch user profile for context-aware responses
            const mobileNumber = await AsyncStorage.getItem('userMobile');
            let userProfile = null;

            if (mobileNumber) {
                try {
                    const backendUrl = 'http://localhost:3000';
                    const profileResponse = await fetch(`${backendUrl}/api/user-profile/${mobileNumber}`);
                    if (profileResponse.ok) {
                        userProfile = await profileResponse.json();
                    }
                } catch (err) {
                    console.log('Could not fetch user profile:', err);
                }
            }

            // Try backend AI first, fallback to local Gemini
            let englishReply;
            try {
                const backendUrl = 'http://localhost:3000';
                const aiResponse = await fetch(`${backendUrl}/api/ai-chat`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        query: englishUserText,
                        mobileNumber: mobileNumber,
                        conversationHistory: conversationHistory.map(msg => ({
                            role: msg.role,
                            text: msg.text
                        }))
                    }),
                    timeout: 5000
                });

                const aiData = await aiResponse.json();
                englishReply = aiData.response || aiData.error;
            } catch (backendError) {
                console.log('Backend unavailable, using local AI:', backendError);
                // Fallback to local Gemini AI
                englishReply = await VoiceAssistantService.getResponse(englishUserText, userProfile);
            }

            if (!englishReply) {
                englishReply = "I'm sorry, I couldn't process that. Could you try again?";
            }

            // Translate AI reply back to user's language
            const localizedReply = await translateDynamic(englishReply, 'en');

            setIsProcessing(false);
            setAssistantResponse(localizedReply);

            // Add assistant response to history
            const assistantMessage = { role: 'assistant', text: localizedReply, timestamp: Date.now() };
            setConversationHistory(prev => [...prev, assistantMessage]);

            // 🔊 Speak the response
            Tts.stop();
            Tts.speak(localizedReply);

            // Scroll to bottom after response
            setTimeout(() => {
                scrollViewRef.current?.scrollToEnd({ animated: true });
            }, 100);

        } catch (error) {
            console.error('AI Processing Failed:', error);
            setIsProcessing(false);
            const errorMsg = "I'm having trouble right now. Please try again.";
            setAssistantResponse(errorMsg);

            const assistantMessage = { role: 'assistant', text: errorMsg, timestamp: Date.now() };
            setConversationHistory(prev => [...prev, assistantMessage]);

            Tts.speak(errorMsg);
        }
    };

    const restartListening = async () => {
        if (isSpeaking || isProcessing) return;

        try {
            const hasPermission = await requestMicPermission();
            if (!hasPermission) return;

            await startListening();
        } catch (error) {
            console.error('Restart listening error:', error);

            // Disable continuous mode if voice recognition fails
            if (error.message && error.message.includes('not available')) {
                setContinuousMode(false);
            }
        }
    };

    const toggleListening = async () => {
        try {
            if (isListening) {
                await stopListening();
                setContinuousMode(false);
            } else {
                Tts.stop();
                setResults('');
                const hasPermission = await requestMicPermission();
                if (!hasPermission) return;

                await startListening();
            }
        } catch (error) {
            console.error('Toggle Error:', error);

            // Show user-friendly error message
            if (error.message && error.message.includes('not available')) {
                Alert.alert(
                    'Voice Recognition Unavailable',
                    'Speech recognition is not available on this device. This feature requires:\n\n' +
                    '• A physical Android device (not emulator)\n' +
                    '• Google app installed and updated\n' +
                    '• Internet connection\n\n' +
                    'Please try on a real device.',
                    [{ text: 'OK' }]
                );
            }
        }
    };

    const toggleContinuousMode = async () => {
        const newMode = !continuousMode;
        setContinuousMode(newMode);

        if (newMode && !isListening && !isSpeaking) {
            // Start listening when continuous mode is enabled
            await toggleListening();
        } else if (!newMode && isListening) {
            // Stop listening when continuous mode is disabled
            await stopListening();
        }
    };

    const clearConversation = () => {
        setConversationHistory([]);
        setAssistantResponse('');
        setResults('');
        VoiceAssistantService.clearHistory();

        // Speak confirmation
        const clearMsg = t('conversationCleared') || 'Conversation cleared. How can I help you?';
        Tts.speak(clearMsg);
    };
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <Text style={styles.headerTitle}>{t('aiAssistant')}</Text>
                    <Text style={styles.headerSubtitle}>{t('aiHelp')}</Text>
                </View>
                <View style={styles.headerRight}>
                    {conversationHistory.length > 0 && (
                        <TouchableOpacity onPress={clearConversation} style={styles.clearButton}>
                            <Text style={styles.clearButtonText}>Clear</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            {/* Continuous Mode Toggle */}
            <View style={styles.continuousModeContainer}>
                <View style={styles.continuousModeLeft}>
                    <Volume2 color="#2563EB" size={20} />
                    <Text style={styles.continuousModeLabel}>
                        {t('continuousMode') || 'Continuous Listening'}
                    </Text>
                </View>
                <Switch
                    value={continuousMode}
                    onValueChange={toggleContinuousMode}
                    trackColor={{ false: '#D1D5DB', true: '#93C5FD' }}
                    thumbColor={continuousMode ? '#2563EB' : '#F3F4F6'}
                />
            </View>

            <ScrollView
                ref={scrollViewRef}
                style={styles.chatSection}
                contentContainerStyle={styles.chatContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Initial Greeting */}
                {conversationHistory.length === 0 && !isProcessing && (
                    <View style={styles.assistantRow}>
                        <View style={styles.assistantBubble}>
                            <Text style={styles.assistantText}>
                                {t('assistGreeting') || 'Hello! How can I assist you today?'}
                            </Text>
                        </View>
                    </View>
                )}

                {/* Conversation History */}
                {conversationHistory.map((message, index) => (
                    <View
                        key={`${message.timestamp}-${index}`}
                        style={message.role === 'assistant' ? styles.assistantRow : styles.userRow}
                    >
                        <View style={message.role === 'assistant' ? styles.assistantBubble : styles.userBubble}>
                            <Text style={message.role === 'assistant' ? styles.assistantText : styles.userText}>
                                {message.text}
                            </Text>
                        </View>
                    </View>
                ))}

                {/* Current Listening/Processing State */}
                {isListening && (
                    <View style={styles.userRow}>
                        <View style={[styles.userBubble, styles.listeningBubble]}>
                            <Text style={styles.userText}>
                                {results || (t('listening') || 'Listening...')}
                            </Text>
                        </View>
                    </View>
                )}

                {isProcessing && (
                    <View style={styles.assistantRow}>
                        <View style={[styles.assistantBubble, styles.processingBubble]}>
                            <Text style={styles.assistantText}>
                                {t('analyzingProfile') || 'Processing...'}
                            </Text>
                        </View>
                    </View>
                )}
            </ScrollView>

            <View style={styles.footer}>
                <View style={styles.micButtonContainer}>
                    <TouchableOpacity
                        style={[
                            styles.micButton,
                            isListening && styles.micButtonActive
                        ]}
                        onPress={toggleListening}
                        disabled={isProcessing}
                    >
                        {isListening ? (
                            <MicOff color="#fff" size={36} strokeWidth={2} />
                        ) : (
                            <Mic color="#fff" size={36} strokeWidth={2} />
                        )}
                    </TouchableOpacity>
                    <Text style={styles.micStatusText}>
                        {isListening ? t('tapToStop') : t('tapToSpeak')}
                    </Text>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingTop: 40,
        paddingBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    headerLeft: {
        flex: 1,
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: '900',
        color: '#1A1A1A',
        marginBottom: 4,
    },
    headerSubtitle: {
        fontSize: 14,
        color: '#666',
        fontWeight: '500',
    },
    clearButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: '#F3F4F6',
        borderRadius: 8,
    },
    clearButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#6B7280',
    },
    continuousModeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingVertical: 16,
        backgroundColor: '#F9FAFB',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    continuousModeLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    continuousModeLabel: {
        fontSize: 15,
        fontWeight: '600',
        color: '#374151',
    },
    chatSection: {
        flex: 1,
    },
    chatContent: {
        paddingHorizontal: 24,
        paddingTop: 20,
        paddingBottom: 20,
    },
    assistantRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 16,
        justifyContent: 'flex-start',
    },
    userRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 16,
        justifyContent: 'flex-end',
    },
    assistantBubble: {
        backgroundColor: '#F3F4F6',
        paddingHorizontal: 18,
        paddingVertical: 12,
        borderRadius: 18,
        borderTopLeftRadius: 4,
        maxWidth: '85%',
    },
    processingBubble: {
        backgroundColor: '#EFF6FF',
        borderWidth: 1,
        borderColor: '#BFDBFE',
    },
    assistantText: {
        fontSize: 16,
        color: '#1F2937',
        lineHeight: 22,
    },
    userBubble: {
        backgroundColor: '#2563EB',
        paddingHorizontal: 18,
        paddingVertical: 12,
        borderRadius: 18,
        borderBottomRightRadius: 4,
        maxWidth: '85%',
    },
    listeningBubble: {
        backgroundColor: '#3B82F6',
        opacity: 0.9,
    },
    userText: {
        fontSize: 16,
        color: '#FFFFFF',
        lineHeight: 22,
    },
    footer: {
        paddingBottom: 40,
        paddingTop: 20,
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
    },
    micButtonContainer: {
        alignItems: 'center',
    },
    micButton: {
        width: 72,
        height: 72,
        borderRadius: 36,
        backgroundColor: '#1A1A1A',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 16,
        elevation: 8,
        marginBottom: 12,
    },
    micButtonActive: {
        backgroundColor: '#EF4444',
        shadowColor: '#EF4444',
        shadowOpacity: 0.4,
    },
    micStatusText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#6B7280',
    }
});
