import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, TextInput } from 'react-native';
import { useLanguage } from './LanguageContext';

export default function JobDetailsScreen({ navigation, route }) {
    const { t } = useLanguage();
    // Retrieve params passed from UserDetailsScreen
    const { mobileNumber, firstName, gender, dob } = route.params || {};

    const [jobType, setJobType] = useState('');

    const handleNext = () => {
        navigation.navigate('IncomeDetails', {
            mobileNumber,
            firstName,
            gender,
            dob,
            jobType
        });
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <View style={styles.header}>
                        <Text style={styles.title}>{t('jobDetails') || 'Job Details'}</Text>
                        <Text style={styles.subtitle}>{t('tellUsWork') || 'Tell us about your work'}</Text>
                    </View>

                    <View style={styles.formContainer}>
                        <Text style={styles.label}>{t('jobType') || 'Job Title'}</Text>
                        <View style={styles.typeContainer}>
                            {['farmer', 'labourer', 'weaver', 'artisan', 'student', 'shopkeeper', 'salaried', 'business',].map(type => (
                                <TouchableOpacity
                                    key={type}
                                    style={[styles.typeButton, jobType === type && styles.typeButtonActive]}
                                    onPress={() => setJobType(type)}
                                >
                                    <Text style={[styles.typeText, jobType === type && styles.typeTextActive]}>
                                        {t(type) || type.charAt(0).toUpperCase() + type.slice(1).replace('Employed', ' Employed')}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                </ScrollView>

                <View style={styles.footer}>
                    <TouchableOpacity
                        style={[styles.nextButton, !jobType && styles.nextButtonDisabled]}
                        onPress={handleNext}
                        disabled={!jobType}
                    >
                        <Text style={styles.nextButtonText}>{t('next') || 'Next'}</Text>
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
    typeContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    typeButton: {
        paddingVertical: 14,
        paddingHorizontal: 20,
        alignItems: 'center',
        backgroundColor: '#F3F4F6',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#EFEFEF',
        marginBottom: 10,
    },
    typeButtonActive: {
        backgroundColor: '#E3F2FD',
        borderColor: '#2196F3',
    },
    typeText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#4B5563',
    },
    typeTextActive: {
        color: '#1976D2',
    },
    footer: {
        paddingHorizontal: 24,
        paddingVertical: 20,
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
    },
    nextButton: {
        backgroundColor: '#2196F3',
        paddingVertical: 18,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#2196F3',
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
