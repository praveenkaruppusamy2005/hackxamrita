import React, { useState, useEffect } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    TextInput,
    ActivityIndicator,
    StatusBar,
    Image,
    Dimensions,
    ScrollView,
    Animated,
    Vibration,
} from 'react-native';
import { Camera, useCameraDevice, useCodeScanner } from 'react-native-vision-camera';
import { ChevronLeft, QrCode, Smartphone, CreditCard, UserCircle, Droplet, Tv, Zap, CheckCircle2, ArrowRight, Image as ImageIcon, X, AlertCircle, Delete, Check, ChevronDown, Eye } from 'lucide-react-native';
import { useLanguage } from './LanguageContext';

const { width } = Dimensions.get('window');

const STEPS = {
    HOME: 'HOME',
    SCAN: 'SCAN',
    AMOUNT: 'AMOUNT',
    PIN: 'PIN',
    SUCCESS: 'SUCCESS',
};

const COLORS = {
    primary: '#1A73E8',
    secondary: '#1E293B',
    background: '#FFFFFF',
    card: '#FFFFFF',
    text: '#202124',
    subText: '#5F6368',
    success: '#10B981',
    error: '#EF4444',
    border: '#E8EAED',
    lightBlue: '#E8F0FE',
    navBg: '#F8F9FA'
};

const PAYEE_PERSONAS = [
    { name: 'Saravana Stores', id: 'saravana@okicici', color: '#EF4444', isBusiness: true },
    { name: 'A2B Sweets', id: 'a2b@okhdfcbank', color: '#F59E0B', isBusiness: true },
    { name: 'Karthik Raja', id: 'karthik@oksbi', color: '#10B981', isBusiness: false },
    { name: 'Anitha S', id: 'anitha@okaxis', color: '#8B5CF6', isBusiness: false },
    { name: 'Lakshmi N', id: 'lakshmi@okicici', color: '#EC4899', isBusiness: false },
    { name: 'Senthil K', id: 'senthil@oksbi', color: '#3B82F6', isBusiness: false },
    { name: 'Madurai Mess', id: 'mess@okhdfcbank', color: '#F97316', isBusiness: true },
];

const Avatar = ({ name, color, size = 56, fontSize = 20 }) => (
    <View style={[styles.avatar, { width: size, height: size, borderRadius: size / 2, backgroundColor: color }]}>
        <Text style={[styles.avatarText, { fontSize }]}>{name.charAt(0)}</Text>
    </View>
);

export default function UPISimulationScreen({ navigation, route }) {
    const { t } = useLanguage();
    const [step, setStep] = useState(STEPS.HOME);
    const [amount, setAmount] = useState('');
    const [pin, setPin] = useState('');
    const [loading, setLoading] = useState(false);
    const [payee, setPayee] = useState(PAYEE_PERSONAS[0]);

    // Camera hooks
    const device = useCameraDevice('back');
    const [hasCamPermission, setHasCamPermission] = useState(false);
    const [camActive, setCamActive] = useState(false);

    useEffect(() => {
        if (route?.params?.initialStep) setStep(STEPS[route.params.initialStep] || STEPS.HOME);
        checkCameraPermission();
    }, [route]);

    useEffect(() => {
        setCamActive(step === STEPS.SCAN);
    }, [step]);

    const checkCameraPermission = async () => {
        const status = await Camera.requestCameraPermission();
        setHasCamPermission(status === 'granted');
    };

    const codeScanner = useCodeScanner({
        codeTypes: ['qr', 'ean-13'],
        onCodeScanned: (codes) => {
            if (camActive && codes.length > 0) {
                Vibration.vibrate();
                setCamActive(false); // Stop scanning immediately
                handleScannedData(codes[0].value);
            }
        }
    });

    const handleScannedData = (data) => {
        let newPayee = { name: t('unknownMerchant') || 'Merchant', id: 'merchant@upi', color: '#64748B', isBusiness: true };

        // Parse basic UPI QR format: upi://pay?pa=...&pn=...
        if (typeof data === 'string' && data.startsWith('upi://')) {
            try {
                // Split url format and just use custom matching logic
                const queryParts = data.split('?')[1]?.split('&');
                let pa = '';
                let pn = '';
                queryParts?.forEach(part => {
                    const [key, value] = part.split('=');
                    if (key === 'pa') pa = decodeURIComponent(value);
                    if (key === 'pn') pn = decodeURIComponent(value);
                });

                if (pa) {
                    newPayee = { name: pn || pa, id: pa, color: COLORS.primary, isBusiness: true };
                }
            } catch (e) {
                console.log('Error parsing QR', e);
            }
        }

        setPayee(newPayee);
        nextStep(STEPS.AMOUNT);
    };

    // Virtual manual scan (if button pressed)
    const handleMockScan = () => {
        handleScannedData('upi://pay?pa=reliance@okaxis&pn=Reliance Smart');
    };

    const nextStep = (next, targetPayee) => {
        if (targetPayee) setPayee(targetPayee);
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setStep(next);
            if (next === STEPS.PIN) setPin('');
        }, 400);
    };

    // --- Renderers ---
    const renderHome = () => (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
                    <ChevronLeft size={26} color={COLORS.text} />
                </TouchableOpacity>
                <Avatar name="User" color="#E8F0FE" size={40} fontSize={18} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Scan CTA */}
                <TouchableOpacity
                    style={styles.heroButton}
                    activeOpacity={0.9}
                    onPress={() => setStep(STEPS.SCAN)}
                >
                    <View style={styles.heroGlow}>
                        <QrCode color={COLORS.primary} size={36} />
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.heroText}>{t('scanAnyQr') || 'Scan any QR'}</Text>
                        <Text style={styles.heroSubText}>{t('payAtShops') || 'Pay at shops & send money'}</Text>
                    </View>
                    <ChevronLeft size={24} color={COLORS.primary} style={{ transform: [{ rotate: '180deg' }] }} />
                </TouchableOpacity>

                {/* Grid Actions */}
                <View style={styles.actionGrid}>
                    {[
                        { icon: UserCircle, label: t('payContacts') || 'Pay contacts', color: '#1A73E8' },
                        { icon: Smartphone, label: t('payPhoneNumber') || 'Pay phone number', color: '#1A73E8' },
                        { icon: CreditCard, label: t('bankTransfer') || 'Bank transfer', color: '#1A73E8' },
                        { icon: UserCircle, label: t('selfTransfer') || 'Self transfer', color: '#1A73E8' },
                    ].map((item, idx) => (
                        <TouchableOpacity key={idx} style={styles.actionItem}>
                            <View style={styles.actionIcon}>
                                <item.icon size={26} color={item.color} />
                            </View>
                            <Text style={styles.actionLabel}>{item.label}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* People Horizontal List */}
                <View style={styles.section}>
                    <Text style={styles.sectionHeader}>{t('people') || 'People'}</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.avatarList}>
                        {PAYEE_PERSONAS.filter(p => !p.isBusiness).map((p, i) => (
                            <TouchableOpacity key={i} style={styles.personItem} onPress={() => nextStep(STEPS.AMOUNT, p)}>
                                <Avatar name={p.name} color={p.color} />
                                <Text style={styles.personName} numberOfLines={1}>{p.name.split(' ')[0]}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                {/* Businesses */}
                <View style={styles.section}>
                    <View style={styles.sectionHeaderRow}>
                        <Text style={styles.sectionHeader}>{t('businesses') || 'Businesses'}</Text>
                        <TouchableOpacity><Text style={styles.linkText}>{t('explore') || 'Explore'}</Text></TouchableOpacity>
                    </View>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.avatarList}>
                        {PAYEE_PERSONAS.filter(p => p.isBusiness).map((p, i) => (
                            <TouchableOpacity key={i} style={styles.personItem} onPress={() => nextStep(STEPS.AMOUNT, p)}>
                                <Avatar name={p.name} color={p.color} />
                                <Text style={styles.personName} numberOfLines={1}>{p.name.split(' ')[0]}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                {/* Bills */}
                <View style={styles.section}>
                    <Text style={styles.sectionHeader}>{t('billsRecharges') || 'Bills & Recharges'}</Text>
                    <View style={styles.billGrid}>
                        {[
                            { icon: Smartphone, label: t('mobileRecharge') || 'Mobile\nRecharge' },
                            { icon: Zap, label: t('electricity') || 'Electricity' },
                            { icon: Tv, label: t('dthCable') || 'DTH /\nCable' },
                            { icon: Droplet, label: t('water') || 'Water' },
                        ].map((item, idx) => (
                            <TouchableOpacity key={idx} style={styles.billItem}>
                                <View style={styles.billIconCircle}>
                                    <item.icon size={22} color="#1A73E8" />
                                </View>
                                <Text style={styles.billLabel}>{item.label}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            </ScrollView>
        </View>
    );

    const renderScan = () => (
        <View style={styles.fullScreenBlack}>
            <StatusBar barStyle="light-content" backgroundColor="#000" />

            {/* Real Camera View */}
            {device && hasCamPermission ? (
                <Camera
                    style={StyleSheet.absoluteFill}
                    device={device}
                    isActive={camActive}
                    codeScanner={codeScanner}
                />
            ) : (
                <View style={styles.cameraAltView}>
                    <Text style={{ color: '#888' }}>{t('noCameraPermission') || 'No Camera Permission. Give Permission and restart app.'}</Text>
                </View>
            )}

            <SafeAreaView style={styles.scanOverlayWrapper}>
                <View style={styles.scanHeaderRow}>
                    <TouchableOpacity onPress={() => { setCamActive(false); setStep(STEPS.HOME); }} style={styles.circleBtn}>
                        <X size={24} color="#FFF" />
                    </TouchableOpacity>
                    <Text style={styles.scanTitleText}>{t('scanQrCode') || 'Scan QR Code'}</Text>
                    <TouchableOpacity style={styles.circleBtn}>
                        <Zap size={20} color="#FFF" />
                    </TouchableOpacity>
                </View>

                <View style={styles.scanFrameContainer}>
                    <View style={styles.scanCornerTL} />
                    <View style={styles.scanCornerTR} />
                    <View style={styles.scanCornerBL} />
                    <View style={styles.scanCornerBR} />

                    {/* Fallback mock scan if you can't scan a real screen during simulation */}
                    <TouchableOpacity style={styles.triggerMockScanBtn} onPress={handleMockScan}>
                        <Text style={styles.triggerMockScanText}>{t('tapToScanMock') || 'Tap if you have no physical QR'}</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.scanFooterRow}>
                    <TouchableOpacity style={styles.galleryPill}>
                        <ImageIcon size={20} color="#FFF" />
                        <Text style={styles.galleryText}>{t('gallery') || 'Upload from gallery'}</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </View>
    );

    const renderAmount = () => (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => setStep(STEPS.HOME)} style={styles.iconButton}>
                    <X size={26} color={COLORS.text} />
                </TouchableOpacity>
            </View>

            <View style={styles.payeeInfo}>
                <Avatar name={payee.name} color={payee.color} size={80} fontSize={32} />
                <Text style={styles.payeeNameLarge}>{payee.name}</Text>
                <Text style={styles.payeeId}>{payee.id}</Text>
                {payee.isBusiness && (
                    <View style={styles.verifiedBadge}>
                        <CheckCircle2 size={14} color={COLORS.success} />
                        <Text style={styles.verifiedText}>{t('verifiedMerchant') || 'Verified Merchant'}</Text>
                    </View>
                )}
            </View>

            <View style={styles.amountInputContainer}>
                <Text style={styles.currencySymbol}>₹</Text>
                <TextInput
                    style={styles.amountInput}
                    value={amount}
                    onChangeText={setAmount}
                    placeholder="0"
                    placeholderTextColor="#BDC1C6"
                    keyboardType="numeric"
                    autoFocus
                />
            </View>

            <TextInput
                style={styles.noteInput}
                placeholder={t('addNote') || 'Add a note'}
                placeholderTextColor={COLORS.subText}
            />

            <View style={styles.footerGpayBtn}>
                <TouchableOpacity
                    style={[styles.payBtnGpay, amount && parseFloat(amount) > 0 ? {} : styles.disabledBtnGpay]}
                    disabled={!amount || parseFloat(amount) <= 0}
                    onPress={() => nextStep(STEPS.PIN)}
                >
                    <ArrowRight size={24} color="#FFF" />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );

    const renderPin = () => (
        <SafeAreaView style={styles.npciPinScreen}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

            {/* Top Header */}
            <View style={styles.npciBankHeaderRow}>
                <View>
                    <Text style={styles.npciBankName}>Bank {t('stateBankOfIndia') || 'State Bank of India'}</Text>
                    <Text style={styles.npciBankSub}>XXXX8406</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 10 }}>
                    <Text style={{ fontSize: 26, fontStyle: 'italic', fontWeight: '900', color: '#666', letterSpacing: -1.5 }}>UPI</Text>
                    <View style={{ width: 0, height: 0, borderTopWidth: 8, borderTopColor: 'transparent', borderBottomWidth: 8, borderBottomColor: 'transparent', borderLeftWidth: 8, borderLeftColor: '#008000', marginLeft: 4 }} />
                </View>
            </View>

            {/* To and Sending Info */}
            <View style={styles.npciPayeeBox}>
                <View style={styles.npciPayeeRow}>
                    <Text style={styles.npciLabelText}>{t('to') || 'To'}:</Text>
                    <Text style={styles.npciValueText}>{payee.name}</Text>
                </View>
                <View style={styles.npciPayeeRow}>
                    <Text style={styles.npciLabelText}>{t('sending') || 'Sending'}:</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={styles.npciAmountText}>₹ {amount}.00</Text>
                        <ChevronDown size={20} color="#000" style={{ marginLeft: 16 }} />
                    </View>
                </View>
            </View>

            {/* Middle PIN area */}
            <View style={styles.npciMiddleBox}>
                <Text style={styles.npciPinInstruction}>{t('enter6DigitUpiPin') || 'ENTER 6-DIGIT UPI PIN'}</Text>
                <View style={styles.npciDotsRow}>
                    {[1, 2, 3, 4, 5, 6].map((_, i) => (
                        <View key={i} style={styles.npciDotContainer}>
                            {pin.length > i ? (
                                <View style={styles.npciDotFilled} />
                            ) : (
                                <View style={styles.npciDotLine} />
                            )}
                        </View>
                    ))}
                </View>

                <View style={styles.npciActionsRow}>
                    <TouchableOpacity>
                        <Text style={styles.npciForgotText}>{t('forgotUpiPin') || 'Forgot UPI PIN?'}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Eye size={16} color="#A0AEC0" />
                        <Text style={styles.npciShowText}>{t('show') || 'SHOW'}</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.npciWarningBox}>
                    <View style={styles.npciWarningIconBox}>
                        <AlertCircle size={20} color="#D97706" />
                    </View>
                    <Text style={styles.npciWarningText}>
                        {t('transferringMoneyWarning') || `You are transferring money from your account to ${payee.name}`}
                    </Text>
                </View>
            </View>

            {/* Numpad */}
            <View style={styles.npciKeyboard}>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                    <TouchableOpacity key={n} style={styles.npciKey} onPress={() => pin.length < 6 && setPin(pin + n)}>
                        <Text style={styles.npciKeyText}>{n}</Text>
                    </TouchableOpacity>
                ))}
                <TouchableOpacity style={styles.npciKey} onPress={() => setPin(pin.slice(0, -1))}>
                    <Delete size={28} color="#1E3A8A" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.npciKey} onPress={() => pin.length < 6 && setPin(pin + '0')}>
                    <Text style={styles.npciKeyText}>0</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.npciKey} onPress={() => pin.length === 6 && nextStep(STEPS.SUCCESS)}>
                    <View style={styles.npciSubmitBtn}>
                        <Check size={28} color="#FFF" />
                    </View>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );

    const renderSuccess = () => (
        <View style={styles.successWrapper}>
            <StatusBar barStyle="dark-content" backgroundColor="#F4FCE3" />

            <View style={styles.successTopBox}>
                <CheckCircle2 size={64} color="#0F9D58" />
                <Text style={styles.successHeading}>{t('paidSuccessfully') || 'Paid Successfully'}</Text>
                <Text style={styles.successAmountFinal}>₹{amount}</Text>
                <Text style={styles.successSubFinal}>{t('to') || 'to'} {payee.name}</Text>
            </View>

            <View style={styles.successDetailsBox}>
                <View style={styles.successRow}>
                    <Text style={{ color: '#5F6368' }}>{t('upiTransactionId') || 'UPI Transaction ID'}</Text>
                    <Text style={{ fontWeight: '500' }}>{Math.floor(100000000000 + Math.random() * 900000000000)}</Text>
                </View>
                <View style={styles.successRow}>
                    <Text style={{ color: '#5F6368' }}>{t('to') || 'To'}</Text>
                    <Text style={{ fontWeight: '500' }}>{payee.id}</Text>
                </View>
                <View style={styles.successRow}>
                    <Text style={{ color: '#5F6368' }}>{t('from') || 'From'}: State Bank of India</Text>
                    <Text style={{ fontWeight: '500' }}>Amrita User</Text>
                </View>
            </View>

            <TouchableOpacity style={styles.doneBtnPill} onPress={() => navigation.goBack()}>
                <Text style={styles.doneBtnText}>{t('done') || 'Done'}</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={{ flex: 1 }}>
            {loading && (
                <View style={styles.loaderOverlay}>
                    <ActivityIndicator size="large" color={COLORS.primary} />
                </View>
            )}
            {step === STEPS.HOME && renderHome()}
            {step === STEPS.SCAN && renderScan()}
            {step === STEPS.AMOUNT && renderAmount()}
            {step === STEPS.PIN && renderPin()}
            {step === STEPS.SUCCESS && renderSuccess()}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    scrollContent: { paddingBottom: 40 },

    header: { flexDirection: 'row', justifyContent: 'space-between', padding: 16, alignItems: 'center' },
    iconButton: { padding: 4 },

    avatar: { alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
    avatarText: { color: '#FFF', fontWeight: 'bold' },

    heroButton: {
        marginHorizontal: 16, marginTop: 10,
        backgroundColor: '#FFF', borderRadius: 24,
        paddingVertical: 18, flexDirection: 'row', alignItems: 'center',
        elevation: 6, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 8, shadowOffset: { width: 0, height: 4 },
        borderWidth: 1, borderColor: COLORS.border,
        paddingHorizontal: 20
    },
    heroGlow: { backgroundColor: '#E8F0FE', width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center', marginRight: 16 },
    heroText: { color: COLORS.text, fontSize: 18, fontWeight: '700' },
    heroSubText: { color: COLORS.subText, fontSize: 13, marginTop: 4 },

    actionGrid: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 30 },
    actionItem: { alignItems: 'center', width: 75 },
    actionIcon: { marginBottom: 8 },
    actionLabel: { fontSize: 12, color: '#1A73E8', fontWeight: '500', textAlign: 'center' },

    section: { marginTop: 35 },
    sectionHeader: { fontSize: 18, fontWeight: '700', color: COLORS.text, marginBottom: 16, paddingHorizontal: 20 },
    sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, paddingHorizontal: 20 },
    linkText: { color: '#1A73E8', fontWeight: '600', fontSize: 14 },
    avatarList: { gap: 16, paddingHorizontal: 20 },
    personItem: { alignItems: 'center', width: 68 },
    personName: { fontSize: 12, color: COLORS.text, fontWeight: '500', textAlign: 'center' },

    billGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 16 },
    billItem: { width: '25%', alignItems: 'center', marginBottom: 20 },
    billIconCircle: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#F8F9FA', alignItems: 'center', justifyContent: 'center', marginBottom: 8, borderWidth: 1, borderColor: COLORS.border },
    billLabel: { fontSize: 11, textAlign: 'center', color: '#3C4043', fontWeight: '500' },

    fullScreenBlack: { flex: 1, backgroundColor: '#000' },
    cameraAltView: { ...StyleSheet.absoluteFillObject, justifyContent: 'center', alignItems: 'center', backgroundColor: '#111' },
    scanOverlayWrapper: { flex: 1, justifyContent: 'space-between' },
    scanHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', padding: 24, paddingTop: 40, alignItems: 'center' },
    circleBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
    scanTitleText: { color: 'white', fontSize: 18, fontWeight: '500' },
    scanFrameContainer: { alignItems: 'center', justifyContent: 'center', height: 260, width: 260, alignSelf: 'center' },
    scanCornerTL: { position: 'absolute', top: 0, left: 0, width: 40, height: 40, borderColor: '#FFF', borderTopWidth: 4, borderLeftWidth: 4, borderTopLeftRadius: 16 },
    scanCornerTR: { position: 'absolute', top: 0, right: 0, width: 40, height: 40, borderColor: '#FFF', borderTopWidth: 4, borderRightWidth: 4, borderTopRightRadius: 16 },
    scanCornerBL: { position: 'absolute', bottom: 0, left: 0, width: 40, height: 40, borderColor: '#FFF', borderBottomWidth: 4, borderLeftWidth: 4, borderBottomLeftRadius: 16 },
    scanCornerBR: { position: 'absolute', bottom: 0, right: 0, width: 40, height: 40, borderColor: '#FFF', borderBottomWidth: 4, borderRightWidth: 4, borderBottomRightRadius: 16 },
    triggerMockScanBtn: { backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20 },
    triggerMockScanText: { color: '#FFF', fontWeight: '600', fontSize: 12 },
    scanFooterRow: { padding: 40, alignItems: 'center' },
    galleryPill: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 30 },
    galleryText: { color: '#FFF', marginLeft: 8, fontWeight: '600' },

    payeeInfo: { alignItems: 'center', marginTop: 10 },
    payeeNameLarge: { fontSize: 24, fontWeight: '600', color: COLORS.text, marginTop: 16 },
    payeeId: { fontSize: 14, color: COLORS.subText, marginTop: 4 },
    verifiedBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#E6F4EA', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, marginTop: 8 },
    verifiedText: { fontSize: 12, color: '#137333', fontWeight: '600', marginLeft: 4 },
    amountInputContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 50 },
    currencySymbol: { fontSize: 40, color: COLORS.text, marginRight: 8, fontWeight: '400' },
    amountInput: { fontSize: 72, color: COLORS.text, fontWeight: '400', minWidth: 80, textAlign: 'center' },
    noteInput: { alignSelf: 'center', marginTop: 20, padding: 12, backgroundColor: '#F1F3F4', borderRadius: 20, textAlign: 'center', fontSize: 16, minWidth: 150 },
    footerGpayBtn: { flex: 1, justifyContent: 'flex-end', paddingBottom: 40, alignItems: 'center' },
    payBtnGpay: { backgroundColor: '#1A73E8', width: 64, height: 64, borderRadius: 32, alignItems: 'center', justifyContent: 'center', elevation: 4 },
    disabledBtnGpay: { backgroundColor: '#E8EAED', elevation: 0 },

    loaderOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(255,255,255,0.7)', justifyContent: 'center', alignItems: 'center', zIndex: 10 },

    npciPinScreen: { flex: 1, backgroundColor: '#FFFFFF' },
    npciBankHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 30, paddingBottom: 16, backgroundColor: '#FFFFFF' },
    npciBankName: { fontSize: 16, fontWeight: '700', color: '#000' },
    npciBankSub: { fontSize: 16, color: '#000', marginTop: 2 },
    npciPayeeBox: { backgroundColor: '#F3F4F6', paddingHorizontal: 20, paddingVertical: 16, borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#E5E7EB' },
    npciPayeeRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8, alignItems: 'center' },
    npciLabelText: { fontSize: 16, color: '#374151' },
    npciValueText: { fontSize: 16, color: '#000', fontWeight: 'bold' },
    npciAmountText: { fontSize: 16, color: '#000', fontWeight: 'bold' },
    npciMiddleBox: { flex: 1, backgroundColor: '#FFFFFF', alignItems: 'center', paddingTop: 40, paddingHorizontal: 20 },
    npciPinInstruction: { fontSize: 14, color: '#000', fontWeight: '600', letterSpacing: 0.5, marginBottom: 30 },
    npciDotsRow: { flexDirection: 'row', gap: 12, marginBottom: 40 },
    npciDotContainer: { width: 35, height: 35, alignItems: 'center', justifyContent: 'center' },
    npciDotLine: { width: 35, height: 2, backgroundColor: '#A0AEC0', position: 'absolute', bottom: 5 },
    npciDotFilled: { width: 12, height: 12, borderRadius: 6, backgroundColor: '#000' },
    npciActionsRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginBottom: 30, paddingHorizontal: 10 },
    npciForgotText: { color: '#1E3A8A', fontWeight: '700', fontSize: 15 },
    npciShowText: { color: '#A0AEC0', fontWeight: '700', fontSize: 14, marginLeft: 6 },
    npciWarningBox: { flexDirection: 'row', backgroundColor: '#FEF3C7', padding: 14, borderRadius: 8, alignItems: 'center', width: '100%' },
    npciWarningIconBox: { marginRight: 10 },
    npciWarningText: { color: '#92400E', fontSize: 13, flex: 1, fontWeight: '500', lineHeight: 20 },
    npciKeyboard: { flexDirection: 'row', flexWrap: 'wrap', backgroundColor: '#F3F4F6', paddingTop: 10, paddingBottom: 30 },
    npciKey: { width: '33.3%', height: 75, alignItems: 'center', justifyContent: 'center' },
    npciKeyText: { fontSize: 32, color: '#1E3A8A', fontWeight: '400' },
    npciSubmitBtn: { backgroundColor: '#1E3A8A', width: 50, height: 50, borderRadius: 25, alignItems: 'center', justifyContent: 'center' },

    successWrapper: { flex: 1, backgroundColor: '#F4FCE3', alignItems: 'center' },
    successTopBox: { alignItems: 'center', marginTop: 80 },
    successHeading: { fontSize: 20, color: '#202124', marginTop: 16 },
    successAmountFinal: { fontSize: 48, fontWeight: '500', color: '#202124', marginTop: 8 },
    successSubFinal: { fontSize: 16, color: '#5F6368', marginTop: 4 },

    successDetailsBox: { width: '90%', backgroundColor: '#FFF', borderRadius: 16, padding: 20, marginTop: 40, gap: 16, elevation: 1 },
    successRow: { flexDirection: 'row', justifyContent: 'space-between' },

    doneBtnPill: { marginTop: 'auto', marginBottom: 40, backgroundColor: '#1A73E8', paddingVertical: 14, paddingHorizontal: 40, borderRadius: 24 },
    doneBtnText: { color: '#FFF', fontWeight: '500', fontSize: 16 }
});
