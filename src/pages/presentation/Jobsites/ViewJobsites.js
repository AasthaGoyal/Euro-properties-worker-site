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
import _ from "lodash";
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




const ProductViewPage = () => {
  const { darkModeStatus } = useDarkMode();
  const [status] = useState('Active');
  const [jobsites, setJobsites] = useState([]);

  const [users, setUsers] = useState([]);
  const [workersList, setWorkersList] = useState([]);

  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [redirect, setRedirect] = useState(false);

  const validateJobsite = (values) => {
    const errors = {};
    if (!values.quoteNumber) {
      errors.quoteNumber = 'Required';
    }

    if (!values.workBudget) {
      errors.workBudget = 'Required';
    }


    if (!values.stageWork) {
      errors.stageWork = 'Required';
    }

    if (!values.jobsiteAddress) {
      errors.jobsiteAddress = 'Required';
    }



    return errors;
  };

  const validate = (values) => {
    const errors = {};

    if (!values.ownerName) {
      errors.ownerName = 'Required';
    }



    if (!values.ownerEmail) {
      errors.ownerEmail = 'Required';
    }

    if (!values.ownerPhone) {
      errors.ownerPhone = 'Required';
    }


    return errors;
  };

  const validateAssign = (values) => {
    const errors = {};

    return errors;
  }


  const [modal, setModal] = useState(false);


  const { id } = useParams();




  const navigate = useNavigate();

  // const itemData = tableData.filter((item) => item.id.toString() === id.toString());
  // const data = itemData[0];

  const TABS = {
    OWNER: 'Owner Details',
    JOBSITE: 'Jobsite Details',
    ASSIGN: 'Assign Jobsite'
  };

  const [activeTab, setActiveTab] = useState(TABS.OWNER);
  const [toggleInfoEventCanvas, setToggleInfoEventCanvas] = useState(false);
  const setInfoEvent = () => setToggleInfoEventCanvas(!toggleInfoEventCanvas);
  const [events, setEvents] = useState([]);

  const formik = useFormik({
    initialValues: {
      ownerName: '',
      ownerEmail: '',
      ownerPhone: '',
      note: ''

    },
    validate,
    onSubmit: (values) => {



      const jobsiteObject = {
        address: values.jobsiteAddress,
        ownerName: values.ownerName,
        ownerEmail: values.ownerEmail,
        ownerPhone: values.ownerPhone,
        latitude: values.latitude,
        longitude: values.longitude,
        workOrderID: values.workOrderID,
        workBudget: values.workBudget,
        note: values.note,
        stageOfWork: values.stageWork,
        status: "Active",
        workersList: values.workersList,
        startDate: values.startDate,
        endDate: values.endDate
      };
      console.log("Values to be updated", jobsiteObject);

      axios
        .put(`${BASE_URL}/api/jobsites/edit/${id}`, jobsiteObject)
        .then((res) => {
          console.log(res);
          if (res.status == 200) {
            showNotification(
              <span className='d-flex align-items-center'>
                <Icon icon='Info' size='lg' className='me-1' />
                <span>Jobsite Updated Successfully</span>
              </span>,
              "The Owner details have been successfully updated.",
            );
          }
        });



    },
  });

  const formikAssign = useFormik({
    initialValues: {
      jobsiteName: [],
      workers: [],
      startDate: '',
      endDate: ''
    },
    validate: validateAssign,
    onSubmit: () => {
      console.log("assign subitted");
    },
  });

  const formikJobsite = useFormik({
    initialValues: {
      jobsiteAddress: '',
      quoteNumber: '',
      stageWork: '',
      workBudget: '',
      latitude: '',
      longitude: ''
    },
    validate: validateJobsite,
    onSubmit: (values) => {
      console.log("address details", values);

      const jobsiteObject = {
        address: values.jobsiteAddress,
        ownerName: values.ownerName,
        ownerEmail: values.ownerEmail,
        ownerPhone: values.ownerPhone,
        latitude: values.latitude,
        longitude: values.longitude,
        workOrderID: values.workOrderID,
        workBudget: values.workBudget,
        note: values.note,
        stageOfWork: values.stageWork,
        status: values.stageWork == "Invoice" ? "Inactive" : "Active",
        workersList: values.workersList,
        startDate: values.startDate,
        endDate: values.endDate
      };
      console.log("Values to be updated", jobsiteObject);

      axios
        .put(`${BASE_URL}/api/jobsites/edit/${id}`, jobsiteObject)
        .then((res) => {
          console.log(res);
          if (res.status == 200) {
            showNotification(
              <span className='d-flex align-items-center'>
                <Icon icon='Info' size='lg' className='me-1' />
                <span>Jobsite Updated Successfully</span>
              </span>,
              "The Jobsite details have been successfully updated.",
            );
          }
        });


    },
  });

  const onSubmitJobsite = (e) => {
    e.preventDefault();

    let values = [];
    const jobsiteObject = {
      address: values.jobsiteAddress,
      ownerName: values.ownerName,
      ownerEmail: values.ownerEmail,
      ownerPhone: values.ownerPhone,
      latitude: values.latitude,
      longitude: values.longitude,
      workOrderID: values.workOrderID,
      workBudget: values.workBudget,
      note: values.note,
      stageOfWork: values.stageWork,
      workersList: workersList,
    };



    console.log("jobsiteObject:", jobsiteObject)
    axios
      .post(`${BASE_URL}/api/jobsites/edit/${id}`, jobsiteObject)
      .then((res) => {
        console.log("assign res is", res.data);

      });
    showNotification(
      <span className='d-flex align-items-center'>
        <Icon icon='Success' size='lg' className='me-1' />
        <span>Jobsite assigned to workers</span>
      </span>,
      "The Jobsite has been assigned successfully.",
    );

  }


  const deleteJobsite = () => {
    console.log("Jobsite to delete:", id);

    axios.delete(`${BASE_URL}/api/jobsites/${id}`).then((response) => {
      axios.get(`${BASE_URL}/api/jobsites/`).then((response) => {
        console.log(response.data);

        let jobsites = response.data;
        showNotification(
          <span className='d-flex align-items-center'>
            <Icon icon='Info' size='lg' className='me-1' />
            <span>Deleted Successfully</span>
          </span>,
          "The Jobsite has been deleted successfully.",
        );
      });
      setModal(!modal);
    });

    //setSucess(true);
    setTimeout(() => {
      // setSucess(false);
    }, 3000);
  };


  useEffect(() => {

    axios
      .get(`${BASE_URL}/api/jobsites/${id}`)
      .then((res) => {
        console.log("all values", res.data);
        formik.setValues({
          ...formik.values,
          ownerName: res.data.ownerName,
          ownerEmail: res.data.ownerEmail,
          ownerPhone: res.data.ownerPhone,
          note: res.data.note
        });
        formikJobsite.setValues({
          ...formikJobsite.values,
          quoteNumber: res.data.workOrderID,
          workBudget: res.data.workBudget,
          stageWork: res.data.stageOfWork,
          jobsiteAddress: res.data.address,
          longitude: res.data.longitude,
          latitude: res.data.latitude
        });

      });

    axios.get(`${BASE_URL}/api/users`).then((res) => {
      setUsers(res.data);
    });


  }, []);


  let workers = [];
  _.map(users, (user) => {
    let userObject = _.filter(users, ["_id", user._id]);
    if (userObject.length === 0) {

    } else {
      workers.push(userObject[0].username);
    }
  });


  const openModal = () => {
    // setUserId(id)
    setModal(!modal);

  };


  return (
    <PageWrapper title="Edit Jobsites">





      <Modal isOpen={modal} toggle={openModal}>
        <ModalHeader toggle={openModal}>Delete Jobsite</ModalHeader>
        <ModalBody>Do you want to delete the jobsite?</ModalBody>
        <ModalFooter>
          <Button
            color="primary"
            className="btn-theme btn-sm"
            onClick={deleteJobsite}
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
            <strong>{formik.values.ownerName} </strong>
          </span>
          <span className='text-muted'>Edit Jobsites</span>
        </SubHeaderLeft>
        <SubHeaderRight>


          {TABS.OWNER === activeTab && (
            <Button color='info' isOutline icon='Save' onClick={formik.handleSubmit}>
              Save
            </Button>
          )}
          {TABS.JOBSITE === activeTab && (
            <Button
              color='info'
              isOutline
              icon='Save'
              onClick={formikJobsite.handleSubmit}>
              Save
            </Button>
          )}
          {TABS.ASSIGN === activeTab && (
            <Button color='info' isOutline icon='Save' >
              Save
            </Button>
          )}
        </SubHeaderRight>
      </SubHeader>
      <Page container='fluid'>
        <div className='row h-100'>
          <div className='col-xxl-3 col-xl-4 col-lg-6'>
            <Card stretch>
              <CardHeader>
                <CardLabel icon='Business' iconColor='info'>
                  <CardTitle>Jobsite Settings</CardTitle>
                  <CardSubTitle>Jobsite/Owner Information</CardSubTitle>
                </CardLabel>
              </CardHeader>
              <CardBody isScrollable>
                <div className='row g-3'>
                  <div className='col-12'>
                    <Button
                      icon='Contacts'
                      color='info'
                      className='w-100 p-3'
                      isLight={TABS.OWNER !== activeTab}
                      onClick={() => setActiveTab(TABS.OWNER)} >
                      {TABS.OWNER}


                    </Button>
                  </div>
                  <div className='col-12'>
                    <Button
                      icon='Place'
                      color='success'
                      className='w-100 p-3'
                      isLight={TABS.JOBSITE !== activeTab}
                      onClick={() => setActiveTab(TABS.JOBSITE)}>
                      {TABS.JOBSITE}

                    </Button>
                  </div>
                  <div className='col-12'>
                    <Button
                      icon='Build'
                      color='warning'
                      className='w-100 p-3'
                      isLight={TABS.ASSIGN !== activeTab}
                      onClick={() => setActiveTab(TABS.ASSIGN)}>
                      {TABS.ASSIGN}

                    </Button>
                  </div>
                  <div className='col-12'>
                    <Button
                      icon='Delete'
                      color='danger'
                      isLight
                      className='w-100 p-3'
                      onClick={openModal}>
                      Delete Jobsite
                    </Button>
                  </div>
                </div>
              </CardBody>

            </Card>
          </div>
          <div className='col-xxl-9 col-xl-8 col-lg-6'>
            {TABS.OWNER === activeTab && (
              <Card
                stretch
                tag='form'
                noValidate onSubmit={formik.handleSubmit}
              >
                <CardHeader>
                  <CardLabel icon='Edit' iconColor='warning'>
                    <CardTitle>Owner Information</CardTitle>
                  </CardLabel>
                </CardHeader>
                <CardBody className='pb-0' isScrollable>
                  <div className='row g-4'>
                    <div className='col-lg-12'>
                      <FormGroup
                        id='ownerName'
                        label='Full Name *'
                        isFloating>
                        <Input
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.ownerName}
                          isValid={formik.isValid}
                          isTouched={formik.touched.ownerName}
                          invalidFeedback={
                            formik.errors.ownerName
                          }
                          validFeedback='Looks good!'
                        />
                      </FormGroup>
                    </div>


                    <div className='col-lg-12'>
                      <FormGroup id='ownerEmail' label='Email Address *' isFloating>
                        <Input
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.ownerEmail}
                          isValid={formik.isValid}
                          isTouched={formik.touched.ownerEmail}
                          invalidFeedback={formik.errors.ownerEmail}
                          validFeedback='Looks good!'
                        />
                      </FormGroup>
                    </div>
                    <div className='col-lg-12'>
                      <FormGroup id='ownerPhone' label='Phone No *' isFloating>
                        <Input
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.ownerPhone}
                          isValid={formik.isValid}
                          isTouched={formik.touched.ownerPhone}
                          invalidFeedback={formik.errors.ownerPhone}
                          validFeedback='Looks good!'
                        />
                      </FormGroup>
                    </div>



                    <div className='col-lg-12'>
                      <FormGroup id='note' label='Notes' isFloating>
                        <Input
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.note}
                          isValid={formik.isValid}
                          isTouched={formik.touched.note}
                          invalidFeedback={formik.errors.note}
                          validFeedback='Looks good!'
                        />
                      </FormGroup>
                    </div>

                  </div>
                </CardBody>
                <CardFooter>
                  <CardFooterLeft>
                    <Button
                      color='info'
                      isLink
                      type='reset'
                      onClick={formik.resetForm}>
                      Reset
                    </Button>
                  </CardFooterLeft>
                  <CardFooterRight>
                    <Button
                      type='submit'
                      icon='Save'
                      color='info'
                      isOutline isDisable={
                        !formik.isValid &&
                        !!formik.submitCount
                      }>
                      Save
                    </Button>
                  </CardFooterRight>
                </CardFooter>
              </Card>
            )}
            {TABS.JOBSITE === activeTab && (
              <Card
                stretch
                tag='form'
                noValidate onSubmit={formikJobsite.handleSubmit}
              >
                <CardHeader>
                  <CardLabel icon='Place' iconColor='success'>
                    <CardTitle>{TABS.JOBSITE}</CardTitle>
                  </CardLabel>
                </CardHeader>
                <CardBody className='pb-0' isScrollable>
                  <div className='row g-4'>
                    <div className='col-lg-12'>
                      <FormGroup
                        id='jobsiteAddress'
                        label='Address'
                        isFloating>
                        <Input
                          onChange={formikJobsite.handleChange}
                          onBlur={formikJobsite.handleBlur}
                          value={formikJobsite.values.jobsiteAddress}
                          isValid={formikJobsite.isValid}
                          isTouched={formikJobsite.touched.jobsiteAddress}
                          invalidFeedback={
                            formikJobsite.errors.jobsiteAddress
                          }
                          validFeedback='Looks good!'
                        />
                      </FormGroup>
                    </div>

                    <div className='col-md-6'>
                      <FormGroup
                        id='latitude'
                        label='Latitude (Location)'
                        isFloating>
                        <Input
                          onChange={formikJobsite.handleChange}
                          isDisable="true"
                          onBlur={formikJobsite.handleBlur}
                          value={formikJobsite.values.latitude}
                          isValid={formikJobsite.isValid}
                          isTouched={formikJobsite.touched.latitude}
                          invalidFeedback={
                            formikJobsite.errors.latitude
                          }
                          validFeedback='Looks good!'
                        />
                      </FormGroup>
                    </div>
                    <div className='col-md-6'>
                      <FormGroup
                        id='longitude'
                        label='Longitude (Location)'
                        isFloating>
                        <Input
                          onChange={formikJobsite.handleChange}
                          isDisable="true"
                          onBlur={formikJobsite.handleBlur}
                          value={formikJobsite.values.longitude}
                          isValid={formikJobsite.isValid}
                          isTouched={formikJobsite.touched.longitude}
                          invalidFeedback={
                            formikJobsite.errors.longitude
                          }
                          validFeedback='Looks good!'
                        />
                      </FormGroup>
                    </div>
                    <div className='col-lg-12'>
                      <FormGroup
                        id='stageWork'
                        label='Stage of Work *'
                        isFloating>
                        <select
                          name="stageWork"
                          onChange={formikJobsite.handleChange}
                          onBlur={formikJobsite.handleBlur}
                          value={formikJobsite.values.stageWork}
                          isValid={formikJobsite.isValid}
                          isTouched={formikJobsite.touched.stageWork}
                          invalidFeedback={
                            formikJobsite.errors.stageWork
                          }
                          validFeedback='Looks good!'
                          className="form-control"

                        >
                          <option value="">Select Stage of Work</option>
                          <option value="Painting">Painting</option>
                          <option value="Plastering">Plastering</option>
                          <option value="Touch-up">Touch-up</option>
                          <option value="Invoice">Invoice</option>
                        </select>

                      </FormGroup>
                    </div>
                    <div className='col-md-6'>
                      <FormGroup
                        id='quoteNumber'
                        label='Quote ID *'
                        isFloating>
                        <Input
                          onChange={formikJobsite.handleChange}
                          onBlur={formikJobsite.handleBlur}
                          value={formikJobsite.values.quoteNumber}
                          isValid={formikJobsite.isValid}
                          isTouched={formikJobsite.touched.quoteNumber}
                          invalidFeedback={
                            formikJobsite.errors.quoteNumber
                          }
                          validFeedback='Looks good!'
                        />
                      </FormGroup>
                    </div>
                    <div className='col-md-6'>
                      <FormGroup
                        id='workBudget'
                        label='Work Budget *'
                        isFloating>
                        <Input
                          onChange={formikJobsite.handleChange}
                          onBlur={formikJobsite.handleBlur}
                          value={formikJobsite.values.workBudget}
                          isValid={formikJobsite.isValid}
                          isTouched={formikJobsite.touched.workBudget}
                          invalidFeedback={
                            formikJobsite.errors.workBudget
                          }
                          validFeedback='Looks good!'
                        />
                      </FormGroup>
                    </div>

                  </div>
                </CardBody>
                <CardFooter>
                  <CardFooterLeft>
                    <Button
                      color='info'
                      isLink
                      type='reset'
                      onClick={formikJobsite.resetForm}>
                      Reset
                    </Button>
                  </CardFooterLeft>
                  <CardFooterRight>
                    <Button
                      type='submit'
                      icon='Save'
                      color='info'
                      isOutline isDisable={
                        !formikJobsite.isValid &&
                        !!formikJobsite.submitCount
                      }>
                      Save
                    </Button>
                  </CardFooterRight>
                </CardFooter>
              </Card>
            )}
            {TABS.ASSIGN === activeTab && (
              <Card
                stretch
                tag='form'

              >
                <CardHeader>
                  <CardLabel icon='Build' iconColor='warning'>
                    <CardTitle>{TABS.ASSIGN}</CardTitle>
                  </CardLabel>
                </CardHeader>
                <CardBody className='pb-0' isScrollable>

                  <div className='row g-4'>
                    <div className='col-lg-12'>

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
                          });
                        }}
                        dropdownHeight={600}
                      />

                    </div>
                    <div className='col-lg-12'>
                      <label> Start Date *: </label>
                      <DatePicker
                        placeholder="Start Date *"
                        selected={startDate}
                        onChange={(date) => setStartDate(date)}
                        className="form-control"
                        value={startDate}

                      />

                    </div>
                    <div className='col-lg-12'>
                      <label> End Date * : </label>
                      <DatePicker
                        placeholder="End Date *"
                        selected={endDate}
                        onChange={(date) => setEndDate(date)}
                        className="form-control"
                        value={endDate}
                      />

                    </div>
                  </div>
                </CardBody>
                <CardFooter>

                  <CardFooterRight>
                    <Button
                      type='submit'
                      icon='Save'
                      color='info'
                      onClick={onSubmitJobsite}>
                      Save
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