import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import React, {useRef, useState, useEffect} from 'react';
import IonIcon from 'react-native-vector-icons/Ionicons';
import RNFS from 'react-native-fs';
import {COLORS, SIZES} from '../constants';

const ArtistItemAlbumItem = ({
  item,
  isDarkMode,
  index,
  navigation,
  handleShuffle,
  canShuffle,
  queue,
  skipToNext,
  skipToPrevious,
  trackTitle,
  trackArtWork,
}) => {
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
    container: {
      flex: 1 / 2,
      marginLeft: index % 2 ? 5 : 10,
      marginRight: index % 2 ? 10 : 5,
    },
    top: {
      backgroundColor: isDarkMode ? COLORS.black444 : COLORS.white_ccc,
      borderRadius: 10,
      height: 190,
      alignItems: 'center',
      justifyContent: 'center',
    },
    noteIcon: {},
    iconImage: {
      width: '100%',
      height: '100%',
      borderRadius: 10,
    },
    bottom: {
      alignItems: 'center',
      marginBottom: 15,
      marginTop: 5,
    },
    albumName: {
      color: isDarkMode ? COLORS.white : COLORS.black222,
    },
    albumTracksData: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    albumAuthor: {
      marginRight: 5,
      maxWidth: '80%',
      color: isDarkMode ? COLORS.emptyWhite : COLORS.emptyBlack,
    },
    albumTrackCount: {
      maxWidth: '80%',
      color: isDarkMode ? COLORS.emptyWhite : COLORS.emptyBlack,
    },
  });

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() =>
        navigation.navigate('albumtracks', {
          album: item.album,
          cover: item.cover,
          isDarkMode: isDarkMode,
          handleShuffle: handleShuffle,
          canShuffle,
          author: item.author?.includes('unknown') ? 'Unknown' : item.author,
          navigation: navigation,
          queue,
          skipToNext,
          skipToPrevious,
          trackTitle,
          trackArtWork,
          hasCover: checkIfCoverExists(item?.cover),
        })
      }>
      <View style={styles.top}>
        {item?.cover ? (
          item?.cover.includes('null') || !checkIfCoverExists(item?.cover) ? (
            <TouchableOpacity
              activeOpacity={1}
              style={styles.noteIcon}
              onPress={() => {}}>
              <IonIcon
                name="musical-note"
                size={80}
                color={isDarkMode ? COLORS.white_eee : COLORS.black555}
              />
            </TouchableOpacity>
          ) : (
            <Image
              source={{uri: item.cover}}
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
              size={80}
              color={isDarkMode ? COLORS.white_eee : COLORS.black555}
            />
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.bottom}>
        <Text style={styles.albumName} numberOfLines={1}>
          {item.album}
        </Text>
        <View style={styles.albumTracksData}>
          <Text style={styles.albumAuthor} numberOfLines={1}>
            {item.author?.includes('unknown') ? 'Unknown' : item.author},
          </Text>
          <Text style={styles.albumTrackCount} numberOfLines={1}>
            {item.numberOfSongs} tracks
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default React.memo(ArtistItemAlbumItem);
