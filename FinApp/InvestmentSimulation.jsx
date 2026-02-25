import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    StatusBar,
    ScrollView,
    Dimensions,
    Animated,
    Modal,
    LayoutAnimation,
    Platform,
    UIManager
} from 'react-native';
import Slider from '@react-native-community/slider';
import {
    ChevronLeft,
    PiggyBank,
    TrendingUp,
    ShieldCheck,
    Users,
    Coins,
    Info,
    CheckCircle2,
    BarChart3,
    ArrowUpRight,
    Scale,
    X,
    AlertTriangle
} from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useLanguage } from './LanguageContext';

// Enable LayoutAnimation for Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

const { width } = Dimensions.get('window');

const COLORS = {
    background: '#F8FAFC',
    surface: '#FFFFFF',
    primary: '#0F172A',   // Slate 900
    accent: '#3B82F6',    // Blue 500
    accentLight: '#EFF6FF',
    secondary: '#64748B', // Slate 500
    text: '#1E293B',      // Slate 800
    border: '#E2E8F0',    // Slate 200
    success: '#10B981',   // Emerald 500
    danger: '#EF4444',    // Red 500
    warning: '#F59E0B',   // Amber 500

    // Investment Specific Colors
    fd: '#0D9488',        // Teal 600
    gold: '#D97706',      // Amber 600
    mf: '#4F46E5',        // Indigo 600
    bonds: '#0284C7',     // Sky 600
    chit: '#DB2777',      // Pink 600
};

const INVESTMENTS_DATA = {
    fd: {
        id: 'fd',
        nameKey: 'fixedDeposit',
        metaphorKey: 'clayPot',
        subKey: 'guaranteedSafety',
        icon: PiggyBank,
        rate: 0.065,
        riskKey: 'low',
        color: COLORS.fd,
        descKey: 'fdDesc',
        pros: ['Guaranteed Returns', 'Insured up to ₹5L', 'High Liquidity'],
        cons: ['Taxed at Slab Rate', 'Low Real Returns']
    },
    gold: {
        id: 'gold',
        nameKey: 'goldSgb',
        metaphorKey: 'ironChest',
        subKey: 'inflationHedge',
        icon: Coins,
        rate: 0.11,
        riskKey: 'medium',
        color: COLORS.gold,
        descKey: 'goldDesc',
        pros: ['Inflation Beating', '2.5% Extra Interest', 'No Theft Risk'],
        cons: ['8 Year Lock-in', 'Price Fluctuation']
    },
    mf: {
        id: 'mf',
        nameKey: 'mutualFunds',
        metaphorKey: 'fruitTree',
        subKey: 'highGrowth',
        icon: TrendingUp,
        rate: 0.13,
        riskKey: 'high',
        color: COLORS.mf,
        descKey: 'mfDesc',
        pros: ['12-15% Hist. Return', 'Compound Growth', 'Professional Mgmt'],
        cons: ['Market Volatility', 'Not Guaranteed']
    },
    bonds: {
        id: 'bonds',
        nameKey: 'govtBonds',
        metaphorKey: 'govtWarehouse',
        subKey: 'sovereignGuarantee',
        icon: ShieldCheck,
        rate: 0.071,
        riskKey: 'zero',
        color: COLORS.bonds,
        descKey: 'bondsDesc',
        pros: ['100% Safe', 'Regular Income', 'Zero Default Risk'],
        cons: ['Long Lock-in', 'Moderate Returns']
    },
    chit: {
        id: 'chit',
        nameKey: 'chitFunds',
        metaphorKey: 'communityWell',
        subKey: 'communityPot',
        icon: Users,
        rate: 0.05,
        riskKey: 'high',
        color: COLORS.chit,
        descKey: 'chitDesc',
        pros: ['Easy Credit Access', 'No Paperwork', 'Community Trust'],
        cons: ['High Fraud Risk', 'Low Saver Returns']
    },
};

export default function InvestmentSimulation({ navigation }) {
    const { t } = useLanguage();
    const [monthlySavings, setMonthlySavings] = useState(5000);
    const [years, setYears] = useState(10);
    const [selectedItems, setSelectedItems] = useState(new Set(['mf']));
    const [detailsModal, setDetailsModal] = useState(null);
    const [compareModal, setCompareModal] = useState(false);

    // Animation values
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
        }).start();
    }, []);

    const results = useMemo(() => {
        const data = {};
        let maxVal = 0;

        Object.values(INVESTMENTS_DATA).forEach(inv => {
            const i = inv.rate / 12;
            const n = years * 12;
            // Compound Interest Formula for SIP: FV = P * ([(1 + i)^n - 1] / i) * (1 + i)
            const fv = monthlySavings * ((Math.pow(1 + i, n) - 1) / i) * (1 + i);
            data[inv.id] = Math.round(fv);
            if (data[inv.id] > maxVal) maxVal = data[inv.id];
        });
        return { data, maxVal };
    }, [monthlySavings, years]);

    const toggleSelection = (id) => {
        const next = new Set(selectedItems);
        if (next.has(id)) {
            if (next.size > 1) next.delete(id);
        } else {
            if (next.size >= 3) return;
            next.add(id);
        }
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setSelectedItems(next);
    };

    const formatCurrency = (val) => {
        if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)} Cr`;
        if (val >= 100000) return `₹${(val / 100000).toFixed(2)} L`;
        return `₹${val.toLocaleString('en-IN')}`;
    };

    const getRiskColor = (risk) => {
        switch (risk.toLowerCase()) {
            case 'zero': return COLORS.success;
            case 'low': return COLORS.success;
            case 'medium': return COLORS.warning;
            case 'high': return COLORS.danger;
            default: return COLORS.secondary;
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor={COLORS.surface} />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <ChevronLeft color={COLORS.primary} size={28} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{t('investmentSimulator')}</Text>
                <TouchableOpacity style={styles.infoBtn}>
                    <Info color={COLORS.secondary} size={22} />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                {/* Hero Visualization */}
                <Animated.View style={[styles.heroCard, { opacity: fadeAnim }]}>
                    <LinearGradient
                        colors={['#1E293B', '#0F172A']}
                        style={styles.heroGradient}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                    >
                        <View style={styles.heroHeader}>
                            <View>
                                <Text style={styles.heroSubtitle}>Estimated Wealth in {years}y</Text>
                                <Text style={styles.heroMainValue}>
                                    {formatCurrency(results.data[Array.from(selectedItems)[0]])}
                                </Text>
                            </View>
                            <View style={styles.growthBadge}>
                                <ArrowUpRight size={16} color={COLORS.success} />
                                <Text style={styles.growthText}>Growth</Text>
                            </View>
                        </View>

                        {/* Mini Chart Mock */}
                        <View style={styles.chartContainer}>
                            {[0.2, 0.4, 0.3, 0.6, 0.5, 0.8, 0.7, 1.0].map((h, idx) => (
                                <View key={idx} style={[styles.chartBar, { height: 40 * h, opacity: 0.3 + (h * 0.7) }]} />
                            ))}
                        </View>
                    </LinearGradient>
                </Animated.View>

                {/* Controls */}
                <View style={styles.controlsCard}>
                    <View style={styles.controlRow}>
                        <View style={styles.controlHeader}>
                            <Text style={styles.controlLabel}>{t('monthlyInvestment')}</Text>
                            <Text style={styles.controlValue}>₹{monthlySavings.toLocaleString('en-IN')}</Text>
                        </View>
                        <Slider
                            style={styles.slider}
                            minimumValue={1000}
                            maximumValue={100000}
                            step={1000}
                            value={monthlySavings}
                            onValueChange={setMonthlySavings}
                            minimumTrackTintColor={COLORS.accent}
                            maximumTrackTintColor={COLORS.border}
                            thumbTintColor={COLORS.accent}
                        />
                    </View>

                    <View style={[styles.controlRow, { marginTop: 20 }]}>
                        <View style={styles.controlHeader}>
                            <Text style={styles.controlLabel}>{t('timePeriod')}</Text>
                            <Text style={styles.controlValue}>{years} {t('yearsLabel')}</Text>
                        </View>
                        <Slider
                            style={styles.slider}
                            minimumValue={1}
                            maximumValue={40}
                            step={1}
                            value={years}
                            onValueChange={setYears}
                            minimumTrackTintColor={COLORS.accent}
                            maximumTrackTintColor={COLORS.border}
                            thumbTintColor={COLORS.accent}
                        />
                    </View>
                </View>

                <View style={styles.sectionHeaderRow}>
                    <Text style={styles.sectionTitle}>{t('projectedWealth')}</Text>
                    <Text style={styles.sectionSub}>Select up to 3 to compare</Text>
                </View>

                {Object.values(INVESTMENTS_DATA).map((inv) => {
                    const value = results.data[inv.id];
                    const percent = (value / results.maxVal) * 100;
                    const isSelected = selectedItems.has(inv.id);
                    const IconComp = inv.icon;

                    return (
                        <TouchableOpacity
                            key={inv.id}
                            style={styles.invCard}
                            onPress={() => toggleSelection(inv.id)}
                            activeOpacity={0.7}
                        >
                            <View style={styles.invTop}>
                                <IconComp size={28} color={inv.color} strokeWidth={2.5} />
                                <View style={styles.invInfo}>
                                    <Text style={styles.invName}>{t(inv.nameKey)}</Text>
                                    <View style={styles.invMeta}>
                                        <View style={[styles.riskBadge, { backgroundColor: `${getRiskColor(inv.riskKey)}15` }]}>
                                            <View style={[styles.riskDot, { backgroundColor: getRiskColor(inv.riskKey) }]} />
                                            <Text style={[styles.riskText, { color: getRiskColor(inv.riskKey) }]}>
                                                {t(inv.riskKey)}
                                            </Text>
                                        </View>
                                        <View style={[styles.returnBadge, { backgroundColor: `${inv.color}15` }]}>
                                            <Text style={[styles.returnText, { color: inv.color }]}>
                                                {(inv.rate * 100).toFixed(1)}%
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                                <View style={styles.invRight}>
                                    <Text style={styles.invAmount}>{formatCurrency(value)}</Text>
                                    {isSelected && (
                                        <View style={[styles.checkCircle, { backgroundColor: inv.color }]}>
                                            <CheckCircle2 size={16} color="#FFF" strokeWidth={3} />
                                        </View>
                                    )}
                                </View>
                            </View>

                            {/* Progress Bar */}
                            <View style={styles.progressContainer}>
                                <LinearGradient
                                    colors={[inv.color, `${inv.color}DD`]}
                                    style={[styles.progressBar, { width: `${Math.max(percent, 5)}%` }]}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                />
                            </View>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>

            {/* Compare FAB */}
            {selectedItems.size >= 2 && (
                <View style={styles.fabContainer}>
                    <TouchableOpacity style={styles.fab} onPress={() => setCompareModal(true)}>
                        <Scale size={20} color="#FFF" />
                        <Text style={styles.fabText}>{t('compare')} ({selectedItems.size})</Text>
                    </TouchableOpacity>
                </View>
            )}

            {/* Details Modal */}
            <Modal visible={!!detailsModal} transparent animationType="slide">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHandle} />
                        <TouchableOpacity style={styles.closeModalBtn} onPress={() => setDetailsModal(null)}>
                            <X size={24} color={COLORS.secondary} />
                        </TouchableOpacity>

                        {detailsModal && (
                            <ScrollView showsVerticalScrollIndicator={false}>
                                <View style={styles.modalHeader}>
                                    <View style={[styles.modalIconBox, { backgroundColor: `${detailsModal.color}15` }]}>
                                        {React.createElement(detailsModal.icon, { size: 32, color: detailsModal.color })}
                                    </View>
                                    <Text style={styles.modalTitle}>{t(detailsModal.nameKey)}</Text>
                                    <Text style={styles.modalMetaphor}>"{t(detailsModal.metaphorKey)}"</Text>
                                </View>

                                <View style={styles.modalStatsRow}>
                                    <View style={styles.modalStat}>
                                        <Text style={styles.statLabel}>Avg. Return</Text>
                                        <Text style={[styles.statValue, { color: detailsModal.color }]}>{(detailsModal.rate * 100).toFixed(1)}%</Text>
                                    </View>
                                    <View style={styles.modalStat}>
                                        <Text style={styles.statLabel}>Risk Level</Text>
                                        <Text style={[styles.statValue, { color: getRiskColor(detailsModal.riskKey) }]}>{t(detailsModal.riskKey)}</Text>
                                    </View>
                                </View>

                                <Text style={styles.modalDescription}>{t(detailsModal.descKey)}</Text>

                                <View style={styles.prosContainer}>
                                    <Text style={styles.prosTitle}>{t('pros')}</Text>
                                    {detailsModal.pros.map((item, i) => (
                                        <View key={i} style={styles.proItem}>
                                            <CheckCircle2 size={16} color={COLORS.success} />
                                            <Text style={styles.proText}>{item}</Text>
                                        </View>
                                    ))}
                                </View>

                                <View style={styles.consContainer}>
                                    <Text style={styles.consTitle}>{t('cons')}</Text>
                                    {detailsModal.cons.map((item, i) => (
                                        <View key={i} style={styles.proItem}>
                                            <AlertTriangle size={16} color={COLORS.danger} />
                                            <Text style={styles.proText}>{item}</Text>
                                        </View>
                                    ))}
                                </View>

                                <TouchableOpacity style={[styles.actionBtn, { backgroundColor: detailsModal.color }]} onPress={() => setDetailsModal(null)}>
                                    <Text style={styles.actionBtnText}>{t('done')}</Text>
                                </TouchableOpacity>
                            </ScrollView>
                        )}
                    </View>
                </View>
            </Modal>

            {/* Compare Modal */}
            <Modal visible={compareModal} transparent animationType="slide">
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContent, { height: '70%', paddingBottom: 0 }]}>
                        <View style={styles.modalHandle} />
                        <View style={styles.modalHeaderCompact}>
                            <Text style={styles.compareTitle}>{t('comparison')}</Text>
                            <TouchableOpacity onPress={() => setCompareModal(false)}>
                                <X size={24} color={COLORS.secondary} />
                            </TouchableOpacity>
                        </View>

                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.compareScroll}>
                            <View style={styles.compareWrapper}>
                                <View style={styles.compareLabelsCol}>
                                    <Text style={styles.compareHeaderLabel}>Metric</Text>
                                    <Text style={styles.compareLabel}>{t('returnRate')}</Text>
                                    <Text style={styles.compareLabel}>{t('risk')}</Text>
                                    <Text style={styles.compareLabel}>{t('totalValue')}</Text>
                                </View>

                                {Array.from(selectedItems).map(id => {
                                    const inv = INVESTMENTS_DATA[id];
                                    return (
                                        <View key={id} style={styles.compareDataCol}>
                                            <View style={[styles.compareIconBox, { backgroundColor: inv.color }]}>
                                                {React.createElement(inv.icon, { size: 22, color: '#FFF' })}
                                            </View>
                                            <Text style={styles.compareName} numberOfLines={2}>{t(inv.nameKey)}</Text>
                                            <View style={[styles.compareValBox, { backgroundColor: `${inv.color}10` }]}>
                                                <Text style={[styles.compareVal, { color: inv.color }]}>{(inv.rate * 100).toFixed(1)}%</Text>
                                            </View>
                                            <View style={[styles.compareValBox, { backgroundColor: `${getRiskColor(inv.riskKey)}10` }]}>
                                                <Text style={[styles.compareVal, { color: getRiskColor(inv.riskKey) }]}>{t(inv.riskKey)}</Text>
                                            </View>
                                            <View style={[styles.compareValBox, { backgroundColor: '#F1F5F9' }]}>
                                                <Text style={[styles.compareVal, { fontWeight: '900', color: COLORS.primary }]}>{formatCurrency(results.data[id])}</Text>
                                            </View>
                                        </View>
                                    );
                                })}
                            </View>
                        </ScrollView>

                        <TouchableOpacity style={styles.compareCloseBtn} onPress={() => setCompareModal(false)}>
                            <Text style={styles.compareCloseBtnText}>{t('close')}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.surface },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: COLORS.surface,
    },
    backBtn: { padding: 4 },
    headerTitle: { fontSize: 18, fontWeight: '700', color: COLORS.primary },
    infoBtn: { padding: 4 },
    scrollContent: { padding: 20, paddingBottom: 100 },

    // Hero Section
    heroCard: {
        borderRadius: 24,
        overflow: 'hidden',
        marginBottom: 20,
        elevation: 10,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.2,
        shadowRadius: 15,
    },
    heroGradient: { padding: 24, minHeight: 140 },
    heroHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
    heroSubtitle: { color: 'rgba(255,255,255,0.6)', fontSize: 13, fontWeight: '600' },
    heroMainValue: { color: '#FFFFFF', fontSize: 32, fontWeight: '800', marginTop: 4 },
    growthBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(16,185,129,0.2)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
    growthText: { color: COLORS.success, fontSize: 11, fontWeight: '700', marginLeft: 4 },
    chartContainer: { flexDirection: 'row', alignItems: 'flex-end', gap: 6, marginTop: 20 },
    chartBar: { width: 12, backgroundColor: '#FFF', borderRadius: 6 },

    // Controls
    controlsCard: { backgroundColor: '#F1F5F9', padding: 24, borderRadius: 24, marginBottom: 30 },
    controlRow: {},
    controlHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 12 },
    controlLabel: { fontSize: 13, fontWeight: '600', color: COLORS.secondary },
    controlValue: { fontSize: 20, fontWeight: '700', color: COLORS.primary },
    slider: { width: '100%', height: 40 },

    // Section Header
    sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 16 },
    sectionTitle: { fontSize: 18, fontWeight: '800', color: COLORS.primary },
    sectionSub: { fontSize: 12, color: COLORS.secondary },

    // Cards
    invCard: {
        backgroundColor: COLORS.surface,
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
    },
    invTop: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        marginBottom: 12,
        gap: 12,
    },
    invInfo: { 
        flex: 1,
    },
    invName: { 
        fontSize: 15, 
        fontWeight: '700', 
        color: COLORS.primary, 
        marginBottom: 6,
    },
    invMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    riskBadge: { 
        flexDirection: 'row', 
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 8,
    },
    riskDot: { 
        width: 5, 
        height: 5, 
        borderRadius: 3, 
        marginRight: 4,
    },
    riskText: { 
        fontSize: 10, 
        fontWeight: '700', 
        textTransform: 'uppercase', 
        letterSpacing: 0.3,
    },
    returnBadge: {
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 8,
    },
    returnText: {
        fontSize: 10,
        fontWeight: '800',
        letterSpacing: 0.2,
    },
    invRight: { 
        alignItems: 'flex-end',
        gap: 6,
    },
    invAmount: { 
        fontSize: 16, 
        fontWeight: '900', 
        color: COLORS.primary,
    },
    progressContainer: { 
        height: 5, 
        backgroundColor: '#F1F5F9', 
        borderRadius: 3, 
        overflow: 'hidden',
    },
    progressBar: { 
        height: '100%', 
        borderRadius: 3,
    },
    checkCircle: { 
        width: 24, 
        height: 24, 
        borderRadius: 12, 
        justifyContent: 'center', 
        alignItems: 'center',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },

    // FAB
    fabContainer: { position: 'absolute', bottom: 30, left: 0, right: 0, alignItems: 'center' },
    fab: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.primary,
        paddingHorizontal: 24,
        paddingVertical: 14,
        borderRadius: 30,
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
    },
    fabText: { color: '#FFFFFF', fontWeight: '800', fontSize: 15, marginLeft: 10 },

    // Modal
    modalOverlay: { flex: 1, backgroundColor: 'rgba(15,23,42,0.8)', justifyContent: 'flex-end' },
    modalContent: { backgroundColor: COLORS.surface, borderTopLeftRadius: 32, borderTopRightRadius: 32, padding: 24, maxHeight: '90%' },
    modalHandle: { width: 40, height: 5, backgroundColor: COLORS.border, borderRadius: 3, alignSelf: 'center', marginBottom: 12 },
    closeModalBtn: { alignSelf: 'flex-end', padding: 4 },
    modalHeader: { alignItems: 'center', marginBottom: 24 },
    modalIconBox: { width: 64, height: 64, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
    modalTitle: { fontSize: 24, fontWeight: '800', color: COLORS.primary },
    modalMetaphor: { fontSize: 14, fontStyle: 'italic', color: COLORS.secondary, marginTop: 4 },
    modalStatsRow: { flexDirection: 'row', backgroundColor: '#F8FAFC', borderRadius: 20, padding: 20, marginBottom: 24, gap: 20 },
    modalStat: { flex: 1, alignItems: 'center' },
    statLabel: { fontSize: 11, color: COLORS.secondary, fontWeight: '700', marginBottom: 4 },
    statValue: { fontSize: 18, fontWeight: '800' },
    modalDescription: { fontSize: 15, lineHeight: 24, color: COLORS.text, marginBottom: 24, textAlign: 'center' },
    prosContainer: { marginBottom: 20 },
    prosTitle: { fontSize: 14, fontWeight: '800', color: COLORS.success, marginBottom: 12 },
    consContainer: { marginBottom: 30 },
    consTitle: { fontSize: 14, fontWeight: '800', color: COLORS.danger, marginBottom: 12 },
    proItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
    proText: { flex: 1, marginLeft: 10, fontSize: 13, color: COLORS.text, fontWeight: '500' },
    actionBtn: { paddingVertical: 18, borderRadius: 20, alignItems: 'center' },
    actionBtnText: { color: '#FFF', fontWeight: '800', fontSize: 16 },

    // Comparison
    modalHeaderCompact: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: 24,
        paddingBottom: 16,
        borderBottomWidth: 2,
        borderBottomColor: COLORS.border,
    },
    compareTitle: { fontSize: 22, fontWeight: '900', color: COLORS.primary },
    compareScroll: { marginHorizontal: -24, marginBottom: 20 },
    compareWrapper: { flexDirection: 'row', paddingHorizontal: 24 },
    compareLabelsCol: { 
        width: 110, 
        paddingRight: 12,
        backgroundColor: '#F8FAFC',
        borderRadius: 16,
        padding: 12,
    },
    compareDataCol: { 
        width: 150, 
        alignItems: 'center', 
        backgroundColor: COLORS.surface,
        borderRadius: 16,
        padding: 12,
        marginLeft: 12,
        borderWidth: 2,
        borderColor: COLORS.border,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
    },
    compareHeaderLabel: { 
        fontSize: 12, 
        fontWeight: '800', 
        color: COLORS.primary, 
        height: 70, 
        textAlignVertical: 'center',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    compareLabel: { 
        height: 56, 
        fontSize: 14, 
        color: COLORS.text, 
        fontWeight: '700', 
        textAlignVertical: 'center',
        paddingVertical: 8,
    },
    compareIconBox: { 
        width: 48, 
        height: 48, 
        borderRadius: 24, 
        justifyContent: 'center', 
        alignItems: 'center',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
    },
    compareName: { 
        fontSize: 14, 
        fontWeight: '900', 
        color: COLORS.primary, 
        marginTop: 10, 
        height: 44, 
        textAlign: 'center',
        lineHeight: 18,
    },
    compareVal: { 
        height: 56, 
        fontSize: 15, 
        color: COLORS.text, 
        fontWeight: '700', 
        textAlignVertical: 'center',
        paddingVertical: 8,
    },
    compareValBox: {
        width: '100%',
        height: 56,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 12,
        marginVertical: 4,
    },
    compareCloseBtn: { 
        marginHorizontal: 24, 
        marginBottom: 24,
        backgroundColor: COLORS.primary, 
        paddingVertical: 18, 
        borderRadius: 20, 
        alignItems: 'center',
        elevation: 4,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    compareCloseBtnText: { color: '#FFF', fontWeight: '900', fontSize: 17, letterSpacing: 0.5 }
});
