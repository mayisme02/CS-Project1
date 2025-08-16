import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';

export default function WelcomeScreen() {
  const handleGetStarted = () => {
    // Navigate to tabs
    router.replace('/(tabs)');
  };

  return (
    <View style={styles.container}>
      {/* ใช้ Image แทน img */}
      <Image 
        source={require('../assets/images/01.png')}
        style={styles.dogImg}
        resizeMode="contain"
      />
      
      <Text style={styles.title}>Hey! Welcome</Text>
      <Text style={styles.subtitle}>
        While You Sit And Stay - We'll Go Out And Play
      </Text>
      
      {/* ใช้ TouchableOpacity แทน Link */}
      <TouchableOpacity style={styles.btn} onPress={handleGetStarted}>
        <Text style={styles.btnText}>GET STARTED</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  dogImg: {
    width: 200,
    height: 200,
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
    paddingHorizontal: 20,
    lineHeight: 24,
  },
  btn: {
    backgroundColor: '#0a7ea4',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 25,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  btnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});