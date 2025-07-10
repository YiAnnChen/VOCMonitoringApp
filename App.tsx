import 'react-native-url-polyfill/auto';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { I18nextProvider, useTranslation } from 'react-i18next';
import i18n from './i18n';

import HomeScreen from './screens/HomeScreen';
import VOCDataScreen from './screens/VOCDataScreen';
import HistoryGraphScreen from './screens/HistoryGraphScreen';
import LegalLimitsScreen from './screens/LegalLimitsScreen';
import ProfileScreen from './screens/ProfilScreen';
import HealthDataScreen from './screens/HealthDataScreen';
import { Text,TouchableOpacity } from 'react-native';

const Stack = createStackNavigator();

function LanguageToggle(){
  const { i18n } = useTranslation();

  return(
    <TouchableOpacity
      style={{marginRight:10}}
      onPress={ () => {
        const newLang = i18n.language === 'en' ? 'zh' : 'en';
        i18n.changeLanguage(newLang);
      }}
      >
        <Text style={{ fontSize: 20, fontWeight: 'bold', paddingHorizontal: 6 }}>{i18n.language === 'en' ? '中' : 'EN'}</Text>
      </TouchableOpacity>
  );
}

export default function App() {
  return (
    <I18nextProvider i18n={i18n}>
      <NavigationContainer>
        <Stack.Navigator 
          initialRouteName="Home"
          screenOptions={{headerRight: ()=> <LanguageToggle /> }}>
          <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
          <Stack.Screen name="HealthData" component={HealthDataScreen} />
          <Stack.Screen name="VOCData" component={VOCDataScreen} />
          <Stack.Screen name="HistoryGraph" component={HistoryGraphScreen} />
          <Stack.Screen name="LegalLimits" component={LegalLimitsScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </I18nextProvider>
  );
}
