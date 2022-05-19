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
import PropTypes from "prop-types";
import { connect } from "react-redux";
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
import jwt_decode from 'jwt-decode';
import _ from "lodash";
import { PDFExport } from '@progress/kendo-react-pdf';




const ViewPayslips = (props) => {
  const { darkModeStatus } = useDarkMode();

  const [redirect, setRedirect] = useState(false);


  const token = localStorage.getItem('jwtToken');

  const decoded = jwt_decode(token);
  const user = decoded;
  const [invoiceNumber, setInvoiceNumber] = useState();
  const [payslipNumber, setPayslipNumber] = useState();
  const [payslipDate, setPayslipDate] = useState();
  const [employeeName, setEmployeeName] = useState();
  const [employerName, setEmployerName] = useState();

  const [totalHoursWorked, setTotalHoursWorked] = useState();

  const [amountToPay, setAmountToPay] = useState();
  const [status, setStatus] = useState();
  const [IRDNumber, setIRDNumber] = useState();

  const [ratePerHour, setRatePerHour] = useState();
  const navigate = useNavigate();
  const [modal, setModal] = useState(false);

  const { id } = useParams();
  console.log("Invoice id is", id);
  const [resume, setResume] = useState();
  // const itemData = tableData.filter((item) => item.id.toString() === id.toString());
  // const data = itemData[0];



  useEffect(() => {

    axios.get(`${BASE_URL}/api/users`).then((res) => {
      let users = res.data;

      let filterEmployee = _.filter(users, ["_id", user.id]);
      console.log("Filter Employees:", filterEmployee);

      setRatePerHour(filterEmployee[0].ratePerHour);

      setIRDNumber(filterEmployee[0].IRDNumber);
    });

    axios
      .get(`${BASE_URL}/api/workerpayslips/${id}`)
      .then((res) => {
        let workerPayslip = res.data;

        setInvoiceNumber(workerPayslip.invoiceNumber);
        setPayslipNumber(workerPayslip.payslipNumber);
        setPayslipDate(workerPayslip.payslipDate);
        setEmployeeName(workerPayslip.employeeName);
        setEmployerName(workerPayslip.employerName);
        setTotalHoursWorked(workerPayslip.totalHoursWorked);
        setAmountToPay(workerPayslip.amountToPay);
        setStatus(workerPayslip.status);
      });
  }, [user.id]);


  const openModal = () => {
    // setEmployeeInvoiceId(id)
    setModal(!modal);

  };

  const deletePayslip = () => {
    console.log("Payslip to delete:", id);

    axios.delete(`${BASE_URL}/api/workerpayslips/${id}`).then((res) => {
      if (res.status == 200) {
        showNotification(
          <span className='d-flex align-items-center'>
            <Icon icon='EmojiSmile' size='lg' className='me-1' />
            <span>Deleted Successfully</span>
          </span>,
          "The Payslip has been deleted successfully.", 'warning'
        );
        navigate(-1);

      }
      setModal(!modal);
    }).catch(err => {
      console.log(err);
      showNotification(
        <span className='d-flex align-items-center'>
          <Icon icon='EmojiAngry' size='lg' className='me-1' />
          <span>Some error occured</span>
        </span>,
        "Some error occured. Please check the details or try again later.", 'danger'
      );
    });


  };



  const SplitTime = (numberOfHours) => {
    var Days = Math.floor(numberOfHours / 24);
    var Remainder = numberOfHours % 24;
    var Hours = Math.floor(Remainder);
    var Minutes = Math.floor(60 * (Remainder - Hours));
    return ({ "Days": Days, "Hours": Hours, "Minutes": Minutes })
  }

  let timeResult = SplitTime(totalHoursWorked)


  const exportPDF = () => {
    resume.save();
  }

  return (
    <PageWrapper title="View Payslip">
      <Modal isOpen={modal} toggle={openModal}>
        <ModalHeader toggle={openModal}>Delete Employee Payslip</ModalHeader>
        <ModalBody>Do you want to delete the employee payslip?</ModalBody>
        <ModalFooter>
          <Button
            color="primary"
            className="btn-theme btn-sm"
            onClick={deletePayslip}
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

      <Page container='fluid' size="A4" >
        <div className='row' >
          <PDFExport paperSize={'A4'}
            fileName="download.pdf"
            title="title"
            subject="subject"
            keywords=""
            ref={(r) => setResume(r)}>

            <div style={{
              height: 792,
              width: 612,
              padding: 'none',
              backgroundColor: 'white',
              boxShadow: '5px 5px 5px black',
              margin: 'auto',
              overflowX: 'hidden',
              overflowY: 'hidden'
            }}>

              <Card className='shadow-3d-primary' >
                <CardBody>
                  <div className='row g-5'>
                    <div className='col-12'>
                      <div className='d-flex align-items-center'>
                        <div className='flex-shrink-0'>

                        </div>
                        <div className='flex-grow-1 ms-3'>
                          <div className='h2 fw-bold'>
                            Payslip# {payslipNumber}
                          </div>

                        </div>
                      </div>
                    </div>

                  </div>
                </CardBody>
              </Card>



              <Card
                className='rounded-2'
                tag='form'

              >
                <CardHeader>
                  <CardLabel icon='PiggyBankFill'>
                    <CardTitle>Payslip
                      {"   "}
                      <Button size='sm' color={status == 'Pending' ? 'warning' : 'success'}> {status}</Button>
                    </CardTitle>
                    <CardSubTitle>  Generated from Invoice Number - <b>{invoiceNumber} </b></CardSubTitle>
                  </CardLabel>
                </CardHeader>
                <CardBody>
                  <div className='row g-4'>


                    <div
                      className='col-md-6'

                    >
                      From Employer
                      <p className='h5'>   {employerName}
                      </p>




                    </div>
                    <div
                      className='col-md-6' >
                      Payslip No #
                      <p className='h5'>   {payslipNumber}
                      </p>
                    </div>
                    <div
                      className='col-md-6' >
                      To
                      <p className='h5'>   {employeeName}
                      </p>
                    </div>
                    <div
                      className='col-md-6' >
                      Date
                      <p className='h5'>   {payslipDate}
                      </p>
                    </div>

                    <FormGroup
                      className='col-md-6'
                    >

                    </FormGroup>
                    <div
                      className='col-md-6'>
                      IRD Number
                      <p className='h5'>   {IRDNumber}
                      </p>
                    </div>

                    <table className='table table-modern'>
                      <thead>
                        <tr>

                          <th>NO OF HOURS WORKED</th>
                          <th>RATE PER HOUR</th>
                          <th>AMOUNT DIRECT CREDITED/NET PAID</th>



                        </tr>
                      </thead>
                      <tbody>
                        <tr>

                          <td><h6>{_.round(totalHoursWorked, 2)} hours ({`${timeResult.Days} Days ${timeResult.Hours} Hours and ${timeResult.Minutes} Mins.`})</h6></td>
                          <td><h6>${ratePerHour}/hr</h6></td>
                          <td><h6>${_.round(amountToPay, 2)}</h6></td>
                        </tr>


                      </tbody>
                    </table>
                    <p className='h6'> Note : Please contact your admin if you have any queries. </p>



                  </div>
                </CardBody>
              </Card>

            </div>

          </PDFExport>
          <Card>


            <CardFooter>
              <CardFooterRight>

                <Button
                  icon='Delete'
                  color='danger'
                  isLight

                  onClick={openModal}>
                  Delete Payslip
                </Button>
                <Button type='submit' color='info' icon='CloudDownload' onClick={exportPDF}  >
                  Export to PDF
                </Button>

              </CardFooterRight>
            </CardFooter>

          </Card>
        </div>




      </Page>
    </PageWrapper >
  );
};

ViewPayslips.propTypes = {
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  //
  auth: state.auth,
});

export default connect(mapStateToProps)(ViewPayslips);
