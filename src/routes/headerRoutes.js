import React from 'react';
import { dashboardMenu, demoPages } from '../menu';
import DashboardHeader from '../pages/common/Headers/DashboardHeader';
import DefaultHeader from '../pages/common/Headers/DefaultHeader';

const headers = [
	{ path: "/", element: null, exact: true },
	{ path: "auth-pages/404", element: null, exact: true },
	{ path: dashboardMenu.dashboard.path, element: <DashboardHeader />, exact: true },
	{
		path: `*`,
		element: <DefaultHeader />,
	},
];

export default headers;
