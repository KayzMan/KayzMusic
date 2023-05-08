import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import IonIcon from 'react-native-vector-icons/Ionicons';

const GenreTrack = ({index, item, isDarkMode}) => {
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
      color: isDarkMode ? '#eee' : '#222',
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
      maxWidth: '95%',
      color: isDarkMode ? '#eee' : '#222',
      fontWeight: '400',
      fontSize: 15,
    },
  });

  return (
    <TouchableOpacity style={this.styles.item}>
      <View style={styles.left}>
        <Text style={styles.trackIndex}>{index + 1}</Text>
      </View>

      <View style={styles.right}>
        <View style={styles.trackData}>
          <Text style={styles.trackName} numberOfLines={1}>
            {item.title}
          </Text>
        </View>
        <TouchableOpacity activeOpacity={0.5} onPress={() => {}}>
          <IonIcon
            name="ellipsis-vertical"
            size={22}
            color={isDarkMode ? '#aaa' : '#777'}
          />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

export default React.memo(GenreTrack);
