import {useState, useEffect} from 'react';
import {View, Text, StyleSheet, FlatList, TouchableOpacity} from 'react-native';
import {Button} from 'react-native-paper';
import MusicFiles from '@yajanarao/react-native-get-music-files';
import AlbumItem from '../components/AlbumItem';
import MaterialCommIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {COLORS, SIZES} from '../constants';

export default function Albums({
  isDarkMode,
  navigation,
  handleShuffle,
  canShuffle,
  skipTo,
  queue,
  skipToNext,
  skipToPrevious,
  trackTitle,
  trackArtWork,
}) {
  const [albumns, setAlbumns] = useState([]);
  useEffect(() => {
    loadAlbumns();
  }, []);

  // 👇 icon size
  const iconSize = 25;

  // 👇 load albumns
  const loadAlbumns = () => {
    MusicFiles.getAlbums()
      .then(data => {
        setAlbumns(data);
        // console.log('\n\nalbums:', data);
      })
      .catch(error => {
        console.log(error);
      });
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

  return albumns.length > 0 ? (
    <View style={styles.container}>
      {/* tracks top section */}
      <View style={styles.top}>
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={() => {}}
          style={styles.filterContainer}>
          <MaterialCommIcon
            name={'sort-ascending'}
            size={iconSize}
            color={COLORS.white_eee}
            style={styles.icon}
          />
          <Text style={styles.filterText}>Name</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={albumns}
        renderItem={({item, index}) => (
          <AlbumItem
            item={item}
            isDarkMode={isDarkMode}
            index={index}
            navigation={navigation}
            handleShuffle={handleShuffle}
            canShuffle={canShuffle}
            skipTo={skipTo}
            skipToNext={skipToNext}
            skipToPrevious={skipToPrevious}
            trackArtWork={trackArtWork}
            trackTitle={trackTitle}
            queue={queue}
          />
        )}
        keyExtractor={item => `$album-#${item.id}`}
        numColumns={2}
        columnWrapperStyle={styles.bottom}
        // style={{paddingHorizontal: 15, flex: 1}}
      />
    </View>
  ) : (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>Albums will appear here.</Text>
      <Button
        onPress={loadAlbumns}
        style={{marginTop: 10}}
        textColor={COLORS.primary}>
        Refresh
      </Button>
    </View>
  );
}
