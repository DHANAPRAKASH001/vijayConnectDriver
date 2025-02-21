import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, Image } from 'react-native';
import { APP_ICONS } from '../../utils/icons'; // Import the APP_ICONS object

const ContactSupportScreen = ({ navigation }) => {
  // Function to handle the call action
  const handleCall = () => {
    const phoneNumber = '+918056631317'; // Replace with the actual toll-free number
    Linking.openURL(`tel:${phoneNumber}`); // Opens the dialer with the number
  };

  // Function to handle the back button press
  const handleBack = () => {
    console.log('Back button pressed'); // Debugging
    navigation.goBack(); // Navigate to the previous screen
  };

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity onPress={handleBack} style={styles.backButton}>
        <Image source={APP_ICONS.BACK} style={styles.backIcon} /> {/* Use the back icon from APP_ICONS */}
      </TouchableOpacity>

      {/* Header */}
      <Text style={styles.header}>Contact Support</Text>

      {/* Lines after the header */}
      <View style={styles.lineContainer}>
        <View style={styles.line} />
      </View>

      {/* Toll-Free Number Section */}
      <View style={styles.content}>
        <Text style={styles.label}>Toll Free No</Text>
        <TouchableOpacity onPress={handleCall} style={styles.phoneContainer}>
          <Image source={APP_ICONS.CALL} style={styles.callIcon} /> {/* Use the call icon from APP_ICONS */}
          <Text style={styles.phoneNumber}>+91 80566 31317</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff', // White background
    paddingTop: 20, // Add padding at the top for the header
  },
  backButton: {
    position: 'absolute',
    top: 30, // Adjust the top position as needed
    left: 20, // Adjust the left position as needed
    padding: 10, // Add padding to make the touch area larger
    zIndex: 1, // Ensure the button is above other elements
  },
  backIcon: {
    width: 20,
    height: 20,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center', // Center the header text
    marginTop: 17, // Add margin at the top for the header
    marginBottom: 10, // Space below the header
  },
  lineContainer: {
    alignItems: 'center',
    // marginBottom: 20, // Space below the lines
  },
  line: {
    width: '80%', // Width of the line
    height: 1, // Height of the line (thickness)
    backgroundColor: '#ccc', // Color of the line
    marginVertical: 5, // Space between the lines
  },
  content: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 20,
  },
  label: {
    fontSize: 18,
    color: '#666',
    marginBottom: 10, // Space between label and phone number
  },
  phoneContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f0f0', // Light gray background for the phone container
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10, // Rounded corners
    borderWidth: 1,
    borderColor: '#ddd', // Light border color
  },
  callIcon: {
    width: 24,
    height: 24,
    marginRight: 10, // Space between icon and phone number
  },
  phoneNumber: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
  },
});

export default ContactSupportScreen;