import React from 'react';
import {Provider as PaperProvider} from 'react-native-paper';
import {Router} from './src/routes/Router';
import Toast from 'react-native-toast-message';
import {NavigationContainer} from '@react-navigation/native';

const App = () => {
  return (
    <PaperProvider>
      <NavigationContainer>
        <Router />
      </NavigationContainer>
      <Toast />
    </PaperProvider>
  );
};

export default App;
