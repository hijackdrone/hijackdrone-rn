import React, {Component} from 'react';
import { RNSerialport, definitions, actions, DefinitionsStatic, ReturnedDataTypes } from "react-native-serialport";
import { Platform, DeviceEventEmitter, View, Text } from "react-native";

type Props={
    gyro: {x:number, y:number, z:number},
    accel: {x:number, y:number, z:number},
    to: string
}
type State={
    serviceStarted: boolean,
    connected: boolean,
    usbAttached: boolean,
    interface: number,
    baudRate: number,
    sendText: string,
    error?: boolean,
}
export default class SerialSend extends Component<Props,State>{
    state: State;
    platform: string;
    constructor(props) {
        super(props);

        this.platform=Platform.OS;
        this.state = {
          serviceStarted: false,
          connected: false,
          usbAttached: false,
          baudRate: 9600,
          interface: -1,
          sendText: "HELLO",
        };
    }
    
    componentDidMount=()=>{
        this.startUsbListener();
    }

    componentWillUnmount=()=>{
        this.stopUsbListener();
    }

    startUsbListener=()=>{
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
        DeviceEventEmitter.addListener(actions.ON_ERROR, this.onError, this);
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

        RNSerialport.setAutoConnectBaudRate(this.state.baudRate);
        RNSerialport.setInterface(this.state.interface);
        RNSerialport.setAutoConnect(true);
        RNSerialport.startUsbService();
    };

    stopUsbListener = async () => {
        DeviceEventEmitter.removeAllListeners();
        const isOpen = await RNSerialport.isOpen();
        if (isOpen) {
        //   Alert.alert("isOpen", isOpen);
            RNSerialport.disconnect();
        }
        RNSerialport.stopUsbService();
    };

    onServiceStarted=(response)=>{
        this.setState({ serviceStarted: true });
        if (response.deviceAttached) {
            this.onDeviceAttached();
        }
    }
    onServiceStopped=()=>{
        this.setState({ serviceStarted: false });
    }
    onDeviceAttached=()=>{
        this.setState({ usbAttached: true });
    }
    onDeviceDetached=()=>{
        this.setState({ usbAttached: false });
    }
    onConnected=()=>{
        this.setState({ connected: true });
    }
    onDisconnected=()=>{
        this.setState({ connected: false });
    }
    onError=()=>{
        this.setState({ error: true });
    }

    writeStringData=()=>{
        if(this.state.connected){
            const json={
                gyro: this.props.gyro,
                accel: this.props.accel,
                to: this.props.to,
            };
            RNSerialport.writeString(JSON.stringify(json));
        }
    }
    
    componentDidUpdate=()=>{
        this.writeStringData();
    }
    
    render(){
        return (
            <View>
                <Text>SerialSend component</Text>
                <Text>Platform : {this.platform}</Text>
                <Text>serviceStarted : {this.state.serviceStarted}</Text>
                <Text>connected : {this.state.connected}</Text>
                <Text>usbAttached : {this.state.usbAttached}</Text>
                <Text>error : {this.state.error}</Text>
            </View>
        )
    }
}