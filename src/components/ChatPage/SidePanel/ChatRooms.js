import React, { Component } from "react";
import { FaRegSmileWink } from "react-icons/fa";
import { FaPlus } from "react-icons/fa";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { connect } from "react-redux";
import {
  getDatabase,
  ref,
  onChildAdded,
  push,
  child,
  update,
  off,
} from "firebase/database";
import { setCurrentChatRoom } from "../../../redux/actions/chatRoom_action";

export class ChatRooms extends Component {
  state = {
    show: false,
    name: "",
    description: "",
    chatRoomsRef: ref(getDatabase(), "chatRooms"),
    chatRooms: [],
    firstLoad: true,
    activeChatRoomId: "",
  };

  // 렌더링 최초 실행
  componentDidMount() {
    this.AddChatRoomsListeners();
  }

  // 컴포넌트가 언마운트 되기 직전 실행
  componentWillUnmount() {
    off(this.state.chatRoomsRef); // 리스너 제거
  }

  // 페이지 로딩시 첫번째 방 선택됨
  setFirstChatRoom = () => {
    const firstChatRoom = this.state.chatRooms[0];
    if (this.state.firstLoad && this.state.chatRooms.length > 0) {
      this.props.dispatch(setCurrentChatRoom());
      this.setState({ activeChatRoomId: firstChatRoom.id });
    }
    this.setState({ firstLoad: false });
  };

  AddChatRoomsListeners = () => {
    let chatRoomsArray = [];

    // 데이터가 추가 될 때(ChatRooms 테이블에 방 하나가 더 추가될 때)
    onChildAdded(this.state.chatRoomsRef, (DataSnapshot) => {
      chatRoomsArray.push(DataSnapshot.val());
      this.setState({ chatRooms: chatRoomsArray }, () =>
        this.setFirstChatRoom()
      );
    });
  };

  // Modal 열기 닫기
  handleClose = () => this.setState({ show: false });
  handleShow = () => this.setState({ show: true });

  // 방 생성 버튼을 누르면 유저에 관한 정보를 모으고 Firebase에 생성
  handleSubmit = (e) => {
    e.preventDefault(); // 임의로 페이지가 새로고침 되는거 막기

    const { name, description } = this.state;

    // 유효성 체크
    if (this.isFormValid(name, description)) {
      this.addChatRoom();
    }
  };

  // 방 이름과 설명만 있으면 유효함
  isFormValid = (name, description) => name && description;

  // 클릭시 해당 채팅방 변경
  changeChatRoom = (room) => {
    this.props.dispatch(setCurrentChatRoom(room)); // room 정보 redux store에 넣기
    this.setState({ activeChatRoomId: room.id });
  };

  // 채팅방 렌더링
  renderChatRooms = (chatRooms) =>
    chatRooms.length > 0 &&
    chatRooms.map((room) => (
      <li
        key={room.id}
        style={{
          backgroundColor:
            room.id === this.state.activeChatRoomId && "#ffffff45",
        }}
        onClick={() => this.changeChatRoom(room)} // 해당 채팅 방을 클릭 하면 방으로 이동
      >
        # {room.name}
        {/* <Badge style={{ float: "right", marginTop: "4px" }} variant="danger">
          {this.getNotificationCount(room)}
        </Badge> */}
      </li>
    ));

  // 방 이름과 설명을 Firebase에 전달
  addChatRoom = async () => {
    const key = push(this.state.chatRoomsRef).key; // 방 고유 key 자동 생성
    const { name, description } = this.state;
    const { user } = this.props;
    const newChatRoom = {
      id: key,
      name: name,
      description: description,
      createdBy: {
        name: user.displayName,
        image: user.photoURL,
      },
    };

    // 위의 정보를 Firebase에 전달
    try {
      await update(child(this.state.chatRoomsRef, key), newChatRoom);
      this.setState({
        name: "",
        description: "",
        show: false,
      });
    } catch (error) {
      alert(error);
    }
  };

  render() {
    return (
      <div>
        <div
          style={{
            position: "relative",
            width: "100%",
            display: "flex",
            alignItems: "center",
          }}
        >
          <FaRegSmileWink style={{ marginRight: 3 }} />
          CHAT ROOMS ({this.state.chatRooms.length})
          <FaPlus
            onClick={this.handleShow}
            style={{
              position: "absolute",
              right: 0,
              cursor: "pointer",
            }}
          />
        </div>

        <ul style={{ listStyleType: "none", padding: 0 }}>
          {this.renderChatRooms(this.state.chatRooms)}
        </ul>

        {/* ADD CHAT ROOM MODAL */}
        <Modal show={this.state.show} onHide={this.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Create a chat room</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={this.handleSubmit}>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>방 이름</Form.Label>
                <Form.Control
                  onChange={(e) => this.setState({ name: e.target.value })}
                  type="text"
                  placeholder="Enter a chat room name"
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>방 설명</Form.Label>
                <Form.Control
                  onChange={(e) =>
                    this.setState({ description: e.target.value })
                  }
                  type="text"
                  placeholder="Enter a chat room description"
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.handleClose}>
              Close
            </Button>
            <Button variant="primary" onClick={this.handleSubmit}>
              Create
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user.currentUser,
  };
};

export default connect(mapStateToProps)(ChatRooms);
