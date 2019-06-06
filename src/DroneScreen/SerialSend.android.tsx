import React, {Component} from 'react';
import { UsbSerial} from 'react-native-usbserial';
import { Platform, DeviceEventEmitter, View, Text } from "react-native";

type Props={
    gyro: {x:number, y:number, z:number},
    accel: {x:number, y:number, z:number},
    to: string,
    connected: boolean,
    updating: boolean,
    socket: any,
}
type State={
    serviceStarted: boolean,
    connected: boolean,
    usbAttached: boolean,
    interface: number,
    baudRate: number,
    sendText: string,
    error?: boolean,
    code?: string,
    device: any,
    debug?: any,
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
          device: '',
        };
    }
    getDeviceAsync= async ()=>{
        try {
            const deviceList = await usbs.getDeviceListAsync();
            const firstDevice = deviceList[0];
            // console.log(firstDevice);
            if (firstDevice) {
                this.setState({usbAttached: true});
                const usbSerialDevice = await usbs.openDeviceAsync(firstDevice);
                // console.log(usbSerialDevice);
                this.setState({device: usbSerialDevice, connected: true, serviceStarted:true});
            }
            DeviceEventEmitter.addListener('newData', (e) => {
                this.props.socket.emit('debug',e);
            });
        } catch (err) {
            console.warn(err);
        }
    }
    componentDidMount=()=>{
        this.getDeviceAsync();
    }

    readDevice = (id) => {
        this.state.device.readDeviceAsync(id);
    }
    
    componentWillUnmount=()=>{
        this.setState({
            usbAttached: false,
            serviceStarted: false,
        })
    }
    writeStringData=()=>{
        if(this.state.connected && this.props.connected && this.state.device){
            const json={
                g: this.props.gyro,
                a: this.props.accel,
                t: this.props.to,
            };
            // this.state.device.writeAsync(JSON.stringify(json));
            this.state.device.writeAsync(this.props.to).then(()=>{
                this.readDevice(this.state.device.id);
            });
            // usbs.writeStringData(JSON.stringify(json));
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
                <Text>Debug : {this.state.debug}</Text>
            </View>
        )
    }
}