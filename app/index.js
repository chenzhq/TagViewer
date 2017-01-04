import 'babel-polyfill'; // generators

require('antd/dist/antd.css')

import {
	render
} from 'react-dom';

import React, {
	PropTypes
} from 'react';


import MainLayout from './components/MainLayout'



render(<MainLayout />, document.getElementById('example'));