import {View, Text} from 'react-native';
import React from 'react';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import MaterialCommIcon from 'react-native-vector-icons/MaterialCommunityIcons';

import Page1 from '../screens/Page1';
import Page2 from '../screens/Page2';

const Tab = createMaterialBottomTabNavigator();

export default function TestBottomTabs() {
  return (
    <Tab.Navigator
      sceneAnimationEnabled
      sceneAnimationType="shifting"
      activeColor="dodgerblue"
      inactiveColor="#aaa"
      barStyle={{
        backgroundColor: '#222',
      }}
      shifting={true}
      screenOptions={{
        tabBarBadge: 1,
        tabBarColor: '#111',
        title: 'Tabs',
        tabBarIcon: 'account',
        tabBarLabel: 'Works',
      }}>
      <Tab.Screen name="page1" component={Page1} />
      <Tab.Screen
        name="page3"
        component={Page2}
        options={{
          tabBarIcon: 'calendar',
          tabBarBadge: 3,
          tabBarLabel: 'events',
        }}
      />

      <Tab.Screen
        name="page2"
        component={Page2}
        options={{tabBarIcon: 'rocket', tabBarBadge: 3, tabBarLabel: 'Takeoff'}}
      />
    </Tab.Navigator>
  );
}
