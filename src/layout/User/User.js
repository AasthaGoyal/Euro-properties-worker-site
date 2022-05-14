import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import USERS from '../../common/data/userDummyData';
import { demoPages } from '../../menu';
import useDarkMode from '../../hooks/useDarkMode';
import Collapse from '../../components/bootstrap/Collapse';
import { NavigationLine } from '../Navigation/Navigation';
import Icon from '../../components/icon/Icon';
import useNavigationItemHandle from '../../hooks/useNavigationItemHandle';
import Popovers from '../../components/bootstrap/Popovers';
import Dropdown, {
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
} from '../../components/bootstrap/Dropdown';
import Button from '../../components/bootstrap/Button';
import { Link } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import PropTypes from "prop-types";
import setAuthToken from '../utils/setAuthToken';
import { GET_ERRORS, SET_CURRENT_USER } from '../actions/types';
import { connect } from "react-redux";

const User = (props) => {
  const location = useLocation();
  const navigate = useNavigate();
  const handleItem = useNavigationItemHandle();

  const { t } = useTranslation(['translation', 'menu']);



  const user = props.auth;
  console.log("currently", user);

  // const logoutUser = () => {
  //   localStorage.removeItem('jwtToken');

  //   navigate("/");

  // }
  const logoutUser = ()  => {
    // Remove token from localStorage
    localStorage.removeItem('jwtToken');
    // Remove auth header for future requests
    setAuthToken(false);
    // Set current user to {} which will set isAuthenticated to false
    setCurrentUser({});
    navigate("/")

  
  };

  const setCurrentUser = decoded => {
    return {
      type: SET_CURRENT_USER,
      payload: decoded
    };
  };

  const profile = () => {
    const token = localStorage.getItem('jwtToken');

    const decoded = jwt_decode(token);
    console.log(user);
    navigate(`/user-pages/editUsers/${user.user.id}`);
  }



  return (
    <>

      <Dropdown >
        <DropdownToggle hasIcon={false}>

          <Button
            icon='PersonCheck'
            color='danger'
            isLight data-tour='filter'>

            Hello {user ? user.user.firstName : null}
            <div className='user-sub-title'>{user ? user.user.userType : null}</div>


          </Button>


        </DropdownToggle>
        <DropdownMenu isAlignmentEnd
          size='sm'
          isCloseAfterLeave={false}
          data-tour='filter-menu'>

          <DropdownItem   >


            <Button
              isLink
              color='success'
              icon='AccountBox'
              value='Profile'
              onClick={profile}
              className='text-nowrap'>
              Profile
            </Button>



          </DropdownItem>
          <DropdownItem   >

            <Button
              isLink
              color='info'
              icon='Logout'
              value='logout'
              onClick={logoutUser}
              className='text-nowrap'>
              Logout
            </Button>

          </DropdownItem>

        </DropdownMenu>
      </Dropdown>


    </>
  );
};

User.propTypes = {
  auth: PropTypes.object.isRequired,
  logoutUser: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  //
  auth: state.auth,
});

export default connect(mapStateToProps)(User);

