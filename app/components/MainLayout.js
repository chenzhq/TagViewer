import React from 'react'
import {
	Layout,
	Menu,
	Icon,
	Spin
} from 'antd'
const {
	Header,
	Sider,
	Content
} = Layout;
const {
	ipcRenderer
} = require('electron');

import update from 'immutability-helper';

require('../styles/MainLayout.css');

import MenuSider from './MenuSider'
import ContentTable from './ContentTable'
import  AddTagModal from './AddTagModal'

const PouchDB = require('pouchdb/dist/pouchdb.min');
PouchDB.plugin(require('pouchdb-find'));

class MainLayout extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			collapsed: false,
			tags: []
		};

		this.toggle = () => {
			this.setState({
				collapsed: !this.state.collapsed
			})
		}


	}

  componentWillMount() {
		let tagDB = new PouchDB('tags');

		tagDB.find({
			selector: {
				count: {'$gte': 0}
			}
		}).then(res => {
			let oldState = this.state;
			this.setState(update(oldState, {tags: {$set: res.docs}}))
		}).catch(err => console.log(err));
  }

	render() {
		return (
			<Layout className="layout">
				<MenuSider collapsed={this.state.collapsed} />
				<Layout>
					<Header style={{ background: '#fff', padding: 0 }}>
            <Icon
              className="trigger"
              type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
              onClick={this.toggle}
            />
          </Header>
					<Content style={{ margin: '20px 12px', padding: 20, background: '#fff', minHeight: 470 }}>
							<ContentTable tags={this.state.tags}/>
					</Content>
				</Layout>
			</Layout>
		)
	}
}

export default MainLayout
