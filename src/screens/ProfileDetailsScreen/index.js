import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Image } from 'react-native';
import { APP_ICONS } from '../../utils/icons'; // Import the APP_ICONS object
import CheckBox from '@react-native-community/checkbox'; // For checkboxes

const ProfileDetailsScreen = ({ navigation }) => {
  // State for editable fields
  const [contactNumber, setContactNumber] = useState('1234567890');
  const [otherContactNumber, setOtherContactNumber] = useState('1234567890');
  const [sosNumber, setSosNumber] = useState('1234567890');

  // State for language selection
  const [englishSelected, setEnglishSelected] = useState(true);
  const [otherLanguageSelected, setOtherLanguageSelected] = useState(false);

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Image source={APP_ICONS.BACK} style={styles.backIcon} /> {/* Use the back icon from APP_ICONS */}
      </TouchableOpacity>

      {/* Profile Details */}
      <View style={styles.content}>
        <Text style={styles.header}>Profile Details</Text>

        {/* Name (Non-editable) */}
        <View style={styles.section}>
          <Text style={styles.label}>Name</Text>
          <Text style={styles.value}>Sam</Text>
        </View>

        {/* Contact Number (Editable) */}
        <View style={styles.section}>
          <Text style={styles.label}>Contact Number</Text>
          <TextInput
            style={styles.input}
            value={contactNumber}
            onChangeText={setContactNumber}
            keyboardType="phone-pad"
          />
        </View>

        {/* Other Contact Number (Optional, Editable) */}
        <View style={styles.section}>
          <Text style={styles.label}>Other Contact Number (Optional)</Text>
          <TextInput
            style={styles.input}
            value={otherContactNumber}
            onChangeText={setOtherContactNumber}
            keyboardType="phone-pad"
          />
        </View>

        {/* SOS Number (Editable) */}
        <View style={styles.section}>
          <Text style={styles.label}>SOS Number</Text>
          <TextInput
            style={styles.input}
            value={sosNumber}
            onChangeText={setSosNumber}
            keyboardType="phone-pad"
          />
        </View>

        {/* Language Selection (Checkboxes) */}
        <View style={styles.section}>
          <Text style={styles.label}>Language</Text>
          <View style={styles.checkboxContainer}>
            <View style={styles.checkboxItem}>
              <CheckBox
                value={englishSelected}
                onValueChange={setEnglishSelected}
              />
              <Text style={styles.checkboxLabel}>English</Text>
            </View>
            <View style={styles.checkboxItem}>
              <CheckBox
                value={otherLanguageSelected}
                onValueChange={setOtherLanguageSelected}
              />
              <Text style={styles.checkboxLabel}>Other Language</Text>
            </View>
          </View>
        </View>

        {/* License Number (Non-editable) */}
        <View style={styles.section}>
          <Text style={styles.label}>License Number</Text>
          <Text style={styles.value}>TN37 98761234456</Text>
        </View>
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
    width: 24,
    height: 24,
  },
  content: {
    marginTop: 80, // Add margin to avoid overlap with the back button
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center', // Center the header text
  },
  section: {
    marginBottom: 20,
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
  input: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
  },
  checkboxContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  checkboxItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkboxLabel: {
    fontSize: 16,
    color: '#333',
    marginLeft: 8,
  },
});

export default ProfileDetailsScreen;