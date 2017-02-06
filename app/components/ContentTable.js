"use strict";

import 'babel-polyfill';
import React, {	PropTypes} from 'react'
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Table,Button,	Tag} from 'antd'
import update from 'immutability-helper';
// import { denormalize, schema } from 'normalizr';

import AddTagModal from './AddTagModal'
import PouchDB from 'pouchdb/dist/pouchdb.min';
PouchDB.plugin(require('pouchdb-find'));

const {
  Column,
} = Table;

const {
	ipcRenderer,
	shell
} = require('electron');

import {openTagModal, changeTag, modifyTags, closeTagModal} from '../actions/actions';
import {filterByTags} from '../utils/XORArray';

class ContentTable extends React.Component {
	constructor(props) {
		super(props);

		const {dispatch} = props;
		this.handleNameClick = function(path) {
			event.preventDefault();
      shell.openItem(path);
		};

		//点击标签+按钮
		this.handleTagPlus = function(record) {

			this.props.tagPlus(record);
		}

		//传给Modal的回调函数，修改state.data.item.tags
		this.updateItem = (function (item) {

			let testarr = [{a: 'a', b: 'b'},{c: 'c', d: 'd'}];
			let num = 1;
			console.log(update(testarr, {num: {c: {$set: 'cc'}}}));


			console.log(item.tags);
			let _data = this.state.data;
			let changeOne = 0;
			let modifiedData;
			for(let i = 0, l = _data.length; i < l; i++) {
				if(_data[i]._id === item._id) {
					changeOne = i;
					modifiedData = update(_data, {
						i: {
							tags: {$splice: [[0, _data[i].tags.length, item.tags]]}
						}
					});
					this.setState(update(_data, modifiedData));
					break;
				}
			}
			console.log(modifiedData);


		}).bind(this);


	}

	componentWillMount() {
		let videoDB = new PouchDB('videos');
		videoDB.createIndex({
			index: {
				fields: ['times']
			}
		}).catch(err => console.err('索引创建失败', err));
  }

	componentDidMount() {

	}

	render() {
		const {loading, files, tags, selectedItemIds, selectedItem, tagModalVisible, tagConfirmLoading} = this.props;
		const {handleOk, handleCancel, handleSelectChange} = this.props;

		return (
			<section>
				<Table
					dataSource={files}
					rowKey={record => record._id}
					pagination={{pageSize: 50}}
					scroll={{ y: 340 }}
					bordered
					loading={loading}
					size="middle"
				>
					<Column
						title="名称"
						key="name"
						width={300}
						// onCellClick={this.handleNameCellClick}
						render={(text,record, index) => (
							<span>
								{/*这里使用闭包传递了不同的参数,但是this的值不太明白*/}
								<a href="#"
									 onClick={(_id => this.handleNameClick(_id)).bind(null,text._id)}>
									{text.name}
								</a>
							</span>
						)}
					/>
					<Column
						title="大小"
						dataIndex="size"
						key="size"
						width={100}
					/>
					<Column
						title="标签"
						key="tags"
						width={200}
						render={(text, record) => (
							<div>
								{record.tags.map((tag) => {
									const isLongTag = tag.length > 10;
									const tagElem = (
										<Tag
											key={tag}>
											{isLongTag ? `${tag.slice(0, 10)}...` : tag}
										</Tag>
									);
									return isLongTag ? <Tooltip title={tag}>{tagElem}</Tooltip> : tagElem;
								})}
								{
									<Button
										type="ghost"
										size="small"
										icon="plus"
										onClick={(record => {this.handleTagPlus(record)}).bind(this,record)}
										style={{margin: '5px 0', padding: '0 3px', float: 'right'}}
									/>
								}
							</div>
						)
						}
					/>
					<Column
						title="观看次数"
						dataIndex="times"
						key="times"

					/>
				</Table>
				<AddTagModal
					allTags={tags}
					visible={tagModalVisible}
					confirmLoading={tagConfirmLoading}
					//itemId={selectedItemIds[0]}
					item={selectedItem}
					handleOk={handleOk}
					handleCancel={handleCancel}
					handleSelectChange={handleSelectChange}
				/>
			</section>
	)
	}
}

const mapStateToProps = state => {
	const {data,ui, filter} = state;
	const {files, tags, selectedItemIds} = data;
	const viewFiles = filterByTags(files, filter.tags);
	console.log(viewFiles);
	return {
		files: viewFiles,
		tags: Object.keys(tags).map(key => (tags[key]._id)),
		loading: ui.tableLoading,
		tagConfirmLoading: ui.tagConfirmLoading,
		tagModalVisible: ui.tagModalVisible,
		selectedItem: files[selectedItemIds],
		selectedItemIds: selectedItemIds
	}
};

const mapDispatchToProps = (dispatch, ownProps) => {
	return {
		dispatch: dispatch,
		handleOk: bindActionCreators(modifyTags, dispatch),
		handleCancel: bindActionCreators(closeTagModal, dispatch),
		tagPlus: bindActionCreators(openTagModal, dispatch),
		handleSelectChange: bindActionCreators(changeTag, dispatch)
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(ContentTable);
