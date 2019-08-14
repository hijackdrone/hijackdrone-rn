import React, {Component} from 'react';
import { PanResponder, View, StyleSheet, Animated } from 'react-native';
import { number } from 'prop-types';

type State = {
  numberActiveTouches: number,
  pan: any,
}
export default class MultiTouchController extends Component<{},State> {
  state={
    numberActiveTouches: 0,
    pan: new Animated.ValueXY(),
  };

  _panResponder: any;
  numberActiveTouches: number;
  constructor(props){
    super(props);
    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderStart: (e,g)=>{
        const {numberActiveTouches} = g;
        this.setState({numberActiveTouches});
      },
      onPanResponderMove: Animated.event([null,{
        dx : this.state.pan.x,
        dy : this.state.pan.y,
      }]),
      onPanResponderRelease: (e, g)=>{
        this.setState({numberActiveTouches: 0});
        console.log(this.state.pan.x, this.state.pan.y);
        Animated.spring(
          this.state.pan,
          {toValue:{x:0,y:0}}
        ).start();
      }
    })
  }
  render() {
    const num=this.state.numberActiveTouches
    let cs;
    if(num===0){
      cs=[style.big];
    } else if (num===1){
      cs=[style.big, style.touching];
    } else {
      cs=[style.big_multi, style.touching];
    }
    return (
      <View>
        <Animated.View {...this._panResponder.panHandlers} style={[this.state.pan.getLayout(), cs]}/>
      </View>
    )
  }
}
const style = StyleSheet.create({
  big: {
    backgroundColor: '#005089',
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  touching: {
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 50,
    shadowColor: '#000000'
  },
  big_multi: {
    backgroundColor: '#772738',
    width: 100,
    height: 100,
    borderRadius: 50,
  }
})