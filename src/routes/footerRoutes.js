import React from 'react';
import { demoPages } from '../menu';
import Footer from '../layout/Footer/Footer';

const footers = [
	{ path: demoPages.login.path, element: null, exact: true },
	{ path: demoPages.signUp.path, element: null, exact: true },
	{ path: demoPages.page404.path, element: null, exact: true },
	{ path: '*', element: <Footer /> },
];

export default footers;
