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



const ViewInvoices = (props) => {
  const { darkModeStatus } = useDarkMode();



  const [redirect, setRedirect] = useState(false);


  const token = localStorage.getItem('jwtToken');

  const decoded = jwt_decode(token);
  const user = decoded;
  const [invoiceNumber, setInvoiceNumber] = useState();
  const [invoiceDate, setInvoiceDate] = useState();
  const [employeeName, setEmployeeName] = useState();
  const [employerName, setEmployerName] = useState();
  const [startDate, setStartDate] = useState();
  const [EndDate, setEndDate] = useState();
  const [totalHoursWorked, setTotalHoursWorked] = useState();
  const [totalAmountExcludingGST, setTotalAmountExcludingGST] = useState();
  const [taxAmount, setTaxAmount] = useState();
  const [amountToPay, setAmountToPay] = useState();
  const [status, setStatus] = useState();
  const [IRDNumber, setIRDNumber] = useState();
  const [bankAccountNumber, setBankAccountNumber] = useState();
  const [ratePerHour, setRatePerHour] = useState();
  const navigate = useNavigate();
  const [modal, setModal] = useState(false);

  const { id } = useParams();
  console.log("Invoice id is", id);
  // const itemData = tableData.filter((item) => item.id.toString() === id.toString());
  // const data = itemData[0];

  const [resume, setResume] = useState();



  useEffect(() => {

    axios.get(`${BASE_URL}/api/users`).then((res) => {

      let filterEmployee = _.filter(res.data, ["_id", user.id]);
      console.log("Filter Employees:", filterEmployee);

      setRatePerHour(filterEmployee[0].ratePerHour);
      setBankAccountNumber(filterEmployee[0].bankAccountNumber);
      setIRDNumber(filterEmployee[0].IRDNumber);
    });

    axios
      .get(`${BASE_URL}/api/workerinvoices/${id}`)
      .then((res) => {
        console.log(res.data);
        let workerInvoice = res.data;

        setInvoiceNumber(workerInvoice.invoiceNumber);
        setInvoiceDate(workerInvoice.invoiceDate);
        setEmployeeName(workerInvoice.employeeName);
        setEmployerName(workerInvoice.employerName);
        setStartDate(workerInvoice.startDate);
        setEndDate(workerInvoice.EndDate);
        setTotalHoursWorked(workerInvoice.totalHoursWorked);
        setTotalAmountExcludingGST(workerInvoice.totalAmountExcludingGST);
        setTaxAmount(workerInvoice.taxAmount);
        setAmountToPay(workerInvoice.amountToPay);
        setStatus(workerInvoice.status);
      });
  }, [user.id]);





  const SplitTime = (numberOfHours) => {
    var Days = Math.floor(numberOfHours / 24);
    var Remainder = numberOfHours % 24;
    var Hours = Math.floor(Remainder);
    var Minutes = Math.floor(60 * (Remainder - Hours));
    return ({ "Days": Days, "Hours": Hours, "Minutes": Minutes })
  }

  let timeResult = SplitTime(totalHoursWorked)




  const openModal = () => {

    // setEmployeeInvoiceId(id)
    setModal(!modal);

  };

  const deleteInvoice = () => {
    console.log("Invoice to delete:", id);

    axios.delete(`${BASE_URL}/api/workerinvoices/${id}`).then((res) => {
      if (res.status == 200) {
        showNotification(
          <span className='d-flex align-items-center'>
            <Icon icon='EmojiSmile' size='lg' className='me-1' />
            <span>Deleted Successfully</span>
          </span>,
          "The Invoice has been deleted successfully.", 'warning'
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


  const exportPDF = () => {
    resume.save();
  }

  return (
    <PageWrapper title="View Invoice">
      <Modal isOpen={modal} toggle={openModal}>
        <ModalHeader toggle={openModal}>Delete Employee Invoice</ModalHeader>
        <ModalBody>Do you want to delete the employee Invoice?</ModalBody>
        <ModalFooter>
          <Button
            color="primary"
            className="btn-theme btn-sm"
            onClick={deleteInvoice}
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

      <Page container='fluid' size="A4" id="invoicepdf">
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
              <div>

              <Card className='shadow-3d-primary'  >
                <CardBody>
                  <div className='row g-5'>
                    <div className='col-12'>
                      <div className='d-flex align-items-center'>
                        <div className='flex-shrink-0'>

                        </div>
                        <div className='flex-grow-1 ms-3'>
                          <div className='h2 fw-bold'>
                            Invoice# {invoiceNumber}
                          </div>

                        </div>
                      </div>
                    </div>

                  </div>
                </CardBody>
              </Card>
              </div>
              <Card>
                <CardHeader>
                  <CardLabel icon='PointOfSale'>
                    <CardTitle>Tax Invoice

                      <Button size='sm' color={status == 'Pending' ? 'warning' : 'success'}> {status}</Button>


                    </CardTitle>
                    <CardSubTitle>  Invoice Generated between dates <b>{startDate}</b>  and <b>{EndDate}</b></CardSubTitle>
                  </CardLabel>
                </CardHeader>
                <CardBody>
                  <div className='row g-4'>


                    <div
                      className='col-md-6'

                    >
                      From Employee
                      <p className='h5'>   {employeeName}
                      </p>
                    </div>
                    <div
                      className='col-md-6' >
                      Invoice No #
                      <p className='h5'>   {invoiceNumber}
                      </p>
                    </div>
                    <div
                      className='col-md-6' >
                      To
                      <p className='h5'>   {employerName}
                      </p>
                    </div>
                    <div
                      className='col-md-6' >
                      Date
                      <p className='h5'>   {invoiceDate}
                      </p>
                    </div>

                    <FormGroup
                      className='col-md-6'>
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
                          <th>TOTAL AMOUNT</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>

                          <td><h6>{_.round(totalHoursWorked, 2)} hours ({`${timeResult.Days} Days ${timeResult.Hours} Hours and ${timeResult.Minutes} Mins.`})</h6></td>
                          <td><h6>${ratePerHour}/hr</h6></td>
                          <td><h6>${_.round(totalAmountExcludingGST, 2)}</h6></td>
                        </tr>
                        <tr>


                          <td colspan="2" ><h6>TOTAL AMOUNT EXCLUDING GST</h6></td>
                          <td ><h6>${_.round(totalAmountExcludingGST, 2)}</h6></td>
                        </tr>
                        <tr>

                          <td colspan="2"><h6>20% WITHOLDING TAX</h6></td>
                          <td ><h6>${_.round(taxAmount, 2)}</h6></td>
                        </tr>
                        <tr>

                          <td colspan="2" ><h6>AMOUNT DIRECT CREDITED/NET PAY</h6></td>
                          <td ><h6>${_.round(amountToPay, 2)}</h6></td>
                        </tr>
                      </tbody>
                    </table>
                    <div
                      className='col-md-8'>
                      Please direct debit the above payment to the following bank account:
                      <p className='h5'>   {bankAccountNumber}
                      </p>
                    </div>



                  </div>
                </CardBody>
              </Card>


            </div>

          </PDFExport>
          <Card>
            <CardFooter>
              <CardFooterRight>

                <Button type='submit' color='danger' icon='Delete' onClick={openModal}  >
                  Delete Invoice
                </Button>


                <Button type='submit' color='info' icon='CloudDownload' onClick={exportPDF}  >
                  Export to PDF
                </Button>

              </CardFooterRight>
            </CardFooter>
          </Card>




        </div >
      </Page>





    </PageWrapper >
  );
};

ViewInvoices.propTypes = {
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  //
  auth: state.auth,
});

export default connect(mapStateToProps)(ViewInvoices);
