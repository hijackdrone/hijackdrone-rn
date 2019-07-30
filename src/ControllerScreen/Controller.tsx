import React, {Component} from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Keys } from './Key';
import Draggable from 'react-native-draggable';

type ControllerProps={
    socket: any,
    pw: string,
}
export default class Controller extends Component<ControllerProps,{}>{
    move=(value)=>{
        const socket = this.props.socket;
        const pw = this.props.pw;
        socket.emit('move',[pw,value])
    }

    render(){
        return(
            <View style={style.root}>
                {/* {Keys.map((e,i)=>(
                    <TouchableOpacity key={i} style={style.keys} onPressIn={()=>this.move(e.value)}>
                        <Text style={style.text}>{e.text}</Text>
                    </TouchableOpacity>
                ))} */}
                <Draggable
                    renderSize={50}
                    renderColor='black'
                    offsetX={0} offsetY={0}
                    renderText=''
                />
            </View>
        )
    }
}

const style=StyleSheet.create({
    root:{
        flexWrap: 'wrap',
        flexDirection: 'row',
    },
    keys: {
        width: 110,
        height: 110,
        margin: 5,
        backgroundColor: '#E54B4B',
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        color: 'white',
    }
})