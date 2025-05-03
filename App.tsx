import 'react-native-url-polyfill/auto';
import React , { useEffect, useState }from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { supabase } from './lib/supabaseClient';

import HomeScreen from './screens/HomeScreen';
import AuthScreen from './screens/AuthScreen';
import VOCDataScreen from './screens/VOCDataScreen';
import HistoryGraphScreen from './screens/HistoryGraphScreen';
import LegalLimitsScreen from './screens/LegalLimitsScreen';
import ProfileScreen from './screens/ProfilScreen';
import HealthDataScreen from './screens/HealthDataScreen';

const Stack = createStackNavigator();

export default function App() {
    const [session,setSession] = useState(null);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
        });
  
        const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });
  
        return () => {
            listener?.subscription.unsubscribe();
        };
    }, []);
    return (
        <NavigationContainer>
          <Stack.Navigator initialRouteName={session ? 'Home' : 'Auth'}>
            {!session ? (
              <Stack.Screen name="Auth" component={AuthScreen} options={{ headerShown: false }} />
            ) : (
              <>
                <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
                <Stack.Screen name="Profile" component={ProfileScreen} />
                <Stack.Screen name="HealthData" component={HealthDataScreen} />
                <Stack.Screen name="VOCData" component={VOCDataScreen} />
                <Stack.Screen name="HistoryGraph" component={HistoryGraphScreen} />
                <Stack.Screen name="LegalLimits" component={LegalLimitsScreen} />
              </>
            )}
          </Stack.Navigator>
        </NavigationContainer>
    
    );
}
