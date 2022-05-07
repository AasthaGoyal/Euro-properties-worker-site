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


const AddNewUser = () => {


  const [eventItem, setEventItem] = useState(null);
  const [jobsites, setJobsites] = useState([]);
  const [workersAssign, setWorkersAssign] = useState([]);
  const [users, setUsers] = useState([]);
  const [workersList, setWorkersList] = useState([]);
  const [taskTitle, setTaskTitle] = useState();
  const [taskDescription, setTaskDescription] = useState();

  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [jobsiteName, setJobsiteName] = useState();
  const [jobsite, setJobsite] = useState();
  const [notes, setNotes] = useState();



  const onChangeTaskTitle = (e) => {
    setTaskTitle(e.target.value);
  };

  const onChangeTaskDescription = (e) => {
    setTaskDescription(e.target.value);
  };

  const onChangeNotes = (e) => {
    setNotes(e.target.value);
  };


  const onSubmitTask = (e) => {
    e.preventDefault();

    const taskObject = {
      jobsite,
      taskTitle,
      taskDescription,
      startDate,
      endDate,
      workersAssign,
      status: "Pending",
      note: notes
    };

    console.log("task to be added", taskObject);
    axios
    .post(`${BASE_URL}/api/tasks/addtask`, taskObject)
    .then((res) => {
      console.log(res.data);
      if(res.status == 200)
      {
        showNotification(
          <span className='d-flex align-items-center'>
            <Icon icon='Info' size='lg' className='me-1' />
            <span>New Task Added</span>
          </span>,
          "The new task has been successfully added.",
        );
      }
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
                          Add New Task
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
                    <CardTitle>Task Information</CardTitle>
                  </CardLabel>
                </CardHeader>
                <CardBody>
                  <div className='row g-4'>

                    <label>Select Jobsite</label>

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
                    />


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

                    <FormGroup
                      className='col-lg-12'
                      id='taskName'
                      label='Task Name *'>

                      <Input
                        placeholder="Plumbing"
                        type="text"
                        name="taskTitle"
                        className="form-control"
                        onChange={onChangeTaskTitle}

                      />
                    </FormGroup>
                    <FormGroup
                      className='col-lg-12'
                      id='taskDesc'
                      label='Task Description'>



                      <Input
                        placeholder="The plumbings needs to be fixed in the kitchen"
                        type="text"
                        name="taskDescription"
                        className="form-control"
                        onChange={onChangeTaskDescription}
                      />
                    </FormGroup>
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

                    <FormGroup
                      className='col-lg-12'
                      id='notes'
                      label='Notes'>



                      <Input
                        type="text"
                        name="notes"
                        className="form-control"
                        onChange={onChangeNotes}
                      />
                    </FormGroup>

                  </div>


                </CardBody>


              </Card>

              <CardFooter>
                <CardFooterRight>

                  <Button type='submit' color='info' icon='Save' onClick={onSubmitTask}  >
                    Add Task
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

export default AddNewUser;
