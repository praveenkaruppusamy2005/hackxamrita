import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import { ChevronLeft, Info, Mic, Shield, RefreshCw } from 'lucide-react-native';
import { useLanguage } from './LanguageContext';
import { PERMISSIONS, request, check, RESULTS } from 'react-native-permissions';

export default function VoiceRecognitionScreen({ navigation }) {
    const { t } = useLanguage();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const webViewRef = useRef(null);



    const agentId = 'pNInz6obpgH9P39Pue6S';
    const embedUrl = `https://elevenlabs.io/app/conversational-ai/${agentId}?embed=true`;

    useEffect(() => {
        checkPermissions();
    }, []);

    const checkPermissions = async () => {
        try {
            const status = await check(PERMISSIONS.ANDROID.RECORD_AUDIO);
            if (status !== RESULTS.GRANTED) {
                const result = await request(PERMISSIONS.ANDROID.RECORD_AUDIO);
                if (result !== RESULTS.GRANTED) {
                    setError('Microphone permission is required for the voice assistant.');
                }
            }
        } catch (err) {
            console.error('Permission check failed:', err);
        }
    };

    const handleReload = () => {
        setLoading(true);
        setError(null);
        webViewRef.current?.reload();
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <Text style={styles.headerTitle}>AI Assistant</Text>
                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>HD VOICE</Text>
                    </View>
                </View>
                <TouchableOpacity onPress={handleReload} style={styles.reloadBtn}>
                    <RefreshCw size={20} color="#6B7280" />
                </TouchableOpacity>
            </View>

            <View style={styles.content}>
                {error ? (
                    <View style={styles.errorContainer}>
                        <Shield size={48} color="#EF4444" />
                        <Text style={styles.errorTitle}>Permission Blocked</Text>
                        <Text style={styles.errorText}>{error}</Text>
                        <TouchableOpacity
                            style={styles.actionBtn}
                            onPress={() => Linking.openSettings()}
                        >
                            <Text style={styles.actionBtnText}>Open Settings</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <>
                        {loading && (
                            <View style={styles.loader}>
                                <ActivityIndicator size="large" color="#2563EB" />
                                <Text style={styles.loadingText}>Initializing ElevenLabs Agent...</Text>
                            </View>
                        )}
                        <WebView
                            ref={webViewRef}
                            source={{ uri: embedUrl }}
                            style={[styles.webview, loading && { height: 0, opacity: 0 }]}
                            onLoadEnd={() => setLoading(false)}
                            allowsInlineMediaPlayback={true}
                            mediaPlaybackRequiresUserAction={false}
                            originWhitelist={['*']}
                            javaScriptEnabled={true}
                            domStorageEnabled={true}
                            onError={(syntheticEvent) => {
                                const { nativeEvent } = syntheticEvent;
                                console.warn('WebView error: ', nativeEvent);
                                setError('Failed to load the voice agent. Please check your connection.');
                            }}
                        />
                    </>
                )}
            </View>

            <View style={styles.footer}>
                <Info size={16} color="#9CA3AF" />
                <Text style={styles.footerText}>
                    Powered by ElevenLabs Conversational AI
                </Text>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFFFFF' },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 24,
        paddingTop: 20,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: '800',
        color: '#111827',
    },
    badge: {
        backgroundColor: '#EEF2FF',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: '#E0E7FF',
    },
    badgeText: {
        fontSize: 10,
        fontWeight: '800',
        color: '#4F46E5',
    },
    reloadBtn: {
        padding: 8,
        backgroundColor: '#F9FAFB',
        borderRadius: 10,
    },
    content: { flex: 1 },
    webview: { flex: 1 },
    loader: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        zIndex: 10,
    },
    loadingText: {
        marginTop: 16,
        fontSize: 14,
        color: '#6B7280',
        fontWeight: '500',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
    },
    errorTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#111827',
        marginTop: 20,
        marginBottom: 8,
    },
    errorText: {
        fontSize: 15,
        color: '#6B7280',
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 32,
    },
    actionBtn: {
        backgroundColor: '#111827',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 12,
    },
    actionBtnText: {
        color: '#FFFFFF',
        fontWeight: '600',
        fontSize: 16,
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        paddingVertical: 16,
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
    },
    footerText: {
        fontSize: 12,
        color: '#9CA3AF',
        fontWeight: '500',
    }
});
