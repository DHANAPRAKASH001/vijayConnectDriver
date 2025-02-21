import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { moderateScale, verticalScale } from 'react-native-size-matters';
import { hideCustomNotification } from './reducers';

const CustomNotification = () => {
  const dispatch = useDispatch();
  const { visible, message, type, isTop } = useSelector((state) => state.customNotification);

  const slideAnim = new Animated.Value(isTop ? -100 : 100); // Initial position

  useEffect(() => {
    if (visible) {
      // Show notification by sliding it in
      Animated.timing(slideAnim, {
        toValue: 0, // Slide to center
        duration: 500,
        easing: Easing.ease,
        useNativeDriver: true,
      }).start();

      // Hide notification after 3 seconds
      const timer = setTimeout(() => {
        dispatch(hideCustomNotification());
      }, 3000);

      // Cleanup timeout if the component unmounts or notification visibility changes
      return () => clearTimeout(timer);
    } else {
      // Hide notification by sliding it out
      Animated.timing(slideAnim, {
        toValue: isTop ? -100 : 100, // Slide out based on position
        duration: 500,
        easing: Easing.ease,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, dispatch, slideAnim, isTop]); // Added dependencies to re-run when visibility changes

  const getNotificationStyle = () => {
    switch (type) {
      case 'success':
        return { backgroundColor: 'green' };
      case 'failure':
        return { backgroundColor: 'red' };
      case 'warning':
        return { backgroundColor: 'orange' };
      default:
        return { backgroundColor: 'green' };
    }
  };

  return (
    visible && (
      <Animated.View
        style={[
          styles.container,
          getNotificationStyle(),
          { transform: [{ translateY: slideAnim }] },
          isTop ? styles.top : styles.bottom,
        ]}
      >
        <Text style={styles.message}>{message}</Text>
      </Animated.View>
    )
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    padding: moderateScale(12),
    borderRadius: moderateScale(8),
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: moderateScale(16),
    marginVertical: verticalScale(8),
  },
  top: {
    top: 0,
  },
  bottom: {
    bottom: 0,
  },
  message: {
    color: 'white',
    fontSize: moderateScale(14),
    textAlign: 'center',
  },
});

export default CustomNotification;
