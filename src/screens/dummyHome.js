import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React from 'react';

const DummyHome = ({ navigation }) => {
  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={() => navigation.navigate('SplashScreen')} // Navigate to SplashScreen on press
      activeOpacity={0.8} // Optional: Adds a slight opacity effect when pressed
    >
      <Text style={styles.text}>Vijay Connect Driver APK Initial View</Text>
    </TouchableOpacity>
  );
};

export default DummyHome;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  text: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 20,
  },
});