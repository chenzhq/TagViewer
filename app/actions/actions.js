/**
 * Created by chen on 2017/1/12.
 */
'use strict';
import {recursiveReaddirSync} from '../utils/RecurFile'
import PouchDB from 'pouchdb/dist/pouchdb.min';
import {XorArray} from '../utils/XORArray';
// PouchDB.plugin(require('pouchdb-find'));
import { normalize, schema } from 'normalizr';

export const MODIFY_TAGS = 'MODIFY_TAGS';
export const MENU_COLLAPSE = 'MENU_COLLAPSE';
export const BEGIN_LOADING = 'BEGIN_LOADING';
export const ADD_FILES = 'ADD_FILES';

export const OPEN_TAGMODAL = 'OPEN_TAGMODAL';
export const CLOSE_TAGMODAL = 'CLOSE_TAGMODAL';
export const CHANGE_TAG = 'CHANGE_TAG';
export const SAVE_TAG = 'SAVE_TAG';
export const SAVE_TAG_SUCCESS = 'SAVE_TAG_SUCESS';

export const INITIAL_TAGS = 'INITIAL_TAGS';
export const INITIAL_FILES = 'INITIAL_FILES';

export const TAGPOP_VISIBLE = 'TAG_VISIBLE';
export const CHECK_TAG = 'CHECK_TAG';
export const CONFIRM_TAG_SEARCH = 'CONFIRM_TAG_SEARCH';


export function collapseMenu(isCollapsed) {
	return {type: MENU_COLLAPSE, isCollapsed}
}

export function initialState() {
	return dispatch => {
		return Promise.resolve()
			// .then(dispatch(beginLoading()))
			.then(dispatch(initialTags()))
			.then(dispatch(initialFiles()));
			// .then(dispatch(addFiles()));
	}
}

function initialTags() {
	return dispatch => {
		dispatch(beginLoading());

		let tagDB = new PouchDB('tags');

		return tagDB.find({
			selector: {
				count: {'$gte': 0}
			}
		}).then(resTags => {

			let tagsSchema = [new schema.Entity('tags', {}, {idAttribute: '_id'})];
			dispatch(loadTags(normalize(resTags.docs, tagsSchema).entities.tags));

		})
	}
}

function loadTags(tags) {
	// console.log(tags)
	return {type: INITIAL_TAGS, tags: tags === undefined ? {} : tags};
}

function initialFiles() {
	return dispatch => {
		let videoDB = new PouchDB('videos');

		return videoDB.find({
			selector: {
				times: {'$gt': 0}
			}
		}).then(res => {
			let filesSchema = [new schema.Entity('files', {}, {idAttribute: '_id'})];
			dispatch(loadFiles(normalize(res.docs, filesSchema).entities.files));
		})
	}
}

function loadFiles(files) {
	return {type: INITIAL_FILES, files};
}

//开始加载
export function beginLoading() {
	return {type: BEGIN_LOADING};
}

//完成加载 files 是对象
export function addFiles(files) {
	return {type: ADD_FILES, files}
}

//筛选出重复的（已经存在的）文件，存入pouchdb，并返回[]
const filterDuplicatedFiles = function (files, dispatch) {
	let videoDB = new PouchDB('videos');
	videoDB.bulkDocs(files).then(results => {
		// console.log(files);
		//The results are returned in the same order as the supplied “docs” array.
		for (let l = results.length, i = l - 1; i >= 0; --i) {
			if (results[i].error === true) {
				files.splice(i, 1);
			}
		}
		console.log(files)
		let fileScheme = {files: [new schema.Entity('files', {}, {idAttribute: '_id'})]};
		dispatch(addFiles(normalize({files: files}, fileScheme).entities.files));
	}).catch((err) => {
		console.log(err)
	});
};

export function searchPath(path) {
	return dispatch => {

		dispatch(beginLoading());

		return Promise.resolve(path).then(recursiveReaddirSync)
			.then(files => {
				filterDuplicatedFiles(files, dispatch);
			})

	}
}

export function openTagModal(item) {
	return {type: OPEN_TAGMODAL, item}
}

export function closeTagModal() {
	return {type: CLOSE_TAGMODAL}
}


export function modifyTags(itemId) {

	return (dispatch, getState) => {
		let previousTags = getState().data.files[itemId].tags;
		let subsequentTags = getState().temp.modifiedTags;

		console.log('prev', previousTags);
		console.log('subs', subsequentTags);

		//如果标签没有实质的变化，则直接关闭
		if(previousTags.sort().toString() === subsequentTags.sort().toString()) {
			dispatch(closeTagModal());
			return Promise.resolve();
		}

		let delTags = [...previousTags];
		let addTags = [...subsequentTags];

		//发送保存tag的action
		dispatch(saveTag());

		XorArray(delTags, addTags);

		let videoDB = new PouchDB('videos', {auto_compaction: true});

		let tagDB = new PouchDB('tags', {auto_compaction: true});
		let _item = getState().data.files[itemId];
		//修改video的tags
		let saveFileTag = function() {
			videoDB.get(_item._id).then(doc => {
				doc.tags = subsequentTags;
				return videoDB.put(doc);
			});
		};

		//根据对前后标签数组进行异或运算，删除的标签count-1
		let savePrevTags = function () {
			delTags.forEach(tag => {
				tagDB.get(tag).then(doc => {
					console.log('prev', doc, doc.count-1);
					tagDB.put({
						_id: tag,
						_rev: doc._rev,
						count: doc.count-1
					})
				});
			});
		};


		//根据对前后标签数组进行异或运算，新增的标签count+1
		let saveSubsTags = function () {
			addTags.forEach((tag) => {
				tagDB.get(tag).then(doc => {
					console.log('sub', doc, doc.count+1);
					return tagDB.put({
						_id: tag,
						_rev: doc._rev,
						count: doc.count+1
					})
				}).catch(err => {
					if(err.name === 'not_found') {
						console.log('没有这个tag，创建新的');
						return tagDB.put({
							_id: tag,
							count: 1
						})
					}
				});

			});
		};


		return Promise.resolve().then(saveFileTag)
			.then(savePrevTags)
			.then(saveSubsTags)
			.then(() => dispatch(saveTagSuccess(itemId, previousTags, subsequentTags)));

	}
}

//改变Tag Select的值
export function changeTag(value) {
	return {type: CHANGE_TAG, value}
}

export function saveTag() {
	return {type: SAVE_TAG};
}

export function saveTagSuccess(itemId, previousTags, subsequentTags) {
	return {type: SAVE_TAG_SUCCESS, itemId, previousTags, subsequentTags}
}

export function toggleTagPopVisible(isVisible) {
	return {type: TAGPOP_VISIBLE, isVisible};
}

export function checkTag(tags) {
	return {type: CHECK_TAG, tags};
}

export function confirmTagSearch(tags) {
	return {type: CONFIRM_TAG_SEARCH, tags}
}

export function filterByTag(tags) {
	return dispatch => {
		dispatch(beginLoading());

		return Promise.resolve().then(() => dispatch(confirmTagSearch(tags)));
	}
}
