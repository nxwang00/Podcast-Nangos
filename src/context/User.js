import React, {createContext, useState, useContext, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UserContext = createContext();

const UserProvider = ({children}) => {
  const [userData, setUserData] = useState();

  useEffect(() => {
    //Every time the App is opened, this provider is rendered
    //and call de loadStorage function.
    loadStorageData();
  }, []);

  const loadStorageData = async () => {
    try {
      //Try get the data from Async Storage
      const userDataSerialized = await AsyncStorage.getItem('@UserData');
      if (userDataSerialized) {
        //If there are data, it's converted to an Object and the state is updated.
        const _userData = JSON.parse(userDataSerialized);
        setUserData(_userData);
      }
    } catch (error) {
      console.log('Get async storage error: ', error);
    }
  };

  const onUser = async _userData => {
    try {
      setUserData(_userData);
      await AsyncStorage.setItem('@UserData', JSON.stringify(_userData));
    } catch (error) {
      console.log('Set async storage error: ', error);
    }
  };

  return (
    //This component will be used to encapsulate the whole App,
    //so all components will have access to the Context
    <UserContext.Provider value={{userData, onUser}}>
      {children}
    </UserContext.Provider>
  );
};

//A simple hooks to facilitate the access to the LangContext
// and permit components to subscribe to LangContext updates
const useUser = () => {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error('useAuth must be used within an LangProvider');
  }

  return context;
};

export {UserContext, UserProvider, useUser};
