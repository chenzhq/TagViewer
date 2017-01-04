import React from 'react'
import {
	Layout,
	Menu,
	Icon
} from 'antd'
const {
	Header,
	Sider,
	Content
} = Layout

require('../styles/MainLayout.css')

import MenuSider from './MenuSider'

const PouchDB = require('pouchdb/dist/pouchdb.min')

class MainLayout extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			collapsed: false
		}
		this.toggle = () => {
			this.setState({
				collapsed: !this.state.collapsed,
			})
		}


	}

	render() {
		return (
			<Layout>
				<MenuSider collapsed={this.state.collapsed}/>
				<Layout>
					<Header style={{ background: '#fff', padding: 0 }}>
			            <Icon
			              className="trigger"
			              type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
			              onClick={this.toggle}
			            />
	          		</Header>
					<Content style={{ margin: '24px 16px', padding: 24, background: '#fff', minHeight: 280 }}>
					Content
					</Content>
				</Layout>
			</Layout>
		)
	}
}

export default MainLayout