import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Linking, Share } from 'react-native';
import { useLanguage } from './LanguageContext';
import { ChevronLeft, ExternalLink, Bookmark, Share2 } from 'lucide-react-native';

export default function SchemeDetailsScreen({ navigation, route }) {
    const { t, getTranslatedUrl } = useLanguage();
    const { scheme } = route.params;

    const openLink = (url) => {
        const translateUrl = getTranslatedUrl(url);
        Linking.openURL(translateUrl).catch(err => console.error("Couldn't open URL", err));
    };

    const handleShare = async () => {
        try {
            await Share.share({
                message: `${scheme.name}\n${scheme.description}\n\nApply/Learn more: ${scheme.link}`,
            });
        } catch (error) {
            console.error(error.message);
        }
    };

    if (!scheme) return null;

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <ChevronLeft color="#1A1A1A" size={28} />
                </TouchableOpacity>
                <View style={styles.headerActions}>
                    <TouchableOpacity style={styles.iconButton} onPress={handleShare}>
                        <Share2 color="#1A1A1A" size={24} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.iconButton}>
                        <Bookmark color="#1A1A1A" size={24} />
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.logoContainer}>
                    <Text style={styles.logoText}>{scheme.name.charAt(0)}</Text>
                </View>

                <View style={styles.subHeader}>
                    <Text style={styles.providerText}>{t('govtOfIndia') || 'Govt. of India'}</Text>
                    <Text style={styles.timeText}> • {t('activeStatus') || 'Active'}</Text>
                </View>

                <Text style={styles.schemeName}>{scheme.name}</Text>

                <View style={styles.tagsContainer}>
                    {scheme.targetGender !== 'All' && (
                        <View style={styles.tag}>
                            <Text style={styles.tagText}>{scheme.targetGender.toLowerCase() === 'female' ? t('female') : t(scheme.targetGender.toLowerCase()) || scheme.targetGender}</Text>
                        </View>
                    )}
                    {scheme.targetJobType !== 'All' && (
                        <View style={styles.tag}>
                            <Text style={styles.tagText}>{t(scheme.targetJobType) || scheme.targetJobType}</Text>
                        </View>
                    )}
                    <View style={styles.tag}>
                        <Text style={styles.tagText}>{t('govtSchemeTag') || 'Govt Scheme'}</Text>
                    </View>

                    {scheme.maxIncome && (
                        <View style={[styles.tag, styles.tagIncome]}>
                            <Text style={styles.tagTextIncome}>&lt; ₹{scheme.maxIncome} / {t('mo') || 'mo'}</Text>
                        </View>
                    )}
                </View>

                <View style={styles.separator} />

                <Text style={styles.sectionTitle}>About this scheme</Text>
                <Text style={styles.schemeDesc}>{scheme.description}</Text>

            </ScrollView>

            <View style={styles.footer}>
                <TouchableOpacity
                    style={styles.applyButton}
                    onPress={() => openLink(scheme.link)}
                >
                    <Text style={styles.applyButtonText}>{t('applyNow') || 'Apply now'}</Text>
                    <ExternalLink color="#fff" size={18} style={{ marginLeft: 8 }} />
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
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    backButton: {
        padding: 4,
    },
    headerActions: {
        flexDirection: 'row',
    },
    iconButton: {
        padding: 8,
        marginLeft: 8,
    },
    scrollContent: {
        padding: 24,
        paddingBottom: 40,
    },
    logoContainer: {
        width: 64,
        height: 64,
        borderRadius: 32,
        borderWidth: 1,
        borderColor: '#EFEFEF',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    logoText: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#1A73E8',
    },
    subHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    providerText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1A1A1A',
    },
    timeText: {
        fontSize: 16,
        color: '#6B7280',
    },
    schemeName: {
        fontSize: 32,
        fontWeight: '900',
        color: '#000',
        marginBottom: 20,
        lineHeight: 38,
    },
    tagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 24,
        gap: 10,
    },
    tag: {
        backgroundColor: '#F3F4F6',
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 8,
    },
    tagText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
    },
    tagIncome: {
        backgroundColor: '#ECFDF5',
    },
    tagTextIncome: {
        fontSize: 14,
        color: '#047857',
        fontWeight: '600',
    },
    separator: {
        height: 1,
        backgroundColor: '#EFEFEF',
        marginVertical: 24,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1A1A1A',
        marginBottom: 16,
    },
    schemeDesc: {
        fontSize: 16,
        color: '#4B5563',
        lineHeight: 26,
    },
    footer: {
        padding: 24,
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
    },
    applyButton: {
        backgroundColor: '#000',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 18,
        borderRadius: 12,
    },
    applyButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 18,
    }
});
