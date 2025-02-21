import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

const InternalScreenLoader = ({ size = 'large', color = '#000', message = '' }) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={color} />
      {message ? <Text style={styles.message}>{message}</Text> : null}
    </View>
  );
};

export default InternalScreenLoader;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white', // Optional: Add a background color if needed
  },
  message: {
    marginTop: 10,
    fontSize: 16,
    color: '#555',
  },
});
