import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import { APP_ICONS } from '../../utils/icons'; // Import the APP_ICONS object

const Settings = ({ navigation }) => {
  // Function to handle logout
  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are You Sure You Want to Logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          onPress: () => {
            // Perform logout actions (e.g., clear user data, tokens, etc.)
            // Navigate to the first screen (e.g., Login Screen)
            navigation.replace('LoginScreen'); // Replace with your login screen name
          },
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <Image
          source={APP_ICONS.USER} // Use the USER icon from APP_ICONS
          style={styles.userIcon}
        />
        <Text style={styles.userName}>Sam</Text>
        <Text style={styles.userId}>VCD0912</Text>
        <Text style={styles.userDetails}>345 | TN37AB1234</Text>
      </View>

      {/* Options Section */}
      <View style={styles.optionsContainer}>
        {/* Dashboard */}
        <TouchableOpacity
          style={styles.option}
          onPress={() => navigation.navigate('ProfileDetailsScreen')}
        >
          <View style={styles.optionContent}>
            <Image source={APP_ICONS.DASHBOARD} style={styles.optionIcon} />
            <Text style={styles.optionText}>Dashboard</Text>
          </View>
        </TouchableOpacity>

        {/* Notification */}
        <TouchableOpacity
          style={styles.option}
          onPress={() => navigation.navigate('NotificationScreen')}
        >
          <View style={styles.optionContent}>
            <Image source={APP_ICONS.NOTIFICATION_BELL} style={styles.optionIcon} />
            <Text style={styles.optionText}>Notification</Text>
          </View>
        </TouchableOpacity>

        {/* Trip Type */}
        <TouchableOpacity
          style={styles.option}
          onPress={() => navigation.navigate('TripTypesScreen')}
        >
          <View style={styles.optionContent}>
            <Image source={APP_ICONS.TRIPTYPE} style={styles.optionIcon} />
            <Text style={styles.optionText}>Trip Type</Text>
          </View>
        </TouchableOpacity>

        {/* Contact Support */}
        <TouchableOpacity
          style={styles.option}
          onPress={() => navigation.navigate('ContactSupportScreen')}
        >
          <View style={styles.optionContent}>
            <Image source={APP_ICONS.CUSTOMER} style={styles.optionIcon} />
            <Text style={styles.optionText}>Contact Support</Text>
          </View>
        </TouchableOpacity>

        {/* Logout */}
        <TouchableOpacity
          style={styles.option}
          onPress={handleLogout} // Directly trigger the logout Alert
        >
          <View style={styles.optionContent}>
            <Image source={APP_ICONS.LOGOUT} style={styles.optionIcon} />
            <Text style={styles.optionText}>Logout</Text>
          </View>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff', // White background
    padding: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  userIcon: {
    width: 80,
    height: 80,
    borderRadius: 40, // Circular icon
    marginBottom: 16,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333', // Dark gray text
    marginBottom: 8,
  },
  userId: {
    fontSize: 16,
    color: '#666', // Medium gray text
    marginBottom: 4,
  },
  userDetails: {
    fontSize: 14,
    color: '#666', // Medium gray text
  },
  optionsContainer: {
    marginTop: 16,
  },
  option: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee', // Light gray border
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionIcon: {
    width: 24,
    height: 24,
    marginRight: 16,
  },
  optionText: {
    fontSize: 18,
    color: '#333', // Dark gray text
  },
});

export default Settings;