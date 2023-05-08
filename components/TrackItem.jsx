import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Image} from 'react-native';
import IonIcon from 'react-native-vector-icons/Ionicons';
import TrackPlayer, {
  useTrackPlayerEvents,
  Event,
} from 'react-native-track-player';
import {COLORS, SIZES} from '../constants';

function TrackItem({item, index, isDarkMode}) {
  const [current, setCurrent] = useState(false);

  // 👇 handler to return the index of current track
  const checkCurrentTrack = async () => {
    let track_index = await TrackPlayer.getCurrentTrack();
    setCurrent(track_index === index);
  };

  // 👇 component did mount
  useEffect(() => {
    checkCurrentTrack();
  }, []);

  // 👇 attach an event handler for any changes e.g change track.
  useTrackPlayerEvents([Event.PlaybackTrackChanged], async event => {
    if (event.type === Event.PlaybackTrackChanged && event.nextTrack != null) {
      checkCurrentTrack();
    }
  });

  // 👇 handler to skip to specific track
  const skipTo = async trackId => {
    await TrackPlayer.skip(trackId);
    await TrackPlayer.play();
  };

  // 👇 styles
  const styles = StyleSheet.create({
    item: {
      flexDirection: 'row',
      marginVertical: 10,
    },
    noteIcon: {
      backgroundColor: isDarkMode ? COLORS.black444 : COLORS.white_ccc,
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
    },
    songName: {
      color: current
        ? COLORS.activeColor
        : isDarkMode
        ? COLORS.white_eee
        : COLORS.black222,
      fontSize: 17,
      marginBottom: 0,
      maxWidth: '95%',
    },
    songArtist: {
      color: current
        ? COLORS.activeColor
        : isDarkMode
        ? COLORS.white_aaa
        : COLORS.black777,
      fontSize: 15,
    },
  });

  return (
    <View style={styles.item}>
      {item?.artwork ? (
        item?.artwork?.uri ? (
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
        onPress={() => skipTo(index)}>
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

export default React.memo(TrackItem);
