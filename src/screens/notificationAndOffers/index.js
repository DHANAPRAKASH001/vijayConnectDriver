import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  SectionList,
  TouchableOpacity,
  Image,
} from 'react-native';
import {moderateScale} from 'react-native-size-matters';
import {TabView, SceneMap, TabBar} from 'react-native-tab-view';
import CustomScreenHeader from '../../components/screenHeader';
import {APP_ICONS} from '../../utils/icons';
import {COMMON_COLORS} from '../../constants/colors';
import InternalScreenLoader from '../../components/internalScreenLoader';

// Sample Unified Data for Notifications and Offers
const sampleNotificationData = [
  {
    monthYear: 'December 2024',
    records: [
      {
        header: 'Year-End Sale',
        message: 'Enjoy 30% off on all services until December 31st!',
        image: APP_ICONS.GOD,
        isNotification: false,
      },
      {
        header: 'Winter Driving Tips',
        message: 'Prepare your car for the winter season.',
        image: APP_ICONS.GOD,
        isNotification: true,
      },
      {
        header: 'Battery Check Reminder',
        message: 'It’s time to check your car’s battery health.',
        image: APP_ICONS.GOD,
        isNotification: true,
      },
    ],
  },
  {
    monthYear: 'November 2024',
    records: [
      {
        header: 'Service Reminder',
        message: 'Your vehicle service is scheduled for tomorrow.',
        image: APP_ICONS.GOD,
        isNotification: true,
      },
      {
        header: 'Exclusive Offer',
        message: 'Get 50% off on engine oil replacement!',
        image: APP_ICONS.GOD,
        isNotification: false,
      },
      {
        header: 'Holiday Discount',
        message: 'Flat 25% off on all detailing services this weekend.',
        image: APP_ICONS.GOD,
        isNotification: false,
      },
    ],
  },
  {
    monthYear: 'October 2024',
    records: [
      {
        header: 'Maintenance Tip',
        message: 'Check your tire pressure before a long drive.',
        image: APP_ICONS.GOD,
        isNotification: true,
      },
      {
        header: 'Free Car Wash',
        message: 'Avail a free car wash with any service package.',
        image: APP_ICONS.GOD,
        isNotification: false,
      },
      {
        header: 'Loyalty Bonus',
        message: 'Earn double points on servicing this weekend.',
        image: APP_ICONS.GOD,
        isNotification: false,
      },
      {
        header: 'Service Completion Notification adas d as d  a sda sd a s da sd asd asda s da',
        message: 'Your car servicing is complete and asd asda sda sda sd asd as da sd asd a sda sd asd asda sda sda sdasd asd asd as d ready for pickup.',
        image: APP_ICONS.GOD,
        isNotification: true,
      },
    ],
  },
  {
    monthYear: 'September 2024',
    records: [
      {
        header: 'Back-to-School Offers',
        message: 'Special discounts on family car services.',
        image: APP_ICONS.GOD,
        isNotification: false,
      },
      {
        header: 'Tire Safety Reminder',
        message: 'Inspect your tires for wear and tear before a long journey.',
        image: APP_ICONS.GOD,
        isNotification: true,
      },
      {
        header: 'Referral Bonus',
        message: 'Refer a friend and earn $20 credit for your next service.',
        image: APP_ICONS.GOD,
        isNotification: false,
      },
    ],
  },
];

// Helper function to filter data based on the `isNotification` flag
const filterDataByType = (data, isNotification) =>
  data
    .map(month => ({
      ...month,
      records: month.records.filter(
        record => record.isNotification === isNotification,
      ),
    }))
    .filter(month => month.records.length > 0); // Remove months with no records

// Helper function to render a section list
const renderSectionList = data => (
  <SectionList
    showsVerticalScrollIndicator={false}
    sections={data.map(month => ({
      title: month.monthYear,
      data: month.records,
    }))}
    renderSectionHeader={({section: {title}}) => (
      <Text style={styles.monthHeader}>{title.toUpperCase()}</Text>
    )}
    renderItem={({item}) => (
      <TouchableOpacity style={styles.listItem}>
        <Image source={item.image} style={styles.listItemImage} />
        <View style={styles.listItemContent}>
          <Text style={styles.listItemHeader}>{item.header}</Text>
          <Text style={styles.listItemMessage}>{item.message}</Text>
        </View>
      </TouchableOpacity>
    )}
    keyExtractor={(item, index) => `${item.header}-${index}`}
    contentContainerStyle={styles.sectionListContent}
  />
);

// Notifications Tab
const NotificationsTab = () => (
  <View style={styles.scene}>
    {renderSectionList(filterDataByType(sampleNotificationData, true))}
  </View>
);

// Offers Tab
const OffersTab = () => (
  <View style={styles.scene}>
    {renderSectionList(filterDataByType(sampleNotificationData, false))}
  </View>
);

const NotificationsOffersScreen = ({navigation}) => {
  const [index, setIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false); // Simulate loading state
  const [routes] = useState([
    {key: 'notifications', title: 'Notifications'},
    {key: 'offers', title: 'Offers'},
  ]);

  const leadingOnPress = () => {
    navigation.goBack();
  };

  const renderScreenContent = () => {
    if (isLoading) {
      return <InternalScreenLoader />;
    } else {
      return (
        <TabView
          navigationState={{index, routes}}
          renderScene={SceneMap({ 
            notifications: NotificationsTab,
            offers: OffersTab,
          })}
          onIndexChange={setIndex}
          initialLayout={{width: Dimensions.get('window').width}}
          renderTabBar={props => (
            <TabBar
              {...props}
              style={styles.tabBar}
              activeColor={COMMON_COLORS.BLACK}
              inactiveColor={COMMON_COLORS.GRAY}
              indicatorStyle={styles.tabIndicator}
              labelStyle={styles.tabLabel}
            />
          )}
        />
      );
    }
  };

  return (
    <View style={styles.container}>
      <CustomScreenHeader
        leadingIcon={APP_ICONS.BACK}
        onLeadingIconPress={leadingOnPress}
        title="Notifications & Offers"
      />
      {renderScreenContent()}
    </View>
  );
};

export default NotificationsOffersScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  scene: {
    flex: 1,
    padding: moderateScale(10),
  },
  tabBar: {
    backgroundColor: 'white',
  },
  tabIndicator: {
    backgroundColor: COMMON_COLORS.PRIMARY,
  },
  sectionListContent: {
    paddingBottom: moderateScale(20),
  },
  monthHeader: {
    fontSize: moderateScale(12),
    color: COMMON_COLORS.GRAY,
    marginVertical: moderateScale(10),
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
    height: moderateScale(40),
    width: moderateScale(40),
    resizeMode: 'contain',
    marginRight: moderateScale(15),
    borderRadius: 5
  },
  listItemContent: {
    flex: 1,
  },
  listItemHeader: {
    fontSize: moderateScale(14),
    fontWeight: 'bold',
    color: COMMON_COLORS.BLACK,
  },
  listItemMessage: {
    fontSize: moderateScale(12),
    color: COMMON_COLORS.GRAY,
    marginTop: moderateScale(5),
  },
  tabLabel: {
    fontSize: moderateScale(14),
    fontWeight: 'bold',
  },
});
