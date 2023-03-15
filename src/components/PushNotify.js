import React, {useEffect} from 'react';
import messaging from '@react-native-firebase/messaging';
import Toast from 'react-native-toast-message';
import {useGlobal} from '../context/Global';
import {baseUrl} from '../config/config';

export const PushNotify = () => {
  const {globalData} = useGlobal();

  useEffect(() => {
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('Message handled in background', remoteMessage);
    });

    messaging()
      .getInitialNotification()
      .then(async remoteMessage => {
        console.log('Message Data2 :', remoteMessage);
      });
    messaging().onMessage(async remoteMessage => {
      console.log('Message Data3 :', remoteMessage);
      Toast.show({
        type: 'success',
        text1: remoteMessage.notification.title,
        text2: remoteMessage.notification.body,
      });
    });
  }, []);

  useEffect(() => {
    if (globalData?.ip) {
      checkToken();
    }
  }, [globalData]);

  const checkToken = async () => {
    const fmcToken = await messaging().getToken();
    if (fmcToken) {
      console.log(fmcToken);
      const ip = globalData.ip;
      const appid = globalData.appid;
      const data = {
        appid,
        ip,
        token: fmcToken,
      };

      const url = `${baseUrl}/web/api/token`;
      await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
    }
  };

  return null;
};
