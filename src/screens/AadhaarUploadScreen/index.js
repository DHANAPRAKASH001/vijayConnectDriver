import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, Alert, ActivityIndicator } from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage
import { APP_ICONS } from '../../utils/icons'; // Import the APP_ICONS object

const AadhaarUploadScreen = ({ navigation }) => {
  const [frontImage, setFrontImage] = useState(null);
  const [backImage, setBackImage] = useState(null);
  const [loading, setLoading] = useState(false); // To track the loading state

  // Handle photo selection (Camera or Gallery)
  const handlePhotoSelection = (side) => {
    Alert.alert(
      "Upload Photo",
      "Choose an option",
      [
        {
          text: "Camera",
          onPress: () => openCamera(side),
        },
        {
          text: "Gallery",
          onPress: () => openGallery(side),
        },
        {
          text: "Cancel",
          style: "cancel",
        },
      ]
    );
  };

  // Open Camera
  const openCamera = (side) => {
    console.log("Opening camera...");
    launchCamera({ mediaType: 'photo', quality: 1 }, (response) => {
      console.log("Camera response:", response);
      if (!response.didCancel && !response.error) {
        if (side === 'front') {
          setFrontImage(response.assets[0].uri);
        } else {
          setBackImage(response.assets[0].uri);
        }
        console.log("Photo selected from camera:", response.assets[0].uri);
      } else {
        console.log("Camera selection canceled or error:", response.error);
      }
    });
  };

  // Open Gallery
  const openGallery = (side) => {
    console.log("Opening gallery...");
    launchImageLibrary({ mediaType: 'photo', quality: 1 }, (response) => {
      console.log("Gallery response:", response);
      if (!response.didCancel && !response.error) {
        if (side === 'front') {
          setFrontImage(response.assets[0].uri);
        } else {
          setBackImage(response.assets[0].uri);
        }
        console.log("Photo selected from gallery:", response.assets[0].uri);
      } else {
        console.log("Gallery selection canceled or error:", response.error);
      }
    });
  };

  // Handle image upload
  const handleUpload = async () => {
    if (!frontImage || !backImage) {
      Alert.alert('Error', 'Please upload both front and back images.');
      console.log('Error: Both front and back images are required.');
      return;
    }

    // Fetch the token from AsyncStorage
    const storedToken = await AsyncStorage.getItem('access_token');
    if (!storedToken) {
      Alert.alert('Error', 'Authorization token is missing.');
      console.log('Error: No authorization token found.');
      return;
    }

    setLoading(true); // Start loading state

    const uploadImage = async (uri, type) => {
      
      const formData = new FormData();
      formData.append('file', {
        uri: uri,
        type: 'image/jpeg', // Assuming the image is of JPEG format
        name: `${type}.jpg`,
      });

      try {
        const response = await fetch(`http://52.66.69.48:4000/upload?type=${type}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${storedToken}`, // Attach the token to the request header
          },
          body: formData,
        });

        const data = await response.json();
        console.log(`${type} Upload response:`, data);

        if (!response.ok) {
          throw new Error(data.message || 'Something went wrong');
        }
      } catch (error) {
        Alert.alert('Error', `Failed to upload ${type} image. Please try again.`);
        console.log(`Error uploading ${type} image:`, error);
        return false; // If any upload fails, return false
      }

      return true;
    };

    try {
      const isFrontUploaded = await uploadImage(frontImage, 'AADAR_FRONT');
      const isBackUploaded = await uploadImage(backImage, 'AADAR_BACK');

      if (isFrontUploaded && isBackUploaded) {
        Alert.alert('Success', 'Both images uploaded successfully.');
        console.log('Both images uploaded successfully');
        navigation.navigate('DriverLicenseUploadScreen');
      } else {
        Alert.alert('Error', 'Failed to upload one or more images.');
        console.log('One or both image uploads failed.');
      }
    } finally {
      setLoading(false); // End loading state
    }
  };

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Image source={APP_ICONS.BACK} style={styles.backIcon} /> {/* Use the back icon from APP_ICONS */}
      </TouchableOpacity>

      <Text style={styles.title}>Aadhaar Details</Text>

      <Text style={styles.instructionsHeader}>Instructions</Text>
      <Text style={styles.instructions}>
        • Make sure that all the data on your document is fully visible, glare-free, and not blurred. {"\n"}
        • Photocopies and printouts are not allowed. {"\n"}
        • Uploaded documents should be less than 10MB and belong to JPEG, PNG only.
      </Text>

      <Text style={styles.attachmentsHeader}>Attachments</Text>

      <TouchableOpacity onPress={() => handlePhotoSelection('front')} style={styles.uploadBox}>
        {frontImage ? (
          <Image source={{ uri: frontImage }} style={styles.uploadedImage} />
        ) : (
          <Text style={styles.uploadText}>📤 Upload (Front)</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => handlePhotoSelection('back')} style={styles.uploadBox}>
        {backImage ? (
          <Image source={{ uri: backImage }} style={styles.uploadedImage} />
        ) : (
          <Text style={styles.uploadText}>📤 Upload (Back)</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity style={styles.nextButton} onPress={handleUpload} disabled={loading}>
        {loading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.nextButtonText}>Next</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default AadhaarUploadScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    position: 'absolute',
    top: 30, // Adjust the top position as needed
    left: 20, // Adjust the left position as needed
  },
  backIcon: {
    width: 24,
    height: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 10, // Add margin to avoid overlap with the back button
    textAlign: 'center',
  },
  instructionsHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 20,
  },
  instructions: {
    fontSize: 14,
    marginBottom: 20,
  },
  attachmentsHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  uploadBox: {
    marginVertical: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    alignItems: 'center',
  },
  uploadText: {
    fontSize: 16,
    color: '#000',
  },
  uploadedImage: {
    width: 100,
    height: 100,
    resizeMode: 'cover',
  },
  nextButton: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#007bff',
    borderRadius: 5,
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
  },
});
