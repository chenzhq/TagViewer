/**
 * Created by chen on 2017/1/12.
 */
import {createStore, applyMiddleware} from 'redux';
import PouchDB from 'pouchdb/dist/pouchdb.min';
import thunk from 'redux-thunk';
import createLogger from 'redux-logger';
import rootReducer from '../reducers/index'
PouchDB.plugin(require('pouchdb-find'));

const initialState = {
	data: {},
	/*
	{
		files:[
			{_id: idxxx, size: 2M, name: xxx, tags:['idyyy'], times: 0},
			...
		],
		tags:[
			{_id: idyyy, count: 1},
			...
		],
		selectedItemIndex: x(num)
	}
	*/
	/*
	 {
		 result: [idxxx],
		 entities: {
			 "files": {
				 idxxx: {_id: idxxx, size: 2M, name: xxx, tags:['idyyy'], times: 0},
				 ...
			 },
			 "tags": {
				 idyyy: {_id: idyyy, count: 1},
				 ...
			 }
		 }
		 ...
	 }

	 "files": {
			 idxxx: {_id: idxxx, size: 2M, name: xxx, tags:['idyyy'], times: 0},
			 ...
		},
		"tags": {
			 idyyy: {_id: idyyy, count: 1},
			 ...
	 	},
	 	selectedItemIds: []
	 */
	temp: {
		modifiedTags: []
	},
	ui: {
		tableLoading: false,
		tagModalVisible: false,
		menuCollapsed: false,
		tagConfirmLoading: false
	}
};

/*let videoDB = new PouchDB('videos');
let tagDB = new PouchDB('tags');

videoDB.find({
	selector: {
		times: {'$gte': 0}
	}
}).then(res => {
	update(initialState, {files: {data: {$set: res.docs}}})
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
 });*/

export default function configureStore() {
	const store = createStore(rootReducer, initialState, applyMiddleware(thunk, createLogger));

	return store;
}
