import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Animated } from 'react-native';
import { Landmark, FileText, Bot, Gamepad2 } from 'lucide-react-native';
import { useLanguage } from './LanguageContext';

const Skeleton = ({ width, height, style }) => {
    const opacity = useRef(new Animated.Value(0.3)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(opacity, { toValue: 0.8, duration: 800, useNativeDriver: true }),
                Animated.timing(opacity, { toValue: 0.3, duration: 800, useNativeDriver: true }),
            ])
        ).start();
    }, [opacity]);

    return <Animated.View style={[{ width, height, backgroundColor: '#D1D5DB', borderRadius: 4, opacity }, style]} />;
};

export default function HomeScreen({ navigation }) {
    const { t, isTranslating } = useLanguage();

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return t('goodMorning') || 'Good Morning';
        if (hour < 17) return t('goodAfternoon') || 'Good Afternoon';
        if (hour < 21) return t('goodEvening') || 'Good Evening';
        return t('goodNight') || 'Good Night';
    };

    return (
        <View style={styles.container}>
            <View style={styles.content}>


                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                    {/* 4 Cards Grid */}
                    <View style={styles.gridContainer}>
                        <TouchableOpacity
                            style={styles.card}
                            onPress={() => navigation.navigate('GovtSchemes')}
                        >
                            <View style={styles.imagePlaceholder}>
                                {isTranslating ? (
                                    <Skeleton width={60} height={60} style={{ borderRadius: 30 }} />
                                ) : (
                                    <Landmark color="#1A1A1A" size={60} strokeWidth={1.5} />
                                )}
                            </View>
                            <View style={styles.cardBottomRow}>
                                <View style={styles.actionButton}>
                                    {isTranslating ? (
                                        <Skeleton width={100} height={16} />
                                    ) : (
                                        <Text style={styles.actionButtonText}>{t('govtSchemes') || 'Govt Schemes'}</Text>
                                    )}
                                </View>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.card}
                            onPress={() => navigation.navigate('LoanEligibility')}
                        >
                            <View style={styles.imagePlaceholder}>
                                {isTranslating ? (
                                    <Skeleton width={60} height={60} style={{ borderRadius: 30 }} />
                                ) : (
                                    <FileText color="#1A1A1A" size={60} strokeWidth={1.5} />
                                )}
                            </View>
                            <View style={styles.cardBottomRow}>
                                <View style={styles.actionButton}>
                                    {isTranslating ? (
                                        <Skeleton width={90} height={16} />
                                    ) : (
                                        <Text style={styles.actionButtonText}>{t('loanCheck') || 'Loan Check'}</Text>
                                    )}
                                </View>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.card}
                            onPress={() => navigation.navigate('AIChatbot')}
                        >
                            <View style={styles.imagePlaceholder}>
                                {isTranslating ? (
                                    <Skeleton width={60} height={60} style={{ borderRadius: 30 }} />
                                ) : (
                                    <Bot color="#1A1A1A" size={60} strokeWidth={1.5} />
                                )}
                            </View>
                            <View style={styles.cardBottomRow}>
                                <View style={styles.actionButton}>
                                    {isTranslating ? (
                                        <Skeleton width={80} height={16} />
                                    ) : (
                                        <Text style={styles.actionButtonText}>{t('aiChatBot') || 'AI ChatBot'}</Text>
                                    )}
                                </View>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.card}
                            onPress={() => navigation.navigate('Simulations')}
                        >
                            <View style={styles.imagePlaceholder}>
                                {isTranslating ? (
                                    <Skeleton width={60} height={60} style={{ borderRadius: 30 }} />
                                ) : (
                                    <Gamepad2 color="#1A1A1A" size={60} strokeWidth={1.5} />
                                )}
                            </View>
                            <View style={styles.cardBottomRow}>
                                <View style={styles.actionButton}>
                                    {isTranslating ? (
                                        <Skeleton width={90} height={16} />
                                    ) : (
                                        <Text style={styles.actionButtonText}>{t('simulations') || 'Simulations'}</Text>
                                    )}
                                </View>
                            </View>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    content: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        borderBottomLeftRadius: 40,
        borderBottomRightRadius: 40,
        paddingTop: 50,
    },
    header: {
        paddingHorizontal: 16,
        marginBottom: 20,
    },
    greeting: {
        fontSize: 16,
        color: '#666',
        marginBottom: 4,
    },
    userName: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#1A1A1A',
    },
    scrollContent: {
        paddingHorizontal: 16,
        paddingBottom: 40,
    },
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        rowGap: 16,
    },
    card: {
        width: '48%',
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.08,
        shadowRadius: 16,
        elevation: 5,
    },
    imagePlaceholder: {
        width: '100%',
        height: 140,
        backgroundColor: '#F3F4F6',
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    cardBottomRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 4,
        paddingBottom: 4,
    },
    actionButton: {
        backgroundColor: 'transparent',
        paddingVertical: 12,
        paddingHorizontal: 0,
        width: '100%',
        alignItems: 'center',
    },
    actionButtonText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#1A1A1A',
    },
});
