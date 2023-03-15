import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  SafeAreaView,
  StyleSheet,
  Image,
  useWindowDimensions,
  Animated,
} from 'react-native';
import {Text, IconButton} from 'react-native-paper';
import differenceInSeconds from 'date-fns/differenceInSeconds';
import Video from 'react-native-video';
import VideoPlayer from 'react-native-video-controls';
import PagerView from 'react-native-pager-view';
import {baseUrl} from '../config/config';
import ViewShot from 'react-native-view-shot';
import RNFS from 'react-native-fs';
import Share from 'react-native-share';
import {ProgressIndicator} from '../components/ProgressIndicator';
import {useGlobal} from '../context/Global';

export const NangosScreen = () => {
  const scrollViewRef = useRef(null);
  const viewShotRef = useRef(null);
  const pagerViewRef = useRef(null);

  const {globalData} = useGlobal();

  const {height, width} = useWindowDimensions();

  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showControl, setShowControl] = useState(false);
  const [pageIdx, setPageIdx] = useState(0);
  const [pageStartTime, setPageStartTime] = useState(null);

  const [isSendingData, setSendingData] = useState(false);

  useEffect(() => {
    onLoadNews();
    setPageStartTime(new Date());
  }, []);

  const onLoadNews = async () => {
    try {
      const resNews = await fetch(`${baseUrl}/web/api/news/127886`);
      const res_news = await resNews.json();
      setNewsList(res_news);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const onShareScreen = () => {
    viewShotRef.current.capture().then(uri => {
      RNFS.readFile(uri, 'base64').then(res => {
        let urlString = 'data:image/jpeg;base64,' + res;
        let options = {
          title: 'nangos',
          message: 'Save time and read content in a short time',
          url: urlString,
          type: 'image/jpeg',
        };
        Share.open(options)
          .then(res => {
            console.log(res);
          })
          .catch(err => {
            err && console.log(err);
          });
      });
    });
  };

  const onRefreshScreen = () => {
    onLoadNews();
    pagerViewRef.current.setPage(0);
  };

  const onPageSwipeSelected = async e => {
    if (!globalData) return;

    // get the previous page
    const prevPage = newsList[pageIdx];

    // set the current page index
    setPageIdx(e.nativeEvent.position);

    // get current time
    let pageEndTime = new Date();
    const timeOnPage = differenceInSeconds(pageEndTime, pageStartTime);
    setPageStartTime(pageEndTime);

    const url = `${baseUrl}/web/api/nganalytics`;
    const ip = globalData.ip;
    const appid = globalData.appid;
    const data = {
      appid,
      ip,
      articleid: prevPage.article_id,
      category: prevPage.category,
      timespent: timeOnPage,
    };
    await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  };

  const loadingStyle = loading ? 'center' : 'flex-start';

  return (
    <SafeAreaView style={styles.container(loadingStyle)}>
      {loading ? (
        <ProgressIndicator loading={loading} />
      ) : (
        <View style={{flex: 1}}>
          <PagerView
            ref={pagerViewRef}
            style={styles.viewPager}
            initialPage={0}
            orientation="vertical"
            onPageSelected={e => onPageSwipeSelected(e)}>
            {newsList.map(news => (
              <View key={news.article_id}>
                <ViewShot
                  style={{
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'white',
                  }}
                  ref={viewShotRef}
                  options={{format: 'jpg', quality: 0.9}}>
                  {news.type === 'news' && (
                    <Image
                      source={{uri: news.articleimage_url}}
                      style={{
                        width: width,
                        height: height * 0.3,
                      }}
                    />
                  )}
                  {news.type === 'imagenews' && (
                    <Animated.ScrollView
                      ref={scrollViewRef}
                      horizontal
                      pagingEnabled
                      showsHorizontalScrollIndicator={false}>
                      {news.articleimage_url.split(',').map((img_url, idx) => (
                        <Image
                          key={idx}
                          source={{uri: img_url}}
                          style={{
                            width: 400,
                            height: height * 0.85,
                          }}
                        />
                      ))}
                    </Animated.ScrollView>
                  )}
                  {news.type === 'video' && (
                    <View style={{height: height * 0.4}}>
                      <VideoPlayer
                        source={{uri: news.articleimage_url}}
                        paused={true}
                        poster={news.videothumb}
                        disableBack={true}
                      />
                    </View>
                  )}
                  {news.type === 'news' && (
                    <View
                      style={{
                        position: 'absolute',
                        paddingVertical: 1,
                        paddingHorizontal: 13,
                        top: height * 0.285,
                        left: 15,
                        backgroundColor: 'white',
                        borderRadius: 20,
                      }}>
                      <Text
                        style={{
                          color: 'grey',
                          fontFamily: 'SansSerifBldFLF',
                        }}>
                        nangos
                      </Text>
                    </View>
                  )}
                  {news.type === 'video' && (
                    <View
                      style={{
                        position: 'absolute',
                        paddingVertical: 1,
                        paddingHorizontal: 13,
                        top: height * 0.385,
                        left: 15,
                        backgroundColor: 'white',
                        borderRadius: 20,
                      }}>
                      <Text
                        style={{
                          color: 'grey',
                          fontFamily: 'SansSerifBldFLF',
                        }}>
                        nangos
                      </Text>
                    </View>
                  )}
                  {news.type !== 'imagenews' && (
                    <View style={{paddingLeft: 5}}>
                      <Text
                        variant="headlineSmall"
                        style={{
                          color: 'black',
                          marginTop: 10,
                          fontFamily: 'SansSerifBldFLF',
                          textAlign: 'center',
                        }}>
                        {news.articletitle}
                      </Text>
                      <Text
                        variant="titleMedium"
                        style={{
                          color: 'black',
                          fontFamily: 'SansSerifFLF-Demibold',
                          fontSize: 18,
                          marginTop: 5,
                        }}>
                        {news.articlecontent}
                      </Text>
                    </View>
                  )}
                </ViewShot>
              </View>
            ))}
          </PagerView>
          {showControl ? (
            <View style={styles.bottomControlView}>
              <IconButton
                icon="share-variant-outline"
                iconColor="red"
                size={20}
                onPress={onShareScreen}
              />
              <IconButton
                icon="sync"
                iconColor="red"
                size={20}
                onPress={onRefreshScreen}
              />
              <IconButton
                icon="transfer-down"
                iconColor="red"
                size={20}
                onPress={() => setShowControl(false)}
              />
            </View>
          ) : (
            <View style={styles.bottomView}>
              <Text style={styles.bottom_text}>
                {newsList[pageIdx].category}
              </Text>
              <IconButton
                icon="transfer-up"
                iconColor="white"
                size={20}
                onPress={() => setShowControl(true)}
              />
            </View>
          )}
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: justify_content => ({
    flex: 1,
    backgroundColor: 'white',
    justifyContent: justify_content,
  }),
  viewPager: {
    flex: 1,
  },
  bottomView: {
    position: 'absolute',
    bottom: 0,
    height: 40,
    width: '100%',
    backgroundColor: '#222222',
    paddingHorizontal: 2,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  bottom_text: {
    color: '#eeeeee',
    fontSize: 16,
    justifyContent: 'center',
    fontFamily: 'SansSerifBldFLF',
  },
  bottomControlView: {
    position: 'absolute',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: 'black',
    bottom: 0,
    height: 50,
    width: '100%',
    paddingHorizontal: 10,
    backgroundColor: 'white',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
