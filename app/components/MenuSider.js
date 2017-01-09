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
} = Layout;

const {
	ipcRenderer
} = require('electron');

const PouchDB = require('pouchdb/dist/pouchdb.min');


class MenuSider extends React.Component {
	constructor(props) {
		super(props);

		//利用ipc打开对话框
		this.handleMenuClick = (item) => {
			if(item.key === '1') {
        ipcRenderer.send('open-file-dialog');
      } else if(item.key === '2') {
			  const videoDB = new PouchDB('videos');
				videoDB.destroy().catch((err) => console.log(err));
      }
		};
	}

	render() {
		return (
			<Sider
				trigger={null}
				collapsible
				collapsed={this.props.collapsed}
			>
				<div className="logo" />
				<Menu
					theme="dark" mode="inline"
					defaultSelectedKeys={['1']}
					onClick={this.handleMenuClick}
				>
					<Menu.Item key="1" >
						<Icon type="addfolder" />
						<span className="nav-text">打开文件夹</span>
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
		)
	}
}

export default MenuSider
