import React, { Component } from 'react';
import { View, Text, TextInput } from 'react-native';
import { NavigationEvents } from "react-navigation";
import { accelerometer, gyroscope, setUpdateIntervalForType, SensorTypes, isAvailable } from 'react-native-sensors';
import FC from './FC';

import FormPw from '../components/FormPw';
import {endpoint} from '../endpoint';
import socketIOClient from "socket.io-client";

let acc,gyro; //to make unsubscribing
export default class DroneScreen extends Component{
    state={x:0,y:0,z:0,accel:{x:0,y:0,z:0},gyro:{x:0,y:0,z:0},counter:0,accel_speed:0,gyro_speed:0,error: '',
        socket: null,
        endpoint: endpoint,
        pw: '',
        pw_typing: '',
        roll: 'd',
        connected: false,
        found: false,
        updating: false,
    }
    componentDidMount=()=>{
        setUpdateIntervalForType(SensorTypes.accelerometer, 40); // defaults to 100ms
    }
    toggleUpdateWithSensor=()=>{
        if(this.state.updating){
            this.setState({updating: false});
            gyro.unsubscribe();
            acc.unsubscribe();
        }else{
            this.setState({updating: true});
            this.subscribeGyroscope();
            this.subscribeAccelerometer();
        }   
    }

    connectSocket = ()=>{
        const { endpoint } = this.state;
        const socket = socketIOClient(endpoint);
        if(this.state.socket) this.state.socket.disconnect();
        this.setState({socket});
        this.socketMethods(socket);
    }

    socketMethods = (socket)=>{
        socket.emit('greeting','hi 4001, i am rn drone');
        socket.on('found room',(pw)=>{
            this.setState({found: true,pw});
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
    subscribeGyroscope = () => {
        gyro = gyroscope.subscribe( ({x,y,z}) => {
            this.setState({gyro: {x,y,z}, counter : this.state.counter+1});
        },error => {
            this.setState({error})
        });
    }
    subscribeAccelerometer = () => {
        acc = accelerometer.subscribe( ({x,y,z}) => {
            this.setState({accel: {x,y,z}, counter : this.state.counter+1});
        },error => {
            this.setState({error})
        });
    }
    onChange = (pw_typing: string)=>{
        this.setState({pw_typing});
    }

    findRoom = (pw: string)=>{
        const socket=this.state.socket;
        if(this.state.pw !== pw)
            socket.emit('find room',[pw, this.state.roll]);
    }
    render(){
        return(
            <View>
                <NavigationEvents onDidFocus={this.connectSocket} onWillBlur={this.disconnectSocket}/>
                {this.state.connected
                    ?<Text>Connected!</Text>
                    :this.state.found
                        ?<Text>found</Text>
                        :<Text>Not found</Text>
                }
                <FormPw pw={this.state.pw_typing} onChange={this.onChange} findRoom={this.findRoom}/>
                <Text onPress={this.toggleUpdateWithSensor}>{this.state.updating?'Deactivate Sensor':'Activate Sensor'}</Text>
                <FC info="Accel" data={this.state.accel}/>
                <FC info="Gyro" data={this.state.gyro}/>
                <Text>error: {this.state.error}</Text>
                <Text>{this.state.x}</Text>
                <Text>{this.state.y}</Text>
                <Text>{this.state.z}</Text>
                <Text>{this.state.counter}</Text>
            </View>
        );
    }
}

