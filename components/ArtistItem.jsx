import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import React, {useEffect, useState} from 'react';
import MusicFiles from '@yajanarao/react-native-get-music-files';
import MaterialCommIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import IonIcon from 'react-native-vector-icons/Ionicons';
import RNFS from 'react-native-fs';
import {COLORS, SIZES} from '../constants';

const ArtistItem = ({
  item,
  isDarkMode,
  index,
  navigation,
  skipToPrevious,
  skipToNext,
  trackArtWork,
  trackTitle,
  handleShuffle,
  canShuffle,
  queue,
}) => {
  // const [current, setCurrent] = useState(false);
  const [albums, setAlbums] = useState([]);
  const [tracks, setTracks] = useState([]);

  useEffect(() => {
    MusicFiles.getAlbums({artist: item.artist})
      .then(data => {
        setAlbums(data);
        // console.log('\n\nalbums by artist:', item.artist, data);
      })
      .catch(error => console.log(error));
    MusicFiles.getSongs({artist: item.artist})
      .then(data => {
        setTracks(data);
        // console.log('\n\ntracks', data);
      })
      .catch(error => console.log(error));
  }, []);

  checkIfCoverExists = filePath => {
    RNFS.exists(filePath)
      .then(data => {
        // console.log('success :', data);
        return data;
      })
      .catch(error => console.log(error));
  };

  // 👇 styles
  const styles = StyleSheet.create({
    item: {
      flexDirection: 'row',
      marginVertical: 10,
    },
    noteIcon: {
      backgroundColor: isDarkMode ? '#252525' : COLORS.white_eee,
      paddingHorizontal: 15,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 15,
      borderRadius: 10,
      width: 50,
      height: 50,
    },
    iconImage: {
      width: 50,
      height: 50,
      marginRight: 15,
      borderRadius: 10,
    },
    right: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      flex: 1,
    },
    trackDetail: {
      paddingVertical: 2,
      width: '90%',
    },
    songArtist: {
      color: isDarkMode ? COLORS.white_eee : COLORS.black222,
      fontSize: 17,
      marginBottom: 0,
      maxWidth: '100%',
    },
    data: {
      color: isDarkMode ? COLORS.white_aaa : COLORS.black777,
      fontSize: 14,
    },
  });

  return (
    <View style={styles.item}>
      {albums.length > 0 && albums[0]?.cover ? (
        albums[0]?.cover?.includes('null') ||
        !checkIfCoverExists(albums[0]?.cover) ? (
          <TouchableOpacity
            activeOpacity={1}
            style={styles.noteIcon}
            onPress={() => {}}>
            <IonIcon
              name="musical-note"
              size={20}
              color={isDarkMode ? COLORS.white_eee : COLORS.black555}
            />
          </TouchableOpacity>
        ) : (
          <Image
            source={{uri: albums[0].cover}}
            resizeMode="cover"
            style={styles.iconImage}
          />
        )
      ) : (
        <TouchableOpacity
          activeOpacity={1}
          style={styles.noteIcon}
          onPress={() => {}}>
          <IonIcon
            name="musical-note"
            size={20}
            color={isDarkMode ? COLORS.white_eee : COLORS.black555}
          />
        </TouchableOpacity>
      )}

      <TouchableOpacity
        style={styles.right}
        activeOpacity={0.1}
        onPress={() =>
          navigation.navigate('artistItemData', {
            tracks,
            albums,
            isDarkMode,
            artist: item.artist?.includes('unknown')
              ? 'Unknown Artist'
              : item.artist,
            cover: albums[0]?.cover,
            album: albums[0]?.album,
            skipToNext,
            skipToPrevious,
            trackArtWork,
            trackTitle,
            handleShuffle,
            canShuffle,
            queue,
          })
        }>
        <View style={styles.trackDetail}>
          <Text style={styles.songArtist} numberOfLines={1}>
            {item.artist?.includes('unknown') ? 'Unknown Artist' : item.artist}
          </Text>

          <Text style={styles.data}>
            {/* {item.numberOfAlbums}{' '} */}
            {/* {item.numberOfAlbums > 1 ? ' albums ' : ' album '} */}
            {albums.length > 0 && albums.length}{' '}
            {albums.length > 0
              ? albums.length > 1
                ? ' albums '
                : ' album '
              : ''}
            {item.numberOfSongs}
            {item.numberOfSongs > 1 ? ' tracks' : ' track'}
          </Text>
        </View>

        <TouchableOpacity activeOpacity={0.5} onPress={() => {}}>
          <IonIcon
            name="ellipsis-vertical"
            size={22}
            color={isDarkMode ? COLORS.emptyWhite : COLORS.emptyBlack}
          />
        </TouchableOpacity>
      </TouchableOpacity>
    </View>
  );
};

export default React.memo(ArtistItem);
