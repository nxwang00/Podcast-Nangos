import React, {useEffect, useState, useRef} from 'react';
import {View, StyleSheet, Animated, Image} from 'react-native';
import {Text, ToggleButton} from 'react-native-paper';

export const ExpendableText = props => {
  const {title, desc, imgUri} = props;

  const [expanded, setExpanded] = useState(false);
  const [animation, setAnimation] = useState(new Animated.Value(0));
  const [minHeight, setMinHeight] = useState(0);
  const [maxHeight, setMaxHeight] = useState(0);
  const [maxValueSet, setMaxValueSet] = useState(false);
  const [minValueSet, setMinValueSet] = useState(false);
  const [cardHeight, setCardHeight] = useState(0);

  const _setMaxHeight = e => {
    if (!maxValueSet) {
      setMaxHeight(e.nativeEvent.layout.height);
      setMaxValueSet(true);
    }
  };

  const _setMinHeight = e => {
    if (!minValueSet) {
      animation.setValue(e.nativeEvent.layout.height);
      setMinHeight(e.nativeEvent.layout.height);
      setMinValueSet(true);
    }
  };

  const onDescPress = () => {
    let initialValue = expanded ? maxHeight : minHeight;
    let finalValue = expanded ? minHeight : maxHeight;

    setExpanded(!expanded);

    Animated.parallel([
      Animated.timing(animation, {
        duration: 600,
        toValue: 200,
        useNativeDriver: false,
      }),
    ]).start();
  };

  return (
    <View style={styles.channelDescription}>
      <Image
        style={{
          width: 130,
          height: 130,
          borderRadius: 5,
        }}
        source={{
          uri: imgUri,
        }}
        onLayout={_setMinHeight}
      />
      <View onLayout={_setMaxHeight} style={{width: '60%'}}>
        <Animated.View
          style={[
            {
              marginLeft: 10,
              marginRight: 10,
              overflowWrap: 'break-word',
            },
            {height: animation},
          ]}>
          <Text variant="titleLarge" style={styles.text}>
            {title}
          </Text>
          <Text variant="bodyLarge" style={styles.text} onPress={onDescPress}>
            {desc}
          </Text>
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  text: {
    color: 'white',
  },
  channelDescription: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
});
