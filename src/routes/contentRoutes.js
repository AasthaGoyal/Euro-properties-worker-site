import React, { lazy } from 'react';
import { dashboardMenu, demoPages } from '../menu';
import Login from '../pages/presentation/auth/Login';

const LANDING = {
	DASHBOARD: lazy(() => import('../pages/dashboard/DashboardPage')),
};
const AUTH = {
	PAGE_404: lazy(() => import('../pages/presentation/auth/Page404')),
};
const LIST = {
	BOXED: lazy(() => import('../pages/presentation/users/ListBoxedPage')),
	FLUID: lazy(() => import('../pages/presentation/users/ListFluidPage')),
};

const APP = {
  SALES: {
		TRANSACTIONS: lazy(() => import('../pages/presentation/sales/TransActionsPage')),
		PRODUCTS: lazy(() => import('../pages/presentation/sales/SalesListPage')),
		PRODUCTS_GRID: lazy(() => import('../pages/presentation/sales/ProductsGridPage')),
		PRODUCTS_VIEW: lazy(() => import('../pages/presentation/sales/ProductViewPage')),
	},
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
		element: <LIST.BOXED />,
		exact: true,
	},
	{
		path: demoPages.UserPages.subMenu.addUsers.path,
		element: <LIST.FLUID />,
		exact: true,
	},

	{
		path: demoPages.sales.subMenu.transactions.path,
		element: <APP.SALES.TRANSACTIONS />,
		exact: true,
	},
	{
		path: demoPages.sales.subMenu.salesList.path,
		element: <APP.SALES.PRODUCTS />,
		exact: true,
	},
	{
		path: demoPages.sales.subMenu.productsGrid.path,
		element: <APP.SALES.PRODUCTS_GRID />,
		exact: true,
	},
	{
		path: `${demoPages.sales.subMenu.productID.path}/:id`,
		element: <APP.SALES.PRODUCTS_VIEW />,
		exact: true,
	},

];
const contents = [...presentation];

export default contents;
