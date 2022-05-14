import React, { useCallback, Component, useState } from 'react';
import PropTypes from "prop-types";
import { useNavigate, useHistory, Link } from 'react-router-dom';
import { connect } from "react-redux";
import classNames from 'classnames';
import PageWrapper from '../../../layout/PageWrapper/PageWrapper';
import Page from '../../../layout/Page/Page';
import Card, { CardBody } from '../../../components/bootstrap/Card';
import FormGroup from '../../../components/bootstrap/forms/FormGroup';
import Input from '../../../components/bootstrap/forms/Input';
import Button from '../../../components/bootstrap/Button';
import Logo from '../../../components/images/euro.jpg';
import { demoPages, dashboardMenu } from '../../../menu'
import { loginUser } from "../../../layout/actions/authActions";
import { useFormik, validateYupSchema } from 'formik';
import showNotification from '../../../components/extras/showNotification';
import Icon from '../../../components/icon/Icon';
import axios from 'axios';
import setAuthToken from '../../../layout/utils/setAuthToken';
import jwt_decode from 'jwt-decode';

import { BASE_URL } from '../../../actions/actionConstant';

const Login = (props) => {

  const navigate = useNavigate();
  const { errors, setErrors } = useState();

  const validate = (values) => {
    const errors = {};

    if (!values.username) {
      errors.username = 'Required';
    }

    if (!values.password) {
      errors.password = 'Required';
    }

    return errors;
  };




  const formik = useFormik({

    initialValues: {
      username: '',
      password: ''

    },
    validate,
    // eslint-disable-next-line no-unused-vars
    onSubmit: (values) => {

      const userData = {
        username: values.username,
        password: values.password
      }

      console.log("request formed", userData);
      axios
        .post(`${BASE_URL}/api/users/login`, userData)
        .then(res => {
          if (res.status == 200) {
            
            // Save to localStorage
            const { token } = res.data;
            // Set token to ls
            localStorage.setItem('jwtToken', token);
            // Set token to Auth header
            setAuthToken(token);
            // Decode token to get user data
            const decoded = jwt_decode(token);
            
            navigate("/dashboard", { state: { user: decoded } })
            // Set current user

          } else {
            console.log("Invaid");
            showNotification(
              <span className='d-flex align-items-center'>
                <Icon icon='EmojiAngry' size='lg' className='me-1' />
                <span>Invalid Username/password</span>
              </span>,
              "Those credentials didn't worked. Please change the username/password and try again.", 'info'
            );
          }
        });








      // console.log("resl", props);

      // if (props.errors == null) {
      //   console.log("authenticated", props);
      //   navigate("/dashboard", {state: { user: props.auth.user }});
      // } else{

      //   showNotification(
      //     <span className='d-flex align-items-center'>
      //       <Icon icon='EmojiAngry' size='lg' className='me-1' />
      //       <span>Invalid Username/password</span>
      //     </span>,
      //     "Those credentials didn't worked. Please change the username/password and try again.",'info'
      //   );
      // }

    }

  });


  return (

    <PageWrapper
      title='Login'
      className={classNames('bg-danger')}>


      <Page className='p-0'>
        <div className='row h-100 align-items-center justify-content-center'>
          <div className='col-xl-4 col-lg-6 col-md-8 shadow-3d-container'>
            <Card className='shadow-3d-dark' data-tour='login-page' validate onSubmit={formik.handleSubmit} >
              <CardBody>
                <div className='text-center my-5'>
                  <Link
                    to='/'
                    className={classNames(
                      'text-decoration-none  fw-bold display-2 text-dark')}>
                    <img src={Logo} alt="logo" width={200} />

                  </Link>
                </div>

                <div className='text-center h1 fw-bold mt-5'>Welcome,</div>
                <div className='text-center h4 text-muted mb-5'>Sign in to continue!</div>

                <form className='row g-4'>

                  <div className='col-12'>

                    <FormGroup
                      id='username'
                      isFloating
                      label='Your email or username'>
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
                    <br />
                    <FormGroup
                      id='password'
                      isFloating
                      label='Password'>
                      <Input
                        type='password'
                        placeholder="johns"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.password}
                        isValid={formik.isValid}
                        isTouched={formik.touched.password}
                        invalidFeedback={formik.errors.password}
                        validFeedback='Looks good!'





                      />
                    </FormGroup>
                    <br />
                    <Button
                      type='submit' color='danger' icon='Login'
                      isDisable={!formik.isValid && !!formik.submitCount}
                      className='w-100 py-3'

                    >
                      Login
                    </Button>
                    <br />
                    <>
                      <div className='col-12 mt-3 text-center text-muted'>
                        OR
                      </div>
                      <div className='col-12 mt-3'>
                        <Link to="/forget-password">
                          <Button

                            color='info'
                            className={classNames('w-100 py-3')}
                            icon='LockFill'
                          >
                            Forget Password
                          </Button>
                        </Link>
                      </div>
                    </>


                  </div>

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


Login.propTypes = {
  loginUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(mapStateToProps, { loginUser })(Login);
