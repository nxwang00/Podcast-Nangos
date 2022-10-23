import React, {useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/core';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {LangScreen} from '../screens/LangScreen';
import {ChannelScreen} from '../screens/ChannelScreen';
import {EpisodeScreen} from '../screens/EpisodeScreen';
import {IconButton} from 'react-native-paper';
import {Menu} from 'react-native-paper';
import {View, StyleSheet} from 'react-native';
import {WhatsappMsg} from '../components/WhatsappMsg';

const Stack = createNativeStackNavigator();

export const LangStack = () => {
  const navigation = useNavigation();

  const [channelMenuVisible, setChannelMenuVisible] = useState(false);
  const [episodeMenuVisible, setEpisodeMenuVisible] = useState(false);
  const [visibleDlg, setVisibleDlg] = useState(false);

  const openChannelMenu = () => setChannelMenuVisible(true);
  const closeChannelMenu = () => setChannelMenuVisible(false);

  const openEpisodeMenu = () => setEpisodeMenuVisible(true);
  const closeEpisodeMenu = () => setEpisodeMenuVisible(false);

  const onLangPress = () => {
    navigation.navigate('lang');
  };

  const onShowWhatsappDlg = () => {
    setVisibleDlg(true);
  };

  const onHideWhatsappDlg = () => {
    setVisibleDlg(false);
  };

  return (
    <>
      <Stack.Navigator initialRouteName="channel">
        <Stack.Screen
          name="lang"
          component={LangScreen}
          options={{
            title: 'Language',
            headerRight: () => (
              <View style={styles.rightBtnBox}>
                <IconButton
                  icon="whatsapp"
                  iconColor="white"
                  size={20}
                  onPress={onShowWhatsappDlg}
                />
              </View>
            ),
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
              <View style={styles.rightBtnBox}>
                <IconButton
                  icon="whatsapp"
                  iconColor="white"
                  size={20}
                  onPress={onShowWhatsappDlg}
                />
                <Menu
                  visible={channelMenuVisible}
                  onDismiss={closeChannelMenu}
                  anchor={
                    <IconButton
                      icon="dots-vertical"
                      onPress={openChannelMenu}
                      size={20}
                      iconColor="white"
                    />
                  }>
                  <Menu.Item onPress={onLangPress} title="Language" />
                </Menu>
              </View>
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
              <View style={styles.rightBtnBox}>
                <IconButton
                  icon="whatsapp"
                  iconColor="white"
                  size={20}
                  onPress={onShowWhatsappDlg}
                />
                <Menu
                  visible={episodeMenuVisible}
                  onDismiss={closeEpisodeMenu}
                  anchor={
                    <IconButton
                      icon="dots-vertical"
                      onPress={openEpisodeMenu}
                      size={20}
                      iconColor="white"
                    />
                  }>
                  <Menu.Item onPress={onLangPress} title="Language" />
                </Menu>
              </View>
            ),
            headerStyle: {
              backgroundColor: '#1f1f1f',
            },
            headerTintColor: '#fff',
          }}
        />
      </Stack.Navigator>
      <WhatsappMsg visible={visibleDlg} onHideDlg={onHideWhatsappDlg} />
    </>
  );
};

const styles = StyleSheet.create({
  rightBtnBox: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
});
