import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {useLang} from '../context/Lang';
import {LangStack} from './LangStack';
import {NoLangStack} from './NoLangStack';

export const Router = () => {
  const {langData} = useLang();

  return (
    <NavigationContainer>
      {langData && langData.lang ? <LangStack /> : <NoLangStack />}
    </NavigationContainer>
  );
};
