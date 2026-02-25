import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { ChevronLeft, TrendingUp } from 'lucide-react-native';
import { useLanguage } from './LanguageContext';

export default function InvestmentSimulation({ navigation }) {
    const { t } = useLanguage();

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <ChevronLeft color="#1A1A1A" size={28} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Investment Simulator</Text>
                <View style={{ width: 28 }} />
            </View>
            <View style={styles.content}>
                <View style={styles.iconWrapper}>
                    <TrendingUp color="#F57C00" size={80} />
                </View>
                <Text style={styles.title}>Grow Your Wealth</Text>
                <Text style={styles.desc}>Learn to navigate stock market graphs, analyze risk vs. reward, and buy your first mutual fund using mock funds.</Text>

                <TouchableOpacity style={styles.mockButton} onPress={() => alert('Mutual Funds dashboard simulated!')}>
                    <Text style={styles.mockButtonText}>Explore Mutual Funds</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFFFFF' },
    header: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        paddingHorizontal: 16, paddingTop: 16, paddingBottom: 20,
        backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderColor: '#E5E7EB',
    },
    backButton: { padding: 4 },
    headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#1A1A1A' },
    content: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
    iconWrapper: { backgroundColor: '#FFF3E0', width: 140, height: 140, borderRadius: 70, justifyContent: 'center', alignItems: 'center', marginBottom: 24 },
    title: { fontSize: 24, fontWeight: 'bold', color: '#1A1A1A', marginBottom: 12 },
    desc: { fontSize: 16, color: '#666', textAlign: 'center', marginBottom: 40, lineHeight: 24 },
    mockButton: { backgroundColor: '#F57C00', paddingVertical: 16, paddingHorizontal: 40, borderRadius: 30, shadowColor: '#F57C00', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 5 },
    mockButtonText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' }
});
