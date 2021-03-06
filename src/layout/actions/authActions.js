import axios from 'axios';
import setAuthToken from '../utils/setAuthToken';
import jwt_decode from 'jwt-decode';


import { GET_ERRORS, SET_CURRENT_USER } from './types';

import { BASE_URL } from './actionConstant';
import { useNavigate, useHistory, Link } from 'react-router-dom';

//const BASE_URL = "http://18.218.32.98:5000";

// Register User
// export const registerUser = (userData, history) => dispatch => {
//   axios
//     .post(`${BASE_URL}/api/users/register`, userData)
//     .then(res => history.push('/login'))
//     .catch(err =>
//       dispatch({
//         type: GET_ERRORS,
//         payload: err.response.data
//       })
//     );
// };

// Login - Get User Token
export const loginUser = userData => dispatch => {

  console.log("logging in use", userData);
  axios
    .post(`${BASE_URL}/api/users/login`, userData)
    .then(res => {
      console.log(res.status);


      // Save to localStorage
      const { token } = res.data;
      // Set token to ls
      localStorage.setItem('jwtToken', token);
      // Set token to Auth header
      setAuthToken(token);
      // Decode token to get user data
      const decoded = jwt_decode(token);
      // Set current user
      dispatch(setCurrentUser(decoded));




    })
    .catch(err => {
      console.log("the error is", err);
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })

    }

    );
};

// Set logged in user
export const setCurrentUser = decoded => {
  return {
    type: SET_CURRENT_USER,
    payload: decoded
  };
};

// Log user out
export const logoutUser = () => dispatch => {
  // Remove token from localStorage
  localStorage.removeItem('jwtToken');
  // Remove auth header for future requests
  setAuthToken(false);
  // Set current user to {} which will set isAuthenticated to false
  dispatch(setCurrentUser({}));

};

