import React, {useState, useEffect} from 'react';
import {StyleSheet, View, Image} from 'react-native';
import * as Progress from 'react-native-progress';

export const ProgressIndicator = props => {
  const {loading} = props;
  const [progressVal, setProgressVal] = useState(0);

  let interval = null;
  useEffect(() => {
    interval = setInterval(() => {
      if (loading) setProgressVal(val => val + 0.1);
      else setProgressVal(1);
    }, 500);
    return () => clearInterval(interval);
  }, [loading]);

  return (
    <View>
      <Image
        source={require('../assets/Smiling_emoji.png')}
        style={styles.logoImg}
      />
      <Progress.Bar
        progress={progressVal}
        width={300}
        color="#000"
        indeterminate={false}
        style={{alignSelf: 'center'}}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  logoImg: {
    width: '40%',
    height: '50%',
    alignSelf: 'center',
  },
});
