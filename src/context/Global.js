import React, {createContext, useState, useContext, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {baseUrl} from '../config/config';
import publicIP from 'react-native-public-ip';

const GlobalContext = createContext();

const GlobalProvider = ({children}) => {
  const [globalData, setGlobalData] = useState();

  useEffect(() => {
    //Every time the App is opened, this provider is rendered
    //and call de loadStorage function.
    loadStorageData();
  }, []);

  const loadStorageData = async () => {
    try {
      //Try get the data from Async Storage
      const globalDataSerialized = await AsyncStorage.getItem('@GlobalData');
      let _globalData = null;
      if (globalDataSerialized) {
        //If there are data, it's converted to an Object and the state is updated.
        _globalData = JSON.parse(globalDataSerialized);
        setGlobalData(_globalData);
      }

      if (!_globalData || !_globalData.appid) {
        // Get appid and save it to async storage when app is installed
        const resAppID = await fetch(`${baseUrl}/web/api/appid`);
        const res_appID = await resAppID.json();
        _globalData = {..._globalData, ...res_appID};
      }

      // Get ip of phone and save it to Async Storage
      const ip = await publicIP();
      _globalData = {..._globalData, ...{ip}};
      setGlobalData(_globalData);
      await AsyncStorage.setItem('@GlobalData', JSON.stringify(_globalData));
    } catch (error) {
      console.log('Get async storage error: ', error);
      // const {code, message} = error;
      // console.warn(code, message);
    }
  };

  const onLang = async _langData => {
    try {
      const newGlobalData = {...globalData, ..._langData};
      setGlobalData(newGlobalData);
      await AsyncStorage.setItem('@GlobalData', JSON.stringify(newGlobalData));
    } catch (error) {
      console.log('Set async storage error: ', error);
    }
  };

  return (
    //This component will be used to encapsulate the whole App,
    //so all components will have access to the Context
    <GlobalContext.Provider value={{globalData, onLang}}>
      {children}
    </GlobalContext.Provider>
  );
};

//A simple hooks to facilitate the access to the LangContext
// and permit components to subscribe to LangContext updates
const useGlobal = () => {
  const context = useContext(GlobalContext);

  if (!context) {
    throw new Error('useGlobal must be used within an GlobalProvider');
  }

  return context;
};

export {GlobalContext, GlobalProvider, useGlobal};
