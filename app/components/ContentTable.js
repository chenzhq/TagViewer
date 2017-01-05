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
	ipcRenderer,
	shell
} = require('electron')

class ContentTable extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			content: []
		}

		this.handleNameClick = function(event) {
			event.preventDefault()
				// console.log(event.target)
			console.log(this.filePath.href)
			console.log(shell.openItem(this.filePath.href))
		}.bind(this)

		ipcRenderer.on('onefile-get', (event, file) => {
			let content = this.state.content
			this.setState({
				content: content.concat(file)
			})
		})
	}

	render() {
		return (
			<Table 
				dataSource={this.state.content} 
				rowKey="name"
				scroll={{ y: 340 }} 
				bordered
				size="middle">
				<Column 
					title="名称"
					// dataIndex="name"
					key="name"
					width={300}
					render={(text,record, index) => (
						<span>
							<a  href={text._id}
								ref={(a) => {this.filePath = a}}
								onClick={this.handleNameClick}
							>
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