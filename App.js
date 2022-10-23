import React from 'react';
import {Provider as PaperProvider} from 'react-native-paper';
import {LangProvider} from './src/context/Lang';
import {Router} from './src/routes/Router';
import Toast from 'react-native-toast-message';
import {NavigationContainer} from '@react-navigation/native';

const App = () => {
  return (
    <LangProvider>
      <PaperProvider>
        <Router />
        <Toast />
      </PaperProvider>
    </LangProvider>
  );
};

export default App;
