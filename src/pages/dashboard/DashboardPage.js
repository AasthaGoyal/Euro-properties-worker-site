import React, { useCallback, useEffect, useState } from 'react';

import { useNavigate, useLocation } from 'react-router-dom';
import axios from "axios";
import { BASE_URL } from "../../actions/actionConstant";
import classNames from 'classnames';
import { useTour } from '@reactour/tour';
import PageWrapper from '../../layout/PageWrapper/PageWrapper';
import Icon from '../../components/icon/Icon';
import { average, priceFormat } from '../../helpers/helpers';
import SubHeader, {
  SubHeaderLeft,
  SubHeaderRight,
  SubheaderSeparator,
} from '../../layout/SubHeader/SubHeader';
import Page from '../../layout/Page/Page';
import Button from '../../components/bootstrap/Button';
import Card, {
  CardActions,
  CardBody,
  CardHeader,
  CardLabel,
  CardSubTitle,
  CardTitle,
} from '../../components/bootstrap/Card';
import _ from "lodash";


// import UserContact from '../../components/UserContact';

import { demoPages } from '../../menu';
import useDarkMode from '../../hooks/useDarkMode';
import jwt_decode from 'jwt-decode';


// eslint-disable-next-line react/prop-types

// eslint-disable-next-line react/prop-types


const DashboardPage = () => {
  const location = useLocation();
  const token = localStorage.getItem('jwtToken');

  const decoded = jwt_decode(token);
  const user = decoded;
  const [employees, setEmployees] = useState([]);
  const [jobsites, setJobsites] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [grossEarning, setGrossEarning] = useState(0);
  const [profit, setProfit] = useState(0);
  const [hoursWorked, setHoursWorked] = useState();

  const [userjobsites, setUserJobsite] = useState(0);

  console.log("dashboard user", location.state);

  useEffect(() => {


    axios.get(`${BASE_URL}/api/jobsites`)
      .then((res) => {
        let userJobsites = 0;
        let allJobsites = res.data;

        allJobsites.map((jobsite) => {
          jobsite.workersList.map((worker) => {
            if (worker == user.id) {
              userJobsites = userJobsites + 1;
            }
          })
        });
        setUserJobsite(userJobsites);

        let grossEarning = _.sumBy(allJobsites, 'workBudget');
        setGrossEarning(grossEarning)

        axios.get(`${BASE_URL}/api/employeeTimesheetFinal`).then((res) => {
          let timesheet = res.data;
          let hoursWorked = _.sumBy(timesheet, 'totalWorkHours');
          setHoursWorked(hoursWorked);
          let workedPayment = _.sumBy(timesheet, 'totalWorkerAmount')

          allJobsites.map((job) => {
            job.workersList.map((worker) => {
              if (worker == user) {
                userJobsites = userJobsites + 1;
              }
            })
          })
        })
        setJobsites(userJobsites);




      });


    axios.get(`${BASE_URL}/api/workerinvoices`).then((res) => {
      let workerInvoices = res.data;

      let invoices = _.filter(workerInvoices, [
        "employee",
        user.id,
      ]);

      console.log("employee invoices", invoices, user.id);
      setInvoices(invoices);
    });




  }, []);



  const { darkModeStatus } = useDarkMode();

  const navigate = useNavigate();
  const jobsitePage = useCallback(
    () => navigate(`../${demoPages.ViewJobsites.path}`),
    [navigate],
  );

  const invoicePage = useCallback(
    () => navigate(`../${demoPages.ListInvoices.path}`),
    [navigate],
  );

  const payslipsPage = useCallback(
    () => navigate(`../${demoPages.ListPayslips.path}`),
    [navigate],
  );




  return (
    <PageWrapper title="Dashboard">
      <SubHeader>
        <SubHeaderLeft>
          <span className='h4 mb-0 fw-bold'>Dashboard</span>
          <SubheaderSeparator />

        </SubHeaderLeft>
        <SubHeaderRight>
          Your work summary
        </SubHeaderRight>
      </SubHeader>
      <Page container='fluid'>
        <div className='row'>
          {/* <div className='col-12'>
						<Alert
							icon='Verified'
							isLight
							color='primary'
							borderWidth={0}
							className='shadow-3d-primary'
							isDismissible>
							
							<span>Dashboard </span>
						</Alert>
					</div> */}

          {/* <div className='col-xl-4'>
						<UserContact
							name={`${USERS.SAM.name} ${USERS.SAM.surname}`}
							position='Team Lead'
							mail={`${USERS.SAM.username}@site.com`}
							phone='1234567'
							onChat={() =>
								navigate(`../${demoPages.chat.subMenu.withListChat.path}`)
							}
							src={USERS.SAM.src}
							srcSet={USERS.SAM.srcSet}
							color={USERS.SAM.color}
						/>
					</div> */}

          <div className='col-xl-4'>
            <Card className={classNames(
              'transition-base rounded-2 mb-0 text-dark',
              'bg-l25-primary bg-l10-primary-hover'
            )}
              shadow='sm'>
              <CardHeader className='bg-transparent'>
                <CardLabel icon='Building' iconColor='info'>
                  <CardTitle tag='h4' className='h5'>
                    Jobsites
                  </CardTitle>
                  <CardSubTitle tag='h5' className='h6 text-muted'>
                    Number of current active Jobsites
                  </CardSubTitle>
                </CardLabel>
                <CardActions>
                  <Button
                    icon='ArrowForwardIos'
                    aria-label='Read More'
                    hoverShadow='default'
                    color={darkModeStatus ? 'dark' : null}
                    onClick={jobsitePage}
                  />
                </CardActions>

              </CardHeader>
              <CardBody>
                <div className='d-flex align-items-center pb-3'>

                  <div className='flex-grow-1 ms-3'>
                    <div className='fw-bold fs-3 mb-0'>
                      {userjobsites}
                    </div>
                    <div
                      className={classNames({
                        'text-muted': !darkModeStatus,
                        'text-light': darkModeStatus,
                      })}>
                      total jobsites
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>

          <div className='col-xl-4'>
            <Card className={classNames(
              'transition-base rounded-2 mb-0 text-dark',
              'bg-l25-warning bg-l10-warning-hover'
            )}
              shadow='sm'>
              <CardHeader className='bg-transparent'>
                <CardLabel icon='PointOfSale' iconColor='warning'>
                  <CardTitle tag='h4' className='h5'>
                    Invoices
                  </CardTitle>
                  <CardSubTitle tag='h5' className='h6 text-muted'>
                    Number of current active Invoices
                  </CardSubTitle>
                </CardLabel>
                <CardActions>
                  <Button
                    icon='ArrowForwardIos'
                    aria-label='Read More'
                    hoverShadow='default'
                    color={darkModeStatus ? 'dark' : null}
                    onClick={invoicePage}
                  />
                </CardActions>

              </CardHeader>
              <CardBody>
                <div className='d-flex align-items-center pb-3'>

                  <div className='flex-grow-1 ms-3'>
                    <div className='fw-bold fs-3 mb-0'>
                      {invoices.length}
                    </div>
                    <div
                      className={classNames({
                        'text-muted': !darkModeStatus,
                        'text-light': darkModeStatus,
                      })}>
                      total invoices
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>



          <div className='col-xxl-4'>
            <Card className={classNames(
              'transition-base rounded-2 mb-0 text-dark',
              'bg-l25-success bg-l10-success-hover'
            )}
              stretch
              shadow='sm'>
              <CardHeader className='bg-transparent'>
                <CardLabel icon='Hourglass' iconColor='success'>
                  <CardTitle tag='h4' className='h5'>
                    Total work hours
                  </CardTitle>
                  <CardSubTitle>Work done until now </CardSubTitle>
                </CardLabel>
                <CardActions>
                  <Button
                    icon='ArrowForwardIos'
                    aria-label='Read More'
                    hoverShadow='default'
                    color={darkModeStatus ? 'dark' : null}
                    onClick={payslipsPage}
                  />
                </CardActions>
              </CardHeader>
              <CardBody>
                <div className='d-flex align-items-center pb-3'>
                  <div className='flex-shrink-0'>

                  </div>
                  <div className='flex-grow-1 ms-3'>
                    <div className='fw-bold fs-3 mb-0'>
                      {_.round(hoursWorked, 2)}

                    </div>
                    <div
                      className={classNames({
                        'text-muted': !darkModeStatus,
                        'text-light': darkModeStatus,
                      })}>
                      Total work done in hours
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>




        </div>
      </Page>
    </PageWrapper>
  );
};

export default DashboardPage;
