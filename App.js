import React, { Component } from 'react';
import {
  StyleSheet,
  View
} from 'react-native';


import ChatScreen from "./src/screen/ChatScreen/ChatScreen";
import {SafeAreaProvider} from "react-native-safe-area-context";
import GoogleApp from "./google";

export default class App extends Component {


  render() {
    return (
            <SafeAreaProvider>
              {false ?
                  <View style={{flex:1}}>
                    <AuthScreen />
                    <GoogleApp />
                  </View> : <
                    ChatScreen />
              }
            </SafeAreaProvider>

    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
