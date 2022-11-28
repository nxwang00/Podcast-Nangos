import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  SafeAreaView,
  View,
  ActivityIndicator,
  TouchableOpacity,
  Image,
} from 'react-native';
import {Text, List, Button} from 'react-native-paper';
import Toast from 'react-native-toast-message';
import {format} from 'date-fns';
import {
  baseUrl,
  MPESA_CONSUMER_KEY,
  MPESA_CONSUMER_SECRET,
} from '../config/config';
import {PhoneNumberDlg} from '../components/PhoneNumberDlg';
import {PinDlg} from '../components/PinDlg';

const base64 = require('base-64');

// MPESA payment key constants
// const SHORTCODE = '174379';
const SHORTCODE1 = '7102972';
const SHORTCODE = '9084239';
// const PASSKEY =
//   'bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919';
const PASSKEY =
  '0f93091a7598f8fd5746e9278c427bda06a10e476c1d8ed5561b35a08f3369f3';

export const SubscriptionScreen = props => {
  const [features, setFeatures] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mpesaLoading, setMpesaLoading] = useState(false);
  const [visiblePhoneDlg, setVisiblePhoneDlg] = useState(false);
  const [visiblePinDlg, setVisiblePinDlg] = useState(false);

  useEffect(() => {
    fetch(`${baseUrl}/web/api/price/`)
      .then(response => response.json())
      .then(json => setFeatures(json))
      .catch(error => {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: error,
        });
      })
      .finally(() => setLoading(false));
  }, []);

  const getMpesaPassword = cDate => {
    const password = base64.encode(SHORTCODE1 + PASSKEY + cDate);
    return password;
  };

  const onOkHideDlg = async phoneNumber => {
    setVisiblePhoneDlg(false);

    setMpesaLoading(true);

    try {
      const resAuth = await fetch(
        'https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
        {
          method: 'GET',
          headers: {
            Authorization:
              'Basic ' +
              base64.encode(MPESA_CONSUMER_KEY + ':' + MPESA_CONSUMER_SECRET),
          },
        },
      );
      const res_auth = await resAuth.json();
      const access_token = res_auth.access_token;

      const currentDate = format(new Date(), 'yyyyMMddHHmmss');
      const mpesaPassword = getMpesaPassword(currentDate);
      const bodyJson = {
        BusinessShortCode: SHORTCODE1,
        Password: mpesaPassword,
        Timestamp: currentDate,
        TransactionType: 'CustomerBuyGoodsOnline',
        Amount: features.Price.split(' ')[0],
        PartyA: phoneNumber,
        PartyB: SHORTCODE,
        PhoneNumber: phoneNumber,
        CallBackURL: 'https://hisaanalytics.com/nangoz/web/api/pesa.php',
        AccountReference: 'SautiFM',
        TransactionDesc: `The payment is done from ${phoneNumber}`,
      };
      const resPay = await fetch(
        'https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
        {
          method: 'POST',
          headers: {
            'Content-type': 'application/json',
            Authorization: `Bearer ${access_token}`,
          },
          body: JSON.stringify(bodyJson),
        },
      );
      const res_pay = await resPay.json();
      if (res_pay.ResponseCode === '0') {
        Toast.show({
          type: 'success',
          text1: 'Payment request submitted',
          text2: 'You will receive pincode prompt.',
        });
        await fetch(
          `${baseUrl}/web/api/poduser/${phoneNumber}/${
            features.Price.split(' ')[0]
          }/${res_pay.CheckoutRequestID}`,
        );
      }
      setMpesaLoading(false);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Mpesa authentication failed, try again.',
      });
    }
  };

  const onBackPress = () => {
    props.navigation.goBack();
  };

  const onShowPhoneNumberDlg = () => {
    if (mpesaLoading) return;
    setVisiblePhoneDlg(true);
  };

  const onCancelHideDlg = () => {
    setVisiblePhoneDlg(false);
  };

  const onExistingUsersPress = () => {
    setVisiblePinDlg(true);
  };

  const onHidePinDlg = () => {
    setVisiblePinDlg(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      {loading ? (
        <ActivityIndicator color="#fff" size="large" />
      ) : (
        <View>
          <Image
            source={require('../assets/M-PESA-LOGO-01.png')}
            style={styles.logoImg}
          />
          <View style={styles.priceView}>
            <Text
              variant="titleLarge"
              style={{marginRight: 10, color: '#d69122'}}>
              {features.Price.split(' ')[1]}
            </Text>
            <Text variant="displayMedium" style={{color: '#d69122'}}>
              {features.Price.split(' ')[0]}
            </Text>
          </View>
          <View style={{marginVertical: 15}}>
            <View style={styles.featureView}>
              <List.Icon icon="check" color="#17ebd5" />
              <Text variant="titleMedium" style={styles.featureText}>
                {features.feature1}
              </Text>
            </View>
            <View style={styles.featureView}>
              <List.Icon icon="check" color="#17ebd5" />
              <Text variant="titleMedium" style={styles.featureText}>
                {features.feature2}
              </Text>
            </View>
            <View style={styles.featureView}>
              <List.Icon icon="check" color="#17ebd5" />
              <Text variant="titleMedium" style={styles.featureText}>
                {features.feature3}
              </Text>
            </View>
          </View>
          <View>
            <TouchableOpacity onPress={onShowPhoneNumberDlg}>
              <View style={styles.buyBtn}>
                <Text style={styles.buyBtnText}>BUY NOW</Text>
                {mpesaLoading && (
                  <ActivityIndicator size="small" color="white" />
                )}
              </View>
            </TouchableOpacity>
            <Button
              type="text"
              style={{marginTop: 20}}
              textColor="#17ebd5"
              onPress={onBackPress}>
              Back to Episodes
            </Button>
            <Button
              type="text"
              textColor="#d69122"
              onPress={onExistingUsersPress}
              style={{marginTop: 10}}
              labelStyle={{fontSize: 22}}>
              Existing Users
            </Button>
          </View>
        </View>
      )}
      <PhoneNumberDlg
        visible={visiblePhoneDlg}
        onCancelHideDlg={onCancelHideDlg}
        onOkHideDlg={phone => onOkHideDlg(phone)}
      />
      <PinDlg visible={visiblePinDlg} onHideDlg={onHidePinDlg} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 40,
    backgroundColor: '#3f3f3f',
  },
  logoImg: {
    width: '100%',
    height: '25%',
    borderRadius: 20,
    alignSelf: 'center',
  },
  priceView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'baseline',
  },
  featureView: {
    borderBottomWidth: 1,
    borderBottomColor: '#595959',
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 50,
    marginVertical: 5,
  },
  featureText: {
    color: 'white',
    textAlign: 'center',
  },
  buyBtn: {
    backgroundColor: '#d69122',
    height: 40,
    borderRadius: 25,
    marginHorizontal: 50,
    marginTop: 15,
    elevation: 10,
    shadowColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buyBtnText: {
    color: 'white',
    fontSize: 20,
    fontWeight: '700',
    textTransform: 'capitalize',
    marginHorizontal: 5,
  },
});
