import React, { Component } from 'react';
import { View, Text, TextInput } from 'react-native';

import { accelerometer, gyroscope, setUpdateIntervalForType, SensorTypes, isAvailable } from 'react-native-sensors';
import FC from './FC';

import socketIOClient from "socket.io-client";

export default class DroneScreen extends Component{
    state={x:0,y:0,z:0,accel:{x:0,y:0,z:0},gyro:{x:0,y:0,z:0},counter:0,accel_speed:0,gyro_speed:0,error: '',
        socket: null,
        endpoint: 'http://49.236.137.170:4001/',
    }
    componentDidMount() {
        setUpdateIntervalForType(SensorTypes.accelerometer, 40); // defaults to 100ms
        this.subscribeGyroscope();
        this.subscribeAccelerometer();
        const { endpoint } = this.state;
        const socket = socketIOClient(endpoint);
        this.setState({socket},()=>{
            this.state.socket.emit('method1','hi 4001, i am rn Drone');
            this.state.socket.on('getit',value=>{
                const responsed_time=new Date();
                const requested_time=new Date(value);
                console.log(value);
                this.setState({ logs: [responsed_time-requested_time, ...this.state.logs] });
            });
        });
    }
    subscribeGyroscope = () => {
        gyroscope.subscribe( ({x,y,z}) => {
            this.setState({gyro: {x,y,z}, counter : this.state.counter+1});
        },error => {
            this.setState({error})
        });
    }
    subscribeAccelerometer = () => {
        accelerometer.subscribe( ({x,y,z}) => {
            this.setState({accel: {x,y,z}, counter : this.state.counter+1});
        },error => {
            this.setState({error})
        });
    }
    render(){
        return(
            <View>
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

