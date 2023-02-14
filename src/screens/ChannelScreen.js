import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  SafeAreaView,
  View,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  FlatList,
  Platform,
} from 'react-native';
import {Text} from 'react-native-paper';
import {baseUrl} from '../config/config';
import {Dimensions} from 'react-native';
import {useGlobal} from '../context/Global';
import Toast from 'react-native-toast-message';
import TrackPlayer from 'react-native-track-player';
import {AppVersionDlg} from '../components/AppVersionDlg';

export const ChannelScreen = props => {
  const {globalData} = useGlobal();
  const lang = globalData?.lang;
  const windowWidth = Dimensions.get('window').width;

  const [podcasts, setPodcasts] = useState([]);
  const [audiobooks, setAudiobooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (lang) onLoadChannels(lang);
    else props.navigation.navigate('lang');
  }, [lang]);

  const onLoadChannels = async () => {
    const tempPodcasts = [];
    const tempAudiobooks = [];
    try {
      const resChannels = await fetch(`${baseUrl}/web/api/podchannels/${lang}`);
      const res_channels = await resChannels.json();
      for (let c of res_channels) {
        if (c.channeltype === 'audiobook') tempAudiobooks.push(c);
        else tempPodcasts.push(c);
      }
      setPodcasts(tempPodcasts);
      setAudiobooks(tempAudiobooks);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const onChannelPress = async channel => {
    await TrackPlayer.reset();
    props.navigation.navigate('episode', {channel: JSON.stringify(channel)});
  };

  const channelItem = ({item}) => (
    <TouchableOpacity
      style={styles.channelItem}
      onPress={() => onChannelPress(item)}>
      <Image
        source={{
          uri: item.channelimage,
        }}
        style={{width: (windowWidth - 20) / 3, height: (windowWidth - 20) / 3}}
      />
    </TouchableOpacity>
  );

  const loadingStyle = loading ? 'center' : 'flex-start';

  return (
    <SafeAreaView style={styles.container(loadingStyle)}>
      {loading ? (
        <ActivityIndicator color="#fff" size="large" />
      ) : (
        <View>
          <View style={{marginTop: 20}}>
            <Text
              variant="titleLarge"
              style={{color: 'white', marginBottom: 5}}>
              Podcasts
            </Text>
            <FlatList
              key={'*'}
              data={podcasts}
              renderItem={channelItem}
              keyExtractor={item => item.channelname_id}
              numColumns={3}
              style={{height: '43%'}}
            />
          </View>
          <View style={{marginTop: 20}}>
            <Text
              variant="titleLarge"
              style={{color: 'white', marginBottom: 5}}>
              Audiobooks
            </Text>
            <FlatList
              key={'_'}
              data={audiobooks}
              renderItem={channelItem}
              keyExtractor={item => item.channelname_id}
              numColumns={3}
              style={{height: '42%'}}
            />
          </View>
        </View>
      )}
      <AppVersionDlg />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: justify_content => ({
    flex: 1,
    paddingHorizontal: 5,
    backgroundColor: '#3f3f3f',
    justifyContent: justify_content,
  }),
  channelItem: {
    margin: 2,
  },
});
