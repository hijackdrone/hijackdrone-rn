import React, {Component} from 'react';
import {View, Text, TextInput} from 'react-native';

export default class FormPW extends Component{
    render(){
        return(
            <View>
                <TextInput />
                <Text>Connect</Text>
                <View>
                    <Text>Connected or not</Text>
                </View>
            </View>
        )
    }
}