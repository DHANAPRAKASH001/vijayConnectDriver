import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const PreferredCity = () => {
  const [selectedCity, setSelectedCity] = useState(null);
  const navigation = useNavigation();

  const cities = [
    { id: 1, name: 'Coimbatore' },
    { id: 2, name: 'Erode' },
    // { id: 3, name: 'Chennai' },
    // Add more cities as needed
  ];

  const handleCitySelect = (city) => {
    setSelectedCity(city);
  };

  const handleNext = () => {
    if (selectedCity) {
      console.log('Selected City:', selectedCity);
      // Navigate to the next screen or perform other actions
      navigation.navigate('RegisterProfile'); // Replace 'NextScreen' with your actual screen name
    } else {
      alert('Please select a city');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Preferred City</Text>
      <Text style={styles.subtitle}>Please choose the city you like to drive</Text>

      <ScrollView style={styles.citiesContainer}>
        {cities.map((city) => (
          <TouchableOpacity
            key={city.id}
            style={[
              styles.cityButton,
              selectedCity?.id === city.id && styles.selectedCityButton,
            ]}
            onPress={() => handleCitySelect(city)}
          >
            <Text style={styles.cityText}>{city.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
        <Text style={styles.nextButtonText}>Next</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  citiesContainer: {
    flex: 1,
  },
  cityButton: {
    padding: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 10,
  },
  selectedCityButton: {
    borderColor: '#007BFF',
    backgroundColor: '#e6f2ff',
  },
  cityText: {
    fontSize: 16,
  },
  nextButton: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PreferredCity;