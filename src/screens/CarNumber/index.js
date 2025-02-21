import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';

const CarNumberScreen = ({ navigation }) => {
  const [carNumber, setCarNumber] = useState('');

  const handleTakeRide = () => {
    if (carNumber.trim() === '') {
      alert('Please enter your car number');
      return;
    }

    // Navigate to the next screen (e.g., RideConfirmationScreen)
    navigation.navigate('Dashboard', { carNumber });
  };

  return (
    <View style={styles.container}>
      {/* Screen Header */}
      <Text style={styles.headerText}>Car Number</Text>

      {/* Instruction Text */}
      <Text style={styles.instructionText}>Please Enter Your Car Number to Take Ride</Text>

      {/* Car Number Input */}
      <TextInput
        style={styles.input}
        placeholder="eg. TN37AB1234"
        placeholderTextColor="#999"
        value={carNumber}
        onChangeText={setCarNumber}
      />

      {/* Example Car Numbers */}
      <View style={styles.exampleContainer}>
        <Text style={styles.exampleText}>eg. TN38AB0987</Text>
        <Text style={styles.exampleText}>eg. TN36AP5678</Text>
      </View>

      {/* Take Ride Button */}
      <TouchableOpacity style={styles.button} onPress={handleTakeRide}>
        <Text style={styles.buttonText}>Take Ride</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 10,
  },
  instructionText: {
    fontSize: 16,
    color: 'gray',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#f2f2f2',
    paddingHorizontal: 15,
    borderRadius: 5,
    marginBottom: 20,
    fontSize: 16,
    color: 'black',
  },
  exampleContainer: {
    marginBottom: 20,
  },
  exampleText: {
    fontSize: 14,
    color: 'gray',
    textAlign: 'center',
  },
  button: {
    width: '100%',
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CarNumberScreen;