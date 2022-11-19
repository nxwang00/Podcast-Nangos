import React, {useEffect, useRef, useState} from 'react';
import {Provider as PaperProvider} from 'react-native-paper';
import {GlobalProvider} from './src/context/Global';
import {UserProvider} from './src/context/User';
import {Router} from './src/routes/Router';
import Toast from 'react-native-toast-message';
import {AppVersionDlg} from './src/components/AppVersionDlg';
import TrackPlayer from 'react-native-track-player';

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
          <AppVersionDlg />
        </PaperProvider>
      </UserProvider>
    </GlobalProvider>
  );
};

export default App;
