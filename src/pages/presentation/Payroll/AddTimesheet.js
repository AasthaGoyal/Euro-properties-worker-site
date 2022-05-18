import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import Page from '../../../layout/Page/Page';
import PageWrapper from '../../../layout/PageWrapper/PageWrapper';
import useMinimizeAside from '../../../hooks/useMinimizeAside';
import SubHeader, { SubHeaderLeft, SubHeaderRight } from '../../../layout/SubHeader/SubHeader';
import Button from '../../../components/bootstrap/Button';
import CommonTransActions from '../../common/CommonTransActions';
import Modal, { ModalBody, ModalHeader, ModalTitle } from '../../../components/bootstrap/Modal';
import Input from '../../../components/bootstrap/forms/Input';
import Wizard, { WizardItem } from '../../../components/Wizard';
import FormGroup from '../../../components/bootstrap/forms/FormGroup';
import Label from '../../../components/bootstrap/forms/Label';
import Checks, { ChecksGroup } from '../../../components/bootstrap/forms/Checks';
import Moment from "react-moment";
import Card, {
  CardActions,
  CardBody,
  CardHeader,
  CardLabel,
  CardTitle,
} from '../../../components/bootstrap/Card';
import Select from '../../../components/bootstrap/forms/Select';
import showNotification from '../../../components/extras/showNotification';
import Icon from '../../../components/icon/Icon';
import { demoPages } from '../../../menu';
import useDarkMode from '../../../hooks/useDarkMode';
import { Picky } from "react-picky";
import "react-picky/dist/picky.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import _ from "lodash";
import axios from "axios";
import { BASE_URL } from "../../../actions/actionConstant";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import TransferAction from '../../../components/TransferAction';
import classNames from 'classnames';
import jwt_decode from 'jwt-decode';

// eslint-disable-next-line react/prop-types

const AddTimesheet = (props) => {
  useMinimizeAside();
  const { darkModeStatus } = useDarkMode();
  const [jobsiteName, setJobsiteName] = useState();
  const [jobsite, setJobsite] = useState();
  const [jobsites, setJobsites] = useState([]);

  const [newTransferModal, setNewTransferModal] = useState(false);

  const [latitude, setLatitude] = useState();
  const [longitude, setLongitude] = useState();

  const [punchinDisable, setPunchinDisable] = useState(true);
  const [punchoutDisable, setPunchoutDisable] = useState(true);
  const [pauseDisable, setPauseDisable] = useState(true);
  const [resumeDisable, setResumeDisable] = useState(true);
  // const [modal1, setModal1] = useState(false);

  // const [currentTime] = useState(new Date());
  const [jobsiteId, setJobsiteId] = useState();
  const [employeeId, setEmployeeId] = useState();
  const [workerjobsites, setWorkerJobsites] = useState([]);
  const [attendanceActivities, setAttendanceActivities] = useState([]);
  const [breakActivities, setBreakActivities] = useState([]);
  const [timesheetFinal, setTimesheetFinal] = useState([]);
  const [ratePerHour, setRatePerHour] = useState();
  const [payslips, setPayslips] = useState([]);

  const token = localStorage.getItem('jwtToken');

  const decoded = jwt_decode(token);
  const user = decoded;


  let jobs = [];

  _.map(jobsites, (job) => {
    jobs.push(job.address);
  });

  useEffect(() => {
    axios.get(`${BASE_URL}/api/jobsites`).then((res) => {
      setJobsites(res.data);
    });

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


    axios
      .post(
        `${BASE_URL}/api/employeeTimesheets/addemployeeTimesheet`,
        punchInObj
      )
      .then((res) => {
        console.log("Punchin res:", res);

        axios.get(`${BASE_URL}/api/employeeTimesheets`).then((res) => {
          console.log("activities", res.data);
          let filterAttendance = _.filter(res.data, {
            employee: employeeId,
            jobsite: jobsiteId,
            attendanceDate,
          });

          console.log("filterAttendance:", filterAttendance);
          setAttendanceActivities(filterAttendance);
        });

        setPunchinDisable(true);
        setPunchoutDisable(false);


      }).catch(err => console.log(err));
  };

  const pause = (e) => {
    e.preventDefault();
    console.log("psuse reaching");

    let today = new Date();
    let dd = String(today.getDate()).padStart(2, "0");
    let mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
    let yyyy = today.getFullYear();

    let attendanceDate = dd + "/" + mm + "/" + yyyy;

    const pauseObj = {
      employee: employeeId,
      jobsite: jobsiteId,
      activity: "Pause",
      latitude,
      longitude,
      attendanceDate,
      status: 'Ongoing'
    };

    console.log("pauseObj:", pauseObj);

    axios
      .post(`${BASE_URL}/api/employeeBreaks/addemployeeBreak`, pauseObj)
      .then((res) => {
        console.log("Pause res:", res.data);



        axios.get(`${BASE_URL}/api/employeeBreaks`).then((res) => {
          let filterAttendance = _.filter(res.data, {
            employee: employeeId,
            jobsite: jobsiteId,
            attendanceDate,
          });

          console.log("filterAttendance:", filterAttendance);
          setBreakActivities(filterAttendance);
        });


        setPauseDisable(true);
        setResumeDisable(false);

      });
  };

  const resume = (e) => {
    e.preventDefault();

    let today = new Date();
    let dd = String(today.getDate()).padStart(2, "0");
    let mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
    let yyyy = today.getFullYear();

    let attendanceDate = dd + "/" + mm + "/" + yyyy;

    const resumeObj = {
      employee: employeeId,
      jobsite: jobsiteId,
      activity: "Resume",
      latitude,
      longitude,
      attendanceDate,
      status: 'Completed'
    };

    console.log("resumeObj:", resumeObj);

    axios
      .post(
        `${BASE_URL}/api/employeeBreaks/addemployeeBreak`,
        resumeObj
      )
      .then((res) => {
        console.log("Resume res:", res.data);

        let resumeAttedance = res.data;



        axios.get(`${BASE_URL}/api/employeeBreaks`).then((res) => {

          let filterPauseAttendance = _.filter(res.data, {
            employee: employeeId,
            jobsite: jobsiteId,
            attendanceDate,
            activity: 'Pause',
            status: 'Ongoing'
          });



          /*Add to EmployeeBreak Final */


          let pauseTime = filterPauseAttendance[0].createdAt;
          let resumeTime = resumeAttedance.createdAt;


          // let workedHours;




          console.log("pauseTime:", pauseTime);
          console.log("resumeTime:", resumeTime);


          //To calculate Total Work Hours including break
          let pauseOneObj = new Date(pauseTime);
          let resumeTwoObj = new Date(resumeTime);
          let milliseconds = Math.abs(resumeTwoObj - pauseOneObj);
          let breakHours = milliseconds / 36e5;


          console.log("Total breakHours:", breakHours);





          const breakObject = {
            employee: employeeId,
            jobsite: jobsiteId,
            attendanceDate,
            pauseTime,
            resumeTime,
            breakHours: _.round(breakHours, 2)

          };

          console.log("breakObject:", breakObject);

          axios
            .post(
              `${BASE_URL}/api/employeeBreakFinal/addemployeeBreakFinal`,
              breakObject
            )
            .then((response) => {
              console.log("Break Response:", response.data);
            });



          /*Finished */

          let filterAttendance = _.filter(res.data, {
            employee: employeeId,
            jobsite: jobsiteId,
            attendanceDate,
            activity: 'Pause',
            status: 'Ongoing'
          });

          console.log("filterAttendance:", filterAttendance);

          let pauseObject = {
            status: 'Completed'
          }

          axios.put(`${BASE_URL}/api/employeeBreaks/edit/${filterAttendance[0]._id}`, pauseObject).then((res) => {

            axios.get(`${BASE_URL}/api/employeeBreaks`).then((res) => {
              let filterAttendance2 = _.filter(res.data, {
                employee: employeeId,
                jobsite: jobsiteId,
                attendanceDate

              });
              setBreakActivities(filterAttendance2);
            });
          });


        });

        setPauseDisable(false);
        setResumeDisable(true);


      });
  };

  const punchOut = (e) => {
    e.preventDefault();

    let today = new Date();
    let dd = String(today.getDate()).padStart(2, "0");
    let mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
    let yyyy = today.getFullYear();

    let attendanceDate = dd + "/" + mm + "/" + yyyy;

    const punchOutObj = {
      employee: employeeId,
      jobsite: jobsiteId,
      activity: "Punchout",
      latitude,
      longitude,
      attendanceDate,
    };

    console.log("punchOutObj:", punchOutObj);

    axios
      .post(
        `${BASE_URL}/api/employeeTimesheets/addemployeeTimesheet`,
        punchOutObj
      )
      .then((res) => {
        console.log("Punchout res:", res.data);



        axios.get(`${BASE_URL}/api/employeeTimesheets`).then((res) => {
          let filterAttendance = _.filter(res.data, {
            employee: employeeId,
            jobsite: jobsiteId,
            attendanceDate,
          });

          console.log("filterAttendance:", filterAttendance);
          setAttendanceActivities(filterAttendance);

          let punchinTime;
          let pauseTime;
          let resumeTime;
          let punchoutTime;

          let workedHours;

          _.map(filterAttendance, (attendance) => {
            if (attendance.activity === "Punchin") {
              punchinTime = attendance.createdAt;
            }

            if (attendance.activity === "Pause") {
              pauseTime = attendance.createdAt;
            }

            if (attendance.activity === "Resume") {
              resumeTime = attendance.createdAt;
            }

            if (attendance.activity === "Punchout") {
              punchoutTime = attendance.createdAt;
            }
          });

          console.log("punchinTime:", punchinTime);
          console.log("pauseTime:", pauseTime);
          console.log("resumeTime:", resumeTime);
          console.log("punchoutTime:", punchoutTime);

          //To calculate Total Work Hours including break
          let punchinOneObj = new Date(punchinTime);
          let punchoutTwoObj = new Date(punchoutTime);
          let milliseconds = Math.abs(punchoutTwoObj - punchinOneObj);
          let workHours = milliseconds / 36e5;
          let totalWorkerAmount;

          console.log("Total Work Hours including break:", workHours);

          let breakHours = 0;


          axios.get(`${BASE_URL}/api/employeeBreakFinal`).then((res) => {
            let filterBreak = _.filter(res.data, {
              employee: employeeId,
              jobsite: jobsiteId,
              attendanceDate

            });

            breakHours = _.sumBy(filterBreak, 'breakHours');

            workedHours = workHours - breakHours;
            totalWorkerAmount = workedHours * ratePerHour;

            console.log("Worked Hours:", workedHours);


            const timesheetObject = {
              employee: employeeId,
              jobsite: jobsiteId,
              attendanceDate,
              punchinTime,
              punchoutTime,
              breakHours: _.round(breakHours, 2),
              totalWorkHours: _.round(workedHours, 2),
              totalWorkerAmount: _.round(totalWorkerAmount, 2),
            };

            console.log("timesheetObject:", timesheetObject);

            axios
              .post(
                `${BASE_URL}/api/employeeTimesheetFinal/addemployeeTimesheetFinal`,
                timesheetObject
              )
              .then((response) => {
                console.log("Timesheet Response:", response.data);
              });

          });

          if (pauseTime === undefined && resumeTime === undefined) {
            workedHours = workHours;
          } else {
            //To Calculate Break Hours
            let pauseOneObj = new Date(pauseTime);
            let resumeTwoObj = new Date(resumeTime);
            let milliseconds = Math.abs(resumeTwoObj - pauseOneObj);
            breakHours = milliseconds / 36e5;

            console.log("Total break hours:", breakHours);
            workedHours = workHours - breakHours;
            totalWorkerAmount = workedHours * ratePerHour;
          }




        });

        setPunchinDisable(true);
        setPunchoutDisable(true);


      });
  };


  console.log("Selected Jobsite:", jobsiteId);

  let attendanceTable;

  console.log("attendabnce activities", attendanceActivities);

  attendanceTable = _.map(attendanceActivities, (activity) => {

    let job = _.filter(jobsites, ["_id", activity.jobsite]);
    let datetime = activity.createdAt.split('T');

    let activityIcon = (activity.activity == 'Punchin') ? 'HourglassSplit' : 'StopwatchFill';
    let activityColor = (activity.activity == 'Punchin') ? 'success' : 'danger';



    return (
      <TransferAction icon={activityIcon} activity_name={activity.activity} jobsite={job[0] && job[0].address} date={datetime[0]} time={datetime[1]} status="Completed" color={activityColor} />

    );
  });


  let breakTable;

  breakTable = _.map(breakActivities, (activity) => {
    let job = _.filter(jobsites, ["_id", activity.jobsite]);
    let datetime = activity.createdAt.split('T');

    let activityIcon = (activity.activity == 'Pause') ? 'Pause' : 'EmojiPeople';
    let activityColor = (activity.activity == 'Pause') ? 'warning' : 'info';
    console.log(activity.status);




    return (
      <TransferAction icon={activityIcon} activity_name={activity.activity} jobsite={job[0] && job[0].address} date={datetime[0]} time={datetime[1]} status={activity.status} color={activityColor} />

    );

  });

  const SplitTime = (numberOfHours) => {
    var Days = Math.floor(numberOfHours / 24);
    var Remainder = numberOfHours % 24;
    var Hours = Math.floor(Remainder);
    var Minutes = Math.floor(60 * (Remainder - Hours));
    return { Days: Days, Hours: Hours, Minutes: Minutes };
  };

  let timeResult = SplitTime(_.sumBy(timesheetFinal, "totalWorkHours"));

  let sumTotalWorkHours = _.sumBy(timesheetFinal, "totalWorkHours");

  let totalEarning = ratePerHour * sumTotalWorkHours;


  let listJobsites = [];
  listJobsites.push({
    label: " ",
    value: " "
  });

  _.map(workerjobsites, (jobsite) => {
    let jobsiteObject = {
      label: jobsite.address,
      value: jobsite._id,
    };

    listJobsites.push(jobsiteObject);
  });

  const onSelectJobSite = (e) => {
    console.log("selected jobsite", e.target.value);

    setJobsiteId(e.target.value);
    if (e.target.value != " ") {
      setPunchinDisable(false);
      setPauseDisable(false);
    }

    axios.get(`${BASE_URL}/api/employeeTimesheets`).then((res) => {
      console.log("employee timesheet", res.data);

      let today = new Date();
      let dd = String(today.getDate()).padStart(2, "0");
      let mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
      let yyyy = today.getFullYear();

      today = dd + "/" + mm + "/" + yyyy;
      console.log("Filtering by", employeeId, e.target.value, today);

      let filterAttendance = _.filter(res.data, {
        employee: employeeId,
        jobsite: e.target.value,
        attendanceDate: today,
      });

      console.log("filterAttendance:", filterAttendance);

      setAttendanceActivities(filterAttendance);

      let activities = [];

      _.map(filterAttendance, (attendance) => {
        console.log("attendance.activity:", attendance.activity);
        activities.push(attendance.activity);
      });

      console.log("activities:", activities);

      if (activities[0] === "Punchin") {
        setPunchoutDisable(false);
        setPauseDisable(false);
        setPunchinDisable(true);
        setResumeDisable(true);

      }
      else if (activities[0] === "Pause") {
        setPunchoutDisable(true);
        setPauseDisable(true);
        setPunchinDisable(true);
        setResumeDisable(false);

      } else if (activities[0] === "Resume") {
        setPunchoutDisable(false);
        setPauseDisable(true);
        setPunchinDisable(true);
        setResumeDisable(true);

      }
      else if (activities[0] === "Punchout") {
        setPunchoutDisable(true);
        setPauseDisable(true);
        setPunchinDisable(true);
        setResumeDisable(true);

      } else {
        setPunchoutDisable(true);
        setPauseDisable(true);
        setPunchinDisable(false);
        setResumeDisable(true);

      }



    });


    axios.get(`${BASE_URL}/api/employeeBreaks`).then((res) => {
      console.log("Employee Breaks:", res.data);

      let today = new Date();
      let dd = String(today.getDate()).padStart(2, "0");
      let mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
      let yyyy = today.getFullYear();

      today = dd + "/" + mm + "/" + yyyy;

      let filterBreaks = _.filter(res.data, {
        employee: employeeId,
        jobsite: e.target.value,
        attendanceDate: today,
      });

      console.log("filterBreaks:", filterBreaks);

      setBreakActivities(filterBreaks);

      let activities = [];

      _.map(filterBreaks, (breaks) => {
        console.log("breaks.activity:", breaks.activity);
        let breakObj = {
          activity: breaks.activity,
          status: breaks.status
        }
        activities.push(breakObj);
      });

      console.log("Break activities:", activities);


      if (activities.length === 0) {
        setPauseDisable(false);
        setResumeDisable(true);

      } else {
        if ((activities[0].activity === "Pause") && (activities[0].status === "Ongoing")) {
          setPauseDisable(true);
          setResumeDisable(false);


        } else {
          setPauseDisable(false);
          setResumeDisable(true);

        }
      }


    });
  };


  return (
    <PageWrapper title='Add Time Record'>
      <SubHeader>
        <SubHeaderLeft>
          <strong>Select Jobsite</strong>
          <div
          >
            <Select
              name="jobsite"
              className="form-control"
              size='l'
              width="50"
              onChange={onSelectJobSite}
              list={listJobsites}
            />

          </div>

        </SubHeaderLeft>
        <SubHeaderRight>
          {/* <Button
            color='info'
            isLight
            icon='PublishedWithChanges'
            onClick={() => {
              setNewTransferModal(true);
            }}>
            Add Manually
          </Button> */}
        </SubHeaderRight>
      </SubHeader>
      <Page>

        <div className='row mb-5'>
          <div className='col-lg-4'>
            <CardHeader borderSize={1} className='px-0 bg-transparent'>

              <CardLabel icon='Activity' >

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
                        icon='HourglassSplit'
                        color='success'
                        size='lg'
                        value="Punch In"
                        isLight data-tour='filter'
                        isDisable={punchinDisable}
                        onClick={punchIn}>
                        Punch In
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
                        icon='StopwatchFill'
                        color='danger'
                        size='lg'
                        value="Punch out"
                        onClick={punchOut}
                        isDisable={punchoutDisable}
                        isLight data-tour='filter'>
                        Logout
                      </Button>
                    </div>
                  </div>

                </div>
              </CardBody>
            </Card>
          </div>
          <div className='col-lg-4'>
            <CardHeader borderSize={1} className='px-0 bg-transparent'>

              <CardLabel icon='BellFill' >

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
                        icon='Pause'
                        color='warning'
                        size='lg'
                        onClick={pause}
                        isDisable={pauseDisable}
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
                        icon='EmojiPeople'
                        color='info'
                        size='lg'
                        onClick={resume}
                        isDisable={resumeDisable}
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



            {attendanceTable}


            {breakTable}


          </div>
          <div className='col-lg-4'>
            <Card>
              <CardHeader>
                <CardLabel icon="CashStack"  >
                  <CardTitle>Total Earnings</CardTitle>
                </CardLabel>

              </CardHeader>
              <CardBody>
                <div className='row align-items-end'>
                  <div className='col-lg-6'>
                    <div className='h4 mb-3'>Today's total earnings</div>
                    <span className='display-6 fw-bold text-danger'>   $ {_.round(totalEarning)}</span>
                    <span className='text-muted ms-3'>(NZD)</span>
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
            <Card>
              <CardHeader>
                <CardLabel icon="Work">
                  <CardTitle>Total Work Hours</CardTitle>
                </CardLabel>

              </CardHeader>
              <CardBody>
                <div className='row align-items-end'>
                  <div className='col-lg-6'>
                    <div className='h4 mb-3'>Hours worked</div>
                    <span className='display-6 fw-bold text-success'>   {`${timeResult.Days} Days ${timeResult.Hours} Hrs  ${timeResult.Minutes} Mins.`}
                    </span>

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
                <CardLabel icon="Business">
                  <CardTitle>Total Jobsites</CardTitle>
                </CardLabel>

              </CardHeader>
              <CardBody>
                <div className='row align-items-end'>
                  <div className='col-lg-6'>
                    <div className='h4 mb-3'>Total Jobsites worked</div>
                    <span className='display-6 fw-bold text-info'>   {workerjobsites.length}
                    </span>

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
                <CardLabel icon="PointOfSale">
                  <CardTitle>Total Payslips Generated</CardTitle>
                </CardLabel>

              </CardHeader>
              <CardBody>
                <div className='row align-items-end'>
                  <div className='col-lg-6'>
                    <div className='h4 mb-3'>Payslips finalized</div>
                    <span className='display-6 fw-bold text-warning'>   {payslips.length}
                    </span>

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

          </div>
        </div>

      </Page>


    </PageWrapper>
  );
};

AddTimesheet.propTypes = {
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  //
  auth: state.auth,
});

export default connect(mapStateToProps)(AddTimesheet);
