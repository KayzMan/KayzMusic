import {useState, useEffect} from 'react';
import {View, Text, StyleSheet, FlatList, TouchableOpacity} from 'react-native';
import {Button} from 'react-native-paper';
import MusicFiles from '@yajanarao/react-native-get-music-files';
import MaterialCommIcon from 'react-native-vector-icons/MaterialCommunityIcons';

import GenreItem from '../components/GenreItem';

export default function Genres({isDarkMode, navigation, handleShuffle}) {
  const [genres, setGenres] = useState([]);
  useEffect(() => {
    loadGenres();
  }, []);

  // 👇 icon size
  const iconSize = 25;

  // 👇 load albumns
  const loadGenres = async () => {
    let populated_genres = [];
    MusicFiles.getSongsByGenres()
      .then(async data => {
        data.forEach(item => {
          MusicFiles.getSongsByGenres({genre: item.name})
            .then(result => result.length > 0 && populated_genres.push(item))
            .catch(error => console.log(error));
        });
        setGenres(populated_genres);
      })
      .catch(error => {
        console.log(error);
      });
  };

  // 👇 styles
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDarkMode ? '#131313' : '#fff',
      borderTopLeftRadius: 30,
      borderTopRightRadius: 30,
      borderTopWidth: 1,
      borderColor: 'transparent',
      paddingBottom: 100,
    },
    emptyContainer: {
      flex: 1,
      backgroundColor: isDarkMode ? '#131313' : '#fff',
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
      color: isDarkMode ? '#aaa' : '#777',
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
      color: isDarkMode ? '#aaa' : '#777',
    },
    filterText: {
      color: isDarkMode ? '#aaa' : '#777',
      marginLeft: 10,
    },
    bottom: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
  });

  return genres.length > 0 ? (
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
            color={'#eee'}
            style={styles.icon}
          />
          <Text style={styles.filterText}>Name</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={genres}
        renderItem={({item, index}) => (
          <GenreItem
            item={item}
            isDarkMode={isDarkMode}
            index={index}
            navigation={navigation}
            handleShuffle={handleShuffle}
          />
        )}
        keyExtractor={(item, index) => `$genre-#${index}-${item.id}`}
        numColumns={2}
        columnWrapperStyle={styles.bottom}
      />
    </View>
  ) : (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>genres will appear here.</Text>
      <Button
        onPress={loadGenres}
        style={{marginTop: 10}}
        textColor="darkslateblue">
        Refresh
      </Button>
    </View>
  );
}
