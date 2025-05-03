import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { supabase } from '../lib/supabaseClient';
import { ContinousBaseGesture } from 'react-native-gesture-handler/lib/typescript/handlers/gestures/gesture';

export default function AuthScreen({navigation}:any){
    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');

    const signIN = async()=>{
        const{error} = await supabase.auth.signInWithPassword({email,password});
        if(error){
            Alert.alert("Login failed:(",error.message);
        }else{
            Alert.alert("Login successful!");
            navigation.replace('Home');
        }
    };

    const signUp = async () => {
        const { data: signUpData, error } = await supabase.auth.signUp({ email, password });

        if (!error && signUpData.user) {
            await supabase.from('profiles').insert({
                id: signUpData.user.id,
                email,
                name: '',
            });
            Alert.alert("Registration successful! Please verify in your mailbox.");
            }
        if(error){
            Alert.alert("Registration failed:(",error.message);
        }
    };

    return (
        <View style={styles.container}>
          <Text style={styles.title}>Login/Register</Text>
          <TextInput
            style={styles.input}
            placeholder="Email"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
          <TextInput
            style={styles.input}
            placeholder="password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          <Button title="Login" onPress={signIN} />
          <View style={{ height: 10 }} />
          <Button title="Register" onPress={signUp} />
        </View>
      );
    }
    
    const styles = StyleSheet.create({
      container: { flex: 1, padding: 16, justifyContent: 'center', backgroundColor: 'white' },
      title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
      input: { borderWidth: 1, borderColor: '#ccc', padding: 12, marginBottom: 10, borderRadius: 5 },
    });
