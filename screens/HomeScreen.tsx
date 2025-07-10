import React, { useRef } from 'react';
import { View, Text, Image, StyleSheet, Animated, Pressable, SafeAreaView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

export default function HomeScreen() {
  const navigation = useNavigation();
  const { t, i18n } = useTranslation();

  // 動畫效果封裝元件
  const AnimatedCard = ({ onPress, imageSource, label }: { onPress: () => void, imageSource: any, label: string }) => {
    const scale = useRef(new Animated.Value(1)).current;

    const handlePressIn = () => {
      Animated.spring(scale, {
        toValue: 0.95,
        useNativeDriver: true,
      }).start();
    };

    const handlePressOut = () => {
      Animated.spring(scale, {
        toValue: 1,
        friction: 3,
        tension: 40,
        useNativeDriver: true,
      }).start();
    };

    return (
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={styles.cardWrapper}
      >
        <Animated.View style={[styles.card1, { transform: [{ scale }] }]}>
          <Image source={imageSource} style={styles.menuImage} />
          <Text style={styles.menuText}>{label}</Text>
        </Animated.View>
      </Pressable>
    );
  };

  const AnimatedCard2 = ({ onPress, imageSource, label }: { onPress: () => void, imageSource: any, label: string }) => {
    const scale = useRef(new Animated.Value(1)).current;

    const handlePressIn = () => {
      Animated.spring(scale, {
        toValue: 0.95,
        useNativeDriver: true,
      }).start();
    };

    const handlePressOut = () => {
      Animated.spring(scale, {
        toValue: 1,
        friction: 3,
        tension: 40,
        useNativeDriver: true,
      }).start();
    };

    return (
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={styles.cardWrapper}
      >
        <Animated.View style={[styles.card2, { transform: [{ scale }] }]}>
          <Image source={imageSource} style={styles.menuImage} />
          <Text style={styles.menuText}>{label}</Text>
        </Animated.View>
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('title')}</Text>
        <TouchableOpacity
          onPress={ () =>{
            const newLang = i18n.language === 'en' ? 'zh' : 'en';
            i18n .changeLanguage(newLang);
          }}
          style={{position:'absolute',right:20}}
        >
        <Text style={{ fontSize: 20, fontWeight: 'bold' ,paddingHorizontal:6}}>
        {i18n.language === 'en' ? '中' : 'EN'}
        </Text> 
        </TouchableOpacity>
      </View>

      <View style={styles.menuContainer}>
        <AnimatedCard
          onPress={() => navigation.navigate('Profile')}
          imageSource={require('/Users/chenyian/VOCMonitoringApp/assets/info.png')}
          label={t('basicInfo')} 
        />
        <AnimatedCard2
          onPress={() => navigation.navigate('HealthData')}
          imageSource={require('/Users/chenyian/VOCMonitoringApp/assets/health.png')}
          label={t('realTime')}
        />
        <AnimatedCard
          onPress={() => navigation.navigate('VOCData')}
          imageSource={require('/Users/chenyian/VOCMonitoringApp/assets/sensor.png')}
          label={t('sensor')}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 0.5,
    borderColor: '#ccc',
    position: 'relative',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  menuContainer: {
    flex: 1,
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingVertical: 20,
  },
  cardWrapper: {
    borderRadius: 38,
  },
  card1: {
    backgroundColor: '#EB4335', // 卡片背景色（可調）
    borderRadius: 38,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    width: 150,
    height: 190,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  card2: {
    backgroundColor: '#FEF2F1', // 卡片背景色（可調）
    borderRadius: 38,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    width: 150,
    height: 190,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  menuImage: {
    width: 100,
    height: 100,
    borderRadius: 20,
    marginBottom: 10,
  },
  menuText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
