import React, {useEffect, useState} from 'react';
import {StyleSheet, TextInput, Linking, View} from 'react-native';
import {Button, Dialog, Portal} from 'react-native-paper';
import Toast from 'react-native-toast-message';
import {useUser} from '../context/User';

export const PhoneNumberDlg = props => {
  const {visible, onCancelHideDlg, onOkHideDlg} = props;

  const {onUser} = useUser();

  const [phoneNumber, setPhoneNumber] = useState('');

  const onCancelPress = () => {
    onCancelHideDlg();
  };

  const onOkPress = () => {
    onUser({phone: '254' + phoneNumber});
    onOkHideDlg('254' + phoneNumber);
  };

  const onPhoneNumberChange = number => {
    if (number.length <= 9) {
      setPhoneNumber(number);
    }
  };

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onCancelPress} style={styles.dlg}>
        <Dialog.Title style={styles.text}>My Phone Number</Dialog.Title>
        <Dialog.Content>
          <View style={styles.phoneNumberView}>
            <TextInput
              value="0"
              style={styles.phoneNumberInput1}
              textColor="white"
              selectionColor="white"
              placeholderTextColor="#6e6e6e"
              editable={false}
            />
            <TextInput
              value={phoneNumber}
              onChangeText={text => onPhoneNumberChange(text)}
              style={styles.phoneNumberInput2}
              textColor="white"
              selectionColor="white"
              placeholder="xxxxxxxxx"
              placeholderTextColor="#6e6e6e"
              keyboardType="numeric"
              letterSpacing={2}
            />
          </View>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={onCancelPress} textColor="white">
            Cancel
          </Button>
          <Button onPress={onOkPress} textColor="white">
            Ok
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
  phoneNumberInput1: {
    color: 'white',
    backgroundColor: '#3f3f3f',
    borderBottomColor: 'white',
    borderBottomWidth: 2,
    fontSize: 18,
    paddingLeft: 20,
    width: '15%',
  },
  phoneNumberInput2: {
    color: 'white',
    backgroundColor: '#3f3f3f',
    borderBottomColor: 'white',
    borderBottomWidth: 2,
    fontSize: 18,
    width: '85%',
  },
  phoneNumberView: {
    flexDirection: 'row',
  },
});
