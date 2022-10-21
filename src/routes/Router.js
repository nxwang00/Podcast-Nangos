import React, {useState} from 'react';
import {useNavigation} from '@react-navigation/core';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {LangScreen} from '../screens/LangScreen';
import {ChannelScreen} from '../screens/ChannelScreen';
import {EpisodeScreen} from '../screens/EpisodeScreen';
import {IconButton} from 'react-native-paper';
import {Menu, Divider, Provider} from 'react-native-paper';

const Stack = createNativeStackNavigator();

export const Router = props => {
  const navigation = useNavigation();

  const [channelMenuVisible, setChannelMenuVisible] = useState(false);
  const [episodeMenuVisible, setEpisodeMenuVisible] = useState(false);

  const openChannelMenu = () => setChannelMenuVisible(true);
  const closeChannelMenu = () => setChannelMenuVisible(false);

  const openEpisodeMenu = () => setEpisodeMenuVisible(true);
  const closeEpisodeMenu = () => setEpisodeMenuVisible(false);

  const onLangPress = () => {
    navigation.navigate('lang');
  };

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="lang"
        component={LangScreen}
        options={{
          title: 'Language',
          headerStyle: {
            backgroundColor: '#1f1f1f',
          },
          headerTintColor: '#fff',
        }}
      />
      <Stack.Screen
        name="channel"
        component={ChannelScreen}
        options={{
          title: 'Channel',
          headerRight: () => (
            <Menu
              visible={channelMenuVisible}
              onDismiss={closeChannelMenu}
              anchor={
                <IconButton
                  icon="dots-vertical"
                  onPress={openChannelMenu}
                  size={20}
                  color="#fff"
                />
              }>
              <Menu.Item onPress={onLangPress} title="Language" />
            </Menu>
          ),
          headerStyle: {
            backgroundColor: '#1f1f1f',
          },
          headerTintColor: '#fff',
        }}
      />
      <Stack.Screen
        name="episode"
        component={EpisodeScreen}
        options={{
          title: 'Episode',
          headerRight: () => (
            <Menu
              visible={episodeMenuVisible}
              onDismiss={closeEpisodeMenu}
              anchor={
                <IconButton
                  icon="dots-vertical"
                  onPress={openEpisodeMenu}
                  size={20}
                  color="#fff"
                />
              }>
              <Menu.Item onPress={onLangPress} title="Language" />
            </Menu>
          ),
          headerStyle: {
            backgroundColor: '#1f1f1f',
          },
          headerTintColor: '#fff',
        }}
      />
    </Stack.Navigator>
  );
};
