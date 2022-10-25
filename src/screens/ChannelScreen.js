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
import {Button, Text} from 'react-native-paper';
import {baseUrl} from '../config/config';
import {Dimensions} from 'react-native';
import {useLang} from '../context/Lang';
import Toast from 'react-native-toast-message';

export const ChannelScreen = props => {
  const {langData} = useLang();
  const lang = langData.lang;
  const windowWidth = Dimensions.get('window').width;

  const [podcasts, setPodcasts] = useState([]);
  const [audiobooks, setAudiobooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log(Platform.Version);
    console.log(Platform.constants['Release']);

    const tempPodcasts = [];
    const tempAudiobooks = [];
    fetch(`${baseUrl}/web/api/podchannels/${lang}`)
      .then(response => response.json())
      .then(json => {
        for (let c of json) {
          if (c.channeltype === 'audiobook') tempAudiobooks.push(c);
          else tempPodcasts.push(c);
        }
        setPodcasts(tempPodcasts);
        setAudiobooks(tempAudiobooks);
      })
      .catch(error => {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: error,
        });
      })
      .finally(() => setLoading(false));
  }, []);

  const onChannelPress = channel => {
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
            />
          </View>
        </View>
      )}
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
