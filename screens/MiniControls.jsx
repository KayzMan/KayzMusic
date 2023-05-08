import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Image,
} from 'react-native';
import React, {useState, useEffect, useRef} from 'react';
import IonIcon from 'react-native-vector-icons/Ionicons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import TrackPlayer, {
  usePlaybackState,
  State,
  Event,
  useTrackPlayerEvents,
} from 'react-native-track-player';
import MarqueeText from 'react-native-marquee';
import RNFS from 'react-native-fs';
import {COLORS, SIZES} from '../constants';
import {BlurView} from '@react-native-community/blur';

export default function MiniControls({
  isDarkMode,
  onPress,
  miniTrackTitle,
  skipToNext,
  skipToPrevious,
  miniTrackArtWork,
}) {
  const playState = usePlaybackState() === 'playing';
  const [trackTitle, setTrackTitle] = useState(miniTrackTitle);
  const [trackArtWork, setTrackArtWork] = useState(miniTrackArtWork);
  const [isPlaying, setIsPlaying] = useState(State.Playing);
  const viewRef = useRef();

  // 👇 component did mount
  useEffect(() => {
    UpdateCurrentTrackDetails();
    console.log('\nmini artwork:', trackArtWork, trackArtWork?.uri);
  }, []);

  // 👇 handler to setup values for the current track
  const UpdateCurrentTrackDetails = async () => {
    const index = await TrackPlayer.getCurrentTrack();
    const track = await TrackPlayer.getTrack(index);
    const {title, artwork} = track;
    setTrackTitle(title);
    setTrackArtWork(artwork);
  };

  // 👇 handler for the play_pause button
  const handlePlayPausePress = async () => {
    if ((await TrackPlayer.getState()) === State.Playing) {
      TrackPlayer.pause();
      setIsPlaying(false);
    } else {
      TrackPlayer.play();
      setIsPlaying(true);
    }
  };

  // 👇 attach an event handler for any changes e.g change track.
  useTrackPlayerEvents([Event.PlaybackTrackChanged], async event => {
    if (event.type === Event.PlaybackTrackChanged && event.nextTrack != null) {
      const track = await TrackPlayer.getTrack(event.nextTrack);
      const {title, artwork} = track;
      setTrackTitle(title);
      setTrackArtWork(artwork);
    }
    setIsPlaying(State.Playing);
    console.log('\n\n i in mini controls responded!');
  });

  // 👇 attach an event listener when player in notification area's play button is pressed
  TrackPlayer.addEventListener(Event.RemotePlay, () => {
    setIsPlaying(true);
  });

  // 👇 attach an event listener when player in notification area's pause button is pressed
  TrackPlayer.addEventListener(Event.RemotePause, () => {
    setIsPlaying(false);
  });

  // handler to check if a file path exists on device
  const checkIfCoverExists = filePath => {
    if (filePath) {
      RNFS.exists(filePath)
        .then(result => {
          // console.log('\ncover exists:', result);
          return result;
        })
        .catch(error => console.log(error));
    } else return false;
  };

  // 👇 styles
  const styles = StyleSheet.create({
    container: {
      // backgroundColor: COLORS.primary,
      // backgroundColor: 'rgba(0, 0, 0, 1.23)',
      position: 'absolute',
      bottom: 8,
      // bottom: 3,
      flex: 1,
      left: 0,
      right: 0,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderRadius: 35,
      // paddingVertical: 10,
      height: 60,
      // paddingRight: 10,
      // borderColor: isDarkMode ? COLORS.emptyBlack : COLORS.emptyWhite,
      // borderWidth: 1,
    },
    backImage: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: 35,
      height: '100%',
      width: '100%',
      right: 0,
    },
    noteIcon: {
      backgroundColor: COLORS.secondary,
      paddingVertical: 12,
      paddingHorizontal: 12,
      borderRadius: 40,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 10,
      marginLeft: 10,
      width: 45,
      height: 45,
    },
    iconImage: {
      width: 45,
      height: 45,
      paddingVertical: 12,
      paddingHorizontal: 12,
      borderRadius: 40,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 10,
      marginLeft: 10,
      position: 'absolute',
      left: 0,
      bottom: 5,
      zIndex: 10000,
    },
    songNameContainer: {
      maxWidth: '45%',
      width: '45%',
      marginLeft: 60,
    },
    songName: {
      color: COLORS.white_eee,
      fontSize: 16,
    },
    controlBtns: {
      flexDirection: 'row',
      justifyContent: 'space-evenly',
      alignItems: 'center',
      flex: 1,
      elevation: 5,
      zIndex: 1000,
    },
    icon: {
      marginHorizontal: 5,
    },
  });

  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      {trackArtWork ? (
        <Image
          source={{
            uri: trackArtWork?.uri ? trackArtWork.uri : trackArtWork,
          }}
          style={styles.iconImage}
          resizeMode="cover"
          resizeMethod="resize"
        />
      ) : (
        <Image
          source={require('../assets/girl.jpg')}
          style={styles.iconImage}
          resizeMode="cover"
          resizeMethod="resize"
        />
      )}

      <ImageBackground
        blurRadius={2000}
        borderRadius={35}
        resizeMode="cover"
        resizeMethod="resize"
        source={{
          uri: trackArtWork?.uri ? trackArtWork.uri : trackArtWork,
        }}
        // style={styles.container}
        style={styles.backImage}>
        <View style={styles.songNameContainer}>
          <MarqueeText
            style={[styles.songName]}
            speed={0.1}
            marqueeOnStart
            loop
            delay={100}
            numberOfLines={1}>
            {trackTitle}
          </MarqueeText>
        </View>

        <View style={styles.controlBtns}>
          <TouchableOpacity activeOpacity={0.5} onPress={skipToPrevious}>
            <IonIcon
              name="play-back"
              size={20}
              color={COLORS.white_eee}
              style={styles.icon}
            />
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.5} onPress={handlePlayPausePress}>
            <IonIcon
              // name={playState ? 'pause' : 'play'}
              name={playState ? 'pause' : 'play'}
              size={25}
              color={COLORS.white_eee}
              style={[styles.icon]}
            />
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.5} onPress={skipToNext}>
            <IonIcon
              name="play-forward"
              size={20}
              color={COLORS.white_eee}
              style={styles.icon}
            />
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.5} onPress={() => {}}>
            <SimpleLineIcons
              name="playlist"
              size={20}
              color={COLORS.white_eee}
              style={styles.icon}
            />
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
}
