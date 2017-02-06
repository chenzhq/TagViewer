"use strict";

import React, {PropTypes} from 'react';
import {Modal, Select, Button} from 'antd';
import PouchDB from 'pouchdb/dist/pouchdb.min';
PouchDB.plugin(require('pouchdb-upsert'));
import {connect} from 'react-redux';

class AddTagModal extends React.Component {
	constructor(props) {
		super(props);
		const {dispatch, itemId} = props;
	}

	componentDidMount() {
	}

	componentWillReceiveProps(nextProps) {
	}

	render() {
		const {item, visible, confirmLoading, allTags} = this.props;
		const {handleOk, handleCancel, handleSelectChange} = this.props;
		let defaultTags = item === undefined ? [] : item.tags;
		return (
			<Modal
				title={item === undefined ? '' : item.name + " 标签"}
				visible={visible}
				confirmLoading={confirmLoading}
				onOk={() => handleOk(item._id)}
				onCancel={handleCancel}
				>
				<Select
					tags
					style={{width: '80%'}}
					tokenSeparators={[',', '，', ' ']}
					value={this.props.modifiedTags}
					//defaultValue={defaultTags}
					onChange={(value) => handleSelectChange(value)}
					>
					{allTags.map(key => (
						<Select.Option key={key}>{key}</Select.Option>
					))}
				</Select>
			</Modal>
		)
	}
}

const mapStateToProps = function (state) {
	const {data, ui, temp} = state;
	const {modifiedTags} = temp;
	return {
		modifiedTags
	}
}

export default connect(mapStateToProps)(AddTagModal)
