// src/components/CustomAlert.js
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { hideAlert } from './reducers';
import { Logger } from '../../utils/logger';
import { ALERT_CONFIG } from '../../constants/alertTypes';

const CustomAlert = () => {
  const dispatch = useDispatch();
  const { message, type, isVisible, isTop } = useSelector((state) => state.customAlert);
  
  // Fetch the alert configuration based on the alert type
  const typeConfig = ALERT_CONFIG[type] || ALERT_CONFIG.DEFAULT;

  useEffect(() => {
    Logger.info("CustomAlert - Type Configuration", typeConfig);

    let timer;
    if (isVisible) {
      timer = setTimeout(() => {
        dispatch(hideAlert());
      }, 3000); // Auto-hide after 3 seconds
    }

    return () => clearTimeout(timer); // Clean up the timer on unmount or when alert hides
  }, [isVisible, dispatch]);

  if (!isVisible) return null;

  return (
    <Animated.View
      style={[
        styles.alertContainer,
        isTop ? styles.topPosition : styles.bottomPosition,
        { backgroundColor: typeConfig.backgroundColor }, // Dynamically apply color
      ]}
    >
      <Text style={[styles.message, { color: typeConfig.color }]}>{message}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  alertContainer: {
    position: 'absolute',
    left: 10,
    right: 10,
    padding: 15,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 10, // Ensures alert appears above other components
  },
  topPosition: {
    top: 10,
  },
  bottomPosition: {
    bottom: 10,
  },
  message: {
    fontSize: 16,
    flex: 1,
  },
});

export default CustomAlert;
