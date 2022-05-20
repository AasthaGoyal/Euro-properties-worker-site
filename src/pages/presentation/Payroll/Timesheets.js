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
import _ from "lodash";
import axios from "axios";
import { BASE_URL } from "../../../actions/actionConstant";
import PaginationButtons, { dataPagination, PER_COUNT } from '../../../components/PaginationButtons';
import useDarkMode from '../../../hooks/useDarkMode';
import EVENT_TASK from '../../common/data/enumEventTasks';
import Input from '../../../components/bootstrap/forms/Input';
import { useFormik } from 'formik';
import FormGroup from '../../../components/bootstrap/forms/FormGroup';
import Label from '../../../components/bootstrap/forms/Label';
import Select from '../../../components/bootstrap/forms/Select';
import CommonFilterTag from '../../common/CommonFilterTag';
import Moment from "react-moment";
import showNotification from '../../../components/extras/showNotification';
import jwt_decode from 'jwt-decode';

const Timesheets = (props) => {
  const token = localStorage.getItem('jwtToken');

  const decoded = jwt_decode(token);
  const user = decoded;
  const [employee, setEmployee] = useState();
  const [timesheets, setTimesheet] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [timesheetsPerPage] = useState(20);
  const [jobsites, setJobsites] = useState([]);
  const [workerJobsites, setWorkerJobsites] = useState([]);
  const [filteredJobsite, setFilteredValue] = useState("All");
  const [perPage, setPerPage] = useState(PER_COUNT['5']);

  console.log("the user is", user);

  React.useEffect(() => {

    axios.get(`${BASE_URL}/api/jobsites`).then((res) => {
      let jobs = res.data;
      setJobsites(res.data);
      let userJobsites = [];
      jobs.map((job) => {
        job.workersList && job.workersList.map((worker) => {
          if (worker == props.auth.user.id) {
            userJobsites.push(job)
          }
        })

      })
      console.log("User jobsites", userJobsites);
      setWorkerJobsites(userJobsites);

      axios.get(`${BASE_URL}/api/employeeTimesheetFinal`).then((response) => {
        console.log("all timesehtees", response.data);
        let timesheets = response.data;

        let filterTimesheets = _.filter(timesheets, {
          "employee": user.id,
        });

        setTimesheet(filterTimesheets);
      });

    });


  }, [user.id]);

  let timesheetTable;

  // Get current posts
  const indexOfLastTimesheet = currentPage * timesheetsPerPage;
  const indexOfFirstTimesheet = indexOfLastTimesheet - timesheetsPerPage;
  const currentTimesheets = timesheets.slice(
    indexOfFirstTimesheet,
    indexOfLastTimesheet
  );

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  console.log("timesheets:", currentTimesheets);
  console.log("workerJobsites", workerJobsites);

  const SplitTime = (numberOfHours) => {
    // var Days=Math.floor(numberOfHours/24);
    var Remainder = numberOfHours % 24;
    var Hours = Math.floor(Remainder);
    var Minutes = Math.floor(60 * (Remainder - Hours));
    return { Hours: Hours, Minutes: Minutes };
  };



  if (currentTimesheets.length === 0) {
    timesheetTable = (
      <tr>
        <td colSpan="6">No records</td>
      </tr>
    );
  } else {
    console.log("current timehseets", currentTimesheets);

    timesheetTable = _.map(currentTimesheets, (timesheet) => {


      let jobsite = _.filter(workerJobsites, ["_id", timesheet.jobsite]);



      let breakResult = SplitTime(_.round(timesheet.breakHours, 2));
      let workResult = SplitTime(_.round(timesheet.totalWorkHours, 2));
      console.log("work hours", workResult, timesheet.totalWorkHours);

      return (
        <tr key={timesheet._id}>
          <td>{jobsite[0] && jobsite[0].address}</td>

          <td>
            <Moment date={timesheet.punchinTime} />
          </td>
          <td>
            <Moment date={timesheet.punchoutTime} />
          </td>
          <td>{`${breakResult.Hours} Hours and ${breakResult.Minutes} Mins.`}</td>
          <td>{`${workResult.Hours} Hours and ${workResult.Minutes} Mins.`}</td>
          <td>{timesheet.attendanceDate}</td>
        </tr>
      );
    });
  }

  let timesheetLoading;

  if (loading) {
    timesheetLoading = (
      <tr>
        <td colSpan="6">
          <h3>Loading...</h3>
        </td>
      </tr>
    );
  } else {
    timesheetLoading = timesheetTable;
  }










  const onSelectJobSite = (e) => {

    if (e.target.value == "All") {
      setFilteredValue("All")
      axios.get(`${BASE_URL}/api/employeeTimesheetFinal`).then((response) => {

        let timesheets = response.data;

        let filterTimesheets = _.filter(timesheets, {
          "employee": user.id,
        });

        setTimesheet(filterTimesheets);
      });

    } else {
      workerJobsites.map((job) => {
        if (job._id == e.target.value) {
          setFilteredValue(job.address);
        }
      })

      axios.get(`${BASE_URL}/api/employeeTimesheetFinal`).then((response) => {

        let timesheets = response.data;

        let filterTimesheets = _.filter(timesheets, {
          "employee": user.id,
          "jobsite": e.target.value
        });

        setTimesheet(filterTimesheets);
      });

    }



  };

  let listJobsites = [];
  listJobsites.push({
    label: "All",
    value: "All"
  });

  _.map(workerJobsites, (jobsite) => {
    let jobsiteObject = {
      label: jobsite.address,
      value: jobsite._id,
    };

    listJobsites.push(jobsiteObject);
  });



  return (
    <PageWrapper title="Jobsites">
      <SubHeader>
        <SubHeaderLeft>

        </SubHeaderLeft>
        <SubHeaderRight>
          {filteredJobsite && (
            <CommonFilterTag title='Jobsite' text={filteredJobsite} />
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
                      <Label htmlFor='statusFilter'> Jobsite </Label>
                      <Select
                        id='statusFilter'
                        ariaLabel='status'
                        placeholder='Jobsite'
                        onChange={onSelectJobSite}
                        list={listJobsites}

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
            <CardLabel icon='Calendar3' >

              <CardTitle>Timesheets</CardTitle>

            </CardLabel>
            <CardActions>


            </CardActions>

          </CardHeader>


          <CardBody className='table-responsive' >


            <table className='table table-modern'>
              <thead>
                <tr>

                  <th>Jobsite </th>

                  <th>Punchin</th>
                  <th>Punchout</th>
                  <th>Break Hours</th>
                  <th>Total Work Hours</th>
                  <th>Attendance Date</th>
                  <td />

                </tr>
              </thead>
              <tbody>
                {timesheetLoading}
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
            data={timesheets}
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


Timesheets.propTypes = {
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  //
  auth: state.auth,
});

export default connect(mapStateToProps)(Timesheets);
