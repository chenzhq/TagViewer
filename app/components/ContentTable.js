import React, {
	PropTypes
} from 'react'
import {
	Table,
	Popconfirm,
	Button
} from 'antd'
import PouchDB from 'pouchdb/dist/pouchdb.min';

const {
	Column,
	ColumnGroup
} = Table;

const {
	ipcRenderer,
	shell
} = require('electron');

class ContentTable extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			content: []
		};

		this.handleNameClick = function(path) {
			event.preventDefault();
      shell.openItem(path);
		};

		ipcRenderer.on('onefile-get', (event, file) => {
			let content = this.state.content;
      // videoDB
			this.setState({
				content: content.concat(file)
			})
		})

    ipcRenderer.on('allfile-get', (event) => {
      console.log('所有文件完毕')
    })
	}

	componentWillMount() {
	  const videoDB = new PouchDB('videos');
  }

	componentDidMount() {

  }

	render() {
		return (
			<Table
				dataSource={this.state.content}
				rowKey="_id"
        pagination={{pageSize: 50}}
				scroll={{ y: 340 }}
				bordered
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
					dataIndex="tags"
					key="tags"
					width={200}
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
