import React ,{useEffect,useState,useLayoutEffect}from 'react';
import { View, Text, ScrollView, Dimensions,ActivityIndicator,StyleSheet,TouchableOpacity } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import tolueneData from '../assets/toluene_time_concentration.json';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';

const screenWidth = Dimensions.get('window').width;

const TIME_FILTERS = [
  {key:'15m',maxSeconds:900},
  {key:'30m',maxSeconds:1800},
  {key:'1h',maxSeconds:3600},
  {key:'1_5h',maxSeconds:5400},
  {key:'2h',maxSeconds:7200},
]as const;

export default function VOCDataScreen(){

  const { t } = useTranslation();
  const nav = useNavigation();
  const[labels, setLabels] = useState<string[]>([]);
  const[values, setValues] = useState<number[]>([]);
  const[loading,setLoading] = useState(true);
  const[selectedFilter, setSelectedFilter] = useState(0);

  const applyFilter = (maxSeconds: number) => {
    const filtered = tolueneData.filter(d => d.time <=maxSeconds);
    const timeData = filtered.map(d => d.time.toFixed(1));
    const concentrationData = filtered.map(d => d.concentration);
    setLabels(timeData);
    setValues(concentrationData);
  };

  useEffect(() => {
    applyFilter(TIME_FILTERS[selectedFilter].maxSeconds);
    setLoading(false);
  }, [selectedFilter]);

  useLayoutEffect(() => {
    nav.setOptions?.({ title: t('voc.header') }); // 讓標頭跟著語系變動
  }, [nav, t]);

  const chartData = {
    labels:labels,
    datasets: [{data:values,strokeWidth:2}],
  };

  if(loading){
    return <ActivityIndicator size="large" color='#007bff' style={{marginTop:100}} />;
  }

  return(
    <ScrollView style={{padding:16,backgroundColor:'white'}}>
      <Text style={styles.title}>
        {t('voc.title')}
      </Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
        <View style={styles.filterRowHorizontal}>
          {TIME_FILTERS.map((filter,index) => (
              <TouchableOpacity
                key={filter.key}
                style={[styles.filterButton,selectedFilter ===index && styles.selectedFilterButton]}
                onPress={() => setSelectedFilter(index)}
              >
                <Text style={selectedFilter === index ? styles.selectedFilterText : styles.filterText}>
                  {t(`voc.ranges.${filter.key}`)}
                </Text>
              </TouchableOpacity>
            ))
          }
        </View>
      </ScrollView>
      <LineChart 
        data={chartData}
        width={screenWidth - 32}
        height={260}
        chartConfig={{
          backgroundGradientFrom: '#fff',
          backgroundGradientTo: '#fff',
          decimalPlaces:2,
          color:(opacity = 1) => `rgba(34,128,176,${opacity})`,
          labelColor:() => '#000',
        }}
        bezier
        style={{
          marginVertical:8,
          borderRadius:16,
        }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
    container:{
      padding:16,
      backgroundColor: 'white',
    },
    title:{
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 16,
    },
    filterScroll:{
      marginBottom:12,
    },
    filterRowHorizontal:{
      flexDirection: 'row',
    },
    filterButton:{
      paddingVertical:6,
      paddingHorizontal:10,
      margin:4,
      borderRadius:10,
      backgroundColor:'#f1f3f5',
    },
    selectedFilterButton:{
      backgroundColor: '#228be6',
    },
    filterText:{
      color:'#000',
      fontWeight:'500',
    },
    selectedFilterText:{
      color:'#fff',
      fontWeight:'700',
    },
    card:{
      padding:16,
      margin: 8,
      backgroundColor: '#f8f9fa',
      borderRadius: 8,
      alignItems: 'center',
    },
    cardText:{
      fontSize:16,
      fontWeight:'600',
    },
  });