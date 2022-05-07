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
	NEWUSER: lazy(() => import('../pages/presentation/UserPages/AddNewUser')),
	LISTUSERS: lazy(() => import('../pages/presentation/UserPages/ListAllUsers')),	
  PRODUCTS_VIEW: lazy(() => import('../pages/presentation/UserPages/ViewUser')),
};

const JOBSITE = {
  NEWJOBSITE: lazy(() => import('../pages/presentation/Jobsites/AddNewJobsite')),
	LISTJOBSITES: lazy(() => import('../pages/presentation/Jobsites/ListAllJobsites')),	
  EDITJOBSITE: lazy(() => import('../pages/presentation/Jobsites/ViewJobsites')),
}

const TASKS = {
  NEWTASK: lazy(() => import('../pages/presentation/Tasks/AddNewTask')),
	LISTTASK: lazy(() => import('../pages/presentation/Tasks/ListAllTasks')),	
  EDITTASK: lazy(() => import('../pages/presentation/Tasks/EditTasks')),
}

const VEHICLES = {
  NEWVEHICLE: lazy(() => import('../pages/presentation/Vehicles/AddNewVehicle')),
	LISTVEHICLE: lazy(() => import('../pages/presentation/Vehicles/ListAllVehicles')),	
  EDITVEHICLE: lazy(() => import('../pages/presentation/Vehicles/EditVehicle')),
}

const MATERIAL = {
  NEWMATERIAL: lazy(() => import('../pages/presentation/Material/AddMaterial')),
	LISTMATERIAL: lazy(() => import('../pages/presentation/Material/ListAllMaterials')),	
  EDITMATERIAL: lazy(() => import('../pages/presentation/Material/EditMaterial')),
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
  {
		path: demoPages.Jobsites.subMenu.addJobsite.path,
		element: <JOBSITE.NEWJOBSITE />,
		exact: true,
	},
  {
		path: demoPages.Jobsites.subMenu.viewJobsite.path,
		element: <JOBSITE.LISTJOBSITES />,
		exact: true,
	},
  {
		path: `${demoPages.Jobsites.subMenu.editJobsite.path}/:id`,
		element: <JOBSITE.EDITJOBSITE />,
		exact: true,
	},
  {
		path: demoPages.Tasks.subMenu.addTasks.path,
		element: <TASKS.NEWTASK />,
		exact: true,
	},
  {
		path: demoPages.Tasks.subMenu.viewTasks.path,
		element: <TASKS.LISTTASK />,
		exact: true,
	},
  {
		path: `${demoPages.Tasks.subMenu.editTasks.path}/:id`,
		element: <TASKS.EDITTASK />,
		exact: true,
	},
  {
		path: demoPages.Vehicle.subMenu.addVehicle.path,
		element: <VEHICLES.NEWVEHICLE />,
		exact: true,
	},
  {
		path: demoPages.Vehicle.subMenu.viewVehicle.path,
		element: <VEHICLES.LISTVEHICLE />,
		exact: true,
	},
  {
		path: `${demoPages.Vehicle.subMenu.editVehicle.path}/:id`,
		element: <VEHICLES.EDITVEHICLE />,
		exact: true,
	},
  {
		path: demoPages.Material.subMenu.addMaterial.path,
		element: <MATERIAL.NEWMATERIAL />,
		exact: true,
	},
  {
		path: demoPages.Material.subMenu.viewMaterial.path,
		element: <MATERIAL.LISTMATERIAL />,
		exact: true,
	},
  {
		path: `${demoPages.Material.subMenu.editMaterial.path}/:id`,
		element: <MATERIAL.EDITMATERIAL />,
		exact: true,
	},



];
const contents = [...presentation];

export default contents;
