import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { moderateScale } from 'react-native-size-matters'; // For scalable measurements

const CustomScreenHeader = ({
  leadingIcon,
  trailingIcon,
  title,
  onLeadingIconPress,
  onTrailingIconPress,
  titleStyle,
  containerStyle,
  leadingIconStyle,
  trailingIconStyle
}) => {
  return (
    <View style={[styles.container, containerStyle]}>

      {/* Leading Icon */}
      <View style={styles.iconWrapper}>
        {leadingIcon && (
          <TouchableOpacity onPress={onLeadingIconPress} style={[styles.iconButton, leadingIconStyle]}>
            <Image source={leadingIcon} style={[styles.icon, leadingIconStyle]} />
          </TouchableOpacity>
        )}
      </View>

      {/* Title */}
      <View style={styles.titleWrapper}>
        {title && <Text style={[styles.title, titleStyle]}>{title}</Text>}
      </View>

      {/* Trailing Icon */}
      <View style={styles.iconWrapper}>
        {trailingIcon && (
          <TouchableOpacity onPress={onTrailingIconPress} style={[styles.iconButton, trailingIconStyle]}>
            <Image source={trailingIcon} style={[styles.icon, trailingIconStyle]} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default CustomScreenHeader;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: moderateScale(65),
    width: '100%',
    paddingHorizontal: moderateScale(5),
    // backgroundColor: "red"
  },
  iconButton: {
    padding: moderateScale(6), // Reduced padding for smaller buttons
    borderColor: "grey",
    borderWidth: 1,
    borderRadius: moderateScale(6), // Adjusted for more subtle roundness
    justifyContent: 'center',
    alignItems: 'center',
    width: moderateScale(30),
    height: moderateScale(30),
  },
  icon: {
    width:"100%",
    height: "100%",
    resizeMode: "contain"
  },
  title: {
    fontSize: moderateScale(18),
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
  },
  iconWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    width: moderateScale(40),
    height: '100%',
  },
  titleWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
