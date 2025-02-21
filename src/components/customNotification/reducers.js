import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  visible: false, // Set to false initially as the notification should be hidden
  message: '',
  type: 'success', // Default to 'success', you can modify this based on usage
  isTop: false, // Make it a boolean (true or false) instead of string
};

const customNotificationSlice = createSlice({
  name: 'customNotification',
  initialState,
  reducers: {
    showCustomNotification: (state, action) => {
      state.visible = true;
      state.message = action.payload.message;
      state.type = action.payload.type;
      state.isTop = action.payload.isTop; // Expecting a boolean for `isTop`
    },
    hideCustomNotification: state => {
      state.visible = false;
      state.message = '';
    },
  },
});

export const {showCustomNotification, hideCustomNotification} =
  customNotificationSlice.actions;
export default customNotificationSlice.reducer;
