import React, {useEffect, useState} from 'react';
import {StyleSheet, TextInput, Linking} from 'react-native';
import {Button, Dialog, Portal} from 'react-native-paper';
import Toast from 'react-native-toast-message';
import {useGlobal} from '../context/Global';

export const WhatsappMsg = props => {
  const {visible, onHideDlg} = props;
  const {globalData} = useGlobal();

  let myMsg =
    "I'm loving this channel and episode on Sauti FM. You should listen to it.Download the app here http://sauti.fm/";

  if (globalData?.lang === 'swahili')
    myMsg =
      'Nimefurahia kusikiza rekodi hii kwenye Sauti FM.Pata App yenyewe hapa http://sauti.fm/';
  else if (globalData?.lang === 'luo')
    myMsg =
      'Nakipenda chaneli hii na kipindi cha Sauti FM. Unapaswa kuisikiliza.Pakua programu hapa http://sauti.fm/';
  else if (globalData?.lang === 'kikuyu')
    myMsg =
      'Nakipenda chaneli hii na kipindi cha Sauti FM. Unapaswa kuisikiliza.Pakua programu hapa http://sauti.fm/';

  const [text, setText] = useState(myMsg);

  const hideOkDialog = () => {
    onHideDlg();
    if (text) {
      let url = 'whatsapp://send?text=' + text;
      Linking.openURL(url)
        .then(data => {
          console.log('WhatsApp Opened');
        })
        .catch(() => {
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: 'Make sure WhatsApp installed on your device.',
          });
        });
    } else {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please insert message to send.',
      });
    }
  };

  return (
    <Portal>
      <Dialog
        visible={visible}
        onDismiss={() => onHideDlg()}
        style={styles.dlg}>
        <Dialog.Title style={styles.text}>Share</Dialog.Title>
        <Dialog.Content>
          <TextInput
            value={text}
            onChangeText={text => setText(text)}
            multiline={true}
            style={styles.textInput}
            textColor="white"
            selectionColor="white"
          />
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={hideOkDialog} textColor="white">
            Done
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

const styles = StyleSheet.create({
  dlg: {
    backgroundColor: '#1f1f1f',
  },
  text: {
    color: 'white',
  },
  textInput: {
    color: 'white',
    backgroundColor: '#3f3f3f',
    borderBottomColor: 'white',
    borderBottomWidth: 2,
    marginTop: 20,
  },
  phoneNumberInput: {
    color: 'white',
    backgroundColor: '#3f3f3f',
    borderBottomColor: 'white',
    borderBottomWidth: 2,
  },
});
