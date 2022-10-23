import React, {useEffect, useState} from 'react';
import {StyleSheet, TextInput, Linking} from 'react-native';
import {Button, Dialog, Portal} from 'react-native-paper';
import Toast from 'react-native-toast-message';

export const WhatsappMsg = props => {
  const {visible, onHideDlg} = props;

  const [text, setText] = useState(
    "I'm loving this channel and episode on Sauti FM. You should listen to it.Download the app here http://sauti.fm/app",
  );
  const [phoneNumber, setPhoneNumber] = useState('');

  const hideDialog = () => {
    onHideDlg();
    let mobile = Platform.OS == 'ios' ? phoneNumber : '+' + phoneNumber;
    if (mobile) {
      if (text) {
        let url = 'whatsapp://send?text=' + text + '&phone=' + mobile;
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
    } else {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please insert mobile no.',
      });
    }
  };

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={hideDialog} style={styles.dlg}>
        <Dialog.Title style={styles.text}>Share</Dialog.Title>
        <Dialog.Content>
          <TextInput
            value={phoneNumber}
            onChangeText={text => setPhoneNumber(text)}
            style={styles.phoneNumberInput}
            textColor="white"
            selectionColor="white"
          />
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
          <Button onPress={hideDialog} textColor="white">
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
