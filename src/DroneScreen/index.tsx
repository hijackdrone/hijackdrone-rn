import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { accelerometer, gyroscope, setUpdateIntervalForType, SensorTypes } from 'react-native-sensors';
import FC from './FC';

import FormPw from '../components/FormPw';
import Status from '../components/Status';
import Socket from '../components/Socket';
import SerialSend from './SerialSend';

import { endpoint } from '../endpoint';

let acc, gyro; //to make unsubscribing
// let acc_v, gyro_v;   
type State = {
	accel: PIDSource,
	gyro: PIDSource,
	err: string,
	socket: any,
	endpoint: string,
	pw: string,
	roll: string,
	connected: boolean,
	found: boolean,
	updating: boolean,
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
		accel: { x: 0, y: 0, z: 0 },
		gyro: { x: 0, y: 0, z: 0 },
		err: '',
		socket: null,
		endpoint: endpoint,
		pw: '',
		roll: 'd',
		connected: false,
		found: false,
		updating: false,
		to: '',
	}
	componentDidMount = () => {
		setUpdateIntervalForType(SensorTypes.accelerometer, 200); // defaults to 100ms
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
			const xt = Math.round(x * 100) / 100, yt = Math.round(y * 100) / 100, zt = Math.round(z * 100) / 100;
			this.setState({ gyro: { x: xt, y: yt, z: zt } });
		}, (err: string) => {
			this.setState({ err })
		});
	}
	subscribeAccelerometer = () => {
		acc = accelerometer.subscribe(({ x, y, z }: PIDSource) => {
			const xt = Math.round(x * 100) / 100, yt = Math.round(y * 100) / 100, zt = Math.round(z * 100) / 100;
			this.setState({ accel: { x: xt, y: yt, z: zt } });
		}, (err: string) => {
			this.setState({ err })
		});
	}
	extraSocketMethod = (socket) => {
		socket.emit('greeting', 'rn drone : id = ');
		socket.on('accept move', to => {
			this.move(to);
		});
		socket.on('wait', () => {
			this.setState({ connected: false })
		});
	}
	move = (to) => {
		//usb serial here
		this.setState({ to });
	}
	shouldComponentUpdate(nextProps, nextState) {
		if (this.state.accel !== nextState.accel && this.state.gyro !== nextState.gyro)
			return true;
		return false
	}
	// componentDidUpdate=()=>{ //for debug
	//     console.log(this.state.accel,this.state.gyro);
	// }
	render() {
		return (
			<View>
				<Socket
					socket={this.state.socket}
					endpoint={this.state.endpoint}
					pw={this.state.pw}
					roll={this.state.roll}
					changeState={(state: any) => this.setState(state)}
					extraSocketMethods={this.extraSocketMethod}
				/>
				<Status connected={this.state.connected} found={this.state.found}></Status>
				<FormPw
					socket={this.state.socket}
					pw={this.state.pw}
					onSubmit={(pw) => this.setState({ pw })}
					changeState={(state: any) => this.setState(state)}
					found={this.state.found}
					roll={this.state.roll}
					err={this.state.err}
				/>
				<View style={style.main}>
					<TouchableOpacity onPress={() => { }}>
						<Text style={style.activate} onPress={() => { this.toggleUpdateWithSensor() }}>{this.state.updating ? 'Deactivate' : 'Activate Sensor'}</Text>
					</TouchableOpacity>

					<SerialSend
						gyro={this.state.gyro}
						accel={this.state.accel}
						to={this.state.to}
						updating={this.state.updating}
						connected={this.state.connected}
						socket={this.state.socket}
					/>{/* socket for debug */}

					<Text>Socket error: {this.state.err}</Text>
					<Text>{this.state.to}</Text>
				</View>
			</View>
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