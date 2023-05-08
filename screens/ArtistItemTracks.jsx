import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import IonIcon from 'react-native-vector-icons/Ionicons';
import MaterialCommIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import TrackPlayer from 'react-native-track-player';
import RNFS from 'react-native-fs';
import {COLORS, SIZES} from '../constants';

// helper components
import ArtistitemTrackItem from '../components/ArtistitemTrackItem';
import MiniControls from './MiniControls';

export default function ArtistItemTracks({
  navigation,
  route: {
    params: {
      isDarkMode,
      tracks,
      skipToPrevious,
      skipToNext,
      trackArtWork,
      trackTitle,
      cover,
      album,
      artist,
      handleShuffle,
    },
  },
}) {
  const [canShuffle, setCanShuffle] = useState(false);

  // 👇 handler to load only tracks in current alum
  const loadArtistTracks = async trackId => {
    await TrackPlayer.reset();
    tracks.forEach(async item => {
      await TrackPlayer.add({
        id: item.id,
        url: item.path,
        title: item?.title ? item?.title : 'Audio File',
        artist: item?.artist ? item?.artist : 'Unknown Artist',
        artwork: cover
          ? cover?.includes('null')
            ? require('../assets/girl.jpg')
            : cover
          : require('../assets/girl.jpg'),
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
    loadArtistTracks(trackId);
  };

  checkIfCoverExists = filePath => {
    if (filePath) {
      RNFS.exists(filePath)
        .then(data => {
          // console.log('success :', data);
          return data;
        })
        .catch(error => console.log(error));
    } else return false;
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDarkMode ? COLORS.black : COLORS.white,
      borderTopLeftRadius: 30,
      borderTopRightRadius: 30,
      borderTopWidth: 1,
      borderColor: 'transparent',
      paddingBottom: 100,
    },
    emptyContainer: {
      flex: 1,
      backgroundColor: isDarkMode ? COLORS.black : COLORS.white,
      alignItems: 'center',
      justifyContent: 'center',
      borderTopLeftRadius: 30,
      borderTopRightRadius: 30,
      borderTopWidth: 1,
      borderColor: 'transparent',
    },
    emptyText: {
      textAlign: 'center',
      maxWidth: '80%',
      lineHeight: 22,
      color: isDarkMode ? COLORS.emptyWhite : COLORS.emptyBlack,
    },
    tracksControl: {
      flexDirection: 'row',
      alignItems: 'center',
      alignSelf: 'flex-end',
      paddingHorizontal: 15,
      marginTop: 15,
      marginBottom: 10,
    },
    topImage: {
      // backgroundColor: isDarkMode ? '#000' : '#fff',
      alignItems: 'center',
      flexDirection: 'row',
      marginLeft: 15,
    },
    coverNoteIcon: {
      width: 80,
      height: 80,
      marginBottom: 10,
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: isDarkMode ? COLORS.black444 : COLORS.white_ccc,
    },
    coverImage: {
      width: 80,
      height: 80,
      marginBottom: 10,
      borderRadius: 10,
    },
    albumName: {
      paddingHorizontal: 15,
      marginTop: 15,
      marginBottom: 30,
      marginBottom: 10,
      lineHeight: 20,
      color: isDarkMode ? COLORS.white : COLORS.black222,
      maxWidth: '80%',
      fontSize: 15,
    },
    icon: {
      marginLeft: 10,
    },
    bottom: {
      backgroundColor: isDarkMode ? COLORS.black : COLORS.white,
      borderTopLeftRadius: 30,
      borderTopRightRadius: 30,
      borderTopWidth: 1,
      borderColor: 'transparent',
      paddingBottom: 15,
      paddingHorizontal: 15,
    },
    divider: {
      backgroundColor: isDarkMode ? COLORS.black555 : COLORS.emptyWhite,
      height: 0.5,
      width: '91%',
      alignSelf: 'flex-end',
    },
  });

  return tracks?.length <= 0 ? (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>tracks will appear here...</Text>
    </View>
  ) : (
    <View style={styles.container}>
      {/* tracks controls section */}
      <View style={styles.tracksControl}>
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={() => {
            // setCanShuffle(!canShuffle);
            // handleShuffle(true);
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

      {/* top image section */}
      <View style={styles.topImage}>
        {cover?.includes('null') || !checkIfCoverExists(cover) ? (
          <TouchableOpacity
            activeOpacity={1}
            style={styles.coverNoteIcon}
            onPress={() => {}}>
            <IonIcon
              name="musical-note"
              size={30}
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

        <Text style={styles.albumName} numberOfLines={1}>
          {artist ? artist : 'Unknown Artist'}
        </Text>
      </View>

      <FlatList
        data={tracks}
        renderItem={({item, index}) => (
          <ArtistitemTrackItem
            item={item}
            index={index}
            isDarkMode={isDarkMode}
            skipTo={skipTo}
          />
        )}
        keyExtractor={item => `artistItemTrackItem-#${item.id}`}
        ItemSeparatorComponent={() => <Text style={styles.divider} />}
        style={styles.bottom}
      />
      <MiniControls
        isDarkMode={isDarkMode}
        onPress={() => {}}
        skipToNext={skipToNext}
        skipToPrevious={skipToPrevious}
        queue={[]}
        miniTrackTitle={trackTitle}
        miniTrackArtWork={trackArtWork}
      />
    </View>
  );
}
