import React, {useEffect, useState} from 'react';
import {IconButton, Button} from 'react-native-paper';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

export const AudioPlayer = props => {
  const {track, onForwardBackward, onPlayPause} = props;

  const [isPlaying, setPlaying] = useState('none');

  useEffect(() => {
    setPlaying(track.status);
  }, [track]);

  const onPlayPausePress = async () => {
    if (isPlaying === 'playing') {
      onPlayPause('none');
      setPlaying('none');
    } else {
      onPlayPause('playing');
      setPlaying('playing');
    }
  };

  const playPauseIcon = isPlaying === 'playing' ? 'pause' : 'play';

  return (
    <View style={styles.playerMaxView}>
      <View style={styles.buttonsSection}>
        <TouchableOpacity onPress={() => onForwardBackward('prev')}>
          <Icon name="play-back" size={26} color="white" />
        </TouchableOpacity>
        {isPlaying === 'loading' ? (
          <ActivityIndicator color="#fff" style={{alignSelf: 'center'}} />
        ) : (
          <TouchableOpacity onPress={onPlayPausePress}>
            <Icon name={playPauseIcon} size={26} color="white" />
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={() => onForwardBackward('next')}>
          <Icon name="play-forward" size={26} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  playerMaxView: {
    display: 'flex',
    flex: 1,
    backgroundColor: 'rgba(215, 213, 212, 0.3)',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    width: '103%',
  },
  buttonsSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 5,
  },
});
