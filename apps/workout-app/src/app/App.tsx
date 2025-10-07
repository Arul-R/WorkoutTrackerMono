import React from 'react';
import { PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { WorkoutProvider } from '../context/WorkoutContext';
import TabNavigator from '../screens/TabNavigator';
import theme from '../theme';

export default function App() {
  return (
    <PaperProvider theme={theme}>
      <WorkoutProvider>
        <NavigationContainer>
          <TabNavigator />
        </NavigationContainer>
      </WorkoutProvider>
    </PaperProvider>
  );
}
