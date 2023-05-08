import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import IonIcon from 'react-native-vector-icons/Ionicons';
import TrackPlayer from 'react-native-track-player';
import {COLORS, SIZES} from '../constants';
import { addTracks } from "../service";

function SearchItem({isDarkMode, item, index}) {
  const [current, setCurrent] = useState(false);

  // 👇 handler to skip to specific track
  const skipTo = async trackId => {
    console.log('\n\nCurrent track id:', trackId);
    if (trackId && trackId >= 0) {
      let track = await TrackPlayer.getTrack(trackId);
	console.log('\nThe track so far:', track);
      if (track) {
        await TrackPlayer.skip(trackId);
        await TrackPlayer.play();
      } else {
        addTracks();
        let track = await TrackPlayer.getTrack(trackId);
        if(track){
		await TrackPlayer.skip(trackId);
		await TrackPlayer.play();
	} 
      }
    }
  };

  const styles = StyleSheet.create({
    item: {
      flexDirection: 'row',
      marginVertical: 5,
      backgroundColor: isDarkMode ? COLORS.black111 : COLORS.white_eee,
      paddingVertical: 10,
      paddingHorizontal: 10,
      marginHorizontal: 10,
      borderRadius: 10,
    },
    noteIcon: {
      backgroundColor: isDarkMode ? COLORS.black444 : COLORS.white_ccc,
      paddingHorizontal: 15,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 10,
      borderRadius: 10,
      // marginLeft: 10,
    },
    iconImage: {
      width: 50,
      height: 50,
      marginRight: 10,
      borderRadius: 10,
      // marginLeft: 10,
    },
    right: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      flex: 1,
    },
    trackDetail: {
      paddingVertical: 2,
    },
    songName: {
      // color: current ? 'dodgerblue' : isDarkMode ? '#eee' : '#222',
      color: isDarkMode ? COLORS.white_eee : COLORS.black222,
      fontSize: 17,
      marginBottom: 0,
      maxWidth: '95%',
    },
    songArtist: {
      // color: current ? 'dodgerblue' : isDarkMode ? '#aaa' : '#777',
      color: isDarkMode ? COLORS.white_eee : COLORS.black222,
      fontSize: 15,
    },
  });

  return (
    <View style={styles.item}>
      {item?.artwork ? (
        item.artwork.uri ? (
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
            source={{uri: item.artwork}}
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
        onPress={() => {
          // skipTo(Number(item.id));
          skipTo(index);
          setCurrent(true);
        }}>
        <View style={styles.trackDetail}>
          <Text style={styles.songName} numberOfLines={1}>
            {item.title}
          </Text>

          <Text style={styles.songArtist}>
            {item.artist || 'Unknown Artist'}
          </Text>
        </View>

        <TouchableOpacity activeOpacity={0.5} onPress={() => {}}>
          <IonIcon
            name="ellipsis-vertical"
            size={22}
            color={isDarkMode ? COLORS.white_aaa : COLORS.black777}
          />
        </TouchableOpacity>
      </TouchableOpacity>
    </View>
  );
}

export default React.memo(SearchItem);
