import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';

const BookingAcceptScreen = ({ isVisible, onAccept }) => {
  return (
    <Modal
      transparent={true}
      visible={isVisible}
      onRequestClose={() => {}} // Prevent closing on back button press
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Booking Details */}
          <Text style={styles.header}>Booking Request</Text>

          <View style={styles.section}>
            <Text style={styles.label}>Pickup Location</Text>
            <Text style={styles.value}>Coimbatore International Airport, sitra</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Drop Location</Text>
            <Text style={styles.value}>Gandhipuram New Bus Stand</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Fare</Text>
            <Text style={styles.value}>$217.86</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Distance</Text>
            <Text style={styles.value}>0.1 Km</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Remaining Bids</Text>
            <Text style={styles.value}>03</Text>
          </View>

          {/* Accept Button */}
          <TouchableOpacity style={styles.acceptButton} onPress={onAccept}>
            <Text style={styles.acceptButtonText}>ACCEPT BOOKING</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  container: {
    width: '90%',
    backgroundColor: '#fff', // White background
    borderRadius: 10,
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center', // Center the header text
  },
  section: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    color: '#666', // Gray color for labels
    marginBottom: 4,
  },
  value: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333', // Dark color for values
  },
  acceptButton: {
    backgroundColor: '#007BFF', // Blue background for the accept button
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  acceptButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff', // White text for the button
  },
});

export default BookingAcceptScreen;