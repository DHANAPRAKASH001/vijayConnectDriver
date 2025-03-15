import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Ensure you import AsyncStorage

const RegisterProfile = () => {
  // Initial test values for the form fields
  const [name, setName] = useState('John Doe');
  const [email, setEmail] = useState('johndoe@example.com');
  const [mobile, setMobile] = useState('9876543210');
  const [gender, setGender] = useState('Male');
  const [dob, setDob] = useState('1990-01-01');
  const [permanentAddress, setPermanentAddress] = useState('123, Elm Street, Springfield');
  const [localAddress, setLocalAddress] = useState('456, Oak Street, Springfield');
  const [aadhaarNumber, setAadhaarNumber] = useState('123456789012');
  const [drivingLicenseNumber, setDrivingLicenseNumber] = useState('DL1234567890');
  const navigation = useNavigation();

  const handleNext = async () => {
    console.log('handleNext function called');

    // Validate inputs and handle the next action
    if (!name || !email || !mobile || !gender || !dob || !permanentAddress || !localAddress || !aadhaarNumber || !drivingLicenseNumber) {
      alert('Please fill all fields');
      console.log('Validation failed: Please fill all fields');
      return;
    }

    const profileData = {
      name,
      email,
      phone: mobile,
      gender,
      dataOfBirth: dob,
      permanentAddress,
      localAddress,
      aadarCardNumber: aadhaarNumber,
      drivingLicenseNumber,
    };

    console.log('Sending profile data:', profileData);

    try {
      // Retrieve the access token from AsyncStorage
      const token = await AsyncStorage.getItem('access_token');
      if (!token) {
        Alert.alert('Error', 'Authentication token is missing');
        console.log('No access token found');
        return;
      }

      const response = await fetch('http://52.66.69.48:4000/driver', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Include the token in the Authorization header
        },
        body: JSON.stringify(profileData),
      });

      console.log('Response Status:', response.status);
      const data = await response.json();

      console.log('Response Data:', data);

      if (response.ok) {
        // Successfully updated the profile data
        Alert.alert('Success', 'Profile updated successfully');
        console.log('Profile updated successfully');
        navigation.navigate('ProfilePhotoScreen'); // Replace 'ProfilePhotoScreen' with your next screen
      } else {
        // Handle error response from the server
        Alert.alert('Error', data.message || 'Something went wrong');
        console.log('Error in response:', data.message || 'Something went wrong');
      }
    } catch (error) {
      // Handle any network or other errors
      Alert.alert('Error', 'Something went wrong. Please try again later.');
      console.log('Network error:', error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Profile Details</Text>

      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Mobile"
        keyboardType="phone-pad"
        value={mobile}
        onChangeText={setMobile}
      />

      <View style={styles.genderContainer}>
        <Text style={styles.label}>Gender</Text>
        <View style={styles.genderOptions}>
          <TouchableOpacity
            style={[styles.genderButton, gender === 'Male' && styles.selectedGenderButton]}
            onPress={() => {
              console.log('Selected Gender: Male');
              setGender('Male');
            }}
          >
            <Text style={styles.genderText}>Male</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.genderButton, gender === 'Female' && styles.selectedGenderButton]}
            onPress={() => {
              console.log('Selected Gender: Female');
              setGender('Female');
            }}
          >
            <Text style={styles.genderText}>Female</Text>
          </TouchableOpacity>
        </View>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Date of Birth"
        value={dob}
        onChangeText={setDob}
      />
      <TextInput
        style={styles.input}
        placeholder="Permanent Address"
        value={permanentAddress}
        onChangeText={setPermanentAddress}
      />
      <TextInput
        style={styles.input}
        placeholder="Local Address"
        value={localAddress}
        onChangeText={setLocalAddress}
      />
      <TextInput
        style={styles.input}
        placeholder="Aadhaar Number"
        keyboardType="number-pad"
        value={aadhaarNumber}
        onChangeText={setAadhaarNumber}
      />
      <TextInput
        style={styles.input}
        placeholder="Driving Licence Number"
        value={drivingLicenseNumber}
        onChangeText={setDrivingLicenseNumber}
      />

      <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
        <Text style={styles.nextButtonText}>Next</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  genderContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
  },
  genderOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  genderButton: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  selectedGenderButton: {
    borderColor: '#007BFF',
    backgroundColor: '#e6f2ff',
  },
  genderText: {
    fontSize: 16,
  },
  nextButton: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default RegisterProfile;
