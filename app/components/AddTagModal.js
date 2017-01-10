import React, {PropTypes} from 'react';
import {Modal, Select, Button} from 'antd';
import PouchDB from 'pouchdb/dist/pouchdb.min';
import update from 'immutability-helper';

class AddTagModal extends React.Component {
	constructor(props) {
		super(props);
		this.state={
			tags: []
		};

		this.handleOk = function() {
			console.log(this.seletedTags);
			console.log(this.state)
		}

		this.handleCancel = function () {
			console.log(this)
		}

		this.handleSelectChange = (function (value) {
			this.setState(update(this.state, {tags: {$set: value}}))
		}).bind(this)
	}

	componentDidMount() {
		// let tagDB = new PouchDB('tags');
	}

	componentWillReceiveProps(nextProps) {
		if(this.props.item !== nextProps.item) {
			this.setState(update(this.state, {tags: {$set: nextProps.item.tags}}));
		}
	}

	render() {
		return (
			<Modal
				title={this.props.item.name + "标签"}
				visible={this.props.visible}
				onOk={this.handleOk.bind(this)}
				onCancel={this.handleCancel.bind(this)}
				>
				<Select
					tags
					style={{width: '100%'}}
					tokenSeparators={[',', '，', ' ']}
					defaultValue={this.props.item.tags}
					onChange={this.handleSelectChange}
					//value={this.state.selectedTags}
					ref={select => this.seletedTags = select}
					>
					{this.props.tags.map((key, index) => (
						<Select.Option key={key}>{key}</Select.Option>
					))}
				</Select>
			</Modal>
		)
	}
}

export default AddTagModal
