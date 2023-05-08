import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useState, useEffect} from 'react';
import IonIcon from 'react-native-vector-icons/Ionicons';
import TrackPlayer, {
  useTrackPlayerEvents,
  Event,
} from 'react-native-track-player';
import {COLORS, SIZES} from '../constants';

const AlbumTrack = ({index, item, isDarkMode, skipTo, queue}) => {
  const [current, setCurrent] = useState(false);

  // 👇 handler to return the index of current track
  const checkCurrentTrack = async () => {
    let track_index = await TrackPlayer.getCurrentTrack();
    let track = queue[track_index];
    setCurrent(track.id === item.id);
    // console.log('\n\nChecked:', track.id, item.id, track.id === item.id);
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

  // 👇 styles
  styles = StyleSheet.create({
    item: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 20,
    },
    left: {},
    trackIndex: {
      marginLeft: 5,
      color: isDarkMode ? COLORS.white_eee : COLORS.black222,
      fontWeight: '500',
      fontSize: 16,
    },
    right: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    trackData: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '85%',
    },
    trackName: {
      maxWidth: '86%',
      color: current
        ? COLORS.activeColor
        : isDarkMode
        ? COLORS.white_eee
        : COLORS.black222,
      fontWeight: '400',
      fontSize: 15,
    },
    trackDuration: {
      color: current
        ? COLORS.activeColor
        : isDarkMode
        ? COLORS.emptyWhite
        : COLORS.emptyBlack,
    },
  });

  return (
    <TouchableOpacity
      style={this.styles.item}
      onPress={() => {
        skipTo(index);
      }}>
      <View style={styles.left}>
        <Text style={styles.trackIndex}>{index + 1}</Text>
      </View>

      <View style={styles.right}>
        <View style={styles.trackData}>
          <Text style={styles.trackName} numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={styles.trackDuration} numberOfLines={1}>
            {formatTime(item?.duration)}
          </Text>
        </View>
        <TouchableOpacity activeOpacity={0.5} onPress={() => {}}>
          <IonIcon
            name="ellipsis-vertical"
            size={22}
            color={isDarkMode ? COLORS.emptyWhite : COLORS.emptyBlack}
          />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

export default React.memo(AlbumTrack);
