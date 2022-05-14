import {
  ADD_USER,
  GET_USERS,
  GET_USER,
  EDIT_USER,
  DELETE_USER,
  USER_LOADING
} from '../layout/actions/types';

const initialState = {
  users: [],
  user: {},
  loading: false
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case USER_LOADING:
      return {
        ...state,
        loading: true
      };
    case GET_USERS:
      return {
        ...state,
        users: action.payload,
        loading: false
      };
      
    case GET_USER:
      return {
        ...state,
        user: action.payload,
        loading: false
      };
      
    case ADD_USER:
      return {
        ...state,
        users: [action.payload, ...state.users]
      };
      case EDIT_USER:
        return {
          ...state,
          users: [action.payload, ...state.users]
        };
    case DELETE_USER:
      return {
        ...state,
        users: state.users.filter(user => user._id !== action.payload)
      };
     
    default:
      return state;
  }
}

export default userReducer;