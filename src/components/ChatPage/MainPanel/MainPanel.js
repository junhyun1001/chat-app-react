import React, { Component } from "react";
import MessageHeader from "./MessageHeader";
import Message from "./Message";
import MessageForm from "./MessageForm";
import { connect } from "react-redux";
import { getDatabase, ref, onChildAdded, child } from "firebase/database";

export class MainPanel extends Component {
  messageEndRef = React.createRef();

  state = {
    messages: [],
    messagesRef: ref(getDatabase(), "messages"),
    messagesLoading: true,
    searchTerm: "",
    searchResults: [],
    searchLoading: false,
    // typingRef: ref(getDatabase(), "typing"),
    // typingUsers: [],
    // listenerLists: []
  };

  componentDidMount() {
    const { chatRoom } = this.props;

    if (chatRoom) {
      this.addMessagesListeners(chatRoom.id); //리스너 등록
    }
  }

  handleSearchChange = (event) => {
    this.setState(
      {
        searchTerm: event.target.value,
        searchLoading: true,
      },
      () => this.handleSearchMessages()
    );
  };

  handleSearchMessages = () => {
    const chatRoomMessages = [...this.state.messages];
    const regex = new RegExp(this.state.searchTerm, "gi");
    const searchResults = chatRoomMessages.reduce((acc, message) => {
      if (
        (message.content && message.content.match(regex)) ||
        message.user.name.match(regex)
      ) {
        acc.push(message);
      }
      return acc;
    }, []);
    this.setState({ searchResults });
  };

  addMessagesListeners = (chatRoomId) => {
    let messagesArray = [];

    let { messagesRef } = this.state;

    onChildAdded(child(messagesRef, chatRoomId), (DataSnapshot) => {
      messagesArray.push(DataSnapshot.val());
      this.setState({
        messages: messagesArray,
        messagesLoading: false,
      });
      // this.userPostsCount(messagesArray)
    });
  };

  renderMessages = (messages) =>
    messages.length > 0 &&
    messages.map((message) => (
      <Message
        key={message.timestamp}
        message={message}
        user={this.props.user}
      />
    ));

  render() {
    const { messages } = this.state;

    return (
      <div style={{ padding: "2rem 2rem 0 2rem" }}>
        <MessageHeader handleSearchChange={this.handleSearchChange} />

        <div
          style={{
            width: "100%",
            height: "450px",
            border: ".2rem solid #ececec",
            borderRadius: "4px",
            padding: "1rem",
            marginBottom: "1rem",
            overflowY: "auto",
          }}
        >
          {this.renderMessages(messages)}
        </div>

        <MessageForm />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user.currentUser,
    chatRoom: state.chatRoom.currentChatRoom,
  };
};
export default connect(mapStateToProps)(MainPanel);
