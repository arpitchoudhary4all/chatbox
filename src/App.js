import React from 'react'
import Chatkit from '@pusher/chatkit'
import { MessageList } from './components/MessageList'
import { SendMessageForm } from './components/SendMessageForm'
import { RoomList } from './components/RoomList'
import { NewRoomForm } from './components/NewRoomForm'

import { tokenUrl, instanceLocator } from './config'

import './style.css'

class App extends React.Component {
    
    constructor() {
        super()
        this.state = {
            roomId:null,
            messages: [],
            joinableRooms: [],
            joinedRooms: []
        }
        this.sendMessage = this.sendMessage.bind(this)
        this.subscribeToRoom = this.subscribeToRoom.bind(this)
        this.getJoinableRooms = this.getJoinableRooms.bind(this)
        this.createRoom = this.createRoom.bind(this)
    } 
    
    componentDidMount() {
        const chatManager = new Chatkit.ChatManager({
            instanceLocator,
            userId: 'Arpit239',
            tokenProvider: new Chatkit.TokenProvider({
                url: tokenUrl
            })
        })
        
        chatManager.connect()
        .then(currentUser => {
            this.currentUser = currentUser
            this.getJoinableRooms();
        })
        .catch(err => console.log('error on connecting: ', err))

    }
    
    getJoinableRooms(){
      this.currentUser.getJoinableRooms().then(joinableRooms =>{
        this.setState({
          joinableRooms,
          joinedRooms : this.currentUser.rooms
        })
      }).catch(err => console.log('error on joinableRooms: ', err))
    }

    subscribeToRoom(roomId){
      this.setState({ messages: [] })
      this.currentUser.subscribeToRoom({
        roomId: roomId,
        hooks: {
            onNewMessage: message => {
                this.setState({
                    messages: [...this.state.messages, message]
                })
            }
        }
    }).then(room => {
        this.setState({
            roomId: room.id
        })
        this.getJoinableRooms()
    }).catch(err => console.log("error on subscribing to room: ", err));
    }

    createRoom(name) {
        this.currentUser.createRoom({
            name:name
        })
        .then(room => this.subscribeToRoom(room.id))
        .catch(err => console.log('error with createRoom: ', err))
    }

    sendMessage(text) {
        this.currentUser.sendMessage({
            text,
            roomId: this.state.roomId
        })
    }
    
    render() {
        return (
            <div className="app">
                <RoomList 
                  roomId = {this.state.roomId}
                  subscribeToRoom = {this.subscribeToRoom}
                  getRooms = {this.getJoinableRooms}
                  rooms={[...this.state.joinableRooms, ...this.state.joinedRooms]}/>
                <MessageList roomId={this.state.roomId} messages={this.state.messages} />
                <NewRoomForm createRoom={this.createRoom}/>
                <SendMessageForm disabled={!this.state.roomId} sendMessage={this.sendMessage} />
            </div>
        );
    }
}

export default App