import React, {Component} from 'react';
import {StyleSheet, View, Text, TextInput, TouchableOpacity} from 'react-native';

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
                        ?<TouchableOpacity onPress={()=> this.findRoom(this.state.pw)}>
                            <Text style={style.connect}>Connect</Text>
                        </TouchableOpacity>
                        :<TouchableOpacity onPress={()=>this.leaveRoom(this.state.pw)}>
                            <Text style={style.connect}>Disconnect</Text>
                        </TouchableOpacity>
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
        // height: 20,
        paddingVertical: 0,
        textAlign: 'center',
        color: '#000000',
        borderBottomWidth: 1,
        borderBottomColor: '#111111',
    },
    found: {
        backgroundColor: '#000000',
        color: '#ffffff',
    },
    connect: {
        width: 200,
        height: 20,
        margin: 5,
        textAlign: 'center',
        color: 'white',
        backgroundColor: '#F66D79',
    },
    err: {
        textAlign: 'center',
        color: 'red',
        marginTop: 1,
    }
})