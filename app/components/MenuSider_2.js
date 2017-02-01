/**
 * Created by chen on 2017/1/13.
 */
import React, {Component, PropTypes} from 'react';
import {Layout, Menu, Icon} from 'antd';
const {Sider} = Layout;

class MenuSider extends Component {
	render() {
		const {collapsed, handleMenuClick} = this.props;
		return (
			<Sider
				trigger={null}
				collapsible
				collapsed={collapsed}
			>
				<div className="logo" />
				<Menu
					theme="dark" mode="inline"
					defaultSelectedKeys={['1']}
					onClick={handleMenuClick}
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


MenuSider.propTypes = {
	collapsed: PropTypes.bool.isRequired,
	handleMenuClick: PropTypes.func.isRequired
};

export default MenuSider
