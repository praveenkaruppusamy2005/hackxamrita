import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { useLanguage } from './LanguageContext';

const LANGS = [
    { tag: 'en-US', label: 'English', native: 'English', letter: 'E' },
    { tag: 'ta-IN', label: 'Tamil', native: 'தமிழ்', letter: 'த' },
    { tag: 'hi-IN', label: 'Hindi', native: 'हिन्दी', letter: 'हि' },
    { tag: 'te-IN', label: 'Telugu', native: 'తెలుగు', letter: 'తె' },
    { tag: 'kn-IN', label: 'Kannada', native: 'ಕನ್ನಡ', letter: 'ಕ' },
    { tag: 'ml-IN', label: 'Malayalam', native: 'മലയാളം', letter: 'മ' },
    { tag: 'mr-IN', label: 'Marathi', native: 'मराठी', letter: 'म' },
    { tag: 'bn-IN', label: 'Bengali', native: 'বাংলা', letter: 'বা' },
];

export default function LanguageSelectionScreen({ navigation }) {
    const { currentLanguage, setCurrentLanguage, t, isTranslating } = useLanguage();
    const [selectedLang, setSelectedLang] = useState(currentLanguage || 'en-US');

    const handleConfirm = () => {

        navigation.replace('UserDetails');
    };

    const handleSelect = (langTag) => {
        setSelectedLang(langTag);
        setCurrentLanguage(langTag);
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>{t('chooseLanguage')}</Text>
                <Text style={styles.subtitle}>{t('selectPreferred')}</Text>
            </View>

            <ScrollView contentContainerStyle={styles.listContainer} showsVerticalScrollIndicator={false}>
                {LANGS.map(lang => {
                    const isSelected = selectedLang === lang.tag;
                    return (
                        <TouchableOpacity
                            key={lang.tag}
                            style={[
                                styles.langCard,
                                isSelected && styles.langCardSelected
                            ]}
                            onPress={() => handleSelect(lang.tag)}
                            activeOpacity={0.7}
                        >
                            <View style={[styles.radioOuter, isSelected && styles.radioOuterSelected]}>
                                {isSelected && <View style={styles.radioInner} />}
                            </View>

                            <View style={styles.iconPlaceholder}>
                                <Text style={styles.flag}>{lang.letter}</Text>
                            </View>

                            <View style={styles.textContainer}>
                                <Text style={[styles.nativeName, isSelected && styles.textSelected]}>
                                    {lang.native}
                                </Text>
                                <Text style={[styles.englishName, isSelected && styles.textSelected]}>
                                    {lang.label}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>

            <View style={styles.footer}>
                <TouchableOpacity
                    style={styles.confirmButton}
                    onPress={handleConfirm}
                    disabled={isTranslating}
                    activeOpacity={0.8}
                >
                    <Text style={styles.confirmButtonText}>
                        {isTranslating ? '...' : t('confirmContinue')}
                    </Text>
                </TouchableOpacity>
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
        marginTop: 60,
        paddingHorizontal: 24,
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
    listContainer: {
        paddingHorizontal: 24,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        rowGap: 16,
    },
    langCard: {
        width: '47%',
        flexDirection: 'column',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 12,
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#EFEFEF',
    },
    langCardSelected: {
        backgroundColor: '#F3FAFF',
        borderColor: '#2196F3',
    },
    iconPlaceholder: {
        width: 64,
        height: 64,
        backgroundColor: '#F3F4F6',
        borderRadius: 32,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
        marginTop: 4,
    },
    flag: {
        fontSize: 32,
    },
    textContainer: {
        alignItems: 'center',
    },
    nativeName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1A1A1A',
        marginBottom: 4,
    },
    englishName: {
        fontSize: 12,
        color: '#888',
        fontWeight: '500',
    },
    textSelected: {
        color: '#1976D2',
    },
    radioOuter: {
        position: 'absolute',
        top: 12,
        right: 12,
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#DDD',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFF'
    },
    radioOuterSelected: {
        borderColor: '#2196F3',
    },
    radioInner: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#2196F3',
    },
    footer: {
        paddingHorizontal: 24,
        paddingVertical: 20,
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
    },
    confirmButton: {
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
    confirmButtonText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
    }
});
