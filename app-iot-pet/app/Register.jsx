import { Link } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import { Pressable } from 'react-native';


export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text>Home</Text>
      <Link href="/login">Login</Link>
      <Link href="/register">Register</Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
