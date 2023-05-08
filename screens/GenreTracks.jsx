import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import TrackPlayer from 'react-native-track-player';
import MusicFiles from '@yajanarao/react-native-get-music-files';
import MaterialCommIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import IonIcon from 'react-native-vector-icons/Ionicons';
import EvilIcon from 'react-native-vector-icons/EvilIcons';

import GenreTrack from '../components/GenreTrack';

const GenreTracks = ({
  navigation,
  route: {
    params: {genre, index, isDarkMode, handleShuffle, tracks, total},
  },
}) => {
  const [canShuffle, setCanShuffle] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  // 👇 icon size
  const iconSize = 25;

  useEffect(() => {
    navigation.setOptions({
      headerStyle: {
        backgroundColor: isDarkMode ? '#000' : '#fff',
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
        color={isDarkMode ? '#fff' : '#222'}
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
          size={iconSize}
          color={'#eee'}
          style={styles.icon}
        />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => {}} activeOpacity={0.5}>
        <IonIcon
          name="search-outline"
          size={25}
          color={isDarkMode ? '#fff' : '#222'}
          style={styles.searchIcon}
        />
      </TouchableOpacity>

      <TouchableOpacity activeOpacity={0.5} onPress={() => {}}>
        <IonIcon
          name="ellipsis-vertical"
          size={22}
          color={isDarkMode ? '#fff' : '#222'}
        />
      </TouchableOpacity>
    </View>
  );

  // 👇 styles
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDarkMode ? '#000' : '#fff',
    },
    top: {
      flex: 1 / 1.4,
      backgroundColor: isDarkMode ? '#000' : '#fff',
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
      backgroundColor: isDarkMode ? '#444' : '#fff',
    },
    coverImage: {
      width: 160,
      height: 160,
      marginTop: 20,
      marginBottom: 10,
      borderRadius: 10,
    },
    genreName: {
      paddingHorizontal: 15,
      marginTop: 15,
      marginBottom: 30,
      textAlign: 'center',
      marginBottom: 10,
      lineHeight: 20,
      color: isDarkMode ? '#eee' : '#222',
      maxWidth: '80%',
      fontSize: 16,
      fontWeight: '500',
    },
    genreTotal: {
      paddingHorizontal: 15,
      textAlign: 'center',
      lineHeight: 20,
      color: isDarkMode ? '#aaa' : '#999',
      maxWidth: '80%',
      fontSize: 16,
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
      backgroundColor: isDarkMode ? '#131313' : '#fff',
      borderTopLeftRadius: 30,
      borderTopRightRadius: 30,
      borderTopWidth: 1,
      borderColor: 'transparent',
      paddingBottom: 15,
    },
    tracks: {
      paddingHorizontal: 15,
    },
    divider: {
      backgroundColor: isDarkMode ? '#555' : '#aaa',
      height: 0.5,
      width: '91%',
      alignSelf: 'flex-end',
    },
  });

  return (
    <View style={styles.container}>
      {/* top image section */}
      <View style={styles.top}>
        <TouchableOpacity
          activeOpacity={1}
          style={styles.coverNoteIcon}
          onPress={() => {}}>
          <IonIcon name="musical-note" size={80} color={'#eee'} />
        </TouchableOpacity>

        <Text style={styles.genreName}>{genre}</Text>

        <Text style={styles.genreTotal}>{total} tracks</Text>
      </View>

      <View style={styles.bottom}>
        <View style={styles.tracksControl}>
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => {
              // setCanShuffle(!canShuffle);
              // handleShuffle(true);
            }}>
            <MaterialCommIcon
              name={'shuffle-variant'}
              size={iconSize}
              color={'#eee'}
              style={styles.icon}
            />
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.5}
            // onPress={() => skipTo(0)}
            onPress={() => {}}>
            <IonIcon
              name={'play-circle'}
              size={25}
              color={'#eee'}
              style={[styles.icon]}
            />
          </TouchableOpacity>
        </View>

        <FlatList
          data={tracks}
          renderItem={({item, index}) => (
            <GenreTrack item={item} isDarkMode={isDarkMode} index={index} />
          )}
          keyExtractor={item => `track-#${item.id}`}
          ItemSeparatorComponent={() => <Text style={styles.divider} />}
          style={styles.tracks}
        />
      </View>
    </View>
  );
};

export default React.memo(GenreTracks);
