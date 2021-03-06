import React, { Component } from 'react';
import { StyleSheet, View, Text, TextInput } from 'react-native';

import { NavigationEvents } from "react-navigation";

import socketIOClient from "socket.io-client";

import Controller from './Controller';
import FormPw from '../components/FormPw';
import Status from '../components/Status';
import Socket from '../components/Socket';

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
    num: number,
    pw: string,
    roll: string,
    connected: boolean,
    found: boolean,
    err: string,
}

export default class ControllerScreen extends Component<{},State>{
    static navigationOptions = {
        swipeEnabled: false
    }
    state: State={
        endpoint: endpoint,
        socket: null,
        num: 9,
        pw: '',
        roll: 'c',
        connected: false,
        found: false,
        err: '',
    }

    extraSocketMethod = (socket)=>{
        socket.emit('greeting',`rn controller : id = `);
        socket.on('wait',()=>{
            this.setState({connected: false});
        });
    }

    render(){
        return(
            <View>
                <Socket
                    socket={this.state.socket}
                    endpoint={this.state.endpoint}
                    pw={this.state.pw}
                    roll={this.state.roll}
                    changeState={(state: any)=>this.setState(state)}
                    extraSocketMethods={this.extraSocketMethod}
                />
                <Status connected={this.state.connected} found={this.state.found}></Status>

                <FormPw
                    socket={this.state.socket}
                    pw={this.state.pw}
                    onSubmit={(pw)=>this.setState({pw})}
                    changeState={(state: any)=>this.setState(state)}
                    found={this.state.found}
                    roll={this.state.roll}
                    err={this.state.err}
                />

                {this.state.connected
                ?<Controller socket={this.state.socket} pw={this.state.pw} />
                :<></>
                }
            </View>
        );
    }
}