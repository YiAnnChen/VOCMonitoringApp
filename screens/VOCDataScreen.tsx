import React ,{useEffect,useState}from 'react';
import { View, Text, ScrollView, Dimensions,ActivityIndicator,StyleSheet } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import tolueneData from '../assets/toluene_time_concentration.json';

const screenWidth = Dimensions.get('window').width;

export default function VOCDataScreen(){

  const[labels, setLabels] = useState<string[]>([]);
  const[values, setValues] = useState<number[]>([]);
  const[loading,setLoading] = useState(true);

  useEffect(() => {
    const loadData = async() => {
      const timeData = tolueneData.map(d => d.time.toFixed(1));
      const concentrationData = tolueneData.map(d => d.concentration);
      setLabels(timeData);
      setValues(concentrationData);
      setLoading(false);
    };
    loadData();
  }, []);

  const chartData = {
    labels:labels,
    datasets: [{data:values,strokeWidth:2}],
  };

  if(loading){
    return <ActivityIndicator size="large" color='#007bff' style={{marginTop:100}} />;
  }

  return(
    <ScrollView style={{padding:16,backgroundColor:'white'}}>
      <Text style={{fontSize:20, fontWeight:'bold',marginBottom:16}}>
        Concentration vs. Time
      </Text>
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
    row:{
      flexDirection: 'row',
      justifyContent: 'space-between',
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