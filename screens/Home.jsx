import {useEffect, useState, useRef, memo} from 'react';
import {
  View,
  Text,
  StyleSheet,
  BackHandler,
  useColorScheme,
  SafeAreaView,
  TouchableOpacity,
  Animated,
  Appearance,
  FlatList,
  DeviceEventEmitter,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-simple-toast';
import {Menu, Divider, Provider, Appbar} from 'react-native-paper';
import PagerView from 'react-native-pager-view';
import IonIcon from 'react-native-vector-icons/Ionicons';
import RNRestart from 'react-native-restart';
import {setupPlayer, addTracks} from '../service';
import TrackPlayer, {
  useTrackPlayerEvents,
  Event,
} from 'react-native-track-player';

// 👇 screens
import Favorites from './Favorites';
import Playlists from './Playlists';
import Tracks from './Tracks';
import Albums from './Albums';
import Artists from './Artists';
import Genres from './Genres';
import PlayerArea from './PlayerArea';

const Home = function ({navigation}) {
  const phoneDarkThemeState = useColorScheme() === 'dark';
  const [isDarkMode, setIsDarkMode] = useState(phoneDarkThemeState);
  const [useDeviceTheme, setUseDeviceTheme] = useState(true);
  const [currentPage, setCurrentPage] = useState(2);
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const [queue, setQueue] = useState([]);
  const [trackTitle, setTrackTitle] = useState('');
  const [trackArtWork, setTrackArtWork] = useState();
  const [trackArtist, setTrackArtist] = useState('');
  const [trackBlur, setTrackBlur] = useState('');
  const [canShuffle, setCanShuffle] = useState(false);
  const pagerRef = useRef(null);
  const listRef = useRef(null);

  // 👇 array of screen names
  const screen_names = [
    {id: 1, name: 'Favorites'},
    {id: 2, name: 'Playlists'},
    {id: 3, name: 'Tracks'},
    {id: 4, name: 'Albums'},
    {id: 5, name: 'Artists'},
    {id: 6, name: 'Genres'},
  ];

  // 👇 component did mount.
  useEffect(() => {
    getDarkThemeStateFromPhone();
    // BackHandler.addEventListener('hardwareBackPress', () => {
    //   BackHandler.removeEventListener('hardwareBackPress', () => true);
    //   BackHandler.exitApp();
    //   return true;
    // });

    Appearance.addChangeListener(() => {
      if (useDeviceTheme) {
        // RNRestart.restart();
        DeviceEventEmitter.emit(
          'change_kayzmusicapp_theme',
          phoneDarkThemeState,
        );
      }
    });

    const setup = async () => {
      let isSetup = await setupPlayer();

      const queue = await TrackPlayer.getQueue();
      if (isSetup && queue.length <= 0) {
        await addTracks();
      }

      // DeviceEventEmitter.addListener('onLastBatchReceived', () => {
      //   setIsPlayerReady(isSetup);
      // });
      setIsPlayerReady(isSetup);
      loadQueue();
    };

    setup();
  }, []);

  // 👇 load the current queue
  const loadQueue = async () => {
    let queue = await TrackPlayer.getQueue();
    setQueue(queue);

    let index = await TrackPlayer.getCurrentTrack();
    if (index || index >= 0) {
      let {title, artist, artwork, blur} = queue[index];
      setTrackTitle(title);
      setTrackArtist(artist);
      setTrackArtWork(artwork);
      setTrackBlur(blur);
    }
  };

  // 👇 attach an event handler for any changes e.g change track.
  // useTrackPlayerEvents([Event.PlaybackTrackChanged], async event => {
  //   if (event.type === Event.PlaybackTrackChanged && event.nextTrack != null) {
  //     // const track = await TrackPlayer.getTrack(event.nextTrack);
  //     // // const index = await TrackPlayer.getCurrentTrack();
  //     // // const track = queue[index];
  //     // const {title, artwork, artist, blur} = track;
  //     // setTrackTitle(title);
  //     // setTrackArtist(artist);
  //     // setTrackArtWork(artwork);
  //     // setTrackBlur(blur);

  //     console.log('\n\nfinally changed!!!!!!!!!!!!!');
  //   }

  //   // listRef.current.scrollToOffset({animated: false, offset: index});
  //   // console.log('testing:', Object.keys(listRef.current));
  // });

  // 👇 handler to skip to specific track
  const skipTo = async trackId => {
    if (trackId || trackId >= 0) {
      await TrackPlayer.skip(trackId);
      await TrackPlayer.play();
    }
  };

  // 👇 handler to change to next song.
  const skipToNext = () => {
    if (canShuffle) {
      let length = queue.length - 1;
      let index = Math.floor(Math.random() * length);
      skipTo(index);
    } else {
      TrackPlayer.skipToNext()
        .then(() => {})
        .catch(error => console.log(error));
    }
  };

  // 👇 handler to change to previous song.
  const skipToPrevious = () => {
    TrackPlayer.skipToPrevious()
      .then(() => {})
      .catch(error => console.log(error));
  };

  // 👇 handler to shuffle music
  async function handleShuffle(canShuffle) {
    if (canShuffle) {
      let length = queue.length - 1;
      let index = Math.floor(Math.random() * length);
      skipTo(index);
    }
    setCanShuffle(canShuffle);
  }

  // 👇 handler to sort the track by name
  const sortTracksAsendingByName = () => {
    let queue_copy = [...queue];
    queue_copy.sort((a, b) => a.title - b.title);
    setQueue(queue_copy);
    console.log('\n\nSorted!', queue_copy[0]);
  };

  // 👇 show toast message
  const showToast = msg => {
    Toast.showWithGravityAndOffset(msg, Toast.LONG, Toast.BOTTOM, 0, 100);
  };

  // 👇 save dark theme state to device storage
  const saveDarkThemeStateToPhone = async state => {
    try {
      await AsyncStorage.setItem(
        'KayzMusicApp_DarkThemeState',
        JSON.stringify(state),
      );
    } catch (error) {
      console.log(error);
      showToast('Failed to retrieve dark theme setting from device storage.');
    }
  };

  // 👇 get dark theme state from device storage
  const getDarkThemeStateFromPhone = async () => {
    try {
      let jsonDarkThemeState = await AsyncStorage.getItem(
        'KayzMusicApp_DarkThemeState',
      );
      if (useDeviceTheme) {
        setIsDarkMode(phoneDarkThemeState);
      } else {
        if (jsonDarkThemeState) {
          setIsDarkMode(JSON.parse(jsonDarkThemeState));
        }
      }
    } catch (error) {
      console.log(error);
      showToast('Failed to set dark theme setting from device storage.');
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDarkMode ? '#000' : '#eee',
    },
    appBar: {
      backgroundColor: isDarkMode ? '#000' : '#eee',
    },
    appBarContainer: {
      flex: 1,
      backgroundColor: isDarkMode ? '#000' : '#eee',
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: 10,
    },
    appNameContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    appNameText: {
      color: isDarkMode ? '#fff' : '#555',
      fontSize: 20,
    },
    rightIcons: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    searchIcon: {
      marginRight: 15,
    },
    pagerView: {
      flex: 1,
    },
    screen_names_list: {
      flexWrap: 'wrap',
      maxHeight: 40,
      alignSelf: 'flex-end',
      marginTop: 30,
      // backgroundColor: 'red',
    },
    screenItem: {
      marginHorizontal: 10,
    },
    screenItemName: {
      color: isDarkMode ? '#ccc' : '#555',
      fontSize: 16,
    },
  });

  // 👇 set page number for the pager
  const setPagerPage = num => {
    pagerRef.current?.setPage(num);
  };

  // 👇 render item for screen name
  const renderItem = ({item, index}) => (
    <TouchableOpacity
      style={styles.screenItem}
      activeOpacity={0.8}
      onPress={() => setPagerPage(index)}>
      <Text
        style={[
          styles.screenItemName,
          index === currentPage && {
            color: isDarkMode ? '#fff' : '#333',
            fontWeight: '500',
            fontSize: 20,
            borderBottomColor: 'slateblue',
            borderBottomWidth: 1,
          },
        ]}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Appbar style={styles.appBar}>
        <View style={styles.appBarContainer}>
          <View style={styles.appNameContainer}>
            <Text style={[styles.appNameText, {fontWeight: '900'}]}>Kayz</Text>
            <Text style={styles.appNameText}> Music</Text>
          </View>

          <View style={styles.rightIcons}>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('search', {
                  isDarkMode,
                  navigation,
                  queue,
                  skipToNext,
                  skipToPrevious,
                  trackTitle,
                  trackArtWork,
                  loadQueue,
                })
              }
              activeOpacity={0.5}>
              <IonIcon
                name="search-outline"
                size={25}
                color={isDarkMode ? '#fff' : '#222'}
                style={styles.searchIcon}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate('testtabs')}
              activeOpacity={0.5}>
              <IonIcon
                name="ellipsis-vertical"
                size={25}
                color={isDarkMode ? '#fff' : '#222'}
              />
            </TouchableOpacity>
          </View>
        </View>
      </Appbar>

      <FlatList
        ref={listRef}
        data={screen_names}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        bounces
        style={styles.screen_names_list}
        centerContent={true}
        contentContainerStyle={{
          alignItems: 'center',
        }}
        onScroll={e => {
          // console.log(Object.keys(e));
          // console.log(Object.keys(e.target.state));;
        }}
      />

      <View style={{flex: 1}}>
        <PagerView
          ref={pagerRef}
          style={styles.pagerView}
          initialPage={2}
          onPageSelected={async e => {
            let index = e.nativeEvent.position;
            setCurrentPage(index);
            if (index > 1 && listRef?.current?.scrollToEnd) {
              listRef.current.scrollToEnd();
            } else if (listRef?.current?.scrollToOffset && index < 3) {
              listRef.current.scrollToOffset({x: 0, y: 0, animated: false});
            }
          }}>
          <Favorites
            key={'1'}
            isDarkMode={isDarkMode}
            favorites={[]}
            queue={queue}
          />
          <Playlists
            key={'2'}
            isDarkMode={isDarkMode}
            playlists={[]}
            queue={queue}
          />
          <Tracks
            key={'3'}
            canShuffle={canShuffle}
            isDarkMode={isDarkMode}
            tracks={queue}
            handleShuffle={handleShuffle}
            sortByName={sortTracksAsendingByName}
            loadQueue={loadQueue}
          />
          <Albums
            key={'4'}
            canShuffle={canShuffle}
            isDarkMode={isDarkMode}
            navigation={navigation}
            skipToNext={skipToNext}
            skipToPrevious={skipToPrevious}
            trackTitle={trackTitle}
            trackArtWork={trackArtWork}
            handleShuffle={handleShuffle}
            skipTo={skipTo}
            queue={queue}
          />
          <Artists
            key={'5'}
            canShuffle={canShuffle}
            isDarkMode={isDarkMode}
            navigation={navigation}
            skipToNext={skipToNext}
            skipToPrevious={skipToPrevious}
            trackTitle={trackTitle}
            trackArtWork={trackArtWork}
            handleShuffle={handleShuffle}
            queue={queue}
          />
          <Genres
            key={'6'}
            isDarkMode={isDarkMode}
            navigation={navigation}
            handleShuffle={handleShuffle}
          />
        </PagerView>
      </View>

      <PlayerArea
        isDarkMode={isDarkMode}
        navigation={navigation}
        isPlayerReady={isPlayerReady}
        queue={queue}
        trackData={{trackTitle, trackArtist, trackArtWork, trackBlur}}
        skipToNext={skipToNext}
        skipToPrevious={skipToPrevious}
        handleShuffle={handleShuffle}
        canShuffle={canShuffle}
        loadQueue={loadQueue}
      />
    </SafeAreaView>
  );
};

export default memo(Home);
