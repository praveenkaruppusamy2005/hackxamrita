import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, Mic, User } from 'lucide-react-native';

import HomeScreen from './Home';
import VoiceRecognitionScreen from './VoiceRecognitionScreen';
import ProfileScreen from './ProfileScreen';

const Tab = createBottomTabNavigator();

function MyTabBar({ state, descriptors, navigation }) {
    return (
        <View style={styles.tabBarContainer}>
            {state.routes.map((route, index) => {
                const { options } = descriptors[route.key];

                const isFocused = state.index === index;

                const onPress = () => {
                    const event = navigation.emit({
                        type: 'tabPress',
                        target: route.key,
                        canPreventDefault: true,
                    });

                    if (!isFocused && !event.defaultPrevented) {
                        navigation.navigate(route.name, route.params);
                    }
                };

                const onLongPress = () => {
                    navigation.emit({
                        type: 'tabLongPress',
                        target: route.key,
                    });
                };

                let IconComponent;
                if (route.name === 'Home') {
                    IconComponent = Home;
                } else if (route.name === 'AI') {
                    IconComponent = Mic;
                } else if (route.name === 'Profile') {
                    IconComponent = User;
                }

                const color = '#000000';

                return (
                    <TouchableOpacity
                        key={route.key}
                        accessibilityRole="button"
                        accessibilityState={isFocused ? { selected: true } : {}}
                        accessibilityLabel={options.tabBarAccessibilityLabel}
                        testID={options.tabBarTestID}
                        onPress={onPress}
                        onLongPress={onLongPress}
                        style={styles.tabItem}
                    >
                        <View style={[styles.iconContainer, isFocused && styles.activeIconContainer]}>
                            {IconComponent && <IconComponent color={color} size={28} strokeWidth={isFocused ? 2.5 : 2} />}
                        </View>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
}

export default function MainTabs() {
    return (
        <Tab.Navigator
            tabBar={props => <MyTabBar {...props} />}
            screenOptions={{ headerShown: false }}
            initialRouteName="Home"
        >
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="AI" component={VoiceRecognitionScreen} />
            <Tab.Screen name="Profile" component={ProfileScreen} />
        </Tab.Navigator>
    );
}

const styles = StyleSheet.create({
    tabBarContainer: {
        flexDirection: 'row',
        backgroundColor: '#ffffff',
        paddingBottom: Platform.OS === 'ios' ? 24 : 16,
        paddingTop: 16,
        paddingHorizontal: 20,
        justifyContent: 'space-around',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
    },
    tabItem: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconContainer: {
        paddingVertical: 10,
        paddingHorizontal: 24,
        borderRadius: 30,
    },
    activeIconContainer: {
        backgroundColor: '#e5e6e8ff',
        borderRadius: 30,
        width: 100,
        alignItems: 'center',
    }
});
