import {combineReducers} from 'redux';

// REDUCERS
import authSlice from '../screens/auth/reducers';
import customAlertSlice from '../components/customAlert/reducers';
import drawerMenuSlice from '../components/drawerMenu/reducers';
import customNotificationSlice from '../components/customNotification/reducers';
import bookingConfirmationSlice from '../screens/bookingConfirmation/reducers';
 
const rootReducer = combineReducers({
  // SCREEN REDUCERS
  auth: authSlice,

  // COMPONENT REDUCERS
  customAlert: customAlertSlice,
  drawerMenu: drawerMenuSlice,
  customNotification: customNotificationSlice,
  bookingConfirmation: bookingConfirmationSlice,
});

export default rootReducer;
