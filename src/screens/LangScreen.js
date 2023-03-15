import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  SafeAreaView,
  View,
  ActivityIndicator,
  TouchableOpacity,
  Image,
} from 'react-native';
import {Avatar, Text} from 'react-native-paper';
import {baseUrl} from '../config/config';
import {useGlobal} from '../context/Global';
import Toast from 'react-native-toast-message';
import {AppVersionDlg} from '../components/AppVersionDlg';

const LANG_COLORS = ['#34ad86', '#077988', '#13aaae', '#056a96'];

export const LangScreen = props => {
  const global = useGlobal();
  const [langs, setLangs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${baseUrl}/web/api/language/`)
      .then(response => response.json())
      .then(json => setLangs(json))
      .catch(error => {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: error,
        });
      })
      .finally(() => setLoading(false));
  }, []);

  const onLangBtnClicked = language => {
    const langInfo = {
      lang: language,
    };
    global.onLang(langInfo);
    props.navigation.navigate('channel');
  };

  return (
    <SafeAreaView style={styles.container}>
      {loading ? (
        <ActivityIndicator color="#fff" size="large" />
      ) : (
        <View>
          <Image
            source={require('../assets/logo1.jpg')}
            style={styles.logoImg}
          />
          {langs.map((lang, i) => (
            <TouchableOpacity
              key={i}
              onPress={() => onLangBtnClicked(lang.language)}>
              <View
                style={[
                  styles.langBtn(LANG_COLORS[i]),
                  styles.centeredChildren,
                ]}>
                <Text style={styles.langBtnText}>{lang.language}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}
      <AppVersionDlg />
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
    width: '55%',
    height: '35%',
    borderRadius: 20,
    alignSelf: 'center',
    marginBottom: 40,
  },
  centeredChildren: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  langBtn: backgroundColor => ({
    backgroundColor,
    height: 45,
    borderRadius: 25,
    marginHorizontal: 35,
    marginVertical: 10,
    elevation: 10,
    shadowColor: '#fff',
  }),
  langBtnText: {
    color: 'white',
    fontSize: 20,
    fontWeight: '700',
    textTransform: 'capitalize',
  },
});
