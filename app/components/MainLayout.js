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

require('../styles/MainLayout.css');

import MenuSider from './MenuSider'
import ContentTable from './ContentTable'

const PouchDB = require('pouchdb/dist/pouchdb.min');

class MainLayout extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			collapsed: false,
			loading: false,
			loadingTip: '正在加载'
		};

		this.toggle = () => {
			this.setState({
				collapsed: !this.state.collapsed,
			})
		}


	}

  componentWillMount() {
	  const videoDB = new PouchDB('videos');
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
							<ContentTable />
					</Content>
				</Layout>
			</Layout>
		)
	}
}

export default MainLayout
