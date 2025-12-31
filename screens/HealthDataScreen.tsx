import React, {useState} from "react";
import {View, Text, TextInput, Button, StyleSheet, Alert, ScrollView,TouchableOpacity} from 'react-native';
import { supabase } from '../lib/supabaseClient';
import { useTranslation } from 'react-i18next';

export default function HealthDataScreen(){
    const { t } = useTranslation();
    const [weight, setWeight] = useState('');
    const [bloodPressure, setBloodPressure] = useState('');
    const [heartRate, setHeartRate] = useState('');

    const [newSymptoms, setNewSymptoms] = useState({
      asymptomatic: false,
      cough: false,
      sneeze: false,
      soreThroat: false,
      runnyNose: false,
      skinRash: false,
      itchyEyes: false,
      fever: false,
      chestTightness: false,
      severity: 'none',
    });
    type NewSymptomKey = Exclude<keyof typeof newSymptoms, 'severity'>;
    const toggleNewSymptoms = (key: NewSymptomKey) => {
      setNewSymptoms(prev => {
        //勾選無症狀的話，會清空其他症狀，severity回到none
        if (key === 'asymptomatic'){
          const turningOn = !prev.asymptomatic;
          const next: any = {...prev,asymptomatic:turningOn};
          if(turningOn){
            Object.keys(prev).forEach(k => {
              if (k !== 'severity' && k !== 'asymptomatic') next[k] = false;
            });
            next.severity = 'none';
          }
          return next;
        }
        //勾選其他症狀，自動取消無症狀
        return {...prev,asymptomatic:false,[key]:!prev[key]};
      });
    };


    const [medicalHistory, setMedicalHistory] = useState({
      asymptomatic: false,
      cough: false,
      sneeze: false,
      soreThroat: false,
      runnyNose: false,
      skinRash: false,
      itchyEyes: false,
      fever: false,
      headache: false,
      eyePain: false,
      severity: 'none', // none, recovered, underTreatment
    });
    type MedicalHistoryKey = Exclude<keyof typeof medicalHistory, 'severity'>;
    const toggleMedicalHistory = (key: MedicalHistoryKey) => {
      setMedicalHistory(prev => {
        if (key === 'asymptomatic') {
          const turningOn = !prev.asymptomatic;
          const next: any = { ...prev, asymptomatic: turningOn };
          if (turningOn) {
            Object.keys(prev).forEach(k => {
              if (k !== 'severity' && k !== 'asymptomatic') next[k] = false;
            });
            next.severity = 'none';
          }
          return next;
        }
        return { ...prev, asymptomatic: false, [key]: !prev[key] };
      });
    };

    const [existingConditions, setExistingConditions] = useState({
      noCondition : { checked : false, note:''},
      stroke: { checked: false, note: '' },
      cancer: { checked: false, note: '' },
      otherSevere: { checked: false, note: '' },
      severity: 'none', // none, recovered, underTreatment
    });
    type ExistingConditionKey = Exclude<keyof typeof existingConditions, 'severity'>;
    const toggleExistingCondition = (key: ExistingConditionKey) => {
      setExistingConditions(prev => {
        if (key === 'noCondition'){
          const turningOn = !prev.noCondition.checked;
          const next: any = {
            ...prev,
            noCondition: { ...prev.noCondition, checked: turningOn,note:''},
          };

          if(turningOn){
            Object.keys(prev).forEach(k => {
              if(k === 'severity' || k === 'noCondition')return;
              const v: any = prev[k as keyof typeof prev];
              next[k] = {...v, checked: false, note:''};
            });
            next.severity = 'none';
          }
          return next;
        }
        const cur: any = prev[key];
        const turningOn = !cur.checked;
        return {
          ...prev,
          noCondition:{ ...prev.noCondition,checked:false},
          [key] : {...cur,checked: turningOn},
        };
      });
    };

    const [chronicMeds, setChronicMeds] = useState({
      noUse: false,
      hypertension: false,
      diabetes: false,
      hyperlipidemia: false,
      other: { checked: false, note: '' },
      usage: 'none', // none, used, using
    });
    type ChronicMedsKey = Exclude<keyof typeof chronicMeds, 'usage'>;
    const togglechronicMeds = (key: ChronicMedsKey) => {
      setChronicMeds(prev => {
        if(key === 'noUse'){
          const turningOn = !prev.noUse;
          const next: any = { ...prev,noUse:turningOn};
          if(turningOn){
            Object.keys(prev).forEach(k => {
              if(k === 'usage' || k === 'noUse')return;
              const v:any = prev[k as keyof typeof prev];
              if(v && typeof v === 'object') next[k] = {...v, checked:false,note:''};
              else next[k] = false;
            });
            next.usage = 'none';
          }
          return next;
        }
        const v:any = prev[key];
        if(v && typeof v === 'object'){
          return{ ...prev,noUse:false,[key]:{...v, checked: !v.checked}};
        }
        return {...prev,noUse:false,[key]:!prev[key]};
      });
    };

    const [covidInfection, setCovidInfection] = useState({
      asymptomatic: false,
      diagnosed: { checked: false, note: '' },
      respiratory: false,
      unconscious: false,
      headache: false,
      allergy: false,
      anosmia: false,
      other: { checked: false, note: '' },
      usage: 'none', // none, used
    });
    type CovidInfectionKey = Exclude<keyof typeof covidInfection,'usage'>
    const togglecovidInfection = (key: CovidInfectionKey) => {
      const symptomKeys = ['diagnosed','respiratory','unconscious','headache','allergy','anosmia'] as const;

      setCovidInfection(prev => {
        if (key === 'asymptomatic'){
          const turningOn = !prev.asymptomatic;
          const next:any = { ...prev, asymptomatic: turningOn};
          if(turningOn){
            symptomKeys.forEach(k => (next[k] = false));
            next.other = {...prev.other, checked:false,note:''};
          }
          return next;
        }
        if(symptomKeys.includes(key as any)){
          return {...prev,asymptomatic:false,[key]:!prev[key]};
        }
        if(key === 'other'){
          const turningOn = !prev.other.checked;
          return{
            ...prev,
            asymptomatic:turningOn ? false:prev.asymptomatic,
            other:{...prev.other, checked: turningOn},
          };
        }
        if(key === 'diagnosed'){
          return { ...prev, diagnosed:{...prev.diagnosed, checked: !prev.diagnosed.checked}};
        }
        return prev;
      });
    };

    const [fluHistory, setFluHistory] = useState({
      asymptomatic:false,
      respiratory: false,
      headache: false,
      other: { checked: false, note: '' },
      usage: 'none', // none, used
    });
    type FluHistoryKey = Exclude<keyof typeof fluHistory,'usage'>;
    const togglefluHistory = (key: FluHistoryKey) => {
      const symptomKeys = ['respiratory','headache'] as const;

      setFluHistory(prev => {
        if (key === 'asymptomatic'){
          const turningOn = !prev.asymptomatic;
          const next:any = { ...prev, asymptomatic: turningOn};
          if(turningOn){
            symptomKeys.forEach(k => (next[k] = false));
            next.other = {...prev.other, checked:false,note:''};
          }
          return next;
        }
        if(symptomKeys.includes(key as any)){
          return {...prev,asymptomatic:false,[key]:!prev[key]};
        }
        if(key === 'other'){
          const turningOn = !prev.other.checked;
          return{
            ...prev,
            asymptomatic:turningOn ? false:prev.asymptomatic,
            other:{...prev.other, checked: turningOn},
          };
        }
        return prev;
      });
    };
    
    const toFloatOrNull = (s: string) => {
      const v = s.trim();
      if(!v) return null;
      const n = Number.parseFloat(v);
      return Number.isFinite(n) ? n : null;
    };

    const toIntOrNull = (s:string) => {
      const v = s.trim();
      if(!v) return null;
      const n = Number.parseInt(v,10);
      return Number.isFinite(n) ? n : null;
    };
    
    const handleSubmit = async () => {
      //1.取得登入者
      const {data:userRes,error: useErr } = await supabase.auth.getUser();
      const user = userRes?.user;

      if(useErr || !user){
        Alert.alert('Please login first');
        return;
      }
      //2. 寫入時必帶user_id(RLS才會放行)
      const payload = {
        user_id : user.id,
        recorded_at: new Date().toISOString(),

        weight: weight.trim() ? Number(weight) : null,
        blood_pressure: bloodPressure.trim() ? bloodPressure : null,
        heart_rate: heartRate.trim() ? Number(heartRate) : null,

        realtime_health_info: newSymptoms,
        medical_history: medicalHistory,
        existing_conditions: existingConditions,
        chronic_meds: chronicMeds,
        covid_infection: covidInfection,
        flu_history: fluHistory,
      };

      const { error } = await supabase.from('health_data').insert([payload]);
    
        if (error) {
          Alert.alert(t('daily_saveFailed'), error.message);
          return;
        } 
        
        Alert.alert(t('daily_saved'));

        //3. reset表單
        setWeight('');
        setBloodPressure('');
        setHeartRate('');

        setNewSymptoms({
          asymptomatic:false,
          cough: false,
          sneeze: false,
          soreThroat: false,
          runnyNose: false,
          skinRash: false,
          itchyEyes: false,
          fever: false,
          chestTightness: false,
          severity: 'none',
          });
        
        setMedicalHistory({
            asymptomatic: false,
            cough: false,
            sneeze: false,
            soreThroat: false,
            runnyNose: false,
            skinRash: false,
            itchyEyes: false,
            fever: false,
            headache: false,
            eyePain: false,
            severity: 'none',
        });
        
        setExistingConditions({
            noCondition: { checked: false, note: '' },
            stroke: { checked: false, note: '' },
            cancer: { checked: false, note: '' },
            otherSevere: { checked: false, note: '' },
            severity: 'none',
        });
      
        setChronicMeds({
            noUse: false,
            hypertension: false,
            diabetes: false,
            hyperlipidemia: false,
            other: { checked: false, note: '' },
            usage: 'none',
        });

        setCovidInfection({
          asymptomatic: false,
          diagnosed: { checked: false, note: '' },
          respiratory: false,
          unconscious: false,
          headache: false,
          allergy: false,
          anosmia: false,
          other: { checked: false, note: '' },
          usage: 'none',
        });

        setFluHistory({
          asymptomatic: false,
          respiratory: false,
          headache: false,
          other: { checked: false, note: '' },
          usage: 'none',
        });
        
      };
    

      
      

      return (
        <ScrollView style={styles.container}>
          <Text style={styles.title}>{t('dailyHealthData')}</Text>
    
          <Text>{t('daily_weight')}</Text>
          <TextInput style={styles.input} value={weight} onChangeText={setWeight} placeholder={t('daily_weightPlaceholder')} keyboardType="numeric" />
    
          <Text>{t('daily_bloodPressure')}</Text>
          <TextInput style={styles.input} value={bloodPressure} onChangeText={setBloodPressure} placeholder={t('daily_bloodPressurePlaceholder')} />
    
          <Text>{t('daily_heartRate')}</Text>
          <TextInput style={styles.input} value={heartRate} onChangeText={setHeartRate} placeholder={t('daily_heartRatePlaceholder')} keyboardType="numeric" />
    
          <View style={styles.sectionBox}>
            <Text style={styles.sectionTitle}>{t('newSymptoms')}</Text>
            {Object.entries(newSymptoms)
            .filter(([key]) => key !== 'severity')
            .map(([key, value]) => (
            <View key={key} style={styles.checkboxContainer}>
              <TouchableOpacity
                style={[styles.checkboxBase, value && styles.checkboxChecked]}
                onPress={() => toggleNewSymptoms(key as NewSymptomKey)}
              >{value && <Text style={styles.checkmark}>✓</Text>}
              </TouchableOpacity>
              <Text style={styles.label}>{t(key)}</Text>
            </View>
          ))}
          <Text style={styles.subtitle}>{t('overallSeverity')}</Text>
            {['none', 'mild', 'severe', 'treated'].map(level => (
              <TouchableOpacity
                key={level}
                style={styles.radioContainer}
                onPress={() =>
                  setNewSymptoms(prev => ({ ...prev, severity: level }))
                }
              >
                <View style={[styles.radioOuter, newSymptoms.severity === level && styles.radioSelected]}>
                  {newSymptoms.severity === level && <View style={styles.radioInner} />}
                </View>
                <Text style={styles.radioLabel}>{t(level)}</Text>
              </TouchableOpacity>
            ))}
          </View>
          
          <View style={styles.sectionBox}>
            <Text style={styles.sectionTitle}>{t('medicalHistory')}</Text>
            {Object.entries(medicalHistory)
              .filter(([key]) => key !== 'severity')
              .map(([key, value]) => (
                <View key={key} style={styles.checkboxContainer}>
                  <TouchableOpacity
                    style={[styles.checkboxBase, value && styles.checkboxChecked]}
                    onPress={() =>
                      toggleMedicalHistory(key as MedicalHistoryKey)
                    }
                  >
                    {value && <Text style={styles.checkmark}>✓</Text>}
                  </TouchableOpacity>
                  <Text style={styles.label}>{t(key)}</Text>
                </View>
            ))}
            <Text style={styles.subtitle}>{t('overallSeverity')}</Text>
            {['none', 'recovered', 'underTreatment'].map(level => (
              <TouchableOpacity
                key={level}
                style={styles.radioContainer}
                onPress={() =>
                  setMedicalHistory(prev => ({ ...prev, severity: level }))
                }
              >
                <View style={[styles.radioOuter, medicalHistory.severity === level && styles.radioSelected]}>
                  {medicalHistory.severity === level && <View style={styles.radioInner} />}
                </View>
                <Text style={styles.radioLabel}>{t(level)}</Text>
              </TouchableOpacity>
            ))}
          </View>
          
          <View style={styles.sectionBox}>
            <Text style={styles.sectionTitle}>{t('existingConditions')}</Text>
            {Object.entries(existingConditions)
              .filter(([key]) => key !== 'severity')
              .map(([key, value]) => {
                const v = value as { checked: boolean; note: string };
                const isOther = key ==='otherSevere';

                return(
                <View key={key} style={{ marginBottom: 12 }}>
                  <View style={styles.checkboxContainer}>
                    <TouchableOpacity
                      style={[styles.checkboxBase, v.checked && styles.checkboxChecked]}
                      onPress={() => toggleExistingCondition(key as ExistingConditionKey)}
                    >
                      {v.checked && <Text style={styles.checkmark}>✓</Text>}
                    </TouchableOpacity>
                    <Text style={styles.label}>{t(key)}</Text>
                  </View>

                  {isOther && v.checked && (
                    <TextInput
                      style={styles.input}
                      placeholder={t('daily_detail')}
                      value={v.note}
                      onChangeText={(text) =>
                        setExistingConditions(prev => ({
                          ...prev,
                          [key]: {
                            ...(prev[key as keyof typeof existingConditions] as any),
                            note: text,
                          },
                        }))
                      }
                    />
                  )}
                </View>
            )})}
            <Text style={styles.subtitle}>{t('overallSeverity')}</Text>
            {['none', 'recovered', 'underTreatment'].map(level => (
              <TouchableOpacity
                key={level}
                style={styles.radioContainer}
                onPress={() =>
                  setExistingConditions(prev => ({ ...prev, severity: level }))
                }
              >
                <View style={[styles.radioOuter, existingConditions.severity === level && styles.radioSelected]}>
                  {existingConditions.severity === level && <View style={styles.radioInner} />}
                </View>
                <Text style={styles.radioLabel}>{t(level)}</Text>
              </TouchableOpacity>
            ))}
          </View>
          
          <View style={styles.sectionBox}>
            <Text style={styles.sectionTitle}>{t('chronicMedication')}</Text>
            {Object.entries(chronicMeds)
              .filter(([key]) => key !== 'usage')
              .map(([key, value]) => {
                const v = typeof value === 'object' && value !== null
                ? value as { checked: boolean; note?: string }
                : { checked: value as boolean};
                const isOther = key === 'other';

                return(
                <View key={key} style={{ marginBottom: 12 }}>
                  <View style={styles.checkboxContainer}>
                    <TouchableOpacity
                      style={[styles.checkboxBase, v.checked && styles.checkboxChecked]}
                      onPress={() => togglechronicMeds(key as ChronicMedsKey)}
                    >
                      {v.checked && <Text style={styles.checkmark}>✓</Text>}
                    </TouchableOpacity>
                    <Text style={styles.label}>{t(key)}</Text>
                  </View>

                  {isOther && v.checked && (
                    <TextInput
                      style={styles.input}
                      placeholder={t('daily_detail')}
                      value={v.note}
                      onChangeText={(text) =>
                        setChronicMeds(prev => ({
                          ...prev,
                          [key]: {
                            ...(prev[key as keyof typeof chronicMeds] as any),
                            note: text,
                          },
                        }))
                      }
                    />
                  )}
                </View>
            )})}
            <Text style={styles.subtitle}>{t('usage')}</Text>
            {['none', 'used', 'using'].map(level => (
              <TouchableOpacity
                key={level}
                style={styles.radioContainer}
                onPress={() =>
                  setChronicMeds(prev => ({ ...prev, usage: level }))
                }
              >
                <View style={[styles.radioOuter, chronicMeds.usage === level && styles.radioSelected]}>
                  {chronicMeds.usage === level && <View style={styles.radioInner} />}
                </View>
                <Text style={styles.radioLabel}>{t(level)}</Text>
              </TouchableOpacity>
            ))}
          </View>
            
          <View style={styles.sectionBox}>
            <Text style={styles.sectionTitle}>{t('covidInfection')}</Text>
            {Object.entries(covidInfection)
              .filter(([key]) => key !== 'usage')
              .map(([key, value]) => {
                const v = typeof value === 'object' && value !== null
                ? value as { checked: boolean; note?: string }
                : { checked: value as boolean};
                const isOther = key === 'other';
                return(
                <View key={key} style={{ marginBottom: 12 }}>
                  <View style={styles.checkboxContainer}>
                    <TouchableOpacity
                      style={[styles.checkboxBase, v.checked && styles.checkboxChecked]}
                      onPress={() => togglecovidInfection(key as CovidInfectionKey)}
                    >
                      {v.checked && <Text style={styles.checkmark}>✓</Text>}
                    </TouchableOpacity>
                    <Text style={styles.label}>{t(key)}</Text>
                  </View>

                  {isOther && v.checked && (
                    <TextInput
                      style={styles.input}
                      placeholder="Enter detail"
                      value={v.note}
                      onChangeText={(text) =>
                        setCovidInfection(prev => ({
                          ...prev,
                          [key]: {
                            ...(prev[key as keyof typeof covidInfection] as any),
                            note: text,
                          },
                        }))
                      }
                    />
                  )}
                </View>
            )})}
            <Text style={styles.subtitle}>{t('usage')}</Text>
            {['none', 'used', 'using'].map(level => (
              <TouchableOpacity
                key={level}
                style={styles.radioContainer}
                onPress={() =>
                  setCovidInfection(prev => ({ ...prev, usage: level }))
                }
              >
                <View style={[styles.radioOuter, covidInfection.usage === level && styles.radioSelected]}>
                  {covidInfection.usage === level && <View style={styles.radioInner} />}
                </View>
                <Text style={styles.radioLabel}>{t(level)}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.sectionBox}>
            <Text style={styles.sectionTitle}>{t('fluHistory')}</Text>
            {Object.entries(fluHistory)
              .filter(([key]) => key !== 'usage')
              .map(([key, value]) => {
                const v = typeof value === 'object' && value !== null
                ? value as { checked: boolean; note?: string }
                : { checked: value as boolean};
                const isOther = key === 'other';

                return(
                <View key={key} style={{ marginBottom: 12 }}>
                  <View style={styles.checkboxContainer}>
                    <TouchableOpacity
                      style={[styles.checkboxBase, v.checked && styles.checkboxChecked]}
                      onPress={() => togglefluHistory(key as FluHistoryKey)}
                    >
                      {v.checked && <Text style={styles.checkmark}>✓</Text>}
                    </TouchableOpacity>
                    <Text style={styles.label}>{t(key)}</Text>
                  </View>

                  {isOther && v.checked && (
                    <TextInput
                      style={styles.input}
                      placeholder={t('daily_detail')}
                      value={v.note}
                      onChangeText={(text) =>
                        setFluHistory(prev => ({
                          ...prev,
                          [key]: {
                            ...(prev[key as keyof typeof fluHistory] as any),
                            note: text,
                          },
                        }))
                      }
                    />
                  )}
                </View>
            )})}
            <Text style={styles.subtitle}>{t('usage')}</Text>
            {['none', 'used', 'using'].map(level => (
              <TouchableOpacity
                key={level}
                style={styles.radioContainer}
                onPress={() =>
                  setFluHistory(prev => ({ ...prev, usage: level }))
                }
              >
                <View style={[styles.radioOuter, fluHistory.usage === level && styles.radioSelected]}>
                  {fluHistory.usage === level && <View style={styles.radioInner} />}
                </View>
                <Text style={styles.radioLabel}>{t(level)}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity style={styles.saveButton} onPress={handleSubmit}>
                  <Text style={styles.saveButtonText}>{t('daily_save')}</Text>
          </TouchableOpacity>
        </ScrollView>
      );
    }
    
    const styles = StyleSheet.create({
      container: { flex: 1, padding: 16, backgroundColor: 'white' },
      title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
      subtitle: { fontSize: 18, fontWeight: '600', marginTop: 16, marginBottom: 8 },
      input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 10, borderRadius: 5 },
    
      label: { marginLeft: 8, fontSize: 16 },
      checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
      },
      
      checkboxBase: {
        width: 24,
        height: 24,
        borderRadius: 4, 
        borderWidth: 2,
        borderColor: '#999',
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 8,
      },
      
      checkboxChecked: {
        backgroundColor: '#007AFF',
        borderColor: '#007AFF',
      },
      
      checkmark: {
        color: 'white',
        fontSize: 16,
      },
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

      radioContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
      },
      
      radioOuter: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#999',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 8,
      },
      
      radioInner: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#007AFF',
      },
      
      radioSelected: {
        borderColor: '#007AFF',
      },
      
      radioLabel: {
        fontSize: 16,
      },

      sectionBox: {
        backgroundColor: 'white', 
        borderRadius: 30,
        padding: 16,
        marginBottom: 24,
        borderWidth: 2,
        borderColor: '#E53935',
      },
      
      sectionTitle: {
        color: '#E53935',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 12,
      },
    });
    
    