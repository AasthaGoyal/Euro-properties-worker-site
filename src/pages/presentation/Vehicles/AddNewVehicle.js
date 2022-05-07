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
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const AddNewVehicle = () => {

  const [redirect, setRedirect] = useState(false);
  const [eventItem, setEventItem] = useState(null);
  const [registrationDate, setRegistrationDate] = useState();
  const [wofDate, setWofDate] = useState();
  const [servicingDate, setServicingDate] = useState();

  const validate = (values) => {
    const errors = {};


    if (!values.vehicleName) {
      errors.vehicleName = 'Required';
    }

    if (!values.vehicleNo) {
      errors.vehicleNo = 'Required';
    }

    return errors;
  };





  const formik = useFormik({
    initialValues: {
      vehicleName: '',
      vehicleNo: '',
      note: ''

    },
    validate,
    // eslint-disable-next-line no-unused-vars
    onSubmit: (values) => {
      console.log(values);

      const vehicleObject = {
        vehicleName: values.vehicleName,
        vehicleNo: values.vehicleNo,
        registrationDate: registrationDate,
        wofDate: wofDate,
        servicingDate: servicingDate,
        status: "Active",
        note: values.note
      };

      console.log("the vheicle being added is", vehicleObject);
      axios
      .post(`${BASE_URL}/api/vehicles/addvehicle`, vehicleObject)
      .then((res) => {
        if(res.status == 200)
        {
          showNotification(
            <span className='d-flex align-items-center'>
              <Icon icon='Info' size='lg' className='me-1' />
              <span>New Vehicle Added</span>
            </span>,
            "The new Vehicle has been successfully added.",
          );
        }
      });

    }

  });



  const colors = ['primary', 'secondary', 'success', 'info', 'warning', 'danger', 'dark'];



  return (
    <PageWrapper title="Add New Vehicle">
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
                          Add New Vehicle
                        </div>

                      </div>
                    </div>
                  </div>

                </div>
              </CardBody>
            </Card>



            <Card
              className='rounded-2'
              tag='form' validate onSubmit={formik.handleSubmit}

            >
              <CardHeader>
                <CardLabel icon='Truck'>
                  <CardTitle>Vehicle Information</CardTitle>
                </CardLabel>
              </CardHeader>
              <CardBody>
                <div className='row g-4'>


                  <FormGroup
                    className='col-lg-12'
                    id='vehicleName'
                    label='Vehicle Name (Make/Model) *'>
                    <Input
                      placeholder="Nissan March"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.vehicleName}
                      isValid={formik.isValid}
                      isTouched={formik.touched.vehicleName}
                      invalidFeedback={
                        formik.errors.vehicleName
                      }
                      validFeedback='Looks good!'
                    />
                  </FormGroup>

                  <FormGroup
                    className='col-md-6'
                    id='vehicleNo'
                    label='Plate Number *'>
                    <Input
                      placeholder="DRF456"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.vehicleNo}
                      isValid={formik.isValid}
                      isTouched={formik.touched.vehicleNo}
                      invalidFeedback={formik.errors.vehicleNo}
                      validFeedback='Looks good!'
                    />
                  </FormGroup>

                  <FormGroup
                    className='col-md-6'
                    id='registratinDate'
                    label='Registration Date *'>
                    <DatePicker
                      selected={registrationDate}
                      onChange={(date) => setRegistrationDate(date)}
                      className="form-control"
                
                      onBlur={formik.handleBlur}
                      value={formik.values.registrationdate}
                      isValid={formik.isValid}
                      isTouched={formik.touched.registrationdate}
                      invalidFeedback={
                        formik.errors.registrationdate
                      }
                      validFeedback='Looks good!'
                    />
                  </FormGroup>

                  <FormGroup
                    className='col-md-6'
                    id='wofDate'
                    label='WOF Date *'>

                    <DatePicker
                      selected={wofDate}
                      onChange={(date) => setWofDate(date)}
                      className="form-control"
                    
                      onBlur={formik.handleBlur}
                      value={formik.values.wofdate}
                      isValid={formik.isValid}
                      isTouched={formik.touched.wofdate}
                      invalidFeedback={
                        formik.errors.wofdate
                      }
                      validFeedback='Looks good!'
                    />
                  </FormGroup>


                  <FormGroup
                    className='col-md-6'
                    id='serviceDate'
                    label='Servicing Date'>
                    <DatePicker
                      selected={servicingDate}
                      onChange={(date) => setServicingDate(date)}
                      className="form-control"
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
                    Add Vehicle
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

export default AddNewVehicle;
