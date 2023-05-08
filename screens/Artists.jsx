import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import MusicFiles from '@yajanarao/react-native-get-music-files';
import {Button} from 'react-native-paper';
import MaterialCommIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import IonIcon from 'react-native-vector-icons/Ionicons';
import {COLORS, SIZES} from '../constants';

// helper components
import ArtistItem from '../components/ArtistItem';

export default function Artists({
  isDarkMode,
  navigation,
  skipToPrevious,
  skipToNext,
  trackTitle,
  trackArtWork,
  handleShuffle,
  canShuffle,
  queue,
}) {
  const [artists, setArtists] = useState([]);

  useEffect(() => {
    loadArtists();
  }, []);

  const loadArtists = () => {
    MusicFiles.getArtists({})
      .then(data => {
        setArtists(data);
      })
      .catch(error => console.log(error));
  };

  // 👇 styles
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDarkMode
        ? COLORS.pageBackgroundDark
        : COLORS.pageBackgroundLight,
      borderTopLeftRadius: 30,
      borderTopRightRadius: 30,
      borderTopWidth: 1,
      borderColor: 'transparent',
      paddingBottom: 100,
    },
    emptyContainer: {
      flex: 1,
      backgroundColor: isDarkMode
        ? COLORS.pageBackgroundDark
        : COLORS.pageBackgroundLight,
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
    top: {
      paddingHorizontal: 15,
      marginTop: 15,
      marginBottom: 30,
    },
    filterContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    filterText: {
      color: isDarkMode ? COLORS.emptyWhite : COLORS.emptyBlack,
      marginLeft: 10,
    },
    icon: {
      color: isDarkMode ? COLORS.emptyWhite : COLORS.emptyBlack,
    },
    bottom: {
      paddingHorizontal: 15,
    },
    divider: {
      backgroundColor: isDarkMode ? COLORS.black555 : COLORS.emptyWhite,
      height: 0.5,
      width: '83%',
      alignSelf: 'flex-end',
    },
  });

  return artists.length > 0 ? (
    <View style={styles.container}>
      {/* tracks top section */}
      <View style={styles.top}>
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={() => {}}
          style={styles.filterContainer}>
          <MaterialCommIcon
            name={'sort-ascending'}
            size={SIZES.iconSize}
            color={
              isDarkMode
                ? COLORS.trackControlIconDark
                : COLORS.trackControlIconLight
            }
            style={styles.icon}
          />
          <Text style={styles.filterText}>Name</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={artists}
        renderItem={({item, index}) => (
          <ArtistItem
            item={item}
            isDarkMode={isDarkMode}
            index={index}
            navigation={navigation}
            skipToNext={skipToNext}
            skipToPrevious={skipToPrevious}
            trackTitle={trackTitle}
            trackArtWork={trackArtWork}
            handleShuffle={handleShuffle}
            canShuffle={canShuffle}
            queue={queue}
          />
        )}
        keyExtractor={item => `artist-#${item.id}`}
        ItemSeparatorComponent={() => <Text style={styles.divider} />}
        style={styles.bottom}
      />
    </View>
  ) : (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>Artists will appear here.</Text>
      <Button
        textColor={COLORS.primary}
        onPress={loadArtists}
        style={{marginTop: 10}}>
        Refresh
      </Button>
    </View>
  );
}
