import React, {Component} from 'react';
import { UsbSerial} from 'react-native-usbserial';
import { Platform, DeviceEventEmitter, View, Text } from "react-native";

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
    device?: any,
}

const usbs = new UsbSerial();

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
    getDeviceAsync= async ()=>{
        try {
            const deviceList = await usbs.getDeviceListAsync();
            const firstDevice = deviceList[0];
            // console.log(firstDevice)
            this.props.socket.emit('debugs',firstDevice.length);
            // const arduino = deviceList.filter(e => e.vendorId===0x2341)[0];
            this.setState({usbAttached: true,connected: true})
            // console.log(firstDevice);
    
            if (firstDevice) {
                this.props.socket.emit('debugs','will open device',new Date());
                const usbSerialDevice = await usbs.openDeviceAsync(firstDevice);
                this.props.socket.emit('debugs','will open device',new Date());
                console.log(usbSerialDevice);
                this.setState({
                    serviceStarted:true,
                    device: usbSerialDevice
                })
            }
        } catch (err) {
            this.props.socket.emit('debugs','error with try');
            console.warn(err);
        }
    }
    componentDidMount=()=>{
        this.getDeviceAsync();
    }
    componentWillUnmount=()=>{
        this.setState({
            usbAttached: false,
            serviceStarted: false,
        })
    }
    writeStringData=()=>{
        if(this.state.connected && this.props.connected){
            console.log(this.state)
            const json={
                gyro: this.props.gyro,
                accel: this.props.accel,
                to: this.props.to,
            };
            this.state.device.writeInDeviceAsync(this.state.device.deviceId, this.props.to);
            // usbs.writeStringData
        }
    }
    componentDidUpdate=()=>{
        this.writeStringData();
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