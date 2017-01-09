import React, {
	PropTypes
} from 'react'
import {
	Table,
	Popconfirm,
	Button,
	Tag
} from 'antd'
import PouchDB from 'pouchdb/dist/pouchdb.min';
PouchDB.plugin(require('pouchdb-find'));

const {
  Column,
	ColumnGroup
} = Table;

const {
	ipcRenderer,
	shell
} = require('electron');

const {Map, List} = require('immutable');

class ContentTable extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			data: Map({
				content: List(),
				loading: true
			}),
		};

		this.handleNameClick = function(path) {
			event.preventDefault();
      shell.openItem(path);
		};


		//打开文件夹后，等待处理
		ipcRenderer.on('selected-directory', (function(event, path) {
			//等待遍历
			this.setState(({data}) => ({
				data: data.update('loading', () => true)
			}));
			//发送ipc 开始读取路径下的文件
			event.sender.send('readdir', path[0]);
		}).bind(this));

		ipcRenderer.on('allfiles-get', (function (event, files) {
			let videoDB = new PouchDB('videos');
			videoDB.bulkDocs(files).then(result => {
				let oldState = this.state.data;
				this.setState(({data}) => ({
					data: data.update(map => {
						return map.merge(Map({'content': List(files), 'loading': false}))
					})
				}));
			}).catch((err) => {
				console.log(err)
			});
		}).bind(this))
	}

	componentWillMount() {
		const videoDB = new PouchDB('videos');
		videoDB.createIndex({
			index: {
				fields: ['times']
			}
		}).catch(err => console.err('索引创建失败', err));
  }

	componentDidMount() {
		const videoDB = new PouchDB('videos');

		videoDB.find({
			selector: {
				times: {'$gte': 0},
			}
		}).then(res => {
			console.log('查询成功', res);
			this.setState({
				data: Map({
					content: List(res.docs),
					loading: false
				})
			})
		}).catch(err => {
			console.log('查询失败', err);
		})
  }

	render() {
		return (
			<Table
				dataSource={this.state.data.get('content').toArray()}
				rowKey={record => record._id}
        pagination={{pageSize: 50}}
				scroll={{ y: 340 }}
				bordered
				loading={this.state.data.get('loading')}
				size="middle">
				<Column
					title="名称"
					// dataIndex="name"
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
							{record.tags.map((tag, index) => {
								const isLongTag = tag.length > 10;
								const tagElem = (
									<Tag
										key={tag}>
										{isLongTag ? `${tag.slice(0, 10)}...` : tag}
									</Tag>
								);
								return isLongTag ? <Tooltip title={tag}>{tagElem}</Tooltip> : tagElem;
							})}

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
		)
	}
}

export default ContentTable
