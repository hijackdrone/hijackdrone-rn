import React, {Component} from 'react';
import { Platform, View, Text } from "react-native";
import UsbArduino from './UsbArduino';

type Props={
    gyro: {x:number, y:number, z:number},
    accel: {x:number, y:number, z:number},
    to: string,
    connected: boolean,
    updating: boolean,
    socket?: any,
}
type State={
    serviceStarted: boolean,
    connected: boolean,
    usbAttached: boolean,
    interface: number,
    baudRate: number,
    sendText: string,
    error?: boolean,
    code?: string
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
        UsbArduino.getArduino().then(()=>{
            this.setState({
                serviceStarted: true,
                usbAttached: true,
            })
        })
    }
    componentWillUnmount=()=>{
        this.setState({
            usbAttached: false,
            serviceStarted: false,
        })
    }
    
    componentDidUpdate=()=>{
        UsbArduino.writeArduino(this.props.to);
    }
    render(){
        return (
            <View>
                <Text>SerialSend component</Text>
                <Text>Serial Start : {this.props.updating && this.props.connected?'true':'false'}</Text>
                <Text>Platform : {this.platform}</Text>
                <Text>serviceStarted : {this.state.serviceStarted?'true':'false'}</Text>
                <Text>serial connected : {this.state.connected?'true':'false'}</Text>
                <Text>usbAttached : {this.state.usbAttached?'true':'false'}</Text>
                <Text>Serial error : {this.state.error?`${this.state.code}`:'false'}</Text>
            </View>
        )
    }
}