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

    if (!values.username) {
      errors.username = 'Required';
    } else if (values.username.length < 3) {
      errors.username = 'Must be 3 characters or more';
    }

    if (!values.firstName) {
      errors.firstName = 'Required';
    }

    if (!values.lastName) {
      errors.lastName = 'Required';
    }

    if (!values.email) {
      errors.email = 'Required';
    }

    if (!values.phone) {
      errors.phone = 'Required';
    }

    if (!values.userType) {
      errors.userType = 'Required';
    }

    if (!values.password) {
      errors.password = 'Required';
    }


    if (!values.confirmPassword) {
      errors.confirmPassword = 'Required';
    }

    return errors;
  };





  const formik = useFormik({
    initialValues: {
      userType: '',
      firstName: '',
      lastName: '',
      username: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      address: '',
      note: '',
      ird: '',
      bankacc: '',
      contractor: '',
      tax: '',
      gst: '',
      rate: ''
    },
    validate,
    // eslint-disable-next-line no-unused-vars
    onSubmit: (values) => {



      const userObject = {
        userType: values.userType,
        username: values.username,
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        password: values.password,
        phone: values.phone,
        address: values.address,
        status: "Active",
        note: values.note,
        bankacc: values.bankacc,
        rate: values.rate,
        gst: values.gst,
        contractor: values.contractor,
        taxRate: values.tax,
        ird: values.ird
      };

      console.log("the user being added is", userObject);
      axios.post(`${BASE_URL}/api/users/addUser`, userObject).then((res) => {
        console.log("The response is", res);
        if (res.status === 200) {
          console.log("User details:", res.data);

          showNotification(
            <span className='d-flex align-items-center'>
              <Icon icon='Info' size='lg' className='me-1' />
              <span>New User Added</span>
            </span>,
            "The new user has been successfully added.",
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
                        <Avatar
                          srcSet={UserImageWebp}
                          src={UserImage}
                          className='rounded-circle'
                        />
                      </div>
                      <div className='flex-grow-1 ms-3'>
                        <div className='h2 fw-bold'>
                          Add New User
                        </div>

                      </div>
                    </div>
                  </div>

                </div>
              </CardBody>
            </Card>

            <Card tag='form'
              validate onSubmit={formik.handleSubmit}>

              <Card
                className='rounded-2'
                tag='form'

              >
                <CardHeader>
                  <CardLabel icon='Person'>
                    <CardTitle>Personal Information</CardTitle>
                  </CardLabel>
                </CardHeader>
                <CardBody>
                  <div className='row g-4'>


                    <FormGroup
                      className='col-lg-6'
                      id='firstName'
                      label='First Name *'>
                      <Input
                        placeholder="John"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.firstName}
                        isValid={formik.isValid}
                        isTouched={formik.touched.firstName}
                        invalidFeedback={
                          formik.errors.firstName
                        }
                        validFeedback='Looks good!'
                      />
                    </FormGroup>

                    <FormGroup
                      className='col-lg-6'
                      id='lastName'
                      label='Last Name *'>
                      <Input
                        placeholder="Smith"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.lastName}
                        isValid={formik.isValid}
                        isTouched={formik.touched.lastName}
                        invalidFeedback={formik.errors.lastName}
                        validFeedback='Looks good!'
                      />
                    </FormGroup>
                    <FormGroup
                      className='col-lg-6'
                      id='email'
                      label='Email Address *'>



                      <Input
                        placeholder="John@domain.com"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.email}
                        isValid={formik.isValid}
                        isTouched={formik.touched.email}
                        invalidFeedback={formik.errors.email}
                        validFeedback='Looks good!'
                      />
                    </FormGroup>
                    <FormGroup
                      className='col-lg-6'
                      id='phone'
                      label='Phone *'>
                      <Input
                        placeholder="+1 (999) 999-9999"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.phone}
                        isValid={formik.isValid}
                        isTouched={formik.touched.phone}
                        invalidFeedback={formik.errors.phone}
                        validFeedback='Looks good!'
                      />

                    </FormGroup>
                    <FormGroup
                      className='col-md-6'
                      id='userType'
                      label='User Type *'>
                      <select
                        name="userType"
                        onChange={formik.handleChange}
                        className="form-control"
                        isValid={formik.isValid}
                        isTouched={formik.touched.userType}
                        invalidFeedback={formik.errors.userType}
                        validFeedback='Looks good!'
                        onBlur={formik.handleBlur}
                        value={formik.values.userType}
                      >
                        <option value="">Select User Type</option>
                        <option value="Admin">Admin</option>
                        <option value="Manager">Manager</option>
                        <option value="Employee">Employee</option>
                      </select>
                    </FormGroup>
                    <FormGroup
                      className='col-md-6'
                      id='username'
                      label='Username * (min 3 letters)'>
                      <Input
                        placeholder="johns"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.username}
                        isValid={formik.isValid}
                        isTouched={formik.touched.username}
                        invalidFeedback={formik.errors.username}
                        validFeedback='Looks good!'
                      />
                    </FormGroup>
                    <FormGroup
                      className='col-12'
                      id='address'
                      label='Address'>
                      <Input
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.address}
                        isValid={formik.isValid}
                        isTouched={formik.touched.address}
                        invalidFeedback={
                          formik.errors.address
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


              </Card>
              <Card
                className='rounded-2'
                tag='form'

              >
                <CardHeader>
                  <CardLabel icon='LocalPolice' iconColor='success'>
                    <CardTitle>Set New Password </CardTitle>
                  </CardLabel>
                </CardHeader>
                <CardBody>
                  <div className='row g-4'>
                    <FormGroup
                      className='col-md-6'
                      id='password'
                      label='Password *'>
                      <Input
                        type="password"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.password}
                        isValid={formik.isValid}
                        isTouched={formik.touched.password}
                        invalidFeedback={formik.errors.password}
                        validFeedback='Looks good!'
                      />
                    </FormGroup>
                    <FormGroup
                      className='col-md-6'
                      id='confirmPassword'
                      label='Confirm Password *'>
                      <Input
                        type="password"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.confirmPassword}
                        isValid={formik.isValid}
                        isTouched={formik.touched.confirmPassword}
                        invalidFeedback={formik.errors.confirmPassword}
                        validFeedback='Looks good!'
                      />
                    </FormGroup>
                  </div>
                </CardBody>
              </Card>
              <Card
                className='rounded-2'
                tag='form'

              >
                <CardHeader>
                  <CardLabel icon='ArchiveFill' iconColor='warning'>
                    <CardTitle>Optional Details</CardTitle>
                  </CardLabel>
                </CardHeader>
                <CardBody>
                  <div className='row g-4'>


                    <FormGroup
                      className='col-lg-6'
                      id='ird'
                      label='IRD Number'>
                      <Input
                        placeholder="232-433-231"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.ird}
                        isValid={formik.isValid}
                        isTouched={formik.touched.ird}
                        invalidFeedback={
                          formik.errors.ird
                        }
                        validFeedback='Looks good!'
                      />
                    </FormGroup>

                    <FormGroup
                      className='col-lg-6'
                      id='bankacc'
                      label='Bank Account Number'>
                      <Input

                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.bankacc}
                        isValid={formik.isValid}
                        isTouched={formik.touched.bankacc}
                        invalidFeedback={formik.errors.bankacc}
                        validFeedback='Looks good!'
                      />
                    </FormGroup>
                    <FormGroup
                      className='col-lg-6'
                      id='rate'
                      label='Hourly Rate (NZD)'>



                      <Input
                        placeholder="$23"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.rate}
                        isValid={formik.isValid}
                        isTouched={formik.touched.rate}
                        invalidFeedback={formik.errors.rate}
                        validFeedback='Looks good!'
                      />
                    </FormGroup>
                    <FormGroup
                      className='col-lg-6'
                      id='contractor'
                      label='Contractor '>
                      <select
                        name="contractor"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.contractor}
                        isValid={formik.isValid}
                        isTouched={formik.touched.contractor}
                        invalidFeedback={formik.errors.contractor}
                        validFeedback='Looks good!'
                        className="form-control"
                      >
                        <option value=""></option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>

                    </FormGroup>
                    <FormGroup
                      className='col-md-6'
                      id='gst'
                      label='GST Registered'>
                      <select
                        name="gst"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.gst}
                        isValid={formik.isValid}
                        isTouched={formik.touched.gst}
                        invalidFeedback={formik.errors.gst}
                        validFeedback='Looks good!'
                        className="form-control"
                      >
                        <option value=""></option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                    </FormGroup>
                    <FormGroup
                      className='col-md-6'
                      id='tax'
                      label='Tax Rate'>
                      <Input
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.tax}
                        isValid={formik.isValid}
                        isTouched={formik.touched.tax}
                        invalidFeedback={formik.errors.tax}
                        isDisable={false}
                        validFeedback='Looks good!'
                      />
                    </FormGroup>

                  </div>
                </CardBody>

              </Card>
              <CardFooter>
                <CardFooterRight>

                  <Button type='submit' color='info' icon='Save' isDisable={!formik.isValid && !!formik.submitCount} >
                    Add User
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
