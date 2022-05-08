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
import SubHeader, {
  SubHeaderLeft,
  SubHeaderRight,
  SubheaderSeparator,
} from '../../../layout/SubHeader/SubHeader';

import { demoPages } from '../../../menu';
import { Link } from 'react-router-dom';
import _ from "lodash";
import axios from "axios";
import { BASE_URL } from "../../../actions/actionConstant";
import PaginationButtons, { dataPagination, PER_COUNT } from '../../../components/PaginationButtons';
import useDarkMode from '../../../hooks/useDarkMode';
import EVENT_STATUS from '../../common/data/enumEventTasks';
import Input from '../../../components/bootstrap/forms/Input';
import { useFormik } from 'formik';
import FormGroup from '../../../components/bootstrap/forms/FormGroup';
import Label from '../../../components/bootstrap/forms/Label';
import Select from '../../../components/bootstrap/forms/Select';
import CommonFilterTag from '../../common/CommonFilterTag';
import Moment from "react-moment";
import showNotification from '../../../components/extras/showNotification';

const ListAllVehicles = () => {
  const { themeStatus, darkModeStatus } = useDarkMode();

  const [vehicles, setVehicles] = useState([]);

  const [modal, setModal] = useState(false);
  const [vehicleId, setVehicleId] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [vehiclesPerPage] = useState(10);
  const [perPage, setPerPage] = useState(PER_COUNT['5']);
  const [status, setStatus] = useState("All");
  const [assigned, setAssigned] = useState("All");
  const [users, setUsers] = useState([]);

  React.useEffect(() => {
    setLoading(true);
    axios.get(`${BASE_URL}/api/vehicles`).then(res => setVehicles(res.data));

    axios.get(`${BASE_URL}/api/users`).then((res) => {
      setUsers(res.data);
    });


    setLoading(false);
  }, []);

  const openModal = (id) => {
    // setVehicleId(id)
    setModal(!modal);
    setVehicleId(id);
    console.log("Vehicle:", id);
  };


  const searchbyStatus = (e) => {
    setStatus(e.target.value);
    axios.get(`${BASE_URL}/api/vehicles`).then((res) => {

      let status = e.target.value;
      let vehicleData = res.data;

      console.log("vehicle data", vehicleData);

      if (status === 'All') {
        setVehicles(vehicleData);
      } else {
        var vehicleResult = _.filter(vehicleData, ['status', status]);

        setVehicles(vehicleResult);
      }
    });
  }

  const changeStatus = (id, value) => {

  
    _.map(vehicles, (vehicle) => {
      if (vehicle._id == id) {
        const vehicleObject = {
          vehicleName: vehicle.vehicleName,
          vehicleNo: vehicle.vehicleNo,
          registrationDate: vehicle.registrationDate,
          wofDate: vehicle.wofDate,
          servicingDate: vehicle.servicingDate,
          status: value,
          workersList: vehicle.workersList
        };
    
        axios
          .put(`${BASE_URL}/api/vehicles/edit/${id}`, vehicleObject)
          .then((res) => {
            if (res.status == 200) {
              showNotification(
                <span className='d-flex align-items-center'>
                  <Icon icon='Info' size='lg' className='me-1' />
                  <span>Vehicle's status has been Updated Successfully</span>
                </span>,
                "The Vehicle's status has been updated successfully.",
              );
            }
          });

          window.location.reload();
          showNotification(
            <span className='d-flex align-items-center'>
              <Icon icon='Info' size='lg' className='me-1' />
              <span>Vehicle's status has been  Updated Successfully</span>
            </span>,
            "The Vehicle's status has been updated successfully.",
          );
      }
    })


  }

  const searchByAssigned = (e) => {
    setAssigned(e.target.value);

    axios.get(`${BASE_URL}/api/vehicles`).then((res) => {

      let assignedValue = e.target.value;
      let vehicleData = res.data;
      console.log("vehicledata", vehicleData);

      if (assignedValue === 'All') {
        setVehicles(vehicleData);
      } else if (assignedValue === 'Assigned') {
        var vehicleResult = [];
        vehicleData.map((veh) => {
          if (veh.workersList.length != 0) {
            vehicleResult.push(veh);
          }
        })
        

        setVehicles(vehicleResult);
      }
      else {
        var vehicleResult = [];
        vehicleData.map((veh) => {
          if (veh.workersList.length == 0) {
            vehicleResult.push(veh);
          }
        })
        

        setVehicles(vehicleResult);
      }

    });

  }

  let vehicleTable;

  // Get current posts
  const indexOfLastVehicle = currentPage * vehiclesPerPage;
  const indexOfFirstVehicle = indexOfLastVehicle - vehiclesPerPage;
  const currentVehicles = vehicles.slice(indexOfFirstVehicle, indexOfLastVehicle);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);


  if (currentVehicles.length === 0) {
    vehicleTable = (
      <tr>
        <td colSpan="7">No records</td>
      </tr>
    );
  } else {
    vehicleTable = _.map(currentVehicles, (vehicle) => {
      let finalusers = [];


      vehicle.workersList && vehicle.workersList.map((wrk) => {
        _.map(users, (user) => {
          if (user._id == wrk) {

            finalusers.push(user.username);
          }
        })
      });


      return (
        <tr key={vehicle._id}>
          <td>
            <Link to={`../${demoPages.Vehicle.subMenu.editVehicle.path}/${vehicle._id}`}>
              {vehicle.vehicleName}
            </Link>
          </td>

          <td>{vehicle.vehicleNo}</td>
          <td><Moment format="DD/MM/YYYY" date={vehicle.registrationDate} /></td>
          <td>
            <Moment format="DD/MM/YYYY" date={vehicle.wofDate} />
          </td>
          <td><Moment format="DD/MM/YYYY" date={vehicle.servicingDate} /></td>
          <td>  {finalusers.map((usr) => <div> {usr} </div>)}</td>
          <td>
            <Dropdown>
              <DropdownToggle hasIcon={false}>
                <Button
                  isLink
                  color={vehicle.status == "Active" ? "success" : "danger"}
                  icon='Circle'
                  value={vehicle.status}
                  className='text-nowrap' onChange={changeStatus}>
                  {vehicle.status}
                </Button>
              </DropdownToggle>
              <DropdownMenu>
              <DropdownItem key='active' value='active'  >
                  <Button
                    isLink
                    color='success'
                    icon='Circle'
                    value='active'
                    onClick={changeStatus.bind(this, vehicle._id, "Active")}
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
                    onClick={changeStatus.bind(this, vehicle._id, "Inactive")}
                    className='text-nowrap'>
                    Inactive
                  </Button>
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </td>
          <td>
            <Link to={`../${demoPages.Vehicle.subMenu.editVehicle.path}/${vehicle._id}`}>
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

  let vehicleLoading;

  if (loading) {
    vehicleLoading = (
      <tr>
        <td colSpan="7">
          <h3>Loading...</h3>
        </td>
      </tr>
    );
  } else {
    vehicleLoading = vehicleTable;
  }


  // const searchbyStatus = (e) => {
  //   setStatus(e.target.value);
  //   axios.get(`${BASE_URL}/api/jobsites`).then((res) => {
  //     console.log("jobsites", res.data);
  //     let status = e.target.value;
  //     let jobsiteData = res.data;

  //     if (status === 'All') {
  //       setJobsites(jobsiteData);
  //     } else {
  //       var jobsiteResult = _.filter(jobsiteData, ['status', status]);

  //       setJobsites(jobsiteResult);
  //     }
  //   });
  // }

  // const searchByAssigned = (e) => {
  //   setAssigned(e.target.value);
  //   axios.get(`${BASE_URL}/api/jobassigntoemployees`)
  //     .then(res => setAssignedJobsites(res.data));
  // }


  const searchVehicle = (e) => {


    axios.get(`${BASE_URL}/api/vehicles`).then((res) => {
      console.log("vehicles", res.data);

      let search = e.target.value;
      let vehiclesData = res.data;

      var vehicleResult = _.filter(vehiclesData, function (obj) {
        return ((obj.vehicleName.indexOf(search) !== -1) || (obj.vehicleNo.indexOf(search) !== -1));


      });

      setVehicles(vehicleResult);



    });
  }



  return (
    <PageWrapper title="Jobsites">
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
              onChange={searchVehicle}
              autoComplete='off'
            />
          </div>
        </SubHeaderLeft>
        <SubHeaderRight>
          {status && (
            <CommonFilterTag title='Status' text={status} />
          )}

          {assigned && (
            <CommonFilterTag title='Job type' text={assigned} />
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
                      <Label htmlFor='assignedFilter'>Vehicle Type</Label>
                      <Select
                        id='assignedFilter'
                        ariaLabel='type'

                        onChange={searchByAssigned}
                        list={[
                          { value: 'All', text: 'All' },
                          { value: 'Assigned', text: 'Assigned' },
                          { value: 'Unassigned', text: 'Unassigned' },

                        ]}
                        value={assigned}

                      />
                    </FormGroup>
                  </div>
                  <div className='col-12'>
                    <FormGroup>
                      <Label htmlFor='statusFilter'>Vehicle Status</Label>
                      <Select
                        id='statusFilter'
                        ariaLabel='status'
                        placeholder='Jobsite status'
                        onChange={searchbyStatus}
                        list={[
                          { value: 'All', text: 'All' },
                          { value: 'Active', text: 'Active' },
                          { value: 'Inactive', text: 'Inactive' },

                        ]}
                        value={status}
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
            <CardLabel icon='Train' >

              <CardTitle>Vehicles</CardTitle>

            </CardLabel>
            <CardActions>


            </CardActions>

          </CardHeader>


          <CardBody className='table-responsive' >


            <table className='table table-modern'>
              <thead>
                <tr>

                  <th>Vehicle Make/Model</th>
                  <th>Plate No</th>
                  <th>Registration Date</th>
                  <th>WOF Date</th>
                  <th>Servicing Date</th>
                  <th>Assigned Worker(s)</th>
                  <th>Status</th>
                  <td />

                </tr>
              </thead>
              <tbody>
                {vehicleLoading}
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
            data={vehicles}
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


ListAllVehicles.propTypes = {
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  //
  auth: state.auth,
});

export default connect(mapStateToProps)(ListAllVehicles);
