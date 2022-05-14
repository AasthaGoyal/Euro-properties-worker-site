import React, { useEffect, useRef, useState } from 'react';
import { useHoverDirty } from 'react-use';
import classNames from 'classnames';
import Card, {
  CardActions,
  CardBody,
  CardHeader,
  CardLabel,
  CardTitle,
} from '../../components/bootstrap/Card';
import Button from '../../components/bootstrap/Button';
import Chart from '../../components/extras/Chart';
import Avatar, { AvatarGroup } from '../../components/Avatar';
import UserImageWebp from '../../assets/img/wanna/wanna1.webp';
import UserImage from '../../assets/img/wanna/wanna1.png';
import UserImageWebp2 from '../../assets/img/wanna/wanna2.webp';
import UserImage2 from '../../assets/img/wanna/wanna2.png';
import UserImageWebp3 from '../../assets/img/wanna/wanna3.webp';
import UserImage3 from '../../assets/img/wanna/wanna3.png';
import UserImageWebp4 from '../../assets/img/wanna/wanna4.webp';
import UserImage4 from '../../assets/img/wanna/wanna4.png';
import TransferAction from '../../components/TransferAction';
import Spinner from '../../components/bootstrap/Spinner';
import showNotification from '../../components/extras/showNotification';
import Icon from '../../components/icon/Icon';
import Dropdown, {
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
} from '../../components/bootstrap/Dropdown';
import useDarkMode from '../../hooks/useDarkMode';
import axios from "axios";
import { BASE_URL } from "../../actions/actionConstant";
import _ from "lodash";
import Moment from "react-moment";
import PropTypes from "prop-types";
import { connect } from "react-redux";

const CommonTransActions = (props) => {
  const { user } = props.auth ? props.auth.user : null;
  const [latitude, setLatitude] = useState();
  const [longitude, setLongitude] = useState();

  // const [modal1, setModal1] = useState(false);

  // const [currentTime] = useState(new Date());
  const [jobsiteId, setJobsiteId] = useState();
  const [employeeId, setEmployeeId] = useState();
  const [workerjobsites, setWorkerJobsites] = useState([]);
  const [jobsites, setJobsites] = useState([]);
  const [attendanceActivities, setAttendanceActivities] = useState([]);
  const [breakActivities, setBreakActivities] = useState([]);
  const [timesheetFinal, setTimesheetFinal] = useState([]);
  const [ratePerHour, setRatePerHour] = useState();
  const [payslips, setPayslips] = useState([]);
  


console.log("dashboatrdf", user);
  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      console.log("Latitude is :", position.coords.latitude);
      console.log("Longitude is :", position.coords.longitude);
      setLatitude(position.coords.latitude);
      setLongitude(position.coords.longitude);
    });

    axios.get(`${BASE_URL}/api/users`).then((res) => {

      let filterEmployee = _.filter(res.data, ["_id", user.id]);
      console.log("Filter Employees:", filterEmployee);
      setEmployeeId(filterEmployee[0]._id);
      setRatePerHour(filterEmployee[0].ratePerHour);

      axios.get(`${BASE_URL}/api/workerpayslips`).then((response) => {
        let payslips = response.data;
        let filterPayslips = _.filter(payslips, [
          "employee",
          filterEmployee[0]._id,
        ]);
        console.log("filterPayslips:", filterPayslips);
        setPayslips(filterPayslips);
      });

      let filterJobs = [];
      axios.get(`${BASE_URL}/api/jobsites`).then((response) => {

        let jobs = response.data;
        console.log(jobs);
        jobs.map((job) => {
          job.workersList && job.workersList.map((workers) => {
            if (workers == user.id) {
              filterJobs.push(job)
            }
          })
        });

        console.log(filterJobs);

        setWorkerJobsites(filterJobs);
      });

      axios.get(`${BASE_URL}/api/employeeTimesheets`).then((res) => {
        let today = new Date();
        let dd = String(today.getDate()).padStart(2, "0");
        let mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
        let yyyy = today.getFullYear();

        today = dd + "/" + mm + "/" + yyyy;

        let filterAttendance = _.filter(res.data, {
          employee: filterEmployee[0]._id,

          attendanceDate: today,
        });

        console.log("filterAttendance:", filterAttendance);
        setAttendanceActivities(filterAttendance);
      });

      axios.get(`${BASE_URL}/api/employeeBreaks`).then((res) => {
        let today = new Date();
        let dd = String(today.getDate()).padStart(2, "0");
        let mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
        let yyyy = today.getFullYear();

        today = dd + "/" + mm + "/" + yyyy;

        let filterBreak = _.filter(res.data, {
          employee: filterEmployee[0]._id,

          attendanceDate: today,
        });

        console.log("filterBreak:", filterBreak);
        setBreakActivities(filterBreak);
      });

      axios.get(`${BASE_URL}/api/employeeTimesheetFinal`).then((response) => {
        let timesheetData = response.data;

        let filterTimesheetData = _.filter(timesheetData, [
          "employee",
          filterEmployee[0]._id,
        ]);

        setTimesheetFinal(filterTimesheetData);
      });
    });

    axios.get(`${BASE_URL}/api/jobsites`).then((res) => {
      setJobsites(res.data);
    });

    document.getElementById("punchin").style.display = "none";
    document.getElementById("punchout").style.display = "none";
    document.getElementById("pause").style.display = "none";
    document.getElementById("resume").style.display = "none";
  }, []);

  const punchIn = (e) => {
    e.preventDefault();

    let today = new Date();
    let dd = String(today.getDate()).padStart(2, "0");
    let mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
    let yyyy = today.getFullYear();

    let attendanceDate = dd + "/" + mm + "/" + yyyy;

    const punchInObj = {
      employee: employeeId,
      jobsite: jobsiteId,
      activity: "Punchin",
      latitude,
      longitude,
      attendanceDate,
    };

    console.log("punchInObj:", punchInObj);

    console.log("making reqyest now");
    axios
      .post(
        `${BASE_URL}/api/employeeTimesheets/addemployeeTimesheet`,
        punchInObj
      )
      .then((res) => {
        console.log("Punchin res:", res);

      

        axios.get(`${BASE_URL}/api/employeeTimesheets`).then((res) => {
          let filterAttendance = _.filter(res.data, {
            employee: employeeId,
            jobsite: jobsiteId,
            attendanceDate,
          });

          console.log("filterAttendance:", filterAttendance);
          setAttendanceActivities(filterAttendance);
        });

        document.getElementById("punchin").disabled = true;
        document.getElementById("punchout").disabled = false;

      });
  };

  let attendanceTable;

  attendanceTable = _.map(attendanceActivities, (activity) => {
    let job = _.filter(jobsites, ["_id", activity.jobsite]);

    let activityBadge;

    if (activity.activity === "Punchin") {
      activityBadge = <span className="badge bg-success">Punchin</span>;
    } else if (activity.activity === "Punchout") {
      activityBadge = <span className="badge bg-danger">Punchout</span>;
    }
  });


  return (
    <>
      <div className='row mb-5'>
        <div className='col-lg-4'>
          <CardHeader borderSize={1} className='px-0 bg-transparent'>

            <CardLabel icon='Business' >

              <CardTitle>For Attendance</CardTitle>

            </CardLabel>

          </CardHeader>
          <Card>
            <CardBody>
              <div className='row'>
                <div className='col-6'>
                  <div
                    className={classNames(
                      'rounded-2',
                      'd-flex align-items-center justify-content-center',
                      'bg-l10-success'

                    )}>

                    <Button
                      icon='Login'
                      color='success'
                      size='lg'
                      isLight data-tour='filter'
                      onClick={punchIn}>

                      Clock In


                    </Button>

                  </div>

                </div>
                <div className='col-6'>
                  <div
                    className={classNames(
                      'rounded-2',
                      'd-flex align-items-center justify-content-center',
                      'bg-l10-danger'

                    )}>
                    <Button
                      icon='Logout'
                      color='danger'
                      size='lg'
                      isLight data-tour='filter'>

                      Clock Out


                    </Button>
                  </div>
                </div>

              </div>
            </CardBody>
          </Card>
        </div>
        <div className='col-lg-4'>
          <CardHeader borderSize={1} className='px-0 bg-transparent'>

            <CardLabel icon='Task' >

              <CardTitle>For Break</CardTitle>

            </CardLabel>

          </CardHeader>
          <Card>
            <CardBody>
              <div className='row'>
                <div className='col-6'>
                  <div
                    className={classNames(
                      'rounded-2',
                      'd-flex align-items-center justify-content-center',
                      'bg-l10-warning'

                    )}>

                    <Button
                      icon='Login'
                      color='warning'
                      size='lg'
                      isLight data-tour='filter'>

                      Pause


                    </Button>

                  </div>

                </div>
                <div className='col-6'>
                  <div
                    className={classNames(
                      'rounded-2',
                      'd-flex align-items-center justify-content-center',
                      'bg-l10-info'

                    )}>
                    <Button
                      icon='Logout'
                      color='info'
                      size='lg'
                      isLight data-tour='filter'>

                      Resume


                    </Button>
                  </div>
                </div>

              </div>
            </CardBody>
          </Card>
        </div>

      </div>
      <div className='row'>
        <div className='col-lg-8'>
          <CardHeader className='px-0 bg-transparent'>
            <CardLabel>
              <CardTitle>Today's Activities</CardTitle>
            </CardLabel>
            <CardActions>
              <Button

                color='info'
                isLight
                icon='PublishedWithChanges'
              >
                Refresh
              </Button>
            </CardActions>
          </CardHeader>

          <TransferAction currency='$' amount={80} status='Completed' />
          <TransferAction currency='€' amount={70} status='Completed' />
          <TransferAction
            currency='€'
            amount={120}
            status='Failed'

            className='shadow-3d-info'
          />
        </div>
        <div className='col-lg-4'>
          <Card>
            <CardHeader>
              <CardLabel>
                <CardTitle>Total Work Hours</CardTitle>
              </CardLabel>

            </CardHeader>
            <CardBody>
              <div className='row align-items-end'>
                <div className='col-lg-6'>
                  <div className='h4 mb-3'>Hours worked</div>
                  <span className='display-6 fw-bold text-success'>20</span>
                  <span className='text-muted ms-3'>(hrs)</span>
                </div>
                {/* <div className='col-lg-6'>
                  <Chart
                    series={stackedColumn.series}
                    options={stackedColumn.options}
                    type='bar'
                    height={165}
                  />
                </div> */}
              </div>
            </CardBody>
          </Card>
          <Card>
            <CardHeader>
              <CardLabel>
                <CardTitle>Total Break Hours</CardTitle>
              </CardLabel>

            </CardHeader>
            <CardBody>
              <div className='row align-items-end'>
                <div className='col-lg-6'>
                  <div className='h4 mb-3'>Break Hours</div>
                  <span className='display-6 fw-bold text-danger'>10</span>
                  <span className='text-muted ms-3'>(hrs)</span>
                </div>
                {/* <div className='col-lg-6'>
                  <Chart
                    series={fee.series}
                    options={fee.options}
                    type='area'
                    height={165}
                  />
                </div> */}
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </>
  );
};

CommonTransActions.propTypes = {
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  //
  auth: state.auth,
});

export default connect(mapStateToProps)(CommonTransActions);
