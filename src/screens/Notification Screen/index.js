import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { APP_ICONS } from '../../utils/icons'; // Import the APP_ICONS object

const NotificationScreen = ({ navigation }) => {
  // State to track the active tab
  const [activeTab, setActiveTab] = useState('All'); // Default to 'All'

  // Sample notifications data
  const notifications = [
    { id: 1, type: 'Bids', userName: 'Ram', text: 'You have a new bid on your item.', date: 'June 2024' },
    { id: 2, type: 'Trip', userName: 'Shyam', text: 'Your trip to Paris is confirmed.', date: 'June 2024' },
    { id: 3, type: 'General', userName: 'Admin', text: 'Your profile has been updated.', date: 'June 2024' },
    { id: 4, type: 'Bids', userName: 'Hari', text: 'Your bid on item XYZ was outbid.', date: 'May 2024' },
    { id: 5, type: 'Trip', userName: 'Gita', text: 'Your trip to New York is scheduled.', date: 'May 2024' },
    { id: 6, type: 'General', userName: 'Admin', text: 'New feature added: Trip planner.', date: 'May 2024' },
  ];

  // Filter notifications based on the active tab
  const filteredNotifications = activeTab === 'All' 
    ? notifications 
    : notifications.filter(notification => notification.type === activeTab);

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Image source={APP_ICONS.BACK} style={styles.backIcon} /> {/* Use the back icon from APP_ICONS */}
      </TouchableOpacity>

      {/* Header */}
      <Text style={styles.header}>Notification</Text>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'All' && styles.activeTab]}
          onPress={() => setActiveTab('All')}
        >
          <Text style={[styles.tabText, activeTab === 'All' && styles.activeTabText]}>All</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'Bids' && styles.activeTab]}
          onPress={() => setActiveTab('Bids')}
        >
          <Text style={[styles.tabText, activeTab === 'Bids' && styles.activeTabText]}>Bids</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'Trip' && styles.activeTab]}
          onPress={() => setActiveTab('Trip')}
        >
          <Text style={[styles.tabText, activeTab === 'Trip' && styles.activeTabText]}>Trip</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'General' && styles.activeTab]}
          onPress={() => setActiveTab('General')}
        >
          <Text style={[styles.tabText, activeTab === 'General' && styles.activeTabText]}>General</Text>
        </TouchableOpacity>
      </View>

      {/* Line after the tabs */}
      <View style={styles.lineContainer}>
              <View style={styles.line} />
            </View>

      {/* Notification List */}
      <ScrollView style={styles.notificationList}>
        {/* Group notifications by date */}
        {['June 2024', 'May 2024'].map((date, index) => (
          <View key={index}>
            <Text style={styles.dateSection}>{date}</Text>
            {filteredNotifications
              .filter(notification => notification.date === date)
              .map(notification => (
                <View key={notification.id} style={styles.notificationItem}>
                  <Text style={styles.userName}>{notification.userName}</Text>
                  <Text style={styles.notificationText}>{notification.text}</Text>
                </View>
              ))}
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff', // White background
    padding: 16,
  },
  lineContainer: {
    // alignItems: 'center',
    // marginBottom: 20, // Space below the lines
  },
  backButton: {
    position: 'absolute',
    top: 50, // Adjust the top position as needed
    left: 20, // Adjust the left position as needed
    zIndex: 1, // Ensure the back button is above other elements
  },
  backIcon: {
    width: 20,
    height: 20,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 30, // Add margin at the top for the header
    marginBottom: 20,
    textAlign: 'center', // Center the header text
  },
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#f0f0f0', // Light gray background for tabs
  },
  activeTab: {
    backgroundColor: '#007BFF', // Blue background for the active tab
  },
  tabText: {
    fontSize: 16,
    color: '#333',
  },
  activeTabText: {
    color: '#fff', // White text for the active tab
  },
  notificationList: {
    flex: 1,
  },
  dateSection: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 10,
  },
  notificationItem: {
    padding: 16,
    backgroundColor: '#f9f9f9', // Light gray background for notification items
    borderRadius: 8,
    marginBottom: 10,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  notificationText: {
    fontSize: 14,
    color: '#666',
  },
});

export default NotificationScreen;