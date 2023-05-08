import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Button} from 'react-native-paper';
import RNFS from 'react-native-fs';
import styled from 'styled-components';

const StyledText = styled.Text`
  font-size: 18px;
  color: blue;
  font-weight: 500;
`;

export default function Favorites({isDarkMode, favorites}) {
  // 👇 styles
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDarkMode ? '#131313' : '#fff',
      borderTopLeftRadius: 30,
      borderTopRightRadius: 30,
      borderTopWidth: 1,
      borderColor: 'transparent',
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
    emptyTextHeader: {
      color: isDarkMode ? '#555' : '#999',
      fontSize: 22,
      marginBottom: 20,
    },
    emptyText: {
      textAlign: 'center',
      maxWidth: '80%',
      lineHeight: 22,
      color: isDarkMode ? '#aaa' : '#777',
    },
  });

  return favorites.length > 0 ? (
    <View style={styles.container}></View>
  ) : (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyTextHeader}>No favorites</Text>

      <Text style={styles.emptyText}>
        Tap the heart icon next to your favorite playlists, albums, artists, and
        folders, and they'll appear here.
      </Text>
    </View>
  );
}
