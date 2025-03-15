import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Image,
  Modal,
  TextInput,
  Linking,
  Alert,
} from 'react-native';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import {APP_ICONS} from '../../utils/icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { moderateScale } from 'react-native-size-matters';

/************************************************************
 * Helper: Haversine distance (in meters)
 * If you want a simpler approximate check, you could do:
 *   distance = Math.sqrt((lat1-lat2)^2 + (lon1-lon2)^2)
 * But let's do a basic haversine for better simulation.
 ************************************************************/
function getDistanceFromLatLonInM(lat1, lon1, lat2, lon2) {
  const R = 6371e3; // meters
  const toRad = x => (x * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const dist = R * c;
  return dist;
}

const OuterTripDashboard = ({navigation}) => {
  /******************************************************************
   * STATES
   ******************************************************************/
  const [isOnline, setIsOnline] = useState(false);
  const [isTripStarted, setIsTripStarted] = useState(false);

  // Modals & UI flows
  const [isBookingRequestModalVisible, setBookingRequestModalVisible] =
    useState(false);
  const [isReachButtonVisible, setIsReachButtonVisible] = useState(false);
  const [isStartTripButtonVisible, setIsStartTripButtonVisible] =
    useState(false);
  const [isTripDetailsModalVisible, setTripDetailsModalVisible] =
    useState(false);
  const [isCancelTripModalVisible, setCancelTripModalVisible] = useState(false);
  const [isVerifyOTPModalVisible, setVerifyOTPModalVisible] = useState(false);
  const [isEndTripModalVisible, setEndTripModalVisible] = useState(false);
  const [isConfirmationAlertVisible, setConfirmationAlertVisible] =
    useState(false);
  const [isMenuModalVisible, setIsMenuModalVisible] = useState(false);

  // Cancel Trip reason
  const [selectedReason, setSelectedReason] = useState(null);
  const [previousModal, setPreviousModal] = useState(null);

  // Interval Refs
  const rideCheckIntervalRef = useRef(null);
  const driverLocationIntervalRef = useRef(null);

  // **Driver** location (simulate movement)
  const [driverLat, setDriverLat] = useState(12.345);
  const [driverLng, setDriverLng] = useState(67.89);

  // **Booking** location (fixed for simulation)
  const [bookingLat] = useState(12.355);
  const [bookingLng] = useState(67.895);

  // Track if we've shown the "reached" alert
  const [hasReachedSpot, setHasReachedSpot] = useState(false);

  const [availableRides, setAvailableRides] = useState([]);

  /******************************************************************
   * ON MOUNT - GET TOKEN
   ******************************************************************/
  useEffect(() => {
    (async () => {
      const storedToken = await AsyncStorage.getItem('access_token');
      console.log('TOKEN from AsyncStorage:', storedToken);
    })();
  }, []);

  /******************************************************************
   * ONLINE/OFFLINE TOGGLE
   ******************************************************************/
  const toggleStatus = () => {
    const newStatus = !isOnline;
    setIsOnline(newStatus);
    if (!newStatus) {
      // If turning OFFLINE, stop intervals, isAvailable=false
      stopRideCheckInterval();
      stopDriverLocationInterval();
      console.log('Driver went OFFLINE => isAvailable=false');
    }
  };

  // Start/Stop ride-check polling when isOnline / isTripStarted changes
  useEffect(() => {
    if (isOnline && !isTripStarted) {
      startRideCheckInterval();
    } else {
      stopRideCheckInterval();
    }
  }, [isOnline, isTripStarted]);

  /******************************************************************
   * RIDE CHECK INTERVAL (10 SECONDS) - FOR AVAILABLE RIDES
   ******************************************************************/
  const startRideCheckInterval = async () => {
    stopRideCheckInterval();
    console.log('Starting 10s interval to poll for rides...');
    rideCheckIntervalRef.current = setInterval(async () => {
      try {
        // const storedToken = await AsyncStorage.getItem('access_token');
        // if (!storedToken) {
        //   Alert.alert('Error', 'Authorization token is missing.');
        //   console.log('Error: No authorization token found.');
        //   return;
        // }

        const storedToken =
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZW51bWJlciI6Ijk4NzY1NDMyMTAiLCJzdWIiOjEsImlhdCI6MTc0MTg4ODQxNSwiZXhwIjoxNzU3NDQwNDE1fQ.w1D9NKe-tIuOzdiR7wRbvDfITYQCiJ0fhXg_r38m3wk';
        if (!storedToken) {
          Alert.alert('Error', 'Authorization token is missing.');
          console.log('Error: No authorization token found.');
          return;
        }

        const raw = {
          latitude: '12.9716',
          longitude: '77.5946',
          isAvailable: true,
        };

        console.log(`Sending data to API:`, JSON.stringify(raw));

        const response = await fetch(
          `http://52.66.69.48:4000/driver-location`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${storedToken}`, // Attach the token to the request header
            },
            body: JSON.stringify(raw), // Ensure body is properly formatted
          },
        );

        const data = await response.json();
        console.log(`API Response [${response.status}]:`, data);

        if (!response.ok) {
          console.error(
            `🚨 API Error: ${response.status} - ${response.statusText}`,
          );
          console.error(`Response Headers:`, response.headers);
          throw new Error(data.message || 'Unexpected API error occurred');
        }
      } catch (error) {
        console.error(`❌ Upload Failed:`, {
          message: error.message,
          stack: error.stack,
          error,
        });

        Alert.alert(
          'Upload Error',
          `Failed to update driver location. Please check your network and try again.`,
        );
        return false; // If any upload fails, return false
      }

      // ---------------------------------------------> FETCH AVAILABLE BOOKINGS

      try {
        // const storedToken = await AsyncStorage.getItem('access_token');
        // if (!storedToken) {
        //   Alert.alert('Error', 'Authorization token is missing.');
        //   console.log('Error: No authorization token found.');
        //   return;
        // }

        console.log('======================');

        const storedToken =
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZW51bWJlciI6Ijk4NzY1NDMyMTAiLCJzdWIiOjEsImlhdCI6MTc0MTg4ODQxNSwiZXhwIjoxNzU3NDQwNDE1fQ.w1D9NKe-tIuOzdiR7wRbvDfITYQCiJ0fhXg_r38m3wk';
        if (!storedToken) {
          Alert.alert('Error', 'Authorization token is missing.');
          console.log('Error: No authorization token found.');
          return;
        }

        const raw = {
          latitude: '12345',
          longitude: '12345',
          isAvailable: true,
        };

        console.log(`Sending data to API:`, JSON.stringify(raw));

        const response = await fetch(
          `http://52.66.69.48:4000/driver-location/available_rides`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${storedToken}`, // Attach the token to the request header
            },
          },
        );

        const data = await response.json();

        if (!response.ok || !data || data.length === 0) {
          console.error('🚨 No available rides or API error');
          setBookingRequestModalVisible(false);
          return;
        }

        // Store trip details and open modal
        setAvailableRides(data[0]);
        setBookingRequestModalVisible(true);

        console.log('✅ Trip details updated:', availableRides, data[0]);
      } catch (error) {
        console.error(`❌ available_rides Failed:`, {
          message: error.message,
          stack: error.stack,
          error,
        });

        Alert.alert(
          'available_rides',
          `Failed to update driver location. Please check your network and try again.`,
        );
        return false; // If any upload fails, return false
      }

      setBookingRequestModalVisible(true);
      // In real code, you'd parse the API response, and only open the modal if a ride is actually found
    }, 10000);
  };

  const stopRideCheckInterval = () => {
    if (rideCheckIntervalRef.current) {
      clearInterval(rideCheckIntervalRef.current);
      rideCheckIntervalRef.current = null;
    }
  };

  /******************************************************************
   * BOOKING REQUEST HANDLERS
   ******************************************************************/
  // const handleAcceptBooking = () => {
  //   console.log('Driver accepted the booking.');
  //   setBookingRequestModalVisible(false);
  //   setIsReachButtonVisible(true);
  //   setHasReachedSpot(false); // reset if previously reached

  //   // Stop checking for new rides since we have one
  //   stopRideCheckInterval();

  //   // Per your requirement: once ride is accepted, push location every 5 seconds
  //   startDriverLocationInterval();
  // };

  const handleAcceptBooking = async () => {
    console.log('Attempting to accept booking...');

    const storedToken =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZW51bWJlciI6Ijk4NzY1NDMyMTAiLCJzdWIiOjEsImlhdCI6MTc0MTg4ODQxNSwiZXhwIjoxNzU3NDQwNDE1fQ.w1D9NKe-tIuOzdiR7wRbvDfITYQCiJ0fhXg_r38m3wk';

    if (!storedToken) {
      Alert.alert('Error', 'Authorization token is missing.');
      console.error('Error: No authorization token found.');
      return;
    }

    try {
      console.log('Sending API request to accept booking...');
      const response = await fetch(
        'http://52.66.69.48:4000/available-rides/accept',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${storedToken}`,
          },
          body: JSON.stringify({id: availableRides.id}),
        },
      );

      console.log('API response received.');

      const data = await response.json();

      console.log('API Response Data:', data);

      if (!response.status == 200) {
        throw new Error(
          data?.message || 'Something went wrong while accepting booking.',
        );
      }

      console.log(
        'Booking accepted successfully. Proceeding with next steps...',
        data,
      );

      // Proceed only if API call is successful
      setBookingRequestModalVisible(false);
      setIsReachButtonVisible(true);
      setHasReachedSpot(false); // reset if previously reached

      // Stop checking for new rides since we have one
      stopRideCheckInterval();

      // Start pushing driver location every 5 seconds
      startDriverLocationInterval();

      console.log('Driver location tracking started.');
    } catch (error) {
      console.error('Error accepting booking:', error);
      Alert.alert(
        'Error',
        error.message || 'Something went wrong. Please try again.',
      );
    }
  };

  const handleSkipBooking = () => {
    console.log('Driver skipped the booking.');
    setBookingRequestModalVisible(false);
    // Keep the 10-second interval running if still online
  };

  /******************************************************************
   * DRIVER LOCATION INTERVAL (EVERY 5 SECONDS)
   * Simulate sending location updates to the server & move driver closer to booking
   ******************************************************************/
  const startDriverLocationInterval = () => {
    stopDriverLocationInterval(); // clear old intervals if any
    console.log('Starting 5s driver-location interval...');
    driverLocationIntervalRef.current = setInterval(() => {
      // 1) "Send" location to the API
      console.log(
        'Sending driver location => lat:',
        driverLat,
        'lng:',
        driverLng,
      );

      // 2) Simulate movement TOWARDS the booking spot
      moveDriverCloserToBooking();

      // 3) Check if we've reached or are very close to the booking spot
      const distance = getDistanceFromLatLonInM(
        driverLat,
        driverLng,
        bookingLat,
        bookingLng,
      );
      if (distance < 100 && !hasReachedSpot) {
        // 100 meters threshold => considered "reached"
        setHasReachedSpot(true);
        setIsReachButtonVisible(false);
        setIsStartTripButtonVisible(true);
        Alert.alert(
          'Booking spot reached',
          'You have arrived at the booking spot.',
        );
      }
    }, 5000);
  };

  const stopDriverLocationInterval = () => {
    if (driverLocationIntervalRef.current) {
      clearInterval(driverLocationIntervalRef.current);
      driverLocationIntervalRef.current = null;
    }
  };

  /******************************************************************
   * Simulate movement: move driver ~25% closer to the booking each update
   ******************************************************************/
  const moveDriverCloserToBooking = () => {
    const factor = 0.25; // how aggressively to move
    const latDiff = bookingLat - driverLat;
    const lngDiff = bookingLng - driverLng;

    setDriverLat(prev => prev + latDiff * factor);
    setDriverLng(prev => prev + lngDiff * factor);
  };

  /******************************************************************
   * REACH CUSTOMER -> START TRIP
   * (You still have this button from old flow, user can press it too)
   ******************************************************************/
  const handleReachCustomer = () => {
    console.log('Driver is heading to customer => opening Google Maps.');
    const customerLocationUrl =
      'https://www.google.com/maps/dir/?api=1&destination=Customer+Location';
    Linking.openURL(customerLocationUrl).then(() => {
      // In your old flow, this toggles start trip button.
      // But we also do it automatically if we detect near the spot.
      setIsReachButtonVisible(false);
      setIsStartTripButtonVisible(true);
    });
  };

  // const handleStartTrip = () => {
  //   console.log('Trip started by driver.');
  //   setIsStartTripButtonVisible(false);
  //   setIsTripStarted(true);
  //   setTripDetailsModalVisible(true);
  //   // We continue the 5-second updates for location
  //   // In the original code, you started them here, but now we do it at accept.
  //   // That's fine: either keep it going, or do nothing special here.
  // };

  const handleStartTrip = async () => {
    console.log('Attempting to start trip...');

    const storedToken =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZW51bWJlciI6Ijk4NzY1NDMyMTAiLCJzdWIiOjEsImlhdCI6MTc0MTg4ODQxNSwiZXhwIjoxNzU3NDQwNDE1fQ.w1D9NKe-tIuOzdiR7wRbvDfITYQCiJ0fhXg_r38m3wk';

    if (!storedToken) {
      Alert.alert('Error', 'Authorization token is missing.');
      console.error('Error: No authorization token found.');
      return;
    }

    try {
      console.log('Sending API request to start trip...');
      const response = await fetch(
        `http://52.66.69.48:4000/available-rides/start/${availableRides.id}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${storedToken}`,
          },
        },
      );

      console.log('API response status:', response.status);

      let data;
      try {
        data = await response.json();
        console.log('API Response Data:', data);
      } catch (jsonError) {
        console.error('Error parsing response JSON:', jsonError);
        throw new Error('Invalid response format from server.');
      }

      if (!response.status == 200) {
        throw new Error(
          data?.message || 'Something went wrong while starting trip.',
        );
      }

      console.log('Trip started successfully. Proceeding with next steps...');

      // Proceed only if API call is successful
      setIsStartTripButtonVisible(false);
      setIsTripStarted(true);
      setTripDetailsModalVisible(true);

      console.log('Trip UI updated.');
    } catch (error) {
      console.error('Error starting trip:', error);
      Alert.alert(
        'Error',
        error.message || 'Something went wrong. Please try again.',
      );
    }
  };

  /******************************************************************
   * TRIP DETAILS -> VERIFY OTP -> END TRIP
   ******************************************************************/
  const handleTripDetailsComplete = () => {
    setTripDetailsModalVisible(false);
    setVerifyOTPModalVisible(true);
  };

  const handleVerifyOTP = () => {
    console.log('OTP verified, now proceeding to end trip modal.');
    setVerifyOTPModalVisible(false);
    setEndTripModalVisible(true);
  };

  const endTripCompletely = () => {
    console.log('Trip ended by driver.');
    setIsTripStarted(false);
    stopDriverLocationInterval(); // Stop sending location updates

    setEndTripModalVisible(false);
    setConfirmationAlertVisible(false);

    // If still online, we can resume ride-check polling
    if (isOnline) {
      startRideCheckInterval();
    }

    // Optionally navigate to a "trip completed" screen
    navigation.navigate('OuterTripCompletedDetails');
  };

  /******************************************************************
   * CANCEL TRIP MODAL - as in your original code
   ******************************************************************/
  const openCancelTripModal = () => {
    setPreviousModal('tripDetails');
    setCancelTripModalVisible(true);
    setTripDetailsModalVisible(false);
  };

  const toggleCancelTripModal = () => {
    setCancelTripModalVisible(!isCancelTripModalVisible);
  };

  const handleEndTripBtn = async () => {
    setConfirmationAlertVisible(true)


    console.log('Attempting to start trip...');

    const storedToken =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZW51bWJlciI6Ijk4NzY1NDMyMTAiLCJzdWIiOjEsImlhdCI6MTc0MTg4ODQxNSwiZXhwIjoxNzU3NDQwNDE1fQ.w1D9NKe-tIuOzdiR7wRbvDfITYQCiJ0fhXg_r38m3wk';

    if (!storedToken) {
      Alert.alert('Error', 'Authorization token is missing.');
      console.error('Error: No authorization token found.');
      return;
    }

    try {
      console.log('Sending API request to start trip...');
      const response = await fetch(
        `http://52.66.69.48:4000/available-rides/end/${availableRides.id}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${storedToken}`,
          },
        },
      );

      console.log('API response status:', response.status);

      let data;
      try {
        data = await response.json();
        console.log('API Response Data:', data);
      } catch (jsonError) {
        console.error('Error parsing response JSON:', jsonError);
        throw new Error('Invalid response format from server.');
      }

      if (!response.status == 200) {
        throw new Error(
          data?.message || 'Something went wrong while starting trip.',
        );
      }

      console.log('Trip started successfully. Proceeding with next steps...');

      // Proceed only if API call is successful
      setIsStartTripButtonVisible(false);
      setIsTripStarted(true);
      setTripDetailsModalVisible(true);

      console.log('Trip UI updated.');
    } catch (error) {
      console.error('Error starting trip:', error);
      Alert.alert(
        'Error',
        error.message || 'Something went wrong. Please try again.',
      );
    }

  }
  /******************************************************************
   * RENDER
   ******************************************************************/
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* MAP VIEW */}
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={{
          latitude: 12.345,
          longitude: 67.89,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        }}>
        {/* Driver Marker */}
        <Marker
          coordinate={{latitude: driverLat, longitude: driverLng}}
          title="Driver"
          description="Your current position">
          <Image source={APP_ICONS.CAR} style={{width: 30, height: 30}} />
        </Marker>

        {/* Booking Spot Marker */}
        <Marker
          coordinate={{latitude: bookingLat, longitude: bookingLng}}
          title="Booking Spot"
          description="Where you need to go"
          pinColor="green"
        />
      </MapView>

      {/* Settings Icon (Top Left) */}
      <TouchableOpacity
        style={styles.settingsButton}
        onPress={() => navigation.navigate('Settings')}>
        <Image source={APP_ICONS.MENU} style={styles.icon} />
      </TouchableOpacity>

      {/* Menu (Top Right) */}
      <TouchableOpacity
        style={styles.menuButton}
        onPress={() => setIsMenuModalVisible(true)}>
        <Image source={APP_ICONS.MENU_DOTS} style={styles.icon} />
      </TouchableOpacity>

      {/* Online/Offline Toggle */}
      <View style={styles.leftBottomContainer}>
        <TouchableOpacity style={styles.statusButton} onPress={toggleStatus}>
          <Text style={styles.statusText}>
            {isOnline ? 'Online' : 'Offline'}
          </Text>
          <View
            style={[
              styles.statusIndicator,
              {backgroundColor: isOnline ? 'green' : 'red'},
            ]}
          />
        </TouchableOpacity>
      </View>

      {/* Outer Trip Text (Center Top) */}
      <View style={styles.localTripContainer}>
        <Text style={styles.localTripText}>Outer Trip</Text>
      </View>

      {/****************************************************************
        MENU MODAL
      ****************************************************************/}
      <Modal
        transparent
        visible={isMenuModalVisible}
        onRequestClose={() => setIsMenuModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.menuModalContainer}>
            {/* Sync Option */}
            <TouchableOpacity
              style={styles.menuOption}
              onPress={() => {
                setIsMenuModalVisible(false);
                console.log('Sync clicked...');
              }}>
              <Image source={APP_ICONS.SYNC} style={styles.menuIcon} />
              <Text style={styles.menuOptionText}>Sync</Text>
            </TouchableOpacity>

            {/* SOS Option */}
            <TouchableOpacity
              style={styles.menuOption}
              onPress={() => {
                setIsMenuModalVisible(false);
                console.log('SOS clicked...');
              }}>
              <Image source={APP_ICONS.SOS} style={styles.menuIcon} />
              <Text style={styles.menuOptionText}>SOS</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/****************************************************************
        BOOKING REQUEST MODAL
      ****************************************************************/}
      <Modal
        transparent
        visible={isBookingRequestModalVisible}
        onRequestClose={() => setBookingRequestModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.bookingRequestModalContainer}>
            {/* Skip Button */}
            <TouchableOpacity
              style={styles.skipButton}
              onPress={handleSkipBooking}>
              <Text style={styles.skipButtonText}>Skip</Text>
            </TouchableOpacity>

            <Text style={styles.modalHeader}>Booking Request</Text>

            {/* Demo booking info */}
            <View style={styles.bookingInfoContainer}>
              <View style={styles.bookingInfoRow}>
                <Text style={styles.bookingInfoText}>Outer Trip</Text>
              </View>
              <View style={styles.bookingInfoRow}>
                <Text style={styles.bookingInfoText}>
                  {`${availableRides?.estimatedFair} / ${availableRides?.distance}`}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.acceptBookingButton}
              onPress={handleAcceptBooking}>
              <Text style={styles.acceptBookingButtonText}>ACCEPT BOOKING</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/****************************************************************
        REACH + START TRIP BUTTONS
      ****************************************************************/}
      {isReachButtonVisible && (
        <View style={styles.reachButtonContainer}>
          <TouchableOpacity
            style={styles.reachButton}
            onPress={handleReachCustomer}>
            <Text style={styles.reachButtonText}>Reach</Text>
          </TouchableOpacity>
        </View>
      )}

      {isStartTripButtonVisible && (
        <View style={styles.startTripContainer}>
          <TouchableOpacity
            style={styles.startTripButton}
            onPress={handleStartTrip}>
            <Text style={styles.startTripButtonText}>Start Trip</Text>
          </TouchableOpacity>
        </View>
      )}

      {/****************************************************************
        TRIP DETAILS MODAL
      ****************************************************************/}
      <Modal
        transparent
        visible={isTripDetailsModalVisible}
        onRequestClose={() => setTripDetailsModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.tripDetailsModalContainer}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => {
                setTripDetailsModalVisible(false);
                if (previousModal === 'bookingRequest') {
                  setBookingRequestModalVisible(true);
                }
              }}>
              <Image source={APP_ICONS.BACK} style={styles.backIcon} />
            </TouchableOpacity>

            <Text style={styles.tripDetailsHeader}>Trip Info</Text>

            {/* Trip Details Button => e.g. navigate to a screen */}
            <TouchableOpacity
              style={styles.tripDetailsButton}
              onPress={() => {
                setTripDetailsModalVisible(false);
                navigation.navigate('TripCompleteDetails', {
                  onGoBack: () => setTripDetailsModalVisible(true),
                });
              }}>
              <Image source={APP_ICONS.INFO} style={styles.buttonIcon} />
              <Text style={styles.tripDetailsButtonText}>Trip Details</Text>
            </TouchableOpacity>

            {/* Cancel Trip Button */}
            {/* <TouchableOpacity
              style={styles.cancelTripButtonInModal}
              onPress={() => {
                setCancelTripModalVisible(true);
                setTripDetailsModalVisible(false);
              }}
            >
              <Image source={APP_ICONS.CANCEL} style={styles.buttonIcon} />
              <Text style={styles.cancelTripButtonText}>Cancel Trip</Text>
            </TouchableOpacity> */}

            {/* Next => verify OTP */}
            <TouchableOpacity
              style={styles.nextButton}
              onPress={handleTripDetailsComplete}>
              <Text style={styles.nextButtonText}>Next</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/****************************************************************
        CANCEL TRIP MODAL
      ****************************************************************/}
      <Modal
        transparent
        visible={isCancelTripModalVisible}
        onRequestClose={() => setCancelTripModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.cancelTripModalContainer}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => {
                setCancelTripModalVisible(false);
                if (previousModal === 'tripDetails') {
                  setTripDetailsModalVisible(true);
                }
              }}>
              <Image source={APP_ICONS.BACK} style={styles.backIcon} />
            </TouchableOpacity>

            <Text style={styles.cancelTripModalHeader}>
              Cancel Trip - Reason
            </Text>
            <Text style={styles.cancelTripModalSubHeader}>
              To confirm the reason, our Team will reach you over Phone call
            </Text>

            {/* Reason Options */}
            <TouchableOpacity
              style={[
                styles.reasonButton,
                selectedReason === 'No response' && styles.selectedReasonButton,
              ]}
              onPress={() => setSelectedReason('No response')}>
              <Text style={styles.reasonButtonText}>No response</Text>
              {selectedReason === 'No response' && (
                <Image
                  source={APP_ICONS.CHECKMARK}
                  style={styles.checkmarkIcon}
                />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.reasonButton,
                selectedReason === 'Request to cancel' &&
                  styles.selectedReasonButton,
              ]}
              onPress={() => setSelectedReason('Request to cancel')}>
              <Text style={styles.reasonButtonText}>Request to cancel</Text>
              {selectedReason === 'Request to cancel' && (
                <Image
                  source={APP_ICONS.CHECKMARK}
                  style={styles.checkmarkIcon}
                />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.reasonButton,
                selectedReason === 'Time change' && styles.selectedReasonButton,
              ]}
              onPress={() => setSelectedReason('Time change')}>
              <Text style={styles.reasonButtonText}>Time change</Text>
              {selectedReason === 'Time change' && (
                <Image
                  source={APP_ICONS.CHECKMARK}
                  style={styles.checkmarkIcon}
                />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.reasonButton,
                selectedReason === 'Others' && styles.selectedReasonButton,
              ]}
              onPress={() => setSelectedReason('Others')}>
              <Text style={styles.reasonButtonText}>Others</Text>
              {selectedReason === 'Others' && (
                <>
                  <Image
                    source={APP_ICONS.CHECKMARK}
                    style={styles.checkmarkIcon}
                  />
                  <TextInput
                    style={styles.othersInput}
                    placeholder="e.g Schedule change"
                    placeholderTextColor="#999"
                  />
                </>
              )}
            </TouchableOpacity>

            {/* Submit Button */}
            <TouchableOpacity
              style={styles.submitButton}
              onPress={() => {
                console.log('Selected Reason:', selectedReason);
                setCancelTripModalVisible(false);
              }}>
              <Text style={styles.submitButtonText}>Submit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/****************************************************************
        VERIFY OTP MODAL
      ****************************************************************/}
      <Modal
        transparent
        visible={isVerifyOTPModalVisible}
        onRequestClose={() => setVerifyOTPModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.verifyOTPModalContainer}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => {
                setVerifyOTPModalVisible(false);
                if (previousModal === 'tripDetails') {
                  setTripDetailsModalVisible(true);
                }
              }}>
              <Image source={APP_ICONS.BACK} style={styles.backIcon} />
            </TouchableOpacity>

            <Text style={styles.modalHeader}>Verify OTP</Text>
            <Text style={styles.modalSubHeader}>
              Please Enter the OTP Sent to your Phone
            </Text>

            <TextInput
              style={styles.otpInput}
              placeholder="Enter OTP"
              placeholderTextColor="#999"
              keyboardType="number-pad"
            />

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setVerifyOTPModalVisible(false)}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.verifyButton}
                onPress={handleVerifyOTP}>
                <Text style={styles.verifyButtonText}>Verify</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/****************************************************************
        END TRIP MODAL
      ****************************************************************/}
      {/* <Modal
        transparent
        visible={isEndTripModalVisible}
        onRequestClose={() => setEndTripModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.endTripModalContainer}>
            

          
          </View>
        </View>
      </Modal> */}

<View style={{   position: 'absolute', width: '100%', bottom: 10, alignItems: 'center'
}}>
<TouchableOpacity
              style={styles.endTripButton}
              onPress={() => setConfirmationAlertVisible(true)}>
              <Text style={styles.endTripButtonText}>End Trip</Text>
            </TouchableOpacity>
</View>

      {/****************************************************************
        CONFIRMATION ALERT MODAL
      ****************************************************************/}
      <Modal
        transparent
        visible={isConfirmationAlertVisible}
        onRequestClose={() => setConfirmationAlertVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.confirmationAlertContainer}>
            <Text style={styles.confirmationAlertText}>
              Are you sure you want to End the Trip?
            </Text>
            <View style={styles.confirmationButtonContainer}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={handleEndTripBtn}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={handleEndTripBtn}>
                <Text style={styles.confirmButtonText}>End Trip</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

/************************************************************************
 * STYLES (Mostly the same as your original)
 ************************************************************************/
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  backButton: {
    position: 'absolute',
    top: 10,
    left: 10,
    padding: 10,
  },
  backIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  selectedReasonButton: {
    backgroundColor: '#e0f7fa',
  },
  checkmarkIcon: {
    width: 16,
    height: 16,
    marginLeft: 10,
    tintColor: '#007BFF',
  },
  cancelTripModalContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    width: '80%',
  },
  cancelTripModalHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 10,
    textAlign: 'center',
  },
  cancelTripModalSubHeader: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  reasonButton: {
    backgroundColor: '#f8f8f8',
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
    alignItems: 'center',
  },
  reasonButtonText: {
    fontSize: 16,
    color: '#000',
  },
  othersInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginTop: 10,
    width: '100%',
    fontSize: 14,
    color: '#000',
  },
  submitButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  leftBottomContainer: {
    position: 'absolute',
    bottom: 16,
    left: 16,
  },
  statusButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  statusText: {
    marginRight: 8,
    fontSize: 16,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  settingsButton: {
    position: 'absolute',
    top: 30,
    left: 20,
    padding: 10,
    backgroundColor: 'rgba(237, 230, 230, 0.9)',
  },
  menuButton: {
    position: 'absolute',
    top: 30,
    right: 20,
    padding: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
  },
  icon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  localTripContainer: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  localTripText: {
    backgroundColor: '#007bff',
    padding: 13,
    borderRadius: 50,
    width: '40%',
    textAlign: 'center',
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  reachButtonContainer: {
    position: 'absolute',
    bottom: 100,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  reachButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  reachButtonText: {
    color: 'white',
    fontSize: 18,
  },
  startTripContainer: {
    position: 'absolute',
    bottom: 100,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  startTripButton: {
    backgroundColor: '#6374FF',
    padding: 15,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  startTripButtonText: {
    color: 'white',
    fontSize: 18,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  bookingRequestModalContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    width: '85%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  skipButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  skipButtonText: {
    fontSize: 16,
    color: '#007bff',
    fontWeight: 'bold',
    backgroundColor: '#e6f3ff',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  modalHeader: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#000',
  },
  bookingInfoContainer: {
    marginBottom: 20,
  },
  bookingInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  bookingInfoText: {
    fontSize: 16,
    color: '#000',
  },
  acceptBookingButton: {
    backgroundColor: '#6374FF',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  acceptBookingButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  verifyOTPModalContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    alignItems: 'center',
  },
  modalSubHeader: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  otpInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    width: '100%',
    fontSize: 16,
    color: '#000',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  cancelButton: {
    backgroundColor: '#ccc',
    padding: 15,
    borderRadius: 5,
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  verifyButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 5,
    flex: 1,
    marginLeft: 10,
    alignItems: 'center',
  },
  verifyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  tripDetailsModalContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    width: '90%',
    alignItems: 'center',
  },
  tripDetailsHeader: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#000',
  },
  tripDetailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 5,
    width: '100%',
    marginBottom: 10,
  },
  tripDetailsButtonText: {
    fontSize: 16,
    color: '#000',
    marginLeft: 10,
  },
  cancelTripButtonInModal: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ff4444',
    padding: 15,
    borderRadius: 5,
    width: '100%',
  },
  cancelTripButtonText: {
    color: 'white',
    fontSize: 18,
    marginLeft: 10,
  },
  buttonIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  nextButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  nextButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  endTripModalContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    width: '100%',
    position: 'absolute',
    bottom: 0,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: -2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  endTripModalHeader: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#000',
    textAlign: 'center',
  },
  tripDetailsContainer: {
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 15,
    width: '100%',
    marginBottom: 20,
    alignItems: 'center',
  },
  tripDetailText: {
    fontSize: 18,
    color: '#000',
    marginBottom: 10,
    textAlign: 'center',
    fontWeight: '500',
  },
  endTripButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 10,
    width: '94%',
    alignItems: 'center',
    shadowColor: '#007bff',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  endTripButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  confirmationAlertContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    width: '100%',
    position: 'absolute',
    bottom: 0,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: -2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  confirmationAlertText: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  confirmationButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  confirmButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 10,
    flex: 1,
    marginLeft: 10,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  menuModalContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    width: '100%',
    maxHeight: '30%',
  },
  menuOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuIcon: {
    width: 24,
    height: 24,
    marginRight: 15,
    resizeMode: 'contain',
  },
  menuOptionText: {
    fontSize: 18,
    color: '#000',
    fontWeight: '500',
  },
});

export default OuterTripDashboard;
