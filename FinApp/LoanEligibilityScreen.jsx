import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, TextInput, ActivityIndicator, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLanguage } from './LanguageContext';
import { ChevronLeft } from 'lucide-react-native';

const REAL_LOANS = [
    {
        id: '1',
        name: 'SBI Personal Loan',
        provider: 'State Bank of India',
        rate: 'From 11.15% p.a.',
        maxAmount: 2000000,
        link: 'https://sbi.co.in/web/personal-banking/loans/personal-loans',
    },
    {
        id: '2',
        name: 'HDFC Personal Loan',
        provider: 'HDFC Bank',
        rate: 'From 10.50% p.a.',
        maxAmount: 4000000,
        link: 'https://www.hdfcbank.com/personal/borrow/popular-loans/personal-loan',
    },
    {
        id: '3',
        name: 'Pradhan Mantri Mudra Yojana',
        provider: 'Govt. of India',
        rate: 'Depends on Bank',
        maxAmount: 1000000,
        link: 'https://www.mudra.org.in/',
    },
    {
        id: '4',
        name: 'Bajaj Finserv Personal Loan',
        provider: 'Bajaj Finserv',
        rate: 'From 11.00% p.a.',
        maxAmount: 4000000,
        link: 'https://www.bajajfinserv.in/personal-loan',
    }
];

export default function LoanEligibilityScreen({ navigation }) {
    const { t, getTranslatedUrl } = useLanguage();
    const [loading, setLoading] = useState(true);
    const [monthlyIncome, setMonthlyIncome] = useState('');
    const [targetAmount, setTargetAmount] = useState('');


    const [existingEmi, setExistingEmi] = useState('0');

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const mobile = await AsyncStorage.getItem('userMobile');
                if (mobile) {
                    const response = await fetch(`http://localhost:3000/api/users/${mobile}`);
                    if (response.ok) {
                        const data = await response.json();
                        if (data.monthlyIncome) {
                            setMonthlyIncome(data.monthlyIncome.replace(/,/g, ''));
                        }
                    }
                }
            } catch (error) {
                console.log('Error fetching user data', error);
            } finally {
                setLoading(false);
            }
        };
        fetchUserData();
    }, []);

    const calculateEligibility = () => {
        const income = parseInt(monthlyIncome) || 0;
        const target = parseInt(targetAmount) || 0;
        const emi = parseInt(existingEmi) || 0;

        if (income === 0 || target === 0) {
            Alert.alert("Error", "Please enter valid income and target loan amount.");
            return;
        }


        const estimatedNewEmi = target * 0.0222;
        const totalEmi = emi + estimatedNewEmi;
        const dti = (totalEmi / income) * 100;

        let calculatedStatus = 'GREEN';
        if (dti > 70) {
            calculatedStatus = 'RED';
        } else if (dti > 50) {
            calculatedStatus = 'YELLOW';
        }

        let finalRecommendations = [];
        if (calculatedStatus !== 'RED') {
            finalRecommendations = REAL_LOANS.filter(loan => target <= loan.maxAmount);
        }


        navigation.navigate('LoanResult', {
            status: calculatedStatus,
            recommendations: finalRecommendations
        });
    };

    if (loading) {
        return (
            <SafeAreaView style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#2563EB" />
            </SafeAreaView>
        );
    }

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
                <View style={styles.card}>
                    <Text style={styles.label}>{t('monthlyIncome') || 'Monthly Income (₹)'}</Text>
                    <TextInput
                        style={styles.input}
                        keyboardType="numeric"
                        value={monthlyIncome}
                        onChangeText={setMonthlyIncome}
                        placeholder="e.g. 50000"
                        placeholderTextColor="#9CA3AF"
                    />

                    <Text style={styles.label}>{t('existingEmi') || 'Existing Total EMI (₹/mo)'}</Text>
                    <TextInput
                        style={styles.input}
                        keyboardType="numeric"
                        value={existingEmi}
                        onChangeText={setExistingEmi}
                        placeholder="e.g. 5000"
                        placeholderTextColor="#9CA3AF"
                    />

                    <Text style={styles.label}>{t('targetLoanAmount') || 'Target Loan Amount (₹)'}</Text>
                    <TextInput
                        style={styles.input}
                        keyboardType="numeric"
                        value={targetAmount}
                        onChangeText={setTargetAmount}
                        placeholder="e.g. 200000"
                        placeholderTextColor="#9CA3AF"
                    />

                    <TouchableOpacity style={styles.primaryButton} onPress={calculateEligibility}>
                        <Text style={styles.primaryButtonText}>{t('checkEligibility') || 'Check Eligibility'}</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
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
    card: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#EFEFEF',
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#F3F4F6',
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 16,
        color: '#111827',
        marginBottom: 20,
    },
    primaryButton: {
        backgroundColor: '#000',
        borderRadius: 8,
        paddingVertical: 14,
        alignItems: 'center',
    },
    primaryButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
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
