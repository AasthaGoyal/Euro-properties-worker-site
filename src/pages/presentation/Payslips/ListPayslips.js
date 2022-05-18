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

const ListPayslips = (props) => {
  const { themeStatus, darkModeStatus } = useDarkMode();

  const token = localStorage.getItem('jwtToken');

  const decoded = jwt_decode(token);
  const user = decoded;
  const [payslips, setPayslips] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [payslipsPerPage] = useState(20);

  React.useEffect(() => {
    axios.get(`${BASE_URL}/api/users`).then((res) => {
      let users = res.data;

      let filterEmployee = _.filter(users, ["_id", user.id]);
      console.log("Filter Employees:", filterEmployee);
      //setEmployee(filterEmployee);
      setLoading(true);
      axios.get(`${BASE_URL}/api/workerpayslips`).then((response) => {
        setLoading(false);
        let payslips = response.data;
        let filterPayslips = _.filter(payslips, [
          "employee",
          filterEmployee[0]._id,
        ]);
        console.log("filterPayslips:", filterPayslips);
        setPayslips(filterPayslips);
      });
    });
  }, [user.id]);


  let payslipTable;

  // Get current posts
  const indexOfLastPayslip = currentPage * payslipsPerPage;
  const indexOfFirstPayslip = indexOfLastPayslip - payslipsPerPage;
  const currentPayslips = payslips.slice(
    indexOfFirstPayslip,
    indexOfLastPayslip
  );

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  console.log("payslips:", currentPayslips);



  if (currentPayslips.length === 0) {
    payslipTable = (
      <tr>
        <td colSpan="7">No records</td>
      </tr>
    );
  } else {
    payslipTable = _.map(currentPayslips, (payslip) => {
      return (
        <tr key={payslip._id}>
          <td>{payslip.invoiceNumber}</td>
          <td>{payslip.payslipNumber}</td>
          <td>{payslip.payslipDate}</td>
          <td>{payslip.totalHoursWorked}</td>
          <td>{payslip.amountToPay}</td>
          <td>

            <Button
              isLink
              color={payslip.status == "Paid" ? "success" : "info"}
              icon='Circle'
              value={payslip.status}
              className='text-nowrap'>
              {payslip.status}
            </Button>

          </td>
          <td>
            <Link to={`/view-payslips/${payslip._id}`}>
              <Button
                isOutline={!darkModeStatus}
                color='dark'
                isLight={darkModeStatus}
                className={classNames('text-nowrap', {
                  'border-light': !darkModeStatus,
                })}
                icon='Eye'>
                View
              </Button>
            </Link>


          </td>
        </tr>
      );
    });
  }

  let payslipLoading;

  if (loading) {
    payslipLoading = (
      <tr>
        <td colSpan="7">
          <h3>Loading...</h3>
        </td>
      </tr>
    );
  } else {
    payslipLoading = payslipTable;
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
            <CardLabel icon='PiggyBank' >

              <CardTitle>My Payslips</CardTitle>

            </CardLabel>
            <CardActions>


            </CardActions>

          </CardHeader>


          <CardBody className='table-responsive' >


            <table className='table table-modern'>
              <thead>
                <tr>

                  <th>Invoice Number </th>
                  <th>Payslip Number </th>
                  <th>Payslip Date</th>
                  <th>Total Work Hours</th>
                  <th>Total Amount</th>

                  <th>Status</th>
                  <th>Action</th>


                </tr>
              </thead>
              <tbody>
                {payslipLoading}
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


ListPayslips.propTypes = {
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  //
  auth: state.auth,
});

export default connect(mapStateToProps)(ListPayslips);
