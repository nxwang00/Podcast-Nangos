import React, {createContext, useState, useContext, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LangContext = createContext();

const LangProvider = ({children}) => {
  const [langData, setLangData] = useState();

  useEffect(() => {
    //Every time the App is opened, this provider is rendered
    //and call de loadStorage function.
    loadStorageData();
  }, []);

  const loadStorageData = async () => {
    try {
      //Try get the data from Async Storage
      const langDataSerialized = await AsyncStorage.getItem('@LangData');
      if (langDataSerialized) {
        //If there are data, it's converted to an Object and the state is updated.
        const _langData = JSON.parse(langDataSerialized);
        setLangData(_langData);
      }
    } catch (error) {
      console.log('Get async storage error: ', error);
    }
  };

  const onLang = async _langData => {
    try {
      setLangData(_langData);
      await AsyncStorage.setItem('@LangData', JSON.stringify(_langData));
    } catch (error) {
      console.log('Set async storage error: ', error);
    }
  };

  return (
    //This component will be used to encapsulate the whole App,
    //so all components will have access to the Context
    <LangContext.Provider value={{langData, onLang}}>
      {children}
    </LangContext.Provider>
  );
};

//A simple hooks to facilitate the access to the LangContext
// and permit components to subscribe to LangContext updates
const useLang = () => {
  const context = useContext(LangContext);

  if (!context) {
    throw new Error('useAuth must be used within an LangProvider');
  }

  return context;
};

export {LangContext, LangProvider, useLang};
