import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import {APP_ICONS} from '../../utils/icons'; // Import APP_ICONS
import CountryPicker from 'react-native-country-picker-modal'; // Import CountryPicker

function PhoneNumberScreen({navigation}) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState('91'); // Default country code for India
  const [country, setCountry] = useState({
    cca2: 'IN', // Default country (India)
    callingCode: '91', // Default calling code
  });
  const [isCountryPickerVisible, setIsCountryPickerVisible] = useState(false);

  const handleSendOtp = async () => {
    // Validate phone number
    if (phoneNumber.trim() === '') {
      Alert.alert('Error', 'Please enter your phone number');
      return;
    }

    if (!/^\d{10}$/.test(phoneNumber)) {
      Alert.alert('Error', 'Phone number must be exactly 10 digits');
      return;
    }

    const fullPhoneNumber = `+${countryCode}${phoneNumber}`;
    const apiUrl = 'https://1b3fnd11-4000.inc1.devtunnels.ms/auth/otp'; // Replace with your actual API URL

    try {
      // API POST request
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone: fullPhoneNumber,
        }),
      });

      // navigation.navigate('RegisterOtp', {phoneNumber: fullPhoneNumber});

      const data = await response.json();

      if (response.ok) {
        // API call was successful
        // Navigate to the OTP screen and pass the phone number and country code as parameters
        navigation.navigate('RegisterOtp', {phoneNumber: fullPhoneNumber});
      } else {
        // API call failed, show an alert with the error message
        Alert.alert('Error', data.message || 'Something went wrong');
      }
    } catch (error) {
      // Network or other errors
      Alert.alert('Error', 'Something went wrong. Please try again later.');
    }
  };

  const onSelectCountry = country => {
    setCountry(country);
    setCountryCode(country.callingCode[0]); // Set the selected country code
    setIsCountryPickerVisible(false); // Hide the country picker
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} // Adjust behavior based on platform
      style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Back Button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()} // Navigate back to the previous screen
        >
          <Image
            source={APP_ICONS.BACK} // Use the back icon from APP_ICONS
            style={styles.backIcon}
          />
        </TouchableOpacity>

        {/* Phone Number Text */}
        <Text style={styles.headerText}>Phone Number</Text>

        {/* Instruction Text */}
        <Text style={styles.instructionText}>
          Please Enter Your Phone Number to Login
        </Text>

        {/* Country Code and Phone Number Input */}
        <View style={styles.phoneInputContainer}>
          {/* Country Code Picker */}
          <TouchableOpacity
            style={styles.countryCodeButton}
            onPress={() => setIsCountryPickerVisible(true)}>
            <Text style={styles.countryCodeText}>+{countryCode}</Text>
          </TouchableOpacity>

          {/* Phone Number Input */}
          <TextInput
            style={styles.phoneInput}
            placeholder="eg. 8888679067"
            placeholderTextColor="#999"
            keyboardType="phone-pad"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            maxLength={10} // Limit input to 10 digits
          />
        </View>

        {/* Country Picker Modal */}
        <CountryPicker
          visible={isCountryPickerVisible}
          withCallingCode
          withFilter
          withFlag
          withAlphaFilter
          withCallingCodeButton
          onSelect={onSelectCountry}
          onClose={() => setIsCountryPickerVisible(false)}
          countryCode={country.cca2}
        />
      </ScrollView>

      {/* Send OTP Button */}
      <TouchableOpacity style={styles.button} onPress={handleSendOtp}>
        <Text style={styles.buttonText}>Send OTP</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  backButton: {
    position: 'absolute', // Position the back button absolutely
    top: 40, // Adjust the top position as needed
    left: 20, // Adjust the left position as needed
    padding: 10, // Add padding for better touch area
  },
  backIcon: {
    width: 20, // Adjust the width as needed
    height: 20, // Adjust the height as needed
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 10,
  },
  instructionText: {
    fontSize: 16,
    color: 'gray',
    marginBottom: 20,
    textAlign: 'center',
  },
  phoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  countryCodeButton: {
    padding: 15,
    backgroundColor: '#f2f2f2',
    borderRadius: 5,
    marginRight: 10,
  },
  countryCodeText: {
    fontSize: 16,
    color: 'black',
  },
  phoneInput: {
    flex: 1,
    height: 50,
    backgroundColor: '#f2f2f2',
    paddingHorizontal: 15,
    borderRadius: 5,
    fontSize: 16,
    color: 'black',
  },
  button: {
    width: '100%',
    backgroundColor: '#9256FB', // Purple color for the button
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    position: 'absolute', // Position the button absolutely
    bottom: 20, // Place the button at the bottom of the screen
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PhoneNumberScreen;
