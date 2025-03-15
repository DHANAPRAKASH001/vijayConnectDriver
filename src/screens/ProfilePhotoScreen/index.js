import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfilePhotoScreen = ({ navigation }) => {
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);

  /************************************************************
   * PERMISSIONS
   ************************************************************/
  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera Permission',
            message: 'We need access to your camera for taking pictures.',
            buttonPositive: 'OK',
            buttonNegative: 'Cancel',
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.log('Camera permission error:', err);
        return false;
      }
    }
    // iOS automatically prompts
    return true;
  };

  const requestGalleryPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        // For picking from gallery we often need READ_EXTERNAL_STORAGE
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          {
            title: 'Gallery Permission',
            message: 'We need access to your photos for uploading.',
            buttonPositive: 'OK',
            buttonNegative: 'Cancel',
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.log('Gallery permission error:', err);
        return false;
      }
    }
    // iOS automatically prompts
    return true;
  };

  /************************************************************
   * SELECT PHOTO: Show Alert => Open Camera OR Gallery
   ************************************************************/
  const handlePhotoSelection = () => {
    Alert.alert('Upload Photo', 'Choose an option', [
      { text: 'Camera', onPress: openCamera },
      { text: 'Gallery', onPress: openGallery },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const openCamera = async () => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) {
      Alert.alert('Permission Denied', 'Camera permission is required to take a photo.');
      return;
    }

    const options = { mediaType: 'photo', quality: 1 };
    launchCamera(options, response => {
      handlePickerResponse(response, 'Camera');
    });
  };

  const openGallery = async () => {
    const hasPermission = await requestGalleryPermission();
    if (!hasPermission) {
      Alert.alert('Permission Denied', 'Gallery permission is required to select a photo.');
      return;
    }

    const options = { mediaType: 'photo', quality: 1 };
    launchImageLibrary(options, response => {
      handlePickerResponse(response, 'Gallery');
    });
  };

  const handlePickerResponse = (response, source) => {
    const { didCancel, errorCode, errorMessage, assets } = response;
    if (didCancel) {
      console.log(`${source} selection canceled.`);
      return;
    }
    if (errorCode) {
      console.log(`${source} error:`, errorMessage);
      Alert.alert('Error', `Could not access ${source}. Please try again.`);
      return;
    }
    if (!assets || assets.length === 0) {
      console.log(`${source} returned empty assets array.`);
      Alert.alert('Error', `No photo was selected from ${source}.`);
      return;
    }
    // At this point, we have a valid image
    const uri = assets[0].uri;
    setPhoto(uri);
    console.log(`${source} photo selected:`, uri);
  };

  /************************************************************
   * UPLOAD PHOTO
   ************************************************************/
  const handleUpload = async () => {
    if (!photo) {
      Alert.alert('Error', 'Please select a photo.');
      return;
    }

    // Fetch the token from AsyncStorage
    let storedToken;
    try {
      storedToken = await AsyncStorage.getItem('access_token');
    } catch (error) {
      console.log('Error reading token from AsyncStorage:', error);
    }

    if (!storedToken) {
      Alert.alert('Error', 'Authorization token is missing.');
      return;
    }

    setLoading(true);

    // Prepare FormData
    const formData = new FormData();
    formData.append('file', {
      uri: photo,
      type: 'image/jpeg', // or "image/png" if that fits your file
      name: 'profile_photo.jpg',
    });

    try {
      console.log('Uploading photo...');
      const response = await fetch('http://52.66.69.48:4000/upload?type=PHOTO', {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${storedToken}`,
        },
        body: formData,
      });

      const data = await response.json();
      console.log('API response:', data);

      if (response.ok) {
        // Success
        Alert.alert('Success', 'Photo uploaded successfully');
        console.log('Upload Success:', data);
        navigation.navigate('OuterTripDashboard');
      } else {
        // Server returned an error or invalid status
        Alert.alert('Error', data.message || 'Something went wrong');
        console.log('Upload Error:', data.message || 'Something went wrong');
      }
    } catch (error) {
      // Network or other unexpected error
      Alert.alert('Error', 'Something went wrong. Please try again later.');
      console.log('Network Error:', error);
    } finally {
      setLoading(false);
    }
  };

  /************************************************************
   * RENDER
   ************************************************************/
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile Photo</Text>

      <Text style={styles.instructionsHeader}>Instructions</Text>
      <Text style={styles.instructions}>
        • The photo must be colored, clear, and focused with no marks or red eye.{"\n"}
        • No shadows or reflections with appropriate brightness and contrast.{"\n"}
        • You shouldn’t wear caps, masks, and goggles.
      </Text>

      <View style={styles.noticeBox}>
        <Text style={styles.noticeText}>
          Your profile photo will be visible to customers when you are assigned to their ride.
          Make sure it’s a good one.
        </Text>
      </View>

      {/* Circle Photo or "Take Photo" */}
      <TouchableOpacity onPress={handlePhotoSelection} style={styles.photoContainer}>
        {photo ? (
          <Image source={{ uri: photo }} style={styles.photo} />
        ) : (
          <Text style={styles.takePhotoText}>Take Photo</Text>
        )}
      </TouchableOpacity>

      {/* Next/Upload Button */}
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

/************************************************************
 * STYLES
 ************************************************************/
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
