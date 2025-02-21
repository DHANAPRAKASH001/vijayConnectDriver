import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  isLoading: false,
  driverConnected: false,
};

export const bookingConfirmationSlice = createSlice({
  name: 'bookingConfirmation',
  initialState,
  reducers: {
    driverConnectionSuccess: (state, action) => {
      state.driverConnected = true;
      state.isLoading = false;
    },
    driverConnectionfailed: (state, action) => {
      state.driverConnected = false;
      state.isLoading = false;
    },
  },
});

export const {
driverConnectionSuccess,
driverConnectionfailed
} = bookingConfirmationSlice.actions;

export default bookingConfirmationSlice.reducer;
