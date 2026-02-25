import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { useLanguage } from './LanguageContext';

export default function ProfileScreen({ navigation }) {
    const { t } = useLanguage();
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchProfile = async () => {
        setLoading(true);
        try {
            const mobile = await AsyncStorage.getItem('userMobile');
            if (!mobile) {
                setLoading(false);
                return;
            }
            const backendUrl = 'http://10.195.140.201:3000';
            const response = await fetch(`${backendUrl}/api/auth/profile`, {
                headers: {
                    'Content-Type': 'application/json',
                    'user-id': mobile
                }
            });
            if (response.ok) {
                const data = await response.json();
                setProfileData(data);
            }
        } catch (err) {
            console.warn('Failed to fetch profile:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        Alert.alert(
            t('logout') || 'Logout',
            t('confirmLogout') || 'Are you sure you want to logout? This will clear your local session.',
            [
                { text: t('cancel') || 'Cancel', style: 'cancel' },
                {
                    text: t('logout') || 'Logout',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await AsyncStorage.removeItem('userMobile');
                            // Use navigation.reset to go back to language selection
                            navigation.reset({
                                index: 0,
                                routes: [{ name: 'LanguageSelection' }],
                            });
                        } catch (e) {
                            console.error('Logout error:', e);
                        }
                    }
                }
            ]
        );
    };

    useFocusEffect(
        React.useCallback(() => {
            fetchProfile();
        }, [])
    );

    if (loading) {
        return (
            <SafeAreaView style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#2196F3" />
            </SafeAreaView>
        );
    }

    if (!profileData) {
        return (
            <SafeAreaView style={styles.centerContainer}>
                <Text style={styles.noDataText}>{t('noProfileData')}</Text>
                <Text style={styles.noDataSub}>{t('completeOnboarding')}</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.header}>
                    <View style={styles.avatarPlaceholder}>
                        <Text style={styles.avatarText}>{profileData.personalInfo?.firstName ? profileData.personalInfo.firstName.charAt(0).toUpperCase() : 'U'}</Text>
                    </View>
                    <Text style={styles.name}>{profileData.personalInfo?.firstName || t('user')}</Text>
                    <Text style={styles.email}>+91 {profileData.userId}</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>{t('personalInfo')}</Text>
                    <View style={styles.row}>
                        <Text style={styles.label}>{t('gender')}:</Text>
                        <Text style={styles.value}>{t(profileData.personalInfo?.gender?.toLowerCase()) || profileData.personalInfo?.gender || 'N/A'}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>{t('dob')}:</Text>
                        <Text style={styles.value}>{profileData.personalInfo?.dob || 'N/A'}</Text>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>{t('employment')}</Text>
                    <View style={styles.row}>
                        <Text style={styles.label}>{t('jobType')}:</Text>
                        <Text style={styles.value}>
                            {profileData.jobDetails?.employmentType === 'Salaried' ? t('salaried') :
                                profileData.jobDetails?.employmentType === 'Self Employed' ? t('selfEmployed') :
                                    profileData.jobDetails?.employmentType === 'Business' ? t('business') :
                                        (profileData.jobDetails?.employmentType || 'N/A')}
                        </Text>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>{t('incomeDetails')}</Text>
                    <View style={styles.row}>
                        <Text style={styles.label}>{t('monthly')}:</Text>
                        <Text style={styles.value}>₹ {profileData.incomeDetails?.monthlyIncome || '0'}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>{t('annual')}:</Text>
                        <Text style={styles.value}>₹ {profileData.incomeDetails?.totalAnnualIncome || '0'}</Text>
                    </View>
                </View>
                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <Text style={styles.logoutText}>{t('logout') || 'Logout'}</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    centerContainer: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        justifyContent: 'center',
        alignItems: 'center',
    },
    noDataText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    noDataSub: {
        fontSize: 16,
        color: '#666',
        marginTop: 8,
    },
    scrollContent: {
        paddingBottom: 40,
    },
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        backgroundColor: '#fff',
        alignItems: 'center',
        paddingVertical: 40,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        paddingTop: 60,
    },
    avatarPlaceholder: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#E3F2FD',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    avatarText: {
        fontSize: 36,
        color: '#2196F3',
        fontWeight: 'bold',
    },
    name: {
        fontSize: 28,
        fontWeight: '900',
        color: '#1A1A1A',
        marginBottom: 8,
    },
    email: {
        fontSize: 16,
        color: '#666',
        fontWeight: '500',
    },
    section: {
        marginTop: 20,
        backgroundColor: '#fff',
        padding: 24,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#eee',
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1A1A1A',
        marginBottom: 16,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6'
    },
    label: {
        fontSize: 16,
        color: '#666',
        fontWeight: '500'
    },
    value: {
        fontSize: 16,
        color: '#1A1A1A',
        fontWeight: '700'
    },
    logoutButton: {
        margin: 24,
        padding: 18,
        backgroundColor: '#FF3B30',
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 40,
    },
    logoutText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    }
});
