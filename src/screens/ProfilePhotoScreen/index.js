import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage

const ProfilePhotoScreen = ({ navigation }) => {
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false); // To track loading state

  const handlePhotoSelection = () => {
    Alert.alert(
      "Upload Photo",
      "Choose an option",
      [
        {
          text: "Camera",
          onPress: () => openCamera(),
        },
        {
          text: "Gallery",
          onPress: () => openGallery(),
        },
        {
          text: "Cancel",
          style: "cancel",
        },
      ]
    );
  };

  const openCamera = () => {
    console.log("Opening camera...");
    launchCamera({ mediaType: 'photo', quality: 1 }, (response) => {
      console.log("Camera response:", response);
      if (!response.didCancel && !response.error) {
        setPhoto(response.assets[0].uri);
        console.log("Photo selected from camera:", response.assets[0].uri);
      } else {
        console.log("Camera selection canceled or error:", response.error);
      }
    });
  };

  const openGallery = () => {
    console.log("Opening gallery...");
    launchImageLibrary({ mediaType: 'photo', quality: 1 }, (response) => {
      console.log("Gallery response:", response);
      if (!response.didCancel && !response.error) {
        setPhoto(response.assets[0].uri);
        console.log("Photo selected from gallery:", response.assets[0].uri);
      } else {
        console.log("Gallery selection canceled or error:", response.error);
      }
    });
  };

  const handleUpload = async () => {
    if (!photo) {
      Alert.alert("Error", "Please select a photo.");
      console.log("Error: No photo selected.");
      return;
    }

    // Fetch the token from AsyncStorage
    const storedToken = await AsyncStorage.getItem('access_token');
    if (!storedToken) {
      Alert.alert("Error", "Authorization token is missing.");
      console.log("Error: No authorization token found.");
      return;
    }

    console.log("Token retrieved from AsyncStorage:", storedToken);

    setLoading(true); // Start the loading state

    const formData = new FormData();

    



    formData.append('file', {
        uri: photo,
        type: 'image/jpeg', // You can adjust the type based on the image format (e.g., 'image/png')
        name: 'profile_photo.jpg',
    });

    try {
      console.log("Uploading photo...");

      const response = await fetch('http://52.66.69.48:4000/upload?type=PHOTO', {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${storedToken}`, // Attach the token to the request header
        },
        body: formData,
      });

      const data = await response.json();
      console.log("API response:", data);

      if (response.ok) {
        // Success: Handle response accordingly
        Alert.alert('Success', 'Photo uploaded successfully');
        console.log('Upload Success:', data);
        navigation.navigate('AadhaarUploadScreen');
      } else {
        // Failure: Show error message
        Alert.alert('Error', data.message || 'Something went wrong');
        console.log('Upload Error:', data.message || 'Something went wrong');
      }
    } catch (error) {
      // Network or other errors
      Alert.alert('Error', 'Something went wrong. Please try again later.');
      console.log('Network Error:', error);
    } finally {
      setLoading(false); // End the loading state
      console.log("Loading finished.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile Photo</Text>
      
      <Text style={styles.instructionsHeader}>Instructions</Text>
      <Text style={styles.instructions}>
        • The photo must be colored, clear, and focused with no marks or red eye. {"\n"}
        • No shadows or reflections with appropriate brightness and contrast. {"\n"}
        • You shouldn’t wear caps, masks, and goggles.
      </Text>

      <View style={styles.noticeBox}>
        <Text style={styles.noticeText}>
          Your profile photo will be visible to customers when you are assigned to their ride. Make sure it’s a good one.
        </Text>
      </View>

      <TouchableOpacity onPress={handlePhotoSelection} style={styles.photoContainer}>
        {photo ? (
          <Image source={{ uri: photo }} style={styles.photo} />
        ) : (
          <Text style={styles.takePhotoText}>Take Photo</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.nextButton, loading && styles.loadingButton]}
        onPress={handleUpload}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.nextButtonText}>Next</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  instructionsHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  instructions: {
    fontSize: 14,
    color: '#555',
    marginBottom: 15,
  },
  noticeBox: {
    backgroundColor: '#F3F3F3',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  noticeText: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
  },
  photoContainer: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 20,
  },
  photo: {
    width: '100%',
    height: '100%',
    borderRadius: 75,
  },
  takePhotoText: {
    color: 'purple',
    fontSize: 16,
    fontWeight: 'bold',
  },
  nextButton: {
    backgroundColor: 'purple',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  loadingButton: {
    backgroundColor: '#D3B8F0',
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProfilePhotoScreen;
