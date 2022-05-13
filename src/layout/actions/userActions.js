import axios from 'axios';

import {
  ADD_USER,
  EDIT_USER,
  GET_ERRORS,
  CLEAR_ERRORS,
  GET_USER,
  GET_USERS,
  USER_LOADING,
  DELETE_USER
  
} from './types';

import {BASE_URL} from './actionConstant';



// Add User
export const addUser = userData => dispatch => {
  dispatch(clearErrors());
  axios
    .post(`${BASE_URL}/api/users/addUser`, userData)
    .then(res =>
      dispatch({
        type: ADD_USER,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};




// Get users
export const getUsers = () => dispatch => {
  dispatch(setUserLoading());
  axios
    .get(`${BASE_URL}/api/users`)
    .then(res =>
      dispatch({
        type: GET_USERS,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_USERS,
        payload: null
      })
    );
};


//Edit User
export const editUser = (id) => dispatch => {
  dispatch(setUserLoading());
  axios
    .put(`${BASE_URL}/api/users/edit/${id}`)
    .then(res =>
      dispatch({
        type: EDIT_USER,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};





// Get User
export const getUser = id => dispatch => {
  dispatch(setUserLoading());
  axios
    .get(`${BASE_URL}/api/users/${id}`)
    .then(res =>
      dispatch({
        type: GET_USER,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_USER,
        payload: null
      })
    );
};



// Delete User
export const deleteUser = id => dispatch => {
  axios
    .delete(`${BASE_URL}/api/users/${id}`)
    .then(res =>
      dispatch({
        type: DELETE_USER,
        payload: id
      })
    )
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};



// Set loading state
export const setUserLoading = () => {
  return {
    type: USER_LOADING
  };
};

// Clear errors
export const clearErrors = () => {
  return {
    type: CLEAR_ERRORS
  };
};
