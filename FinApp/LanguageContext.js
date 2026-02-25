import React, { createContext, useState, useContext } from 'react';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';














































































































































































































const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
    const [currentLanguage, setLangState] = useState('en-US');
    const [translations, setTranslations] = useState({});
    const [isTranslating, setIsTranslating] = useState(false);


    React.useEffect(() => {
        const loadSavedLanguage = async () => {
            try {
                const savedLang = await AsyncStorage.getItem('userLanguage');
                if (savedLang) {
                    setLangState(savedLang);
                }
            } catch (e) {
                console.error('Failed to load language from storage', e);
            }
        };
        loadSavedLanguage();
    }, []);


    const setCurrentLanguage = async (lang) => {
        setLangState(lang);
        try {
            await AsyncStorage.setItem('userLanguage', lang);
        } catch (e) {
            console.error('Failed to save language to storage', e);
        }
    };

    const baseDictionary = {
        hello: "Hello",
        greeting: "Good Morning,",
        goodMorning: "Good Morning,",
        goodAfternoon: "Good Afternoon,",
        goodEvening: "Good Evening,",
        goodNight: "Good Night,",
        govtSchemes: "Govt Schemes",
        status: "Status",
        active: "Active",
        explore: "Explore",
        loanCheck: "Loan Check",
        approval: "Approval",
        instant: "Instant",
        apply: "Apply",
        aiChatBot: "AI Chat Bot",
        service: "Service",
        tfs: "24/7",
        chat: "Chat",
        simulations: "Simulations",
        mode: "Mode",
        dar: "3D/AR",
        start: "Start",
        aiAssistant: "AI Assistant",
        aiHelp: "How can I help you today?",
        tapToSpeak: "Tap to Speak",
        tapToStop: "Tap to Stop",
        interaction: "Interaction",
        assistGreeting: "Hello! How can I assist you today?",
        continuousMode: "Continuous Listening",
        conversationCleared: "Conversation cleared. How can I help you?",
        chooseLanguage: "Choose Language",
        selectPreferred: "Select your preferred language",
        confirmContinue: "Confirm & Continue",
        profileDetails: "Profile Details",
        personalInfo: "Personal Information",
        mobileNumber: "Mobile Number",
        firstName: "First Name",
        gender: "Gender",
        dob: "Date of Birth",
        listening: "Listening...",
        next: "Next",
        male: "Male",
        female: "Female",
        other: "Other",
        fillThisNext: "Fill this next!",
        jobDetails: "Job Details",
        tellUsWork: "Tell us about your work",
        jobType: "Job Type",
        salaried: "Salaried",
        selfEmployed: "Self Employed",
        business: "Business",
        jobTitle: "Job Title",
        incomeDetails: "Income Details",
        tellUsIncome: "Tell us about your earnings",
        monthlyIncome: "Monthly Income (₹)",
        annualIncome: "Annual Income (₹)",
        complete: "Complete Setup",
        noProfileData: "No Profile Data Available.",
        completeOnboarding: "Please complete onboarding.",
        user: "User",
        employment: "Employment",
        monthly: "Monthly",
        annual: "Annual",
        analyzingProfile: "Analyzing profile for recommendations...",
        schemesFoundMsg: "Based on your profiled income, gender, and employment, we found these schemes for you.",
        allSchemesMsg: "Showing all available government schemes.",
        noSchemesMsg: "No matched schemes found for your profile at this moment.",
        learnMore: "Apply / Learn More",
        farmer: "Farmer",
        labourer: "Labourer",
        weaver: "Weaver",
        artisan: "Artisan",
        student: "Student",
        shopkeeper: "Shopkeeper",
        govtOfIndia: "Govt. of India",
        activeStatus: "Active",
        govtSchemeTag: "Govt Scheme",
        noIncomeLimit: "No Income Limit",
        forEveryone: "For Everyone",
        forFemales: "For Females",
        applyNow: "Apply now",
        mo: "mo",
        saved: "Saved",
        loanEligibility: "Loan Eligibility",
        monthlyIncome: "Monthly Income (₹)",
        existingEmi: "Existing Total EMI (₹/mo)",
        targetLoanAmount: "Target Loan Amount (₹)",
        checkEligibility: "Check Eligibility",
        eligible: "High Eligibility",
        eligibleDesc: "Your debt-to-income ratio is healthy! You are highly likely to get this loan approved.",
        moderateEligibility: "Moderate Eligibility",
        moderateEligibilityDesc: "You already have existing debts. Finding a new loan might be tricky or have higher interest rates.",
        ineligible: "Low Eligibility",
        ineligibleDesc: "You cannot get a new loan easily until you finish repaying your current EMI commitments.",
        recommendedLoans: "Recommended Loans for You",
        "SBI Personal Loan": "SBI Personal Loan",
        "State Bank of India": "State Bank of India",
        "From 11.15% p.a.": "From 11.15% p.a.",
        "HDFC Personal Loan": "HDFC Personal Loan",
        "HDFC Bank": "HDFC Bank",
        "From 10.50% p.a.": "From 10.50% p.a.",
        "Pradhan Mantri Mudra Yojana": "Pradhan Mantri Mudra Yojana",
        "Depends on Bank": "Depends on Bank",
        "Bajaj Finserv Personal Loan": "Bajaj Finserv Personal Loan",
        "Bajaj Finserv": "Bajaj Finserv",
        "From 11.00% p.a.": "From 11.00% p.a.",
        jan: "January",
        feb: "February",
        mar: "March",
        apr: "April",
        may: "May",
        jun: "June",
        jul: "July",
        aug: "August",
        sep: "September",
        oct: "October",
        nov: "November",
        dec: "December",
        sun: "Sun",
        mon: "Mon",
        tue: "Tue",
        wed: "Wed",
        thu: "Thu",
        fri: "Fri",
        sat: "Sat",
        close: "Close",
        stateBankOfIndia: "State Bank of India",
        yourUpiId: "amrita@oksbi",
        to: "To",
        sending: "Sending",
        enter6DigitUpiPin: "ENTER 6-DIGIT UPI PIN",
        forgotUpiPin: "Forgot UPI PIN?",
        show: "SHOW",
        transferringMoneyWarning: "You are transferring money from your account to ",
        simulationsSubtitle: "Learn how to use digital financial services interactively",
        upiPayments: "UPI Payments",
        upiPaymentsDesc: "Learn how to scan QR codes and send money securely via UPI.",
        netBanking: "Net Banking",
        netBankingDesc: "Practice logging into bank portals and transferring funds online.",
        investment: "Investment",
        investmentDesc: "Understand mutual funds, stocks, and how to start investing.",
        scanAnyQr: "Scan any QR",
        payAtShops: "Pay at shops & send money",
        payContacts: "Pay contacts",
        payPhoneNumber: "Pay phone number",
        bankTransfer: "Bank transfer",
        selfTransfer: "Self transfer",
        people: "People",
        businesses: "Businesses",
        billsRecharges: "Bills & Recharges",
        mobileRecharge: "Mobile\nRecharge",
        electricity: "Electricity",
        dthCable: "DTH /\nCable",
        water: "Water",
        noCameraPermission: "No Camera Permission. Give Permission and restart app.",
        scanQrCode: "Scan QR Code",
        tapToScanMock: "Tap if you have no physical QR",
        gallery: "Upload from gallery",
        unknownMerchant: "Merchant",
        verifiedMerchant: "Verified Merchant",
        addNote: "Add a note",
        paying: "Paying",
        paidSuccessfully: "Paid Successfully",
        upiTransactionId: "UPI Transaction ID",
        done: "Done",
        investmentSimulator: "Investment Simulator",
        monthlyInvestment: "Monthly Investment",
        timePeriod: "Time Period",
        yearsLabel: "Years",
        projectedWealth: "Projected Wealth",
        fixedDeposit: "Fixed Deposit",
        goldSgb: "Gold (SGB)",
        mutualFunds: "Mutual Funds",
        govtBonds: "Govt Bonds",
        chitFunds: "Chit Funds",
        clayPot: "Clay Pot",
        ironChest: "Iron Chest",
        fruitTree: "Fruit Tree",
        govtWarehouse: "Govt Warehouse",
        communityWell: "Community Well",
        guaranteedSafety: "Guaranteed Safety",
        inflationHedge: "Inflation Hedge",
        highGrowth: "High Growth",
        sovereignGuarantee: "Sovereign Guarantee",
        communityPot: "Community Pot",
        viewDetails: "View Details",
        compare: "Compare",
        comparison: "Comparison",
        feature: "Feature",
        risk: "Risk",
        returnRate: "Return Rate",
        totalValue: "Total Value",
        lockIn: "Lock-in",
        closeComparison: "Close Comparison",
        low: "Low",
        medium: "Medium",
        high: "High",
        zero: "Zero",
        fdDesc: "Safe and predictable. Good for short-term goals, but barely beats inflation.",
        goldDesc: "A traditional hedge against inflation. Sovereign Gold Bonds pay extra interest.",
        mfDesc: "Volatile in the short term, but historically the best wealth creator over 10+ years.",
        bondsDesc: "Lending to the Government. The safest possible investment in India.",
        chitDesc: "Community-based saving/borrowing. Good for emergencies, risky for saving.",
        pros: "PROS",
        cons: "CONS",
        aiAssistant: "AI Assistant",
        aiHelp: "Your personal financial helper",
        assistGreeting: "Hello! How can I assist you today?",
        listening: "Listening...",
        analyzingProfile: "Analyzing your profile...",
        tapToSpeak: "Tap microphone to speak",
        tapToStop: "Tap to stop",
        continuousMode: "Continuous Mode",
        conversationCleared: "Conversation cleared. How can I help you?",
        analyzing: "Analyzing...",
        goodMorning: "Good Morning",
        goodAfternoon: "Good Afternoon",
        goodEvening: "Good Evening",
        goodNight: "Good Night",
        govtSchemes: "Govt Schemes",
        loanCheck: "Loan Check",
        aiChatBot: "AI ChatBot",
        simulations: "Simulations"
    };

    React.useEffect(() => {
        const loadTranslations = async () => {
            if (currentLanguage === 'en-US') {
                setTranslations(baseDictionary);
                setIsTranslating(false);
                return;
            }

            setIsTranslating(true);
            const targetCode = currentLanguage.split('-')[0];
            const backendUrl = 'http://10.195.140.201:3000';
            const newDict = {};

            try {
                const keys = Object.keys(baseDictionary);
                const values = Object.values(baseDictionary);
                const BATCH_SIZE = 10;

                for (let batchStart = 0; batchStart < keys.length; batchStart += BATCH_SIZE) {
                    const batchKeys = keys.slice(batchStart, batchStart + BATCH_SIZE);

                    const batchResults = await Promise.all(
                        batchKeys.map(async (key) => {
                            const sourceText = baseDictionary[key];

                            try {
                                const response = await fetch(`${backendUrl}/api/translate`, {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({
                                        text: sourceText,
                                        sourceLanguageCode: 'en',
                                        targetLanguageCode: targetCode
                                    }),
                                });

                                if (!response.ok) {
                                    return [key, sourceText];
                                }

                                const data = await response.json();
                                return [key, data.translatedText?.trim() || sourceText];
                            } catch {
                                return [key, sourceText];
                            }
                        })
                    );

                    batchResults.forEach(([key, translatedText]) => {
                        newDict[key] = translatedText;
                    });
                }

                values.forEach((value, index) => {
                    const key = keys[index];
                    if (!newDict[key]) {
                        newDict[key] = value;
                    }
                });
                setTranslations(newDict);
            } catch (err) {
                console.error('Failed to load dynamic translations', err);
                setTranslations(baseDictionary);
            } finally {
                setIsTranslating(false);
            }
        };

        loadTranslations();
    }, [currentLanguage]);


    const t = (key) => {
        return translations[key] || baseDictionary[key] || key;
    };


    const translateDynamic = async (text, sourceLang = 'auto') => {
        try {
            if (currentLanguage === 'en-US') return text;

            const targetCode = currentLanguage.split('-')[0];
            let sourceCode = sourceLang;
            if (sourceCode && sourceCode.includes('-')) {
                sourceCode = sourceCode.split('-')[0];
            }

            if (sourceCode !== 'auto' && sourceCode === targetCode) return text;


            const backendUrl = 'http://10.195.140.201:3000';

            const response = await fetch(`${backendUrl}/api/translate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    text,
                    sourceLanguageCode: sourceCode,
                    targetLanguageCode: targetCode
                }),
            });

            if (!response.ok) {
                console.warn('Backend returned not ok:', response.status);
                throw new Error('Translation request failed');
            }

            const data = await response.json();
            return data.translatedText || text;
        } catch (error) {
            console.error('Translation error:', error);
            return text;
        }
    };


    const getTranslatedUrl = (url) => {
        if (!url) return '';
        const langCode = currentLanguage.split('-')[0];


        if (langCode === 'en') {
            return url;
        }

        const encodedUrl = encodeURIComponent(url);
        return `https://translate.google.com/translate?sl=auto&tl=${langCode}&u=${encodedUrl}`;
    };

    return (
        <LanguageContext.Provider value={{
            currentLanguage,
            setCurrentLanguage,
            t,
            translateDynamic,
            getTranslatedUrl,
            isTranslating
        }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => useContext(LanguageContext);
