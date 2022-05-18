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
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas';




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

  const divToDisplay = document.getElementById('invoicepdf');

  // const styles = StyleSheet.create({
  //   page: {
  //     flexDirection: 'row',
  //     backgroundColor: '#E4E4E4'
  //   },
  //   section: {
  //     margin: 10,
  //     padding: 10,
  //     flexGrow: 1
  //   }
  // });

  const generatePdf = (e) => {
    e.preventDefault();
    console.log("reaching pdf");

    // ReactPDF.render(<MyDocument />, 'example.pdf');

    // html2canvas(divToDisplay)
    //   .then((canvas) => {
    //     console.log("reaching");
    //     const divImage = canvas.toDataURL("image/png");
    //     const pdf = new jsPDF();
    //     pdf.addImage(divImage, 'PNG', 0, 0);
    //     // pdf.output('dataurlnewwindow');
    //     pdf.save("download.pdf");
    //   }).catch(err => console.log(err));


  }



  return (
    <PageWrapper title="View Invoice">

      <Page container='fluid' size="A4" id="invoicepdf">

        <div className='row' >

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
                          Invoice# {invoiceNumber}
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
                <CardLabel icon='PointOfSale'>
                  <CardTitle>Tax Invoice
                    {"   "}
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
                    <p className='h4'>   {employeeName}
                    </p>




                  </div>
                  <div
                    className='col-md-6' >
                    Invoice No #
                    <p className='h4'>   {invoiceNumber}
                    </p>
                  </div>
                  <div
                    className='col-md-6' >
                    To
                    <p className='h4'>   {employerName}
                    </p>
                  </div>
                  <div
                    className='col-md-6' >
                    Date
                    <p className='h4'>   {invoiceDate}
                    </p>
                  </div>

                  <FormGroup
                    className='col-md-6'
                  >

                  </FormGroup>
                  <div
                    className='col-md-6'>
                    IRD Number
                    <p className='h4'>   {IRDNumber}
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
                    <p className='h4'>   {bankAccountNumber}
                    </p>
                  </div>



                </div>
              </CardBody>




              <CardFooter>
                <CardFooterRight>

                

                  <Button type='submit' color='info' icon='CloudDownload' onClick={generatePdf}  >
                    Export to PDF
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

ViewInvoices.propTypes = {
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  //
  auth: state.auth,
});

export default connect(mapStateToProps)(ViewInvoices);
