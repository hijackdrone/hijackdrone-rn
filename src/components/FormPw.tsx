import React, {Component} from 'react';
import {StyleSheet, View, Text, TextInput} from 'react-native';

export type Props={
    pw: string,
    onChange: (pw: string)=>any,
    findRoom: (pw: string)=>any,
}

export default class FormPW extends Component<Props,{}>{
    state:{
        typing: false,
    }
    render(){
        return(
            <View>
                <View style={style.root}>
                    <TextInput style={style.input}
                        returnKeyType='send'
                        onChangeText={this.props.onChange}
                        placeholder='type your room pw'
                        onFocus={()=>this.setState({typing:true})}
                        onBlur={()=>this.setState({typing: false})}
                        onSubmitEditing={()=> this.props.findRoom(this.props.pw)}
                        value={this.props.pw}
                    />
                    <Text onPress={()=> this.props.findRoom(this.props.pw) }>Connect</Text>
                </View>
                <View>
                    <Text>Connected or not</Text>
                </View>
            </View>
        )
    }
}
const style=StyleSheet.create({
    root: {
        flexDirection: 'row',
    },
    input: {
        width: 200,
        height: 20,
        borderBottomWidth: 1,
        borderBottomColor: 'gray',
    },
})