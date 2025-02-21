import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
} from 'react-native';
import { moderateScale } from 'react-native-size-matters';
import CustomScreenHeader from '../../components/screenHeader';
import { APP_ICONS } from '../../utils/icons';
import { COMMON_COLORS } from '../../constants/colors';
import InternalScreenLoader from '../../components/internalScreenLoader';
import { APP_IMAGES } from '../../utils/images';

const AboutScreen = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(false); // Simulate loading state

  const handleBackPress = () => {
    navigation.goBack();
  };

  const renderContent = () => {
    if (isLoading) {
      return <InternalScreenLoader />;
    } else {
      return (
        <View style={styles.bodyContainer}>
          <Image source={APP_IMAGES.VIJAY_CONNECT_LOGO} style={styles.logo} />
          <Text style={styles.versionText}>Version 1.0</Text>

          <TouchableOpacity style={styles.linkButton} onPress={handleBackPress}>
            <Text style={styles.linkText}>Terms & Conditions</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.linkButton} onPress={handleBackPress}>
            <Text style={styles.linkText}>Privacy Policy</Text>
          </TouchableOpacity>
        </View>
      );
    }
  };

  return (
    <View style={styles.container}>
      <CustomScreenHeader
        leadingIcon={APP_ICONS.BACK}
        onLeadingIconPress={handleBackPress}
        title="About"
      />
      {renderContent()}
    </View>
  );
};

export default AboutScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COMMON_COLORS.WHITE,
  },
  bodyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    height: moderateScale(250),
    width: moderateScale(250),
    resizeMode: 'contain',
  },
  versionText: {
    fontSize: moderateScale(14),
    color: COMMON_COLORS.BLACK,
    marginVertical: moderateScale(5),
  },
  linkButton: {
    marginVertical: moderateScale(5),
  },
  linkText: {
    fontSize: moderateScale(18),
    color: COMMON_COLORS.RED_BRIGHT,
  },
});
