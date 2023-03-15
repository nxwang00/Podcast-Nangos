import React, {useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/core';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {LangScreen} from '../screens/LangScreen';
import {ChannelScreen} from '../screens/ChannelScreen';
import {EpisodeScreen} from '../screens/EpisodeScreen';
import {SubscriptionScreen} from '../screens/SubscriptionScreen';
import {Menu, IconButton, Button} from 'react-native-paper';
import {View, StyleSheet, Text} from 'react-native';
import {WhatsappMsg} from '../components/WhatsappMsg';
import {NangosScreen} from '../screens/NangosScreen';

const Stack = createNativeStackNavigator();

export const NoLangStack = () => {
  const navigation = useNavigation();

  const [channelMenuVisible, setChannelMenuVisible] = useState(false);
  const [episodeMenuVisible, setEpisodeMenuVisible] = useState(false);
  const [subscriptionMenuVisible, setSubscriptionMenuVisible] = useState(false);
  // const [nangosMenuVisible, setNangosMenuVisible] = useState(false);
  const [langMenuVisible, setLangMenuVisible] = useState(false);

  const [visibleDlg, setVisibleDlg] = useState(false);

  const openChannelMenu = () => setChannelMenuVisible(true);
  const closeChannelMenu = () => setChannelMenuVisible(false);

  const openEpisodeMenu = () => setEpisodeMenuVisible(true);
  const closeEpisodeMenu = () => setEpisodeMenuVisible(false);

  const openSubscriptionMenu = () => setSubscriptionMenuVisible(true);
  const closeSubscriptionMenu = () => setSubscriptionMenuVisible(false);

  // const openNangosMenu = () => setNangosMenuVisible(true);
  // const closeNangosMenu = () => setNangosMenuVisible(false);

  const openLangMenu = () => setLangMenuVisible(true);
  const closeLangMenu = () => setLangMenuVisible(false);

  const onLangPress = () => {
    closeChannelMenu();
    closeEpisodeMenu();
    closeEpisodeMenu();
    // closeNangosMenu();
    closeLangMenu();
    navigation.navigate('lang');
  };

  const onPodcastPress = () => {
    closeChannelMenu();
    closeEpisodeMenu();
    closeEpisodeMenu();
    // closeNangosMenu();
    closeLangMenu();
    navigation.navigate('channel');
  };

  const onNangosPress = () => {
    closeChannelMenu();
    closeEpisodeMenu();
    closeEpisodeMenu();
    // closeNangosMenu();
    closeLangMenu();
    navigation.navigate('nangos');
  };

  const onShowWhatsappDlg = () => {
    setVisibleDlg(true);
  };

  const onHideWhatsappDlg = () => {
    setVisibleDlg(false);
  };

  return (
    <>
      <Stack.Navigator initialRouteName="nangos">
        <Stack.Screen
          name="nangos"
          component={NangosScreen}
          options={{
            headerTitle: () => (
              <View style={{flexDirection: 'row', alignItems: 'baseline'}}>
                <Text style={{color: 'white', fontSize: 20}}>Sauti</Text>
                <Text
                  style={{color: 'orange', fontWeight: 'bold', fontSize: 24}}>
                  FM
                </Text>
              </View>
            ),
            headerRight: () => (
              <View style={styles.rightBtnBox}>
                <Button
                  textColor="#f7663e"
                  style={{marginRight: -20}}
                  onPress={onPodcastPress}>
                  Podcast
                </Button>
                <IconButton
                  icon="eject-outline"
                  iconColor="green"
                  size={20}
                  onPress={onPodcastPress}
                />
                <Button
                  textColor="#f7663e"
                  style={{marginRight: -20}}
                  onPress={onShowWhatsappDlg}>
                  Share with a friend
                </Button>
                <IconButton
                  icon="whatsapp"
                  iconColor="green"
                  size={20}
                  onPress={onShowWhatsappDlg}
                />
                {/* <Menu
                  visible={nangosMenuVisible}
                  onDismiss={closeNangosMenu}
                  anchor={
                    <IconButton
                      icon="dots-vertical"
                      onPress={openNangosMenu}
                      size={20}
                      color="#fff"
                    />
                  }>
                  <Menu.Item onPress={onLangPress} title="Language" />
                  <Menu.Item onPress={onPodcastPress} title="Podcast" />
                </Menu> */}
              </View>
            ),
            headerStyle: {
              backgroundColor: '#1f1f1f',
            },
            headerTintColor: '#fff',
          }}
        />
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
                <Menu
                  visible={langMenuVisible}
                  onDismiss={closeLangMenu}
                  anchor={
                    <IconButton
                      icon="dots-vertical"
                      onPress={openLangMenu}
                      size={20}
                      color="#fff"
                    />
                  }>
                  <Menu.Item onPress={onNangosPress} title="Nangos" />
                </Menu>
              </View>
            ),
            headerLeft: () => <Text></Text>,
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
                      color="#fff"
                    />
                  }>
                  <Menu.Item onPress={onLangPress} title="Language" />
                  <Menu.Item onPress={onNangosPress} title="Nangos" />
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
                      color="#fff"
                    />
                  }>
                  <Menu.Item onPress={onLangPress} title="Language" />
                  <Menu.Item onPress={onNangosPress} title="Nangos" />
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
                  <Menu.Item onPress={onNangosPress} title="Nangos" />
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
