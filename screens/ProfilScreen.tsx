import React,{useEffect,useState} from 'react';
import {View,Text,TextInput,Button,StyleSheet,Alert,ScrollView,Switch} from 'react-native';
import { supabase } from '../lib/supabaseClient';
import { TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';

const toInt = (s:string) => {
  const v = s.trim();
  if(!v) return null;
  const n = Number.parseInt(v,10);
  return Number.isFinite(n) ? n : null;
};

const toFloat = (s:string) => {
  const v = s.trim();
  if(!v) return null;
  const n = Number.parseFloat(v);
  return Number.isFinite(n) ? n : null;
};

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

    //進頁面抓user+讀取profile回填
    useEffect(() => {
      const load = async() => {
        const {data: userRes ,error: userErr } = await supabase.auth.getUser();
        const user = userRes?.user;

        if(userErr || !user){
          Alert.alert('Please login first');
          return;
        }

        //email 直接用auth的email
        setEmail(user.email ?? '');

        const{data:profile,error} = await supabase
          .from('profiles')
          .select('*')
          .eq('id',user.id)
          .maybeSingle();

        //沒資料是正常的，代表這個user還沒填過profile
        if(error){
          Alert.alert('Load profile failed',error.message);
          return;
        }

        if(profile){
          setName(profile.name ?? '');
          setGender(profile.gender ?? '');
          setAge(profile.age != null ? String(profile.age) : '');
          setHeight(profile.height != null ? String(profile.height) : '');
          setWeight(profile.weight != null ? String(profile.weight) : '');

          setGlasses(!!profile.glasses);
          setDisabled(!!profile.disabled);
          setColorBlind(!!profile.color_blind);
          setSmoking(!!profile.smoking);

          setDiastolic(profile.diastolic != null ? String(profile.diastolic) : '');
          setSystolic(profile.systolic != null ? String(profile.systolic) : '');
          setPulse(profile.pulse != null ? String(profile.pulse) : '');
          setBloodSugar(profile.blood_sugar != null ? String(profile.blood_sugar) : '');

          setExerciseType(profile.exercise_type ?? '');
          setExerciseTime(profile.exercise_time != null ? String(profile.exercise_time) : '');
          setChronicDisease(profile.chronic_disease ?? '');
          setVaccination(profile.vaccination ?? '');
        }
      };

      load();
    },[]);

    const handleSave = async () => {
        const { data: userRes , error: useErr } = await supabase.auth.getUser();
        const user = userRes?.user;

        if (useErr || !user) {
            Alert.alert('Please login first!');
            return;
        }   
    

      //id = user.id 用upsert避免重複新增
      const payload = {
        id: user.id,
        email: user.email ?? null,
        name: name || null,
        gender: gender || null,

        age: toInt(age),
        height: toInt(height),
        weight: toInt(weight),

        glasses,
        disabled,
        color_blind: colorBlind,
        smoking,

        diastolic: toInt(diastolic),
        systolic: toInt(systolic),
        pulse: toInt(pulse),
        blood_sugar: toFloat(bloodSugar),

        exercise_type: exerciseType || null,
        exercise_time: toFloat(exerciseTime),
        chronic_disease: chronicDisease || null,
        vaccination: vaccination || null,

        updated_at: new Date().toISOString(),
      };

    const {error} = await supabase
      .from('profiles')
      .upsert(payload,{onConflict: 'id'});

    if (error){
      Alert.alert(t('saveFailed'),error.message);
    }else{
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
      <TextInput style={styles.input} value={email} editable={false} placeholder={t('emailPlaceholder')} keyboardType='email-address' />

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