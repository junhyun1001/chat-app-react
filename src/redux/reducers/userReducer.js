import { SET_USER } from "../actions/types";

const initialUserstate = {
  currentUser: null,
  isLoading: true,
};

export default function (state = initialUserstate, action) {
  switch (action.type) {
    case SET_USER:
      return {
        ...state,
        currentUser: action.payload,
        isLoading: false,
      };
    default:
      return state;
  }
}
