import React, { Component } from 'react';
import { View, Text, TextInput } from 'react-native';
import { accelerometer, gyroscope, setUpdateIntervalForType, SensorTypes } from 'react-native-sensors';
import FC from './FC';

import FormPw from '../components/FormPw';
import Status from '../components/Status';
import Socket from '../components/Socket';

import {endpoint} from '../endpoint';

let acc,gyro; //to make unsubscribing
export default class DroneScreen extends Component{
    state={x:0,y:0,z:0,accel:{x:0,y:0,z:0},gyro:{x:0,y:0,z:0},accel_speed:0,gyro_speed:0,error: '',
        socket: null,
        endpoint: endpoint,
        pw: '',
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
    subscribeGyroscope = () => {
        gyro = gyroscope.subscribe( ({x,y,z}) => {
            this.setState({gyro: {x,y,z}});
        },(error: string) => {
            this.setState({error})
        });
    }
    subscribeAccelerometer = () => {
        acc = accelerometer.subscribe( ({x,y,z}) => {
            this.setState({accel: {x,y,z}});
        },(error: string) => {
            this.setState({error})
        });
    }
    extraSocketMethod = (socket)=>{
        socket.emit('greeting','rn drone : id = ');
    }
    render(){
        return(
            <View>
                <Socket
                    socket={this.state.socket}
                    endpoint={this.state.endpoint}
                    pw={this.state.pw}
                    roll={this.state.roll}
                    changeState={(state: any)=>this.setState(state)}
                    extraSocketMethods={this.extraSocketMethod}
                />
                <Status connected={this.state.connected} found={this.state.found}></Status>
                <FormPw
                    socket={this.state.socket}
                    pw={this.state.pw}
                    onSubmit={(pw)=>this.setState({pw})}
                    changeState={(state: any)=>this.setState(state)}
                    found={this.state.found}
                    roll={this.state.roll}
                />

                <Text onPress={this.toggleUpdateWithSensor}>{this.state.updating?'Deactivate Sensor':'Activate Sensor'}</Text>
                <FC info="Accel" data={this.state.accel}/>
                <FC info="Gyro" data={this.state.gyro}/>
                <Text>error: {this.state.error}</Text>
                <Text>{this.state.x}</Text>
                <Text>{this.state.y}</Text>
                <Text>{this.state.z}</Text>
            </View>
        );
    }
}

