import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useDispatch, useSelector} from 'react-redux';
import LoginScreen from '../screens/auth';
import HomeScreen from '../screens/home';
import OtpScreen from '../screens/otp';
import BookingHistoryScreen from '../screens/bookingHistory';
import DrawerMenu from '../components/drawerMenu';
import NotificationsOffersScreen from '../screens/notificationAndOffers';
import AboutScreen from '../screens/about';
import PermissionsScreen from '../screens/permissions';
import HelpAndSupportScreen from '../screens/helpAndSupport';
import RideRelatedScreen from '../screens/rideRelated';
import CustomNotification from '../components/customNotification';
import SplashScreen from '../screens/splash/index';
// import SignupScreen from '../screens/signup';
// import LoginPhoneScreen from '../screens/LoginPhoneScreen';
import BookingConfirmationScreen from '../screens/bookingConfirmation';
// import PhoneNumberScreen from '../screens/phoneNumber';
import phoneNumber from '../screens/phoneNumber';
import CarNumberScreen from '../screens/CarNumber';
import VendorPhoneNumber from '../screens/VendorPhoneNumber';
import VendorOtpScreen from '../screens/VendorOtp';
import LanguageSelectionScreen from '../screens/LanguageScreen';
import RegisterOtp from '../screens/RegisterOtp';
import RegisterPhoneNumber from '../screens/RegisterPhoneNumber';
import PreferredCity from '../screens/PreferredCity';
import RegisterProfile from '../screens/RegisterProfile';
import LocalTripDashboard from '../screens/LocalTripDashboard';
// import UpdateProfilePhoto from '../screens/UpdateProfilePhoto';
import Settings from '../screens/Settings';
import ContactSupportScreen from '../screens/ContactSupportScreen';
import NotificationScreen from '../screens/Notification Screen';
import TripTypesScreen from '../screens/TripTypesScreen';
// import LogoutScreen from '../screens/LogoutScreen';
import ProfileDetailsScreen from '../screens/ProfileDetailsScreen';
import BookingAcceptScreen from '../screens/BookingAcceptScreen';
import LocalTripCompletedScreen from '../screens/LocalTripCompletedScreen';
import TripCompleteDetails from '../screens/TripCompleteDetails';
import OuterTripDashboard from '../screens/OuterTripDashboard';
import RentalTripDashboard from '../screens/RentalTripDashboard';
import OuterTripCompletedDetails from '../screens/OuterTripCompletedDetails';
import RentalTripCompletedDetails from '../screens/RentalTripCompletedDetails';
import ProfilePhotoScreen from '../screens/ProfilePhotoScreen';
import AadhaarUploadScreen from '../screens/AadhaarUploadScreen';
import DriverLicenseUploadScreen from '../screens/DriverLicenseUploadScreen';
// import VerificationScreen from '../screens/RegisterVerificationScreen';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const [isInitializing, setIsInitializing] = useState(true);
  const dispatch = useDispatch();
  const isLogin = useSelector(state => state.auth.isLogin); // Redux-managed login state
  const [start, setStart] = useState(false);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        console.log('Initializing app...');

        // Simulate a 10-second delay
        await new Promise(resolve => setTimeout(resolve, 10000));

        const credentials = false; // Simulated credential check
        if (credentials) {
          console.log('User credentials found:', credentials);
          // Uncomment to update Redux state: dispatch(setLogin(true));
        } else {
          console.log('No credentials found. Redirecting to login.');
          // Uncomment to update Redux state: dispatch(setLogin(false));
        }
      } catch (error) {
        console.error('Error retrieving credentials:', error);
        // Uncomment to update Redux state: dispatch(setLogin(false));
      } finally {
        // Once initialization is complete, hide splash
        setIsInitializing(false);
        setStart(true);
      }
    };

    initializeApp();
  }, [dispatch]);

  // useEffect(() => {
  //   if (!isInitializing) {
  //     SplashScreen.hide(); // Hide splash screen when initialization is done
  //   }
  // }, [isInitializing]);

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={start ? 'OuterTripDashboard' : 'OuterTripDashboard'}>
        <Stack.Screen
          name="SplashScreen"
          component={SplashScreen}
          options={{headerShown: false}}
        />
        {/* <Stack.Screen name="LoginPhoneScreen" component={LoginPhoneScreen} options={{ headerShown: false }} /> */}
        <Stack.Screen
          name="LoginScreen"
          component={LoginScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="phoneNumber"
          component={phoneNumber}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="PermissionsScreen"
          component={PermissionsScreen}
          options={{headerShown: false}}
        />
        {/* <Stack.Screen name="SignupScreen" component={SignupScreen} options={{ headerShown: false }} /> */}
        <Stack.Screen
          name="CarNumber"
          component={CarNumberScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="VendorOtp"
          component={VendorOtpScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="VendorPhoneNumber"
          component={VendorPhoneNumber}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="PreferredCity"
          component={PreferredCity}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="RegisterProfile"
          component={RegisterProfile}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="LocalTripDashboard"
          component={LocalTripDashboard}
          options={{headerShown: false}}
        />
        {/* <Stack.Screen name="UpdateProfilePhoto" component={UpdateProfilePhoto} options={{ headerShown: false }} /> */}
        <Stack.Screen
          name="BookingConfirmationScreen"
          component={BookingConfirmationScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="RegisterOtp"
          component={RegisterOtp}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="RegisterPhoneNumber"
          component={RegisterPhoneNumber}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="HomeScreen"
          component={HomeScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="LanguageScreen"
          component={LanguageSelectionScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="OtpScreen"
          component={OtpScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="BookingHistoryScreen"
          component={BookingHistoryScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="NotificationAndOffersScreen"
          component={NotificationsOffersScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="AboutScreen"
          component={AboutScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="HelpAndSupportScreen"
          component={HelpAndSupportScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="RideRelatedScreen"
          component={RideRelatedScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Settings"
          component={Settings}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="ContactSupportScreen"
          component={ContactSupportScreen}
          options={{headerShown: false}}
        />
        {/* <Stack.Screen name="DummyHomeScreen" component={DummyHome} options={{ headerShown: false }} /> */}
        <Stack.Screen
          name="NotificationScreen"
          component={NotificationScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="TripTypesScreen"
          component={TripTypesScreen}
          options={{headerShown: false}}
        />
        {/* <Stack.Screen name="LogoutScreen" component={LogoutScreen} options={{ headerShown: false }} /> */}
        <Stack.Screen
          name="ProfileDetailsScreen"
          component={ProfileDetailsScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="LocalTripCompletedScreen"
          component={LocalTripCompletedScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="TripCompleteDetails"
          component={TripCompleteDetails}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="RentalTripDashboard"
          component={RentalTripDashboard}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="OuterTripDashboard"
          component={OuterTripDashboard}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="OuterTripCompletedDetails"
          component={OuterTripCompletedDetails}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="RentalTripCompletedDetails"
          component={RentalTripCompletedDetails}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="ProfilePhotoScreen"
          component={ProfilePhotoScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="AadhaarUploadScreen"
          component={AadhaarUploadScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="DriverLicenseUploadScreen"
          component={DriverLicenseUploadScreen}
          options={{headerShown: false}}
        />
        {/* <Stack.Screen name="RegisterVerificationScreen" component={VerificationScreen} options={{ headerShown: false }} /> */}

        {/* <Stack.Screen name="BookingAcceptScreen" component={BookingAcceptScreen} options={{ headerShown: false }} /> */}
      </Stack.Navigator>

      <DrawerMenu />
      <CustomNotification />
    </NavigationContainer>
  );
};

export default AppNavigator;
