import React, { useCallback, useEffect, useState } from 'react';

import { useNavigate } from 'react-router-dom';
import classNames from 'classnames';
import { useTour } from '@reactour/tour';
import PageWrapper from '../../layout/PageWrapper/PageWrapper';
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


// import UserContact from '../../components/UserContact';

import { demoPages } from '../../menu';
import useDarkMode from '../../hooks/useDarkMode';


// eslint-disable-next-line react/prop-types

// eslint-disable-next-line react/prop-types


const DashboardPage = () => {
  /**
   * Tour Start
   */
  const { setIsOpen } = useTour();
  useEffect(() => {
    if (localStorage.getItem('tourModalStarted') !== 'shown') {
      setTimeout(() => {
        setIsOpen(true);
        localStorage.setItem('tourModalStarted', 'shown');
      }, 3000);
    }
    return () => { };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { darkModeStatus } = useDarkMode();

  const navigate = useNavigate();
  const handleOnClickToEmployeeListPage = useCallback(
    () => navigate(`../${demoPages.appointment.subMenu.employeeList.path}`),
    [navigate],
  );

  const TABS = {
    WEEKLY: 'Weekly',
    MONTHLY: 'Monthly',
    YEARLY: 'Yearly',
  };
  const [activeTab] = useState(TABS.YEARLY);

  const [sales, setSales] = useState({
    series: [
      {
        data: [34, 32, 36, 34, 34],
      },
    ],
    options: {
      colors: [process.env.REACT_APP_WARNING_COLOR],
      chart: {
        type: 'line',
        width: '100%',
        height: 150,
        sparkline: {
          enabled: true,
        },
      },
      tooltip: {
        theme: 'dark',
        fixed: {
          enabled: false,
        },
        x: {
          show: false,
        },
        y: {
          title: {
            // eslint-disable-next-line no-unused-vars
            formatter(seriesName) {
              return '';
            },
          },
        },
      },
      stroke: {
        curve: 'smooth',
        width: 2,
      },
    },
    sales: {
      compare: 24,
    },
    campaigns: {
      price: 3265.72,
      compare: 5000,
    },
    coupons: {
      price: 2654.2,
      compare: 2300,
    },
  });
  useEffect(() => {
    if (activeTab === TABS.YEARLY) {
      setSales({
        series: [
          {
            data: [34, 32, 36, 34, 34],
          },
        ],
        sales: {
          compare: 24,
        },
        campaigns: {
          price: 3265.72,
          compare: 5000,
        },
        coupons: {
          price: 2654.2,
          compare: 2300,
        },
        options: sales.options,
      });
    }
    if (activeTab === TABS.MONTHLY) {
      setSales({
        series: [
          {
            data: [32, 35, 40, 30, 32],
          },
        ],
        sales: {
          compare: 27,
        },
        campaigns: {
          price: 450,
          compare: 480,
        },
        coupons: {
          price: 98,
          compare: 120,
        },
        options: sales.options,
      });
    }
    if (activeTab === TABS.WEEKLY) {
      setSales({
        series: [
          {
            data: [28, 32, 30, 29, 30],
          },
        ],
        sales: {
          compare: 12,
        },
        campaigns: {
          price: 94,
          compare: 80,
        },
        coupons: {
          price: 80,
          compare: 45,
        },
        options: sales.options,
      });
    }
    return () => { };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);





  return (
    <PageWrapper title={demoPages.sales.subMenu.dashboard.text}>
      <SubHeader>
        <SubHeaderLeft>
          <span className='h4 mb-0 fw-bold'>Dashboard</span>
          <SubheaderSeparator />

        </SubHeaderLeft>
        <SubHeaderRight>
          something can be added
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
              'transition-base rounded-2 mb-4 text-dark',
              'bg-l25-secondary bg-l10-secondary-hover'
            )}
              shadow='sm'>
              <CardHeader className='bg-transparent'>
                <CardLabel>
                  <CardTitle tag='h4' className='h5'>
                    Employees
                  </CardTitle>
                  <CardSubTitle tag='h5' className='h6 text-muted'>
                    Number of current employees
                  </CardSubTitle>
                </CardLabel>
                <CardActions>
                  <Button
                    icon='ArrowForwardIos'
                    aria-label='Read More'
                    hoverShadow='default'
                    color={darkModeStatus ? 'dark' : null}
                    onClick={handleOnClickToEmployeeListPage}
                  />
                </CardActions>
              </CardHeader>
              <CardBody>
                23 (temp)
                {/* <AvatarGroup>
									<Avatar
										srcSet={USERS.GRACE.srcSet}
										src={USERS.GRACE.src}
										userName={`${USERS.GRACE.name} ${USERS.GRACE.surname}`}
										color={USERS.GRACE.color}
									/>
									<Avatar
										srcSet={USERS.SAM.srcSet}
										src={USERS.SAM.src}
										userName={`${USERS.SAM.name} ${USERS.SAM.surname}`}
										color={USERS.SAM.color}
									/>
									<Avatar
										srcSet={USERS.CHLOE.srcSet}
										src={USERS.CHLOE.src}
										userName={`${USERS.CHLOE.name} ${USERS.CHLOE.surname}`}
										color={USERS.CHLOE.color}
									/>

									<Avatar
										srcSet={USERS.JANE.srcSet}
										src={USERS.JANE.src}
										userName={`${USERS.JANE.name} ${USERS.JANE.surname}`}
										color={USERS.JANE.color}
									/>
									<Avatar
										srcSet={USERS.JOHN.srcSet}
										src={USERS.JOHN.src}
										userName={`${USERS.JOHN.name} ${USERS.JOHN.surname}`}
										color={USERS.JOHN.color}
									/>
									<Avatar
										srcSet={USERS.RYAN.srcSet}
										src={USERS.RYAN.src}
										userName={`${USERS.RYAN.name} ${USERS.RYAN.surname}`}
										color={USERS.RYAN.color}
									/>
								</AvatarGroup> */}
              </CardBody>
            </Card>
          </div>
          <div className='col-xl-4'>
            <Card className={classNames(
              'transition-base rounded-2 mb-0 text-dark',
              'bg-l25-primary bg-l10-primary-hover'
            )}
              shadow='sm'>
              <CardHeader className='bg-transparent'>
                <CardLabel>
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
                    onClick={handleOnClickToEmployeeListPage}
                  />
                </CardActions>
              </CardHeader>
              <CardBody>
                34(temp)
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
                <CardLabel icon='PointOfSale' iconColor='success'>
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
                    onClick={handleOnClickToEmployeeListPage}
                  />
                </CardActions>
              </CardHeader>
              <CardBody>
                34(temp)
              </CardBody>
            </Card>
          </div>

          <div className='col-xxl-4'>
            <Card className={classNames(
              'transition-base rounded-2 mb-0 text-dark',
              'bg-l25-info bg-l10-info-hover'
            )}
              stretch
              shadow='sm'>
              <CardHeader className='bg-transparent'>
                <CardLabel icon='ReceiptLong'>
                  <CardTitle tag='h4' className='h5'>
                    Gross Avenue
                  </CardTitle>
                </CardLabel>

              </CardHeader>
              <CardBody>
                $2000
              </CardBody>
            </Card>
          </div>
          <div className='col-xxl-4'>
            <Card className={classNames(
              'transition-base rounded-2 mb-0 text-dark',
              'bg-l25-danger bg-l10-danger-hover'
            )}
              stretch
              shadow='sm'>
              <CardHeader className='bg-transparent'>
                <CardLabel icon='NotificationsActive' iconColor='warning'>
                  <CardTitle tag='h4' className='h5'>
                    Profit Revenue
                  </CardTitle>
                  <CardSubTitle>Last Month 2021</CardSubTitle>
                </CardLabel>
              </CardHeader>
              <CardBody>
                $3456
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
                <CardLabel icon='AssignmentTurnedIn' iconColor='danger'>
                  <CardTitle tag='h4' className='h5'>
                    Profit Revenue
                  </CardTitle>
                  <CardSubTitle>Last Month 2021</CardSubTitle>
                </CardLabel>
              </CardHeader>
              <CardBody>
                $3456
              </CardBody>
            </Card>
          </div>




        </div>
      </Page>
    </PageWrapper>
  );
};

export default DashboardPage;
