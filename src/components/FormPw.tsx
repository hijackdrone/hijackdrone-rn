import React, {Component} from 'react';
import {StyleSheet, View, Text, TextInput} from 'react-native';

export type Props={
    socket: any,
    pw: string,
    onSubmit: (pw: string)=>any,
    changeState: (obj: any)=>any,
    found: boolean,
    roll: string,
    err: string,
}
type State={
    pw: string
}
export default class FormPW extends Component<Props,State>{
    state: State={
        pw: '',
    }
    componentDidMount=()=>{
        this.setState({pw: ''});
    }
    findRoom = (pw: string)=>{
        if(this.props.pw !== this.state.pw)
            this.props.socket.emit('find room',[pw, this.props.roll]);
    }
    leaveRoom = (pw: string)=>{
        this.props.socket.emit('leave room',[pw,this.props.roll]);
        this.props.changeState({pw: '', found: false, connected: false, err: ''});
    }
    render(){
        return(
            <View>
                <View style={style.root}>
                    <TextInput style={!this.props.found?style.input:[style.input,style.found]}
                        returnKeyType='send'
                        onChangeText={(pw)=>{
                            this.setState({pw});
                            this.props.changeState({err: ''});
                        }}
                        placeholder='type your room pw'
                        onSubmitEditing={()=> {
                            this.props.onSubmit(this.state.pw);
                            this.findRoom(this.state.pw)}
                        }
                        value={this.state.pw}
                        editable={!this.props.found}
                    />
                    <View>
                        {!this.props.found
                        ?<Text style={style.connect} onPress={()=> this.findRoom(this.state.pw) }>Connect</Text>
                        :<Text style={style.connect} onPress={()=>this.leaveRoom(this.state.pw)}>Disconnect</Text>
                        }
                        <Text style={style.err}>{this.props.err}</Text>
                    </View>
                </View>
            </View>
        )
    }
}
const style=StyleSheet.create({
    root: {
        flexDirection: 'column',
        alignItems: 'center',
    },
    input: {
        width: 200,
        height: 20,
        textAlign: 'center',
        borderBottomWidth: 1,
        borderBottomColor: 'gray',
    },
    found: {
        backgroundColor: 'black',
        color: 'white',
    },
    connect: {
        width: 200,
        height: 20,
        margin: 5,
        textAlign: 'center',
        color: 'white',
        backgroundColor: 'green',
    },
    err: {
        textAlign: 'center',
        color: 'red',
        marginTop: 1,
    }
})