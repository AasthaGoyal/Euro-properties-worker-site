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
import { FormatItalic } from '../../../components/icon/material-icons';
import { idea } from 'react-syntax-highlighter/dist/cjs/styles/hljs';



const ProductViewPage = () => {
  const { darkModeStatus } = useDarkMode();

  const [redirect, setRedirect] = useState(false);
  const [vehicleName, setVehicleName] = useState();
  const [vehicleNo, setVehicleNo] = useState();
  const [modal, setModal] = useState(false);
  const [registrationDate, setRegistrationDate] = useState();
  const [wofDate, setWofDate] = useState();
  const [servicingDate, setServicingDate] = useState();
  const [note, setNote] = useState();

  const [users, setUsers] = useState([]);
  const [workersList, setWorkersList] = useState([]);
  const [workersAssign, setWorkersAssign] = useState([]);
  const [workersId, setWorkersId] = useState([]);


  const { id } = useParams();
  console.log("task id is", id);



  const navigate = useNavigate();

  // const itemData = tableData.filter((item) => item.id.toString() === id.toString());
  // const data = itemData[0];

  const TABS = {
    ACCOUNT_DETAIL: 'Vehicle Details',
    ASSIGN: 'Assign Vehicle'
  };

  const [activeTab, setActiveTab] = useState(TABS.ACCOUNT_DETAIL);
  const [toggleInfoEventCanvas, setToggleInfoEventCanvas] = useState(false);
  const setInfoEvent = () => setToggleInfoEventCanvas(!toggleInfoEventCanvas);
  const [events, setEvents] = useState([]);


  const openModal = () => {
    // setUserId(id)
    setModal(!modal);

  };

  const onChangeVehicleName = (e) => {
    setVehicleName(e.target.value);
  };

  const onChangeVehicleNo = (e) => {
    setVehicleNo(e.target.value);
  };

  const onChangeNote = (e) => {
    setNote(e.target.value);
  }





  const onAssignClick = (e) => {
    e.preventDefault();

    console.log("workers assgned", workersAssign);
    const vehicleObject = {
      vehicleName,
      vehicleNo,
      registrationDate,
      wofDate,
      servicingDate,
      status: "Active",
      workersList: workersAssign
    };

    axios
      .put(`${BASE_URL}/api/vehicles/edit/${id}`, vehicleObject)
      .then((res) => {
        if (res.status == 200) {
          showNotification(
            <span className='d-flex align-items-center'>
              <Icon icon='Info' size='lg' className='me-1' />
              <span>Vehicle Assigned Successfully</span>
            </span>,
            "The Vehicle has been assigned successfully.",
          );
        }
      });
  }

  const onSubmit = (e) => {
    e.preventDefault();
    const vehicleObject = {
      vehicleName,
      vehicleNo,
      registrationDate,
      wofDate,
      servicingDate,
      status: "Active",
      workersList: workersAssign
    };

    axios
      .put(`${BASE_URL}/api/vehicles/edit/${id}`, vehicleObject)
      .then((res) => {
        if (res.status == 200) {
          showNotification(
            <span className='d-flex align-items-center'>
              <Icon icon='Info' size='lg' className='me-1' />
              <span>Vehicle Updated Successfully</span>
            </span>,
            "The Vehicle has been updated successfully.",
          );
        }
      });

  }

  useEffect(() => {

    axios.get(`${BASE_URL}/api/users`).then((res) => {
      setUsers(res.data);
    });

    axios
      .get(`${BASE_URL}/api/vehicles/${id}`)
      .then((response) => {

        console.log("Vehicle:", response.data)

        setRegistrationDate(new Date(response.data.registrationDate));
        setWofDate(new Date(response.data.wofDate));
        setServicingDate(new Date(response.data.servicingDate));
        setVehicleName(response.data.vehicleName);
        setVehicleNo(response.data.vehicleNo);
        setNote(response.data.note);
        setWorkersId(response.data.workersList);

      });
  }, []);

  const deleteVehicle = (id) => {
    console.log("Vehicle to delete:", id);

    axios.delete(`${BASE_URL}/api/vehicles/${id}`).then((response) => {
      axios.get(`${BASE_URL}/api/vehicles/`).then((response) => {
        console.log(response.data);

        let vehicles = response.data;
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

 

  let workers = [];
  _.map(users, (user) => {
    let userObject = _.filter(users, ["_id", user._id]);
    if (userObject.length === 0) {

    } else {
      workers.push(userObject[0].username);
    }
  });

  let finalusers = [];
 

  workersId && workersId.map((wrk) => {
    _.map(users, (user) => {
      if (user._id == wrk) {
        finalusers.push(user.username);
      }
    })
  });







  return (
    <PageWrapper title="Edit User">
      <Modal isOpen={modal} toggle={openModal}>
        <ModalHeader toggle={openModal}>Delete Vehicle</ModalHeader>
        <ModalBody>Do you want to delete the Vehicle?</ModalBody>
        <ModalFooter>
          <Button
            color="primary"
            className="btn-theme btn-sm"
            onClick={deleteVehicle}
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
            <strong>{vehicleName}</strong>
          </span>
          <span className='text-muted'>Edit Vehicle</span>
        </SubHeaderLeft>
        <SubHeaderRight>


          {TABS.ACCOUNT_DETAIL === activeTab && (
            <Button color='info' isOutline icon='Save' >
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
                <CardLabel icon='Truck' iconColor='info'>
                  <CardTitle>Vehicle Settings</CardTitle>
                  <CardSubTitle>Vehicle Information</CardSubTitle>
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
                      icon='Drive'
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
                      Delete Vehicle
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
                    <CardTitle>Vehicle Information</CardTitle>
                  </CardLabel>
                </CardHeader>
                <CardBody className='pb-0' isScrollable>
                  <div className='row g-4'>





                    <div className='col-lg-12'>
                      <FormGroup

                        id='vehicleName'
                        label='Vehicle Name (Make/Model) *'>
                        <Input
                          placeholder="Nissan March"
                          type="text"
                          name="vehicleName"
                          className="form-control"
                          onChange={onChangeVehicleName}

                          value={vehicleName}
                        />
                      </FormGroup>
                    </div>
                    <div className='col-md-6'>
                      <FormGroup

                        id='vehicleNo'
                        label='Plate Number *'>
                        <Input
                          placeholder="DRF456"
                          type="text"
                          name="vehicleNo"
                          className="form-control"
                          onChange={onChangeVehicleNo}

                          value={vehicleNo}
                        />
                      </FormGroup>
                    </div>
                    <div className='col-md-6'>

                      <FormGroup

                        id='registratinDate'
                        label='Registration Date *'>
                        <DatePicker
                          selected={registrationDate}
                          onChange={(date) => setRegistrationDate(date)}
                          className="form-control"

                        />
                      </FormGroup>

                    </div>
                    <div className='col-md-6'>

                      <FormGroup

                        id='wofDate'
                        label='WOF Date *'>

                        <DatePicker
                          selected={wofDate}
                          onChange={(date) => setWofDate(date)}
                          className="form-control"


                        />
                      </FormGroup>

                    </div>

                    <div className='col-md-6'>

                      <FormGroup

                        id='serviceDate'
                        label='Servicing Date'>
                        <DatePicker
                          selected={servicingDate}
                          onChange={(date) => setServicingDate(date)}
                          className="form-control"
                        />
                      </FormGroup>

                    </div>
                    <div className='col-lg-12'>
                      <FormGroup
                        className='col-lg-12'
                        id='note'
                        label='Notes'>
                        <Input

                          type="text"
                          name="note"
                          className="form-control"
                          onChange={onChangeNote}

                          value={note}

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
                      onClick={onSubmit}
                    >
                      Submit
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
                  <CardLabel icon='Drive' iconColor='warning'>
                    <CardTitle>{TABS.ASSIGN}</CardTitle>
                  </CardLabel>
                </CardHeader>
                <CardBody className='pb-0' isScrollable>

                  <div className='row g-4'>
                    <div className='col-lg-12'>

                      <FormGroup label='Worker(s) *'>
                        <Input

                          value={finalusers}

                        />
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
                      onClick={onAssignClick}
                    >
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
