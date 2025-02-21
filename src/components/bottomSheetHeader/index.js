import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { moderateScale } from 'react-native-size-matters';
import { APP_ICONS } from '../../utils/icons';

const BottomSheetHeader = ({backButtonOnPress, closeButtonOnPress, headerText}) => {
  return (
    <View style={styles.container}>
      {/* Left Button */}
     {backButtonOnPress && (
         <TouchableOpacity style={styles.headerButtonWrapper}onPress={backButtonOnPress}>
         <Image source={APP_ICONS.BACK} style={styles.icon} />
       </TouchableOpacity>
     )}

      {/* Centered Text */}
      <View style={[styles.headerTextWrapper, {marginLeft: backButtonOnPress ? moderateScale(8) : ''}]}>
        <Text style={styles.headerText}>{headerText}</Text>
      </View>

      {/* Right Button */}
      {
        closeButtonOnPress && (
            <View style={styles.headerButtonWrapper}>
      <Image source={APP_ICONS.LOGOUT} style={styles.icon} />

      </View>
        )
      }
    </View>
  );
};

export default BottomSheetHeader;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between', // Space between the buttons and text
    alignItems: 'center', // Vertically center the buttons and text
    // backgroundColor: 'red', // Background color of the header
    // paddingHorizontal: moderateScale(10), // Horizontal padding
    paddingVertical: moderateScale(3), // Vertical padding
    marginBottom: moderateScale(10)
  
  },
  headerButtonWrapper: {
    height: moderateScale(20),
    width: moderateScale(20),
    backgroundColor: 'grey', // Color for left/right buttons
    borderRadius: moderateScale(15), // Make the buttons circular
    justifyContent: 'center', // Center the content inside the button
    alignItems: 'center', // Center the content inside the button
  },
  headerTextWrapper: {
    flex: 1, // Take up remaining space
    // marginLeft: moderateScale(10)
    // alignItems: 'center', // Center the text horizontally
    // justifyContent: 'center', // Center the text vertically
  },
  headerText: {
    fontSize: moderateScale(16), // Adjust font size
    fontWeight: 'bold', // Make the text bold
    // textAlign: 'center', // Ensure text is centered
    color: '#333', // Text color
  },icon: {
    height: '50%',
    width: "50%",
    resizeMode: "contain"
  }
});
