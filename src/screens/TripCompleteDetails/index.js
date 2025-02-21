import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { APP_ICONS } from '../../utils/icons'; // Ensure this path is correct

const TripCompleteDetails = ({ route }) => {
  const { onGoBack } = route.params; // Get the callback from navigation params
  const navigation = useNavigation();

  // Trigger the callback when the screen loses focus (user navigates back)
  useFocusEffect(
    React.useCallback(() => {
      return () => {
        if (onGoBack) {
          onGoBack(); // Call the callback to reopen the modal
        }
      };
    }, [onGoBack])
  );

  return (
    <ScrollView style={styles.container}>
      {/* Back Button with Icon */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Image source={APP_ICONS.BACK} style={styles.backIcon} />
      </TouchableOpacity>

      {/* Header */}
      <Text style={styles.header}>Trip Details</Text>

      {/* Trip Details Box */}
      <View style={styles.box}>
        <View style={styles.detailContainer}>
          <Text style={styles.label}>Duty Type</Text>
          <Text style={styles.value}>Local</Text>
        </View>

        <View style={styles.detailContainer}>
          <Text style={styles.label}>Name</Text>
          <Text style={styles.value}>Krish</Text>
        </View>

        <View style={styles.detailContainer}>
          <Text style={styles.label}>Booking ID</Text>
          <Text style={styles.value}>TIB1234ASD</Text>
        </View>

        <View style={styles.detailContainer}>
          <Text style={styles.label}>Payment Mode</Text>
          <Text style={styles.value}>Cash</Text>
        </View>

        <View style={styles.detailContainer}>
          <Text style={styles.label}>Estimated Fare</Text>
          <Text style={styles.value}>$217.86</Text>
        </View>
      </View>

      {/* Locations Box */}
      <View style={styles.box}>
        {/* Location 1 */}
        <View style={styles.locationContainer}>
          <View style={styles.locationIconContainer}>
            <Image source={APP_ICONS.CIRCLE_GREEN} style={styles.locationIcon} />
          </View>
          <View style={styles.locationTextContainer}>
            <Text style={styles.locationLabel}>Coimbatore International Airport, sitra</Text>
            <Text style={styles.locationTime}>21 Jun 2024, 03:41 PM</Text>
          </View>
        </View>

        {/* Location 2 */}
        <View style={styles.locationContainer}>
          <View style={styles.locationIconContainer}>
            <Image source={APP_ICONS.CIRCLE_RED} style={styles.locationIcon} />
          </View>
          <View style={styles.locationTextContainer}>
            <Text style={styles.locationLabel}>Gandhipuram New Bus Stand</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 1, // Ensure the button is above other elements
  },
  backIcon: {
    width: 24,
    height: 24,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 17,
    marginBottom: 20,
    textAlign: 'center', // Center the header text
  },
  box: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  detailContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    color: 'gray',
  },
  value: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  locationIconContainer: {
    marginRight: 10,
  },
  locationIcon: {
    width: 16,
    height: 16,
  },
  locationTextContainer: {
    flex: 1,
  },
  locationLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  locationTime: {
    fontSize: 14,
    color: 'gray',
  },
});

export default TripCompleteDetails;