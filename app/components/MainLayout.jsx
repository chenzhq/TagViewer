import React from 'react'
import { Layout, Menu, Icon } from 'antd';
const { Header, Sider, Content } = Layout;

require('../styles/MainLayout.css')

const PouchDB = require('pouchdb/dist/pouchdb.min')

class MainLayout extends React.Component {
	constructor(props) {
		super(props)
		this.state = {collapsed: false}
		this.toggle = () => {
			this.setState({
				collapsed: !this.state.collapsed,
			})
		}

		this.handleMenu01 = (item, key, keyPath) => {
			console.log(item)
			console.log(key)
			console.log(keyPath)
			const db = new PouchDB('test')
			db.put({
				"_id": "01",
				"name": "chen"
			})
		}
	}

	render() {
		return (
				<Layout>
					<Sider 
						trigger={null}
						collapsible
						collapsed={this.state.collapsed}
					>
					<div className="logo" />
          <Menu 
          	theme="dark" mode="inline" 
          	defaultSelectedKeys={['1']}
          	onClick={this.handleMenu01}
          >
            <Menu.Item key="1" >
              <Icon type="user" />
              <span className="nav-text">nav 1</span>
            </Menu.Item>
            <Menu.Item key="2">
              <Icon type="video-camera" />
              <span className="nav-text">nav 2</span>
            </Menu.Item>
            <Menu.Item key="3">
              <Icon type="upload" />
              <span className="nav-text">nav 3</span>
            </Menu.Item>
          </Menu>
					</Sider>
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