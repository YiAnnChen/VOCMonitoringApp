import React, {useState} from "react";
import {View,Text,TextInput,Button,StyleSheet, Alert} from 'react-native';
import { supabase } from '../lib/supabaseClient';

export default function HealthDataScreen(){
    const [weight, setWeight] = useState(' ');
    const [bloodPressure, setBloodPressure] = useState(' ');
    const [heartRate, setHeartRate] = useState(' ');

    const handleSubmit = async () => {
        const { error } = await supabase.from('health_data').insert([
          {
            weight: parseFloat(weight),
            blood_pressure: bloodPressure,
            heart_rate: parseInt(heartRate),
          },
        ]);
    
        if (error) {
          Alert.alert('Save failed:(', error.message);
        } else {
          Alert.alert('Saved successfully!');
          setWeight('');
          setBloodPressure('');
          setHeartRate('');
        }
      };

    return(
        <View style={styles.container}>
            <Text style={styles.title}>Daily Health Data</Text>

            <Text>Weight (kg):</Text>
            <TextInput style={styles.input} value={weight} onChangeText={setWeight} placeholder="Enter  weight" keyboardType="numeric"/>

            <Text>Blood Pressure</Text>
            <TextInput style={styles.input} value={bloodPressure} onChangeText={setBloodPressure} placeholder="Enter blood pressure(e.g.,120/80)" />

            <Text>Heart Rate</Text>
            <TextInput style={styles.input} value={heartRate} onChangeText={setHeartRate} placeholder="Enter heart rate" keyboardType="numeric"/>

            <Button title="Submit" onPress={handleSubmit} />

        </View>
    );
}

const styles = StyleSheet.create({
    container:{ flex: 1, padding: 16, backgroundColor: ' white'},
    title:{fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
    input:{ borderWidth: 1,borderColor: '#ccc', padding: 10,marginBottom: 10, borderRadius:5},
});