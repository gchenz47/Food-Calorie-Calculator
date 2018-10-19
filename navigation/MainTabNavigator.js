import React from 'react';
import {
  Platform,
  Text
} from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';

import HomeScreen from '../screens/HomeScreen';

const HomeStack = createStackNavigator({
  Home: HomeScreen,

});

export default HomeStack;