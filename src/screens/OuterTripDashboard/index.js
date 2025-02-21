import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, Image, Modal, TextInput, Linking } from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { APP_ICONS } from '../../utils/icons'; // Import the common Icon utility

const OuterTripDashboard = ({ navigation }) => {
  const [isOnline, setIsOnline] = useState(false);
  const [isTripDetailsModalVisible, setTripDetailsModalVisible] = useState(false);
  const [isCancelTripModalVisible, setCancelTripModalVisible] = useState(false);
  const [isVerifyOTPModalVisible, setVerifyOTPModalVisible] = useState(false);
  const [isBookingRequestModalVisible, setBookingRequestModalVisible] = useState(true);
  const [isReachButtonVisible, setIsReachButtonVisible] = useState(false);
  const [isStartTripButtonVisible, setIsStartTripButtonVisible] = useState(false);
  const [isTripStarted, setIsTripStarted] = useState(false);
  const [isMenuModalVisible, setIsMenuModalVisible] = useState(false); // New state for menu modal
  const [selectedReason, setSelectedReason] = useState(null); // To track the selected reason
  const [previousModal, setPreviousModal] = useState(null);
  const [isEndTripModalVisible, setEndTripModalVisible] = useState(false);
  const [isConfirmationAlertVisible, setConfirmationAlertVisible] = useState(false);

  const toggleStatus = () => {
    setIsOnline(!isOnline);
  };

  const handleAcceptBooking = () => {
    setBookingRequestModalVisible(false); // Hide Booking Request modal
    setIsReachButtonVisible(true); // Show Reach button
  };

  const handleSkipBooking = () => {
    setBookingRequestModalVisible(false); // Hide Booking Request modal
  };

  const handleReachCustomer = () => {
    // Simulate navigation to Google Maps
    const customerLocation = "https://www.google.com/maps/dir/?api=1&destination=Customer+Location";
    Linking.openURL(customerLocation).then(() => {
      setIsReachButtonVisible(false); // Hide Reach button
      setIsStartTripButtonVisible(true); // Show Start Trip button
    });
  };

  const handleStartTrip = () => {
    setIsStartTripButtonVisible(false); // Hide Start Trip button
    setIsTripStarted(true); // Mark trip as started
    setTripDetailsModalVisible(true); // Show Trip Details modal
  };

  const handleTripDetailsComplete = () => {
    setTripDetailsModalVisible(false); // Close the Trip Details modal
    setVerifyOTPModalVisible(true); // Show OTP modal
  };

  const handleVerifyOTP = () => {
    setVerifyOTPModalVisible(false); // Hide OTP modal
    setEndTripModalVisible(true); // Show End Trip modal
  };

  const openTripDetailsModal = () => {
    setPreviousModal('bookingRequest'); // Set the previous modal
    setTripDetailsModalVisible(true);
    setBookingRequestModalVisible(false);
  };

  const openCancelTripModal = () => {
    setPreviousModal('tripDetails'); // Set the previous modal
    setCancelTripModalVisible(true);
    setTripDetailsModalVisible(false);
  };

  const openVerifyOTPModal = () => {
    setPreviousModal('tripDetails'); // Set the previous modal
    setVerifyOTPModalVisible(true);
    setTripDetailsModalVisible(false);
  };

  const toggleCancelTripModal = () => {
    setCancelTripModalVisible(!isCancelTripModalVisible);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Map View */}
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={{
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      />

      {/* Settings Icon (Top Left) */}
      <TouchableOpacity
        style={styles.settingsButton}
        onPress={() => navigation.navigate('Settings')}
      >
        <Image source={APP_ICONS.MENU} style={styles.icon} />
      </TouchableOpacity>

      {/* Menu Icon (Top Right) */}
      <TouchableOpacity
        style={styles.menuButton}
        onPress={() => setIsMenuModalVisible(true)} // Open the menu modal
      >
        <Image source={APP_ICONS.MENU_DOTS} style={styles.icon} />
      </TouchableOpacity>

      {/* Online/Offline Toggle Button (Bottom Left) */}
      <View style={styles.leftBottomContainer}>
        <TouchableOpacity style={styles.statusButton} onPress={toggleStatus}>
          <Text style={styles.statusText}>{isOnline ? 'Online' : 'Offline'}</Text>
          <View style={[styles.statusIndicator, { backgroundColor: isOnline ? 'green' : 'red' }]} />
        </TouchableOpacity>
      </View>

      {/* Fixed "Outer Trip" Text at Center Top */}
      <View style={styles.localTripContainer}>
        <Text style={styles.localTripText}>Outer Trip</Text>
      </View>

      {/* Menu Modal */}
      <Modal
        transparent={true}
        visible={isMenuModalVisible}
        onRequestClose={() => setIsMenuModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.menuModalContainer}>
            {/* Sync Option */}
            <TouchableOpacity
              style={styles.menuOption}
              onPress={() => {
                setIsMenuModalVisible(false); // Close the modal
                // Add Sync functionality here
              }}
            >
              <Image source={APP_ICONS.SYNC} style={styles.menuIcon} />
              <Text style={styles.menuOptionText}>Sync</Text>
            </TouchableOpacity>

            {/* SOS Option */}
            <TouchableOpacity
              style={styles.menuOption}
              onPress={() => {
                setIsMenuModalVisible(false); // Close the modal
                // Add SOS functionality here
              }}
            >
              <Image source={APP_ICONS.SOS} style={styles.menuIcon} />
              <Text style={styles.menuOptionText}>SOS</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Booking Request Modal */}
      <Modal
        transparent={true}
        visible={isBookingRequestModalVisible}
        onRequestClose={() => setBookingRequestModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.bookingRequestModalContainer}>
            {/* Back Button */}
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => {
                setBookingRequestModalVisible(false);
              }}
            >
              {/* <Image source={APP_ICONS.BACK} style={styles.backIcon} /> */}
            </TouchableOpacity>

            {/* Skip Button (Top Right) */}
            <TouchableOpacity style={styles.skipButton} onPress={handleSkipBooking}>
              <Text style={styles.skipButtonText}>Skip</Text>
            </TouchableOpacity>

            {/* Modal Header */}
            <Text style={styles.modalHeader}>Booking Request</Text>

            {/* Booking Information */}
            <View style={styles.bookingInfoContainer}>
              {/* Outer Trip */}
              <View style={styles.bookingInfoRow}>
                <View style={[styles.iconBox, { backgroundColor: '#28a745' }]}></View>
                <Text style={styles.bookingInfoText1}>Outer Trip</Text>
              </View>

              {/* Fare */}
              <View style={styles.bookingInfoRow}>
                <View style={[styles.iconBox, { backgroundColor: '#ff4444' }]}></View>
                <Text style={styles.bookingInfoText}>$217.86</Text>
              </View>

              {/* Distance and Payment Mode */}
              <View style={styles.bookingInfoRow}>
                <Text style={styles.bookingInfoText}>0.1 Km/Cash</Text>
              </View>

              {/* Pickup Location with Background */}
              <View style={[styles.bookingInfoRow, styles.locationBackground]}>
                <View style={[styles.iconBox, { backgroundColor: '' }]}>
                  <Image source={APP_ICONS.CIRCLE_GREEN} style={styles.bookingIcon} />
                </View>
                <Text style={styles.bookingInfoText}>Coimbatore International Airport,</Text>
              </View>

              {/* Pickup Time */}
              <View style={styles.bookingInfoRow}>
                <Text style={styles.bookingInfoText}>21 Jun 2024, 03:41 PM</Text>
              </View>

              {/* Drop Location with Background */}
              <View style={[styles.bookingInfoRow, styles.locationBackground]}>
                <View style={[styles.iconBox, { backgroundColor: '' }]}>
                  <Image source={APP_ICONS.CIRCLE_RED} style={styles.bookingIcon} />
                </View>
                <Text style={styles.bookingInfoText}>Gandhipuram New Bus Stand</Text>
              </View>

              {/* Remaining Bids */}
              <View style={styles.bookingInfoRow}>
                <Text style={styles.bookingInfoText}>Remaining Bids: 03</Text>
              </View>
            </View>

            {/* Accept Booking Button */}
            <TouchableOpacity style={styles.acceptBookingButton} onPress={handleAcceptBooking}>
              <Text style={styles.acceptBookingButtonText}>ACCEPT BOOKING</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Reach Button */}
      {isReachButtonVisible && (
        <View style={styles.reachButtonContainer}>
          <TouchableOpacity style={styles.reachButton} onPress={handleReachCustomer}>
            <Text style={styles.reachButtonText}>Reach</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Start Trip Button */}
      {isStartTripButtonVisible && (
        <View style={styles.startTripContainer}>
          <TouchableOpacity style={styles.startTripButton} onPress={handleStartTrip}>
            <Text style={styles.startTripButtonText}>Start Trip</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Trip Details Modal */}
      <Modal
        transparent={true}
        visible={isTripDetailsModalVisible}
        onRequestClose={() => setTripDetailsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.tripDetailsModalContainer}>
            {/* Back Button */}
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
            {/* Modal Header */}
            <Text style={styles.tripDetailsHeader}>Trip Info</Text>

            {/* Trip Details Button */}
            <TouchableOpacity
              style={styles.tripDetailsButton}
              onPress={() => {
                setTripDetailsModalVisible(false); // Close the modal before navigating
                navigation.navigate('TripCompleteDetails', {
                  onGoBack: () => setTripDetailsModalVisible(true), // Callback to reopen the modal
                });
              }}
            >
              <Image source={APP_ICONS.INFO} style={styles.buttonIcon} />
              <Text style={styles.tripDetailsButtonText}>Trip Details</Text>
            </TouchableOpacity>

            {/* Cancel Trip Button */}
            <TouchableOpacity
              style={styles.cancelTripButtonInModal}
              onPress={() => setCancelTripModalVisible(true)} // Open the Cancel Trip Modal
            >
              <Image source={APP_ICONS.CANCEL} style={styles.buttonIcon} />
              <Text style={styles.cancelTripButtonText}>Cancel Trip</Text>
            </TouchableOpacity>

            {/* Next Button to Proceed to OTP Verification */}
            <TouchableOpacity
              style={styles.nextButton}
              onPress={handleTripDetailsComplete} // Proceed to OTP verification
            >
              <Text style={styles.nextButtonText}>Next</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Cancel Trip Modal */}
      <Modal
        transparent={true}
        visible={isCancelTripModalVisible}
        onRequestClose={() => setCancelTripModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.cancelTripModalContainer}>
            {/* Back Button */}
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

            {/* Modal Header */}
            <Text style={styles.cancelTripModalHeader}>Cancel Trip - Reason</Text>
            <Text style={styles.cancelTripModalSubHeader}>
              To Confirm the reason VijayConnect Team Will Reach you over Phone call
            </Text>

            {/* Reason Options */}
            <TouchableOpacity
              style={[
                styles.reasonButton,
                selectedReason === 'No response' && styles.selectedReasonButton, // Highlight if selected
              ]}
              onPress={() => setSelectedReason('No response')}
            >
              <Text style={styles.reasonButtonText}>No response</Text>
              {selectedReason === 'No response' && (
                <Image source={APP_ICONS.CHECKMARK} style={styles.checkmarkIcon} /> // Show checkmark if selected
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.reasonButton,
                selectedReason === 'Request to cancel' && styles.selectedReasonButton, // Highlight if selected
              ]}
              onPress={() => setSelectedReason('Request to cancel')}
            >
              <Text style={styles.reasonButtonText}>Request to cancel</Text>
              {selectedReason === 'Request to cancel' && (
                <Image source={APP_ICONS.CHECKMARK} style={styles.checkmarkIcon} /> // Show checkmark if selected
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.reasonButton,
                selectedReason === 'Time change' && styles.selectedReasonButton, // Highlight if selected
              ]}
              onPress={() => setSelectedReason('Time change')}
            >
              <Text style={styles.reasonButtonText}>Time change</Text>
              {selectedReason === 'Time change' && (
                <Image source={APP_ICONS.CHECKMARK} style={styles.checkmarkIcon} /> // Show checkmark if selected
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.reasonButton,
                selectedReason === 'Others' && styles.selectedReasonButton, // Highlight if selected
              ]}
              onPress={() => setSelectedReason('Others')}
            >
              <Text style={styles.reasonButtonText}>Others</Text>
              {selectedReason === 'Others' && (
                <>
                  <Image source={APP_ICONS.CHECKMARK} style={styles.checkmarkIcon} /> {/* Show checkmark if selected */}
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
                setCancelTripModalVisible(false); // Close the modal
              }}
            >
              <Text style={styles.submitButtonText}>Submit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Verify OTP Modal */}
      <Modal
        transparent={true}
        visible={isVerifyOTPModalVisible}
        onRequestClose={() => setVerifyOTPModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.verifyOTPModalContainer}>
            {/* Back Button */}
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
            <Text style={styles.modalSubHeader}>Please Enter the OTP Sent to your Phone</Text>

            {/* OTP Input Field */}
            <TextInput
              style={styles.otpInput}
              placeholder="Enter OTP"
              placeholderTextColor="#999"
              keyboardType="number-pad"
            />

            {/* Cancel and Verify Buttons */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setVerifyOTPModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.verifyButton}
                onPress={handleVerifyOTP}
              >
                <Text style={styles.verifyButtonText}>Verify</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* End Trip Modal */}
      <Modal
        transparent={true}
        visible={isEndTripModalVisible}
        onRequestClose={() => setEndTripModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.endTripModalContainer}>
            {/* Driver Name */}
            <Text style={styles.endTripModalHeader}>Krish</Text>

            {/* Trip Details with Light Gray Background */}
            <View style={styles.tripDetailsContainer}>
              <Text style={styles.tripDetailText}>Oh 0m / 0.0 Kms / $217.86</Text>
            </View>

            {/* End Trip Button */}
            <TouchableOpacity
              style={styles.endTripButton}
              onPress={() => setConfirmationAlertVisible(true)} // Open the confirmation alert
            >
              <Text style={styles.endTripButtonText}>End Trip</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Confirmation Alert Modal */}
      <Modal
        transparent={true}
        visible={isConfirmationAlertVisible}
        onRequestClose={() => setConfirmationAlertVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.confirmationAlertContainer}>
            {/* Confirmation Message */}
            <Text style={styles.confirmationAlertText}>Are you sure you want to End the Trip?</Text>

            {/* Cancel and End Trip Buttons */}
            <View style={styles.confirmationButtonContainer}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setConfirmationAlertVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={() => {
                  setConfirmationAlertVisible(false); // Close the confirmation alert
                  navigation.navigate('OuterTripCompletedDetails'); // Navigate to Trip Completed Screen
                }}
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
    backgroundColor: '#e0f7fa', // Light blue background for selected option
  },
  checkmarkIcon: {
    width: 16,
    height: 16,
    marginLeft: 10,
    tintColor: '#007BFF', // Blue color for the checkmark
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
  locationBackground: {
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
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
    // alignItems: 'center',
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
  bookingIcon: {
    width: 16,
    height: 16,
    marginRight: 10,
  },
  bookingInfoText1: {
    paddingLeft: 90,
    fontSize: 20,
    color: '#000',
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
  callCustomerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 5,
    width: '100%',
    marginBottom: 10,
  },
  callCustomerButtonText: {
    color: 'white',
    fontSize: 18,
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
    shadowOffset: { width: 0, height: -2 },
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
    width: '100%',
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
  cancelButton: {
    backgroundColor: '#ccc',
    padding: 15,
    borderRadius: 10,
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
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

  // sos cs
  menuModalContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20, // Rounded corners at the top
    borderTopRightRadius: 20,
    padding: 20,
    width: '100%', // Full width
    maxHeight: '30%', // Adjust height as needed
  },
  menuOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15, // Vertical padding for each option
    borderBottomWidth: 1, // Add a separator line
    borderBottomColor: '#f0f0f0', // Light gray separator
  },
  menuIcon: {
    width: 24,
    height: 24,
    marginRight: 15, // Space between icon and text
    resizeMode: 'contain',
  },
  menuOptionText: {
    fontSize: 18,
    color: '#000', // Black text
    fontWeight: '500', // Medium font weight
  },
});

export default OuterTripDashboard;