import {
  Image,
  StyleSheet,
  Text,
  Touchable,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useState } from 'react';
import {COMMON_COLORS} from '../../constants/colors';
import {moderateScale} from 'react-native-size-matters';
import {APP_ICONS} from '../../utils/icons';
import CustomButton from '../customButton';
import BottomSheet from '../bottomSheet';
import CancelBookingBottomSheet from '../cancelBookingBottomSheet';
import { useDispatch } from 'react-redux';
import { driverConnectionfailed } from '../../screens/bookingConfirmation/reducers';

const RideConfirmed = () => {
  const [bottomSheetVisiblity, setBottomSheeVisiblity] = useState(false);
  const [bottomSheetContent, setBottomSheetContent] = useState();

  const dispatch = useDispatch();

  const closeBottomSheet = () => {
    setBottomSheetContent();
    setBottomSheeVisiblity(false);
  }

  const cancel = () => {
    // setBottomSheetContent(<CancelBookingBottomSheet />)
    // setBottomSheeVisiblity(true)
    dispatch(driverConnectionfailed())
    
  }
  return (
    <View style={styles.container}>
      
        {/* <BottomSheet visible={bottomSheetVisiblity}>
          {bottomSheetContent}
        </BottomSheet> */}
      
      {/* OTP Bubble */}
      <View style={styles.otpBubble}>
        <Text style={styles.otpText}>OTP</Text>
        <Text style={styles.otpText}>8900</Text>
      </View>

      {/* Ride Details Wrapper */}
      <View style={styles.detailsWrapper}>
        {/* Driver Details */}
        <View style={styles.driverDetailsWrapper}>
          <View style={styles.driverParticularsWrapper}>
            <Image
              source={APP_ICONS.CIRCLE_GREEN}
              style={styles.driverPicture}
            />

            <View>
              <Text style={styles.driverText}>TN38DM4040</Text>
              <Text style={styles.driverText}>DZIRE</Text>
              <Text style={styles.driverText}>SAM CS</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.callButtonWrapper}>
            <Image source={APP_ICONS.CURRENCY} style={styles.currencyIcon} />
          </TouchableOpacity>
        </View>

        {/* Fair Details */}
        <View style={styles.driverDetailsWrapper}>
          <View style={styles.driverParticularsWrapper}>
            <TouchableOpacity style={styles.callButtonWrapper} disabled>
              <Image source={APP_ICONS.CURRENCY} style={styles.currencyIcon} />
            </TouchableOpacity>

            <View>
              <Text style={styles.driverText}>CASH</Text>
              <Text style={styles.driverText}>150 - 180</Text>
            </View>
          </View>
        </View>

        {/* Booked For */}
        <View style={styles.driverDetailsWrapper}>
          <Text
            style={[styles.driverText, {paddingVertical: moderateScale(10)}]}>
            Booking for Personal
          </Text>
        </View>

        {/* Location Details */}
        <View style={styles.locationDetailsWrapper}>
          <View style={styles.locationTextWrapper}>
            <Image
              source={APP_ICONS.CIRCLE_GREEN}
              style={styles.locationIcon}
            />

            <Text style={styles.driverText}>from location api data</Text>
          </View>

          <View style={styles.locationTextWrapper}>
            <Image source={APP_ICONS.CIRCLE_RED} style={styles.locationIcon} />

            <Text style={styles.driverText}>to location api data</Text>
          </View>
        </View>

        <View style={styles.actionButtonsWrapper}>
          <CustomButton buttonText={'CANCEL'} onPress={cancel} />
          <CustomButton buttonText={'SHARE'} />
        </View>
      </View>
    </View>
  );
};

export default RideConfirmed;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: '100%',
    bottom: moderateScale(10),
    padding: moderateScale(15),
    borderRadius: moderateScale(8),
    alignItems: 'flex-start',
    zIndex: 1000,
  },
  otpBubble: {
    paddingHorizontal: moderateScale(20),
    paddingVertical: moderateScale(8),
    borderRadius: moderateScale(20),
    marginBottom: moderateScale(10),
    backgroundColor: COMMON_COLORS.WHITE,
  },
  otpText: {
    fontSize: moderateScale(18),
    color: COMMON_COLORS.BLACK,
    fontWeight: 'bold',
  },
  detailsWrapper: {
    width: '100%',
    padding: moderateScale(10),
    backgroundColor: COMMON_COLORS.WHITE,
    borderRadius: moderateScale(10),
  },
  driverDetailsWrapper: {
    paddingHorizontal: moderateScale(10),
    paddingVertical: moderateScale(5),
    borderRadius: moderateScale(10),

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#D9D9D9',
    marginVertical: moderateScale(5),
  },
  driverPictureWrapper: {
    height: moderateScale(50),
    width: moderateScale(50),
    borderRadius: moderateScale(25), // Circular image
    overflow: 'hidden', // Ensures image stays within the circle
    marginRight: moderateScale(10), // Adds spacing between image and text
  },
  driverPicture: {
    width: moderateScale(50),
    height: moderateScale(50),
    resizeMode: 'contain', // Ensures image is contained within the circle
  },
  driverInfo: {
    flexDirection: 'column',
    justifyContent: 'center',
  },
  driverText: {
    fontSize: moderateScale(16),
    color: COMMON_COLORS.BLACK,
    marginLeft: moderateScale(10), // Adds spacing between driver details
  },
  callButtonWrapper: {
    backgroundColor: COMMON_COLORS.WHITE,
    padding: moderateScale(10),
    borderRadius: 100,
  },
  currencyIcon: {
    height: moderateScale(20),
    width: moderateScale(20),
    resizeMode: 'contain',
  },
  driverParticularsWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationTextWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: moderateScale(5),
  },
  locationIcon: {
    height: moderateScale(20),
    width: moderateScale(20),
    resizeMode: 'contain',
  },
  locationDetailsWrapper: {
    paddingHorizontal: moderateScale(10),
    paddingVertical: moderateScale(5),
    borderRadius: moderateScale(10),

    alignItems: 'flex-start',
    backgroundColor: '#D9D9D9',
    marginVertical: moderateScale(5),
  },
  actionButtonsWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginVertical: moderateScale(5),
  },
});
