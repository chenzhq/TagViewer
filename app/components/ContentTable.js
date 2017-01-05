import React, {
	PropTypes
} from 'react'

import {
	Table,
	Popconfirm,
	Button
} from 'antd'

const {
	Column,
	ColumnGroup
} = Table

const {
	ipcRenderer
} = require('electron')

class ContentTable extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			content: []
		}

		ipcRenderer.on('onefile-get', (event, file) => {
			let content = this.state.content
			this.setState({
				content: content.concat(file)
			})
		})
	}

	render() {
		return (
			<Table dataSource={this.state.content} scroll={{ y: 340 }} bordered>
				<Column 
					title="名称"
					dataIndex="name"
					key="name"
					width='300'
				/>
				<Column 
					title="大小"
					dataIndex="size"
					key="size"
					width="100"
				/>
				<Column 
					title="标签"
					dataIndex="tags"
					key="tags"
					width="200"
				/>
				<Column 
					title="观看次数"
					dataIndex="times"
					key="times"
					width="100"
				/>
			</Table>
		)
	}
}

export default ContentTable