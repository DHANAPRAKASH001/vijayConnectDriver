import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

const LanguageSelectionScreen = ({ navigation }) => {
  const [selectedLanguage, setSelectedLanguage] = useState(null);

  const languages = [
    { id: 1, name: 'English', code: 'en' },
    { id: 2, name: 'Tamil', code: 'es' },
    // Add more languages as needed
  ];

  const handleLanguageSelect = (language) => {
    setSelectedLanguage(language);
  };

  const handleNext = () => {
    if (selectedLanguage) {
      console.log('Selected Language:', selectedLanguage);
      // Navigate to the next screen or perform other actions
      navigation.navigate('PreferredCity'); // Replace 'NextScreen' with your actual screen name
    } else {
      alert('Please select a language');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Language</Text>
      <Text style={styles.subtitle}>Choose Your Preferred Language</Text>

      <ScrollView style={styles.languagesContainer}>
        {languages.map((language) => (
          <TouchableOpacity
            key={language.id}
            style={[
              styles.languageButton,
              selectedLanguage?.id === language.id && styles.selectedLanguageButton,
            ]}
            onPress={() => handleLanguageSelect(language)}
          >
            <Text style={styles.languageText}>{language.name}</Text>
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
  languagesContainer: {
    flex: 1,
  },
  languageButton: {
    padding: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 10,
  },
  selectedLanguageButton: {
    borderColor: '#007BFF',
    backgroundColor: '#e6f2ff',
  },
  languageText: {
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

export default LanguageSelectionScreen;