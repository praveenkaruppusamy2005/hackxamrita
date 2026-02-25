import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { Smartphone, Globe, TrendingUp, ChevronLeft } from 'lucide-react-native';
import { useLanguage } from './LanguageContext';

export default function SimulationsScreen({ navigation }) {
    const { t, currentLanguage } = useLanguage();
    const isTamil = currentLanguage?.startsWith('ta');

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <ChevronLeft color="#1A1A1A" size={28} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{t('simulations') || 'Simulations'}</Text>
                <View style={{ width: 28 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.subtitle}>
                    {t('simulationsSubtitle') || 'Learn how to use digital financial services interactively'}
                </Text>

                <TouchableOpacity
                    style={styles.card}
                    onPress={() => navigation.navigate('UPIPaymentSimulation')}
                >
                    <View style={[styles.iconContainer, { backgroundColor: '#E0F2FE' }]}>
                        <Smartphone color="#0284C7" size={32} />
                    </View>
                    <View style={styles.cardContent}>
                        <Text style={[styles.cardTitle, isTamil && { fontSize: 16 }]}>{t('upiPayments') || 'UPI Payments'}</Text>
                        <Text style={[styles.cardDescription, isTamil && { fontSize: 11, lineHeight: 16 }]}>{t('upiPaymentsDesc') || 'Learn how to scan QR codes and send money securely via UPI.'}</Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.card}
                    onPress={() => navigation.navigate('NetBankingSimulation')}
                >
                    <View style={[styles.iconContainer, { backgroundColor: '#FEF3C7' }]}>
                        <Globe color="#D97706" size={32} />
                    </View>
                    <View style={styles.cardContent}>
                        <Text style={[styles.cardTitle, isTamil && { fontSize: 16 }]}>{t('netBanking') || 'Net Banking'}</Text>
                        <Text style={[styles.cardDescription, isTamil && { fontSize: 11, lineHeight: 16 }]}>{t('netBankingDesc') || 'Practice logging into bank portals and transferring funds online.'}</Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.card}
                    onPress={() => navigation.navigate('InvestmentSimulation')}
                >
                    <View style={[styles.iconContainer, { backgroundColor: '#DCFCE7' }]}>
                        <TrendingUp color="#16A34A" size={32} />
                    </View>
                    <View style={styles.cardContent}>
                        <Text style={[styles.cardTitle, isTamil && { fontSize: 16 }]}>{t('investment') || 'Investment'}</Text>
                        <Text style={[styles.cardDescription, isTamil && { fontSize: 11, lineHeight: 16 }]}>{t('investmentDesc') || 'Understand mutual funds, stocks, and how to start investing.'}</Text>
                    </View>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 20,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderColor: '#E5E7EB',
    },
    backButton: {
        padding: 4,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1A1A1A',
    },
    content: {
        padding: 20,
    },
    subtitle: {
        fontSize: 16,
        color: '#4B5563',
        marginBottom: 24,
        textAlign: 'center',
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 3,
        borderWidth: 1,
        borderColor: '#F3F4F6',
    },
    iconContainer: {
        width: 60,
        height: 60,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    cardContent: {
        flex: 1,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#111827',
        marginBottom: 4,
    },
    cardDescription: {
        fontSize: 14,
        color: '#6B7280',
        lineHeight: 20,
    },
});
