/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
// import {Platform, StyleSheet, Text, View} from 'react-native';
import MainNavigator from './MainNavigator';
import { SafeAreaView } from 'react-navigation';
import { View, Text } from 'react-native';
import { SocketProvider } from './lib/socket';

export default class App extends Component {
  render() {
    return (
      <View style={{flex: 1}}>
        <SafeAreaView style={{flex: 1, flexGrow: 0, backgroundColor: '#005089'}} forceInset={{bottom: 'never'}}></SafeAreaView>
        <SocketProvider>
          <MainNavigator />
        </SocketProvider>
      </View>
    );
  }
}