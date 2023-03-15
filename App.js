import React, {useEffect, useRef, useState} from 'react';
import {Provider as PaperProvider} from 'react-native-paper';
import {GlobalProvider} from './src/context/Global';
import {UserProvider} from './src/context/User';
import {Router} from './src/routes/Router';
import Toast from 'react-native-toast-message';
import TrackPlayer from 'react-native-track-player';
import {PushNotify} from './src/components/PushNotify';

const App = () => {
  const setUpTrackPlayer = async () => {
    try {
      await TrackPlayer.setupPlayer();
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    setUpTrackPlayer();
  }, []);

  return (
    <GlobalProvider>
      <UserProvider>
        <PaperProvider>
          <Router />
          <Toast />
          <PushNotify />
        </PaperProvider>
      </UserProvider>
    </GlobalProvider>
  );
};

export default App;
