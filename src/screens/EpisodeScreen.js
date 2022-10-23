import React, {useEffect, useState, useCallback} from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  Image,
  View,
  Dimensions,
} from 'react-native';
import {List, Searchbar, Text, IconButton} from 'react-native-paper';
import {baseUrl} from '../config/config';
import Sound from 'react-native-sound';
import YoutubePlayer from 'react-native-youtube-iframe';
import {ChannelDesc} from '../components/ChannelDesc';
import Toast from 'react-native-toast-message';

var audioInst = null;

export const EpisodeScreen = props => {
  const channel = props.route.params.channel;
  const channelObj = JSON.parse(channel);
  const channelId = channelObj.channelname_id;

  const windowHeight = Dimensions.get('window').height;

  const [searchQuery, setSearchQuery] = useState('');
  const [initEpisodes, setInitEpisodes] = useState([]);
  const [episodes, setEpisodes] = useState([]);
  const [youtubeId, setYoutubeId] = useState('');
  const [loading, setLoading] = useState(true);
  const [audioLoading, setAudioLoadiing] = useState(false);
  const [selectedEpisodeId, setSelectedEpisodeId] = useState('');
  const [youtubePlay, setYoutubePlay] = useState(true);

  Sound.setCategory('Playback');

  useEffect(() => {
    // fetching the list of episodes
    fetch(`${baseUrl}/web/api/podepisodes/${channelId}`)
      .then(response => response.json())
      .then(json => {
        const rst = json.map(item => {
          return {...item, status: 'none'};
        });

        setEpisodes(rst);
        setInitEpisodes(rst);
      })
      .catch(error => {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: error,
        });
      })
      .finally(() => setLoading(false));

    return () => {
      // release the resource of audio
      if (audioInst) audioInst.release();
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

  const resetEpisodesWithStatus = (targetEpisodeId, status) => {
    const episodesNew = episodes.map(ep => {
      if (ep.podcast_id !== targetEpisodeId) return {...ep, status: 'none'};
      else return {...ep, status: status};
    });
    setEpisodes(episodesNew);
    const initEpisodesNew = initEpisodes.map(ep => {
      if (ep.podcast_id !== targetEpisodeId) return {...ep, status: 'none'};
      else return {...ep, status: status};
    });
    setInitEpisodes(initEpisodesNew);
  };

  const onYTBStateChange = state => {
    // youtube video is playing?
    if (state === 'playing') {
      setAudioLoadiing(false);
      resetEpisodesWithStatus(selectedEpisodeId, 'playing');
    } else if (state === 'ended') {
      resetEpisodesWithStatus(selectedEpisodeId, 'none');
    }
  };

  const onEpisodeItemPlay = episode => {
    // start audio loading
    setAudioLoadiing(true);

    const episode_url = episode.episode_url;
    const episode_id = episode.podcast_id;
    const episode_channeltype = episode.channeltype;

    // youtube audio
    if (episode_channeltype === 'Youtube') {
      // resuming play
      if (episode_id === selectedEpisodeId) {
        setYoutubePlay(true);
        // playing new
      } else {
        // loading
        resetEpisodesWithStatus(episode_id, 'loading');

        const episode_url_parts = episode_url.split('=');
        setSelectedEpisodeId(episode_id);
        setYoutubeId(episode_url_parts[1]);
      }
      // general channel audio
    } else {
      if (episode_id === selectedEpisodeId) {
        // resuming play
        resetEpisodesWithStatus(episode_id, 'playing');
        setAudioLoadiing(false);

        audioInst.play();
        // playing new
      } else {
        setSelectedEpisodeId(episode_id);
        resetEpisodesWithStatus(episode_id, 'loading');
        try {
          // Removing old audio instance
          if (audioInst) {
            audioInst.stop();
            audioInst.release();
          }

          const audio = new Sound(episode_url, null, error => {
            if (error) {
              Toast.show({
                type: 'error',
                text1: 'Loading failed',
                text2: error,
              });
              return;
            }

            // loaded successfully
            audioInst = audio;
            resetEpisodesWithStatus(episode_id, 'playing');

            setAudioLoadiing(false);

            // playing audio
            audio.play(success => {
              if (success) {
                resetEpisodesWithStatus(episode_id, 'none');
              } else {
                Toast.show({
                  type: 'error',
                  text1: 'Playing failed',
                  text2: 'playback failed due to audio decoding errors',
                });
              }
            });
          });
        } catch (e) {
          Toast.show({
            type: 'error',
            text1: 'Sound file error',
            text2: e,
          });
        }
      }
    }
  };

  const onEpisodeItemPause = episode => {
    resetEpisodesWithStatus(episode.podcast_id, 'none');
    if (episode.channeltype === 'Youtube') {
      setYoutubePlay(false);
    } else {
      audioInst.pause();
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
          <YoutubePlayer
            height={0}
            play={youtubePlay}
            videoId={youtubeId}
            onChangeState={onYTBStateChange}
          />
          <ChannelDesc
            imgUri={channelObj.channelimage}
            title={channelObj.channelname}
            desc={channelObj.channel_desc}
          />
          <ScrollView style={{marginVertical: 10, height: windowHeight - 330}}>
            {episodes.map(episode => (
              <List.Item
                key={episode.podcast_id}
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
                right={props =>
                  episode.status === 'loading' ? (
                    <ActivityIndicator
                      {...props}
                      size="large"
                      color="#fff"
                      style={{alignSelf: 'center', marginLeft: 6}}
                    />
                  ) : episode.status === 'playing' ? (
                    <IconButton
                      {...props}
                      icon="pause"
                      type="outlined"
                      style={{alignSelf: 'center'}}
                      iconColor="black"
                      containerColor="white"
                      size={16}
                      onPress={() => onEpisodeItemPause(episode)}
                    />
                  ) : (
                    <IconButton
                      {...props}
                      icon="play"
                      type="outlined"
                      style={{alignSelf: 'center'}}
                      iconColor="black"
                      containerColor="white"
                      size={16}
                      disabled={audioLoading}
                      onPress={() => onEpisodeItemPlay(episode)}
                    />
                  )
                }
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
  text: {
    color: 'white',
  },
});
