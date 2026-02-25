import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, TextInput, Alert, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLanguage } from './LanguageContext';

export default function IncomeDetailsScreen({ navigation, route }) {
    const { t } = useLanguage();

    const { mobileNumber, firstName, gender, dob, jobType } = route.params || {};

    const [monthlyIncome, setMonthlyIncome] = useState('');
    const [annualIncome, setAnnualIncome] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {

            const backendUrl = 'http://10.195.140.201:3000';

            const response = await fetch(`${backendUrl}/api/auth/profile`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'user-id': mobileNumber
                },
                body: JSON.stringify({
                    personalInfo: {
                        firstName,
                        gender,
                        dob,
                        phone: mobileNumber
                    },
                    jobDetails: {
                        employmentType: jobType
                    },
                    incomeDetails: {
                        monthlyIncome,
                        totalAnnualIncome: annualIncome
                    }
                }),
            });

            const data = await response.json();

            if (response.ok) {

                await AsyncStorage.setItem('userMobile', mobileNumber);


                navigation.reset({
                    index: 0,
                    routes: [{ name: 'MainTabs' }],
                });
            } else {
                Alert.alert('Error', data.error || 'Failed to securely store data.');
            }
        } catch (error) {
            console.error('Submission Error:', error);
            Alert.alert('Network Error', 'Could not connect to the server.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <View style={styles.header}>
                        <Text style={styles.title}>{t('incomeDetails') || 'Income Details'}</Text>
                        <Text style={styles.subtitle}>{t('tellUsIncome') || 'Tell us about your earnings'}</Text>
                    </View>

                    <View style={styles.formContainer}>
                        <Text style={styles.label}>{t('monthlyIncome') || 'Monthly Income (₹)'}</Text>
                        <TextInput
                            style={styles.input}
                            keyboardType="numeric"
                            value={monthlyIncome}
                            onChangeText={setMonthlyIncome}
                            placeholder="e.g. 50000"
                            placeholderTextColor="#A0A0A0"
                        />

                        <Text style={styles.label}>{t('annualIncome') || 'Annual Income (₹)'}</Text>
                        <TextInput
                            style={styles.input}
                            keyboardType="numeric"
                            value={annualIncome}
                            onChangeText={setAnnualIncome}
                            placeholder="e.g. 600000"
                            placeholderTextColor="#A0A0A0"
                        />
                    </View>
                </ScrollView>

                <View style={styles.footer}>
                    <TouchableOpacity
                        style={[styles.nextButton, (!monthlyIncome || !annualIncome || isSubmitting) && styles.nextButtonDisabled]}
                        onPress={handleSubmit}
                        disabled={!monthlyIncome || !annualIncome || isSubmitting}
                    >
                        {isSubmitting ? (
                            <ActivityIndicator color="#FFF" />
                        ) : (
                            <Text style={styles.nextButtonText}>{t('complete') || 'Complete Setup'}</Text>
                        )}
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    scrollContent: {
        paddingHorizontal: 24,
        paddingTop: 60,
        paddingBottom: 40,
    },
    header: {
        marginBottom: 40,
    },
    title: {
        fontSize: 32,
        fontWeight: '900',
        color: '#1A1A1A',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        fontWeight: '500',
    },
    formContainer: {
        gap: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1A1A1A',
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#F3F4F6',
        borderRadius: 12,
        padding: 16,
        fontSize: 16,
        color: '#1A1A1A',
        borderWidth: 1,
        borderColor: '#EFEFEF',
    },
    footer: {
        paddingHorizontal: 24,
        paddingVertical: 20,
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
    },
    nextButton: {
        backgroundColor: '#4CAF50',
        paddingVertical: 18,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#4CAF50',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 8,
    },
    nextButtonDisabled: {
        backgroundColor: '#A0A0A0',
        shadowOpacity: 0,
        elevation: 0,
    },
    nextButtonText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
