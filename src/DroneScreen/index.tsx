import React, { Component } from 'react';
import { View, Text } from 'react-native';

import { accelerometer, gyroscope, setUpdateIntervalForType, SensorTypes, isAvailable } from 'react-native-sensors';
import FC from './FC';

export default class DroneScreen extends Component{
    state={x:0,y:0,z:0,accel:{x:0,y:0,z:0},gyro:{x:0,y:0,z:0},counter:0,accel_speed:0,gyro_speed:0,error: ''}
    componentDidMount() {
        setUpdateIntervalForType(SensorTypes.accelerometer, 40); // defaults to 100ms
        this.subscribeGyroscope();
        this.subscribeAccelerometer();
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

