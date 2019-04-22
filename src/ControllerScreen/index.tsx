import React, { Component } from 'react';
import { View, Text } from 'react-native';
import socketIOClient from "socket.io-client";

type State={
    endpoint: string,
}
export default class ControllerScreen extends Component<{},State>{
    constructor(props){
        super(props);
        this.state={
            endpoint: 'http://127.0.0.1:4001',
        }
    }
    componentDidMount=()=>{
        const { endpoint } = this.state;
        this.socket = socketIOClient(endpoint);
        this.socket.emit('method1','hi 4001, i am rn');
    }
    sendSocket = ()=>{
        this.socket.emit('json',new Date());
    }
    render(){
        return(
            <View>
                <Text>ControllerScreen</Text>
                <Text>조종하는 화면 필요.</Text>
                <Text>조종이냐, 드론이냐 결정 필요.</Text>
                <Text>소켓을 통한 통신 및 페어링 결정 알고리즘 필요.</Text>
                <Text onPress={this.sendSocket}>send json</Text>
            </View>
        );
    }
}