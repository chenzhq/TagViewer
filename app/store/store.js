/**
 * Created by chen on 2017/1/12.
 */
import {createStore, applyMiddleware} from 'redux';
import PouchDB from 'pouchdb/dist/pouchdb.min';
import ReduxThunk from 'redux-thunk';
import createLogger from 'redux-logger';
import rootReducer from '../reducers/index'
import { normalize, schema } from 'normalizr';
PouchDB.plugin(require('pouchdb-find'));





const initialState = {
	data: {
		files: {},
		tags: {},
		selectedItemIds: []
	},
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
const initializePreloadedState = function () {

	let videoDB = new PouchDB('videos');
	let tagDB = new PouchDB('tags');

	videoDB.find({
		selector: {
			times: {'$gt': 0}
		}
	}).then(res => {
		let filesSchema = [new schema.Entity('files', {}, {idAttribute: '_id'})];
		initialState.data.files = normalize(res.docs, filesSchema).entities.files;
		// initialState.data.files = res.docs;
		// update(initialState, {files: {data: {$set: res.docs}}})
	}).catch(err => console.error('video查询失败', err));

	tagDB.find({
		selector: {
			count: {'$gte': 0}
		}
	}).then(resTags => {
		// //tag转换成纯字符串数组
		// let tagArr = [];
		// for(let i = 0, len = resTags.docs.length; i < len; ++i) {
		// 	tagArr.push(resTags.docs[i]._id);
		// }
		// this.setState(update(this.state, {allTags: {$set: tagArr}}, {loading: {$set: false}}))
		console.log(resTags.docs)
		if(resTags.docs === []) {
			return;
		}
		let tagsSchema = [new schema.Entity('tags', {}, {idAttribute: '_id'})];
		initialState.data.tags = normalize(resTags.docs, tagsSchema).entities.tags;
	}).catch(err => {
		console.error('tag查询失败', err);
	});

	return initialState;
}

export default function configureStore() {
	const store = createStore(rootReducer, initialState, applyMiddleware(ReduxThunk));

	return store;
}
