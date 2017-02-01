"use strict";

import React from 'react'
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux'
import {Layout, Icon} from 'antd'
const {Header, Content} = Layout;
const {ipcRenderer} = require('electron');

import update from 'immutability-helper';

require('../styles/MainLayout.css');
import { normalize, schema } from 'normalizr';

import MenuSider from './MenuSider_2'
import ContentTable from './ContentTable'

import {collapseMenu, beginLoading, searchPath, initialState} from '../actions/actions'

const PouchDB = require('pouchdb/dist/pouchdb.min');
PouchDB.plugin(require('pouchdb-find'));

class MainLayout extends React.Component {
	constructor(props) {
		super(props);
		const {dispatch} = props;
		//保存一个单独的state，标识菜单是否折叠
		// this.state = {
		// 	collapsed: false
		// };

		this.toggle = () => {
			dispatch(collapseMenu(this.props.menuCollapsed));
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
			//等待遍历
			// this.setState(update(this.state, {loading: {$set: true}}));
			// dispatch(beginLoading());

			dispatch(searchPath(path[0]));
			//发送ipc 开始读取路径下的文件
			// event.sender.send('readdir', path[0]);
		});

		/*ipcRenderer.on('allfiles-get', (function (event, files) {
		 let videoDB = new PouchDB('videos');
		 videoDB.bulkDocs(files).then(results => {
		 //The results are returned in the same order as the supplied “docs” array.
		 for(let l = results.length , i = l-1; i >= 0; --i) {
		 if(results[i].error === true) {
		 files.splice(i, 1);
		 }
		 }
		 dispatch(addFiles(files));
		 // this.setState(update(this.state, {data: {$push: files}, loading: {$set: false}}));

		 }).catch((err) => {
		 console.log(err)
		 });
		 }).bind(this))*/
	}


	componentWillMount() {
		// console.log('MainLayout will mount');

		/*let tagDB = new PouchDB('allTags');

		tagDB.find({
			selector: {
				count: {'$gte': 0}
			}
		}).then(res => {
			let oldState = this.state;
			this.setState(update(oldState, {tags: {$set: res.docs}}))
		}).catch(err => console.log(err));*/
  }

  componentDidMount() {
		// console.log('MainLayout did mount');
		this.props.dispatch(initialState());
	}

	render() {
		const {menuCollapsed} = this.props;
		// console.log('MainLayout render');
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
							onClick={this.toggle}
            />
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
	const {menuCollapsed, tableLoading} = state.ui;
	return {
		menuCollapsed,
		tableLoading
	}

}

const mapDispatchToProps = (dispatch, ownProps) => {

	return {
		initial: bindActionCreators(initialState(), dispatch),
		tableLoading: bindActionCreators(beginLoading(ownProps.tableLoading), dispatch)
	}
}


export default connect(mapStateToProps)(MainLayout);
