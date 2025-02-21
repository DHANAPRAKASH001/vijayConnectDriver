import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {moderateScale} from 'react-native-size-matters';
import {COMMON_COLORS} from '../../constants/colors';
import {APP_ICONS} from '../../utils/icons';
import { useDispatch, useSelector } from 'react-redux';
import { closeDrawerMenu } from './reducers';
import { useNavigation } from '@react-navigation/native';

const DrawerMenu = () => {

    const navigation = useNavigation(); // Get navigation prop using hook


    const dispatch = useDispatch()

    const {isVisible} = useSelector(state => state.drawerMenu)

    const closeSideDrawer = () => {
    
        dispatch(closeDrawerMenu())
    
      }

  // Drawer buttons configuration
  const drawerButtons = [
    {
      buttonId: 1,
      buttonName: 'Take For a Ride',
      buttonIcon: APP_ICONS.CAR,
      onPress: () => console.log('Take For a Ride'),
    },
    {
      buttonId: 2,
      buttonName: 'Booking History',
      buttonIcon: APP_ICONS.HISTORY_CLOCK,
      onPress: () => {
        navigation.navigate("BookingHistoryScreen");
        closeSideDrawer();
      }
          },
    {
      buttonId: 3,
      buttonName: 'Notification & Offer',
      buttonIcon: APP_ICONS.NOTIFICATION_BELL,
      onPress: () => {
        navigation.navigate("NotificationAndOffersScreen");
        closeSideDrawer();
      }
    },
    {
      buttonId: 4,
      buttonName: 'Payment Methods',
      buttonIcon: APP_ICONS.CURRENCY,
      onPress: () => {
        navigation.navigate("PaymentMethodsScreen");
        closeSideDrawer();
      }
    },
    {
      buttonId: 5,
      buttonName: 'Help & Support',
      buttonIcon: APP_ICONS.HEADPHONE,
      onPress: () => {
        navigation.navigate("HelpAndSupportScreen");
        closeSideDrawer();
      }
    },
    {
      buttonId: 6,
      buttonName: 'About',
      buttonIcon: APP_ICONS.INFO,
      onPress: () => {
        navigation.navigate("AboutScreen");
        closeSideDrawer();
      }
    },
  ];

  // Render each button dynamically
  const renderButton = item => (
    <TouchableOpacity
      key={item.buttonId}
      style={styles.drawerButton}
      onPress={item.onPress}>
      <View style={styles.iconWrapper}>
        {/* <Text>{item.buttonIcon}</Text> */}
        <Image source={item.buttonIcon} style={styles.buttonIcon} />
      </View>
      <Text style={styles.buttonText}>{item.buttonName}</Text>
    </TouchableOpacity>
  );

  if (!isVisible) {
    return <></>
  }

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.contentWrapper}>
        <View style={styles.drawerHeader}>
          <View style={styles.drawerHeaderContentWrapper}>
            <TouchableOpacity style={styles.profilePictureWrapper}>
              <Text style={styles.profilePictureText}>P</Text>
            </TouchableOpacity>
            <Text style={styles.profileName}>{`Ram \n9876543210`}</Text>
          </View>

          <TouchableOpacity style={styles.closeButton} onPress={closeSideDrawer}>
            <View style={styles.iconWrapper}>
              {/* <Text>{item.buttonIcon}</Text> */}
              <Image source={APP_ICONS.LOGOUT} style={styles.buttonIcon} />
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.drawerBody}>
          {drawerButtons.map(item => renderButton(item))}
        </View>

        <View style={styles.drawerFooter}>
          <TouchableOpacity style={styles.drawerButton}>
            <View style={styles.iconWrapper}>
              {/* <Text>{item.buttonIcon}</Text> */}
              <Image source={APP_ICONS.LOGOUT} style={styles.buttonIcon} />
            </View>
            <Text style={styles.buttonText}>Logout</Text>
          </TouchableOpacity>

          <Text>Version 1.0</Text>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default DrawerMenu;

const styles = StyleSheet.create({
  container: {
    backgroundColor: COMMON_COLORS.GRAY_LIGHT,
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%', // Full height for the drawer
    width: moderateScale(300),
    maxWidth: moderateScale(400),
    paddingHorizontal: moderateScale(15),
  },
  contentWrapper: {
    flex: 1,
  },
  drawerHeader: {
    flexDirection: 'row',
    // alignItems: 'center',
    justifyContent: 'space-between',
    // height: moderateScale(100),
    paddingVertical: moderateScale(15),
    borderBottomWidth: 2,
    borderBottomColor: COMMON_COLORS.BLACK,
  },
  profileName: {
    fontSize: moderateScale(16),
    color: COMMON_COLORS.BLACK,
    lineHeight: moderateScale(20),
    marginTop: moderateScale(10)

  },
  profilePictureWrapper: {
    height: moderateScale(50),
    width: moderateScale(50),
    backgroundColor: COMMON_COLORS.BLUE_LIGHT,
    borderRadius: moderateScale(18),
    justifyContent: 'center',
    alignItems: 'center',
  },
  profilePictureText: {
    color: COMMON_COLORS.WHITE,
    fontSize: moderateScale(20),
  },
  drawerBody: {
    flex: 1,
    marginTop: moderateScale(10),
    //   backgroundColor: COMMON_COLORS.GREEN_LIGHT,
  },
  drawerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: moderateScale(10),
    // backgroundColor: "red",

    // borderBottomWidth: StyleSheet.hairlineWidth,
    // borderBottomColor: COMMON_COLORS.GRAY_LIGHT,
  },
  iconWrapper: {
    width: moderateScale(20),
    height: moderateScale(20),
    justifyContent: 'center',
    // alignItems: 'center',
    marginRight: moderateScale(10),
  },
  buttonText: {
    fontSize: moderateScale(14),
    color: COMMON_COLORS.BLACK,
  },
  drawerFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    // backgroundColor: "red",
    alignItems: 'center',
  },
  buttonIcon: {
    height: '100%',
    width: '100%',
    resizeMode: 'contain',
  },
  drawerHeaderContentWrapper: {},
  closeButton: {
    height: moderateScale(25),
    width: moderateScale(25),
    marginTop: moderateScale(10),
    borderRadius: 5,
    backgroundColor: COMMON_COLORS.RED_LIGHT,
    alignItems: "center",
    justifyContent: "center"
  }
});
