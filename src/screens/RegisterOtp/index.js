import React, { useRef, useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { APP_ICONS } from '../../utils/icons';
import { moderateScale } from 'react-native-size-matters';
import CustomButton from '../../components/customButton';
import { COMMON_COLORS } from '../../constants/colors';
import CustomScreenHeader from '../../components/screenHeader';
import { useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage


const OtpScreen = ({ navigation, route }) => {



  // Get the phone number passed from the previous screen
  const { phoneNumber } = route.params;

  // Refs for each OTP input
  const input1Ref = useRef(null);
  const input2Ref = useRef(null);
  const input3Ref = useRef(null);
  const input4Ref = useRef(null);

  // State for OTP inputs
  const [otp, setOtp] = useState(['', '', '', '']);
  const [timer, setTimer] = useState(30); // 30-second timer
  const [isResendVisible, setIsResendVisible] = useState(false); // Control visibility of Resend OTP button
  const [isLoading, setIsLoading] = useState(false); // Loading state for the API call

  // Function to handle text change and focus shift
  const handleChangeText = (text, index, nextInputRef) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    if (text.length === 1 && nextInputRef) {
      nextInputRef.current?.focus();
    }
  };

  // Function to handle backspace (focus the previous input)
  const handleBackspace = (text, currentInputRef, prevInputRef) => {
    if (text.length === 0) {
      prevInputRef?.current?.focus();
    }
  };

  // Function to verify OTP
  const verifyOTP = async () => {
    const enteredOtp = otp.join('');

    if (enteredOtp.length === 4) {
      setIsLoading(true); // Start loading
  
      const apiUrl = 'http://52.66.69.48:4000/auth/login'; // Provided API URL
  
      console.log("________________________", phoneNumber)
      try {
        // API POST request to verify OTP
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            phone: phoneNumber, // Use the phone number passed via route.params
            otp: enteredOtp, // Sending the entered OTP
          }),
        });
  
        const data = await response.json();
  
        if (response.ok) {
          // OTP verification was successful
                  await AsyncStorage.setItem('access_token', data.access_token);
          
          navigation.navigate('RegisterProfile'); // Navigate to the profile screen
        } else {
          // OTP verification failed
          Alert.alert('Error', data.message || 'Invalid OTP');
        }
      } catch (error) {
        // Network or other errors
        Alert.alert('Error', 'Something went wrong. Please try again later.');
      } finally {
        setIsLoading(false); // Stop loading
      }
    } else {
      Alert.alert('Error', 'Please enter a valid OTP');
    }
  };

  // Function to handle resend OTP
  const handleResendOTP = () => {
    setTimer(30); // Reset the timer
    setIsResendVisible(false); // Hide the Resend OTP button
    // Add logic to resend OTP here
    console.log('Resending OTP...');
  };

  // Countdown timer effect
  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else {
      setIsResendVisible(true); // Show the Resend OTP button when timer reaches 0
    }
    return () => clearInterval(interval); // Cleanup interval on unmount
  }, [timer]);

  // Function to handle back navigation
  const handleLeadingPress = () => {
    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={moderateScale(20)} // Adjust based on your header height
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <CustomScreenHeader
          leadingIcon={APP_ICONS.BACK}
          onLeadingIconPress={handleLeadingPress}
          titleStyle={styles.headerTitle}
        />
        <View style={styles.contentWrapper}>
          <Text style={styles.title}>Verify OTP</Text>
          <Text style={styles.subtitle}>
            Please Enter the OTP Sent to Your Phone
          </Text>

          <View style={styles.inputContainer}>
            {/* OTP Input fields with refs */}
            {[input1Ref, input2Ref, input3Ref, input4Ref].map((ref, index) => (
              <TextInput
                key={index}
                style={styles.input}
                keyboardType="number-pad"
                maxLength={1}
                ref={ref}
                value={otp[index]}
                onChangeText={(text) => handleChangeText(text, index, [input2Ref, input3Ref, input4Ref][index])}
                onKeyPress={({ nativeEvent }) => {
                  if (nativeEvent.key === 'Backspace') {
                    handleBackspace('', ref, [input1Ref, input2Ref, input3Ref][index - 1]);
                  }
                }}
              />
            ))}
          </View>
        </View>
        <View style={styles.buttonsContainer}>
          {isResendVisible ? (
            <CustomButton
              buttonText={'Resend OTP'}
              buttonStyle={styles.actionButton}
              onPress={handleResendOTP}
            />
          ) : (
            <Text style={styles.timerText}>Resend OTP in {timer}s</Text>
          )}
          <CustomButton
            buttonText={'Verify OTP'}
            buttonStyle={styles.actionButton}
            onPress={verifyOTP}
            loading={isLoading} // Show loading indicator while the API is being called
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default OtpScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: moderateScale(15),
  },
  contentWrapper: {
    flex: 1,
    paddingHorizontal: moderateScale(15),
  },
  headerTitle: {
    color: 'blue',
  },
  title: {
    fontSize: moderateScale(28),
    color: 'black',
  },
  subtitle: {
    fontSize: moderateScale(12),
    color: COMMON_COLORS.GRAY,
    marginBottom: moderateScale(20),
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '60%',
    marginBottom: moderateScale(30),
  },
  input: {
    width: moderateScale(35),
    height: moderateScale(35),
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 2,
    textAlign: 'center',
    fontSize: moderateScale(15),
    backgroundColor: COMMON_COLORS.GRAY_LIGHT,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: moderateScale(10),
    paddingHorizontal: moderateScale(15),
  },
  actionButton: {
    flex: 0.5,
    marginHorizontal: moderateScale(5),
  },
  timerText: {
    fontSize: moderateScale(14),
    color: COMMON_COLORS.GRAY,
    textAlign: 'center',
    flex: 1,
    marginHorizontal: moderateScale(5),
  },
});
