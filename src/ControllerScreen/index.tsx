import React, { Component } from 'react';
import { View, Text } from 'react-native';

export default class ControllerScreen extends Component{
    render(){
        return(
            <View>
                <Text>ControllerScreen</Text>
                <Text>조종하는 화면 필요.</Text>
                <Text>조종이냐, 드론이냐 결정 필요.</Text>
                <Text>소켓을 통한 통신 및 페어링 결정 알고리즘 필요.</Text>
            </View>
        );
    }
}