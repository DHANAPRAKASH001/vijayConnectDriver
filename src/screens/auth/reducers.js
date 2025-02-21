import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    isLogin: false,
    isLoading: false,
    lastLoggedIn: ""
};

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        startLogin: (state,action) => {
            state.isLoading = true;
            state.isLogin = false;

        },
        loginSuccess: (state) => {
            state.isLogin = true;
            state.isLoading = false;
        },
        updateLastLoggedIn: (state, action) => {
            state.lastLoggedIn = new Date();
        },
        logout: (state, action) => {
            state.isLogin = false;
        },
        sendOtpFailed: (state) => {
            state.isLogin = false;
            state.isLoading = false;
        },    },
});

export const { startLogin, loginSuccess, logout, updateLastLoggedIn, sendOtpFailed } = authSlice.actions;

export default authSlice.reducer;
