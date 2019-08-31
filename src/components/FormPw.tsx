import React, { Component } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity } from 'react-native';

export type Props = {
	socket: any,
	room: string,
	findRoom: (room: string) => any,
	leaveRoom: (room: string) => any,
	changeState?: (obj: any) => any,
	found: boolean,
	roll: string,
	err: string,
}
type State = {
	room: string
}
export default class FormPW extends Component<Props, State>{
	state: State = {
		room: '',
	}
	componentDidMount = () => {
		this.setState({ room: '' });
	}
	render() {
		return (
			<View>
				<View style={style.root}>
					<TextInput style={!this.props.found ? style.input : [style.input, style.found]}
						returnKeyType='send'
						onChangeText={(room) => {
							this.setState({ room });
							// this.props.changeState({ err: '' });
						}}
						placeholder='type your room pw'
						onSubmitEditing={() => {
							this.props.findRoom(this.state.room);
							// this.findRoom(this.state.pw)}
						}}
						value={this.state.room}
						editable={!this.props.found}
					/>
					<View>
						{!this.props.found
							? <TouchableOpacity onPress={() => this.props.findRoom(this.state.room)}>
								<Text style={style.connect}>Connect</Text>
							</TouchableOpacity>
							: <TouchableOpacity onPress={() => this.props.leaveRoom(this.state.room)}>
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
const style = StyleSheet.create({
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