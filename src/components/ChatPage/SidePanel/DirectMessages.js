// import React, { Component } from "react";
// import { FaRegSmile } from "react-icons/fa";
// import { connect } from "react-redux";
// import { getDatabase, ref, onChildAdded } from "firebase/database";
// import {
//   setCurrentChatRoom,
//   setPrivateChatRoom,
// } from "../../../redux/actions/chatRoom_action";

// export class DirectMessages extends Component {
//   componentDidMount() {
//     if (this.props.user) {
//       this.addUsersListeners(this.props.user.uid);
//     }
//   }

//   addUsersListeners = (currentUserId) => {
//     const { usersRef } = this.state;
//     let usersArray = [];

//     onChildAdded(usersRef, (DataSnapshot) => {
//       if (currentUserId !== DataSnapshot.key) {
//         let user = DataSnapshot.val();
//         user["uid"] = DataSnapshot.key;
//         user["status"] = "offline";
//         usersArray.push(user);
//         this.setState({ users: usersArray });
//       }
//     });
//   };

//   getChatRoomId = (userId) => {
//     const currentUserId = this.props.user.uid;

//     return userId > currentUserId
//       ? `${userId}/${currentUserId}`
//       : `${currentUserId}/${userId}`;
//   };

//   changeChatRoom = (user) => {
//     const chatRoomId = this.getChatRoomId(user.uid);
//     const chatRoomData = {
//       id: chatRoomId,
//       name: user.name,
//     };

//     this.props.dispatch(setCurrentChatRoom(chatRoomData));
//     this.props.dispatch(setPrivateChatRoom(true));
//     this.setActiveChatRoom(user.uid);
//   };

//   renderDirectMessages = (users) =>
//     users.length > 0 &&
//     users.map((user) => (
//       <li
//         key={user.uid}
//         style={{
//           backgroundColor:
//             user.uid === this.state.activeChatRoom && "#ffffff45",
//         }}
//         onClick={() => this.changeChatRoom(user)}
//       >
//         # {user.name}
//       </li>
//     ));

//   render() {
//     return (
//       <div>
//         <span style={{ display: "flex", alignItems: "center" }}>
//           <FaRegSmile style={{ marginRight: 3 }} /> DIRECT MESSAGES(3)
//         </span>

//         <ul style={{ listStyleType: "none", padding: 0 }}></ul>
//       </div>
//     );
//   }
// }

// const mapStateToProps = (state) => {
//   return {
//     user: state.user.currentUser,
//   };
// };

// export default connect(mapStateToProps)(DirectMessages);

import React, { Component } from "react";

export class DirectMessages extends Component {
  render() {
    return <div>DirectMessages</div>;
  }
}

export default DirectMessages;
