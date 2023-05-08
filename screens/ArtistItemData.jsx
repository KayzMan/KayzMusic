import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import React, {useEffect, useState} from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import EvilIcon from 'react-native-vector-icons/EvilIcons';
import MaterialCommIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import IonIcon from 'react-native-vector-icons/Ionicons';
import {COLORS, SIZES} from '../constants';

const Tab = createMaterialTopTabNavigator();

// screens
import ArtistItemTracks from './ArtistItemTracks';
import ArtistItemAlbums from './ArtistItemAlbums';

export default function ArtistItemData({
  navigation,
  route: {
    params: {
      isDarkMode,
      tracks,
      albums,
      skipToPrevious,
      skipToNext,
      trackTitle,
      trackArtWork,
      cover,
      album,
      artist,
      handleShuffle,
      canShuffle,
      queue,
    },
  },
}) {
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      headerStyle: {
        backgroundColor: isDarkMode ? COLORS.black : COLORS.white,
      },
      headerTintColor: isDarkMode ? COLORS.white_eee : COLORS.black222,
      title: artist,
      headerLeft: () => headerLeftView(),
      headerRight: () => headerRightView(),
    });
  }, [navigation]);

  const headerLeftView = () => (
    <TouchableOpacity activeOpacity={0.5} onPress={() => navigation.goBack()}>
      <EvilIcon
        name="chevron-left"
        color={isDarkMode ? COLORS.white : COLORS.black222}
        size={50}
      />
    </TouchableOpacity>
  );

  const headerRightView = () => (
    <View style={styles.headerRight_RightIcons}>
      <TouchableOpacity
        activeOpacity={0.5}
        onPress={() => setIsFavorite(!isFavorite)}>
        <MaterialCommIcon
          name={isFavorite ? 'heart' : 'heart-outline'}
          size={SIZES.iconSize}
          color={isDarkMode ? COLORS.white : COLORS.black222}
          style={styles.icon}
        />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => {}} activeOpacity={0.5}>
        <IonIcon
          name="search-outline"
          size={25}
          color={isDarkMode ? COLORS.white : COLORS.black222}
          style={styles.searchIcon}
        />
      </TouchableOpacity>

      <TouchableOpacity activeOpacity={0.5} onPress={() => {}}>
        <IonIcon
          name="ellipsis-vertical"
          size={22}
          color={isDarkMode ? COLORS.white : COLORS.black222}
        />
      </TouchableOpacity>
    </View>
  );

  // 👇 styles
  const styles = StyleSheet.create({
    headerRight_RightIcons: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    searchIcon: {
      marginHorizontal: 15,
    },
  });

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarGap: 10,
        tabBarStyle: {
          backgroundColor: isDarkMode ? COLORS.black : COLORS.white,
          paddingVertical: 10,
        },
        tabBarItemStyle: {
          // backgroundColor: isDarkMode ? '#252525' : '#efefef',
          borderRadius: 35,
          marginHorizontal: 10,
          marginVertical: 5,
        },
        tabBarIndicatorStyle: {
          backgroundColor: COLORS.primary,
          paddingVertical: 2,
          borderRadius: 35,
        },
        tabBarActiveTintColor: isDarkMode ? '#eee' : '#222',
        tabBarInactiveTintColor: isDarkMode
          ? COLORS.emptyBlack
          : COLORS.emptyWhite,
      }}
      sceneContainerStyle={{
        backgroundColor: isDarkMode ? COLORS.black : COLORS.white,
      }}>
      <Tab.Screen
        name="ArtistItemTracks"
        component={ArtistItemTracks}
        initialParams={{
          tracks,
          isDarkMode,
          skipToPrevious,
          skipToNext,
          trackArtWork,
          trackTitle,
          cover,
          album,
          artist,
          handleShuffle,
          canShuffle,
          queue,
        }}
        options={{
          tabBarLabel: `Tracks (${tracks?.length ? tracks?.length : 0})`,
        }}
      />
      <Tab.Screen
        name="ArtistItemAlbums"
        component={ArtistItemAlbums}
        initialParams={{
          albums,
          isDarkMode,
          skipToPrevious,
          skipToNext,
          trackArtWork,
          trackTitle,
          cover,
          album,
          artist,
          queue,
          handleShuffle,
          canShuffle,
        }}
        options={{
          tabBarLabel: `Albums (${albums?.length ? albums?.length : 0})`,
        }}
      />
    </Tab.Navigator>
  );
}
