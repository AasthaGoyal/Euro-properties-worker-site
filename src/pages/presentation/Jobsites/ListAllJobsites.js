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
import { Link , useLocation} from 'react-router-dom';
import _ from "lodash";
import axios from "axios";
import { BASE_URL } from "../../../actions/actionConstant";
import PaginationButtons, { dataPagination, PER_COUNT } from '../../../components/PaginationButtons';
import useDarkMode from '../../../hooks/useDarkMode';
import EVENT_STATUS from '../../common/data/enumEventStatus';
import Input from '../../../components/bootstrap/forms/Input';
import { useFormik } from 'formik';
import FormGroup from '../../../components/bootstrap/forms/FormGroup';
import Label from '../../../components/bootstrap/forms/Label';
import Select from '../../../components/bootstrap/forms/Select';
import CommonFilterTag from '../../common/CommonFilterTag';
import showNotification from '../../../components/extras/showNotification';
import jwt_decode from 'jwt-decode';

const ListAllJobsites = (props) => {
  const { themeStatus, darkModeStatus } = useDarkMode();

  // const { isAuthenticated, user } = props.auth;

  // const [modal, setModal] = useState(false);
  // const [userId, setUserId] = useState("");

  const [jobsites, setJobsites] = useState([]);
  const location = useLocation();
  const [modal, setModal] = useState(false);
  const [jobsiteId, setJobsiteId] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [jobsitesPerPage] = useState(10);
  const [perPage, setPerPage] = useState(PER_COUNT['5']);
  const [status, setStatus] = useState("All");
  const [assigned, setAssigned] = useState("All");
  const [assignedJobsites, setAssignedJobsites] = useState([]);
  const [users, setUsers] = useState([]);



  console.log("currebntly jobsites", props.auth);
  React.useEffect(() => {
    setLoading(true);
    axios.get(`${BASE_URL}/api/jobsites`).then((res) => {
      let jobs = res.data;
      let userJobsites = [];
      jobs.map((job) => {
        job.workersList && job.workersList.map((worker) => {
          if(worker == props.auth.user.id)
          {
            userJobsites.push(job)
          }
        })
        
      })
      console.log("User jobsites", userJobsites);
      setJobsites(userJobsites);
      

    });


    axios.get(`${BASE_URL}/api/users`).then((res) => {
      setUsers(res.data);
    });

    const token = localStorage.getItem('jwtToken');

    const decoded = jwt_decode(token);
   

    setLoading(false);
  }, []);




  let jobsiteTable;
  const indexOfLastJobsite = currentPage * jobsitesPerPage;
  const indexOfFirstJobsite = indexOfLastJobsite - jobsitesPerPage;
  const currentJobsites = jobsites.slice(
    indexOfFirstJobsite,
    indexOfLastJobsite
  );

  console.log("event status", EVENT_STATUS);

  if (currentJobsites.length === 0) {
    jobsiteTable = (
      <tr>
        <td colSpan="11">No records</td>
      </tr>
    );
  } else {

    console.log("current filtered set", currentJobsites);

    jobsiteTable = _.map(currentJobsites, (jobsite) => {

      let finalusers = [];


      jobsite.workersList && jobsite.workersList.map((wrk) => {
        _.map(users, (user) => {
          if (user._id == wrk) {

            finalusers.push(user.username);
          }
        })
      });



      // let users = _.filter(users, ['_id', jobsite.user]);

      return (


        <tr key={jobsite._id}>

          <td>

            {jobsite.ownerName}

          </td>

          <td>{jobsite.address}</td>
          <td>{jobsite.ownerEmail}</td>
          <td>{jobsite.ownerPhone}</td>
          <td>{jobsite.workOrderID}</td>
          <td>{jobsite.workBudget}</td>
          <td>{jobsite.stageOfWork}</td>

          <td> {finalusers.map(worker => {
            return (
              <div className="form-control"> {worker} {""} </div>
            )
          }



          )}</td>
          <td>

            <Button
              isLink
              color={jobsite.status == "Active" ? "success" : "danger"}
              icon='Circle'
              value={jobsite.status}
              className='text-nowrap'>
              {jobsite.status}
            </Button>

          </td>

        </tr>

      );
    });


  }


  let jobsiteLoading;

  if (loading) {
    jobsiteLoading = (
      <tr>
        <td colSpan="11">
          <h3>Loading...</h3>
        </td>
      </tr>
    );
  } else {
    jobsiteLoading = jobsiteTable;
  }

  const searchJob = (e) => {
    axios.get(`${BASE_URL}/api/jobsites`).then((res) => {
      console.log("jobsites", res.data);

      let search = e.target.value;
      let jobsiteData = res.data;

      var jobsiteResult = _.filter(jobsiteData, function (obj) {
        return (
          obj.address.indexOf(search) !== -1 ||
          obj.ownerName.indexOf(search) !== -1 ||
          obj.ownerName.indexOf(_.capitalize(search)) !== -1 ||
          obj.ownerName.indexOf(_.upperCase(search)) !== -1 ||
          obj.ownerName.indexOf(_.lowerCase(search)) !== -1 ||
          obj.workOrderID.indexOf(search) !== -1
        );
      });

      setJobsites(jobsiteResult);
    });
  };

  const searchbyStatus = (e) => {
    setStatus(e.target.value);
    axios.get(`${BASE_URL}/api/jobsites`).then((res) => {
      console.log("jobsites", res.data);
      let status = e.target.value;
      let jobsiteData = res.data;

      if (status === 'All') {
        setJobsites(jobsiteData);
      } else {
        var jobsiteResult = _.filter(jobsiteData, ['status', status]);

        setJobsites(jobsiteResult);
      }
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
              onChange={searchJob}

              autoComplete='off'
            />
          </div>
        </SubHeaderLeft>
        <SubHeaderRight>
          {status && (
            <CommonFilterTag title='Status' text={status} />
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

                  </div>
                  <div className='col-12'>
                    <FormGroup>
                      <Label htmlFor='statusFilter'>Jobsite Status</Label>
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
            <CardLabel icon='Business' >

              <CardTitle>Jobsites</CardTitle>

            </CardLabel>
            <CardActions>


            </CardActions>

          </CardHeader>


          <CardBody className='table-responsive' >
            <table className='table table-modern'>
              <thead>
                <tr>

                  <th>Name</th>
                  <th>Address</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Quote Number</th>
                  <th>Work Budget ($)</th>
                  <th> Stage of work </th>
                  <th> Assigned Worker(s) </th>

                  <th>Status</th>

                  <td />

                </tr>
              </thead>
              <tbody>
                {jobsiteLoading}
              </tbody>
            </table>




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

          </CardBody>
          <PaginationButtons
            data={jobsites}
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


ListAllJobsites.propTypes = {
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  //
  auth: state.auth,
});

export default connect(mapStateToProps)(ListAllJobsites);
