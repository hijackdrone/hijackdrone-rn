import React, { Component } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Keys } from './Key';
import Draggable from 'react-native-draggable';

type ControllerProps = {
  socket: any,
  pw: string,
}
export default class Controller extends Component<ControllerProps, {}>{
  move = (value) => {
    const socket = this.props.socket;
    const pw = this.props.pw;
    let v = value;
    for (let i = 0; i <= 15; i++) {
      v += v;
    }
    const time = new Date().toISOString;
    socket.emit('move_start', [pw, v, time]);
    for (let i = 0; i <= 1000; i++)
      socket.emit('tmp', [pw, v]);
    socket.emit('move', [pw, v, time]);
  }

  render() {
    return (
      <View style={style.root}>
        {Keys.map((e, i) => (
          <TouchableOpacity key={i} style={style.keys} onPressIn={() => this.move(e.value)}>
            <Text style={style.text}>{e.text}</Text>
          </TouchableOpacity>
        ))}å
        {/* <Draggable
          renderSize={50}
          renderColor='black'
          offsetX={0} offsetY={0}
          renderText=''
        /> */}
      </View>
    )
  }
}

const style = StyleSheet.create({
  root: {
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