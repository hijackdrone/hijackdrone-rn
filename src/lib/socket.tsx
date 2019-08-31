import React, { Component } from 'react'
import io from 'socket.io-client';
import { endpoint } from '../endpoint';

type SocketContextFunction = {
  leaveRoom?(value: [string, string]): void, //room, roll
  findRoom?(value: [string, string]): void, //room, roll
  move?(value: [string, string, Date?]): void, //room, roll, TimeStamp
}

type SocketState = {
  socket: any,
  room: string,
  connected: boolean,
  found: boolean,
  err: string,
  to: string,
}

const SocketContext = React.createContext<SocketContextFunction & SocketState>({
  socket: null,
  room: '',
  connected: false,
  found: false,
  err: '',
  to: '',
});

export class SocketProvider extends Component<{}, SocketState>{
  state: SocketState={
    socket: null,
    room: '',
    connected: false,
    found: false,
    err: '',
    to: '',
  }

  componentDidMount(){
    const socket=io(endpoint);
    this.socketOnMethod(socket);
    this.setState({socket});
  }
  componentWillUnmount(){
    this.state.socket.disconnect();
  }

  // leaveRoom?(value: [string, string]): void, //room, roll
  leaveRoom=(value: [string, string])=>{
    const socket=this.state.socket;
    // console.log('leaveRoom', value);
    if(value[0]!=='') socket.emit('leave room', value);
    this.setState({connected: false, found: false});
  }

  // findRoom?(value: [string, string]): void, //room, roll
  findRoom=(value: [string, string])=>{
    const socket=this.state.socket;
    socket.emit('find room',value);
  }
  move=(value: [string, string, Date?])=>{
    const socket=this.state.socket;
    socket.emit('move', value);
  }
  removeError=(err: string)=>{
    if(err!=='') this.setState({err: ''});
  }
  socketOnMethod=(socket: any)=>{
    socket.on('wait', ()=>{
      this.removeError(this.state.err);
      this.setState({connected: false});
    });
    socket.on('found room', (room: string)=>{
      this.removeError(this.state.err);
      this.setState({found: true, room});
    });
    socket.on('rejected room', (err: string)=>{
      this.setState({found: false, err});
    });
    socket.on('connected', ()=>{
      this.removeError(this.state.err);
      this.setState({connected: true});
    });
    socket.on('accept move', (to: string)=>{
      this.setState({to});
    });
  }

  render(){
    const { socket, room, connected, found, to, err } = this.state;
    const { leaveRoom, findRoom, move } = this;
    return (
      <SocketContext.Provider value={{
        socket, room, connected, found, to, err, leaveRoom, findRoom, move
      }}>
        {this.props.children}
      </SocketContext.Provider>
    )
  }
}

export const SocketConsumer = SocketContext.Consumer