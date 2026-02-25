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
        if (hour < 12) return t('goodMorning');
        if (hour < 17) return t('goodAfternoon');
        if (hour < 21) return t('goodEvening');
        return t('goodNight');
    };

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <View style={styles.header}>
                    {isTranslating ? (
                        <Skeleton width={120} height={20} style={{ marginBottom: 4 }} />
                    ) : (
                        <Text style={styles.greeting}>{getGreeting()}</Text>
                    )}
                    <Text style={styles.userName}>Praveen</Text>
                </View>

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
                                        <Text style={styles.actionButtonText}>{t('govtSchemes')}</Text>
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
                                        <Text style={styles.actionButtonText}>{t('loanCheck')}</Text>
                                    )}
                                </View>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.card}>
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
                                        <Text style={styles.actionButtonText}>{t('aiChatBot')}</Text>
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
                                        <Text style={styles.actionButtonText}>{t('simulations')}</Text>
                                    )}
                                </View>
                            </View>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>

            <TouchableOpacity
                style={styles.floatingButton}
                onPress={() => navigation.navigate('IRInteraction')}
            >
                {/* <Image source={require('./Assets/person1.jpg')} style={styles.floatingImage} /> */}
            </TouchableOpacity>
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
        paddingTop: 50, // Added padding for the top
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
    cardTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1A1A1A',
        marginBottom: 10,
        paddingHorizontal: 4,
    },
    cardBottomRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 4,
        paddingBottom: 4,
    },
    subLabel: {
        fontSize: 11,
        color: '#888',
        marginBottom: 2,
    },
    cardValue: {
        fontSize: 14,
        fontWeight: '900',
        color: '#387c2c', // Green color
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
    floatingButton: {
        position: 'absolute',
        bottom: 10,
        right: 24,
        zIndex: 100,
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: '#fff',
        overflow: 'hidden',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 15,
    },
    floatingImage: {
        width: 70,
        height: 70,
        borderRadius: 35,
        transform: [{ scale: 1 }, { translateY: 4 }],
    }
});
