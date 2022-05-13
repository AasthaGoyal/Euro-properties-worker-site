import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useFormik } from 'formik';
import Page from '../../../layout/Page/Page';
import PageWrapper from '../../../layout/PageWrapper/PageWrapper';
import SubHeader, {
  SubHeaderLeft,
  SubHeaderRight,
  SubheaderSeparator,
} from '../../../layout/SubHeader/SubHeader';
import Button from '../../../components/bootstrap/Button';
import { demoPages } from '../../../menu';
import tableData from '../../../common/data/dummyProductData';
import Avatar from '../../../components/Avatar';
import USERS from '../../../common/data/userDummyData';
import Card, {
  CardBody,
  CardFooter,
  CardFooterLeft,
  CardFooterRight,
  CardHeader,
  CardLabel,
  CardSubTitle,
  CardTitle,
} from '../../../components/bootstrap/Card';
import Icon from '../../../components/icon/Icon';
import { priceFormat } from '../../../helpers/helpers';
import Chart from '../../../components/extras/Chart';
import Accordion, { AccordionItem } from '../../../components/bootstrap/Accordion';
import PlaceholderImage from '../../../components/extras/PlaceholderImage';
import Input from '../../../components/bootstrap/forms/Input';
import FormGroup from '../../../components/bootstrap/forms/FormGroup';
import showNotification from '../../../components/extras/showNotification';
import useDarkMode from '../../../hooks/useDarkMode';
import axios from "axios";
import { BASE_URL } from "../../../actions/actionConstant";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter

} from "reactstrap";
import { Picky } from "react-picky";
import "react-picky/dist/picky.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import _ from "lodash";



const ProductViewPage = () => {
  const { darkModeStatus } = useDarkMode();




  const [redirect, setRedirect] = useState(false);
  const [modal, setModal] = useState(false);



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
  const [jobsiteId, setJobsiteId] = useState();
  const [workersId, setWorkersId] = useState([]);


  const onChangeTaskTitle = (e) => {
    setTaskTitle(e.target.value);
  };

  const onChangeTaskDescription = (e) => {
    setTaskDescription(e.target.value);
  };

  const onChangeNotes = (e) => {
    setNotes(e.target.value);
  };

  const { id } = useParams();
  console.log("task id is", id);



  const navigate = useNavigate();

  // const itemData = tableData.filter((item) => item.id.toString() === id.toString());
  // const data = itemData[0];

  const TABS = {
    ACCOUNT_DETAIL: 'Task Details',

  };

  const [activeTab, setActiveTab] = useState(TABS.ACCOUNT_DETAIL);
  const [toggleInfoEventCanvas, setToggleInfoEventCanvas] = useState(false);
  const setInfoEvent = () => setToggleInfoEventCanvas(!toggleInfoEventCanvas);
  const [events, setEvents] = useState([]);


  const openModal = () => {
    // setUserId(id)
    setModal(!modal);

  };



  useEffect(() => {

    axios.get(`${BASE_URL}/api/jobsites`).then((res) => {
      setJobsites(res.data);
    });


    axios.get(`${BASE_URL}/api/users`).then((res) => {
      setUsers(res.data);
    });

    axios
      .get(`${BASE_URL}/api/tasks/${id}`)
      .then((res) => {
        console.log("the response is", res.data);
        setTaskTitle(res.data.taskTitle);
        setTaskDescription(res.data.taskDescription);


        res.data.startDate && setStartDate(new Date(res.data.startDate));
        res.data.endDate && setEndDate(new Date(res.data.endDate));

        setJobsiteId(res.data.jobsite);
        setWorkersId(res.data.workersAssign);



      });
  }, []);

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


  let demo = '';

  _.map(jobsites, (job) => {
    if (job._id == jobsiteId) {
      console.log(job.address);
      demo = job.address;
    }
  });

  let finalusers = [];
  workersId.map((wrk) => {
    _.map(users, (user) => {
      if (user._id == wrk) {
        console.log("matching ", user._id, "name", user.username, "work", wrk);
        finalusers.push(user.username);
      }
    })
  });

  console.log("final users", finalusers);

  const deleteTask = () => {

    axios.delete(`${BASE_URL}/api/tasks/${id}`).then((response) => {
      axios.get(`${BASE_URL}/api/tasks/`).then((response) => {
        console.log(response.data);
        showNotification(
          <span className='d-flex align-items-center'>
            <Icon icon='EmojiSmile' size='lg' className='me-1' />
            <span>Task Deleted Successfully</span>
          </span>,
          "The Task has been deleted successfully.", 'warning'
        );

      });
      setModal(!modal);
    }).catch(err => {
      console.log(err);
      showNotification(
        <span className='d-flex align-items-center'>
          <Icon icon='EmojiAngry' size='lg' className='me-1' />
          <span>Some error occured</span>
        </span>,
        "Some error occured. Please check the details or try again later.", 'danger'
      );
    });

    //setSucess(true);
    setTimeout(() => {
      // setSucess(false);
    }, 3000);
  };

  const onEditSubmit = (e) => {
    e.preventDefault();

    const taskObject = {
      jobsite,
      taskTitle,
      taskDescription,
      startDate,
      endDate,
      workersAssign,
      status: "Pending",
    };

    console.log("the task to be updated is", taskObject);
    axios
      .put(`${BASE_URL}/api/tasks/edit/${id}`, taskObject)
      .then((res) => {
        if (res.status == 200) {
          showNotification(
            <span className='d-flex align-items-center'>
              <Icon icon='EmojiSmile' size='lg' className='me-1' />
              <span>Task Updated Successfully</span>
            </span>,
            "The Task has been updated successfully.", 'success'
          );
        }
      }).catch(err => {
        console.log(err);
        showNotification(
          <span className='d-flex align-items-center'>
            <Icon icon='EmojiAngry' size='lg' className='me-1' />
            <span>Some error occured</span>
          </span>,
          "Some error occured. Please check the details or try again later.", 'danger'
        );
      });


  }

  console.log("Worker Assigns:", workersAssign);

  return (
    <PageWrapper title="Edit User">
      <Modal isOpen={modal} toggle={openModal}>
        <ModalHeader toggle={openModal}>Delete User</ModalHeader>
        <ModalBody>Do you want to delete the user?</ModalBody>
        <ModalFooter>
          <Button
            color="primary"
            className="btn-theme btn-sm"
            onClick={deleteTask}
          >
            Yes Delete
          </Button>{" "}
          <Button
            color="secondary"
            className="btn-sm"
            onClick={openModal}
          >
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
      <SubHeader>
        <SubHeaderLeft>
          <Button color='info' isLink icon='ArrowBack' onClick={() => navigate(-1)}>
            Back to List
          </Button>
          <SubheaderSeparator />

          <span>
            <strong>{taskTitle}</strong>
          </span>
          <span className='text-muted'>Edit Task</span>
        </SubHeaderLeft>
        <SubHeaderRight>




        </SubHeaderRight>
      </SubHeader>
      <Page container='fluid'>
        <div className='row h-100'>
          <div className='col-xxl-3 col-xl-4 col-lg-6'>
            <Card stretch>
              <CardHeader>
                <CardLabel icon='Tasks' iconColor='info'>
                  <CardTitle>Task Settings</CardTitle>
                  <CardSubTitle>Jobsite/Task Information</CardSubTitle>
                </CardLabel>
              </CardHeader>
              <CardBody isScrollable>
                <div className='row g-3'>
                  <div className='col-12'>
                    <Button
                      icon='Contacts'
                      color='info'
                      className='w-100 p-3'
                      isLight={TABS.ACCOUNT_DETAIL !== activeTab}
                      onClick={() => setActiveTab(TABS.ACCOUNT_DETAIL)} >
                      {TABS.ACCOUNT_DETAIL}


                    </Button>
                  </div>


                  <div className='col-12'>
                    <Button
                      icon='Delete'
                      color='danger'
                      isLight
                      className='w-100 p-3'
                      onClick={openModal}>
                      Delete Task
                    </Button>
                  </div>
                </div>
              </CardBody>

            </Card>
          </div>
          <div className='col-xxl-9 col-xl-8 col-lg-6'>
            {TABS.ACCOUNT_DETAIL === activeTab && (
              <Card
                stretch
                tag='form'
                noValidate
              >
                <CardHeader>
                  <CardLabel icon='Edit' iconColor='warning'>
                    <CardTitle>Task Information</CardTitle>
                  </CardLabel>
                </CardHeader>
                <CardBody className='pb-0' isScrollable>
                  <div className='row g-4'>
                    <div className='col-lg-12'>


                      <FormGroup
                        className='col-lg-12'
                        id='jobsitename'
                        label='Jobsite Address *'>
                        <Input
                          type="text"
                          className="form-control"
                          value={demo}
                        />
                      </FormGroup>
                      <br />
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


                    </div>
                    <div className='col-lg-12'>
                      <FormGroup
                        className='col-lg-12'
                        id='workers'
                        label='Workers *'>
                        <Input
                          type="text"
                          className="form-control"
                          value={finalusers}
                        />
                      </FormGroup>
                      <br />
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
                    </div>
                    <div className='col-lg-12'>
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
                          value={taskTitle}

                        />
                      </FormGroup>
                    </div>
                    <div className='col-lg-12'>
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
                          value={taskDescription}
                        />
                      </FormGroup>
                    </div>
                    <div className='col-md-6'>
                      <FormGroup >
                        <label>Start Date</label>
                        <DatePicker
                          selected={startDate}
                          onChange={(date) => setStartDate(date)}
                          className="form-control"
                          placeholder="Start Date"
                        />
                      </FormGroup>
                    </div>
                    <div className='col-md-6'>

                      <FormGroup >
                        <label>End Date</label>
                        <DatePicker
                          selected={endDate}
                          onChange={(date) => setEndDate(date)}
                          className="form-control"
                          placeholder="End Date"
                        />
                      </FormGroup>
                    </div> <div className='col-lg-12'>

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


                  </div>
                </CardBody>
                <CardFooter>

                  <CardFooterRight>
                    <Button
                      type='submit'
                      icon='Save'
                      color='info'
                      onClick={onEditSubmit}
                    >
                      Submit
                    </Button>
                  </CardFooterRight>
                </CardFooter>
              </Card>
            )}



          </div>
        </div>
      </Page>
    </PageWrapper >
  );
};

export default ProductViewPage;
