import React, { useState, useLayoutEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, Image } from 'react-native';
import { supabase } from '../lib/supabaseClient';
import { useTranslation } from 'react-i18next';

const NCKU_LOGO = require('../assets/logo.png');

export default function AuthScreen({navigation}:any){
    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');

    const {t, i18n} = useTranslation();

    useLayoutEffect(() => {
      navigation.setOptions({ 
        title: t('auth.navTitle'),
        headerLeft: ()=> (
          <Image source={NCKU_LOGO} style={{width: 28, height: 28, marginLeft: 12}} resizeMode='contain'/>
        ),
        headerTitleAlign:'center',
      });
    },[navigation,i18n.language]);

    const signIN = async()=>{
        const{error} = await supabase.auth.signInWithPassword({email,password});
        if(error){
            Alert.alert(t('auth.loginFailedTitle'),error.message);
            return;
        }

        Alert.alert(t('auth.loginSuccess'));
            
        
    };

    const signUp = async () => {
      const normalizedEmail = email.trim().toLowerCase();
      //1.check first
      const {data: isAvailable, error: checkErr} = await supabase.rpc(
        'is_email_available',
        {p_email:normalizedEmail}
      );

      if(checkErr){
        Alert.alert(t('auth.registerFailedTitle'),checkErr.message);
        return;
      }

      if(!isAvailable){
        Alert.alert(
          t('auth.emailAlreadyUsedTitle'),
          t('auth.emailAlreadyUsedMessage')
        );
        return;
      }

      //2. register again
      const {data,error} = await supabase.auth.signUp({
        email:normalizedEmail,
        password,
      });

      if(error){
        Alert.alert(t('auth.registerFailedTitle'),error.message);
        return;
      }
      
      if(!data?.user){
        Alert.alert(
          t('auth.registerFailedTitle'),
          t('auth.emailAlreadyUsedMessage')
        );
        return;
      }
      Alert.alert(t('auth.registerSuccess'));
    };

    return (
        <View style={styles.container}>
          <Text style={styles.title}>{t('auth.title')}</Text>
          <TextInput
            style={styles.input}
            placeholder={t('auth.emailPlaceholder')}
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
          <TextInput
            style={styles.input}
            placeholder={t('auth.passwordPlaceholder')}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity style={styles.primaryButton} onPress={signIN}>
            <Text style={styles.primaryButtonText}>{t('auth.login')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryButton} onPress={signUp}>
            <Text style={styles.secondaryButtonText}>{t('auth.register')}</Text>
          </TouchableOpacity>
        </View>
      );
    }
    
    const styles = StyleSheet.create({
      container: { flex: 1, padding: 16, justifyContent: 'center', backgroundColor: 'white' },
      title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
      input: { borderWidth: 1, borderColor: '#ccc', padding: 12, marginBottom: 10, borderRadius: 5 },
      primaryButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#A31F34',
        paddingVertical: 12,
        borderRadius: 30,
        marginTop: 12,
        borderWidth: 1,
        borderColor: '#A31F34',
      },
      primaryButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
      },
      secondaryButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        paddingVertical: 12,
        borderRadius: 30,
        marginTop: 12,
        borderWidth: 1,
        borderColor: '#A31F34',
      },
      secondaryButtonText: {
        color: '#A31F34',
        fontSize: 16,
        fontWeight: 'bold',
      },
    });