import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

export default function HistoryGraphScreen(){
  return(
    <View style={styles.container}>
      <Text style={styles.title}>VOC Level Over Time</Text>
      <LineChart
          data={{
            labels: ['0s','10s','20s','30s'],
            datasets:[{data:[0.1, 0.5, 0.3, 0.7] }],
          }}
          width={320}
          height={220}
          chartConfig={{
            backgroundGradientFrom:'#fff',
            backgroundGradientTo:'#fff',
            color: (opacity = 1) => 'rgba(0,0,255,${opacity})',
          }}
          />
    </View>
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