import React, { lazy } from 'react';
import { dashboardMenu, demoPages } from '../menu';
import Login from '../pages/presentation/auth/Login';
import ForgetPassword from '../pages/presentation/auth/ForgetPassword';
import ResetPassword from '../pages/presentation/auth/ResetPassword';

const LANDING = {
	DASHBOARD: lazy(() => import('../pages/dashboard/DashboardPage')),
};
const AUTH = {
	PAGE_404: lazy(() => import('../pages/presentation/auth/Page404')),
};
const USER = {

	VIEWUSERS: lazy(() => import('../pages/presentation/UserPages/ViewUser')),	
  
};

const JOBSITE = {
 
	LISTJOBSITES: lazy(() => import('../pages/presentation/Jobsites/ListAllJobsites')),	
  
}

const TASKS = {
  
	LISTTASK: lazy(() => import('../pages/presentation/Tasks/ListAllTasks')),	
    EDITTASK: lazy(() => import('../pages/presentation/Tasks/EditTasks')),
}

const VEHICLES = {
  
	LISTVEHICLE: lazy(() => import('../pages/presentation/Vehicles/ListAllVehicles')),	
  
}


const PAYROLL = {
  ADDTIMESHEET: lazy(() => import('../pages/presentation/Payroll/AddTimesheet')),	
	LISTPAYSLIPS: lazy(() => import('../pages/presentation/Payslips/ListPayslips')),	
  VIEWPAYSLIPS: lazy(() => import('../pages/presentation/Payslips/ViewPayslips')),	
  TIMESHEETS: lazy(() => import('../pages/presentation/Payroll/Timesheets')),
  LISTINVOICES: lazy(() => import('../pages/presentation/Invoices/ListInvoices')),
  VIEWINVOICES: lazy(() => import('../pages/presentation/Invoices/ViewInvoices')),
}
// const PAGE_LAYOUTS = {
// 	HEADER_SUBHEADER: lazy(() => import('../pages/presentation/page-layouts/HeaderAndSubheader')),
// 	HEADER: lazy(() => import('../pages/presentation/page-layouts/OnlyHeader')),
// 	SUBHEADER: lazy(() => import('../pages/presentation/page-layouts/OnlySubheader')),
// 	CONTENT: lazy(() => import('../pages/presentation/page-layouts/OnlyContent')),
// 	BLANK: lazy(() => import('../pages/presentation/page-layouts/Blank')),
// 	ASIDE: lazy(() => import('../pages/presentation/aside-types/DefaultAsidePage')),
// 	MINIMIZE_ASIDE: lazy(() => import('../pages/presentation/aside-types/MinimizeAsidePage')),
// };

const presentation = [
	/**
	 * Landing
	 */
	{
		path: dashboardMenu.dashboard.path,
		element: <LANDING.DASHBOARD />,
		exact: true,
	},
	{
		path: "/auth-pages/404",
		element: <AUTH.PAGE_404 />,
		exact: true,
	},
	{
		path: "/",
		element: <Login />,
		exact: true,
	},
  {
		path:"/forget-password",
		element: <ForgetPassword />,
		exact: true,
	},
  {
    path:"/reset-password/token/:token",
		element: <ResetPassword />,
		exact: true,

  },
  {
		path: `/user-pages/editUsers/:id`,
		element: <USER.VIEWUSERS />,
		exact: true,
	},
  {
		path: demoPages.AddTimesheet.path,
		element: < PAYROLL.ADDTIMESHEET/>,
		exact: true,
	},
  {
		path: demoPages.ViewTimesheets.path,
		element: < PAYROLL.TIMESHEETS/>,
		exact: true,
	},
  {
		path: demoPages.ListInvoices.path,
		element: < PAYROLL.LISTINVOICES/>,
		exact: true,
	},
  {
		path:`/view-invoices/:id`,
		element: < PAYROLL.VIEWINVOICES/>,
		exact: true,
	},
  {
		path: demoPages.ListPayslips.path,
		element: < PAYROLL.LISTPAYSLIPS/>,
		exact: true,
	},
  {
		path:`/view-payslips/:id`,
		element: < PAYROLL.VIEWPAYSLIPS/>,
		exact: true,
	},
  {
		path: demoPages.ViewJobsites.path,
		element: < JOBSITE.LISTJOBSITES/>,
		exact: true,
	},
  {
		path: demoPages.ViewTasks.path,
		element: < TASKS.LISTTASK/>,
		exact: true,
	},
	{
		path: `/task-pages/EditTasks/:id`,
		element: <TASKS.EDITTASK />,
		exact: true,
	},
  {
		path: demoPages.ViewVehicles.path,
		element: < VEHICLES.LISTVEHICLE/>,
		exact: true,
	},




];
const contents = [...presentation];

export default contents;
