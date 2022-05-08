import React, { useState } from 'react';
import classNames from 'classnames';
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Button from '../../../components/bootstrap/Button';
import PageWrapper from '../../../layout/PageWrapper/PageWrapper';
import Page from '../../../layout/Page/Page';
import Card, {
  CardActions,
  CardBody,
  CardFooter,
  CardHeader,
  CardLabel,
  CardTitle,
} from '../../../components/bootstrap/Card';
import Dropdown, {
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
} from '../../../components/bootstrap/Dropdown';
import Icon from '../../../components/icon/Icon';

import { demoPages } from '../../../menu';
import { Link } from 'react-router-dom';
import _ from "lodash";
import axios from "axios";
import { BASE_URL } from "../../../actions/actionConstant";
import PaginationButtons, { dataPagination, PER_COUNT } from '../../../components/PaginationButtons';
import useDarkMode from '../../../hooks/useDarkMode';
import SubHeader, {
  SubHeaderLeft,
  SubHeaderRight,
  SubheaderSeparator,
} from '../../../layout/SubHeader/SubHeader';
import Input from '../../../components/bootstrap/forms/Input';
import FormGroup from '../../../components/bootstrap/forms/FormGroup';
import Label from '../../../components/bootstrap/forms/Label';
import Select from '../../../components/bootstrap/forms/Select';
import CommonFilterTag from '../../common/CommonFilterTag';

import showNotification from '../../../components/extras/showNotification';


const ListAllUsers = () => {
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
  const [filteredUsertype, setFilteredUsertype] = useState("All");

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

  const changeStatus = (id, value) => {

    _.map(users, (auser) => {
      if (auser._id == id) {
        const userObject = {
          userType: auser.userType,
          username: auser.username,
          firstName: auser.firstName,
          lastName: auser.lastName,
          email: auser.email,
          password: auser.password,
          phone: auser.phone,
          address: auser.address,
          status: value,
          note: auser.note,
          bankacc: auser.bankacc,
          rate: auser.rate,
          gst: auser.gst,
          contractor: auser.contractor,
          tax: auser.tax,
          ird: auser.ird
        };

      
        axios
        .put(`${BASE_URL}/api/users/edit/${id}`, userObject)
        .then((res) => {
          if (res.status == 200) {
            showNotification(
              <span className='d-flex align-items-center'>
                <Icon icon='Info' size='lg' className='me-1' />
                <span>User's Status updated Successfully</span>
              </span>,
              "The user's status has been successfully updated.",
            );
          }
        });

          window.location.reload();
          showNotification(
            <span className='d-flex align-items-center'>
              <Icon icon='Info' size='lg' className='me-1' />
              <span>User's Status updated Successfully</span>
            </span>,
            "The user's status has been successfully updated.",
          );
      }
    })


  }
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
    let statusList = [{text: "Active", value: "Active"}, {text: "Inactive", value: "Inactive"}]
    userTable = _.map(currentUsers, (user) => {
      return (
        <tr key={user._id}>
          <td>{user.userType}</td>
          <td>{user.username}</td>

          <td>
            <Link to={`../${demoPages.UserPages.subMenu.editUser.path}/${user._id}`}>
              {user.firstName} {user.lastName}
            </Link>
          </td>

          <td>{user.email}</td>
          <td>{user.phone}</td>
          <td>{user.note}</td>


          <td>
          <Dropdown >
              <DropdownToggle hasIcon={false}>
                <Button
                  isLink
                  color={user.status == "Active" ? "success" : "danger"}
                  icon='Circle'
                  value={user.status}
                  className='text-nowrap'>
                  {user.status}
                </Button>
              </DropdownToggle>
              <DropdownMenu >

                <DropdownItem key='active' value='active'  >
                  <Button
                    isLink
                    color='success'
                    icon='Circle'
                    value='active'
                    onClick={changeStatus.bind(this, user._id, "Active")}
                    className='text-nowrap'>
                    Active
                  </Button>
                </DropdownItem>
                <DropdownItem key='inactive' value='inactive'  >
                  <Button
                    isLink
                    color='danger'
                    icon='Circle'
                    value='inactive'
                    onClick={changeStatus.bind(this, user._id, "Inactive")}
                    className='text-nowrap'>
                    Inactive
                  </Button>
                </DropdownItem>

              </DropdownMenu>
            </Dropdown>


          </td>
          <td>
            <Link to={`../${demoPages.UserPages.subMenu.editUser.path}/${user._id}`}>
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
            </Link>

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




  const searchUsers = (e) => {


    axios.get(`${BASE_URL}/api/users`).then((res) => {
      console.log("user", res.data);

      let search = e.target.value;
      let userData = res.data;

      var userResult = _.filter(userData, function (obj) {
        return ((obj.username.indexOf(search) !== -1) || (obj.email.indexOf(search) !== -1) || (obj.firstName.indexOf(search) !== -1) || (obj.lastName.indexOf(search) !== -1));


      });

      setUsers(userResult);
    });
  }

  const searchByUsertype = (e) => {
    e.preventDefault();

    setFilteredUsertype(e.target.value);
    let search = e.target.value;
    if (search == "All") {
      axios.get(`${BASE_URL}/api/users`).then((res) => {

        setUsers(res.data);
      });
    } else {
      axios.get(`${BASE_URL}/api/users`).then((res) => {

        let userData = res.data;

        let userResult = _.filter(userData, ['userType', search]);
        setUsers(userResult);
      });

    }




  }

  return (
    <PageWrapper title="Users">
      <SubHeader>
        <SubHeaderLeft>
          <div className='d-flex' data-tour='search'>
            <label className='border-0 bg-transparent cursor-pointer' htmlFor='searchInput'>
              <Icon icon='Search' size='2x' color='primary' />
            </label>
            <Input
              id='searchInput'
              type='search'
              className='border-0 shadow-none bg-transparent'
              placeholder='Search...'
              onChange={searchUsers}

              autoComplete='off'
            />
          </div>
        </SubHeaderLeft>
        <SubHeaderRight>
          {filteredUsertype && (
            <CommonFilterTag title='User Type' text={filteredUsertype} />
          )}
          <SubheaderSeparator />
          <Dropdown >
            <DropdownToggle hasIcon={false}>
              <Button icon='Filter' color='primary' isLight data-tour='filter'>
                Filter

              </Button>
            </DropdownToggle>
            <DropdownMenu
              isAlignmentEnd
              size='lg'
              isCloseAfterLeave={false}
              data-tour='filter-menu'>
              <div className='container py-2'>
                <form className='row g-3' >

                  <div className='col-12'>
                    <FormGroup>
                      <Label htmlFor='statusFilter'> User Type </Label>
                      <Select
                        id='statusFilter'
                        ariaLabel='status'
                        placeholder='Jobsite'
                        onChange={value => {

                          searchByUsertype(value);
                        }}
                        list={[
                          { value: 'All', text: 'All' },
                          { value: 'Admin', text: 'Admin' },
                          { value: 'Manager', text: 'Manager' },
                          { value: 'Employee', text: 'Employee' }
                        ]}
                        value={filteredUsertype}

                      />
                    </FormGroup>
                  </div>


                </form>
              </div>
            </DropdownMenu>
          </Dropdown>



        </SubHeaderRight>
      </SubHeader>

      <Page container='fluid'>
        <Card >
          <CardHeader borderSize={1}>
            <CardLabel icon='Person' >

              <CardTitle>Users</CardTitle>

            </CardLabel>
            <CardActions>
             
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
                {/* {filteredData.map((i) => (
									<CommonTableRow
										key={i.id}
										// eslint-disable-next-line react/jsx-props-no-spreading
										{...i}
										selectName='selectedList'
										selectOnChange={selectTable.handleChange}
										selectChecked={selectTable.values.selectedList.includes(
											i.id.toString(),
										)}
									/>
								))} */}
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


      </Page>
    </PageWrapper>
  );
};


ListAllUsers.propTypes = {
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  //
  auth: state.auth,
});

export default connect(mapStateToProps)(ListAllUsers);
