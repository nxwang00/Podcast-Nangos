import React, {useEffect, useState, useRef} from 'react';
import {View, StyleSheet, ScrollView, Image} from 'react-native';
import {Text, ToggleButton} from 'react-native-paper';

export const ChannelDesc = props => {
  const {title, desc, imgUri} = props;

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
      />
      <View
        style={{
          marginLeft: 10,
          marginRight: 10,
          overflowWrap: 'break-word',
          width: '60%',
        }}>
        <Text variant="titleLarge" style={styles.text}>
          {title}
        </Text>
        <ScrollView style={{maxHeight: 100, marginTop: 5}}>
          <Text variant="bodyLarge" style={styles.text}>
            {desc}
          </Text>
        </ScrollView>
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
