import {View, Text, StyleSheet, BackHandler, FlatList} from 'react-native';
import React, {useState, useEffect} from 'react';
import {SearchBar} from 'react-native-elements';
import {Button} from 'react-native-paper';
import SearchItem from '../components/SearchItem';
import {COLORS, SIZES} from '../constants';

// 👇 helper components
import MiniControls from './MiniControls';

export default function SearchPage({
  route: {
    params: {
      isDarkMode,
      navigation,
      queue,
      skipToNext,
      skipToPrevious,
      trackTitle,
      trackArtWork,
      loadQueue,
    },
  },
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [localQueue, setLocalQueue] = useState([]);

  // useEffect(() => {
  //   BackHandler.addEventListener('hardwareBackPress', () => {
  //     BackHandler.removeEventListener('hardwareBackPress', () => true);
  //     return true;
  //   });
  // }, []);

  const handleClear = () => {
    setLoading(true);
    setLocalQueue([]);
    setLoading(false);
  };

  const handleTextChange = text => {
    setSearchQuery(text);
    setLoading(true);

    let found = [];

    queue.forEach(item => {
      if (item?.title?.toLowerCase().includes(text?.toLowerCase())) {
        found.push(item);
      }
    });

    setLocalQueue(found);
    !text && setLocalQueue([]);
    setLoading(false);
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDarkMode
        ? COLORS.pageBackgroundDark
        : COLORS.pageBackgroundLight,
      paddingBottom: 100,
    },
  });

  return (
    <View style={styles.container}>
      <SearchBar
        placeholder="Type here..."
        placeholderTextColor={COLORS.black999}
        round
        onChangeText={handleTextChange}
        value={searchQuery}
        onClear={handleClear}
        onCancel={handleClear}
        showLoading={loading}
        returnKeyType="search"
        containerStyle={{
          backgroundColor: isDarkMode ? COLORS.black : COLORS.white,
        }}
      />
      <Button
        style={{
          // width: '100%',
          // backgroundColor: 'orangered',
          backgroundColor: COLORS.primary,
          marginBottom: 10,
          borderRadius: 10,
          marginHorizontal: 10,
          paddingVertical: 8,
        }}
        textColor={COLORS.white_eee}
        onPress={() => {
          navigation.goBack();
          BackHandler.removeEventListener('hardwareBackPress', () => {
            return true;
          });
        }}
        labelStyle={{fontSize: 18}}>
        Close
      </Button>
      <FlatList
        data={localQueue.slice(0, 12)}
        renderItem={({item, index}) => (
          <SearchItem
            item={item}
            index={queue.indexOf(item)}
            isDarkMode={isDarkMode}
            navigation={navigation}
            loadQueue={loadQueue}
          />
        )}
        keyExtractor={item => item.id}
      />

      <MiniControls
        isDarkMode={isDarkMode}
        onPress={() => {}}
        skipToNext={skipToNext}
        skipToPrevious={skipToPrevious}
        queue={queue}
        miniTrackTitle={trackTitle}
        miniTrackArtWork={trackArtWork}
      />
    </View>
  );
}
