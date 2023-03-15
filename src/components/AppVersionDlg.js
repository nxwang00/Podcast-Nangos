import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  Text,
  PermissionsAndroid,
} from 'react-native';
import {Button, Dialog, Portal} from 'react-native-paper';
import ReactNativeBlobUtil from 'react-native-blob-util';
import DeviceInfo from 'react-native-device-info';
import {baseUrl} from '../config/config';

export const AppVersionDlg = () => {
  let version = DeviceInfo.getVersion();

  const [visible, setVisible] = useState(false);
  const [appLink, setAppLink] = useState('');

  useEffect(() => {
    getAppVersionDetail();
  }, []);

  const getAppVersionDetail = async () => {
    const resAppDetail = await fetch(`${baseUrl}/web/api/appversion`);
    const res_appDetail = await resAppDetail.json();
    if (res_appDetail.version !== version) {
      setVisible(true);
      setAppLink(res_appDetail.applink);
    }
  };

  const onCancelPress = () => {
    setVisible(false);
  };

  const checkPermission = async type => {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      {
        title: `Permission to download ${type}`,
        message:
          'Safety Client want to download some' + `${type} we need to access`,
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'no',
        buttonPositive: 'sure',
      },
    );
    return new Promise((resolve, reject) => {
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        resolve(true);
      } else {
        resolve(false);
      }
    });
  };

  const onDownloadPress = () => {
    setVisible(false);
    checkPermission('APK').then(res => {
      const downloads = ReactNativeBlobUtil.fs.dirs.DownloadDir;
      ReactNativeBlobUtil.config({
        // add this option that makes response data to be stored as a file,
        // this is much more performant.
        background: true,
        fileCache: true,
        addAndroidDownloads: {
          useDownloadManager: true,
          notification: true,
          path: downloads + '/' + 'app_new_version.apk',
        },
      })
        .fetch(
          'GET',
          // 'https://store1.gofile.io/download/58c4ae2a-cd38-4873-91ec-2a61b0e18302/app-release.apk',
          appLink,
          {
            //some headers ..
          },
        )
        .then(res => {
          // the temp file path
          console.log('The file saved to ', res.path());
        });
    });
  };

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onCancelPress} style={styles.dlg}>
        <Dialog.Content style={styles.center}>
          <Image
            source={require('../assets/new-app.png')}
            style={styles.logoImg}
          />
          <Text style={styles.title}>New version</Text>
          <Text style={styles.text}>Released</Text>
          <TouchableOpacity onPress={onDownloadPress}>
            <View style={styles.downloadBtn}>
              <Text style={styles.downloadBtnText}>Download</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={onCancelPress}>
            <View style={styles.cancelBtn}>
              <Text style={styles.cancelBtnText}>CANCEL</Text>
            </View>
          </TouchableOpacity>
        </Dialog.Content>
      </Dialog>
    </Portal>
  );
};

const styles = StyleSheet.create({
  dlg: {
    backgroundColor: '#1f1f1f',
    marginVertical: 100,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: 'white',
    marginTop: 10,
    fontSize: 26,
    alignSelf: 'center',
  },
  text: {
    color: '#13ee23',
    marginTop: 10,
    fontSize: 16,
    alignSelf: 'center',
  },
  logoImg: {
    width: '40%',
    height: '40%',
    alignSelf: 'center',
  },
  downloadBtn: {
    backgroundColor: '#d69122',
    height: 40,
    borderRadius: 25,
    marginHorizontal: 50,
    marginTop: 30,
    elevation: 10,
    shadowColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelBtn: {
    backgroundColor: '#1f1f1f',
    height: 40,
    borderRadius: 25,
    borderColor: '#d69122',
    borderWidth: 2,
    marginHorizontal: 50,
    marginTop: 25,
    elevation: 10,
    shadowColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  downloadBtnText: {
    color: 'white',
    fontSize: 20,
    fontWeight: '700',
    textTransform: 'capitalize',
    marginHorizontal: 5,
  },
  cancelBtnText: {
    color: '#d69122',
    fontSize: 20,
    fontWeight: '700',
    textTransform: 'capitalize',
    marginHorizontal: 5,
  },
});
