import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SectionList,
  Image,
} from 'react-native';
import { moderateScale } from 'react-native-size-matters';
import CustomScreenHeader from '../../components/screenHeader';
import { APP_ICONS } from '../../utils/icons';
import { COMMON_COLORS } from '../../constants/colors';
import InternalScreenLoader from '../../components/internalScreenLoader';
import CustomButton from '../../components/customButton';

// Sample Ride Data (Dummy Record)
const rideData = [
  {
    header: 'Ride 1', // Name of the ride (1st header)
    cabNumber: 'AB123CD', // Cab vehicle number (2nd header)
    description: 'Comfortable ride for airport drop', // Description (3rd header)
    fromLocation: 'Downtown, City Center, Area 4', // Detailed from location
    toLocation: 'International Airport, Terminal 3', // Detailed to location
    status: 'Completed', // Status: 'Completed' or 'Upcoming'
    icon: APP_ICONS.CURRENCY, // Icon can be dynamic
    onPress: () => console.log('Ride Details'),
  },
  {
    header: 'Ride 2',
    cabNumber: 'XY987ZT',
    description: 'Business trip to client meeting in city center',
    fromLocation: 'Office Building, Block A, XYZ Street aaaaaaaaaa',
    toLocation: 'Client Office, Downtown Area',
    status: 'Upcoming',
    icon: APP_ICONS.CURRENCY,
    onPress: () => console.log('Ride Details'),
  },
];

const RideRelatedScreen = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(false); // Simulate loading state

  const handleBackPress = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('permissions'); // Fallback to a specific screen
    }
  };

  const renderRideDetails = () => {
    if (isLoading) {
      return <InternalScreenLoader />;
    } else {
      return (
        <SectionList
          style={styles.list}
          showsVerticalScrollIndicator={false}
          sections={rideData.map(ride => ({
            title: ride.header, // Name of the ride (1st header)
            data: [ride], // Pass the ride data
          }))}
         
          renderItem={({ item }) => (
            <View style={styles.listItem}>
              <View style={styles.listItemHeader}>
                <View style={styles.listItemIconWrapper}>
                  <Image source={item.icon} style={styles.listItemImage} />
                </View>

                <View style={styles.listItemHeaderDetailsWrapper}>
                  <Text style={styles.listItemHeaderDetailText}>
                    {item.header}
                  </Text>
                  <Text style={styles.listItemHeaderDetailText}>
                    {item.cabNumber}
                  </Text>
                  <Text style={styles.listItemHeaderDetailText}>
                    {item.description}
                  </Text>
                </View>
              </View>

              <View style={styles.listItemContent}>
                <View style={styles.listItemContentWrapper}>
                  <View style={styles.listItemIconWrapper}>
                    <Image source={APP_ICONS.INFO} style={styles.listItemImage} />
                  </View>
                  <Text style={styles.listItemHeader} numberOfLines={4}>
                    {item.fromLocation}
                  </Text>
                </View>

                <View style={styles.listItemContentWrapper}>
                  <View style={styles.listItemIconWrapper}>
                  <Image source={APP_ICONS.INFO} style={styles.listItemImage} />
                  </View>
                  <Text style={styles.listItemHeader} numberOfLines={4}>
                    {item.toLocation}
                  </Text>
                </View>
              </View>

              <View style={styles.listItemFooter}>
                <View style={styles.buttonsContainer}>
                  <CustomButton
                    buttonText={item.status}
                    buttonStyle={[
                      styles.statusButton,
                      item.status == 'Completed'
                        ? { backgroundColor: 'green' }
                        : { backgroundColor: 'orange' },
                    ]}
                  />
                  <CustomButton
                    buttonText={'Support'}
                    buttonStyle={styles.actionButton}
                    onPress={() => navigation.navigate('SupportScreen')}
                  />
                </View>
              </View>
            </View>
          )}
          keyExtractor={(item, index) => `${item.header}-${index}`}
          contentContainerStyle={styles.sectionListContent}
        />
      );
    }
  };

  return (
    <View style={styles.container}>
      <CustomScreenHeader
        leadingIcon={APP_ICONS.BACK}
        onLeadingIconPress={handleBackPress}
        title="Ride Related"
      />
      {renderRideDetails()}
    </View>
  );
};

export default RideRelatedScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COMMON_COLORS.WHITE,
  },
  list: {
    paddingHorizontal: moderateScale(10),
  },
  sectionHeader: {
    fontSize: moderateScale(14),
    fontWeight: 'bold',
    color: COMMON_COLORS.GRAY,
    marginVertical: moderateScale(10),
  },
  sectionListContent: {
    paddingBottom: moderateScale(20),
  },
  listItem: {
    paddingVertical: moderateScale(10),
    paddingHorizontal: moderateScale(10),
    marginVertical: moderateScale(5),
    borderColor: COMMON_COLORS.BLACK,
    borderWidth: 1,
    borderRadius: moderateScale(10),
    justifyContent: 'space-evenly',
  },
  listItemImage: {
    height: '100%',
    width: '100%',
    resizeMode: 'contain',
  },
  listItemContent: {
    flex: 1,
    justifyContent: 'center',
    marginVertical: moderateScale(15),
  },
  listItemHeader: {
    fontSize: moderateScale(18),
    flexDirection: 'row',
    color: COMMON_COLORS.BLACK,
  },
  listItemMessage: {
    fontSize: moderateScale(12),
    color: COMMON_COLORS.GRAY,
    marginTop: moderateScale(5),
  },
  listItemIconWrapper: {
    height: moderateScale(40),
    width: moderateScale(40),
    backgroundColor: COMMON_COLORS.GRAY_LIGHT,
    borderRadius: 20,
    padding: moderateScale(10),
    marginRight: moderateScale(15),
  },
  listItemContentWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between', // Distribute buttons evenly
    marginBottom: moderateScale(10),
    paddingHorizontal: moderateScale(15),
  },
  actionButton: {
    flex: 1, // Make buttons take equal width
    marginHorizontal: moderateScale(5), // Add some spacing between buttons
  },
  statusButton: {
    flex: 1,
  },
});
