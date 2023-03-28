import React from 'react';
import io from 'socket.io-client';
import styles from './ChatRoom.module.scss';

class ChatRoom extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      messageInput: '',
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleClearConversation = this.handleClearConversation.bind(this);
    this.messagesEndRef = React.createRef();
  }

  componentDidMount() {
    this.socket = io('http://localhost:4242');
    const ROOM_ID = 'common-room';
    this.socket.emit('join room', ROOM_ID);

    this.socket.on('chat message', (message) => {
      this.setState((prevState) => ({
        messages: [...prevState.messages, message],
      }), () => {
        this.scrollToBottom();
      });
    });

    this.socket.on('message history', (history) => {
      this.setState({ messages: history }, () => {
        this.scrollToBottom();
      });
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
        }), () => {
          this.scrollToBottom();
        });
      } else {
        console.error('Message was not confirmed by server.');
      }
    });
  }

  handleClearConversation() {
    this.setState({ messages: [] });
  }

  scrollToBottom() {
    this.messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
  }

  render() {
    return (
      <div className={styles.ChatRoom}>
        <ul className={styles.Messages}>
          {this.state.messages.map((message, index) => (
            <li key={index} className={styles.Message}>{message}</li>
          ))}
          <div ref={this.messagesEndRef}></div>
        </ul>
        <form onSubmit={this.handleSubmit} className={styles.Form}>
          <input
            type="text"
            placeholder='Type your message here...'
            value={this.state.messageInput}
            onChange={(event) =>
              this.setState({ messageInput: event.target.value })
            }
            className={styles.Input}
          />
          <button type="submit" className={styles.Button}>Send</button>
        </form>
        <p></p>
        <button onClick={this.handleClearConversation} className={styles.ClearButton}>Clear the conversation history</button>
      </div>
    );
  }
}

export default ChatRoom;
