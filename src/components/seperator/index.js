import { StyleSheet, View } from 'react-native';
import React from 'react';
import { moderateScale } from 'react-native-size-matters';
import { COMMON_COLORS } from '../../constants/colors';

const Seperator = ({ seperatorStyles }) => {
  return (
    <View
      style={[
        styles.seperator,
        seperatorStyles,
      ]}
    />
  );
};

export default Seperator;

const styles = StyleSheet.create({
  seperator: {
    height: moderateScale(1.5),
    width: '100%',
    backgroundColor: COMMON_COLORS.GRAY,
    marginVertical: moderateScale(8),
  },
});
