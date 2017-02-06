'use strict';

import React, {PropTypes} from 'react';
import {Modal, Select} from 'antd';
import PouchDB from 'pouchdb/dist/pouchdb.min';
PouchDB.plugin(require('pouchdb-upsert'));
import {connect} from 'react-redux';

class AddTagModal extends React.Component {
	constructor(props) {
		super(props);
	}



	render() {
		const {item, visible, confirmLoading, allTags} = this.props;
		const {handleOk, handleCancel, handleSelectChange} = this.props;
		return (
			<Modal
				title={item === undefined ? '' : item.name + ' 标签'}
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
	const {temp} = state;
	const {modifiedTags} = temp;
	return {
		modifiedTags
	}
}

AddTagModal.propsTypes = {
	modifiedTags: PropTypes.arrayOf(PropTypes.string)
}

export default connect(mapStateToProps)(AddTagModal)
