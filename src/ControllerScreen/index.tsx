import React, { Component } from 'react';
import { StyleSheet, View, Text, TextInput } from 'react-native';

import { NavigationEvents } from "react-navigation";

import socketIOClient from "socket.io-client";

import Controller from './Controller';
import FormPw from '../components/FormPw';
import {endpoint} from '../endpoint';

console.ignoredYellowBox = ['Remote debugger'];
import { YellowBox } from 'react-native';
YellowBox.ignoreWarnings([
    'Unrecognized WebSocket connection option(s) `agent`, `perMessageDeflate`, `pfx`, `key`, `passphrase`, `cert`, `ca`, `ciphers`, `rejectUnauthorized`. Did you mean to put these under `headers`?'
]);
//ignore socket warning

type State={
    endpoint: string,
    socket: any,
    keys: string[],
    num: number,
    pw: string,
    pw_typing: string,
    roll: string,
    connected: boolean,
    found: boolean,
}

export default class ControllerScreen extends Component<{},State>{
    state: State={
        endpoint: endpoint,
        socket: null,
        keys: ['','forward','','left','','right','','backward',''],
        num: 9,
        pw: '',
        pw_typing: '',
        roll: 'c',
        connected: false,
        found: false,
    }
    componentDidMount=()=>{
    
    }
    connectSocket = ()=>{
        const { endpoint } = this.state;
        const socket = socketIOClient(endpoint);
        if(this.state.socket) this.state.socket.disconnect();
        this.setState({socket});
        this.socketMethods(socket);
    }

    socketMethods = (socket)=>{
        socket.emit('greeting','hi 4001, i am rn controller');
        socket.on('found room',(pw)=>{
            this.setState({found: true, pw});
        });
        socket.on('rejected room',()=>{
            this.setState({found: false, connected: false});
        });
        socket.on('connected',()=>{
            this.setState({connected: true});
        });
    }

    disconnectSocket = ()=>{
        const socket=this.state.socket;
        socket.emit('leave room',[this.state.pw,this.state.roll]);
        socket.disconnect();
        this.setState({socket: null,found: false, connected: false});
    }

    onChange = (pw_typing: string)=>{
        this.setState({pw_typing});
    }

    findRoom = (pw: string)=>{
        const socket=this.state.socket;
        if(this.state.pw !== pw){
            socket.emit('find room',[pw, this.state.roll]);
        }
    }

    render(){
        return(
            <View>
                <NavigationEvents onDidFocus={this.connectSocket} onWillBlur={this.disconnectSocket}/>
                <Text>ControllerScreen</Text>
                {this.state.connected
                    ?<Text>Connected!</Text>
                    :this.state.found
                        ?<Text>found</Text>
                        :<Text>Not found</Text>
                }
                
                <FormPw pw={this.state.pw_typing} onChange={this.onChange} findRoom={this.findRoom}/>
                <Controller keys={this.state.keys} num={this.state.num} />
            </View>
        );
    }
}