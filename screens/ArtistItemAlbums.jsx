import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import MaterialCommIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {COLORS, SIZES} from '../constants';

// helper components
import ArtistItemAlbumItem from '../components/ArtistItemAlbumItem';
import MiniControls from './MiniControls';

export default function ArtistItemAlbums({
  navigation,
  route: {
    params: {
      isDarkMode,
      albums,
      skipToPrevious,
      skipToNext,
      trackTitle,
      trackArtWork,
      handleShuffle,
      canShuffle,
      cover,
      album,
      artist,
      queue,
    },
  },
}) {
  // 👇 styles
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
    top: {
      paddingHorizontal: 15,
      marginTop: 15,
      marginBottom: 30,
    },
    filterContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    icon: {
      color: isDarkMode ? COLORS.emptyWhite : COLORS.emptyBlack,
    },
    filterText: {
      color: isDarkMode ? COLORS.emptyWhite : COLORS.emptyBlack,
      marginLeft: 10,
    },
    bottom: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
  });

  return albums?.length <= 0 ? (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>albums will appear here...</Text>
    </View>
  ) : (
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
        data={albums}
        renderItem={({item, index}) => (
          <ArtistItemAlbumItem
            item={item}
            index={index}
            isDarkMode={isDarkMode}
            navigation={navigation}
            queue={queue}
            skipToNext={skipToNext}
            skipToPrevious={skipToPrevious}
            trackTitle={trackTitle}
            trackArtWork={trackArtWork}
            handleShuffle={handleShuffle}
            canShuffle={canShuffle}
          />
        )}
        keyExtractor={item => `artistItemAlbumItem-#${item.id}`}
        // ItemSeparatorComponent={() => <Text style={styles.divider} />}
        numColumns={2}
        columnWrapperStyle={styles.bottom}
        style={styles.tracks}
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
