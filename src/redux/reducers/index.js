import { combineReducers } from "redux";
import user from "./userReducer";
import chatRoom from "./chatRoom_reducer";

// reducer들을 합쳐줌
const rootReducer = combineReducers({
  user,
  chatRoom
});

export default rootReducer;
