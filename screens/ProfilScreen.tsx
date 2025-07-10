import React,{useState} from 'react';
import {View,Text,TextInput,Button,StyleSheet,Alert,ScrollView,Switch} from 'react-native';
import { supabase } from '../lib/supabaseClient';
import { TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';

export default function ProfileScreen(){
    const { t } = useTranslation();
    const [name, setName] = useState('');
    const [age, setAge] = useState('');
    const [gender, setGender] = useState('');
    const [email, setEmail] = useState('');
    const [height, setHeight] = useState('');
    const [weight, setWeight] = useState('');
    const [ageRange, setAgeRange] = useState('');
    const [glasses, setGlasses] = useState(false);
    const [disabled, setDisabled] = useState(false);
    const [colorBlind, setColorBlind] = useState(false);
    const [smoking, setSmoking] = useState(false);
    const [diastolic, setDiastolic] = useState('');
    const [systolic, setSystolic] = useState('');
    const [pulse, setPulse] = useState('');
    const [bloodSugar, setBloodSugar] = useState('');
    const [exerciseType, setExerciseType] = useState('');
    const [exerciseTime, setExerciseTime] = useState('');
    const [chronicDisease, setChronicDisease] = useState('');
    const [vaccination, setVaccination] = useState('');

    const handleSave = async () => {
        const { data, error } = await supabase.from('profiles').insert([
        {
            name,
            age: parseInt(age),
            gender,
            email,
            height: parseInt(height),
            weight: parseInt(weight),
            glasses,
            disabled,
            color_blind: colorBlind,
            smoking,
            diastolic: parseInt(diastolic),
            systolic: parseInt(systolic),
            pulse: parseInt(pulse),
            blood_sugar: parseFloat(bloodSugar),
            exercise_type: exerciseType,
            exercise_time: parseFloat(exerciseTime),
            chronic_disease: chronicDisease,
            vaccination,
        },
        ]);

        if (error) {
            Alert.alert(t('saveFailed'), error.message);
        } else {
            Alert.alert(t('saved'));
        }
    };

    return(
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{t('editProfile')}</Text>

      <Text>{t('name')}</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} placeholder={t('namePlaceholder')} />

      <Text>{t('age')}</Text>
      <TextInput style={styles.input} value={age} onChangeText={setAge} placeholder={t('agePlaceholder')} keyboardType='numeric' />

      <Text>{t('gender')}</Text>
      <TextInput style={styles.input} value={gender} onChangeText={setGender} placeholder={t('genderPlaceholder')} />

      <Text>{t('email')}</Text>
      <TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder={t('emailPlaceholder')} keyboardType='email-address' />

      <Text>{t('height')} (cm)</Text>
      <TextInput style={styles.input} value={height} onChangeText={setHeight} keyboardType='numeric' />

      <Text>{t('weight')}  (kg)</Text>
      <TextInput style={styles.input} value={weight} onChangeText={setWeight} keyboardType='numeric' placeholder={t('weightPlaceholder')}/>
    
      <Text>{t('symptomHint')}</Text>
      <View style={styles.switchContainer}><Text>{t('glasses')}</Text><Switch value={glasses} onValueChange={setGlasses} /></View>
      <View style={styles.switchContainer}><Text>{t('disabled')}</Text><Switch value={disabled} onValueChange={setDisabled} /></View>
      <View style={styles.switchContainer}><Text>{t('colorBlind')}</Text><Switch value={colorBlind} onValueChange={setColorBlind} /></View>
      <View style={styles.switchContainer}><Text>{t('smoking')}</Text><Switch value={smoking} onValueChange={setSmoking} /></View>

      <Text>{t('systolic')}</Text>
      <TextInput style={styles.input} value={systolic} onChangeText={setSystolic} keyboardType='numeric' placeholder={t('systolicPlaceholder')} />

      <Text>{t('diastolic')}</Text>
      <TextInput style={styles.input} value={diastolic} onChangeText={setDiastolic} keyboardType='numeric' placeholder={t('diastolicPlaceholder')}/>

      <Text>{t('pulse')}</Text>
      <TextInput style={styles.input} value={pulse} onChangeText={setPulse} keyboardType='numeric' placeholder={t('pulsePlaceholder')}/>

      <Text>{t('sugar')}</Text>
      <TextInput style={styles.input} value={bloodSugar} onChangeText={setBloodSugar} keyboardType='numeric' placeholder={t('sugarPlaceholder')}/>

      <Text>{t('exerciseType')}</Text>
      <TextInput style={styles.input} value={exerciseType} onChangeText={setExerciseType} placeholder={t('exerciseTypePlaceholder')} />

      <Text>{t('exerciseTime')}</Text>
      <TextInput style={styles.input} value={exerciseTime} onChangeText={setExerciseTime} keyboardType='numeric' placeholder={t('exerciseTimePlaceholder')}/>

      <Text>{t('chronicDisease')}</Text>
      <TextInput style={styles.input} value={chronicDisease} onChangeText={setChronicDisease} placeholder={t('chronicDiseasePlaceholder')} />

      <Text>{t('vaccination')}</Text>
      <TextInput style={styles.input} value={vaccination} onChangeText={setVaccination} placeholder={t('vaccinationPlaceholder')}/>

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>{t('save')}</Text>
      </TouchableOpacity>
    </ScrollView>
    );
    
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, backgroundColor: 'white' },
    title: { fontSize: 30, fontWeight: 'bold', marginBottom: 20 , fontFamily: "Gill Sans" },
    input: { borderWidth: 1, borderColor: '#ccc', padding: 16, marginBottom: 10, borderRadius: 5 },
    switchContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
    saveButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0B3D91', 
        paddingVertical: 12,
        borderRadius: 30,
        marginTop: 16,
        borderWidth: 1,
        borderColor: 'black',
        fontFamily: "Gill Sans",
      },
      
    saveButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        fontFamily: "Gill Sans"
      },
  });