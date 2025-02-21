import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    
    isVisible: false,       
    
};

export const drawerMenuSlice = createSlice({
    name: 'drawerMenu',
    initialState,
    reducers: {
        openDrawerMenu: (state) => {
           
            state.isVisible = true;
           

        },
        closeDrawerMenu: (state) => {
            state.isVisible = false;
         
        },
    },
});

export const { openDrawerMenu, closeDrawerMenu } = drawerMenuSlice.actions;

export default drawerMenuSlice.reducer;
