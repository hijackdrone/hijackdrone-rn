import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { accelerometer, gyroscope, setUpdateIntervalForType, SensorTypes } from 'react-native-sensors';
import FC from './FC';

import FormPw from '../components/FormPw';
import Status from '../components/Status';
// import Socket from '../components/Socket';
import SerialSend from './SerialSend';

import { endpoint } from '../endpoint';
import { SocketConsumer } from '../lib/socket';
import { NavigationEvents } from 'react-navigation';

let acc, gyro; //to make unsubscribing
// let acc_v, gyro_v;   
type State = {
	// for sensor
	accel: PIDSource,
	gyro: PIDSource,
	updating: boolean,
	err: string,
	connected: boolean,
	
	// for socket
	roll: string,
	to: string,
}
type PIDSource = {
	x: number,
	y: number,
	z: number,
}
export default class DroneScreen extends Component<{}, State>{
	static navigationOptions = {
		swipeEnabled: false
	}
	state: State = {
		// for sensor
		accel: { x: 0, y: 0, z: 0 },
		gyro: { x: 0, y: 0, z: 0 },
		updating: false,
		connected: false,
		err: '',

		// for socket
		roll: 'd',
		to: '',
	}
	componentDidMount = () => {
		console.log(accelerometer);
		setUpdateIntervalForType(SensorTypes.accelerometer, 100); // defaults to 100ms
		setUpdateIntervalForType(SensorTypes.gyroscope, 100); // defaults to 100ms
	}
	toggleUpdateWithSensor = () => {
		if (this.state.updating) {
			this.setState({ updating: false });
			gyro.unsubscribe();
			acc.unsubscribe();
		} else {
			this.setState({ updating: true });
			this.subscribeGyroscope();
			this.subscribeAccelerometer();
		}
	}
	subscribeGyroscope = () => {
		gyro = gyroscope.subscribe(({ x, y, z }: PIDSource) => {
			const xt = Math.round(x * 1000) / 1000, yt = Math.round(y * 1000) / 1000, zt = Math.round(z * 1000) / 1000;
			this.setState({ gyro: { x: xt, y: yt, z: zt } });
		}, (err: string) => {
			this.setState({ err })
		});
	}
	subscribeAccelerometer = () => {
		acc = accelerometer.subscribe(({ x, y, z }: PIDSource) => {
			const xt = Math.round(x * 1000) / 1000, yt = Math.round(y * 1000) / 1000, zt = Math.round(z * 1000) / 1000;
			this.setState({ accel: { x: xt, y: yt, z: zt } });
		}, (err: string) => {
			this.setState({ err })
		});
	}

	// shouldComponentUpdate(nextProps, nextState) {
	// 	if (this.state.accel !== nextState.accel && this.state.gyro !== nextState.gyro)
	// 		return true;
	// 	return false
	// }

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
					<View style={style.main}>
						<TouchableOpacity onPress={() => { }}>
							<Text style={style.activate} onPress={() => { this.toggleUpdateWithSensor() }}>{this.state.updating ? 'Deactivate' : 'Activate Sensor'}</Text>
						</TouchableOpacity>
						<FC info="gyro" data={this.state.gyro}/>
						<FC info="accel" data={this.state.accel}/>
						<SerialSend
							gyro={this.state.gyro}
							accel={this.state.accel}
							to={socket.to}
							updating={this.state.updating}
							connected={socket.connected}
						/>
						{/* socket for debug */}
						<Text>Socket error: {this.state.err}</Text>
						<Text>{this.state.to}</Text>
					</View>
				</View>
			)}</SocketConsumer>
		);
	}
}

const style = StyleSheet.create({
	main: {
		padding: 10,
	},
	activate: {
		marginTop: 10,
		padding: 10,
		backgroundColor: '#D6B572',
		width: 100,
		textAlign: 'center',
		color: '#ffffff',
	},
})