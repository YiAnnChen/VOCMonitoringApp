import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';

export default function LegalLimitsScreen(){
  return(
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Legal Exposure Limits</Text>
      {[
                { name: 'Dichloromethane', twa: '25ppm', stel: '125ppm' },
                { name: 'Benzene', twa: '1ppm', stel: '5ppm' },
            ].map((item, index) => (
                <View key={index} style={styles.card}>
                    <Text style={styles.cardText}>{item.name}</Text>
                    <Text>TWA (8hr): {item.twa}</Text>
                    <Text>STEL (15min): {item.stel}</Text>
                </View>
      ))}
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