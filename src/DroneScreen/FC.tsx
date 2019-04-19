import React, {Component} from 'react';
import { View, Text } from 'react-native';

export default function FC(props){
    return(
        <View>
            <Text>{props.info}</Text>
            <Text>x: {props.data.x}</Text>
            <Text>y: {props.data.y}</Text>
            <Text>z: {props.data.z}</Text>
        </View>
    )
}