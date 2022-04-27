import React, { useState, useEffect } from 'react';
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../../actions/actionConstant";
import classNames from 'classnames';
import moment from 'moment';
import { useFormik } from 'formik';
import { demoPages } from '../../menu';
import Card, {
  CardActions,
  CardBody,
  CardHeader,
  CardLabel,
  CardTitle,
} from '../../components/bootstrap/Card';
import Button from '../../components/bootstrap/Button';
import { priceFormat } from '../../helpers/helpers';
import Dropdown, {
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
} from '../../components/bootstrap/Dropdown';
import Icon from '../../components/icon/Icon';
import OffCanvas, {
  OffCanvasBody,
  OffCanvasHeader,
  OffCanvasTitle,
} from '../../components/bootstrap/OffCanvas';
import FormGroup from '../../components/bootstrap/forms/FormGroup';
import Input from '../../components/bootstrap/forms/Input';
import Textarea from '../../components/bootstrap/forms/Textarea';
import Checks from '../../components/bootstrap/forms/Checks';
import Popovers from '../../components/bootstrap/Popovers';
import data from './data/dummyEventsData';
import USERS from '../../common/data/userDummyData';
import EVENT_STATUS from './data/enumEventStatus';
import Avatar from '../../components/Avatar';
import PaginationButtons, { dataPagination, PER_COUNT } from '../../components/PaginationButtons';
import useSortableData from '../../hooks/useSortableData';
import useDarkMode from '../../hooks/useDarkMode';
import UserData from './data/UserData';
import _ from "lodash";
import page from "../presentation/users/ListUsers";

const ListUsers = (props) => {

  const { themeStatus, darkModeStatus } = useDarkMode();

  // const { isAuthenticated, user } = props.auth;

  // const [modal, setModal] = useState(false);
  // const [userId, setUserId] = useState("");

  const [users, setUsers] = useState([]);
  const [modal, setModal] = useState(false);
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);
  const [perPage, setPerPage] = useState(PER_COUNT['5']);

  React.useEffect(() => {
    setLoading(true);
    axios.get(`http://localhost:5000/api/users`).then((response) => {
      setUsers(response.data);

    });
    setLoading(false);
  }, []);

  const openModal = (id) => {
    // setUserId(id)
    setModal(!modal);
    setUserId(id);
    console.log("User:", id);
  };

  // // const { themeStatus, darkModeStatus } = useDarkMode();
  // const [currentPage, setCurrentPage] = useState(1);


  // const { users, requestSort, getClassNamesFor } = useSortableData(userdata);

  // console.log("sorted users", users);
  // const { jsonUsers } = JSON.stringify(users);

  let userTable;
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  if (currentUsers.length === 0) {
    userTable = (
      <tr>
        <td colSpan="8">No records</td>
      </tr>
    );
  } else {
    userTable = _.map(currentUsers, (user) => {
      return (
        <tr key={user._id}>
          <td>{user.userType}</td>
          <td>{user.username}</td>
          <td>
            {user.firstName} {user.lastName}
          </td>
          <td>{user.email}</td>
          <td>{user.phone}</td>
          <td>{user.note}</td>

          <td>
            <Dropdown>
              <DropdownToggle hasIcon={false}>
                <Button
                  isLink
                  color={user.status == "Active" ? "success" : "danger"}
                  icon='Circle'
                  className='text-nowrap'>
                  {user.status}
                </Button>
              </DropdownToggle>
              <DropdownMenu>
                {Object.keys(EVENT_STATUS).map((key) => (
                  <DropdownItem key={key}>
                    <div>
                      <Icon
                        icon='Circle'
                        color={EVENT_STATUS[key].color}
                      />
                      {EVENT_STATUS[key].name}
                    </div>
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
          </td>
          <td>

            <Button
              isOutline={!darkModeStatus}
              color='dark'
              isLight={darkModeStatus}
              className={classNames('text-nowrap', {
                'border-light': !darkModeStatus,
              })}
              icon='Edit'
              // onClick={openModal.bind(this, user._id)}
              to={`../${demoPages.UserPages.subMenu.editUsers.path}/${user._id}`} >
              Edit
            </Button>

          </td>

        </tr>
      );
    });
  }

  let userLoading;
  if (loading) {
    console.log("this is loading");
    userLoading = (
      <tr>
        <td colSpan="8">
          <h3>Loading...</h3>
        </td>
      </tr>
    );
  } else {
    userLoading = userTable;
  };



  return (
    <Card >
      <CardHeader borderSize={1}>
        <CardLabel icon='Person' >
        
          <CardTitle>Users</CardTitle>
      
        </CardLabel>
        <CardActions>
          <Button
            color='info'
            icon='Add'
            isLight
            tag='a'
            to={`../${demoPages.UserPages.subMenu.addUsers.path}`}
            target='_blank'
          >
            Add New User
          </Button>
        </CardActions>
      </CardHeader>

      <CardBody className='table-responsive' >

        <table className='table table-modern'>
          <thead>
            <tr>

              <th>Role</th>
              <th>Username</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Notes</th>
              <th>Status</th>
              <td />

            </tr>
          </thead>
          <tbody>
            {userLoading}

            {/*<td>
                  <Button
                    isOutline={!darkModeStatus}
                    color='dark'
                    isLight={darkModeStatus}
                    className={classNames({
                      'border-light': !darkModeStatus,
                    })}
                    icon='Info'
                    aria-label='Detailed information'
                  />
                </td>
                <td>
                  <div className='d-flex align-items-center'>
                    <span
                      className={classNames(
                        'badge',
                        'border border-2',
                        [`border-${themeStatus}`],
                        'rounded-circle',
                        'bg-success',
                        'p-2 me-2'
                      )}>
                      <span className='visually-hidden'>
                        sample
                      </span>
                    </span>

                  </div>
                </td>
                <td>
                  <div>
                    <div>{users.userType}</div>
                    <div className='small text-muted'>
                      {user.email}
                    </div>
                  </div>
                </td>
                <td>
                  <div className='d-flex'>
                    <div className='flex-shrink-0'>
                      avatar
                    </div>
                    <div className='flex-grow-1 ms-3 d-flex align-items-center text-nowrap'>
                      {`${user.firstName} ${user.lastName}`}
                    </div>
                  </div>
                </td>
                <td>{user.username}</td>
                <td>{user.note}</td>

                <td>
                  <Dropdown>
                    <DropdownToggle hasIcon={false}>
                      <Button
                        isLink

                        icon='Circle'
                        className='text-nowrap'>
                        {user.status}
                      </Button>
                    </DropdownToggle>
                    <DropdownMenu>
                      {Object.keys(EVENT_STATUS).map((key) => (
                        <DropdownItem key={key}>
                          <div>
                            <Icon
                              icon='Circle'
                              color={EVENT_STATUS[key].color}
                            />
                            {EVENT_STATUS[key].name}
                          </div>
                        </DropdownItem>
                      ))}
                    </DropdownMenu>
                  </Dropdown>
                </td>
                <td>
                  <Button
                    isOutline={!darkModeStatus}
                    color='dark'
                    isLight={darkModeStatus}
                    className={classNames('text-nowrap', {
                      'border-light': !darkModeStatus,
                    })}
                    icon='Edit'>
                    Edit
                  </Button>
                </td>
              </tr>
            ))}  */}
          </tbody>
        </table>
      </CardBody>
      <PaginationButtons
        data={users}
        label='items'
        setCurrentPage={setCurrentPage}
        currentPage={currentPage}
        perPage={perPage}
        setPerPage={setPerPage}
      />
    </Card>
  )

}


ListUsers.propTypes = {
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  //
  auth: state.auth,
});

export default connect(mapStateToProps)(ListUsers);

