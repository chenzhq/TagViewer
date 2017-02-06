"use strict";

import React from 'react'
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux'
import {Layout, Icon, Popover} from 'antd'
const {Header, Content} = Layout;
const {ipcRenderer} = require('electron');

import update from 'immutability-helper';

require('../styles/MainLayout.css');
import { normalize, schema } from 'normalizr';

import MenuSider from './MenuSider_2'
import ContentTable from './ContentTable'
import TagPop from './TagPop';

import {collapseMenu, beginLoading, searchPath, initialState, toggleTagPopVisible} from '../actions/actions'

const PouchDB = require('pouchdb/dist/pouchdb.min');
PouchDB.plugin(require('pouchdb-find'));

class MainLayout extends React.Component {
	constructor(props) {
		super(props);
		const {dispatch} = props;

		this.menuToggle = () => {
			dispatch(collapseMenu(this.props.menuCollapsed));
		}

		this.tagpopToggle = () => {
			dispatch(toggleTagPopVisible(this.props.tagPopoverVisible));
		}

		//点击左侧菜单事件
		this.handleMenuClick = (item) => {
			if (item.key === '1') {
				ipcRenderer.send('open-file-dialog');
			} else if (item.key === '2') {
				let videoDB = new PouchDB('videos');
				let tagDB = new PouchDB('tags');
				// let allTags = new PouchDB('allTags');
				videoDB.destroy().catch((err) => console.log(err));
				tagDB.destroy().catch((err) => console.log(err));
				// allTags.destroy();
			}
		}

		ipcRenderer.on('selected-directory', function (event, path) {
			dispatch(searchPath(path[0]));
		});

	}


	componentWillMount() {
  }

  componentDidMount() {
		this.props.dispatch(initialState());
	}

	render() {
		const {menuCollapsed, tagPopoverVisible} = this.props;
		return (
			<Layout className="layout">
				<MenuSider
					collapsed={menuCollapsed}
					handleMenuClick={this.handleMenuClick}
				/>
				<Layout>
					<Header style={{ background: '#fff', padding: 0 }}>
            <Icon
							className="trigger"
							type={menuCollapsed ? 'menu-unfold' : 'menu-fold'}
							onClick={() => this.props.menuToggle(this.props.menuCollapsed)}
            />
						<Popover
							content={<TagPop />}
							trigger="click"
							placement="bottomLeft"
							//visible={tagPopoverVisible}
						>
							<Icon
								type="tag-o"
								onClick={() => this.props.tagPopToggle(this.props.tagPopoverVisible)}
							/>
						</Popover>
          </Header>
					<Content style={{ margin: '18px 12px', padding: 20, background: '#fff', minHeight: 470 }}>
							<ContentTable />
					</Content>
				</Layout>
			</Layout>
		)
	}
}

const mapStateToProps = state => {
	const {menuCollapsed, tableLoading, tagPopoverVisible} = state.ui;
	return {
		menuCollapsed,
		tableLoading,
		tagPopoverVisible
	}

}

const mapDispatchToProps = (dispatch, ownProps) => {

	return {
		dispatch: dispatch,
		initialState: bindActionCreators(initialState, dispatch),
		menuToggle: bindActionCreators(collapseMenu, dispatch),
		tagPopToggle: bindActionCreators(toggleTagPopVisible, dispatch)
	}
}


export default connect(mapStateToProps, mapDispatchToProps)(MainLayout);
