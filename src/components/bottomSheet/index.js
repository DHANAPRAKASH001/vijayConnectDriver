import React from 'react';
import { StyleSheet, View } from 'react-native';
import { moderateScale } from 'react-native-size-matters';

const BottomSheet = ({ visible, onClose, children }) => {
  if (!visible) return null; // Do not render if not visible

  return (
    <View style={styles.container}>
      {children}
    </View>
  );
};

export default BottomSheet;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: 'white',
    padding: moderateScale(20), // Adjusted padding for better layout
  },
});
