import React, { useState, useEffect } from 'react'; // Import useState and useEffect from 'react'
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  Linking,
  Platform,
  Alert,
  NativeModules,
} from 'react-native';
import CustomButton from '../../components/customButton';
import { moderateScale } from 'react-native-size-matters';
import { APP_ICONS } from '../../utils/icons';

const { SettingsModule } = NativeModules; // Import the native module

const PermissionsScreen = ({ navigation }) => {
  const [permissionsGranted, setPermissionsGranted] = useState(false);

  // Function to open system permission settings
  const openPermissionSettings = async () => {
    try {
      if (Platform.OS === 'android') {
        // Use the native module to open settings on Android
        SettingsModule.openSettings();
      } else if (Platform.OS === 'ios') {
        // Open iOS system settings for permissions
        await Linking.openURL('app-settings:');
      }
    } catch (error) {
      Alert.alert(
        'Error',
        'Unable to open settings. Please manually enable permissions in your device settings.',
      );
      console.error('Error opening settings:', error);
    }
  };

  // Simulate permission granting (for demonstration purposes)
  const simulatePermissionsGranted = () => {
    setPermissionsGranted(true);
    Alert.alert('Success', 'All permissions have been granted.');
  };

  // Navigate to the next screen when all permissions are granted
  useEffect(() => {
    if (permissionsGranted) {
      navigation.navigate('VendorPhoneNumber');
    }
  }, [permissionsGranted, navigation]);

  // Reusable Permission Item Component
  const PermissionItem = ({ icon, header, text }) => (
    <View style={styles.permissionContainer}>
      <Image source={icon} style={styles.image} />
      <Text style={styles.permissionHeader}>{header}</Text>
      <Text style={styles.permissionText}>{text}</Text>
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Screen Header */}
      <View style={styles.screenHeader}></View>

      {/* Body */}
      <View style={styles.screenBody}>
        {/* Location Permission */}
        <PermissionItem
          icon={APP_ICONS.PERMISSIONLOCATION}
          header="Location"
          text="Location is required to get nearby bookings and run the trip meter to calculate the booking fare based on the location. We will use the location even when the app is closed."
        />

        {/* Do Not Disturb Permission */}
        <PermissionItem
          icon={APP_ICONS.PERMISSIONANDORID}
          header="Disable Do Not Disturb"
          text="To ensure you receive timely notifications for new bookings, we recommend disabling the 'Do Not Disturb' option."
        />

        {/* Battery Optimization Permission */}
        <PermissionItem
          icon={APP_ICONS.BATTERY}
          header="Ignore Battery Optimization"
          text="App will operate in the background, even when it is closed, to efficiently fetch nearby bookings. It is advisable to disregard battery optimization settings."
        />

        {/* Display Over Other Apps Permission */}
        <PermissionItem
          icon={APP_ICONS.PERMISSIONOVERLAY}
          header="Display Over Other Apps"
          text="App will operate in the background, even when it is closed, to efficiently fetch nearby bookings. It is advisable to disregard battery optimization settings."
        />

        {/* Developer Option Permission */}
        <PermissionItem
          icon={APP_ICONS.PERMISSIONANDORID}
          header="Developer Option"
          text="App will operate in the background, even when it is closed, to efficiently fetch nearby bookings. It is advisable to disregard battery optimization settings."
        />
      </View>

      {/* Footer */}
      <View style={styles.screenFooter}>
        <CustomButton
          buttonText={'Permission Granted'}
          buttonStyle={[styles.actionButton, { backgroundColor: '#4CAF50' }]} // Green color for granted permission
          onPress={simulatePermissionsGranted} // Simulate permission granting
        />
        <Text style={styles.footerText}>All permissions are required for the app to function properly.</Text>
      </View>
    </ScrollView>
  );
};

export default PermissionsScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: 'white',
    paddingHorizontal: moderateScale(20),
    paddingVertical: moderateScale(20),
  },
  screenHeader: {
    backgroundColor: 'transparent', // Empty header
  },
  screenBody: {
    flex: 1,
  },
  permissionContainer: {
    marginBottom: moderateScale(20),
    alignItems: 'center', // Center align items
  },
  image: {
    height: moderateScale(80), // Smaller icon size
    resizeMode: 'contain',
    marginBottom: moderateScale(10),
  },
  permissionHeader: {
    fontSize: moderateScale(18),
    fontWeight: 'bold',
    color: 'black',
    marginBottom: moderateScale(10),
    textAlign: 'center', // Center align header
  },
  permissionText: {
    fontSize: moderateScale(14),
    color: 'gray',
    marginBottom: moderateScale(15),
    textAlign: 'center', // Center align text
  },
  actionButton: {
    backgroundColor: '#007BFF',
    paddingVertical: moderateScale(12),
    borderRadius: moderateScale(8),
    alignItems: 'center',
    width: '80%', // Adjust button width
  },
  screenFooter: {
    marginTop: moderateScale(20),
    alignItems: 'center',
  },
  footerText: {
    fontSize: moderateScale(12),
    color: 'gray',
    textAlign: 'center',
  },
});