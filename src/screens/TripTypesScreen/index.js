import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { APP_ICONS } from '../../utils/icons'; // Import the APP_ICONS object

const TripTypesScreen = ({ navigation }) => {
  // State to track the selected trip type
  const [selectedTripType, setSelectedTripType] = useState(null);

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Image source={APP_ICONS.BACK} style={styles.backIcon} /> {/* Use the back icon from APP_ICONS */}
      </TouchableOpacity>

      {/* Header */}
      <Text style={styles.header}>Trip Types</Text>

      {/* Lines after the header */}
      <View style={styles.lineContainer}>
        <View style={styles.line} />
        {/* <View style={styles.line} /> */}
      </View>

      {/* Trip Types List */}
      <View style={styles.tripTypesContainer}>
        {/* Rental Trips */}
        <TouchableOpacity
          style={[
            styles.tripTypeItem,
            selectedTripType === 'Rental' && styles.selectedTripType,
          ]}
          onPress={() => setSelectedTripType('Rental')}
        >
          <Text style={styles.tripTypeText}>Rental Trips</Text>
        </TouchableOpacity>

        {/* Local Trips */}
        <TouchableOpacity
          style={[
            styles.tripTypeItem,
            selectedTripType === 'Local' && styles.selectedTripType,
          ]}
          onPress={() => setSelectedTripType('Local')}
        >
          <Text style={styles.tripTypeText}>Local Trips</Text>
        </TouchableOpacity>

        {/* Outstation Trips */}
        <TouchableOpacity
          style={[
            styles.tripTypeItem,
            selectedTripType === 'Outstation' && styles.selectedTripType,
          ]}
          onPress={() => setSelectedTripType('Outstation')}
        >
          <Text style={styles.tripTypeText}>Outstation Trips</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff', // White background
    padding: 16,
  },
  backButton: {
    position: 'absolute',
    top: 50, // Adjust the top position as needed
    left: 20, // Adjust the left position as needed
    zIndex: 1, // Ensure the back button is above other elements
  },
  backIcon: {
    width: 20,
    height: 20,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 30, // Add margin at the top for the header
    marginBottom: 10, // Reduced margin to accommodate lines
    textAlign: 'center', // Center the header text
  },
  lineContainer: {
    alignItems: 'center',
    // marginBottom: 00, // Space below the lines
  },
  line: {
    width: '80%', // Width of the line
    height: 1, // Height of the line (thickness)
    backgroundColor: '#ccc', // Color of the line
    marginVertical: 5, // Space between the lines
  },
  tripTypesContainer: {
    marginTop: 20,
  },
  tripTypeItem: {
    padding: 16,
    backgroundColor: '#f0f0f0', // Light gray background for trip type items
    borderRadius: 8,
    marginBottom: 10,
  },
  selectedTripType: {
    backgroundColor: '#007BFF', // Blue background for the selected trip type
  },
  tripTypeText: {
    fontSize: 18,
    color: '#333',
  },
});

export default TripTypesScreen;