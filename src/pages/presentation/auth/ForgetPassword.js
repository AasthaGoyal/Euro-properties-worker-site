import React, { useCallback, Component, useState } from 'react';
import PropTypes from "prop-types";
import { useNavigate, useHistory, Link } from 'react-router-dom';
import { connect } from "react-redux";
import classNames from 'classnames';
import _ from "lodash";
import PageWrapper from '../../../layout/PageWrapper/PageWrapper';
import Page from '../../../layout/Page/Page';
import Card, { CardBody } from '../../../components/bootstrap/Card';
import FormGroup from '../../../components/bootstrap/forms/FormGroup';
import Input from '../../../components/bootstrap/forms/Input';
import Button from '../../../components/bootstrap/Button';
import Logo from '../../../components/images/euro.jpg';
import { demoPages, dashboardMenu } from '../../../menu'
import { useFormik, validateYupSchema } from 'formik';
import showNotification from '../../../components/extras/showNotification';
import Icon from '../../../components/icon/Icon';
import { send } from 'emailjs-com';
import axios from "axios";
import { BASE_URL } from "../../../layout/actions/actionConstant";
import { loginUser } from "../../../layout/actions/authActions";

const ForgetPassword = (props) => {


  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const [isAuthenticated, setAuthenticated] = useState(false);
  const [users, setUsers] = useState([]);


  const navigate = useNavigate();
  const validate = (values) => {
    const errors = {};

    if (!values.email) {
      errors.username = 'Required';
    }

    if (!values.firstName) {
      errors.username = 'Required';
    }
    if (!values.lastName) {
      errors.username = 'Required';
    }


    return errors;
  };
  const formik = useFormik({

    initialValues: {
      email: '',


    },
    validate,
    // eslint-disable-next-line no-unused-vars
    onSubmit: (values) => {

      console.log(values);


      let userResult = [];

      users.map((user) => {
        if (user.firstName == values.firstName && user.lastName == values.lastName && user.email == values.email) {
          userResult.push(user);
          console.log(user);
        }
      })

      if (userResult[0]) {

        const userData = {
          email: values.email
        }

        axios.post(`${BASE_URL}/api/users/reset_password`, userData).then((response) => {

          console.log('Forgot Password response:', response);

          let token = response.data.token;
          const toSend = ({
            to_email: userResult[0].email,
            to_name: userResult[0].firstName,
            message: `To Reset the password follow the link https://localhost:3001/reset-password/token/${token}`,
          });

          send('service_9qug9hv', 'template_ob1b2oo', toSend, 'wr1S52Ze1ly-Wk_9C')
            .then((result) => {
              console.log(result);
            }, (error) => {
              console.log(error.text);
            });

          showNotification(
            <span className='d-flex align-items-center'>
              <Icon icon='EmojiSmile' size='lg' className='me-1' />
              <span>Forget Password email send</span>
            </span>,
            "A confirmation email has been send. Follow the email to reset your password", "success"
          );

        });







      } else {
        showNotification(
          <span className='d-flex align-items-center'>
            <Icon icon='EmojiAngry' size='lg' className='me-1' />
            <span>Incorrect Email Address</span>
          </span>,
          "We could not find this email address in our records, please try again", "warning"
        );
      }
    }

  });



  React.useEffect(() => {
    axios.get(`${BASE_URL}/api/users`).then((response) => {
      setUsers(response.data)

    });
  }
  )




  return (

    <PageWrapper
      title='Login'
      className={classNames('bg-danger')}>


      <Page className='p-0'>
        <div className='row h-100 align-items-center justify-content-center'>
          <div className='col-xl-4 col-lg-6 col-md-8 shadow-3d-container'>
            <Card className='shadow-3d-dark' data-tour='login-page' validate onSubmit={formik.handleSubmit}>
              <CardBody>
                <div className='text-center my-5'>
                  <Link
                    to='/'
                    className={classNames(
                      'text-decoration-none  fw-bold display-2 text-dark')}>
                    <img src={Logo} alt="logo" width={200} />

                  </Link>
                </div>

                <div className='text-center h1 fw-bold mt-5'>Forget Password</div>
                <div className='text-center h4 text-muted mb-5'>Enter your email address to continue!</div>

                <form className='row g-4'>

                  <div className='col-12'>

                    <FormGroup
                      isFloating
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

                    <br />
                    <FormGroup
                      isFloating
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
                    <br />
                    <FormGroup
                      id='email'
                      isFloating
                      label='Your email address'>
                      <Input
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.email}
                        isValid={formik.isValid}
                        isTouched={formik.touched.email}
                        invalidFeedback={
                          formik.errors.email
                        }
                        validFeedback='Looks good!'
                      />
                    </FormGroup>

                  </div>
                  <br />
                  <Button
                    type='submit' color='danger' icon='save' isDisable={!formik.isValid && !!formik.submitCount}

                    className='w-100 py-3'

                  >
                    Submit
                  </Button>
                  <br />
                  <>
                    <div className='col-12 mt-3 text-center text-muted'>
                      OR
                    </div>
                    <div className='col-12 mt-3'>

                      <Link to="/">


                        <Button

                          color='info'
                          className={classNames('w-100 py-3')}
                          icon='Login'
                        >
                          Back to Login
                        </Button>
                      </Link>

                    </div>
                  </>

                </form>
              </CardBody>
            </Card>
            <div className='text-center'>
              <a
                href='/'
                className={classNames('text-decoration-none me-3 link-dark')}>
                Privacy policy
              </a>
              <a
                href='/'
                className={classNames('link-light text-decoration-none link-dark')}>
                Terms of use
              </a>
            </div>
          </div>
        </div>
      </Page>
    </PageWrapper>

  )
}


ForgetPassword.propTypes = {
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(mapStateToProps, {})(ForgetPassword);
