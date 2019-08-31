import React, { Component } from 'react'
import io from 'socket.io-client';
import { endpoint } from '../endpoint';

type SocketContextFunction = {
  leaveRoom?(value: [string, string]): void, //room, roll
  findRoom?(value: [string, string]): void, //room, roll
}

type SocketState = {
  socket: any,
  room: string,
  connected: boolean,
  found: boolean,
  err: string,
}

const SocketContext = React.createContext<SocketContextFunction & SocketState>({
  socket: null,
  room: '',
  connected: false,
  found: false,
  err: '',
});

export class SocketProvider extends Component<{}, SocketState>{
  state: SocketState={
    socket: null,
    room: '',
    connected: false,
    found: false,
    err: '',
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
    socket.emit('leave room', value);
    this.setState({connected: false, found: false});
  }

  // findRoom?(value: [string, string]): void, //room, roll
  findRoom=(value: [string, string])=>{
    const socket=this.state.socket;
    socket.emit('find room',value);
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
  }

  render(){
    const { socket, room, connected, found, err } = this.state;
    return (
      <SocketContext.Provider value={{
        socket, room, connected, found, err,
      }}>
        {this.props.children}
      </SocketContext.Provider>
    )
  }
}

export const SocketConsumer = SocketContext.Consumer