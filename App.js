import { StyleSheet, Text, View } from 'react-native';
import 'react-native-gesture-handler'
import {StatusBar} from 'expo-status-bar'
import React, {useEffect, useState} from 'react'
import {NavigationContainer} from '@react-navigation/native'
import {createStackNavigator} from '@react-navigation/stack'
import { registerRootComponent } from 'expo';


import HomeScreen from './screens/HomeScreen'
import LoginScreen from './screens/LoginScreen'
import RegisterScreen from './screens/RegisterScreen'
import AddScreen from './screens/AddScreen'
import UpdateScreen from './screens/UpdateScreen'
import AllTransactions from './screens/AllTransactions'

const Stack = createStackNavigator()

export default function App() {
  const globalScreenOptions = {
    headerStyle: {
      
      backgroundColor: '#555',
    },
    headerTitleStyle: {
      color: '#fff',
    },
    headerTintColor: '#fff',
  }
  return (
    <NavigationContainer>
    <StatusBar style='dark' />
    <Stack.Navigator screenOptions={globalScreenOptions}>
      <Stack.Screen name='Login' component={LoginScreen} />
      <Stack.Screen name='Register' component={RegisterScreen} />
      <Stack.Screen name='Home' component={HomeScreen} />
      <Stack.Screen name='Add' component={AddScreen} />
      <Stack.Screen name='Update' component={UpdateScreen} />
      <Stack.Screen name='All' component={AllTransactions} />
    </Stack.Navigator>
  </NavigationContainer>
  );
}

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });

registerRootComponent(App);

