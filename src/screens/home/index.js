import React, {useEffect, useRef, useState} from 'react';
import {View, Text, StyleSheet, Platform} from 'react-native';
import CustomScreenHeader from '../../components/screenHeader';
import {APP_ICONS} from '../../utils/icons';
import {useDispatch, useSelector} from 'react-redux';
import {openDrawerMenu} from '../../components/drawerMenu/reducers';
import MapView, {Marker, Polyline} from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import {request, check, PERMISSIONS, RESULTS} from 'react-native-permissions';
import BottomSheet from '../../components/bottomSheet';
import BottomSheetHome from '../../components/bottomSheet/components/bottomSheetHome';
import RideConfirmed from '../../components/rideConfirmed';

const GOOGLE_MAPS_API_KEY = 'AIzaSyAMmOqwt1mf0NH76osHrZCaKzuqE6H707g';

const HomeScreen = () => {
  const dispatch = useDispatch();
  const {driverConnected} = useSelector(state => state.bookingConfirmation);
  const mapRef = useRef(null);
  const [region, setRegion] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [bottomSheeVisiblity, setBottomSheeVisiblity] = useState(true);
  const [isFromLocation, setIsFromLocation] = useState(true);
  const [fromLocationData, setFromLocationData] = useState(null);
  const [fromLocation, setFromLocation] = useState(null);
  const [toLocationData, setToLocationData] = useState(null);
  const [toLocation, setToLocation] = useState(null);
  const [renderSearch, setRenderSearch] = useState(false);
  const [routeCoordinates, setRouteCoordinates] = useState([]);

  const openSideDrawer = () => {
    dispatch(openDrawerMenu());
  };

  const requestLocationPermission = async () => {
    try {
      const permissionStatus =
        Platform.OS === 'ios'
          ? await check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE)
          : await check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);

      if (permissionStatus !== RESULTS.GRANTED) {
        const requestStatus =
          Platform.OS === 'ios'
            ? await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE)
            : await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);

        if (requestStatus !== RESULTS.GRANTED) {
          console.log('Location permission denied');
          return false;
        }
      }
      return true;
    } catch (error) {
      console.error('Error checking/requesting location permission:', error);
      return false;
    }
  };

  const getLocation = async () => {
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) {
      return;
    }

    Geolocation.getCurrentPosition(
      position => {
        const {latitude, longitude} = position.coords;
        setRegion({
          latitude,
          longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
        setCurrentLocation({latitude, longitude});
        setFromLocation({latitude, longitude});
      },
      error => console.error('Error fetching current position:', error),
      {enableHighAccuracy: true},
    );
  };

  useEffect(() => {
    const fetchLocation = async () => {
      await getLocation();
    };
    fetchLocation();
  }, []);

  useEffect(() => {
    if (fromLocation && toLocation) {
      fetchRoute(fromLocation, toLocation);
    }
  }, [fromLocation, toLocation]);

  const fetchRoute = async (origin, destination) => {
    try {
      const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin.latitude},${origin.longitude}&destination=${destination.latitude},${destination.longitude}&key=${GOOGLE_MAPS_API_KEY}&mode=driving`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      if (data.routes && data.routes.length > 0) {
        const points = decodePolyline(data.routes[0].overview_polyline.points);
        setRouteCoordinates(points);
        mapRef.current.fitToCoordinates(points, {
          edgePadding: {top: 50, right: 50, bottom: 50, left: 50},
          animated: true,
        });
      } else {
        console.error('No routes found in the API response');
        setRouteCoordinates([]);
      }
    } catch (error) {
      console.error('Error fetching route:', error);
    }
  };

  const decodePolyline = t => {
    if (!t) {
      console.warn('Invalid polyline string');
      return [];
    }
    let points = [];
    let index = 0,
      len = t.length;
    let lat = 0,
      lng = 0;

    while (index < len) {
      let b,
        shift = 0,
        result = 0;
      do {
        b = t.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      let dlat = (result & 1) !== 0 ? ~(result >> 1) : result >> 1;
      lat += dlat;

      shift = 0;
      result = 0;
      do {
        b = t.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      let dlng = (result & 1) !== 0 ? ~(result >> 1) : result >> 1;
      lng += dlng;

      points.push({latitude: lat / 1e5, longitude: lng / 1e5});
    }

    return points;
  };

  const handlePlaceSelection = (data, details) => {
    setRenderSearch(false);

    if (details?.geometry?.location) {
      const {lat, lng} = details.geometry.location;

      const location = {
        latitude: lat,
        longitude: lng,
      };

      if (isFromLocation) {
        setFromLocationData(data.description);
        setFromLocation(location);
      } else {
        setToLocationData(data.description);
        setToLocation(location);
      }

      setRegion({
        latitude: lat,
        longitude: lng,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    } else {
      console.warn('No geometry location found in details.');
    }
  };

  const fromLocationPress = () => {
    setIsFromLocation(true);
    setRenderSearch(true);
  };

  const toLocationPress = () => {
    setIsFromLocation(false);
    setRenderSearch(true);
  };

  const renderBody = () => {
    if (renderSearch) {
      return (
        <View style={{flex: 1}}>
          <GooglePlacesAutocomplete
            placeholder={
              isFromLocation ? 'Search From Location' : 'Search To Location'
            }
            fetchDetails={true}
            onPress={handlePlaceSelection}
            enablePoweredByContainer={false}
            query={{
              key: GOOGLE_MAPS_API_KEY,
              language: 'en',
            }}
            styles={{
              container: styles.searchBarContainer,
              textInput: styles.searchBarInput,
              listView: {zIndex: 1000},
            }}
            debounce={200}
          />
        </View>
      );
    } else {
      return (
        <View style={{flex: 1}}>
          <View style={styles.mapContainer}>
            <MapView
              style={styles.map}
              region={region}
              provider="google"
              ref={mapRef}>
              {fromLocation && (
                <Marker
                  coordinate={fromLocation}
                  title="From Location"
                  icon={APP_ICONS.CIRCLE_GREEN}
                  // pinColor="green"
                />
              )}
              {toLocation && (
                <Marker
                  coordinate={toLocation}
                  title="To Location"
                  icon={APP_ICONS.CIRCLE_RED}

                  // pinColor="red"
                />
              )}
              {routeCoordinates.length > 0 && (
                <Polyline
                  coordinates={routeCoordinates}
                  strokeColor="blue"
                  strokeWidth={3}
                />
              )}
            </MapView>
          </View>
          {!driverConnected && (
            <BottomSheet visible={bottomSheeVisiblity}>
              <BottomSheetHome
                fromLocationData={fromLocationData}
                fromLocationOnPress={fromLocationPress}
                toLocationData={toLocationData}
                toLocationOnPress={toLocationPress}
              />
            </BottomSheet>
          )}
        </View>
      );
    }
  };

  return (
    <View style={styles.container}>
      {driverConnected && <RideConfirmed />}
      <CustomScreenHeader
        leadingIcon={APP_ICONS.HAMBURGER}
        onLeadingIconPress={openSideDrawer}
        title="LANDING SCREEN"
        titleStyle={styles.headerTitle}
      />
      {renderBody()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mapContainer: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  searchBarContainer: {
    position: 'absolute',
    top: 10,
    width: '90%',
    alignSelf: 'center',
    zIndex: 1000,
  },
  searchBarInput: {
    height: 40,
    borderRadius: 10,
    backgroundColor: 'white',
    paddingHorizontal: 10,
    fontSize: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default HomeScreen;
