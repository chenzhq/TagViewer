import 'babel-polyfill'; // generators

require('antd/dist/antd.css')

import {render} from 'react-dom';
import React from 'react';
import {Provider} from 'react-redux'

import MainLayout from './components/MainLayout'
import configureStore from './store/store';


render(
	<Provider store={configureStore()}>
		<MainLayout />
	</Provider>
	, document.getElementById('example'));
