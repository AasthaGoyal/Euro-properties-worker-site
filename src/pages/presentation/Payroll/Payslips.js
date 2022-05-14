import React, { useEffect, useState } from 'react';
import axios from "axios";
import { BASE_URL } from "../../../actions/actionConstant";
import { useFormik, validateYupSchema } from 'formik';
import moment from 'moment';
import classNames from 'classnames';
import { useMeasure } from 'react-use';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/bootstrap/Button';
import Page from '../../../layout/Page/Page';
import PageWrapper from '../../../layout/PageWrapper/PageWrapper';
import { Link } from 'react-router-dom';
import Card, {
  CardActions,
  CardBody,
  CardFooter,
  CardFooterRight,
  CardHeader,
  CardLabel,
  CardTabItem,
  CardTitle,
} from '../../../components/bootstrap/Card';
import UserImageWebp from '../../../assets/img/wanna/wanna1.webp';
import UserImage from '../../../assets/img/wanna/wanna1.png';
import FormGroup from '../../../components/bootstrap/forms/FormGroup';
import Input from '../../../components/bootstrap/forms/Input';
import showNotification from '../../../components/extras/showNotification';
import Icon from '../../../components/icon/Icon';
import Alert from '../../../components/bootstrap/Alert';
import Avatar from '../../../components/Avatar';
import Progress from '../../../components/bootstrap/Progress';
import Modal, { ModalBody, ModalHeader, ModalTitle } from '../../../components/bootstrap/Modal';
import { demoPages } from '../../../menu';
import WannaImg1 from '../../../assets/img/wanna/slide/scene-1.png';
import WannaImg2 from '../../../assets/img/wanna/slide/scene-2.png';
import WannaImg5 from '../../../assets/img/wanna/slide/scene-5.png';
import WannaImg6 from '../../../assets/img/wanna/slide/scene-6.png';
import Carousel from '../../../components/bootstrap/Carousel';
import CarouselSlide from '../../../components/bootstrap/CarouselSlide';
import useDarkMode from '../../../hooks/useDarkMode';
import { ToastContainer, toast } from "react-toastify";
import { Picky } from "react-picky";
import "react-picky/dist/picky.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import _ from "lodash";


const Payslips = () => {


  const [eventItem, setEventItem] = useState(null);
  const [jobsites, setJobsites] = useState([]);
  const [workersAssign, setWorkersAssign] = useState([]);
  const [workersList, setWorkersList] = useState([]);
  const [taskTitle, setTaskTitle] = useState();
  const [taskDescription, setTaskDescription] = useState();


  const [jobsiteName, setJobsiteName] = useState();
  const [jobsite, setJobsite] = useState();
  const [notes, setNotes] = useState();

  const [employeeInvoices, setEmployeeInvoices] = useState([]);
  const [employeeId, setEmployeeId] = useState();
  const [ratePerHour, setRatePerHour] = useState();
  const [employeeName, setEmployeeName] = useState();
  const [employerName] = useState(
    "EURO QUALITY PAINTERS LIMITED"
  );
  const [modal, setModal] = useState(false);
  const [invoiceId, setInvoiceId] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [employeeInvoicesPerPage] = useState(10);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [users, setUsers] = useState([]);
  const [employees, setEmployees] = useState([]);





  const onGenerateInvoice = () => {
    console.log("Converted StartDate:", convertDate(startDate));
    console.log("Convered EndDate:", convertDate(endDate));
    console.log("EmployeeId:", employeeId);
    console.log("Employee Name:", employeeName);
    console.log("Rates Per Hour:", ratePerHour);
    console.log("employerName:", employerName);


    let startDt = convertDate(startDate);
    let endDt = convertDate(endDate);

    let listDate = [];

    let dateMove = new Date(startDt);
    let strDate = startDt;

    while (strDate < endDt) {
      strDate = dateMove.toISOString().slice(0, 10);
      listDate.push(strDate);
      dateMove.setDate(dateMove.getDate() + 1);
    }

    console.log("listDate:", listDate);

    let datesArray = [];

    _.map(listDate, (dt) => {
      datesArray.push(formatDate(dt));
    });

    console.log("datesArray:", datesArray);

    let timesheetFinal = [];

    axios.get(`${BASE_URL}/api/employeeTimesheetFinal`).then((response) => {
      let timesheets = response.data;

      let filterTimesheets = _.filter(timesheets, ["employee", employeeId]);

      _.map(datesArray, (dt) => {
        let filterTimesheets2 = _.filter(filterTimesheets, [
          "attendanceDate",
          dt,
        ]);

        console.log(filterTimesheets2);

        timesheetFinal.push(...filterTimesheets2);
      });

      console.log("timesheetFinal", timesheetFinal);

      
    });


  }




  const colors = ['primary', 'secondary', 'success', 'info', 'warning', 'danger', 'dark'];
  let jobs = [];

  _.map(jobsites, (job) => {
    jobs.push(job.address);
  });

  let workers = [];
  _.map(users, (user) => {
    let userObject = _.filter(users, ["_id", user._id]);
    if (userObject.length === 0) {

    } else {
      workers.push(userObject[0].username);
    }
  });


  useEffect(() => {
    //Get Jobsites list
    axios.get(`${BASE_URL}/api/jobsites`).then((res) => {
      setJobsites(res.data);
    });


    axios.get(`${BASE_URL}/api/users`).then((res) => {
      setUsers(res.data);
    });
  }, []);

  const convertDate = (inputFormat) => {
    function pad(s) {
      return s < 10 ? "0" + s : s;
    }
    var d = new Date(inputFormat);
    return [d.getFullYear(), pad(d.getMonth() + 1), pad(d.getDate())].join("-");
  };

  const formatDate = (input) => {
    var datePart = input.match(/\d+/g),
      year = datePart[0].substring(0), // get only two digits
      month = datePart[1],
      day = datePart[2];

    return day + "/" + month + "/" + year;
  };

  console.log("Worker Assigns:", workersAssign);

  return (
    <PageWrapper title="Add New User">
      <Page container='fluid'>
        <div className='row'>

          <div className='col-xxl-12 col-xl-6'>
            <Card className='shadow-3d-primary' >
              <CardBody>
                <div className='row g-5'>
                  <div className='col-12'>
                    <div className='d-flex align-items-center'>

                      <div className='flex-grow-1 ms-3'>
                        <div className='h2 fw-bold'>
                          Add New Invoice
                        </div>

                      </div>
                    </div>
                  </div>

                </div>
              </CardBody>
            </Card>

            <Card tag='form'
            >

              <Card
                className='rounded-2'
                tag='form'

              >
                <CardHeader>
                  <CardLabel icon='Task'>
                    <CardTitle>Invoice Information</CardTitle>
                  </CardLabel>
                </CardHeader>
                <CardBody>
                  <div className='row g-4'>

                    {/* <label>Select Jobsite</label>

                    <Picky
                      id="picky1"
                      options={jobs}
                      value={jobsiteName}
                      multiple={false}
                      includeSelectAll={true}
                      includeFilter={true}
                      onChange={(jobsite) => {
                        setJobsiteName(jobsite)

                        let selectedJobsite = _.filter(jobsites, ['address', jobsite])

                        console.log("selectedJobsite:", selectedJobsite);

                        setJobsite(selectedJobsite[0]._id);

                      }}
                      dropdownHeight={600}
                    /> */}


                    <label> Worker(s): </label>
                    <Picky
                      id="picky2"
                      placeholder="Worker(s) *"
                      options={workers}
                      value={workersList}
                      multiple={true}
                      includeSelectAll={true}
                      includeFilter={true}
                      onChange={(worker) => {
                        setWorkersList(worker)
                        console.log('Worker:', worker)

                        let workerSelected = _.uniq(worker);

                        let findUsers = [];

                        _.map(workerSelected, (user) => {
                          let currentUser = _.filter(users, [
                            "username",
                            user,
                          ]);
                          findUsers.push(currentUser[0]._id);
                        })

                        let workerAssigns = _.uniq(findUsers);

                        setWorkersAssign(workerAssigns)
                      }}
                      dropdownHeight={600}
                    />

              
               
                    <FormGroup className='col-md-6'>
                    <label>Start Date</label>
                    <DatePicker
                      selected={startDate}
                      onChange={(date) => setStartDate(date)}
                      className="form-control col-md-6"
                      placeholder="Start Date"
                    />
                    </FormGroup>

                    <FormGroup className='col-md-6'>
                      <label>End Date</label>
                      <DatePicker
                        selected={endDate}
                        onChange={(date) => setEndDate(date)}
                        className="form-control"
                        placeholder="End Date"
                      />
                    </FormGroup>

                  

                  </div>


                </CardBody>


              </Card>

              <CardFooter>
                <CardFooterRight>

                  <Button type='submit' color='info' icon='Save' onClick={onGenerateInvoice}  >
                    Generate Invoice
                  </Button>

                </CardFooterRight>
              </CardFooter>

            </Card>
          </div>
        </div>


      </Page>
    </PageWrapper>
  );
};

export default Payslips;
