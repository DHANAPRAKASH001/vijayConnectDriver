import React, { useEffect, useState, useRef } from 'react';
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
  PermissionsAndroid,
  Platform,
} from 'react-native';
import Geolocation from '@react-native-community/geolocation'; // or 'react-native-geolocation-service'
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import { APP_ICONS } from '../../utils/icons';
import { moderateScale } from 'react-native-size-matters';

/************************************************************
 * Helper: Haversine distance (in meters)
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

const OuterTripDashboard = ({ navigation }) => {
  /******************************************************************
   * STATES
   ******************************************************************/
  const [isOnline, setIsOnline] = useState(false);
  const [isTripStarted, setIsTripStarted] = useState(false);

  // Storing token in state
  const [token, setToken] = useState(
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZW51bWJlciI6Ijk4NzY1NDMyMTAiLCJzdWIiOjEsImlhdCI6MTc0MjA1Njc2OSwiZXhwIjoxNzU3NjA4NzY5fQ.gj_PwCRGssIe-uVhOg5JngbYC7ikqkHVBFH-5BmGqIU'
  );

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
  const [isConfirmationAlertVisible, setConfirmationAlertVisible] =
    useState(false);
  const [isMenuModalVisible, setIsMenuModalVisible] = useState(false);

  // We don’t actually display a separate “EndTripModal” now, so removing isEndTripModalVisible
  // (We use the confirmation alert to handle end-trip flow.)

  // Cancel Trip reason
  const [selectedReason, setSelectedReason] = useState(null);
  const [previousModal, setPreviousModal] = useState(null);

  // Interval Refs
  const rideCheckIntervalRef = useRef(null);
  const driverLocationIntervalRef = useRef(null);

  // **Driver** location (initially set to some default)
  const [driverLat, setDriverLat] = useState(12.345);
  const [driverLng, setDriverLng] = useState(67.89);

  // **Booking** location (could come from the server; for now, fixed)
  const [bookingLat] = useState(12.355);
  const [bookingLng] = useState(67.895);

  // Track if we've shown the "reached" alert
  const [hasReachedSpot, setHasReachedSpot] = useState(false);

  // Ride data
  const [availableRides, setAvailableRides] = useState([]);

  /******************************************************************
   * ON MOUNT - Request Permission & Start Watch
   ******************************************************************/
  useEffect(() => {
    requestLocationPermissionAndWatch();
  }, []);

  const requestLocationPermissionAndWatch = async () => {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          Alert.alert('Error', 'Location permission denied.');
          return;
        }
      }
      // iOS or granted => start watching device location
      watchDriverPosition();
    } catch (err) {
      console.error('Location permission error:', err);
    }
  };

  const watchDriverPosition = () => {
    Geolocation.watchPosition(
      position => {
        // Update driver coords in real-time
        setDriverLat(position.coords.latitude);
        setDriverLng(position.coords.longitude);
      },
      error => {
        console.warn('Watch position error:', error);
      },
      {
        enableHighAccuracy: true,
        distanceFilter: 0, // update on every small movement
        interval: 5000,
        fastestInterval: 2000,
      }
    );
  };

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
  const startRideCheckInterval = () => {
    stopRideCheckInterval();
    console.log('Starting 10s interval to poll for rides...');

    rideCheckIntervalRef.current = setInterval(async () => {
      // 1) Update driver location => /driver-location (PUT)
      try {
        if (!token) {
          Alert.alert('Error', 'Authorization token is missing.');
          return;
        }

        const rawBody = {
          latitude: driverLat,
          longitude: driverLng,
          isAvailable: true,
        };

        const updateLocationResponse = await fetch(
          'http://52.66.69.48:4000/driver-location',
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(rawBody),
          }
        );

        const updateLocData = await updateLocationResponse.json();
        console.log(
          `PUT /driver-location => status: ${updateLocationResponse.status}`,
          updateLocData
        );

        if (updateLocationResponse.status !== 200) {
          throw new Error(
            updateLocData.message ||
              'Unexpected error updating driver location.'
          );
        }
      } catch (error) {
        console.error('❌ Failed to update driver location:', error);
        // Optionally show an alert or simply return
        return;
      }

      // 2) Now fetch available rides => /driver-location/available_rides (GET)
      try {
        if (!token) {
          Alert.alert('Error', 'Authorization token is missing.');
          return;
        }

        const availableRidesResponse = await fetch(
          'http://52.66.69.48:4000/driver-location/available_rides',
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const ridesData = await availableRidesResponse.json();
        console.log(
          `GET /driver-location/available_rides => status: ${availableRidesResponse.status}`,
          ridesData
        );

        if (
          availableRidesResponse.status !== 200 ||
          !ridesData ||
          ridesData.length === 0
        ) {
          console.log('🚨 No available rides found or error from API.');
          setBookingRequestModalVisible(false);
          return;
        }

        // If we do have a ride:
        setAvailableRides(ridesData[0]);
        setBookingRequestModalVisible(true);
      } catch (error) {
        console.error('❌ Failed to fetch available rides:', error);
      }
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
  const handleAcceptBooking = async () => {
    console.log('Attempting to accept booking...');

    if (!token) {
      Alert.alert('Error', 'Authorization token is missing.');
      return;
    }

    try {
      const response = await fetch(
        'http://52.66.69.48:4000/available-rides/accept',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ id: availableRides.id }),
        }
      );

      const data = await response.json();
      console.log('Accept booking => status:', response.status, data);

      // This endpoint might return 200 or 201, depending on your API
      if (response.status !== 201) {
        throw new Error(
          data.message || 'Something went wrong while accepting booking.'
        );
      }

      console.log('Booking accepted successfully.');

      // Once accepted, hide the request modal, show "Reach" button
      setBookingRequestModalVisible(false);
      setIsReachButtonVisible(true);
      setHasReachedSpot(false);

      // Stop polling for new rides
      stopRideCheckInterval();

      // Start pushing driver location every 5 seconds
      startDriverLocationInterval();
    } catch (error) {
      console.error('Error accepting booking:', error);
      Alert.alert('Error', error.message || 'Please try again.');
    }
  };

  const handleSkipBooking = () => {
    console.log('Driver skipped the booking.');
    setBookingRequestModalVisible(false);
    // Keep the 10-second interval if still online
  };

  /******************************************************************
   * DRIVER LOCATION INTERVAL (EVERY 5 SECONDS)
   * We ONLY use this to push location to the server every 5s
   * (Driver lat/lng is updated from watchPosition in real-time.)
   ******************************************************************/
  const startDriverLocationInterval = () => {
    stopDriverLocationInterval(); // clear old intervals if any
    console.log('Starting 5s driver-location interval...');

    driverLocationIntervalRef.current = setInterval(() => {
      // 1) "Send" location to the API
      console.log('Sending driver location =>', driverLat, driverLng);

      // 2) Optionally check distance to booking
      const distance = getDistanceFromLatLonInM(
        driverLat,
        driverLng,
        bookingLat,
        bookingLng
      );
      if (distance < 100 && !hasReachedSpot) {
        setHasReachedSpot(true);
        setIsReachButtonVisible(false);
        setIsStartTripButtonVisible(true);
        Alert.alert(
          'Booking spot reached',
          'You have arrived at the booking spot.'
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
   * REACH CUSTOMER -> START TRIP
   ******************************************************************/
  const handleReachCustomer = () => {
    console.log('Driver is heading to customer => opening Google Maps.');
    const url =
      'https://www.google.com/maps/dir/?api=1&destination=Customer+Location';
    Linking.openURL(url).then(() => {
      setIsReachButtonVisible(false);
      setIsStartTripButtonVisible(true);
    });
  };

  const handleStartTrip = async () => {
    console.log('Attempting to start trip...');

    if (!token) {
      Alert.alert('Error', 'Authorization token is missing.');
      return;
    }

    try {
      const response = await fetch(
        `http://52.66.69.48:4000/available-rides/start/${availableRides.id}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      console.log('Start trip => status:', response.status, data);

      if (response.status !== 201) {
        throw new Error(
          data.message || 'Something went wrong while starting the trip.'
        );
      }

      console.log('Trip started successfully.');

      setIsStartTripButtonVisible(false);
      setIsTripStarted(true);
      setTripDetailsModalVisible(true);
    } catch (error) {
      console.error('Error starting trip:', error);
      Alert.alert('Error', error.message || 'Please try again.');
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
    console.log('OTP verified => next is End Trip confirmation.');
    setVerifyOTPModalVisible(false);
    // We reuse the single confirmation modal for end trip after OTP
    setConfirmationAlertVisible(true);
  };

  /******************************************************************
   * CANCEL TRIP
   ******************************************************************/
  const openCancelTripModal = () => {
    setPreviousModal('tripDetails');
    setCancelTripModalVisible(true);
    setTripDetailsModalVisible(false);
  };

  const toggleCancelTripModal = () => {
    setCancelTripModalVisible(!isCancelTripModalVisible);
  };

  /******************************************************************
   * END TRIP
   ******************************************************************/
  const handleEndTripBtn = async confirm => {
    // If user tapped "Cancel" on the confirmation
    if (!confirm) {
      setConfirmationAlertVisible(false);
      return;
    }

    console.log('Attempting to end trip...');
    setConfirmationAlertVisible(false);

    if (!token) {
      Alert.alert('Error', 'Authorization token is missing.');
      return;
    }

    try {
      const response = await fetch(
        `http://52.66.69.48:4000/available-rides/end/${availableRides.id}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      console.log('End trip => status:', response.status, data);

      if (response.status !== 201) {
        throw new Error(
          data.message || 'Something went wrong while ending the trip.'
        );
      }

      console.log('Trip ended successfully.');

      // Cleanup local state
      setIsTripStarted(false);
      stopDriverLocationInterval();

      // If still online, resume ride-check polling
      if (isOnline) startRideCheckInterval();

      // Navigate to "Trip Completed" screen, pass the ride fare
      navigation.navigate('OuterTripCompletedDetails', {
        amount: availableRides?.estimatedFair,
      });
    } catch (error) {
      console.error('Error ending trip:', error);
      Alert.alert('Error', error.message || 'Please try again.');
    }
  };

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
        // Keep the map region centered on the driver's latest coords
        region={{
          latitude: driverLat,
          longitude: driverLng,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        }}
      >
        {/* Driver Marker */}
        <Marker
          coordinate={{ latitude: driverLat, longitude: driverLng }}
          title="Driver"
          description="Your current position"
        >
          <Image source={APP_ICONS.CAR} style={{ width: 30, height: 30 }} />
        </Marker>

        {/* Booking Spot Marker */}
        <Marker
          coordinate={{ latitude: bookingLat, longitude: bookingLng }}
          title="Booking Spot"
          description="Where you need to go"
          pinColor="green"
        />
      </MapView>

      {/* Settings Icon (Top Left) */}
      <TouchableOpacity
        style={styles.settingsButton}
        onPress={() => navigation.navigate('Settings')}
      >
        <Image source={APP_ICONS.MENU} style={styles.icon} />
      </TouchableOpacity>

      {/* Menu (Top Right) */}
      <TouchableOpacity
        style={styles.menuButton}
        onPress={() => setIsMenuModalVisible(true)}
      >
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
              { backgroundColor: isOnline ? 'green' : 'red' },
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
        onRequestClose={() => setIsMenuModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.menuModalContainer}>
            {/* Sync Option */}
            <TouchableOpacity
              style={styles.menuOption}
              onPress={() => {
                setIsMenuModalVisible(false);
                console.log('Sync clicked...');
              }}
            >
              <Image source={APP_ICONS.SYNC} style={styles.menuIcon} />
              <Text style={styles.menuOptionText}>Sync</Text>
            </TouchableOpacity>

            {/* SOS Option */}
            <TouchableOpacity
              style={styles.menuOption}
              onPress={() => {
                setIsMenuModalVisible(false);
                console.log('SOS clicked...');
              }}
            >
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
        onRequestClose={() => setBookingRequestModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.bookingRequestModalContainer}>
            {/* Skip Button */}
            <TouchableOpacity
              style={styles.skipButton}
              onPress={handleSkipBooking}
            >
              <Text style={styles.skipButtonText}>Skip</Text>
            </TouchableOpacity>

            <Text style={styles.modalHeader}>Booking Request</Text>

            <View style={styles.bookingInfoContainer}>
              <View style={styles.bookingInfoRow}>
                <Text style={styles.bookingInfoText}>Outer Trip</Text>
              </View>
              <View style={styles.bookingInfoRow}>
                <Text style={styles.bookingInfoText}>
                  {`${availableRides?.estimatedFair || ''} / ${
                    availableRides?.distance || ''
                  }`}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.acceptBookingButton}
              onPress={handleAcceptBooking}
            >
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
          <TouchableOpacity style={styles.reachButton} onPress={handleReachCustomer}>
            <Text style={styles.reachButtonText}>Reach</Text>
          </TouchableOpacity>
        </View>
      )}

      {isStartTripButtonVisible && (
        <View style={styles.startTripContainer}>
          <TouchableOpacity style={styles.startTripButton} onPress={handleStartTrip}>
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
        onRequestClose={() => setTripDetailsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.tripDetailsModalContainer}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => {
                setTripDetailsModalVisible(false);
                if (previousModal === 'bookingRequest') {
                  setBookingRequestModalVisible(true);
                }
              }}
            >
              <Image source={APP_ICONS.BACK} style={styles.backIcon} />
            </TouchableOpacity>

            <Text style={styles.tripDetailsHeader}>Trip Info</Text>

            <TouchableOpacity
              style={styles.tripDetailsButton}
              onPress={() => {
                setTripDetailsModalVisible(false);
                navigation.navigate('TripCompleteDetails', {
                  onGoBack: () => setTripDetailsModalVisible(true),
                });
              }}
            >
              <Image source={APP_ICONS.INFO} style={styles.buttonIcon} />
              <Text style={styles.tripDetailsButtonText}>Trip Details</Text>
            </TouchableOpacity>

            {/* Example of a “Cancel Trip” flow, if needed */}
            {/*
            <TouchableOpacity
              style={styles.cancelTripButtonInModal}
              onPress={() => openCancelTripModal()}
            >
              <Image source={APP_ICONS.CANCEL} style={styles.buttonIcon} />
              <Text style={styles.cancelTripButtonText}>Cancel Trip</Text>
            </TouchableOpacity>
            */}

            <TouchableOpacity
              style={styles.nextButton}
              onPress={handleTripDetailsComplete}
            >
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
        onRequestClose={() => setCancelTripModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.cancelTripModalContainer}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => {
                setCancelTripModalVisible(false);
                if (previousModal === 'tripDetails') {
                  setTripDetailsModalVisible(true);
                }
              }}
            >
              <Image source={APP_ICONS.BACK} style={styles.backIcon} />
            </TouchableOpacity>

            <Text style={styles.cancelTripModalHeader}>Cancel Trip - Reason</Text>
            <Text style={styles.cancelTripModalSubHeader}>
              To confirm the reason, our Team will reach you over Phone call
            </Text>

            <TouchableOpacity
              style={[
                styles.reasonButton,
                selectedReason === 'No response' && styles.selectedReasonButton,
              ]}
              onPress={() => setSelectedReason('No response')}
            >
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
              onPress={() => setSelectedReason('Request to cancel')}
            >
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
              onPress={() => setSelectedReason('Time change')}
            >
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
              onPress={() => setSelectedReason('Others')}
            >
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

            <TouchableOpacity
              style={styles.submitButton}
              onPress={() => {
                console.log('Selected Reason:', selectedReason);
                setCancelTripModalVisible(false);
                // Possibly call an API to actually cancel here
              }}
            >
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
        onRequestClose={() => setVerifyOTPModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.verifyOTPModalContainer}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => {
                setVerifyOTPModalVisible(false);
                if (previousModal === 'tripDetails') {
                  setTripDetailsModalVisible(true);
                }
              }}
            >
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
                onPress={() => setVerifyOTPModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.verifyButton} onPress={handleVerifyOTP}>
                <Text style={styles.verifyButtonText}>Verify</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/****************************************************************
        END TRIP BUTTON + CONFIRMATION
      ****************************************************************/}
      {isTripStarted && (
        <View
          style={{
            position: 'absolute',
            width: '100%',
            bottom: 10,
            alignItems: 'center',
          }}
        >
          <TouchableOpacity
            style={styles.endTripButton}
            onPress={() => setConfirmationAlertVisible(true)}
          >
            <Text style={styles.endTripButtonText}>End Trip</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* CONFIRMATION ALERT MODAL */}
      <Modal
        transparent
        visible={isConfirmationAlertVisible}
        onRequestClose={() => setConfirmationAlertVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.confirmationAlertContainer}>
            <Text style={styles.confirmationAlertText}>
              Are you sure you want to End the Trip?
            </Text>
            <View style={styles.confirmationButtonContainer}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => handleEndTripBtn(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={() => handleEndTripBtn(true)}
              >
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
 * STYLES
 ************************************************************************/
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  settingsButton: {
    position: 'absolute',
    top: 30,
    left: 20,
    padding: 10,
    backgroundColor: 'rgba(237, 230, 230, 0.9)',
    borderRadius: 20,
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
    shadowOffset: { width: 0, height: 2 },
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
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  /****** MENU ******/
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
  /****** BOOKING REQUEST ******/
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
    right: 10,
    top: 10,
    color: '#007bff',
    fontWeight: 'bold',
    backgroundColor: '#e6f3ff',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  skipButtonText: {
    fontSize: 16,
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
  /****** REACH / START TRIP ******/
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
  /****** TRIP DETAILS ******/
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
    width: '100%',
  },
  nextButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  /****** CANCEL TRIP ******/
  cancelTripModalContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    alignItems: 'center',
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
    width: '100%',
  },
  selectedReasonButton: {
    backgroundColor: '#e0f7fa',
  },
  reasonButtonText: {
    fontSize: 16,
    color: '#000',
  },
  checkmarkIcon: {
    width: 16,
    height: 16,
    marginLeft: 10,
    tintColor: '#007BFF',
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
    width: '100%',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  /****** VERIFY OTP ******/
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
  /****** END TRIP ******/
  endTripButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 10,
    width: '94%',
    alignItems: 'center',
    shadowColor: '#007bff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  endTripButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  /****** CONFIRMATION ******/
  confirmationAlertContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    width: '100%',
    position: 'absolute',
    bottom: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
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
});

export default OuterTripDashboard;
