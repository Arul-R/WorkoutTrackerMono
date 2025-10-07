import React from 'react';
import { PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { WorkoutProvider } from './src/context/WorkoutContext';
import TabNavigator from './src/screens/TabNavigator';
import theme from './src/theme';

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
