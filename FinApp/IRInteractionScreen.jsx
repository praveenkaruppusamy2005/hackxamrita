import React from 'react';
import { View, StyleSheet, SafeAreaView, TouchableOpacity, Image, Text } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { useLanguage } from './LanguageContext';

export default function IRInteractionScreen({ navigation }) {
    const { t } = useLanguage();

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <ArrowLeft color="#1A1A1A" size={24} />
                </TouchableOpacity>
            </View>

            <View style={styles.content}>
                <View style={styles.chatBubble}>
                    <Text style={styles.chatText}>{t('assistGreeting')}</Text>
                    <View style={styles.bubbleTail} />
                </View>

                <View style={styles.cameraPlaceholder}>
                    {/* <Image source={require('./Assets/person1.jpg')} style={styles.fullImage} /> */}
                </View>
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
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderColor: '#F0F0F0',
    },
    backButton: {
        padding: 8,
        marginLeft: -8,
    },
    content: {
        flex: 1,
        padding: 24,
    },
    cameraPlaceholder: {
        width: '40%', // Smaller image width
        height: '40%', // Smaller image height
        backgroundColor: '#1A1A1A',
        borderRadius: 20, // Adjusted border radius for smaller size
        justifyContent: 'center',
        alignSelf: 'flex-start',
        overflow: 'hidden',
        marginTop: 40, // Push image down slightly to make room for larger bubble
    },
    fullImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    chatBubble: {
        position: 'absolute',
        top: '10%', // Move bubble higher
        right: 10,  // Move bubble closer to edge
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 24, // More padding for larger bubble
        paddingVertical: 18,
        borderRadius: 24,
        borderBottomLeftRadius: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.15,
        shadowRadius: 10,
        elevation: 10, // Higher elevation for larger bubble
        maxWidth: '65%', // Allow bubble to be wider
        zIndex: 10,
    },
    chatText: {
        fontSize: 18, // Larger font size
        fontWeight: '500', // Slightly lighter font weight for better readability at larger sizes
        color: '#1A1A1A',
        lineHeight: 26, // Increased line height for larger font
    },
    bubbleTail: {
        position: 'absolute',
        bottom: 0,
        left: -15,
        width: 0,
        height: 0,
        borderTopWidth: 15,
        borderTopColor: '#FFFFFF',
        borderRightWidth: 20,
        borderRightColor: 'transparent',
    }
});
