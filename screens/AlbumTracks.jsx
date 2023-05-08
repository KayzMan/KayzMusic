import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  TouchableOpacity,
  Image,
  LogBox,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import TrackPlayer from 'react-native-track-player';
import MusicFiles from '@yajanarao/react-native-get-music-files';
import MaterialCommIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import IonIcon from 'react-native-vector-icons/Ionicons';
import EvilIcon from 'react-native-vector-icons/EvilIcons';
import {SIZES, COLORS} from '../constants';

// helper components
import AlbumTrack from '../components/AlbumTrack';
import MiniControls from './MiniControls';
import PlayerArea from './PlayerArea';

export default function AlbumTracks({
  navigation,
  route: {
    params: {
      album,
      index,
      cover,
      isDarkMode,
      handleShuffle,
      author,
      queue,
      skipToNext,
      skipToPrevious,
      trackTitle,
      trackArtWork,
      hasCover,
    },
  },
}) {
  const [tracks, setTracks] = useState([]);
  const [canShuffle, setCanShuffle] = useState(false);
  const [totalTime, setTotalTime] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [miniPlayerVisible, setMiniPlayerVisible] = useState(true);

  useEffect(() => {
    MusicFiles.getSongs({album: album})
      .then(data => {
        // console.log('\n\nsongs:', data);
        setTracks(data);
        let total_time = data.reduce(
          (prev, curr) => Number(curr.duration) + Number(prev),
          0,
        );
        setTotalTime(total_time);
      })
      .catch(error => console.log(error));

    LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
  }, []);

  useEffect(() => {
    navigation.setOptions({
      headerStyle: {
        backgroundColor: isDarkMode ? COLORS.black : COLORS.white,
      },
      title: '',
      headerLeft: () => headerLeftView(),
      headerRight: () => headerRightView(),
    });
  }, [navigation]);

  const headerLeftView = () => (
    <TouchableOpacity activeOpacity={0.5} onPress={() => navigation.goBack()}>
      <EvilIcon
        name="chevron-left"
        color={isDarkMode ? COLORS.white_eee : COLORS.black222}
        size={50}
      />
    </TouchableOpacity>
  );

  const headerRightView = () => (
    <View style={styles.headerRight_RightIcons}>
      <TouchableOpacity
        activeOpacity={0.5}
        onPress={() => setIsFavorite(!isFavorite)}>
        <MaterialCommIcon
          name={isFavorite ? 'heart' : 'heart-outline'}
          size={SIZES.iconSize}
          color={isDarkMode ? COLORS.white_eee : COLORS.black222}
          style={styles.icon}
        />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => {}} activeOpacity={0.5}>
        <IonIcon
          name="search-outline"
          size={25}
          color={isDarkMode ? COLORS.white_eee : COLORS.black222}
          style={styles.searchIcon}
        />
      </TouchableOpacity>

      <TouchableOpacity activeOpacity={0.5} onPress={() => {}}>
        <IonIcon
          name="ellipsis-vertical"
          size={22}
          color={isDarkMode ? COLORS.white_eee : COLORS.black222}
        />
      </TouchableOpacity>
    </View>
  );

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

    if (result.length >= 4) {
      let first = result[0].toString() + 'd, ';
      result = result.slice(1).map(item => item.toString().padStart(2, '0'));
      return first + result.join(':');
    } else {
      result = result.map(item => item.toString().padStart(2, '0'));
      return result.join(':');
    }
  };

  // 👇 handler to load only tracks in current alum
  const loadAlbumTracks = async trackId => {
    await TrackPlayer.reset();
    tracks.forEach(async item => {
      await TrackPlayer.add({
        id: item.id,
        url: item.path,
        title: item.title,
        artist: item?.artist ? item?.artist : 'Unknown Artist',
        artwork: cover.includes('null') ? require('../assets/girl.jpg') : cover,
        album: item?.album ? item?.album : 'Unknown Albumn',
        genre: item?.genre ? item?.genre : 'Unknown Genre',
        duration: item.duration,
      });
    });
    await TrackPlayer.skip(trackId);
    await TrackPlayer.play();
  };

  // 👇 handler to skip to specific track
  const skipTo = async trackId => {
    loadAlbumTracks(trackId);
  };

  // 👇 styles
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDarkMode ? COLORS.black111 : COLORS.white_eee,
      // backgroundColor: isDarkMode ? COLORS.black : COLORS.white,
      // paddingBottom: 80,
      // backgroundColor: 'red',
    },
    top: {
      flex: 1 / 1.4,
      // backgroundColor: isDarkMode ? COLORS.black : COLORS.white,
      backgroundColor: isDarkMode ? COLORS.black111 : COLORS.white_eee,
      alignItems: 'center',
    },
    headerRight_RightIcons: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    searchIcon: {
      marginHorizontal: 15,
    },
    coverNoteIcon: {
      width: 160,
      height: 160,
      marginTop: 20,
      marginBottom: 10,
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: isDarkMode ? COLORS.black444 : COLORS.white_ccc,
    },
    coverImage: {
      width: 160,
      height: 160,
      marginTop: 20,
      marginBottom: 10,
      borderRadius: 10,
    },
    albumName: {
      paddingHorizontal: 15,
      marginTop: 15,
      marginBottom: 30,
      textAlign: 'center',
      marginBottom: 10,
      lineHeight: 20,
      color: isDarkMode ? COLORS.white : COLORS.black222,
      maxWidth: '80%',
      fontSize: 16,
      // fontWeight: '500',
    },
    author: {
      color: isDarkMode ? COLORS.white_ccc : COLORS.black555,
    },
    totalTime: {
      color: isDarkMode ? COLORS.emptyWhite : COLORS.emptyBlack,
      marginTop: 2,
    },
    tracksControl: {
      flexDirection: 'row',
      alignItems: 'center',
      alignSelf: 'flex-end',
      paddingHorizontal: 15,
      marginTop: 15,
      marginBottom: 30,
    },
    icon: {
      marginLeft: 10,
    },
    bottom: {
      flex: 1,
      backgroundColor: isDarkMode
        ? COLORS.pageBackgroundDark
        : COLORS.pageBackgroundLight,
      borderTopLeftRadius: 30,
      borderTopRightRadius: 30,
      borderTopWidth: 1,
      borderColor: 'transparent',
      paddingBottom: 15,
      paddingBottom: 100,
      marginTop: 50,
    },
    tracks: {
      paddingHorizontal: 15,
    },
    divider: {
      backgroundColor: isDarkMode ? COLORS.black555 : COLORS.emptyWhite,
      height: 0.5,
      width: '91%',
      alignSelf: 'flex-end',
    },
  });

  return (
    <View style={styles.container}>
      {/* top image section */}
      <View style={styles.top}>
        {cover.includes('null') || !hasCover ? (
          <TouchableOpacity
            activeOpacity={1}
            style={styles.coverNoteIcon}
            onPress={() => {}}>
            <IonIcon
              name="musical-note"
              size={80}
              color={isDarkMode ? COLORS.white_eee : COLORS.black555}
            />
          </TouchableOpacity>
        ) : (
          <Image
            source={{uri: cover}}
            resizeMode="cover"
            style={styles.coverImage}
          />
        )}

        <Text style={styles.albumName}>{album}</Text>

        <Text style={styles.author}>{author}</Text>

        <Text style={styles.totalTime}>{formatTime(totalTime)}</Text>
      </View>

      <View style={styles.bottom}>
        <View style={styles.tracksControl}>
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => {
              setCanShuffle(!canShuffle);
              handleShuffle(true);
            }}>
            <MaterialCommIcon
              name={'shuffle-variant'}
              size={SIZES.iconSize}
              color={
                isDarkMode
                  ? COLORS.trackControlIconDark
                  : COLORS.trackControlIconLight
              }
              style={styles.icon}
            />
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.5} onPress={() => skipTo(0)}>
            <IonIcon
              name={'play-circle'}
              size={25}
              color={
                isDarkMode
                  ? COLORS.trackControlIconDark
                  : COLORS.trackControlIconLight
              }
              style={[styles.icon]}
            />
          </TouchableOpacity>
        </View>

        <FlatList
          data={tracks}
          renderItem={({item, index}) => (
            <AlbumTrack
              item={item}
              isDarkMode={isDarkMode}
              index={index}
              skipTo={skipTo}
              queue={queue}
            />
          )}
          keyExtractor={item => `track-#${item.id}`}
          ItemSeparatorComponent={() => <Text style={styles.divider} />}
          style={styles.tracks}
        />
      </View>

      <MiniControls
        isDarkMode={isDarkMode}
        onPress={() => {}}
        skipToNext={skipToNext}
        skipToPrevious={skipToPrevious}
        queue={queue}
        miniTrackTitle={trackTitle}
        miniTrackArtWork={trackArtWork}
      />

      {/* {miniPlayerVisible ? (
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
        <PlayerArea
          isDarkMode={isDarkMode}
          skipToNext={skipToNext}
          skipToPrevious={skipToPrevious}
          canShuffle={canShuffle}
          handleShuffle={handleShuffle}
          isPlayerReady={true}
          navigation={navigation}
          queue={queue}
        />
      )} */}
    </View>
  );
}
