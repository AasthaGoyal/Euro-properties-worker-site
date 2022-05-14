import React, { useState } from 'react';
import classNames from 'classnames';
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Button from '../../../components/bootstrap/Button';
import PageWrapper from '../../../layout/PageWrapper/PageWrapper';
import Page from '../../../layout/Page/Page';
import Card, {
  CardActions,
  CardBody,
  CardFooter,
  CardHeader,
  CardLabel,
  CardTitle,
} from '../../../components/bootstrap/Card';
import Dropdown, {
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
} from '../../../components/bootstrap/Dropdown';
import Icon from '../../../components/icon/Icon';
import SubHeader, {
  SubHeaderLeft,
  SubHeaderRight,
  SubheaderSeparator,
} from '../../../layout/SubHeader/SubHeader';
import { Link } from 'react-router-dom';

import { demoPages } from '../../../menu';
import _ from "lodash";
import axios from "axios";
import { BASE_URL } from "../../../actions/actionConstant";
import PaginationButtons, { dataPagination, PER_COUNT } from '../../../components/PaginationButtons';
import useDarkMode from '../../../hooks/useDarkMode';
import EVENT_TASK from '../../common/data/enumEventTasks';
import Input from '../../../components/bootstrap/forms/Input';
import { useFormik } from 'formik';
import FormGroup from '../../../components/bootstrap/forms/FormGroup';
import Label from '../../../components/bootstrap/forms/Label';
import Select from '../../../components/bootstrap/forms/Select';
import CommonFilterTag from '../../common/CommonFilterTag';
import Moment from "react-moment";
import showNotification from '../../../components/extras/showNotification';
import jwt_decode from 'jwt-decode';

const ListInvoices = (props) => {
  const { themeStatus, darkModeStatus } = useDarkMode();

  const token = localStorage.getItem('jwtToken');

  const decoded = jwt_decode(token);
  const user = decoded;
  const [employeeId, setEmployeeId] = useState();
  const [ratePerHour, setRatePerHour] = useState();
  const [employeeName, setEmployeeName] = useState();
  const [employerName] = useState(
    "EURO QUALITY PAINTERS LIMITED"
  );
  const [startDate] = useState(new Date());
  const [endDate] = useState(new Date());
  const [invoices, setInvoices] = useState([]);
  const [loading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [invoicesPerPage] = useState(20);
  //const [invoicesList, setInvoicesList] = useState([]);
  const [modal, setModal] = useState(false);
  const [invoiceId, setInvoiceId] = useState();

  React.useEffect(() => {
    let employeeName = `${user.firstName} ${user.lastName}`;
    setEmployeeName(employeeName);

    axios.get(`${BASE_URL}/api/users`).then((res) => {


      let filterEmployee = _.filter(res.data, ["_id", user.id]);
      console.log("Filter Employees:", filterEmployee);
      setEmployeeId(filterEmployee[0]._id);
      setRatePerHour(filterEmployee[0].ratePerHour);

      axios.get(`${BASE_URL}/api/workerinvoices`).then((res) => {
        let workerInvoices = res.data;

        let invoices = _.filter(workerInvoices, [
          "employee",
          filterEmployee[0]._id,
        ]);

        console.log("invoices are", invoices);
        setInvoices(invoices);
      });
    });
  }, [user.id, user.firstName, user.lastName]);

  const openModal = (id) => {
    // setJobsiteId(id)
    setModal(!modal);
    setInvoiceId(id);
    console.log("Invoice:", id);
  };


  // // const { themeStatus, darkModeStatus } = useDarkMode();
  // const [currentPage, setCurrentPage] = useState(1);


  // const { users, requestSort, getClassNamesFor } = useSortableData(userdata);

  // console.log("sorted users", users);
  // const { jsonUsers } = JSON.stringify(users);
  let invoiceTable;

  // Get current posts
  const indexOfLastInvoice = currentPage * invoicesPerPage;
  const indexOfFirstInvoice = indexOfLastInvoice - invoicesPerPage;
  const currentInvoices = invoices.slice(
    indexOfFirstInvoice,
    indexOfLastInvoice
  );

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const changeStatus = (id, value) => {
    console.log("change status", id, value);
    // _.map(vehicles, (vehicle) => {
    //   if (vehicle._id == id) {
    //     const vehicleObject = {
    //       vehicleName: vehicle.vehicleName,
    //       vehicleNo: vehicle.vehicleNo,
    //       registrationDate: vehicle.registrationDate,
    //       wofDate: vehicle.wofDate,
    //       servicingDate: vehicle.servicingDate,
    //       status: value,
    //       workersList: vehicle.workersList
    //     };

    //     axios
    //       .put(`${BASE_URL}/api/vehicles/edit/${id}`, vehicleObject)
    //       .then((res) => {
    //         if (res.status == 200) {
    //           showNotification(
    //             <span className='d-flex align-items-center'>
    //               <Icon icon='Info' size='lg' className='me-1' />
    //               <span>Vehicle's status has been Updated Successfully</span>
    //             </span>,
    //             "The Vehicle's status has been updated successfully.",
    //           );
    //         }
    //       });

    //       window.location.reload();
    //       showNotification(
    //         <span className='d-flex align-items-center'>
    //           <Icon icon='Info' size='lg' className='me-1' />
    //           <span>Vehicle's status has been  Updated Successfully</span>
    //         </span>,
    //         "The Vehicle's status has been updated successfully.",
    //       );
    //   }
    // })


  }

  if (currentInvoices.length === 0) {
    invoiceTable = (
      <tr>
        <td colSpan="8">No records</td>
      </tr>
    );
  } else {
    invoiceTable = _.map(currentInvoices, (invoice) => {
      let status;

      if (invoice.length === 0) {
        return (
          <tr>
            <td colSpan="8">No records</td>
          </tr>
        );
      } else {

        return (
          <tr key={invoice._id}>

            <td>{invoice.invoiceNumber}</td>
            <td>{invoice.invoiceDate}</td>
            <td>{invoice.startDate}</td>
            <td>{invoice.EndDate}</td>
            <td>{_.round(invoice.totalHoursWorked, 2)}</td>
            <td>$ {_.round(invoice.amountToPay, 2)}</td>

            <td>
              <Dropdown>
                <DropdownToggle hasIcon={false}>
                  <Button
                    isLink
                    color={invoice.status == "Paid" ? "success" : "info"}
                    icon='Circle'
                    value={invoice.status}
                    className='text-nowrap' onChange={changeStatus}>
                    {invoice.status}
                  </Button>
                </DropdownToggle>
                <DropdownMenu>
                  <DropdownItem key='paid' value='paid'  >
                    <Button
                      isLink
                      color='success'
                      icon='Circle'
                      value='paid'
                      onClick={changeStatus.bind(this, invoice._id, "Paid")}
                      className='text-nowrap'>
                      Paid
                    </Button>
                  </DropdownItem>
                  <DropdownItem key='pending' value='pending'  >
                    <Button
                      isLink
                      color='info'
                      icon='Circle'
                      value='pending'
                      onClick={changeStatus.bind(this, invoice._id, "Pending")}
                      className='text-nowrap'>
                      Pending
                    </Button>
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </td>
            <td>
              {/* <Link to={`/vehicle-pages/editVehicle/${invoice._id}`}> */}
              <Button
                isOutline={!darkModeStatus}
                color='dark'
                isLight={darkModeStatus}
                className={classNames('text-nowrap', {
                  'border-light': !darkModeStatus,
                })}
                icon='Edit'>
                Edit
              </Button>
              {/* </Link> */}


            </td>

          </tr>
        );
      }
    });
  }

  let invoiceLoading;

  if (loading) {
    invoiceLoading = (
      <tr>
        <td colSpan="8">
          <h3>Loading...</h3>
        </td>
      </tr>
    );
  } else {
    invoiceLoading = invoiceTable;
  }



  return (
    <PageWrapper title="Jobsites">
      <SubHeader>
        <SubHeaderLeft>

        </SubHeaderLeft>
        <SubHeaderRight>



        </SubHeaderRight>
      </SubHeader>


      <Page container='fluid'>
        <Card >
          <CardHeader borderSize={1}>
            <CardLabel icon='PointOfSale' >

              <CardTitle>Invoices</CardTitle>

            </CardLabel>
            <CardActions>


            </CardActions>

          </CardHeader>


          <CardBody className='table-responsive' >


            <table className='table table-modern'>
              <thead>
                <tr>

                  <th>Invoice#</th>
                  <th>Invoice Date</th>
                  <th>From Date</th>
                  <th>To Date</th>
                  <th>Total Work Hours</th>
                  <th>Amount To Pay (Ex. 20% Tax)</th>

                  <th>Status</th>
                  <th>Action</th>


                </tr>
              </thead>
              <tbody>
                {invoiceLoading}
                {/* {filteredData.map((i) => (
									<CommonTableRow
										key={i.id}
										// eslint-disable-next-line react/jsx-props-no-spreading
										{...i}
										selectName='selectedList'
										selectOnChange={selectTable.handleChange}
										selectChecked={selectTable.values.selectedList.includes(
											i.id.toString(),
										)}
									/>
								))} */}
              </tbody>
            </table>
          </CardBody>
          {/* <PaginationButtons
            data={tasks}
            label='items'
            setCurrentPage={setCurrentPage}
            currentPage={currentPage}
            perPage={perPage}
            setPerPage={setPerPage}
          /> */}
        </Card>


      </Page>
    </PageWrapper>
  );
};


ListInvoices.propTypes = {
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  //
  auth: state.auth,
});

export default connect(mapStateToProps)(ListInvoices);
