import React from 'react';
import { demoPages } from '../menu';
import Footer from '../layout/Footer/Footer';

const footers = [
	{ path: "/", element: null, exact: true },
	{ path: "auth-pages/404", element: null, exact: true },
	{ path: '*', element: <Footer /> },
];

export default footers;
