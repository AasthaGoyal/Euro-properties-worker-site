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



const ProductViewPage = () => {
  const { darkModeStatus } = useDarkMode();

  const validateAddress = (values) => {
    const errors = {};
    if (!values.address) {
      errors.address = 'Required';
    }



    return errors;
  };

  const validateAccount = (values) => {
    const errors = {};
    if (!values.rate) {
      errors.rate = 'Required';
    }



    return errors;
  };

  const validate = (values) => {
    const errors = {};



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

    if (!values.username) {
      errors.username = 'Required';
    } else if (values.username.length < 3) {
      errors.username = 'Must be 3 characters or more';
    }

    return errors;
  };

  const [redirect, setRedirect] = useState(false);
  const [modal, setModal] = useState(false);


  const { id } = useParams();




  const navigate = useNavigate();

  // const itemData = tableData.filter((item) => item.id.toString() === id.toString());
  // const data = itemData[0];

  const TABS = {
    ACCOUNT_DETAIL: 'Account Details',
    ADDRESS: 'Address',
    BANK: 'Bank/Tax Details'
  };

  const [activeTab, setActiveTab] = useState(TABS.ACCOUNT_DETAIL);
  const [toggleInfoEventCanvas, setToggleInfoEventCanvas] = useState(false);
  const setInfoEvent = () => setToggleInfoEventCanvas(!toggleInfoEventCanvas);
  const [events, setEvents] = useState([]);

  const formik = useFormik({
    initialValues: {
      userType: '',
      firstName: '',
      lastName: '',
      username: '',
      email: '',
      phone: '',
      note: ''

    },
    validate,
    onSubmit: (values) => {
      console.log("Values to be updated", values);
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
        tax: values.tax,
        ird: values.ird
      };

      console.log("user object is", userObject);

      axios
        .put(`${BASE_URL}/api/users/edit/${id}`, userObject)
        .then((res) => {
          if (res.status == 200) {
            showNotification(
              <span className='d-flex align-items-center'>
                <Icon icon='Info' size='lg' className='me-1' />
                <span>Updated Successfully</span>
              </span>,
              "The user's account details have been successfully updated.",
            );
          }
        });

    },
  });

  const formikAddress = useFormik({
    initialValues: {
      address: '',

    },
    validate: validateAddress,
    onSubmit: (values) => {
      console.log("address details", values);
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
        tax: values.tax,
        ird: values.ird
      };

      axios
        .put(`${BASE_URL}/api/users/edit/${id}`, userObject)
        .then((res) => {
          if (res.status == 200) {
            showNotification(
              <span className='d-flex align-items-center'>
                <Icon icon='Info' size='lg' className='me-1' />
                <span>Address Updated Successfully</span>
              </span>,
              "The user's address have been successfully updated.",
            );
          }
        });


    },
  });

  const formikAccount = useFormik({
    initialValues: {
      rate: '',
      gst: '',
      contractor: '',
      tax: '',
      ird: '',
      bankacc: ''

    },
    validate: validateAccount,
    onSubmit: (values) => {
      console.log("address details", values);
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
        tax: values.tax,
        ird: values.ird
      };

      console.log("the user object is", userObject);
      axios
        .put(`${BASE_URL}/api/users/edit/${id}`, userObject)
        .then((res) => {
          console.log(res.data);
          if (res.status == 200) {
            showNotification(
              <span className='d-flex align-items-center'>
                <Icon icon='Info' size='lg' className='me-1' />
                <span>Account details Updated Successfully</span>
              </span>,
              "The user's account details have been successfully updated.",
            );
          }
        });


    },
  });


  useEffect(() => {

    axios
      .get(`${BASE_URL}/api/users/${id}`)
      .then((res) => {
        formik.setValues({
          ...formik.values,
          userType: res.data.userType,
          firstName: res.data.firstName,
          lastName: res.data.lastName,
          username: res.data.username,
          password: res.data.password,
          email: res.data.email,
          phone: res.data.phone,
          note: res.data.note,

        });
        formikAddress.setValues({
          ...formikAddress.values,
          address: res.data.address
        });
        formikAccount.setValues({
          ...formikAccount.values,
          ird: res.data.IRDNumber,
          bankacc: res.data.bankAccountNumber,
          rate: res.data.ratePerHour,
          contractor: res.data.Contractor,
          gst: res.data.GSTRegistered,
          tax: res.data.tax
        })
      });

  }, []);



  const deleteUser = (e) => {
    e.preventDefault();
    console.log("User to delete:", id);

    axios.delete(`${BASE_URL}/api/users/${id}`).then((response) => {
      axios.get(`${BASE_URL}/api/users/`).then((response) => {
        console.log(response.data);

        let users = response.data;
        showNotification(
          <span className='d-flex align-items-center'>
            <Icon icon='Info' size='lg' className='me-1' />
            <span>Deleted Successfully</span>
          </span>,
          "The user has been deleted successfully.",
        );

      });
      setModal(!modal);
    });

    //setSucess(true);
    setTimeout(() => {
      // setSucess(false);
    }, 3000);
  };

  const openModal = () => {
    // setUserId(id)
    setModal(!modal);

  };


  return (
    <PageWrapper title="Edit User">
      <Modal isOpen={modal} toggle={openModal}>
        <ModalHeader toggle={openModal}>Delete User</ModalHeader>
        <ModalBody>Do you want to delete the user?</ModalBody>
        <ModalFooter>
          <Button
            color="primary"
            className="btn-theme btn-sm"
            onClick={deleteUser}
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
            <strong>{formik.values.firstName} {" "} {formik.values.lastName}</strong>
          </span>
          <span className='text-muted'>Edit User</span>
        </SubHeaderLeft>
        <SubHeaderRight>


          {TABS.ACCOUNT_DETAIL === activeTab && (
            <Button color='info' isOutline icon='Save' onClick={formik.handleSubmit}>
              Save
            </Button>
          )}
          {TABS.ADDRESS === activeTab && (
            <Button
              color='info'
              isOutline
              icon='Save'
              onClick={formikAddress.handleSubmit}>
              Save
            </Button>
          )}
          {TABS.BANK === activeTab && (
            <Button
              color='info'
              isOutline
              icon='Save'
              onClick={formikAccount.handleSubmit}>
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
                <CardLabel icon='Person' iconColor='info'>
                  <CardTitle>Account Settings</CardTitle>
                  <CardSubTitle>Personal Information</CardSubTitle>
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
                      icon='Place'
                      color='success'
                      className='w-100 p-3'
                      isLight={TABS.ADDRESS !== activeTab}
                      onClick={() => setActiveTab(TABS.ADDRESS)}>
                      {TABS.ADDRESS}

                    </Button>
                  </div>
                  <div className='col-12'>
                    <Button
                      icon='Bank'
                      color='warning'
                      className='w-100 p-3'
                      isLight={TABS.BANK !== activeTab}
                      onClick={() => setActiveTab(TABS.BANK)}>
                      {TABS.BANK}

                    </Button>
                  </div>
                  <div className='col-12'>
                    <Button
                      icon='Delete'
                      color='danger'
                      isLight
                      className='w-100 p-3'
                      onClick={openModal}>
                      Delete User
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
                noValidate onSubmit={formik.handleSubmit}
              >
                <CardHeader>
                  <CardLabel icon='Edit' iconColor='warning'>
                    <CardTitle>Personal Information</CardTitle>
                  </CardLabel>
                </CardHeader>
                <CardBody className='pb-0' isScrollable>
                  <div className='row g-4'>
                    <div className='col-lg-6'>
                      <FormGroup
                        id='firstName'
                        label='First Name'
                        isFloating>
                        <Input
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
                    </div>


                    <div className='col-lg-6'>
                      <FormGroup id='lastName' label='Last Name' isFloating>
                        <Input
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.lastName}
                          isValid={formik.isValid}
                          isTouched={formik.touched.lastName}
                          invalidFeedback={formik.errors.lastName}
                          validFeedback='Looks good!'
                        />
                      </FormGroup>
                    </div>
                    <div className='col-lg-6'>
                      <FormGroup id='email' label='Email' isFloating>
                        <Input
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.email}
                          isValid={formik.isValid}
                          isTouched={formik.touched.email}
                          invalidFeedback={formik.errors.email}
                          validFeedback='Looks good!'
                        />
                      </FormGroup>
                    </div>
                    <div className='col-lg-6'>
                      <FormGroup id='phone' label='Phone' isFloating>
                        <Input
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.phone}
                          isValid={formik.isValid}
                          isTouched={formik.touched.phone}
                          invalidFeedback={formik.errors.phone}
                          validFeedback='Looks good!'
                        />
                      </FormGroup>
                    </div>
                    <div className='col-lg-6'>
                      <FormGroup id='usertype' label='User Type' isFloating>
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
                    </div>
                    <div className='col-lg-6'>
                      <FormGroup id='username' label='Username' isFloating>
                        <Input
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.username}
                          isValid={formik.isValid}
                          isTouched={formik.touched.username}
                          invalidFeedback={formik.errors.username}
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
                      Submit
                    </Button>
                  </CardFooterRight>
                </CardFooter>
              </Card>
            )}
            {TABS.ADDRESS === activeTab && (
              <Card
                stretch
                tag='form'
                noValidate onSubmit={formikAddress.handleSubmit}
              >
                <CardHeader>
                  <CardLabel icon='Place' iconColor='info'>
                    <CardTitle>{TABS.ADDRESS}</CardTitle>
                  </CardLabel>
                </CardHeader>
                <CardBody className='pb-0' isScrollable>
                  <div className='row g-4'>
                    <div className='col-lg-12'>
                      <FormGroup
                        id='address'
                        label='Address'
                        isFloating>
                        <Input
                          onChange={formikAddress.handleChange}
                          onBlur={formikAddress.handleBlur}
                          value={formikAddress.values.address}
                          isValid={formikAddress.isValid}
                          isTouched={formikAddress.touched.address}
                          invalidFeedback={
                            formikAddress.errors.address
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
                      onClick={formikAddress.resetForm}>
                      Reset
                    </Button>
                  </CardFooterLeft>
                  <CardFooterRight>
                    <Button
                      type='submit'
                      icon='Save'
                      color='info'
                      isOutline isDisable={
                        !formikAddress.isValid &&
                        !!formikAddress.submitCount
                      }>
                      Save
                    </Button>
                  </CardFooterRight>
                </CardFooter>
              </Card>
            )}
            {TABS.BANK === activeTab && (
              <Card
                stretch
                tag='form'
                noValidate onSubmit={formikAccount.handleSubmit}
              >
                <CardHeader>
                  <CardLabel icon='Place' iconColor='info'>
                    <CardTitle>{TABS.BANK}</CardTitle>
                  </CardLabel>
                </CardHeader>
                <CardBody className='pb-0' isScrollable>
                  <div className='row g-4'>
                    <div className='col-lg-12'>
                      <FormGroup
                        id='ird'
                        label='IRD Number '
                        isFloating>
                        <Input
                          placeholder="232-433-231"
                          onChange={formikAccount.handleChange}
                          onBlur={formikAccount.handleBlur}
                          value={formikAccount.values.ird}
                          isValid={formikAccount.isValid}
                          isTouched={formikAccount.touched.ird}
                          invalidFeedback={
                            formikAccount.errors.ird
                          }
                          validFeedback='Looks good!'
                        />
                      </FormGroup>
                    </div>
                    <div className='col-lg-12'>
                      <FormGroup
                        id='bankacc'
                        label='Bank Account Number '
                        isFloating>
                        <Input

                          onChange={formikAccount.handleChange}
                          onBlur={formikAccount.handleBlur}
                          value={formikAccount.values.bankacc}
                          isValid={formikAccount.isValid}
                          isTouched={formikAccount.touched.bankacc}
                          invalidFeedback={formikAccount.errors.bankacc}
                          validFeedback='Looks good!'
                        />
                      </FormGroup>
                    </div>
                    <div className='col-md-6'>
                      <FormGroup
                        id='rate'
                        label='Hourly Rate (NZD) '
                        isFloating>
                        <Input
                          placeholder="$23"
                          onChange={formikAccount.handleChange}
                          onBlur={formikAccount.handleBlur}
                          value={formikAccount.values.rate}
                          isValid={formikAccount.isValid}
                          isTouched={formikAccount.touched.rate}
                          invalidFeedback={formikAccount.errors.rate}
                          validFeedback='Looks good!'
                        />
                      </FormGroup>
                    </div>

                    <div className='col-md-6'>
                      <FormGroup
                        id='contractor '
                        label='Is a Contractor ? '
                        isFloating>
                        <select
                          name="contractor"
                          onChange={formikAccount.handleChange}
                          onBlur={formikAccount.handleBlur}
                          value={formikAccount.values.contractor}
                          isValid={formikAccount.isValid}
                          isTouched={formikAccount.touched.contractor}
                          invalidFeedback={formikAccount.errors.contractor}
                          validFeedback='Looks good!'
                          className="form-control"
                        >
                          <option value=""></option>
                          <option value="Yes">Yes</option>
                          <option value="No">No</option>
                        </select>
                      </FormGroup>
                    </div>
                    <div className='col-lg-12'>
                      <FormGroup
                        id='gst '
                        label='Is GST registered ? '
                        isFloating>
                        <select
                          name="gst"
                          onChange={formikAccount.handleChange}
                          onBlur={formikAccount.handleBlur}
                          value={formikAccount.values.gst}
                          isValid={formikAccount.isValid}
                          isTouched={formikAccount.touched.gst}
                          invalidFeedback={formikAccount.errors.gst}
                          validFeedback='Looks good!'
                          className="form-control"
                        >
                          <option value=""></option>
                          <option value="Yes">Yes</option>
                          <option value="No">No</option>
                        </select>
                      </FormGroup>
                    </div>
                    <div className='col-lg-12'>
                      <FormGroup
                        id='tax'
                        label='Tax Rate'
                        isFloating>
                        <Input
                        placeholder="23"
                          onChange={formikAccount.handleChange}
                          onBlur={formikAccount.handleBlur}
                          value={formikAccount.values.tax}
                          isValid={formikAccount.isValid}
                          isTouched={formikAccount.touched.tax}
                          invalidFeedback={formikAccount.errors.tax}
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
                      onClick={formikAccount.resetForm}>
                      Reset
                    </Button>
                  </CardFooterLeft>
                  <CardFooterRight>
                    <Button
                      type='submit'
                      icon='Save'
                      color='info'
                      isOutline isDisable={
                        !formikAccount.isValid &&
                        !!formikAccount.submitCount
                      }>
                      Save
                    </Button>
                  </CardFooterRight>
                </CardFooter>
              </Card>
            )}


          </div>
        </div>
      </Page>
    </PageWrapper>
  );
};

export default ProductViewPage;
