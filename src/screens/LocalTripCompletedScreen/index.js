import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { APP_ICONS } from '../../utils/icons'; // Import the APP_ICONS object

const LocalTripCompletedScreen = ({ navigation }) => { // Add navigation prop
  return (
    <View style={styles.container}>
      <Text style={styles.header}>VijayConnect</Text>
      <Text style={styles.subHeader}>Trip Completed Successfully</Text>
      
      {/* Image added here */}
      <Image source={APP_ICONS.TICK} style={styles.tickImage} />

      <View style={styles.fareContainer}>
        <Text style={styles.fareText}>217.86</Text>
        <Text style={styles.fareLabel}>Ride Fare</Text>
      </View>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Collect Cash</Text>
      </TouchableOpacity>

      {/* Corrected onPress placement */}
      <TouchableOpacity
        style={styles.okButton}
        onPress={() => navigation.navigate('LocalTripDashboard')} // Corrected onPress prop
      >
        <Text style={styles.okButtonText}>Okay</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subHeader: {
    fontSize: 18,
    color: 'gray',
    marginBottom: 20,
  },
  tickImage: {
    width: 50,
    height: 50,
    marginBottom: 20,
  },
  fareContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  fareText: {
    fontSize: 36,
    fontWeight: 'bold',
  },
  fareLabel: {
    fontSize: 16,
    color: 'gray',
  },
  button: {
    backgroundColor: 'grey',
    padding: 15,
    borderRadius: 5,
    width: '80%',
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
  okButton: {
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 5,
    width: '80%',
    alignItems: 'center',
  },
  okButtonText: {
    color: 'white',
    fontSize: 18,
  },
});

export default LocalTripCompletedScreen;