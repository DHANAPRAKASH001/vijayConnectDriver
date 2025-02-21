// App.js
import React from 'react';
import { Provider } from 'react-redux';
import store from './src/store';
import AppNavigator from './src/navigation';
import CustomAlert from './src/components/customAlert';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import DrawerMenu from './src/components/drawerMenu';



const App = () => {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <AppNavigator />

        
        <CustomAlert />
      </SafeAreaProvider>
    </Provider>
  );
};

export default App;
