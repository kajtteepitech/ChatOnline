import React from 'react';
import io from 'socket.io-client';

class ChatRoom extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      messageInput: '',
    };

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    this.socket = io('http://localhost:4242');
    const ROOM_ID = 'common-room';
    this.socket.emit('join room', ROOM_ID);

    this.socket.on('chat message', (message) => {
      this.setState((prevState) => ({
        messages: [...prevState.messages, message],
      }));
    });

    this.socket.on('message history', (history) => {
      this.setState({ messages: history });
    });
  }

  componentWillUnmount() {
    this.socket.off('chat message');
    this.socket.off('message history');
    this.socket.disconnect();
  }

  handleSubmit(event) {
    event.preventDefault();
    const messageToSend = `${this.props.user.username}: ${this.state.messageInput}`;
    this.socket.emit('chat message', messageToSend, (confirmation) => {
      if (confirmation) {
        this.setState((prevState) => ({
          messages: [...prevState.messages, messageToSend],
          messageInput: '',
        }));
      } else {
        console.error('Message was not confirmed by server.');
      }
    });
  }

  render() {
    return (
      <div>
        <ul>
          {this.state.messages.map((message, index) => (
            <li key={index}>{message}</li>
          ))}
        </ul>
        <form onSubmit={this.handleSubmit}>
          <input
            type="text"
            value={this.state.messageInput}
            onChange={(event) =>
              this.setState({ messageInput: event.target.value })
            }
          />
          <button type="submit">Send</button>
        </form>
      </div>
    );
  }
}

export default ChatRoom;
