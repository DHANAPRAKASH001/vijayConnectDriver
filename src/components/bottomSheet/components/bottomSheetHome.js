import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {COMMON_COLORS} from '../../../constants/colors';

// Import your icon images (make sure to add them to your project folder)
import {APP_ICONS} from '../../../utils/icons';
import {moderateScale} from 'react-native-size-matters';
import CustomButton from '../../customButton';
import BottomSheetHeader from '../../bottomSheetHeader';
import { useNavigation } from '@react-navigation/native';

const BottomSheetHome = ({
  fromLocationData,
  fromLocationOnPress,
  toLocationData,
  toLocationOnPress,
}) => {
  const [selectedOption, setSelectedOption] = useState('DAILY'); // Default to DAILY
  const [vehicleType, setVehicleType] = useState('MINI'); // Default to DAILY
  const navigation = useNavigation(); // <-- Use the hook to get the navigation object


  const [index, setIndex] = useState(0); // Default to DAILY
  const [rideType, setRideType] = useState(null); // Default to DAILY
  const [rideSelected, setRideSelected] = useState(false); // Default to DAILY
  const [outStationTripType, setOutStationTripType] = useState('ONEWAY'); 
  const [selectedRentIndex, setSelectedRentIndex] = useState(); 



  // Handler for option selection
  const handleOptionSelect = option => {
    setSelectedOption(option);
    setRideType(option);
  };

  ////////////////////////////////////////////////////////////

  const actionButton = ({
    buttonIcon,
    buttonPrimaryText,
    buttonSecondaryText,
    leadingIcon,
  }) => {};

  const rentChartDummyData = [
    { id: '1', hr: "2 Hrs", km: "33 Km" },
    { id: '2', hr: "4 Hrs", km: "66 Km" },
    { id: '3', hr: "6 Hrs", km: "100 Km" },
    { id: '4', hr: "8 Hrs", km: "133 Km" },
    { id: '5', hr: "10 Hrs", km: "166 Km" },
    { id: '6', hr: "12 Hrs", km: "200 Km" },
    { id: '7', hr: "24 Hrs", km: "300 Km" },
    { id: '8', hr: "48 Hrs", km: "600 Km" },
  ];
  

  const vehicleTypeOnPress = vehicleType => {
    setVehicleType(vehicleType);
  };

  const renderLocationSection = () => {
    return (
      <View style={styles.locationDetailsWrapper}>
        {/* From Location Input */}
        <TouchableOpacity
          style={styles.inputWrapper}
          onPress={fromLocationOnPress}>
          <View style={styles.locationInputIconWrapper}>
            <Image source={APP_ICONS.CIRCLE_GREEN} style={styles.icon} />
          </View>

          <Text>{fromLocationData == null ? 'From' : fromLocationData}</Text>
        </TouchableOpacity>

        {/* To Location Input */}
        <TouchableOpacity
          style={styles.inputWrapper}
          onPress={toLocationOnPress}>
          <View style={styles.locationInputIconWrapper}>
            <Image source={APP_ICONS.CIRCLE_RED} style={styles.icon} />
          </View>

          <Text>{toLocationData == null ? 'Destination' : toLocationData}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const showAlert = () => {
    Alert.alert(
      "ALERT",             // Title of the alert
      "BOOKING CONFIRMED. FINDING A NEARBY DRIVER", // Message in the alert
      [
        {
          text: "OK",             // Single button text
          onPress: () => console.log("OK Pressed"), // Log when OK is pressed
        },
      ],
      { cancelable: false }        // Ensure the alert can't be dismissed by tapping outside
    );
  };

  
  const renderVehicleSelectionSection = () => {
    return (
      <View style={styles.vehicleSelectionWrapper}>
        <TouchableOpacity
          style={[
            styles.vehicleButton,
            {backgroundColor: vehicleType == 'MINI' ? '#E1D0FC' : null},
          ]}
          onPress={() => vehicleTypeOnPress('MINI')}>
          <View style={styles.vehicleButtonIconWrapper}>
            <Image source={APP_ICONS.MINI} style={styles.icon} />
          </View>

          <Text>MINI</Text>

          <Text>rs150</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.vehicleButton,
            {backgroundColor: vehicleType == 'SEDAN' ? '#E1D0FC' : null},
          ]}
          onPress={() => vehicleTypeOnPress('SEDAN')}>
          <View style={styles.vehicleButtonIconWrapper}>
            <Image source={APP_ICONS.SEDAN} style={styles.icon} />
          </View>

          <Text>SEDAN</Text>

          <Text>rs150</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.vehicleButton,
            {backgroundColor: vehicleType == 'SUV' ? '#E1D0FC' : null},
          ]}
          onPress={() => vehicleTypeOnPress('SUV')}>
          <View style={styles.vehicleButtonIconWrapper}>
            <Image source={APP_ICONS.SUV} style={styles.icon} />
          </View>
          <Text>SUV</Text>

          <Text>rs150</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderBookingPreferncesSection = () => {
    if (selectedOption == 'DAILY') {
      return (
        <View style={styles.container}>
          <BottomSheetHeader
            backButtonOnPress={() => setRideSelected(false)}
            headerText={'DAILY'}
          />

          {renderLocationSection()}

          {renderVehicleSelectionSection()}

          {/* ACTION BUTTON SECTION */}
          <View style={styles.actionButtonsWrapper}>
            <TouchableOpacity style={styles.actionButton}>
              <View style={styles.actionButtonIconWrapper}>
                <Image source={APP_ICONS.CURRENCY} style={styles.icon} />
              </View>

              <View>
                <Text>PAYMENT</Text>

                <Text>CASH</Text>
              </View>
              <View style={styles.actionButtonDropdownIconWrapper}>
                <Image source={APP_ICONS.ARROW_DOWN} style={styles.icon} />
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton}>
              <View style={styles.actionButtonIconWrapper}>
                <Image source={APP_ICONS.CALENDER} style={styles.icon} />
              </View>

              <View>
                <Text>SCHEDULE</Text>

                <Text>NOW</Text>
              </View>
              <View style={styles.actionButtonDropdownIconWrapper}>
                <Image source={APP_ICONS.ARROW_DOWN} style={styles.icon} />
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton}>
              <View style={styles.actionButtonIconWrapper}>
                <Image source={APP_ICONS.USER} style={styles.icon} />
              </View>

              <View>
                <Text>PERSONAL</Text>
              </View>
              <View style={styles.actionButtonDropdownIconWrapper}>
                <Image source={APP_ICONS.ARROW_DOWN} style={styles.icon} />
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton}>
              <View style={styles.actionButtonIconWrapper}>
                <Image source={APP_ICONS.COUPON} style={styles.icon} />
              </View>

              <View>
                <Text>COUPON</Text>
              </View>
              <View style={styles.actionButtonDropdownIconWrapper}>
                <Image source={APP_ICONS.ARROW_DOWN} style={styles.icon} />
              </View>
            </TouchableOpacity>
          </View>

          <CustomButton
            buttonText={'CONFIRM BOOKING'}
            // onPress={() => showAlert()}
            onPress={() => navigation.navigate('BookingConfirmationScreen')}

          />
        </View>
      );
    } else if (rideType == 'OUTSTATION') {
      return (
        <View style={styles.container}>
          <BottomSheetHeader
            backButtonOnPress={() => setRideSelected(false)}
            headerText={'OUTSTATION'}
          />
          {renderLocationSection()}

          {/* ACTION BUTTON SECTION */}
          <View
            style={[
              styles.actionButtonsWrapper,
              {marginTop: moderateScale(10)},
            ]}>
            <TouchableOpacity style={[styles.actionButton, {backgroundColor: outStationTripType == "ONEWAY" ? '#E1D0FC' : null}]} onPress={() => setOutStationTripType("ONEWAY") }>
              <View style={styles.actionButtonIconWrapper}>
                <Image source={APP_ICONS.ARROW_RIGHT_LONG} style={styles.icon} />
              </View>

              <View>
                <Text>ONE WAY TRIP</Text>

                <Text>Get DropOff</Text>
              </View>
              {/* <View style={styles.actionButtonDropdownIconWrapper}>
                <Image source={APP_ICONS.ARROW_DOWN} style={styles.icon} />
              </View> */}
            </TouchableOpacity>

            <TouchableOpacity style={[styles.actionButton, {backgroundColor: outStationTripType == "ROUND" ? '#E1D0FC' : null}]} onPress={() => setOutStationTripType("ROUND") }>
              <View style={styles.actionButtonIconWrapper}>
                <Image source={APP_ICONS.DOUBLE_END_ARROW} style={styles.icon} />
              </View>

              <View>
                <Text>ROUND TRIP</Text>

                <Text>Wait till Return</Text>
              </View>
              {/* <View style={styles.actionButtonDropdownIconWrapper}>
                <Image source={APP_ICONS.ARROW_DOWN} style={styles.icon} />
              </View> */}
            </TouchableOpacity>
          </View>

          {renderVehicleSelectionSection()}

          {/* ACTION BUTTON SECTION */}
          <View style={styles.actionButtonsWrapper}>
            <TouchableOpacity style={styles.actionButton}>
              <View style={styles.actionButtonIconWrapper}>
                <Image source={APP_ICONS.CURRENCY} style={styles.icon} />
              </View>

              <View>
                <Text>PAYMENT</Text>

                <Text>CASH</Text>
              </View>
              <View style={styles.actionButtonDropdownIconWrapper}>
                <Image source={APP_ICONS.ARROW_DOWN} style={styles.icon} />
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton}>
              <View style={styles.actionButtonIconWrapper}>
                <Image source={APP_ICONS.CALENDER} style={styles.icon} />
              </View>

              <View>
                <Text>SCHEDULE</Text>

                <Text>NOW</Text>
              </View>
              <View style={styles.actionButtonDropdownIconWrapper}>
                <Image source={APP_ICONS.ARROW_DOWN} style={styles.icon} />
              </View>
            </TouchableOpacity>
          </View>

          <CustomButton
            buttonText={'CONFIRM BOOKING'}
            onPress={() => setIndex(2)}
          />
        </View>
      );
    } else {
      return (
        <View style={styles.container}>
          <BottomSheetHeader
            backButtonOnPress={() => setRideSelected(false)}
            headerText={'RENTAL'}
          />
          {renderLocationSection()}

          <View style={styles.rentChartWrapper}>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
  {rentChartDummyData.map((item, index) => (
    <TouchableOpacity
      key={item.id} // unique key
      style={[
        styles.rentChartButton,
        { backgroundColor: selectedRentIndex === index ? "#E1D0FC" : "white" },
      ]}
      onPress={() => setSelectedRentIndex(index)} // functionality to change the selected index
    >
      <Text >
        {item.hr}
      </Text>
      <Text>
        {item.km}
      </Text>
    </TouchableOpacity>
  ))}
</ScrollView>

          </View>

           {/* ACTION BUTTON SECTION */}
           <View style={styles.actionButtonsWrapper}>
            <TouchableOpacity style={styles.actionButton}>
              <View style={styles.actionButtonIconWrapper}>
                <Image source={APP_ICONS.CURRENCY} style={styles.icon} />
              </View>

              <View>
                <Text>PAYMENT</Text>

                <Text>CASH</Text>
              </View>
              <View style={styles.actionButtonDropdownIconWrapper}>
                <Image source={APP_ICONS.ARROW_DOWN} style={styles.icon} />
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton}>
              <View style={styles.actionButtonIconWrapper}>
                <Image source={APP_ICONS.CALENDER} style={styles.icon} />
              </View>

              <View>
                <Text>SCHEDULE</Text>

                <Text>NOW</Text>
              </View>
              <View style={styles.actionButtonDropdownIconWrapper}>
                <Image source={APP_ICONS.ARROW_DOWN} style={styles.icon} />
              </View>
            </TouchableOpacity>
          </View>

          <CustomButton
            buttonText={'CONFIRM BOOKING'}
            onPress={() => setIndex(2)}
          />
        </View>
      );
    }
    ///////////////////////////////////////////////////////////
  };
  if (rideSelected) {
    return renderBookingPreferncesSection();
  }

  return (
    <View style={styles.container}>
      <BottomSheetHeader headerText={'New Ride'} />
      {/* LOCATION SECTION */}
      {renderLocationSection()}

      {fromLocationData != null && toLocationData != null && (
        <>
          <View style={styles.rideSelectionWrapper}>
            <TouchableOpacity
              style={[
                styles.rideButton,
                selectedOption === 'DAILY' && styles.selectedButton,
              ]}
              onPress={() => handleOptionSelect('DAILY')}>
              <View style={styles.rideButtonIconWrapper}>
                <Image source={APP_ICONS.DAILY} style={styles.icon} />
              </View>

              <Text>DAILY</Text>
              {selectedOption === 'DAILY' && (
                <View style={styles.selectionIndicator}></View>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.rideButton,
                selectedOption === 'OUTSTATION' && styles.selectedButton,
              ]}
              onPress={() => handleOptionSelect('OUTSTATION')}>
              <View style={styles.rideButtonIconWrapper}>
                <Image source={APP_ICONS.OUTSTATION} style={styles.icon} />
              </View>

              <Text>OUTSTATION</Text>
              {selectedOption === 'OUTSTATION' && (
                <View style={styles.selectionIndicator}></View>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.rideButton,
                selectedOption === 'RENTAL' && styles.selectedButton,
              ]}
              onPress={() => handleOptionSelect('RENTAL')}>
              <View style={styles.rideButtonIconWrapper}>
                <Image source={APP_ICONS.RENTAL} style={styles.icon} />
              </View>
              <Text>RENTAL</Text>

              {/* <View style={styles.selectionIndicator}></View> */}
              {selectedOption === 'RENTAL' && (
                <View style={styles.selectionIndicator}></View>
              )}
            </TouchableOpacity>
          </View>

          <CustomButton
            buttonText={'NEXT'}
            onPress={() => setRideSelected(true)}
          />
        </>
      )}
    </View>
  );
};

export default BottomSheetHome;

const styles = StyleSheet.create({
  container: {
    // padding: moderateScale(10),
  },
  locationDetailsWrapper: {
    borderRadius: 15,
    borderColor: COMMON_COLORS.BLACK,
    borderWidth: 1,
    paddingHorizontal: moderateScale(10),
    paddingVertical: moderateScale(5), // Space between the two inputs
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: moderateScale(5), // Space between the two inputs
  },
  icon: {
    height: '100%',
    width: '100%',
    resizeMode: 'contain',
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: COMMON_COLORS.GRAY,
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 10,
    fontSize: 14,
    color: COMMON_COLORS.BLACK,
  },
  vehicleSelectionWrapper: {
    borderRadius: 15,
    borderColor: COMMON_COLORS.BLACK,
    borderWidth: 1,
    paddingHorizontal: moderateScale(5),
    paddingVertical: moderateScale(4),
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginVertical: moderateScale(10),
    flexWrap: 'wrap', // Ensure vehicle buttons wrap to next line if necessary
  },
  rideSelectionWrapper: {
    borderRadius: 15,
    borderColor: COMMON_COLORS.BLACK,
    borderWidth: 1,
    paddingHorizontal: moderateScale(5),
    // paddingVertical: moderateScale(10),
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginVertical: moderateScale(10),
    flexWrap: 'wrap', // Ensure vehicle buttons wrap to next line if necessary
  },
  vehicleButton: {
    // height: moderateScale(70),
    // width: moderateScale(70),
    // backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    paddingVertical: moderateScale(1),
    paddingHorizontal: moderateScale(15),
    // marginBottom: moderateScale(10), // Space between vehicle buttons
  },
  rideButton: {
    // height: moderateScale(70),
    // width: moderateScale(70),
    // backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    paddingVertical: moderateScale(1),
    paddingHorizontal: moderateScale(15),
    // marginBottom: moderateScale(10), // Space between vehicle buttons
  },
  actionButtonsWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap', // Ensure buttons wrap to next row
    justifyContent: 'space-between', // Space between buttons
    // marginTop: moderateScale(10),
  },
  actionButton: {
    width: '48%', // Two buttons per row
    flexDirection: 'row',
    borderRadius: 15,
    borderColor: COMMON_COLORS.BLACK,
    borderWidth: 1,
    marginBottom: moderateScale(10), // Space between rows
    paddingHorizontal: moderateScale(10),
    paddingVertical: moderateScale(4),
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  actionButtonDropdownIconWrapper: {
    height: moderateScale(10),
    width: moderateScale(10),
  },
  actionButtonIconWrapper: {
    height: moderateScale(30),
    width: moderateScale(30),
  },
  locationInputIconWrapper: {
    height: moderateScale(25),
    width: moderateScale(25),
    marginRight: moderateScale(5),
  },
  vehicleButtonIconWrapper: {
    height: moderateScale(35),
    width: moderateScale(55),
  },
  rideButtonIconWrapper: {
    height: moderateScale(40),
    width: moderateScale(55),
  },
  selectionIndicator: {
    height: moderateScale(3),
    width: '100%',
    backgroundColor: '#7021F0',
  },rentChartWrapper: {
    padding: moderateScale(10),
    backgroundColor: "#D9D9D9",
    borderRadius: moderateScale(10),
    marginVertical: moderateScale(10)
  },rentChartButton: {
    padding: moderateScale(5),
    marginHorizontal: moderateScale(5),
    borderRadius: moderateScale(5),
    backgroundColor: "white"
  }
});
