import React, { Component } from 'react';
import { StyleSheet, View, Text, TextInput } from 'react-native';

import { NavigationEvents } from "react-navigation";

// import socketIOClient from "socket.io-client";

import Controller from './Controller';
import FormPw from '../components/FormPw';
import Status from '../components/Status';
// import Socket from '../components/Socket';

// import { endpoint } from '../endpoint';

console.ignoredYellowBox = ['Remote debugger'];
import { YellowBox } from 'react-native';
import { SocketConsumer } from '../lib/socket';
YellowBox.ignoreWarnings([
	'Unrecognized WebSocket connection option(s) `agent`, `perMessageDeflate`, `pfx`, `key`, `passphrase`, `cert`, `ca`, `ciphers`, `rejectUnauthorized`. Did you mean to put these under `headers`?'
]);
//ignore socket warning

type State = {
	num: number,
	roll: string,
}

export default class ControllerScreen extends Component<{}, State>{
	static navigationOptions = {
		swipeEnabled: false
	}
	state: State = {
		num: 9,
		roll: 'c',
	}

	extraSocketMethod = (socket) => {
		socket.emit('greeting', `rn controller : id = `);
		// socket.on('wait', () => {
		// 	this.setState({ connected: false });
		// });
	}

	move = (socket: any, value: [string,string, Date?])=>{
		socket.emit('move', value);
	}

	render() {
		return (
			<SocketConsumer>{(socket) => (
				<View>
					<NavigationEvents onWillBlur={()=>socket.leaveRoom([socket.room, this.state.roll])} />
					<Status connected={socket.connected} found={socket.found}></Status>
					<FormPw
						socket={socket}
						room={socket.room}
						findRoom={(room: string) => socket.findRoom([room, this.state.roll])}
						leaveRoom={(room: string) => socket.leaveRoom([room, this.state.roll])}
						found={socket.found}
						roll={this.state.roll}
						err={socket.err}
					/>

					{socket.connected
						? <Controller move={(value: string)=>socket.move([socket.room, value])} room={socket.room} />
						: <></>
					}
				</View>
			)}</SocketConsumer>
		);
	}
}