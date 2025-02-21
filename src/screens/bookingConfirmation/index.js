import React, {useState} from 'react';
import {StyleSheet, Text, View, TouchableOpacity, Image, ScrollView} from 'react-native';
import {moderateScale} from 'react-native-size-matters';
import CustomScreenHeader from '../../components/screenHeader';
import {APP_ICONS} from '../../utils/icons';
import {COMMON_COLORS} from '../../constants/colors';
import InternalScreenLoader from '../../components/internalScreenLoader';
import {APP_IMAGES} from '../../utils/images';
import Seperator from '../../components/seperator';
import CustomButton from '../../components/customButton';
import { useDispatch } from 'react-redux';
import { driverConnectionSuccess } from './reducers';

const BookingConfirmationScreen = ({navigation}) => {
  const [isLoading, setIsLoading] = useState(false); // Simulate loading state
  const dispatch = useDispatch();


  const handleBackPress = () => {
    navigation.goBack();
  };

  const confirmBooking = () => {
dispatch(driverConnectionSuccess())
navigation.navigate('HomeScreen')
  }

  const renderContent = () => {
    if (isLoading) {
      return <InternalScreenLoader />;
    } else {
      return (
        <ScrollView style={styles.bodyContainer} showsVerticalScrollIndicator={false}>
          {/* Trip Details Section */}
          <View style={styles.tripDetailsWrapper}>
            <Text style={styles.tripDetailsTitle}>Trip Details</Text>

            <Seperator />

            <View style={styles.tripDetailsContentWrapper}>
              {/* Vehicle Type Icon */}
              <View style={styles.vehicleTypeIconWrapper}>
                <Image
                  style={styles.vehicleTypeIcon}
                  source={APP_ICONS.CAR_SEDAN}
                />
              </View>

              {/* Vehicle Details (if needed in the future) */}
              <View style={styles.vehicleDetailsWrapper}>
                <Text style={styles.vehicleDetailsText}>
                  Vijay Connect ( 4 SEATER )
                </Text>
                <View style={styles.locationWrapper}>
                  <Image
                    style={styles.locationIcon}
                    source={APP_ICONS.CIRCLE_GREEN}
                  />
                  <Text style={styles.vehicleDetailsText}>
                    * Final from location (from API)
                  </Text>
                </View>
                <View style={styles.locationWrapper}>
                  <Image
                    style={styles.locationIcon}
                    source={APP_ICONS.CIRCLE_RED}
                  />
                  <Text style={styles.vehicleDetailsText}>
                    * Final to location (from API)
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Date & Time Section */}
          <View style={styles.tripDetailsWrapper}>
            <Text style={styles.tripDetailsTitle}>Date & Time</Text>

            <Seperator />

            <View style={styles.tripDetailsContentWrapper}>
              <Text style={styles.vehicleDetailsText}>
                Trip starts at 12 Oct 2024, 11.15AM
              </Text>

              <Text style={styles.tripDetailsTitle}>
                one way trip of about 50 KMs . 1.30 HR
              </Text>
            </View>
          </View>

          {/* Fair Details Section */}
          <View style={styles.tripDetailsWrapper}>
            <Text style={styles.tripDetailsTitle}>Fair Details</Text>

            <Seperator />

            <View style={styles.fairDetailsContentWrapper}>
              <Text style={styles.fairDetailsText}>
              ₹1024.00

              </Text>
              <Text style={[styles.fairDetailsText, {fontSize: moderateScale(13)}]}>
              Estimated Fair

              </Text>

              <View style={styles.fairDetailsParticularsWrapper}>
                <View style={styles.fairText}>
                <Text style={styles.vehicleDetailsText}>
                  Trip Fair
                </Text>
                <Text style={styles.vehicleDetailsText}>
                ₹1024.00
                </Text>
                </View>

                <View style={styles.fairText}>
                <Text style={styles.vehicleDetailsText}>
                  Convinience Fair
                </Text>
                <Text style={styles.vehicleDetailsText}>
                ₹24.00
                </Text>
                </View>

                <View style={styles.fairText}>
                <Text style={styles.vehicleDetailsText}>
                  Tax & Fee
                </Text>
                <Text style={styles.vehicleDetailsText}>
                ₹104.00
                </Text>
                </View>
              </View>
            </View>
          </View>


          {/* Description Section */}
          <View style={styles.tripDetailsWrapper}>
            <Text style={styles.tripDetailsTitle}>Description</Text>

            <Seperator />

            <View style={styles.descriptionWrapper}>
              <Text style={styles.descriptionText}>
                {/* Bullet Point and Sample Description */}
                {'\u2022'} Trip starts at 12 Oct 2024, 11.15AM
              </Text>
              <Text style={styles.descriptionText}>
                {'\u2022'} The trip duration is approximately 1.5 hours.
              </Text>
              <Text style={styles.descriptionText}>
                {'\u2022'} The vehicle will be a 4-seater sedan (Vijay Connect).
              </Text>
              <Text style={styles.descriptionText}>
                {'\u2022'} Please arrive 15 minutes prior to the scheduled time.
              </Text>
            </View>

            <CustomButton buttonText={'CONFIRM BOOKING'} onPress={confirmBooking}/>
          </View>
        </ScrollView>
      );
    }
  };

  return (
    <View style={styles.container}>
      <CustomScreenHeader
        leadingIcon={APP_ICONS.BACK}
        onLeadingIconPress={handleBackPress}
        title="BOOKING CONFIRMATION"
      />
      {renderContent()}
    </View>
  );
};

export default BookingConfirmationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COMMON_COLORS.WHITE,
  },
  bodyContainer: {
    flex: 1,
    // paddingHorizontal: moderateScale(15),
  },
  tripDetailsWrapper: {
    // backgroundColor: COMMON_COLORS.GRAY_LIGHT,
    padding: moderateScale(15),
    borderRadius: moderateScale(8),
  },
  tripDetailsTitle: {
    fontSize: moderateScale(14),
    color: COMMON_COLORS.GRAY,
    // marginBottom: moderateScale(10),
  },
  tripDetailsContentWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-start', // Aligning content at the top
    flexWrap: 'wrap', // Allow wrapping for multiple lines
  },
  vehicleTypeIconWrapper: {
    width: moderateScale(50),
    height: moderateScale(50),
    marginRight: moderateScale(10),
  },
  vehicleTypeIcon: {
    height: '100%',
    width: '100%',
    resizeMode: 'contain',
  },
  vehicleDetailsWrapper: {
    flexDirection: 'column', // Stack details vertically
    flex: 1, // Allow the text to take up remaining space
  },
  vehicleDetailsText: {
    fontSize: moderateScale(14),
    marginVertical: moderateScale(5),
  },
  locationWrapper: {
    flexDirection: 'row',
    alignItems: 'center', // Align the icon and text horizontally
    marginBottom: moderateScale(5), // Add spacing between locations
  },
  locationIcon: {
    height: moderateScale(20),
    width: moderateScale(20),
    marginRight: moderateScale(10),
  },
  fairDetailsContentWrapper: {
    padding: moderateScale(5),
    backgroundColor: COMMON_COLORS.PRIMARY,
    borderRadius: moderateScale(5),
    
  },
  fairDetailsParticularsWrapper: {
    padding: moderateScale(10),
    backgroundColor: COMMON_COLORS.WHITE,
    borderRadius: moderateScale(5),
    marginTop: moderateScale(10)
  },fairDetailsText: {
    fontSize: moderateScale(20),
    textAlign: 'center',
    textAlignVertical: 'center',
  },fairText: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  }, descriptionText: {
    fontSize: moderateScale(14),
    fontWeight: '500',
    marginVertical: moderateScale(5),
  },descriptionWrapper: {
    marginBottom: moderateScale(20)
  }
});
