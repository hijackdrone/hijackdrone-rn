import React, { Component } from 'react';
import { StyleSheet, View, Text, TextInput } from 'react-native';
import socketIOClient from "socket.io-client";

import Controller from './Controller';
import FormPw from '../components/FormPw';

type State={
    endpoint: string,
    socket: any,
    keys: string[],
    num: number,
    pw: string,
    type: string,
    connected: boolean,
}

console.ignoredYellowBox = ['Remote debugger'];
import { YellowBox } from 'react-native';
YellowBox.ignoreWarnings([
    'Unrecognized WebSocket connection option(s) `agent`, `perMessageDeflate`, `pfx`, `key`, `passphrase`, `cert`, `ca`, `ciphers`, `rejectUnauthorized`. Did you mean to put these under `headers`?'
]);
//ignore socket warning

export default class ControllerScreen extends Component<{},State>{
    state={
        endpoint: 'http://49.236.137.170:4001/',
        socket: null,
        keys: ['','forward','','left','','right','','backward',''],
        num: 9,
        pw: '',
        type: 'c',
        connected: false,
    }
    componentDidMount=()=>{
        const { endpoint } = this.state;
        const socket = socketIOClient(endpoint);
        this.setState({socket})
        socket.emit('method1','hi 4001, i am rn');

        socket.on('found room',()=>{

        });
        socket.on('rejected room',()=>{

        })
    }

    sendSocket = ()=>{
        if(this.state.toggle){
            this.setState({toggle: !this.state.toggle});
            this.setState({interval: setInterval(()=>{this.state.socket.emit('json',new Date()),40})});
        }
        else{
            this.setState({toggle: !this.state.toggle});
            clearInterval(this.state.interval)
        }
        
        // this.state.socket.emit('json', new Date());
    }

    onChange = (pw)=>{
        this.setState({pw});
    }

    findRoom = (pw)=>{
        const socket=this.state.socket;
        socket.emit('find room',[pw,this.state.type]);
    }
    render(){
        return(
            <View>
                <Text>ControllerScreen</Text>
                <Text onPress={this.sendSocket}>send json</Text>
                <FormPw pw={this.state.pw} onChange={this.onChange} onSubmit={this.findRoom}/>
                <Controller keys={this.state.keys} num={this.state.num} />
                {this.state.logs.map((e,i)=>(
                    <Text key={i}>{e} ms</Text>
                ))}
            </View>
        );
    }
}