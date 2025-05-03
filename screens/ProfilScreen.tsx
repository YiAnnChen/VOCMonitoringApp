import React,{useState} from 'react';
import {View,Text,TextInput,Button,StyleSheet,Alert} from 'react-native';
import { supabase } from '../lib/supabaseClient';

export default function ProfileScreen(){
    const [name, setName] = useState(' ');
    const [age, setAge] = useState(' ');
    const [gender, setGender] = useState(' ');
    const [email, setEmail] = useState(' ');

    const handleSave = async () => {
        const { data, error } = await supabase.from('profiles').insert([
            {
                name: name,
                age: parseInt(age),
                gender: gender,
                email: email,
            },
        ]);

        if (error) {
            Alert.alert('Save failed:(', error.message);
        } else {
            Alert.alert('Saved successfully!');
        }
    };

    return(
        <View style={styles.container}>
            <Text style={styles.title}>Edit Profile</Text>

            <Text>Name:</Text>
            <TextInput style={styles.input} value={name} onChangeText={setName} placeholder='Enter your name'/>

            <Text>Age:</Text>
            <TextInput style={styles.input} value={age} onChangeText={setAge} placeholder='Enter your age' keyboardType='numeric'/>

            <Text>Gender</Text>
            <TextInput style={styles.input} value={gender} onChangeText={setGender} placeholder='Enter your gender'/>

            <Text>Email</Text>
            <TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder='Enter your email' keyboardType='email-address'/>

            <Button title='Save' onPress={handleSave} />
        </View>
    );
    
}

const styles = StyleSheet.create({
    container: {flex: 1, padding: 16, backgroundColor: 'white'},
    title:{fontSize: 24, fontWeight: 'bold', marginBottom: 16},
    input:{borderWidth: 1, borderColor: '#ccc', padding: 16, marginBottom: 10,borderRadius: 5},
})