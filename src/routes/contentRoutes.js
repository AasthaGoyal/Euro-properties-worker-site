import React, { lazy } from 'react';
import { dashboardMenu, demoPages } from '../menu';
import Login from '../pages/presentation/auth/Login';

const LANDING = {
	DASHBOARD: lazy(() => import('../pages/dashboard/DashboardPage')),
};
const AUTH = {
	PAGE_404: lazy(() => import('../pages/presentation/auth/Page404')),
};
const USER = {
	NEWUSER: lazy(() => import('../pages/presentation/users/AddNewUser')),
	LISTUSERS: lazy(() => import('../pages/presentation/users/ListUsers')),	
  PRODUCTS_VIEW: lazy(() => import('../pages/presentation/UserPages/ViewUser')),
};


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
		path: demoPages.page404.path,
		element: <AUTH.PAGE_404 />,
		exact: true,
	},
	{
		path: demoPages.login.path,
		element: <Login />,
		exact: true,
	},
	{
		path: demoPages.signUp.path,
		element: <Login isSignUp />,
		exact: true,
	},
  {
		path: demoPages.UserPages.subMenu.listUsers.path,
		element: <USER.LISTUSERS />,
		exact: true,
	},
	{
		path: demoPages.UserPages.subMenu.addUsers.path,
		element: <USER.NEWUSER />,
		exact: true,
	},


	{
		path: `${demoPages.UserPages.subMenu.editUser.path}/:id`,
		element: <USER.PRODUCTS_VIEW />,
		exact: true,
	},

];
const contents = [...presentation];

export default contents;
