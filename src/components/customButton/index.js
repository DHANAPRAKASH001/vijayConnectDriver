import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { moderateScale } from 'react-native-size-matters';

const CustomButton = ({
  buttonText,
  onPress,
  buttonStyle,
  textStyle,
  isLoading = false,
  disabled = false,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.button,
        buttonStyle,
        disabled ? styles.disabledButton : {},
      ]}
      activeOpacity={0.7}
      disabled={disabled || isLoading}
    >
      {isLoading ? (
        <ActivityIndicator size="small" color="#FFFFFF" />
      ) : (
        <Text style={[styles.text, textStyle]}>{buttonText}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    height: moderateScale(50),
    borderRadius: 10,
    backgroundColor: '#7021F0', // Default button color
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  text: {
    color: '#FFFFFF', // Default text color
    fontSize: moderateScale(13),
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: '#B0B0B0', // Disabled button color
  },
});

export default CustomButton;
