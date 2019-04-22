import React, {Component} from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { whileStatement } from '@babel/types';

type ControllerProps={
    keys: string[],
    num: number,
}
export default class Controller extends Component<ControllerProps,{}>{
    render(){
        return(
            <View style={style.root}>
                {this.props.keys.map((e,i)=>(
                    <View key={i} style={style.keys}>
                        <Text style={style.text}>{e}</Text>
                    </View>
                ))}
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
        backgroundColor: '#970918',
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        color: 'white',
    }
})