import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SectionList,
  TouchableOpacity,
  Image,
} from 'react-native';
import { moderateScale } from 'react-native-size-matters';
import CustomScreenHeader from '../../components/screenHeader';
import { APP_ICONS } from '../../utils/icons';
import { COMMON_COLORS } from '../../constants/colors';
import InternalScreenLoader from '../../components/internalScreenLoader';

// Sample Payment Methods Data
const paymentMethodsData = [
  {
    header: 'Help & Support Topics',
    records: [
      {
        option: 'How to edit my profile ?',
        description: 'Enjoy 30% off on all services until December 31st!',
        icon: APP_ICONS.CURRENCY,
        onPress: () => console.log('CASH PAYMENT'),
      },
      {
        option: 'How can i update my mobile number ?',
        description: 'Enjoy 30% off on all services until December 31st!',
        icon: APP_ICONS.UPI,
        onPress: () => console.log('UPI PAYMENT'),
      },
    ],
  },
];

const MyAccountScreen = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(false); // Simulate loading state

  const handleBackPress = () => {
    navigation.goBack();
  };

  const renderPaymentOptions = () => {
    if (isLoading) {
      return <InternalScreenLoader />;
    } else {
      return (
        <SectionList
          style={styles.list}
          showsVerticalScrollIndicator={false}
          sections={paymentMethodsData.map(paymentMethod => ({
            title: paymentMethod.header,
            data: paymentMethod.records,
          }))}
          renderSectionHeader={({ section: { title } }) => (
            <Text style={styles.sectionHeader}>{title.toUpperCase()}</Text>
          )}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.listItem} onPress={item.onPress}>
                {/* <View style={styles.listItemIconWrapper}>
                <Image source={item.icon} style={styles.listItemImage} />
                </View> */}
              
              <View style={styles.listItemContent}>
                <Text style={styles.listItemHeader}>{item.option}</Text>
                {/* <Text style={styles.listItemMessage}>{item.description}</Text> */}
              </View>

              {/* <View style={styles.listItemIconWrapper}>

                <Image source={APP_ICONS.BACK} style={styles.listItemImage}/>

              </View> */}
            </TouchableOpacity>
          )}
          keyExtractor={(item, index) => `${item.option}-${index}`}
          contentContainerStyle={styles.sectionListContent}
        />
      );
    }
  };

  return (
    <View style={styles.container}>
      <CustomScreenHeader
        leadingIcon={APP_ICONS.BACK}
        onLeadingIconPress={handleBackPress}
        title="My Account"
      />
      {renderPaymentOptions()}
    </View>
  );
};

export default MyAccountScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COMMON_COLORS.WHITE,
  },
  list: {
    paddingHorizontal: moderateScale(10),
  },
  sectionHeader: {
    fontSize: moderateScale(14),
    fontWeight: 'bold',
    color: COMMON_COLORS.GRAY,
    marginVertical: moderateScale(10),
  },
  sectionListContent: {
    paddingBottom: moderateScale(20),
  },
  listItem: {
    paddingVertical: moderateScale(10),
    paddingHorizontal: moderateScale(10),
    marginVertical: moderateScale(5),
    borderColor: COMMON_COLORS.BLACK,
    borderWidth: 1,
    borderRadius: moderateScale(10),
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  listItemImage: {
    height: "100%",
    width: "100%",
    resizeMode: 'contain',
    
  },
  listItemContent: {
    flex: 1,
    justifyContent: "center"
  },
  listItemHeader: {
    fontSize: moderateScale(18),

    color: COMMON_COLORS.BLACK,
  },
  listItemMessage: {
    fontSize: moderateScale(12),
    color: COMMON_COLORS.GRAY,
    marginTop: moderateScale(5),
  },listItemIconWrapper: {
    height: moderateScale(40),
    width: moderateScale(40),
    backgroundColor: COMMON_COLORS.GRAY_LIGHT,
    borderRadius:20,
    padding: moderateScale(10),
    marginRight: moderateScale(15),

  }
});
