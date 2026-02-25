import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    TouchableOpacity,
    TextInput,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    PermissionsAndroid,
    Alert,
    Animated,
    Modal,
} from 'react-native';
import { Mic, MicOff, ArrowDown } from 'lucide-react-native';
import {
    addEventListener,
    startListening,
    stopListening,
    destroy,
    setRecognitionLanguage,
} from '@ascendtis/react-native-voice-to-text';
import { useLanguage } from './LanguageContext';

// 🔤 Transliterate English -> Tamil using Google Input Tools
const transliterateToTamil = async (text) => {
    try {
        const response = await fetch(
            `https://inputtools.google.com/request?text=${encodeURIComponent(
                text,
            )}&itc=ta-t-i0-und&num=1`,
        );
        const data = await response.json();

        if (data[0] === 'SUCCESS') {
            return data[1][0][1][0];
        }
        return text;
    } catch (error) {
        console.log('Transliteration error:', error);
        return text;
    }
};

// ⬇ Arrow component
const BouncingArrow = () => {
    const { t } = useLanguage();
    const translateY = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(translateY, {
                    toValue: -10,
                    duration: 500,
                    useNativeDriver: true,
                }),
                Animated.timing(translateY, {
                    toValue: 0,
                    duration: 500,
                    useNativeDriver: true,
                }),
            ]),
        ).start();
    }, [translateY]);

    return (
        <Animated.View
            style={[styles.arrowContainer, { transform: [{ translateY }] }]}>
            <View style={styles.arrowTooltip}>
                <Text style={styles.arrowText}>{t('fillThisNext')}</Text>
                <ArrowDown color="#FFF" size={20} strokeWidth={2.5} />
            </View>
        </Animated.View>
    );
};

export default function UserDetailsScreen({ navigation }) {
    const { t, currentLanguage } = useLanguage();

    const [mobileNumber, setMobileNumber] = useState('');
    const [firstName, setFirstName] = useState('');
    const [gender, setGender] = useState('');

    const [dobDay, setDobDay] = useState('');
    const [dobMonth, setDobMonth] = useState('');
    const [dobYear, setDobYear] = useState('');

    const [pickerVisible, setPickerVisible] = useState(false);
    const [pickerType, setPickerType] = useState(null); // 'day' | 'month' | 'year'

    const [isListeningName, setIsListeningName] = useState(false);

    // Derived DOB
    const dob =
        dobDay && dobMonth && dobYear ? `${dobDay}/${dobMonth}/${dobYear}` : '';

    const days = Array.from({ length: 31 }, (_, i) =>
        String(i + 1).padStart(2, '0'),
    );
    const months = [
        { value: '01', label: t('jan') },
        { value: '02', label: t('feb') },
        { value: '03', label: t('mar') },
        { value: '04', label: t('apr') },
        { value: '05', label: t('may') },
        { value: '06', label: t('jun') },
        { value: '07', label: t('jul') },
        { value: '08', label: t('aug') },
        { value: '09', label: t('sep') },
        { value: '10', label: t('oct') },
        { value: '11', label: t('nov') },
        { value: '12', label: t('dec') },
    ];
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 100 }, (_, i) =>
        String(currentYear - i),
    );

    // Which field should show the arrow
    let activeField = 'none';
    if (!mobileNumber) activeField = 'mobileNumber';
    else if (!firstName) activeField = 'firstName';
    else if (!gender) activeField = 'gender';
    else if (!dob) activeField = 'dob';

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
                    },
                );
                return granted === PermissionsAndroid.RESULTS.GRANTED;
            } catch (err) {
                console.warn(err);
                return false;
            }
        }
        return true;
    };

    // 🎤 Speech Listeners
    useEffect(() => {
        const handleFinal = async (event) => {
            if (!event || !event.value) return;

            let text = event.value;

            // If current app language is Tamil, transliterate
            if (currentLanguage && currentLanguage.startsWith('ta')) {
                text = await transliterateToTamil(text);
            }

            setFirstName(text);
        };

        const handlePartial = (event) => {
            if (event && event.value) {
                setFirstName(event.value);
            }
        };

        const resultsListener = addEventListener('onSpeechResults', handleFinal);
        const partialResultsListener = addEventListener(
            'onSpeechPartialResults',
            handlePartial,
        );

        const startListener = addEventListener('onSpeechStart', () => {
            setIsListeningName(true);
            setFirstName('');
        });

        const endListener = addEventListener('onSpeechEnd', () => {
            setIsListeningName(false);
        });

        const errorListener = addEventListener('onSpeechError', (error) => {
            console.log('Speech Error:', error);
            setIsListeningName(false);
        });

        return () => {
            destroy();
            resultsListener.remove();
            partialResultsListener.remove();
            startListener.remove();
            endListener.remove();
            errorListener.remove();
        };
    }, [currentLanguage]);

    // 🌐 Setup recognition language when language changes
    useEffect(() => {
        const setup = async () => {
            try {
                await destroy();
                if (currentLanguage) {
                    await setRecognitionLanguage(currentLanguage);
                }
            } catch (e) {
                console.warn('Failed to set recognition language:', e);
            }
        };
        setup();
    }, [currentLanguage]);

    // Toggle mic for first name
    const toggleListeningName = async () => {
        try {
            if (isListeningName) {
                await stopListening();
            } else {
                const hasPermission = await requestMicPermission();
                if (!hasPermission) {
                    Alert.alert('Permission Denied', 'Microphone permission is required');
                    return;
                }
                await startListening();
            }
        } catch (error) {
            console.error('Toggle Error:', error);
        }
    };

    const handleNext = () => {
        navigation.navigate('JobDetails', {
            mobileNumber,
            firstName,
            gender,
            dob,
        });
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}>
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.title}>{t('profileDetails')}</Text>
                        <Text style={styles.subtitle}>{t('personalInfo')}</Text>
                    </View>

                    <View style={styles.formContainer}>
                        {/* Mobile */}
                        {activeField === 'mobileNumber' && <BouncingArrow />}
                        <Text style={styles.label}>{t('mobileNumber')}</Text>
                        <TextInput
                            style={styles.input}
                            keyboardType="phone-pad"
                            value={mobileNumber}
                            onChangeText={setMobileNumber}
                            placeholder={
                                currentLanguage && currentLanguage.startsWith('ta')
                                    ? 'உ.ம். 9876543210'
                                    : 'e.g. 9876543210'
                            }
                            placeholderTextColor="#A0A0A0"
                        />

                        {/* First Name + Mic */}
                        {activeField === 'firstName' && <BouncingArrow />}
                        <Text style={styles.label}>{t('firstName')}</Text>
                        <View style={styles.recordInputContainer}>
                            <TextInput
                                style={styles.inputGroupStyle}
                                value={
                                    isListeningName && !firstName ? t('listening') : firstName
                                }
                                onChangeText={setFirstName}
                                placeholder={
                                    currentLanguage && currentLanguage.startsWith('ta')
                                        ? 'உ.ம். பிரவீன்'
                                        : 'e.g. Praveen'
                                }
                                placeholderTextColor="#A0A0A0"
                            />
                            <TouchableOpacity
                                onPress={toggleListeningName}
                                style={[
                                    styles.micButton,
                                    isListeningName && styles.micButtonRecording,
                                ]}>
                                {isListeningName ? (
                                    <MicOff color="#fff" size={20} />
                                ) : (
                                    <Mic color="#fff" size={20} />
                                )}
                            </TouchableOpacity>
                        </View>

                        {/* Gender */}
                        {activeField === 'gender' && <BouncingArrow />}
                        <Text style={styles.label}>{t('gender')}</Text>
                        <View style={styles.genderContainer}>
                            {['male', 'female', 'other'].map((g) => (
                                <TouchableOpacity
                                    key={g}
                                    style={[
                                        styles.genderButton,
                                        gender === g && styles.genderButtonActive,
                                    ]}
                                    onPress={() => setGender(g)}>
                                    <Text
                                        style={[
                                            styles.genderText,
                                            gender === g && styles.genderTextActive,
                                        ]}>
                                        {t(g)}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        {/* DOB */}
                        {activeField === 'dob' && <BouncingArrow />}
                        <Text style={styles.label}>{t('dob')}</Text>
                        <View style={styles.dobContainer}>
                            {/* Day */}
                            <TouchableOpacity
                                style={[
                                    styles.input,
                                    { flex: 1, padding: 12 },
                                    activeField === 'dob' && styles.inputActive,
                                ]}
                                onPress={() => {
                                    setPickerType('day');
                                    setPickerVisible(true);
                                }}>
                                <Text
                                    style={{
                                        color: dobDay ? '#1A1A1A' : '#A0A0A0',
                                        fontSize: 16,
                                        textAlign: 'center',
                                    }}>
                                    {dobDay || 'DD'}
                                </Text>
                            </TouchableOpacity>

                            {/* Month */}
                            <TouchableOpacity
                                style={[
                                    styles.input,
                                    { flex: 1.5, padding: 12 },
                                    activeField === 'dob' && styles.inputActive,
                                ]}
                                onPress={() => {
                                    setPickerType('month');
                                    setPickerVisible(true);
                                }}>
                                <Text
                                    style={{
                                        color: dobMonth ? '#1A1A1A' : '#A0A0A0',
                                        fontSize: 16,
                                        textAlign: 'center',
                                    }}>
                                    {dobMonth
                                        ? months
                                            .find((m) => m.value === dobMonth)
                                            ?.label.substring(0, 3)
                                        : 'MM'}
                                </Text>
                            </TouchableOpacity>

                            {/* Year */}
                            <TouchableOpacity
                                style={[
                                    styles.input,
                                    { flex: 1.2, padding: 12 },
                                    activeField === 'dob' && styles.inputActive,
                                ]}
                                onPress={() => {
                                    setPickerType('year');
                                    setPickerVisible(true);
                                }}>
                                <Text
                                    style={{
                                        color: dobYear ? '#1A1A1A' : '#A0A0A0',
                                        fontSize: 16,
                                        textAlign: 'center',
                                    }}>
                                    {dobYear || 'YYYY'}
                                </Text>
                            </TouchableOpacity>
                        </View>

                        {/* DOB Picker Modal */}
                        <Modal visible={pickerVisible} transparent animationType="fade">
                            <View style={styles.modalOverlay}>
                                <View style={styles.calendarContainer}>
                                    <ScrollView style={{ maxHeight: 300, width: '100%' }}>
                                        {pickerType === 'day' &&
                                            days.map((d) => (
                                                <TouchableOpacity
                                                    key={d}
                                                    style={styles.pickerItem}
                                                    onPress={() => {
                                                        setDobDay(d);
                                                        setPickerVisible(false);
                                                    }}>
                                                    <Text
                                                        style={[
                                                            styles.pickerItemText,
                                                            dobDay === d && styles.pickerItemTextActive,
                                                        ]}>
                                                        {d}
                                                    </Text>
                                                </TouchableOpacity>
                                            ))}

                                        {pickerType === 'month' &&
                                            months.map((m) => (
                                                <TouchableOpacity
                                                    key={m.value}
                                                    style={styles.pickerItem}
                                                    onPress={() => {
                                                        setDobMonth(m.value);
                                                        setPickerVisible(false);
                                                    }}>
                                                    <Text
                                                        style={[
                                                            styles.pickerItemText,
                                                            dobMonth === m.value &&
                                                            styles.pickerItemTextActive,
                                                        ]}>
                                                        {m.label}
                                                    </Text>
                                                </TouchableOpacity>
                                            ))}

                                        {pickerType === 'year' &&
                                            years.map((y) => (
                                                <TouchableOpacity
                                                    key={y}
                                                    style={styles.pickerItem}
                                                    onPress={() => {
                                                        setDobYear(y);
                                                        setPickerVisible(false);
                                                    }}>
                                                    <Text
                                                        style={[
                                                            styles.pickerItemText,
                                                            dobYear === y && styles.pickerItemTextActive,
                                                        ]}>
                                                        {y}
                                                    </Text>
                                                </TouchableOpacity>
                                            ))}
                                    </ScrollView>

                                    <TouchableOpacity
                                        style={styles.closeBtn}
                                        onPress={() => setPickerVisible(false)}>
                                        <Text style={styles.closeBtnText}>{t('close')}</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </Modal>
                    </View>
                </ScrollView>

                {/* Footer */}
                <View style={styles.footer}>
                    <TouchableOpacity
                        style={[
                            styles.nextButton,
                            (!mobileNumber || !firstName || !gender || !dob) &&
                            styles.nextButtonDisabled,
                        ]}
                        onPress={handleNext}
                        disabled={!mobileNumber || !firstName || !gender || !dob}>
                        <Text style={styles.nextButtonText}>{t('next')}</Text>
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
        gap: 16,
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
    inputActive: {
        borderColor: '#2196F3',
    },
    recordInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    inputGroupStyle: {
        flex: 1,
        backgroundColor: '#F3F4F6',
        borderRadius: 12,
        padding: 16,
        fontSize: 16,
        color: '#1A1A1A',
        borderWidth: 1,
        borderColor: '#EFEFEF',
    },
    micButton: {
        backgroundColor: '#1A1A1A',
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
    },
    micButtonRecording: {
        backgroundColor: '#EF4444',
    },
    genderContainer: {
        flexDirection: 'row',
        gap: 10,
    },
    genderButton: {
        flex: 1,
        paddingVertical: 14,
        alignItems: 'center',
        backgroundColor: '#F3F4F6',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#EFEFEF',
    },
    genderButtonActive: {
        backgroundColor: '#E8F5E9',
        borderColor: '#81C784',
    },
    genderText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#4B5563',
    },
    genderTextActive: {
        color: '#2E7D32',
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
    arrowContainer: {
        alignItems: 'center',
        marginBottom: 4,
        marginTop: 10,
    },
    arrowTooltip: {
        backgroundColor: '#2196F3',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        shadowColor: '#2196F3',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 5,
    },
    arrowText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 14,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    calendarContainer: {
        backgroundColor: '#FFF',
        borderRadius: 20,
        width: '100%',
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.15,
        shadowRadius: 20,
        elevation: 10,
    },
    closeBtn: {
        marginTop: 16,
        backgroundColor: '#F3F4F6',
        paddingVertical: 12,
        borderRadius: 12,
        alignItems: 'center',
    },
    closeBtnText: {
        color: '#1A1A1A',
        fontWeight: 'bold',
        fontSize: 16,
    },
    dobContainer: {
        flexDirection: 'row',
        gap: 10,
        alignItems: 'center',
    },
    pickerItem: {
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
        alignItems: 'center',
    },
    pickerItemText: {
        fontSize: 18,
        color: '#4B5563',
        fontWeight: '500',
    },
    pickerItemTextActive: {
        color: '#2196F3',
        fontWeight: 'bold',
    },
});
