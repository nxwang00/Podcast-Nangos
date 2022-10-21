import React, {useEffect, useState} from 'react';
import {
  Text,
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  Image,
  View,
} from 'react-native';
import {List, Searchbar, Avatar} from 'react-native-paper';
import {baseUrl} from '../config/config';
import SoundPlayer from 'react-native-sound-player';
import YoutubePlayer from 'react-native-youtube-iframe';

export const EpisodeScreen = props => {
  const channelId = props.route.params.channelId;
  const [searchQuery, setSearchQuery] = useState('');
  const [initEpisodes, setInitEpisodes] = useState([]);
  const [episodes, setEpisodes] = useState([]);
  const [youtubeId, setYoutubeId] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${baseUrl}/web/api/podepisodes/${channelId}`)
      .then(response => response.json())
      .then(json => {
        setEpisodes(json);
        setInitEpisodes(json);
      })
      .catch(error => console.error(error))
      .finally(() => setLoading(false));

    return () => {
      SoundPlayer.stop();
    };
  }, []);

  const onChangeSearch = query => {
    setSearchQuery(query);
    if (!query) {
      setEpisodes(initEpisodes);
    } else {
      const searchedEpisodes = initEpisodes.filter(
        ep =>
          ep.channelname.includes(query) || ep.epidode_title.includes(query),
      );
      setEpisodes(searchedEpisodes);
    }
  };

  const onEpisodeItemPress = async episode => {
    const episode_url = episode.episode_url;
    if (episode.channeltype === 'Youtube') {
      const episode_url_parts = episode_url.split('=');
      setYoutubeId(episode_url_parts[1]);
    } else {
      try {
        // console.log(soundUrl);
        SoundPlayer.playUrl(episode_url);
      } catch (e) {
        console.log('Play sound file error: ', e);
      }
    }
  };

  const loadingStyle = loading ? 'center' : 'flex-start';

  return (
    <SafeAreaView style={styles.container(loadingStyle)}>
      {loading ? (
        <ActivityIndicator color="#fff" size="large" />
      ) : (
        <View style={{marginTop: 5}}>
          <Searchbar
            onChangeText={onChangeSearch}
            value={searchQuery}
            style={{backgroundColor: '#999999', colo: 'white'}}
            iconColor="white"
            inputStyle={{color: '#fff'}}
          />
          <YoutubePlayer height={0} play={true} videoId={youtubeId} />
          <ScrollView style={{marginVertical: 10}}>
            {episodes.map((episode, i) => (
              <List.Item
                key={i}
                title={episode.epidode_title}
                description={episode.channelname + ' - ' + episode.channeltype}
                style={styles.profile}
                titleStyle={{color: 'white'}}
                descriptionStyle={{color: 'white'}}
                titleNumberOfLines={2}
                descriptionNumberOfLines={3}
                left={props => (
                  <Image
                    {...props}
                    style={{
                      width: 60,
                      height: 60,
                      borderRadius: 5,
                      alignSelf: 'center',
                    }}
                    source={{
                      uri: episode.epidode_image,
                    }}
                  />
                )}
                onPress={() => onEpisodeItemPress(episode)}
              />
            ))}
          </ScrollView>
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
  profile: {
    borderBottomWidth: 1,
    borderBottomColor: '#999999',
  },
});
