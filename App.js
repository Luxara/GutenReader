import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator} from '@react-navigation/native-stack'
import SearchScreen from './SearchScreen';
import ReaderScreen from './ReaderScreen';
import FavoriteScreen from './FavoriteScreen';
import InfoScreen from './InfoScreen';
import { Button } from '@rneui/base';

export default function App() {
  const Stack = createNativeStackNavigator();

  
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={SearchScreen} options={{title: 'Home', headerStyle: {backgroundColor: '#004107',},headerTintColor: '#fff',}} />
        <Stack.Screen name="Info" component={InfoScreen} options={{title: 'Info', headerStyle: {backgroundColor: '#004107',},headerTintColor: '#fff',}}/>
        <Stack.Screen name="Reader" component={ReaderScreen} options={{title: 'Reader', headerStyle: {backgroundColor: '#004107',},headerTintColor: '#fff', }}/>
        <Stack.Screen name="Favorites" component={FavoriteScreen} options={{title: 'My Favorites', headerStyle: {backgroundColor: '#004107',},headerTintColor: '#fff', }}/>
      </Stack.Navigator>
    </NavigationContainer>
   
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input:{
    width:200,
    marginBottom:20,
    borderColor:'gray',
    borderWidth:1
  },
});

