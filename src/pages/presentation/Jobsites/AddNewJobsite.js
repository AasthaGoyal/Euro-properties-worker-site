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

const AddNewUser = () => {

  const [redirect, setRedirect] = useState(false);
  const [eventItem, setEventItem] = useState(null);

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

    if (!values.jobsiteAddress) {
      errors.jobsiteAddress = 'Required';
    }

    if (!values.quoteNumber) {
      errors.quoteNumber = 'Required';
    }

    if (!values.stageWork) {
      errors.stageWork = 'Required';
    }


    if(!values.workBudget)
    {
      errors.workBudget = 'Required';
    }

    return errors;
  };





  const formik = useFormik({
    initialValues: {
      ownerName: '',
      ownerEmail: '',
      ownerPhone: '',
      jobsiteAddress: '',
      quoteNumber: '',
      stageWork: '',
      workBudget: '',
      latitude: '',
      longitude: '',
      note: ''

    },
    validate,
    // eslint-disable-next-line no-unused-vars
    onSubmit: (values) => {
  

      const jobsiteObject = {
        address: values.jobsiteAddress,
        ownerName: values.ownerName,
        ownerEmail: values.ownerEmail,
        ownerPhone: values.ownerPhone,
        latitude: values.latitude,
        longitude: values.longitude,
        workOrderID: values.quoteNumber,
        workBudget: values.workBudget,
        note: values.note,
        stageOfWork: values.stageWork,
        status: "Active",
        workersList: values.workersList,
        startDate: values.startDate,
        endDate: values.endDate
      };

      console.log("the user being added is", jobsiteObject);

      axios
        .post(`${BASE_URL}/api/jobsites/addjobsite`, jobsiteObject)
        .then((res) => {
          console.log("The response is", res);
          if (res.status === 200) {
            console.log("User details:", res.data);

            showNotification(
              <span className='d-flex align-items-center'>
                <Icon icon='Info' size='lg' className='me-1' />
                <span>New Jobsite Added</span>
              </span>,
              "The new Jobsite has been successfully added.",
            );


          }
        }).catch(err => console.log(err));


    }

  });



  const colors = ['primary', 'secondary', 'success', 'info', 'warning', 'danger', 'dark'];



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
                      <div className='flex-shrink-0'>

                      </div>
                      <div className='flex-grow-1 ms-3'>
                        <div className='h2 fw-bold'>
                          Add New Jobsite
                        </div>

                      </div>
                    </div>
                  </div>

                </div>
              </CardBody>
            </Card>

            <Card >

              <Card
                className='rounded-2'
                tag='form'
                validate onSubmit={formik.handleSubmit}
              >
                <CardHeader>
                  <CardLabel icon='Business'>
                    <CardTitle>Jobsite Information</CardTitle>
                  </CardLabel>
                </CardHeader>
                <CardBody>
                  <div className='row g-4'>


                    <FormGroup
                      className='col-lg-6'
                      id='ownerName'
                      label='Full Name *'>
                      <Input
                        placeholder="John Smith"
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

                    <FormGroup
                      className='col-lg-6'
                      id='ownerEmail'
                      label='Email Address *'>
                      <Input
                        placeholder="john34@gmail.com"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.ownerEmail}
                        isValid={formik.isValid}
                        isTouched={formik.touched.ownerEmail}
                        invalidFeedback={formik.errors.ownerEmail}
                        validFeedback='Looks good!'
                      />
                    </FormGroup>
                    <FormGroup
                      className='col-lg-6'
                      id='ownerPhone'
                      label='Phone No *'>



                      <Input
                        placeholder="+1 (999) 999-9999"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.ownerPhone}
                        isValid={formik.isValid}
                        isTouched={formik.touched.ownerPhone}
                        invalidFeedback={formik.errors.ownerPhone}
                        validFeedback='Looks good!'
                      />
                    </FormGroup>
                    <FormGroup
                      className='col-lg-6'
                      id='quoteNumber'
                      label='Quote ID *'>
                      <Input
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.quoteNumber}
                        isValid={formik.isValid}
                        isTouched={formik.touched.quoteNumber}
                        invalidFeedback={
                          formik.errors.quoteNumber
                        }
                        validFeedback='Looks good!'
                      />

                    </FormGroup>
                    <FormGroup
                      className='col-md-6'
                      id='workBudget'
                      label='Work Budget *'>
                      <Input
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.workBudget}
                        isValid={formik.isValid}
                        isTouched={formik.touched.workBudget}
                        invalidFeedback={
                          formik.errors.workBudget
                        }
                        validFeedback='Looks good!'
                      />
                    </FormGroup>
                    <FormGroup className='col-md-6' id='stageWork' label="Stage of Work *">
                      <select
                        name="stageWork"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.stageWork}
                        isValid={formik.isValid}
                        isTouched={formik.touched.stageWork}
                        invalidFeedback={
                          formik.errors.stageWork
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
                    <FormGroup
                      className='col-lg-12'
                      id='jobsiteAddress'
                      label='Address *'>
                      <Input
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.jobsiteAddress}
                        isValid={formik.isValid}
                        isTouched={formik.touched.jobsiteAddress}
                        invalidFeedback={formik.errors.jobsiteAddress}
                        validFeedback='Looks good!'
                      />
                    </FormGroup>
                    <FormGroup
                      className='col-md-6'
                      id='latitude'
                      label='Latitude *'>
                      <Input
                        onChange={formik.handleChange}
                        isDisable="true"
                        onBlur={formik.handleBlur}
                        value={formik.values.latitude}
                        isValid={formik.isValid}
                        isTouched={formik.touched.latitude}
                        invalidFeedback={
                          formik.errors.latitude
                        }
                        validFeedback='Looks good!'
                      />
                    </FormGroup>
                    <FormGroup
                      className='col-md-6'
                      id='longitude'
                      label='Longitude *'>
                      <Input
                        onChange={formik.handleChange}
                        isDisable="true"
                        onBlur={formik.handleBlur}
                        value={formik.values.longitude}
                        isValid={formik.isValid}
                        isTouched={formik.touched.longitude}
                        invalidFeedback={
                          formik.errors.longitude
                        }
                        validFeedback='Looks good!'
                      />
                    </FormGroup>
                   
                    <FormGroup
                      className='col-lg-12'
                      id='note'
                      label='Notes'>
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
                </CardBody>
                <CardFooter>
                  <CardFooterRight>

                    <Button type='submit' color='info' icon='Save' isDisable={!formik.isValid && !!formik.submitCount} >
                      Add Jobsite
                    </Button>

                  </CardFooterRight>
                </CardFooter>

              </Card>
            </Card>
          </div>
        </div>


      </Page>
    </PageWrapper>
  );
};

export default AddNewUser;
