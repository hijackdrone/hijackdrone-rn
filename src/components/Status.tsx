import React, {Component} from 'react';
import {View, Text, StyleSheet} from 'react-native';

export default function Status(props){
    return(
        <View style={style.connected}>
        {props.connected
            ?<Text>Connected!</Text>
            :props.found
                ?<Text>Room found</Text>
                :<Text>Room Not found</Text>
        }
        </View>
    )
}

const style=StyleSheet.create({
    connected: {
        flexDirection: 'row',
        justifyContent: 'center',
        textAlign: 'center',
    }
})