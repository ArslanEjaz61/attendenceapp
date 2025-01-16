import React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { Provider as StoreProvider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { store } from './src/store';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <StoreProvider store={store}>
      <PaperProvider>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </PaperProvider>
    </StoreProvider>
  );
}