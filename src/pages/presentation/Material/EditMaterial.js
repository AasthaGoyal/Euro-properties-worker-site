import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { setNestedObjectValues, useFormik } from 'formik';
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
  const [jobsitesmaterialpurchases, setJobsitesmaterialpurchases] = useState(
    []
  );
  const [jobsites, setJobsites] = useState([]);
  const [jobsite, setJobsite] = useState();
  const [modal, setModal] = useState(false);
  const [jobsitesmaterialpurchaseId, setJobsitesmaterialpurchaseId] =
    useState("");
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [jobsitesmaterialpurchasesPerPage] = useState(10);
  const [jobsiteList, setJobsitesList] = useState([]);
  const [filteredJobsite, setFilteredValue] = useState("All");
  const [workersAssign, setWorkersAssign] = useState([]);
  const [users, setUsers] = useState([]);
  const [workersList, setWorkersList] = useState([]);
  const [jobsiteName, setJobsiteName] = useState();
  const [materialName, setMaterialName] = useState();
  const [totalCost, setTotalCost] = useState();
  const [quantity, setQauntity] = useState();
  const [note, setNote] = useState();
  const [jobsiteId, setJobsiteId] = useState();



  const { id } = useParams();




  const navigate = useNavigate();

  // const itemData = tableData.filter((item) => item.id.toString() === id.toString());
  // const data = itemData[0];

  const TABS = {
    JOBSITE: 'Material Details'
  };

  const [activeTab, setActiveTab] = useState(TABS.JOBSITE);
  const [toggleInfoEventCanvas, setToggleInfoEventCanvas] = useState(false);
  const setInfoEvent = () => setToggleInfoEventCanvas(!toggleInfoEventCanvas);
  const [events, setEvents] = useState([]);




  const onChangeMaterialName = (e) => {
    setMaterialName(e.target.value);
  };

  const onChangeTotalCost = (e) => {
    setTotalCost(e.target.value);
  };

  const onChangeQuantity = (e) => {
    setQauntity(e.target.value);
  };

  const onChangeNote = (e) => {
    setNote(e.target.value);
  }




  useEffect(() => {

    axios.get(`${BASE_URL}/api/jobsites`).then((res) => {
      console.log("jobsites", res.data);

      setJobsites(res.data);
    });

    axios.get(`${BASE_URL}/api/jobsitesmaterialpurchases/${id}`).then((res) => {
      console.log("the data is", res.data);
      
      setMaterialName(res.data.materialName);
      setTotalCost(res.data.totalCost);
      setQauntity(res.data.quantity);
      setNote(res.data.note);

      setJobsiteId(res.data.jobsite);

    });



  }, []);


  let jobs = [];

  _.map(jobsites, (job) => {
    jobs.push(job.address);
  
  });

  let finalJobsite = '';

  _.map(jobsites, (job) => {
    if (job._id == jobsiteId) {
      console.log(job.address);
      finalJobsite = job.address;
    }
  });



  const openModal = (id) => {
    // setJobsiteId(id)
    setModal(!modal);
    setJobsitesmaterialpurchaseId(id);
    console.log("Jobsitesmaterialpurchase:", id);
  };


  const deleteMaterial = () => {
    console.log("material to delete:", id);

    axios
      .delete(`${BASE_URL}/api/jobsitesmaterialpurchases/${id}`)
      .then((response) => {
        if (response.status == 200) {
          showNotification(
            <span className='d-flex align-items-center'>
              <Icon icon='Info' size='lg' className='me-1' />
              <span>Material Deleted Successfully</span>
            </span>,
            "The Material has been deleted successfully.",
          );
        }

        setModal(!modal);
      });

    //setSucess(true);
    setTimeout(() => {
      // setSucess(false);s
    }, 3000);
  };

  const onEditSubmit = (e) => {
    e.preventDefault();


    const materialObject = {
      jobsite,
      materialName,
      totalCost,
      quantity,
      note


    };

    console.log("materialObject:", materialObject);

    axios.put(`${BASE_URL}/api/jobsitesmaterialpurchases/edit/${id}`, materialObject).then((res) => {
      console.log("Updated Material:", res.data);
      if(res.status == 200)
      {
        showNotification(
          <span className='d-flex align-items-center'>
            <Icon icon='Info' size='lg' className='me-1' />
            <span>Material Updated Successfully</span>
          </span>,
          "The Material has been updated successfully.",
        );
      }
    });

  };

  return (
    <PageWrapper title="Edit Jobsites">


      <Modal isOpen={modal} toggle={openModal}>
        <ModalHeader toggle={openModal}>Delete Material</ModalHeader>
        <ModalBody>Do you want to delete the Material?</ModalBody>
        <ModalFooter>
          <Button
            color="primary"
            className="btn-theme btn-sm"
            onClick={deleteMaterial}
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
            <strong>{materialName} </strong>
          </span>
          <span className='text-muted'>Edit Materials</span>
        </SubHeaderLeft>
        <SubHeaderRight>



          {TABS.JOBSITE === activeTab && (
            <Button
              color='info'
              isOutline
              icon='Save'
            >
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
                <CardLabel icon='Palette' iconColor='info'>
                  <CardTitle>Material Settings</CardTitle>
                  <CardSubTitle>Jobsite's Materials Information</CardSubTitle>
                </CardLabel>
              </CardHeader>
              <CardBody isScrollable>
                <div className='row g-3'>

                  <div className='col-12'>
                    <Button
                      icon='Brush'
                      color='warning'
                      className='w-100 p-3'
                      isLight={TABS.JOBSITE !== activeTab}
                      onClick={() => setActiveTab(TABS.JOBSITE)}>
                      {TABS.JOBSITE}

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

            {TABS.JOBSITE === activeTab && (
              <Card
                stretch
                tag='form'
                noValidate
              >
                <CardHeader>
                  <CardLabel icon='Brush' iconColor='warning'>
                    <CardTitle>{TABS.JOBSITE}</CardTitle>
                  </CardLabel>
                </CardHeader>
                <CardBody className='pb-0' isScrollable>
                  <div className='row g-4'>
                    <div className='col-lg-12'><FormGroup
                      className='col-lg-12'
                      id='jobsitename'
                      label='Jobsite Address *'>
                      <Input
                        type="text"
                        className="form-control"
                        value={finalJobsite}
                      />
                    </FormGroup>
                      <br />
                      <Picky
                        id="picky1"
                        options={jobs}
                        value={jobsiteName}
                        multiple={false}
                        includeSelectAll={true}
                        includeFilter={true}
                        onChange={(jobsite) => {
                          setJobsiteName(jobsite)

                          let selectedJobsite = _.filter(jobsites, ['address', jobsite])

                          console.log("selectedJobsite:", selectedJobsite);

                          setJobsite(selectedJobsite[0]._id);

                        }}
                        dropdownHeight={600}
                      /></div>

                    <div className='col-lg-12'>
                      <FormGroup
                        id='materialName'
                        label='Material Name'
                        isFloating>
                        <Input
                          placeholder="Paints"
                          type="text"
                          name="materialName"
                          className="form-control"
                          onChange={onChangeMaterialName}
                          value={materialName}


                        />
                      </FormGroup>
                    </div>

                    <div className='col-md-6'>
                      <FormGroup
                        id='itemQuantity'
                        label='Item Quantity'
                        isFloating>
                        <Input
                          type="text"
                          name="quantity"
                          className="form-control"
                          onChange={onChangeQuantity}
                          placeholder="2"
                          value={quantity}
                        />
                      </FormGroup>
                    </div>
                    <div className='col-md-6'>
                      <FormGroup
                        id='totalCost'
                        label='Total Cost'
                        isFloating>
                        <Input
                          type="text"
                          name="totalCost"
                          className="form-control"
                          onChange={onChangeTotalCost}
                          placeholder="Total Cost"
                          value={totalCost}
                        />
                      </FormGroup>
                    </div>
                    <div className='col-lg-12'>
                      <FormGroup
                        id='note'
                        label='Notes'
                        isFloating>
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
                  <CardFooterLeft>

                  </CardFooterLeft>
                  <CardFooterRight>
                    <Button
                      type='submit'
                      icon='Save'
                      color='info'
                      isOutline
                      onClick={onEditSubmit} >
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
