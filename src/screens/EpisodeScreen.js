import React, {useEffect, useState, useCallback} from 'react';
import {useFocusEffect} from '@react-navigation/native';
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
import {ChannelDesc} from '../components/ChannelDesc';
import Toast from 'react-native-toast-message';
import {useUser} from '../context/User';
import TrackPlayer, {
  useTrackPlayerEvents,
  Event,
  State,
  Capability,
} from 'react-native-track-player';
import {AudioPlayer} from '../components/AudioPlayer';
import {useGlobal} from '../context/Global';
import {format} from 'date-fns';

const trackEvents = [
  Event.PlaybackState,
  Event.PlaybackError,
  Event.PlaybackTrackChanged,
];

export const EpisodeScreen = props => {
  const channel = props.route.params.channel;
  const channelObj = JSON.parse(channel);
  const channelId = channelObj.channelname_id;

  const windowHeight = Dimensions.get('window').height;

  const {userData} = useUser();
  const phoneNumber = userData?.phone;
  // const phoneNumber = '254733706277';

  const {globalData} = useGlobal();

  const [searchQuery, setSearchQuery] = useState('');
  const [initEpisodes, setInitEpisodes] = useState([]);
  const [episodes, setEpisodes] = useState([]);
  const [youtubeId, setYoutubeId] = useState('');
  const [loading, setLoading] = useState(true);
  const [audioLoading, setAudioLoadiing] = useState(false);
  const [selectedEpisodeId, setSelectedEpisodeId] = useState('');
  const [youtubePlay, setYoutubePlay] = useState(true);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const [isLoadedEpisodes, setIsLoadedEpisodes] = useState(false);
  const [isLoadedSubscribed, setIsLoadedSubscribed] = useState(false);

  const [isSendingData, setSendingData] = useState(false);

  const updateTrackPlayer = async () => {
    try {
      await TrackPlayer.updateOptions({
        forwardJumpInterval: 30,
        jumpInterval: 30,
        capabilities: [
          Capability.Play,
          Capability.Pause,
          Capability.JumpBackward,
          Capability.JumpForward,
        ],
        compactCapabilities: [
          Capability.Play,
          Capability.Pause,
          Capability.JumpBackward,
          Capability.JumpForward,
        ],
        notificationCapabilities: [
          Capability.Play,
          Capability.Pause,
          Capability.JumpBackward,
          Capability.JumpForward,
        ],
      });
    } catch (e) {
      console.log(e);
    }
  };

  useTrackPlayerEvents(trackEvents, event => {
    if (event.type === Event.PlaybackError) {
      console.warn('An error occured while playing the current track.');
    }
    if (event.type === Event.PlaybackState) {
      if (event.state === State.Connecting) {
        resetEpisodesWithStatus(selectedEpisodeId, 'loading');
      } else if (event.state === State.Playing) {
        resetEpisodesWithStatus(selectedEpisodeId, 'playing');
        sendTrackData('start');
      } else {
        resetEpisodesWithStatus(selectedEpisodeId, 'none');
        if (event.state === State.Paused) sendTrackData('pause');
      }
    }
    if (event.type === Event.PlaybackTrackChanged) {
      if (event.nextTrack && event.nextTrack !== 0) {
        sendPreviousTrackData(event.track, event.position);

        const trackIdx = event.nextTrack % initEpisodes.length;
        const episode_id = initEpisodes[trackIdx].podcast_id;
        resetEpisodesWithStatus(episode_id, 'playing');
        setSelectedEpisodeId(episode_id);
      }
    }
  });

  useFocusEffect(
    React.useCallback(() => {
      let isActive = true;

      updateTrackPlayer();

      try {
        const getEpisodes = async () => {
          // fetching the list of episodes
          const resEpisodes = await fetch(
            `${baseUrl}/web/api/podepisodes/${channelId}`,
          );
          const res_episodes = await resEpisodes.json();
          const rst = res_episodes.map(item => {
            return {...item, status: 'none', url: item.episode_url};
          });

          if (isActive) {
            setEpisodes(rst);
            setInitEpisodes(rst);
            setLoading(false);

            setIsLoadedEpisodes(true);
          }
        };

        getEpisodes();
      } catch (err) {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Fetching data for list of episodes is failed.',
        });
      }

      return async () => {
        isActive = false;
        // await TrackPlayer.reset();
      };
    }, []),
  );

  useFocusEffect(
    React.useCallback(() => {
      let isActive = true;

      const getSubscribeInfo = async () => {
        try {
          if (phoneNumber) {
            const resSubscribe = await fetch(
              `${baseUrl}/web/api/podsubstatus/${phoneNumber}`,
            );

            const res_subscribe = await resSubscribe.json();

            if (isActive) {
              // setIsSubscribed(true);
              if (res_subscribe) {
                const isExpired = checkExpired(
                  format(new Date(), 'yyyy-MM-dd'),
                  res_subscribe[0].subscriptiondate,
                );
                if (!isExpired && res_subscribe[0].status === '1') {
                  setIsSubscribed(true);
                }
              }
            }
          }
          setIsLoadedSubscribed(true);
        } catch (err) {
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: 'Getting subscription infomation is failed.',
          });
        }
      };

      getSubscribeInfo();

      return () => {
        isActive = false;
      };
    }, [phoneNumber]),
  );

  useFocusEffect(
    React.useCallback(() => {
      if (isLoadedEpisodes && isLoadedSubscribed) {
        if (isSubscribed) {
          addTracks('all');
        } else {
          addTracks('first');
        }
      }
    }, [isLoadedEpisodes, isLoadedSubscribed, isSubscribed]),
  );

  const addTracks = async many => {
    if (many === 'all') {
      await TrackPlayer.reset();
      await TrackPlayer.add(initEpisodes);
    } else {
      await TrackPlayer.add(initEpisodes[0]);
    }
  };

  const checkExpired = (nowDate, subscriptionDate) => {
    const nowDates = nowDate.split('-');
    const nowYear = parseInt(nowDates[0]);
    const nowMonth = parseInt(nowDates[1]);
    const nowDay = parseInt(nowDates[2]);

    const subscriptionDates = subscriptionDate.split('-');
    const subscriptionYear = parseInt(subscriptionDates[0]);
    const subscriptionMonth = parseInt(subscriptionDates[1]);
    const subscriptionDay = parseInt(subscriptionDates[2]);

    if (nowYear > subscriptionYear) {
      return true;
    } else if (nowYear < subscriptionYear) {
      return false;
    } else {
      if (nowMonth > subscriptionMonth) {
        return true;
      } else if (nowMonth < subscriptionMonth) {
        return false;
      } else {
        if (nowDay > subscriptionDay) {
          return true;
        } else if (nowDay <= subscriptionDay) {
          return false;
        }
      }
    }
  };

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

  const sendTrackData = async status => {
    if (isSendingData) return;
    const ip = globalData.ip;
    const appid = globalData.appid;
    const trackIndex = await TrackPlayer.getCurrentTrack();
    const trackObject = await TrackPlayer.getTrack(trackIndex);

    if (!trackObject) return;
    const trackPosition = await TrackPlayer.getPosition();
    const episodeID = trackObject.podcast_id;

    setSendingData(true);
    const url = `${baseUrl}/web/api/analytics`;
    const data = {
      appid,
      ip,
      status,
      channel: channelId,
      episode: episodeID,
      timespent: trackPosition,
    };
    await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    setSendingData(false);
  };

  const sendPreviousTrackData = async (trackIdx, position) => {
    if (isSendingData) return;
    const track = initEpisodes[trackIdx];
    const ip = globalData.ip;
    const appid = globalData.appid;
    const episodeID = track.podcast_id;

    const url = `${baseUrl}/web/api/analytics`;
    const data = {
      appid,
      ip,
      status: 'finish',
      channel: channelId,
      episode: episodeID,
      timespent: position,
    };
    await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    sendTrackData('start');
  };

  const onEpisodeItemPlay = async episode => {
    const episode_url = episode.episode_url;
    const episode_id = episode.podcast_id;
    const episode_channeltype = episode.channeltype;

    if (episode_id === selectedEpisodeId) {
      TrackPlayer.play();
    } else {
      setSelectedEpisodeId(episode_id);
      TrackPlayer.pause();
      const trackIdx = initEpisodes.findIndex(epd => {
        return epd.podcast_id === episode_id;
      });
      await TrackPlayer.skip(trackIdx);
      TrackPlayer.play();
    }
  };

  const onEpisodeItemPause = async episode => {
    resetEpisodesWithStatus(episode.podcast_id, 'none');
    // if (episode.channeltype === 'Youtube') {
    //   setYoutubePlay(false);
    // } else {
    //   audioInst.pause();
    // }
    TrackPlayer.pause();
  };

  const onEpisodeItemLock = () => {
    props.navigation.navigate('subscription');
  };

  const loadingStyle = loading ? 'center' : 'flex-start';

  const selectedTrack = initEpisodes.find(
    ep => ep.podcast_id === selectedEpisodeId,
  );

  // play/pause on bottom controller
  const onPlayPause = val => {
    if (val === 'playing') {
      TrackPlayer.play();
    } else {
      TrackPlayer.pause();
    }
  };

  const playForwardBackward = async val => {
    if (val === 'next') {
      let position = await TrackPlayer.getPosition();
      let newPosition = position + 30;
      await TrackPlayer.seekTo(newPosition);
    } else {
      let position = await TrackPlayer.getPosition();
      let newPosition = position > 30 ? position - 30 : 0;
      await TrackPlayer.seekTo(newPosition);
    }
  };

  return (
    <SafeAreaView style={styles.container(loadingStyle)}>
      {loading ? (
        <ActivityIndicator color="#fff" size="large" />
      ) : (
        <View style={{marginTop: 5, flex: 1, justifyContent: 'flex-end'}}>
          <Searchbar
            onChangeText={onChangeSearch}
            value={searchQuery}
            style={{backgroundColor: '#999999', colo: 'white'}}
            iconColor="white"
            inputStyle={{color: '#fff'}}
          />
          {/* <YoutubePlayer
            height={0}
            play={youtubePlay}
            videoId={youtubeId}
            onChangeState={onYTBStateChange}
          /> */}
          <ChannelDesc
            imgUri={channelObj.channelimage}
            title={channelObj.channelname}
            desc={channelObj.channel_desc}
          />
          <ScrollView
            style={{
              marginTop: 10,
              height: windowHeight - 350,
              marginBottom: 20,
            }}>
            {episodes.map((episode, idx) => (
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
                  ) : idx === 0 || isSubscribed ? (
                    <IconButton
                      {...props}
                      icon="play"
                      type="outlined"
                      style={{alignSelf: 'center'}}
                      iconColor="black"
                      containerColor="white"
                      size={16}
                      onPress={() => onEpisodeItemPlay(episode)}
                    />
                  ) : (
                    <IconButton
                      {...props}
                      icon="lock"
                      type="outlined"
                      style={{alignSelf: 'center'}}
                      iconColor="black"
                      containerColor="#e09e34"
                      size={16}
                      onPress={onEpisodeItemLock}
                    />
                  )
                }
              />
            ))}
          </ScrollView>
          {selectedEpisodeId && (
            <View style={styles.playerBox}>
              <AudioPlayer
                track={selectedTrack}
                onForwardBackward={val => playForwardBackward(val)}
                onPlayPause={val => onPlayPause(val)}
              />
            </View>
          )}
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
  playerBox: {
    position: 'absolute',
    zIndex: 10,
    height: '6%',
    width: '100%',
    bottom: 0,
    left: -5,
  },
});
