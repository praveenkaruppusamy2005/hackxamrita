import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar, ActivityIndicator, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import MainTabs from './MainTabs';
import LanguageSelectionScreen from './LanguageSelectionScreen';
import UserDetailsScreen from './UserDetailsScreen';
import JobDetailsScreen from './JobDetailsScreen';
import IncomeDetailsScreen from './IncomeDetailsScreen';
import GovtSchemesScreen from './GovtSchemesScreen';
import SchemeDetailsScreen from './SchemeDetailsScreen';
import LoanEligibilityScreen from './LoanEligibilityScreen';
import LoanResultScreen from './LoanResultScreen';
import SimulationsScreen from './SimulationsScreen';
import UPIPaymentSimulation from './UPIPaymentSimulation';
import NetBankingSimulation from './NetBankingSimulation';
import InvestmentSimulation from './InvestmentSimulation';
import { LanguageProvider } from './LanguageContext';
import VoiceAgentScreen from './VoiceAgentScreen';
import AIChatbotScreen from './AIChatbotScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  const [initialRoute, setInitialRoute] = React.useState(null);

  React.useEffect(() => {
    const checkUser = async () => {
      try {
        const userMobile = await AsyncStorage.getItem('userMobile');
        if (userMobile) {
          setInitialRoute('MainTabs');
        } else {
          setInitialRoute('LanguageSelection');
        }
      } catch (e) {
        setInitialRoute('LanguageSelection');
      }
    };
    checkUser();
  }, []);

  if (initialRoute === null) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  return (
    <LanguageProvider>
      <NavigationContainer>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
        <Stack.Navigator initialRouteName={initialRoute} screenOptions={{ headerShown: false }}>
          <Stack.Screen
            name="LanguageSelection"
            component={LanguageSelectionScreen}
          />
          <Stack.Screen
            name="UserDetails"
            component={UserDetailsScreen}
          />
          <Stack.Screen
            name="JobDetails"
            component={JobDetailsScreen}
          />
          <Stack.Screen
            name="IncomeDetails"
            component={IncomeDetailsScreen}
          />
        
          <Stack.Screen
            name="MainTabs"
            component={MainTabs}
          />
          <Stack.Screen 
            name="VoiceAgent" 
            component={VoiceAgentScreen}
          />
          <Stack.Screen 
            name="AIChatbot" 
            component={AIChatbotScreen}
          />
          <Stack.Screen
            name="GovtSchemes"
            component={GovtSchemesScreen}
          />
          <Stack.Screen
            name="SchemeDetails"
            component={SchemeDetailsScreen}
          />
          <Stack.Screen
            name="LoanEligibility"
            component={LoanEligibilityScreen}
          />
          <Stack.Screen
            name="LoanResult"
            component={LoanResultScreen}
          />
          <Stack.Screen
            name="Simulations"
            component={SimulationsScreen}
          />
          <Stack.Screen
            name="UPIPaymentSimulation"
            component={UPIPaymentSimulation}
          />
          <Stack.Screen
            name="NetBankingSimulation"
            component={NetBankingSimulation}
          />
          <Stack.Screen
            name="InvestmentSimulation"
            component={InvestmentSimulation}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </LanguageProvider>
  );
}
