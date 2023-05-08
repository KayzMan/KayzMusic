import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import React, {useRef, useState, useEffect} from 'react';
import IonIcon from 'react-native-vector-icons/Ionicons';
import MusicFiles from '@yajanarao/react-native-get-music-files';

const GenreItem = ({item, isDarkMode, index, navigation, handleShuffle}) => {
  const [tracks, setTracks] = useState([]);

  useEffect(() => {
    MusicFiles.getSongsByGenres({genre: item.name})
      .then(data => {
        // console.log('\n\nsongs by genre', item.name, data);
        setTracks(data);
      })
      .catch(error => console.log(error));
  }, []);

  // 👇 styles
  const styles = StyleSheet.create({
    container: {
      flex: 1 / 2,
      marginLeft: index % 2 ? 5 : 10,
      marginRight: index % 2 ? 10 : 5,
      //   display: tracks.length <= 0 ? 'none' : 'flex',
    },
    top: {
      backgroundColor: isDarkMode ? '#444' : '#fff',
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
      color: isDarkMode ? '#fff' : '#222',
    },
    albumTracksData: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    albumAuthor: {
      marginRight: 5,
      maxWidth: '80%',
      color: isDarkMode ? '#aaa' : '#777',
    },
    albumTrackCount: {
      maxWidth: '80%',
      color: isDarkMode ? '#aaa' : '#777',
    },
  });

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() =>
        navigation.navigate('genretracks', {
          isDarkMode: isDarkMode,
          handleShuffle: handleShuffle,
          genre: item.name,
          tracks: tracks,
          index: index,
          total: tracks.length,
        })
      }>
      <View style={styles.top}>
        <TouchableOpacity
          activeOpacity={1}
          style={styles.noteIcon}
          onPress={() => {}}>
          <IonIcon name="musical-note" size={80} color={'#eee'} />
        </TouchableOpacity>
      </View>
      <View style={styles.bottom}>
        <Text style={styles.albumName} numberOfLines={1}>
          {item.name}
        </Text>
        <View style={styles.albumTracksData}>
          <Text style={styles.albumTrackCount} numberOfLines={1}>
            {tracks.length}
            {tracks.length > tracks.length + ' tracks' + ' track'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default React.memo(GenreItem);
