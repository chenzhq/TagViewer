import 'babel-polyfill';
import React, {
	PropTypes
} from 'react'
import {connect} from 'react-redux';
import {
	Table,
	Button,
	Tag
} from 'antd'
import update from 'immutability-helper';

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


class ContentTable extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			data: [],
			loading: true,
			modalVisible: false,
			selectedItem: {},
			allTags: []
		};

		this.handleNameClick = function(path) {
			event.preventDefault();
      shell.openItem(path);
		};

		//点击标签+按钮
		this.handleTagPlus = function(record) {
			let oldstate = this.state;
			this.setState(update(oldstate, {
				modalVisible: {$set: true},
				selectedItem: {$set: record}
			}));

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
			console.log(_data);
			for(let i = 0, l = _data.length; i < l; i++) {
				if(_data[i]._id === item._id) {
					changeOne = i;
					console.log(_data[i].tags);
					console.log(item.tags);
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

			// this.setState(update(_data, {}));
			// this.setState(update(this.state, {
			// 	data: {
			// 		changeOne: {
			// 			tags: {$set: item.tags}
			// 		}
			// 	}
			// }));

		}).bind(this);

		/*		//打开文件夹后，等待处理
		ipcRenderer.on('selected-directory', (function(event, path) {
			//等待遍历
			this.setState(update(this.state, {loading: {$set: true}}));
			//发送ipc 开始读取路径下的文件
			event.sender.send('readdir', path[0]);
		 }).bind(this));*/

		/*	ipcRenderer.on('allfiles-get', (function (event, files) {
			let videoDB = new PouchDB('videos');
			videoDB.bulkDocs(files).then(results => {
				//The results are returned in the same order as the supplied “docs” array.
				for(let l = results.length , i = l-1; i >= 0; --i) {
					if(results[i].error === true) {
						files.splice(i, 1);
					}
				}

				this.setState(update(this.state, {data: {$push: files}, loading: {$set: false}}));

			}).catch((err) => {
				console.log(err)
			});
		 }).bind(this))*/
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
		let videoDB = new PouchDB('videos');
		let tagDB = new PouchDB('tags');

		videoDB.find({
			selector: {
				times: {'$gte': 0}
			}
		}).then(res => {
			this.setState(update(this.state, {data: {$set: res.docs}}, {loading: {$set: false}}))
		}).catch(err => console.error('video查询失败', err))

		tagDB.find({
			selector: {
				count: {'$gte': 0}
			},
			fields: ['_id']
		}).then(resTags => {
			//tag转换成纯字符串数组
			let tagArr = [];
			for(let i = 0, len = resTags.docs.length; i < len; ++i) {
				tagArr.push(resTags.docs[i]._id);
			}
			this.setState(update(this.state, {allTags: {$set: tagArr}}, {loading: {$set: false}}))
		}).catch(err => {
			console.error('tag查询失败', err);
		});

  }

	render() {
		const {loading, data} = this.props;
		return (
			<section>
				<Table
					dataSource={data}
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
										onClick={((record) => {this.handleTagPlus(record)}).bind(this,record)}
										style={{margin: '5px 0', padding: '0 3px', float: 'right'}}
									></Button>
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
					item={this.state.selectedItem}
					visible={this.state.modalVisible}
					allTags={this.state.allTags}
					updateItem={this.updateItem}
				/>
			</section>
	)
	}
}

const mapStateToProps = state => {
	"use strict";
	const {loading, data, tagModalVisible, selectedItem} = state.tableContent;
	return {
		data: data,
		loading: loading,
		tagModalVisible: tagModalVisible,
		selectedItem: selectedItem
	}
};

const mapDispatchToProps = (dispatch, ownProps) => {
	"use strict";

}

export default connect(mapStateToProps)(ContentTable);
