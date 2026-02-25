import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { useLanguage } from './LanguageContext';
import { ChevronLeft, CheckCircle2, AlertTriangle, XCircle, ExternalLink } from 'lucide-react-native';

export default function LoanResultScreen({ navigation, route }) {
    const { t, getTranslatedUrl } = useLanguage();
    const { status, recommendations } = route.params;

    const renderTrafficLight = () => {
        if (!status) return null;

        let icon, color, title, desc;
        if (status === 'GREEN') {
            icon = <CheckCircle2 color="#059669" size={48} />;
            color = '#D1FAE5';
            title = t('eligible') || "High Eligibility";
            desc = t('eligibleDesc') || "Your debt-to-income ratio is healthy! You are highly likely to get this loan approved.";
        } else if (status === 'YELLOW') {
            icon = <AlertTriangle color="#D97706" size={48} />;
            color = '#FEF3C7';
            title = t('moderateEligibility') || "Moderate Eligibility";
            desc = t('moderateEligibilityDesc') || "You already have existing debts. Finding a new loan might be tricky or have higher interest rates.";
        } else {
            icon = <XCircle color="#DC2626" size={48} />;
            color = '#FEE2E2';
            title = t('ineligible') || "Low Eligibility";
            desc = t('ineligibleDesc') || "You cannot get a new loan easily until you finish repaying your current EMI commitments.";
        }

        return (
            <View style={[styles.statusCard, { backgroundColor: color }]}>
                {icon}
                <Text style={styles.statusTitle}>{title}</Text>
                <Text style={styles.statusDesc}>{desc}</Text>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <ChevronLeft color="#1A1A1A" size={28} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{t('loanEligibility') || 'Loan Eligibility'}</Text>
                <View style={{ width: 28 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>

                {renderTrafficLight()}

                {status && status !== 'RED' && recommendations.length > 0 && (
                    <View style={styles.recommendationsContainer}>
                        <Text style={styles.sectionTitle}>{t('recommendedLoans') || 'Recommended Loans for You'}</Text>
                        {recommendations.map(loan => (
                            <TouchableOpacity
                                key={loan.id}
                                style={styles.loanCard}
                                onPress={() => {
                                    const translateUrl = getTranslatedUrl(loan.link);
                                    Linking.openURL(translateUrl).catch(e => console.log(e));
                                }}
                            >
                                <View style={styles.loanInfo}>
                                    <Text style={styles.provider}>{t(loan.provider) || loan.provider}</Text>
                                    <Text style={styles.loanName}>{t(loan.name) || loan.name}</Text>
                                    <Text style={styles.loanRate}>{t(loan.rate) || loan.rate}</Text>
                                </View>
                                <View style={styles.applyActionContainer}>
                                    <View style={styles.applyAction}>
                                        <Text style={styles.applyText}>{t('applyNow') || 'Apply'}</Text>
                                        <ExternalLink color="#2563EB" size={16} />
                                    </View>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}
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
        paddingVertical: 16,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    backButton: {
        padding: 4,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1A1A1A',
    },
    scrollContent: {
        padding: 16,
        paddingBottom: 40,
    },
    statusCard: {
        padding: 20,
        borderRadius: 16,
        alignItems: 'center',
        marginBottom: 20,
    },
    statusTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1A1A1A',
        marginTop: 12,
        marginBottom: 8,
    },
    statusDesc: {
        fontSize: 14,
        color: '#4B5563',
        textAlign: 'center',
        lineHeight: 20,
    },
    recommendationsContainer: {
        marginTop: 10,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#111827',
        marginBottom: 16,
    },
    loanCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        flexDirection: 'column',
        alignItems: 'flex-start',
        borderWidth: 1,
        borderColor: '#EFEFEF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
    },
    loanInfo: {
        width: '100%',
        marginBottom: 16,
    },
    provider: {
        fontSize: 14,
        color: '#6B7280',
        fontWeight: 'bold',
        marginBottom: 8,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    loanName: {
        fontSize: 24,
        fontWeight: '900',
        color: '#1A1A1A',
        marginBottom: 10,
        lineHeight: 28,
    },
    loanRate: {
        fontSize: 18,
        color: '#047857',
        fontWeight: 'bold',
    },
    applyActionContainer: {
        width: '100%',
        alignItems: 'flex-end',
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
        paddingTop: 16,
    },
    applyAction: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#EFF6FF',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 8,
    },
    applyText: {
        color: '#2563EB',
        fontWeight: 'bold',
        fontSize: 14,
        marginRight: 6,
    }
});
