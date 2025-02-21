import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker'; // For image picking functionality

const UpdateProfilePhoto = () => {
  const [profilePhoto, setProfilePhoto] = useState(null);
  const navigation = useNavigation();

  const handleTakePhoto = async () => {
    // Request camera permissions
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need camera permissions to make this work!');
      return;
    }

    // Launch the camera to take a photo
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setProfilePhoto(result.uri); // Set the profile photo URI
    }
  };

  const handleNext = () => {
    if (!profilePhoto) {
      alert('Please take a profile photo');
      return;
    }
    console.log('Profile Photo URI:', profilePhoto);
    // Navigate to the next screen
    navigation.navigate('NextScreen'); // Replace 'NextScreen' with your actual screen name
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Profile Photo</Text>
      <Text style={styles.subtitle}>Instructions</Text>
      <Text style={styles.instruction}>
        The photo must be coloured, clear, focused image with no marks or red eye.
      </Text>
      <Text style={styles.instruction}>
        No shadows or reflections with appropriate brightness and contrast to show natural skin.
      </Text>
      <Text style={styles.instruction}>
        You shouldn't wear caps, masks, and goggles.
      </Text>
      <Text style={styles.instruction}>
        Your Profile photo will be visible to customers when you are assigned to their ride. Make sure it's a good one.
      </Text>

      {profilePhoto && (
        <Image source={{ uri: profilePhoto }} style={styles.profileImage} />
      )}

      <TouchableOpacity style={styles.takePhotoButton} onPress={handleTakePhoto}>
        <Text style={styles.takePhotoButtonText}>Take Photo</Text>
      </TouchableOpacity>

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
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  instruction: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    alignSelf: 'center',
    marginVertical: 20,
  },
  takePhotoButton: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20,
  },
  takePhotoButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  nextButton: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default UpdateProfilePhoto;