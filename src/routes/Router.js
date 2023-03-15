import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {useGlobal} from '../context/Global';
import {LangStack} from './LangStack';
import {NoLangStack} from './NoLangStack';

export const Router = () => {
  // const {globalData} = useGlobal();

  return (
    <NavigationContainer>
      {/* {globalData && globalData.lang ? <LangStack /> : <NoLangStack />} */}
      <NoLangStack />
    </NavigationContainer>
  );
};
