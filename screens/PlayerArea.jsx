import {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  Image,
  Dimensions,
  ImageBackground,
  Animated,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import IonIcon from 'react-native-vector-icons/Ionicons';
import SimpleLineIcon from 'react-native-vector-icons/SimpleLineIcons';
import EvilIcon from 'react-native-vector-icons/EvilIcons';
import MaterialCommIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import TrackPlayer, {
  RepeatMode,
  State,
  usePlaybackState,
  useProgress,
  Event,
  useTrackPlayerEvents,
} from 'react-native-track-player';
import Slider from '@react-native-community/slider';
import {BlurView} from '@react-native-community/blur';
import {COLORS, SIZES} from '../constants';

// 👇 screens
import MiniControls from './MiniControls';

let {width} = Dimensions.get('window');

export default function PlayerArea({
  isDarkMode,
  navigation,
  isPlayerReady,
  queue,
  handleShuffle,
  skipToNext,
  skipToPrevious,
  canShuffle,
}) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [repeatMode, setRepeatMode] = useState('repeat');
  const [miniPlayerVisible, setMiniPlayerVisible] = useState(true);
  let playbackState = usePlaybackState() === 'playing';
  const {position, duration} = useProgress();
  const [showRemaining, setShowRemaining] = useState(false);
  const [isPlaying, setIsPlaying] = useState(State.Playing);
  const [trackTitle, setTrackTitle] = useState('');
  const [trackArtWork, setTrackArtWork] = useState();
  const [trackArtist, setTrackArtist] = useState('');
  const viewRef = useRef();
  const scale = useRef(new Animated.Value(1)).current;

  const animate = () => {
    Animated.spring(scale, {
      toValue: playbackState ? 0.9 : 1,
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    if (!miniPlayerVisible) {
      navigation.setOptions({
        statusBarColor: isDarkMode ? COLORS.black111 : COLORS.white,
        statusBarStyle: isDarkMode ? 'light' : 'dark',
      });
    } else {
      navigation.setOptions({
        statusBarColor: isDarkMode ? COLORS.black : COLORS.white_eee,
        statusBarStyle: isDarkMode ? 'light' : 'dark',
      });
    }
  }, [navigation, miniPlayerVisible]);

  // 👇 attach an event handler for any changes e.g change track.
  useTrackPlayerEvents([Event.PlaybackTrackChanged], async event => {
    if (event.type === Event.PlaybackTrackChanged && event.nextTrack != null) {
      const track = await TrackPlayer.getTrack(event.nextTrack);
      // const index = await TrackPlayer.getCurrentTrack();
      // const track = queue[index];
      const {title, artwork, artist} = track;
      setTrackTitle(title);
      setTrackArtist(artist);
      setTrackArtWork(artwork);
    }
  });

  // 👇 format the progress time
  const formatProgressTime = seconds => {
    let hrs = parseInt(seconds / 3600)
      .toString()
      .padStart(2, '0');
    let mins = Math.round((Math.trunc(seconds) % 3600) / 60)
      .toString()
      .padStart(2, '0');
    let secs = Math.trunc(mins).toString().padStart(2, '0');
    if (hrs > 0) {
      return `${hrs}:${mins}:${secs}`;
    } else {
      return `${mins}:${secs}`;
    }
  };

  // 👇 format the progress time
  const formatTime = milli_seconds => {
    let days,
      hours,
      minutes,
      seconds = 0;
    hours = Math.floor(milli_seconds / 3600000);
    days = Math.floor(hours / 24);
    remainder = milli_seconds % 3600000;
    minutes = Math.floor(remainder / 60000);
    remainder = remainder % 60000;
    seconds = Math.floor(remainder / 1000);
    remainder = remainder % 1000;

    let result = [];
    days > 0 && result.push(days);
    hours > 0 && result.push(hours);
    minutes >= 0 && result.push(minutes);
    seconds >= 0 && result.push(seconds);

    result = result.map(item => item.toString().padStart(2, '0'));

    return result.join(':');
  };

  // 👇 handler for play/pause button
  const handlePlayPausePress = async () => {
    animate();

    if ((await TrackPlayer.getState()) === State.Playing) {
      TrackPlayer.pause();
      setIsPlaying(false);
    } else {
      TrackPlayer.play();
      setIsPlaying(true);
    }
  };

  // 👇 handler to return icon name depending on set repeat Mode.
  const repeatIcon = () => {
    if (repeatMode === 'off') {
      return 'repeat-off';
    }
    if (repeatMode === 'track') {
      return 'repeat-once';
    }
    if (repeatMode === 'repeat') {
      return 'repeat';
    }
  };

  // 👇 handler to change repeatMode
  const changeRepeatMode = () => {
    if (repeatMode === 'off') {
      setRepeatMode('track');
      TrackPlayer.setRepeatMode(RepeatMode.Track);
    }
    if (repeatMode === 'track') {
      setRepeatMode('repeat');
      TrackPlayer.setRepeatMode(RepeatMode.Queue);
    }
    if (repeatMode === 'repeat') {
      setRepeatMode('off');
      TrackPlayer.setRepeatMode(RepeatMode.Off);
    }
  };

  // 👇 attach an event handler for any changes e.g change track.
  useTrackPlayerEvents([Event.PlaybackTrackChanged], async event => {
    if (event.type === Event.PlaybackTrackChanged && event.nextTrack != null) {
      setIsPlaying(State.Playing);
    }
  });

  // 👇 attach an event listener when player in notification area's play button is pressed
  TrackPlayer.addEventListener(Event.RemotePlay, () => {
    setIsPlaying(true);
  });

  // 👇 attach an event listener when player in notification area's pause button is pressed
  TrackPlayer.addEventListener(Event.RemotePause, () => {
    setIsPlaying(false);
  });

  // 👇️ handler to rewind by 10 secs
  const rewind = async () => {
    await TrackPlayer.seekTo(position - 10);
  };

  // 👇️ handler to fast-forward by 30 secs
  const fastForward = async () => {
    await TrackPlayer.seekTo(position + 30);
  };

  // 👇 styles
  const styles = StyleSheet.create({
    loadingContainer: {
      flex: 1,
      position: 'absolute',
      zIndex: 1000,
      bottom: 0,
      left: 0,
      right: 0,
      top: 0,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(0, 0, 0, .7)',
    },
    container: {
      flex: 1,
      position: 'absolute',
      zIndex: 1000,
      bottom: 0,
      left: 0,
      right: 0,
      top: 0,
      // backgroundColor: 'rgba(0, 0, 0, .9)',
    },
    topIcons: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 30,
      paddingHorizontal: 10,
    },
    right: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    audioIcon: {
      marginRight: 10,
    },
    songSliderList: {
      maxHeight: 300,
    },
    songArtworkMainWrapper: {
      marginTop: 20,
      marginBottom: 6,
      width: width,
      justifyContent: 'center',
      alignItems: 'center',
    },
    songArtworkContainer: {
      width: '90%',
      height: 300,
      borderRadius: 10,
      elevation: 5,
    },
    songArtwork: {
      width: '100%',
      height: '100%',
      alignSelf: 'stretch',
      borderRadius: 10,
    },
    songContentContaier: {
      alignSelf: 'center',
      width: '90%',
      marginTop: 10,
      // backgroundColor: 'blue',
    },
    songContent: {
      fontSize: 16,
      color: isDarkMode ? COLORS.white_eee : COLORS.black222,
      // backgroundColor: 'green',
    },
    songTitle: {
      fontSize: 20,
      maxWidth: '100%',
      // width: '100%',
      // alignItems: 'center',
      alignSelf: 'center',
      // textAlign: 'center',
      // backgroundColor: 'red',
      color: COLORS.white_eee,
    },
    songArtist: {
      // color: isDarkMode ? COLORS.white_aaa : COLORS.black555,
      color: COLORS.white_aaa,
      marginTop: 10,
      alignSelf: 'center',
    },
    bottom: {
      position: 'absolute',
      bottom: 60,
      left: 10,
      right: 10,
    },
    bottomTop: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 0,
      marginHorizontal: 10,
    },
    sliderContainer: {
      marginVertical: 30,
      marginBottom: 10,
    },
    progressContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginHorizontal: 15,
    },
    position: {
      color: COLORS.white_ccc,
    },
    duration: {
      color: COLORS.white_ccc,
    },
    progressBar: {
      marginBottom: 5,
      flexDirection: 'row',
    },
    controlBtnsContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginHorizontal: 20,
    },
    icon: {
      color: isDarkMode ? COLORS.white_eee : COLORS.white_ccc,
    },
    rewind_fastForwardContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-around',
      marginTop: 0,
      marginHorizontal: 20,
      marginBottom: 20,
    },
  });

  if (isPlayerReady) {
    return miniPlayerVisible ? (
      <MiniControls
        isDarkMode={isDarkMode}
        onPress={() => setMiniPlayerVisible(false)}
        skipToNext={skipToNext}
        skipToPrevious={skipToPrevious}
        queue={queue}
        miniTrackTitle={trackTitle}
        miniTrackArtWork={trackArtWork}
      />
    ) : (
      <ImageBackground
        source={{
          uri: trackArtWork?.uri ? trackArtWork.uri : trackArtWork,
        }}
        blurRadius={80}
        resizeMode="cover"
        resizeMethod="resize"
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          top: 0,
        }}>
        <BlurView
          blurType="extraDark"
          blurAmount={20000}
          viewRef={viewRef}
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            top: 0,
          }}
        />

        <View ref={viewRef} style={{flex: 1}}>
          {/* Top icons section */}
          <View style={styles.topIcons}>
            <TouchableOpacity
              activeOpacity={0.5}
              onPress={() => setMiniPlayerVisible(true)}>
              <EvilIcon
                name="chevron-down"
                // color={isDarkMode ? COLORS.white : COLORS.black222}
                color={COLORS.white}
                size={50}
              />
            </TouchableOpacity>

            <View style={styles.right}>
              <TouchableOpacity activeOpacity={0.5} onPress={() => {}}>
                <IonIcon
                  name="volume-high-outline"
                  // color={isDarkMode ? COLORS.white : COLORS.black222}
                  color={COLORS.white}
                  size={22}
                  style={styles.audioIcon}
                />
              </TouchableOpacity>
              <TouchableOpacity activeOpacity={0.5} onPress={() => {}}>
                <IonIcon
                  name="ellipsis-vertical"
                  size={22}
                  // color={isDarkMode ? COLORS.white : COLORS.black222}
                  color={COLORS.white}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Song Artwork section */}
          <View style={styles.songArtworkMainWrapper} activeOpacity={0.8}>
            <Animated.View
              style={[styles.songArtworkContainer, {transform: [{scale}]}]}>
              {trackArtWork ? (
                <Image
                  source={{
                    uri: trackArtWork?.uri ? trackArtWork.uri : trackArtWork,
                  }}
                  style={styles.songArtwork}
                  resizeMode="stretch"
                  resizeMethod="resize"
                />
              ) : (
                <Image
                  source={require('../assets/girl.jpg')}
                  style={styles.songArtwork}
                  resizeMode="stretch"
                  resizeMethod="resize"
                />
              )}
            </Animated.View>
          </View>

          {/* Song Name and Artist and details... section */}
          <View style={styles.songContentContaier}>
            <Text
              style={[styles.songContent, styles.songTitle]}
              numberOfLines={2}>
              {trackTitle ? trackTitle : 'Song Track'}
            </Text>
            <Text
              style={[styles.songContent, styles.songArtist]}
              numberOfLines={1}>
              {trackArtist ? trackArtist : 'Unknown Artist'}
            </Text>
          </View>

          {/* Bottom section */}
          <View style={styles.bottom}>
            {/* PlayList, Like and Add section */}
            <View style={styles.bottomTop}>
              <TouchableOpacity activeOpacity={0.5} onPress={() => {}}>
                <SimpleLineIcon
                  name="playlist"
                  size={SIZES.iconSize}
                  color={COLORS.white_eee}
                  style={styles.icon}
                />
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.5}
                onPress={() => setIsFavorite(!isFavorite)}>
                <MaterialCommIcon
                  name={isFavorite ? 'heart' : 'heart-outline'}
                  size={SIZES.iconSize}
                  color={isFavorite ? COLORS.white_eee : COLORS.white}
                  style={styles.icon}
                />
              </TouchableOpacity>
              <TouchableOpacity activeOpacity={0.5} onPress={() => {}}>
                <MaterialCommIcon
                  name="plus"
                  size={30}
                  color={COLORS.white_eee}
                  style={styles.icon}
                />
              </TouchableOpacity>
            </View>

            {/* The Slider section */}
            <View style={styles.sliderContainer}>
              <Slider
                value={position}
                maximumValue={duration}
                onSlidingComplete={async value => {
                  await TrackPlayer.seekTo(value);
                }}
                thumbTintColor={COLORS.white}
                minimumTrackTintColor={COLORS.white}
                maximumTrackTintColor={COLORS.white_aaa}
                style={styles.progressBar}
              />
              <View style={styles.progressContainer}>
                <Text style={styles.position}>
                  {/* {new Date(position * 1000)
                    .toLocaleTimeString()
                    .substring(2, 8)} */}
                  {formatTime(position * 1000)}
                </Text>
                {showRemaining ? (
                  <Text
                    style={styles.duration}
                    onPress={() => setShowRemaining(!showRemaining)}>
                    {/* {new Date((duration - position) * 1000)
                      .toLocaleTimeString()
                      .substring(2, 8)} */}
                    {formatTime((duration - position) * 1000)}
                  </Text>
                ) : (
                  <Text
                    style={styles.duration}
                    onPress={() => setShowRemaining(!showRemaining)}>
                    {/* {new Date(duration * 1000)
                      .toLocaleTimeString()
                      .substring(2, 8)} */}
                    {formatTime(duration * 1000)}
                  </Text>
                )}
              </View>
            </View>

            {/* rewind and fast forward section */}
            <View style={styles.rewind_fastForwardContainer}>
              <MaterialIcon
                name="replay-10"
                size={35}
                color={COLORS.white_eee}
                onPress={rewind}
              />
              <MaterialIcon
                name="forward-30"
                size={35}
                color={COLORS.white_eee}
                onPress={fastForward}
              />
            </View>

            {/* The control buttons section */}
            <View style={styles.controlBtnsContainer}>
              <TouchableOpacity
                activeOpacity={0.5}
                onPress={() => {
                  handleShuffle(!canShuffle);
                }}>
                <MaterialCommIcon
                  name={canShuffle ? 'shuffle-variant' : 'shuffle-disabled'}
                  size={SIZES.iconSize}
                  color={COLORS.white_eee}
                  style={styles.icon}
                />
              </TouchableOpacity>
              <TouchableOpacity activeOpacity={0.5} onPress={skipToPrevious}>
                <IonIcon
                  name="play-back"
                  size={SIZES.iconSize}
                  color={COLORS.white_eee}
                  style={styles.icon}
                />
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.5}
                onPress={handlePlayPausePress}>
                <IonIcon
                  name={playbackState ? 'pause' : 'play'}
                  size={35}
                  color={COLORS.white_eee}
                  style={[styles.icon]}
                />
              </TouchableOpacity>
              <TouchableOpacity activeOpacity={0.5} onPress={skipToNext}>
                <IonIcon
                  name="play-forward"
                  size={SIZES.iconSize}
                  color={COLORS.white_eee}
                  style={styles.icon}
                />
              </TouchableOpacity>
              <TouchableOpacity activeOpacity={0.5} onPress={changeRepeatMode}>
                <MaterialCommIcon
                  name={repeatIcon()}
                  size={SIZES.iconSize}
                  color={
                    repeatMode === 'off' ? COLORS.white_aaa : COLORS.white_eee
                  }
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ImageBackground>
    );
  } else {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size={'large'} color={COLORS.white_bbb} />
      </SafeAreaView>
    );
  }
}
