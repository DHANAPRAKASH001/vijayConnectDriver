import { createSlice } from '@reduxjs/toolkit';
import { Logger } from '../../utils/logger';

const initialState = {
    message: "",           // The alert message to display
    type: "DEFAULT",           // Alert type: success, error, warning, info, etc.
    isVisible: false,       // Controls the visibility of the alert
    isTop: true             // Controls the positioning: true for top, false for bottom
};

export const customAlertSlice = createSlice({
    name: 'customAlert',
    initialState,
    reducers: {
        showAlert: (state, action) => {
            state.message = action.payload.message;
            state.type = action.payload.type || "DEFAULT";
            state.isVisible = true;
            state.isTop = action.payload.isTop ?? true;

            Logger.info("showAlert - type", action.payload.type)

        },
        hideAlert: (state) => {
            state.isVisible = false;
            state.message = "";
            state.type = "info";
        },
    },
});

export const { showAlert, hideAlert } = customAlertSlice.actions;

export default customAlertSlice.reducer;
