import 'babel-polyfill'; // generators

require('antd/dist/antd.css')

import {
	render
} from 'react-dom';

import React, {
	PropTypes
} from 'react';

import {
	Table,
	Icon
} from 'antd';

const {
	Column,
	ColumnGroup
} = Table

const data = [{
	key: '1',
	firstName: 'John',
	lastName: 'Brown',
	age: 32,
	address: 'New York No. 1 Lake Park',
	tags: ['tag1', 'tag2'],
}, {
	key: '2',
	firstName: 'Jim',
	lastName: 'Green',
	age: 42,
	address: 'London No. 1 Lake Park',
	tags: ['tag1', 'tag3'],
}, {
	key: '3',
	firstName: 'Joe',
	lastName: 'Black',
	age: 32,
	address: 'Sidney No. 1 Lake Park',
	tags: ['tag1', 'tag2', 'tag3'],
}];

render( < Table dataSource = {
		data
	}
	bordered >
	<ColumnGroup title="Name">
      <Column
        title="First Name"
        dataIndex="firstName"
        key="firstName"
      />
      <Column
        title="Last Name"
        dataIndex="lastName"
        key="lastName"
      />
    </ColumnGroup> < Column title = "Age"
	dataIndex = "age"
	key = "age" / >
	<Column
      title="Address"
      dataIndex="address"
      key="address"
    /> < Column title = "Action"
	key = "action"
	render = {
		(text, record) => (
			<span>
          <a href="#">Action 一 {record.firstName}</a>
          <span className="ant-divider" />
          <a href="#">Delete</a>
          <span className="ant-divider" />
          <a href="#" className="ant-dropdown-link">
            More actions <Icon type="down" />
          </a>
        </span>
		)
	}
	/> < /Table > , document.getElementById('example'));