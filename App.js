import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {useEffect} from 'react';
import SplashScreen from 'react-native-splash-screen';
const Stack = createNativeStackNavigator();

// 👇 screens
import MyPagerView from './screens/MyPagerView';
import Home from './screens/Home';
import SearchPage from './screens/SearchPage';
import AlbumTracks from './screens/AlbumTracks';
import TestBottomTabs from './screens/TestBottomTabs';
import ArtistItemData from './screens/ArtistItemData';
import GenreTracks from './screens/GenreTracks';

export default function App() {
  useEffect(() => {
    SplashScreen.hide();
  }, []);

  useEffect(() => {}, []);

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="home"
        screenOptions={{
          animation: 'slide_from_right',
          headerShown: false,
          statusBarHidden: false,
          statusBarColor: 'black',
        }}>
        {/* <Stack.Screen
          name="pagerview"
          component={MyPagerView}
          options={{statusBarHidden: true}}
        /> */}

        <Stack.Screen name="home" component={Home} />

        <Stack.Screen
          name="search"
          component={SearchPage}
          options={{animation: 'slide_from_bottom'}}
        />

        <Stack.Screen
          name="albumtracks"
          component={AlbumTracks}
          options={{headerShown: true}}
        />

        <Stack.Screen
          name="genretracks"
          component={GenreTracks}
          options={{headerShown: true}}
        />

        <Stack.Screen name="testtabs" component={TestBottomTabs} />

        <Stack.Screen
          name="artistItemData"
          component={ArtistItemData}
          options={{
            headerShown: true,
            headerShadowVisible: false,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
