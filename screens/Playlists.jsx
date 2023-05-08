import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

export default function Playlists({isDarkMode, playlists}) {
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
    emptyText: {
      textAlign: 'center',
      maxWidth: '80%',
      lineHeight: 22,
      color: isDarkMode ? '#aaa' : '#777',
    },
  });

  return playlists.length > 0 ? (
    <View style={styles.container}></View>
  ) : (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>
        Create some playlists, and they'll appear here.
      </Text>
    </View>
  );
}
