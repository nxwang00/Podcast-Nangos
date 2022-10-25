import React, {useEffect, useRef} from 'react';
import {Provider as PaperProvider} from 'react-native-paper';
import {LangProvider} from './src/context/Lang';
import {Router} from './src/routes/Router';
import Toast from 'react-native-toast-message';
import {AppState} from 'react-native';

const App = () => {
  const appState = useRef(AppState.currentState);
  useEffect(() => {
    const appStateSubscription = AppState.addEventListener(
      'change',
      nextAppState => {
        console.log('appState.current: ', appState.current);
        console.log('nextAppState: ', nextAppState);
        appState.current = nextAppState;
      },
    );
    return () => {
      appStateSubscription.remove();
    };
  }, []);

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
