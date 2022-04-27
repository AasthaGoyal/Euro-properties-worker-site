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
import EVENT_STATUS from '../../common/data/enumEventStatus';

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
  
  const changeStatus = (e) => {
    e.preventDefault();
    console.log("value changed", e.target.value);
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
            <Dropdown onChange={changeStatus}>
              <DropdownToggle hasIcon={false}>
                <Button
                  isLink
                  color={user.status == "Active" ? "success" : "danger"}
                  icon='Circle'
                  value={user.status}
                  className='text-nowrap' onChange={changeStatus}>
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




  // const filteredData = data.filter(
  // 	(f) =>
  // 		// Category
  // 		f.category === formik.values.categoryName &&
  // 		// Price
  // 		(formik.values.minPrice === '' || f.price > formik.values.minPrice) &&
  // 		(formik.values.maxPrice === '' || f.price < formik.values.maxPrice) &&
  // 		//	Company
  // 		((formik.values.companyA ? f.store === 'Company A' : false) ||
  // 			(formik.values.companyB ? f.store === 'Company B' : false) ||
  // 			(formik.values.companyC ? f.store === 'Company C' : false) ||
  // 			(formik.values.companyD ? f.store === 'Company D' : false)),
  // );

  // const { selectTable, SelectAllCheck } = useSelectTable(filteredData);

  return (
    <PageWrapper title="Users">


      <Page container='fluid'>
        <Card >
          <CardHeader borderSize={1}>
            <CardLabel icon='Person' >

              <CardTitle>Users</CardTitle>

            </CardLabel>
            <CardActions>
              <Button
                color='info'
                icon='CloudDownload'
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
