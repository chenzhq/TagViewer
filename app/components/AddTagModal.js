import React, {PropTypes} from 'react';
import {Modal, Select, Button} from 'antd';
import PouchDB from 'pouchdb/dist/pouchdb.min';
PouchDB.plugin(require('pouchdb-upsert'));
import update from 'immutability-helper';

class AddTagModal extends React.Component {
	constructor(props) {
		super(props);
		this.state={
			visible: props.visible,
			item: {},
			allTags: []
		};
		let videoDB = new PouchDB('videos');
		let tagDB = new PouchDB('tags');

		//
		this.handleOk = function() {
			this.setState({confirmLoading: true});

			let previousTags = this.props.item.tags;
			let subsequentTags = this.state.item.tags;
			//如果标签没有实质的变化，则直接关闭
			if(previousTags.sort().toString() === subsequentTags.sort().toString()) {
				this.setState({visible: false, item: {}});
				return;
			}

			let _item = this.state.item;
			// console.log(_item)
			videoDB.upsert(_item._id, doc => {
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

			this.props.updateItem(_item);

			this.setState({visible: false, confirmLoading: false})

		}

		this.handleCancel = function () {
			this.setState({visible: false, item: {}});
		}

		this.handleSelectChange = (function (value) {
			this.setState(update(this.state, {item: {tags: {$set: value}}}))
		}).bind(this)
	}

	componentDidMount() {
		// let tagDB = new PouchDB('tags');
	}

	componentWillReceiveProps(nextProps) {
		if(this.props.item !== nextProps.item) {
			this.setState(update(this.state, {
				item: {$set: nextProps.item},
				visible: {$set: nextProps.visible}
			}));
		}
	}

	render() {
		return (
			<Modal
				title={this.props.item.name + " 标签"}
				visible={this.state.visible}
				confirmLoading={this.state.confirmLoading}
				onOk={this.handleOk.bind(this)}
				onCancel={this.handleCancel.bind(this)}
				>
				<Select
					tags
					style={{width: '80%'}}
					tokenSeparators={[',', '，', ' ']}
					defaultValue={this.props.item.tags}
					onChange={this.handleSelectChange}
					>
					{this.props.allTags.map((key, index) => (
						<Select.Option key={key}>{key}</Select.Option>
					))}
				</Select>
			</Modal>
		)
	}
}

export default AddTagModal
