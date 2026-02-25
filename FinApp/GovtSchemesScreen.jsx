import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, ActivityIndicator, Linking } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLanguage } from './LanguageContext';
import { ChevronLeft, ExternalLink, Bookmark } from 'lucide-react-native';

const SCHEMES_DATABASE = [
    {
        id: '1',
        name: 'PM-Kisan Samman Nidhi',
        description: 'Under the scheme an income support of Rs. 6,000/- per year in three equal installments is provided to all land holding farmer families.',
        targetGender: 'All',
        maxIncome: null,
        targetJobType: 'farmer',
        link: 'https://pmkisan.gov.in/'
    },
    {
        id: '2',
        name: 'Pradhan Mantri Krishi Sinchayee Yojana',
        description: 'To achieve convergence of investments in irrigation at the field level, expand cultivable area under assured irrigation, and improve water use efficiency.',
        targetGender: 'All',
        maxIncome: null,
        targetJobType: 'farmer',
        link: 'https://pmksy.gov.in/'
    },
    {
        id: '3',
        name: 'National Handloom Development Programme',
        description: 'Financial assistance for weavers for upgrading looms, accessories, and training for specialized skill development in weaving.',
        targetGender: 'All',
        maxIncome: null,
        targetJobType: 'weaver',
        link: 'https://handlooms.nic.in/'
    },
    {
        id: '4',
        name: 'PM Vishwakarma',
        description: 'Aimed at improving the quality, as well as the reach of products and services of artisans and craftspeople.',
        targetGender: 'All',
        maxIncome: null,
        targetJobType: 'artisan',
        link: 'https://pmvishwakarma.gov.in/'
    },
    {
        id: '5',
        name: 'PM Street Vendor\'s AtmaNirbhar Nidhi (PM SVANidhi)',
        description: 'A special micro-credit facility for street vendors to resume their livelihoods and help shopkeepers sustain their businesses.',
        targetGender: 'All',
        maxIncome: null,
        targetJobType: 'shopkeeper',
        link: 'https://pmsvanidhi.mohua.gov.in/'
    },
    {
        id: '6',
        name: 'e-Shram',
        description: 'National Database of Unorganized Workers to provide social security benefits to unorganized sector workers.',
        targetGender: 'All',
        maxIncome: 15000,
        targetJobType: 'labourer',
        link: 'https://eshram.gov.in/'
    },
    {
        id: '7',
        name: 'Post Matric Scholarship',
        description: 'Financial assistance for students studying at post matriculation or post-secondary stage to enable them to complete their education.',
        targetGender: 'All',
        maxIncome: null,
        targetJobType: 'student',
        link: 'https://scholarships.gov.in/'
    },
    {
        id: '8',
        name: 'Pradhan Mantri Mudra Yojana (PMMY)',
        description: 'A scheme to provide loans up to 10 lakh to non-corporate, non-farm small/micro enterprises.',
        targetGender: 'All',
        maxIncome: null,
        targetJobType: 'business',
        link: 'https://www.mudra.org.in/'
    },
    {
        id: '9',
        name: 'Mahila Samman Savings Certificate',
        description: 'A small savings scheme exclusively for women and girls offering a fixed interest rate of 7.5%.',
        targetGender: 'Female',
        maxIncome: null,
        targetJobType: 'All',
        link: 'https://www.indiapost.gov.in/'
    },
    {
        id: '10',
        name: 'Pradhan Mantri Jan Dhan Yojana (PMJDY)',
        description: 'National Mission for Financial Inclusion to ensure access to financial services, namely, a basic savings & deposit accounts, remittance, credit, insurance, pension in an affordable manner.',
        targetGender: 'All',
        maxIncome: null,
        targetJobType: 'All',
        link: 'https://pmjdy.gov.in/'
    },
    {
        id: '11',
        name: 'Pradhan Mantri Jeevan Jyoti Bima Yojana (PMJJBY)',
        description: 'Life insurance scheme offering a renewable one-year term life cover of Rupees Two Lakh to all subscribing bank account holders in the age group of 18-50 years.',
        targetGender: 'All',
        maxIncome: null,
        targetJobType: 'All',
        link: 'https://jansuraksha.gov.in/'
    },
    {
        id: '12',
        name: 'Pradhan Mantri Suraksha Bima Yojana (PMSBY)',
        description: 'Accident insurance scheme offering accidental death and disability cover for death or disability on account of an accident.',
        targetGender: 'All',
        maxIncome: null,
        targetJobType: 'All',
        link: 'https://jansuraksha.gov.in/'
    },
    {
        id: '13',
        name: 'Ayushman Bharat Pradhan Mantri Jan Arogya Yojana',
        description: 'Free health coverage up to Rs. 5 lakhs per family per year for secondary and tertiary care hospitalization.',
        targetGender: 'All',
        maxIncome: 12000,
        targetJobType: 'All',
        link: 'https://nha.gov.in/PM-JAY'
    },
    {
        id: '14',
        name: 'Sukanya Samriddhi Yojana (SSY)',
        description: 'A small deposit scheme for the girl child launched as a part of the Beti Bachao Beti Padhao campaign.',
        targetGender: 'Female',
        maxIncome: null,
        targetJobType: 'All',
        link: 'https://www.indiapost.gov.in/'
    }
];

export default function GovtSchemesScreen({ navigation }) {
    const { t, translateDynamic, currentLanguage } = useLanguage();
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [translatingSchemes, setTranslatingSchemes] = useState(false);
    const [recommendedSchemes, setRecommendedSchemes] = useState([]);

    useEffect(() => {
        const fetchProfileAndFilter = async () => {
            setLoading(true);
            try {
                let filteredSchemes = [...SCHEMES_DATABASE];
                const mobile = await AsyncStorage.getItem('userMobile');

                if (mobile) {
                    const backendUrl = 'http://localhost:3000';
                    const response = await fetch(`${backendUrl}/api/users/${mobile}`);
                    if (response.ok) {
                        const data = await response.json();
                        setProfileData(data);


                        filteredSchemes = SCHEMES_DATABASE.filter(scheme => {

                            if (scheme.targetGender !== 'All' && data.gender && scheme.targetGender !== data.gender) {
                                return false;
                            }


                            const userMonthlyIncome = parseInt(data.monthlyIncome?.replace(/,/g, '') || '0');
                            if (scheme.maxIncome !== null && userMonthlyIncome > scheme.maxIncome) {
                                return false;
                            }


                            if (scheme.targetJobType !== 'All' && data.jobType && scheme.targetJobType !== data.jobType) {
                                return false;
                            }

                            return true;
                        });
                    }
                }

                await handleTranslations(filteredSchemes);
            } catch (err) {
                console.warn('Failed to fetch profile for schemes:', err);
                await handleTranslations(SCHEMES_DATABASE);
            } finally {
                setLoading(false);
            }
        };

        const handleTranslations = async (schemes) => {
            if (currentLanguage === 'en-US') {
                setRecommendedSchemes(schemes);
                return;
            }

            setTranslatingSchemes(true);
            const translatedArr = [];
            for (let scheme of schemes) {
                const trName = await translateDynamic(scheme.name, 'en');
                const trDesc = await translateDynamic(scheme.description, 'en');
                translatedArr.push({ ...scheme, name: trName, description: trDesc });
            }
            setRecommendedSchemes(translatedArr);
            setTranslatingSchemes(false);
        };

        fetchProfileAndFilter();

    }, [currentLanguage]);

    const openLink = (url) => {
        Linking.openURL(url).catch(err => console.error("Couldn't open URL", err));
    };

    if (loading || translatingSchemes) {
        return (
            <SafeAreaView style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#2196F3" />
                <Text style={{ marginTop: 10, color: '#666' }}>{loading ? t('analyzingProfile') : 'Translating...'}</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <ChevronLeft color="#1A1A1A" size={28} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{t('govtSchemes')}</Text>
                <View style={{ width: 28 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.infoBanner}>
                    <Text style={styles.infoText}>
                        {profileData ? t('schemesFoundMsg') : t('allSchemesMsg')}
                    </Text>
                </View>

                {recommendedSchemes.length === 0 ? (
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyText}>{t('noSchemesMsg')}</Text>
                    </View>
                ) : (
                    recommendedSchemes.map((scheme) => (
                        <TouchableOpacity
                            key={scheme.id}
                            style={styles.card}
                            onPress={() => navigation.navigate('SchemeDetails', { scheme })}
                        >
                            <View style={styles.cardHeaderTop}>
                                <View style={styles.logoContainer}>
                                    <Text style={styles.logoText}>{scheme.name.charAt(0)}</Text>
                                </View>
                                <TouchableOpacity style={styles.saveButton}>
                                    <Text style={styles.saveButtonText}>{t('saved')}</Text>
                                    <Bookmark color="#000" size={14} />
                                </TouchableOpacity>
                            </View>

                            <View style={styles.cardSubHeader}>
                                <Text style={styles.providerText}>{t('govtOfIndia')}</Text>
                                <Text style={styles.timeText}> • {t('activeStatus')}</Text>
                            </View>

                            <Text style={styles.schemeName}>{scheme.name}</Text>

                            <Text style={styles.schemeDesc} numberOfLines={2}>{scheme.description}</Text>
                        </TouchableOpacity>

                    ))
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F3F4F6',
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F3F4F6',
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
    infoBanner: {
        backgroundColor: '#DBEAFE',
        padding: 12,
        borderRadius: 8,
        marginBottom: 16,
    },
    infoText: {
        color: '#1E3A8A',
        fontSize: 14,
        fontWeight: '500',
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#EFEFEF',
    },
    cardHeaderTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    logoContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        borderWidth: 1,
        borderColor: '#EFEFEF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1A73E8',
    },
    saveButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F3F4F6',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
    },
    saveButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1A1A1A',
        marginRight: 6,
    },
    cardSubHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    providerText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1A1A1A',
    },
    timeText: {
        fontSize: 14,
        color: '#6B7280',
    },
    schemeName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 12,
    },
    tagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 16,
        gap: 8,
    },
    tag: {
        backgroundColor: '#F3F4F6',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 6,
    },
    tagText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#1A1A1A',
    },
    schemeDesc: {
        fontSize: 14,
        color: '#6B7280',
        lineHeight: 20,
        marginBottom: 16,
    },
    separator: {
        height: 1,
        backgroundColor: '#EFEFEF',
        marginBottom: 16,
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    footerLeft: {
        flex: 1,
    },
    incomeText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1A1A1A',
        marginBottom: 4,
    },
    targetText: {
        fontSize: 14,
        color: '#6B7280',
    },
    applyButton: {
        backgroundColor: '#000',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    applyButtonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 16,
    },
    emptyState: {
        padding: 24,
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 16,
        color: '#6B7280',
        textAlign: 'center',
    }
});
