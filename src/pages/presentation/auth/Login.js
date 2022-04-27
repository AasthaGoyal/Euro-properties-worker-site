import React, {Component} from 'react';
import PropTypes from "prop-types";
import { Link } from 'react-router-dom';
import { connect } from "react-redux";
import classNames from 'classnames';
import PageWrapper from '../../../layout/PageWrapper/PageWrapper';
import Page from '../../../layout/Page/Page';
import Card, { CardBody } from '../../../components/bootstrap/Card';
import FormGroup from '../../../components/bootstrap/forms/FormGroup';
import Input from '../../../components/bootstrap/forms/Input';
import Button from '../../../components/bootstrap/Button';
import Logo from '../../../components/images/euro.jpg';
import { loginUser } from "./actions/authActions";


class Login extends Component {
  constructor() {
    super();
    this.state = {
      username: "",
      password: "",
      errors: {}
    };

    //this.onChange = this.onChange.bind(this);
    //this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    console.log(this.props);
    if (this.props.auth.isAuthenticated) {
      console.log("User is authenticated");
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.auth.isAuthenticated) {
      console.log("User is authenticated");
    }

    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }
  }

  onSubmit = (e) => {
    e.preventDefault();

    const userData = {
      username: this.state.username,
      password: this.state.password,
    };
    console.log("user data is ", userData);

    this.props.loginUser(userData);
  };

  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  render() {



    return (

      <PageWrapper
        title='Login'
        className={classNames('bg-danger')}>
        <Page className='p-0'>
          <div className='row h-100 align-items-center justify-content-center'>
            <div className='col-xl-4 col-lg-6 col-md-8 shadow-3d-container'>
              <Card className='shadow-3d-dark' data-tour='login-page'>
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
                        id='login-username'
                        isFloating
                        label='Your email or username'>
                        <Input placeholder="Username"
                          name="username"
                          type="text"
                          value={this.state.username}
                          onChange={this.onChange} />
                      </FormGroup>
                      <br />
                      <FormGroup
                        id='login-password'
                        isFloating
                        label='Password'>
                        <Input
                          placeholder="Password"
                          name="password"
                          type="password"
                          value={this.state.password}
                          onChange={this.onChange}

                        />
                      </FormGroup>
                      <br />
                      <Button
                        color='danger'
                        className='w-100 py-3' onClick={this.onSubmit}
                      >
                        Login
                      </Button>
                      <br/>
                      <>
											<div className='col-12 mt-3 text-center text-muted'>
												OR
											</div>
											<div className='col-12 mt-3'>
												<Button
													
													color='info'
													className={classNames('w-100 py-3')}
													icon='LockFill'
											>
													Forget Password
												</Button>
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

    );
  }
}


Login.propTypes = {
  loginUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(mapStateToProps, { loginUser })(Login);
