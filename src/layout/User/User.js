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

const User = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const handleItem = useNavigationItemHandle();

  const { t } = useTranslation(['translation', 'menu']);
  const user = location.state;
  console.log(user);

  const logoutUser = () => {
    localStorage.removeItem('jwtToken');


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

            <Link to={`../${demoPages.UserPages.subMenu.editUser.path}/${user.id}`}>
              <Button
                isLink
                color='success'
                icon='AccountBox'
                value='Profile'

                className='text-nowrap'>
                Profile
              </Button>
            </Link>

          </DropdownItem>
          <DropdownItem   >
            <Link to={demoPages.login.path}>
              <Button
                isLink
                color='info'
                icon='Logout'
                value='logout'
                onClick={logoutUser}
                className='text-nowrap'>
                Logout
              </Button>
            </Link>
          </DropdownItem>

        </DropdownMenu>
      </Dropdown>


    </>
  );
};

export default User;
