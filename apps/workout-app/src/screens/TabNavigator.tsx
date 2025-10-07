import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { IconButton } from 'react-native-paper';
import {theme} from '../theme';
import WorkoutsScreen from './WorkoutsScreen';
import AnalyticsScreen from './AnalyticsScreen';

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: 'gray',
      }}
    >
      <Tab.Screen 
        name="Workouts" 
        component={WorkoutsScreen} 
        options={{ tabBarIcon: ({ color, size }) => <IconButton icon="dumbbell" iconColor={color} size={size} /> }}
      />
      <Tab.Screen 
        name="Analytics" 
        component={AnalyticsScreen} 
        options={{ tabBarIcon: ({ color, size }) => <IconButton icon="chart-line" iconColor={color} size={size} /> }}
      />
    </Tab.Navigator>
  );
}
