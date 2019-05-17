import React, { Component } from 'react';
import { NavigationEvents } from 'react-navigation';
import socketIOClient from 'socket.io-client';

type Props={
    socket: any,
    endpoint: string,
    pw: string,
    roll: string,
    changeState: (object: any)=>any,
    extraSocketMethods: (socket: any)=>any,
}

export default class Socket extends Component<Props,{}>{
    connectSocket = () =>{
        const { endpoint } = this.props;
        const socket = socketIOClient(endpoint);
        if(this.props.socket) this.props.socket.disconnect();
        this.props.changeState({socket});
        this.socketMethods(socket);
    }
    socketMethods = (socket)=>{
        socket.on('found room',(pw)=>{
            // this.setState({found: true,pw});
            this.props.changeState({found: true,pw,err: ''});
        });
        socket.on('rejected room',(err)=>{
            this.props.changeState({found: false, connected: false, err});
        });
        socket.on('connected',()=>{
            this.props.changeState({connected: true, err: ''});
        });
        this.props.extraSocketMethods(socket);
    }
    disconnectSocket = (socket)=>{
        socket.emit('leave room',[this.props.pw, this.props.roll]);
        socket.disconnect();
        this.props.changeState({socket: null, found: false, connected: false,err: '',pw:''});
    }

    render(){
        return (
        <NavigationEvents
            onDidFocus={this.connectSocket}
            onWillBlur={()=>this.disconnectSocket(this.props.socket)}
        />
        )
    }
}