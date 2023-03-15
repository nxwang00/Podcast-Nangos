import React, {useEffect, useState} from 'react';
import {StyleSheet, TextInput, Linking, View} from 'react-native';
import {Button, Dialog, Portal, Text} from 'react-native-paper';
import Toast from 'react-native-toast-message';
import {useUser} from '../context/User';
import {baseUrl} from '../config/config';

export const PinDlg = props => {
  const {visible, onHideDlg} = props;

  const {onUser} = useUser();

  const [phoneNumber, setPhoneNumber] = useState('');
  const [pinCode, setPinCode] = useState('');

  const onCancelPress = () => {
    onHideDlg();
  };

  const onOkPress = async () => {
    const fullNumber = '254' + phoneNumber;
    const resSubscribe = await fetch(
      `${baseUrl}/web/api/existinguser/${fullNumber}`,
    );
    const res_subscribe = await resSubscribe.json();
    const passSubscribe = res_subscribe.password;
    if (passSubscribe == pinCode) {
      onUser({phone: fullNumber});
      Toast.show({
        type: 'success',
        text1: 'Pin code verified',
        text2: 'Channels are unlocked.',
      });
    } else {
      Toast.show({
        type: 'error',
        text1: 'Unknown pin code',
        text2: 'Channels are still locked.',
      });
    }
    onHideDlg();
  };

  const onPhoneNumberChange = number => {
    if (number.length <= 9) {
      setPhoneNumber(number);
    }
  };

  const onPinCode = code => {
    if (code.length <= 4) {
      setPinCode(code);
    }
  };

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onCancelPress} style={styles.dlg}>
        <Dialog.Content style={{marginHorizontal: 5}}>
          <Text variant="titleMedium" style={styles.text}>
            My Phone Number
          </Text>
          <View style={styles.phoneNumberView}>
            <TextInput
              value="0"
              style={styles.phoneNumberInput1}
              textColor="white"
              selectionColor="white"
              placeholderTextColor="#6e6e6e"
              keyboardType="numeric"
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
          <Text variant="titleMedium" style={styles.text}>
            My Pin Code
          </Text>
          <View>
            <TextInput
              value={pinCode}
              onChangeText={text => onPinCode(text)}
              style={styles.pinCodeInput}
              textColor="white"
              selectionColor="white"
              placeholder="xxxx"
              placeholderTextColor="#6e6e6e"
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
    marginBottom: 5,
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
  pinCodeInput: {
    color: 'white',
    backgroundColor: '#3f3f3f',
    borderBottomColor: 'white',
    borderBottomWidth: 2,
    fontSize: 18,
    paddingLeft: 20,
  },
  phoneNumberView: {
    flexDirection: 'row',
    marginBottom: 20,
  },
});
