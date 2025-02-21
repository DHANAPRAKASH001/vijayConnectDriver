// filepath: src/screens/auth/index.js
import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { APP_ICONS } from '../../utils/icons';
import { strings } from '../../utils/language';

const LoginScreen = ({ navigation }) => {
  const [loginButtonColor, setLoginButtonColor] = useState('#6374FF');
  const [registerButtonColor, setRegisterButtonColor] = useState('#9256FB');
  const [language, setLanguage] = useState('en'); // Default language

  const changeLanguage = (lng) => {
    setLanguage(lng);
  };

  return (
    <View style={styles.container}>
      {/* Language Switch */}
      {/* <View style={styles.languageSwitch}>
        <TouchableOpacity onPress={() => changeLanguage('en')}>
          <Text>English</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => changeLanguage('ta')}>
          <Text>தமிழ்</Text>
        </TouchableOpacity>
      </View> */}

      {/* Welcome Text */}
      <Text style={styles.welcomeText}>{strings[language].welcome}</Text>
      <Text style={styles.appName}>{strings[language].appName}</Text>

      {/* Image */}
      <Image
        source={APP_ICONS.LOGINIMAGE1}
        style={styles.image}
        resizeMode="contain"
      />

      {/* Login and Register Buttons */}
      <TouchableOpacity
        style={[styles.button, { backgroundColor: loginButtonColor }]}
        onPress={() => navigation.navigate('phoneNumber')}
        onPressIn={() => setLoginButtonColor('#7A4FD6')}
        onPressOut={() => setLoginButtonColor('#9256FB')}
        activeOpacity={0.7}
      >
        <Text style={styles.buttonText}>{strings[language].login}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.registerButton, { backgroundColor: registerButtonColor }]}
        onPress={() => navigation.navigate('RegisterPhoneNumber')}
        onPressIn={() => setRegisterButtonColor('#7A4FD6')}
        onPressOut={() => setRegisterButtonColor('#9256FB')}
        activeOpacity={0.7}
      >
        <Text style={styles.buttonText}>{strings[language].register}</Text>
      </TouchableOpacity>

      {/* Footer Text */}
      <Text style={styles.footerText}>
        {strings[language].footerText}
      </Text>
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 20,
  },
  languageSwitch: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 20,
    color: 'black',
    marginBottom: 5,
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 20,
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 200,
  },
  button: {
    padding: 15,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
    marginBottom: 10,
  },
  registerButton: {
    backgroundColor: '#9256FB',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footerText: {
    marginTop: 20,
    textAlign: 'center',
    color: 'gray',
    fontSize: 12,
    paddingHorizontal: 20,
  },
});

export default LoginScreen;