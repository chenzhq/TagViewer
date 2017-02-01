"use strict";

import React, {PropTypes} from 'react';
import {Modal, Select, Button} from 'antd';
import PouchDB from 'pouchdb/dist/pouchdb.min';
// import update from 'immutability-helper';
// import {changeTag, modifyTags, closeTagModal} from '../actions/actions';
PouchDB.plugin(require('pouchdb-upsert'));
import {connect} from 'react-redux';

class AddTagModal extends React.Component {
	constructor(props) {
		super(props);
		const {dispatch, itemId} = props;
		// let videoDB = new PouchDB('videos');
		// let tagDB = new PouchDB('tags');

		//
		/*this.handleOk = function() {

			/!*this.setState({confirmLoading: true});

			let previousTags = itemId.tags;
			let subsequentTags = this.state.itemId.tags;
			//如果标签没有实质的变化，则直接关闭
			if(previousTags.sort().toString() === subsequentTags.sort().toString()) {
				this.setState({visible: false, itemId: {}});
				return;
			}

			let _itemId = this.state.itemId;
			// console.log(_itemId)
			videoDB.upsert(_itemId._id, doc => {
				// console.log(doc)
				doc.tags = subsequentTags;
				return doc;
			}).then(res => {}).catch(err => {console.error(err)});

			previousTags.forEach((tag) => {
				tagDB.upsert(tag, (doc) => {
					doc.count--;
					if(doc.count === 0) {
						doc._deleted = true;
					}
					return doc;
				}).then(res => {

				}).catch(err => {console.error(err)})
			});

			subsequentTags.forEach((tag) => {
				tagDB.upsert(tag, doc => {
					if(doc === {}) {
						return {_id: tag, count: 1};
					}
					doc.count++;
					return doc;
				}).then(res => {}).catch(err => {console.error(err)})
			});

			this.props.updateitemId(_itemId);

			this.setState({visible: false, confirmLoading: false})*!/

			dispatch(modifyTags(itemId));
		};

		this.handleCancel = function () {
			dispatch(closeTagModal());
			// this.setState({visible: false, itemId: {}});
		};

		this.handleSelectChange = function (value) {
			dispatch(changeTag(value));
		}*/
	}

	componentDidMount() {
		// let tagDB = new PouchDB('tags');
	}

	componentWillReceiveProps(nextProps) {
		/*if(this.props.itemId !== nextProps.itemId) {
			this.setState(update(this.state, {
				itemId: {$set: nextProps.itemId},
				visible: {$set: nextProps.visible}
			}));
		}*/
	}

	render() {
		const {item, visible, confirmLoading, allTags} = this.props;
		const {handleOk, handleCancel, handleSelectChange} = this.props;
		// console.log('tag render', item);
		let defaultTags = item === undefined ? [] : item.tags;
		// console.log('defaultTags ', defaultTags);
		// console.log('allTags ', allTags);
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
