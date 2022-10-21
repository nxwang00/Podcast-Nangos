import React, {useState, useEffect} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import {
  StyleSheet,
  SafeAreaView,
  View,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  FlatList,
} from 'react-native';
import {Button, Text} from 'react-native-paper';
import {baseUrl} from '../config/config';
import {Dimensions} from 'react-native';

export const ChannelScreen = props => {
  const lang = props.route.params.lang;
  const windowWidth = Dimensions.get('window').width;

  const [podcasts, setPodcasts] = useState([]);
  const [audiobooks, setAudiobooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
      .catch(error => console.error(error))
      .finally(() => setLoading(false));
  }, []);

  const onChannelPress = channelId => {
    props.navigation.navigate('episode', {channelId});
  };

  const channelItem = ({item}) => (
    <TouchableOpacity
      style={styles.channelItem}
      onPress={() => onChannelPress(item.channelname_id)}>
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
