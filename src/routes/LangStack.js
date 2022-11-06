import React, {useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/core';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {LangScreen} from '../screens/LangScreen';
import {ChannelScreen} from '../screens/ChannelScreen';
import {EpisodeScreen} from '../screens/EpisodeScreen';
import {SubscriptionScreen} from '../screens/SubscriptionScreen';
import {IconButton, Button} from 'react-native-paper';
import {Menu} from 'react-native-paper';
import {View, StyleSheet} from 'react-native';
import {WhatsappMsg} from '../components/WhatsappMsg';

const Stack = createNativeStackNavigator();

export const LangStack = () => {
  const navigation = useNavigation();

  const [channelMenuVisible, setChannelMenuVisible] = useState(false);
  const [episodeMenuVisible, setEpisodeMenuVisible] = useState(false);
  const [subscriptionMenuVisible, setSubscriptionMenuVisible] = useState(false);
  const [visibleDlg, setVisibleDlg] = useState(false);

  const openChannelMenu = () => setChannelMenuVisible(true);
  const closeChannelMenu = () => setChannelMenuVisible(false);

  const openEpisodeMenu = () => setEpisodeMenuVisible(true);
  const closeEpisodeMenu = () => setEpisodeMenuVisible(false);

  const openSubscriptionMenu = () => setSubscriptionMenuVisible(true);
  const closeSubscriptionMenu = () => setSubscriptionMenuVisible(false);

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
                <Button
                  textColor="#f7663e"
                  style={{marginRight: -15}}
                  onPress={onShowWhatsappDlg}>
                  Share with a friend
                </Button>
                <IconButton
                  icon="whatsapp"
                  iconColor="green"
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
                <Button
                  textColor="#f7663e"
                  style={{marginRight: -15}}
                  onPress={onShowWhatsappDlg}>
                  Share with a friend
                </Button>
                <IconButton
                  icon="whatsapp"
                  iconColor="green"
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
                <Button
                  textColor="#f7663e"
                  style={{marginRight: -15}}
                  onPress={onShowWhatsappDlg}>
                  Share with a friend
                </Button>
                <IconButton
                  icon="whatsapp"
                  iconColor="green"
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
        <Stack.Screen
          name="subscription"
          component={SubscriptionScreen}
          options={{
            title: 'Subscription',
            headerRight: () => (
              <View style={styles.rightBtnBox}>
                <Button
                  textColor="#f7663e"
                  style={{marginRight: -15}}
                  onPress={onShowWhatsappDlg}>
                  Share with a friend
                </Button>
                <IconButton
                  icon="whatsapp"
                  iconColor="green"
                  size={20}
                  onPress={onShowWhatsappDlg}
                />
                <Menu
                  visible={subscriptionMenuVisible}
                  onDismiss={closeSubscriptionMenu}
                  anchor={
                    <IconButton
                      icon="dots-vertical"
                      onPress={openSubscriptionMenu}
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
    alignItems: 'center',
  },
});
