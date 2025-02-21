import { Image, StyleSheet, Text, View, Animated, Easing } from 'react-native';
import React, { useEffect, useState } from 'react';
import { APP_IMAGES } from '../../utils/images';
import { moderateScale } from 'react-native-size-matters';

const SplashScreen = ({ navigation }) => {
  const [fadeAnim] = useState(new Animated.Value(0)); // Initial opacity is 0

  const initializeApp = async () => {
    try {
      console.log('Initializing app...');

      // Simulate a 2-second delay (you can adjust this duration)
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Once initialization is complete, navigate to HomeScreen
      navigation.navigate('LoginScreen');
    } catch (error) {
      console.error('Error retrieving credentials:', error);
      // Uncomment to update Redux state: dispatch(setLogin(false));
    }
  };

  // Call initializeApp when the component mounts
  useEffect(() => {
    initializeApp();
  }, []); 

  // Fade-in animation for the footer
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1, // Fade to full opacity
          duration: 1500, // Duration for fade-in
          easing: Easing.ease, // Easing function
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0, // Fade back to 0 opacity
          duration: 500, // Duration for fade-out
          easing: Easing.ease, // Easing function
          useNativeDriver: true,
        }),
      ])
    ).start(); // Start the animation loop
  }, [fadeAnim]);

  return (
    <View style={styles.container}>
      <Image source={APP_IMAGES.VIJAY_CONNECT_LOGO} style={styles.logo} />

      <View style={styles.footerWrapper}>
        <Animated.Image
          source={APP_IMAGES.MADE_IN_INDIA}
          style={[styles.footer, { opacity: fadeAnim }]} // Bind animated opacity to footer
        />
      </View>
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    height: moderateScale(250),
    width: moderateScale(250),
    resizeMode: 'contain',
  },
  footerWrapper: {
    position: 'absolute',
    bottom: moderateScale(20), // Added margin for better placement
  },
  footer: {
    width: moderateScale(150),
    resizeMode: 'contain',
  },
});
