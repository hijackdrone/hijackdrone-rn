import React, { Component } from 'react';

import { Platform, View, Text, DeviceEventEmitter } from "react-native";
import { RNSerialport, definitions, actions } from "react-native-serialport";

type Props = {
	gyro: { x: number, y: number, z: number },
	accel: { x: number, y: number, z: number },
	to: string,
	connected: boolean,
	updating: boolean,
}

type SerialSendState = {
	connected: boolean,
	attached: boolean,
}
export default class SerialSend extends Component<Props, SerialSendState>{
	platform: string;
	constructor(props) {
		super(props);
		this.state={
			connected: false,
			attached: false,
		}
		this.platform = Platform.OS;
	}
	componentDidMount() {
		DeviceEventEmitter.addListener(
			actions.ON_SERVICE_STARTED,
			this.onServiceStarted,
			this
		);
		DeviceEventEmitter.addListener(
			actions.ON_SERVICE_STOPPED,
			this.onServiceStopped,
			this
		);
		DeviceEventEmitter.addListener(
			actions.ON_DEVICE_ATTACHED,
			this.onDeviceAttached,
			this
		);
		DeviceEventEmitter.addListener(
			actions.ON_DEVICE_DETACHED,
			this.onDeviceDetached,
			this
		);
		DeviceEventEmitter.addListener(
			actions.ON_ERROR,
			this.onError,
			this
		);
		DeviceEventEmitter.addListener(
			actions.ON_CONNECTED,
			this.onConnected,
			this
		);
		DeviceEventEmitter.addListener(
			actions.ON_DISCONNECTED,
			this.onDisconnected,
			this
		);
		DeviceEventEmitter.addListener(
			actions.ON_READ_DATA,
			this.onReadData,
			this
		);
		RNSerialport.setInterface(-1); //default -1
		RNSerialport.setReturnedDataType(definitions.RETURNED_DATA_TYPES.HEXSTRING); //default INTARRAY
		RNSerialport.setAutoConnectBaudRate(115200);
		RNSerialport.setAutoConnect(true); // must be true for auto connect
		RNSerialport.startUsbService(); //start usb listener
	}
	componentDidUpdate = () => {
		const { gyro, accel } = this.props;
		console.log(gyro, accel);
		console.log(RNSerialport);
		RNSerialport.writeString(this.props.to)
	}
	componentWillUnmount = async () => {
		DeviceEventEmitter.removeAllListeners();
		RNSerialport.isOpen().then(() => {
			RNSerialport.disconnect();
			RNSerialport.stopUsbService();
		});
	}

	/* BEGIN Listener Methods */

	onDeviceAttached = () => { this.setState({attached: true}); console.log("Device Attached"); }

	onDeviceDetached = () => { this.setState({attached: false}); console.log("Device Detached") }

	onError = (error) => { console.log("Code: " + error.errorCode + " Message: " + error.errorMessage) }

	onConnected = () => { this.setState({connected: true}); console.log("Connected") }

	onDisconnected = () => { this.setState({connected: false}); console.log("Disconnected") }

	onServiceStarted = (response) => {
		//returns usb status when service started
		if (response.deviceAttached) {
			this.onDeviceAttached();
		}
	}

	onServiceStopped = () => { console.log("Service stopped") }

	onReadData(data) {
		console.log(data.payload)
	}
	render() {
		return (
			<View>
				<Text>SerialSend component</Text>
				<Text>Platform : {this.platform}</Text>
				<Text>usb attached: {this.state.attached? "true":"false"}</Text>
				<Text>usb connected: {this.state.connected? "true":"false"}</Text>
			</View>
		)
	}
}
