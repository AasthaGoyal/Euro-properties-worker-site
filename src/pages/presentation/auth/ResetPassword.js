import React, { useCallback, Component, useState } from 'react';
import PropTypes from "prop-types";
import { useNavigate, useParams, Link } from 'react-router-dom';
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

const ResetPassword = () => {


  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const [isAuthenticated, setAuthenticated] = useState(false);
  const [users, setUsers] = useState([]);
  const [userId, setUserId] = useState();
  const { token } = useParams();
  const navigate = useNavigate();

  const validate = (values) => {
    const errors = {};

    if (!values.email) {
      errors.username = 'Required';
    }
    if (!values.password) {
      errors.password = 'Required';
    }


    if (!values.confirmPassword) {
      errors.confirmPassword = 'Required';
    }


    if (values.password != values.confirmPassword) {
      errors.confirmPassword = "The Password and Confirm Password doesn't match";
    }


    return errors;
  };


  React.useEffect(() => {
  
    axios
      .get(`${BASE_URL}/api/users/new_password/token/${token}`)
      .then((response) => {
        
        setUserId(response.data._id);


      });
  }, []);

  const formik = useFormik({

    initialValues: {
      email: '',
      password: '',
      confirmPassword: ''
    },
    validate,
    // eslint-disable-next-line no-unused-vars
    onSubmit: (values) => {

      const userData = {
        id: userId,
        password: values.password

      };

      axios.post(`${BASE_URL}/api/users/update_password`, userData)
        .then(res => {
          console.log(res.data);
          if (res.status == 200) {
            showNotification(
              <span className='d-flex align-items-center'>
                <Icon icon='EmojiSmile' size='lg' className='me-1' />
                <span>Password Updated Successfully</span>
              </span>,
              "The password has been successfully reset", "success"
            );

          } else {
            showNotification(
              <span className='d-flex align-items-center'>
                <Icon icon='EmojiAngry' size='lg' className='me-1' />
                <span>Some Error occured</span>
              </span>,
              "Some error occured in resetting the password, please try again!", "warning"
            );
          }

        });
    }
  });






  return (

    <PageWrapper
      title='Reset Password'
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

                <div className='text-center h1 fw-bold mt-5'>Reset Password</div>
                <div className='text-center h4 text-muted mb-5'>Enter your new password to reset !</div>

                <form className='row g-4'>

                  <div className='col-12'>


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

                    <br />
                    <FormGroup
                      isFloating
                      id='password'
                      label='New Password *'>
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
                    <br />
                    <FormGroup
                      isFloating
                      id='confirmPassword'
                      label='Confirm New Password *'>
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


ResetPassword.propTypes = {
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(mapStateToProps, {})(ResetPassword);
