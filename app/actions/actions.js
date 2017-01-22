/**
 * Created by chen on 2017/1/12.
 */
"use strict";
import readDirRecur from '../utils/RecurFile'
import PouchDB from 'pouchdb/dist/pouchdb.min';
import { normalize, schema } from 'normalizr';
// PouchDB.plugin(require('pouchdb-find'));

export const MODIFY_TAGS = 'MODIFY_TAGS';
export const MENU_COLLAPSE = 'MENU_COLLAPSE';
export const BEGIN_LOADING = 'BEGIN_LOADING';
export const FINISH_LOADING = 'FINISH_LOADING';

export const OPEN_TAGMODAL = 'OPEN_TAGMODAL';
export const CLOSE_TAGMODAL = 'CLOSE_TAGMODAL';
export const CHANGE_TAG = 'CHANGE_TAG';
export const SAVE_TAG = 'SAVE_TAG';
export const SAVE_TAG_SUCCESS = 'SAVE_TAG_SUCESS';



export function collapseMenu(isCollapsed) {
	return {type: MENU_COLLAPSE, isCollapsed}
}

//开始加载
export function beginLoading() {
	return {type: BEGIN_LOADING};
}

//完成加载 files 是对象
export function finishLoading(files) {
	return {type: FINISH_LOADING, files}
}

//筛选出重复的（已经存在的）文件，存入pouchdb，并返回[]
const filterDuplicatedFiles = function (files) {
	let videoDB = new PouchDB('videos');
	videoDB.bulkDocs(files).then(results => {
		//The results are returned in the same order as the supplied “docs” array.
		for (let l = results.length, i = l - 1; i >= 0; --i) {
			if (results[i].error === true) {
				files.splice(i, 1);
			}
		}

		let fileScheme = {files: [new scheme.Entity('files')]};
		return normalize({files: files}, fileScheme).entities.files;
	}).catch((err) => {
		console.log(err)
	});
}

export function addFiles(path) {
	return dispatch => {

		dispatch(beginLoading());

		return readDirRecur(path, function (err, files) {
			if (err) {
				console.error(err);
			}
			dispatch(finishLoading(filterDuplicatedFiles(files)));
		})

	}
}

export function openTagModal(index) {
	return {type: OPEN_TAGMODAL, index}
}

export function closeTagModal() {
	return {type: CLOSE_TAGMODAL}
}

/*const saveTagInDB = function (previousTags, subsequentTags) {
	let videoDB = new PouchDB('videos');
	let tagDB = new PouchDB('tags');
	let _item = getState().data.files[index];

	let saveFileTag = function() { //修改video的tags
		videoDB.upsert(_item._id, doc => {
			doc.tags = subsequentTags;
			return doc;
		});
	}

	let savePrevTags = function () { //根据修改前的tag改变count（-1），--如果为0，则删除
		previousTags.forEach(tag => {
			tagDB.upsert(tag, doc => {
				doc.count--;
				// if(doc.count === 0) {
				// 	doc._deleted = true;
				// }
				return doc;
			})
		});
	}

	let saveSubsTags = function () { //根据修改后的tag改变count（+1），如果没有，则新建
		subsequentTags.forEach((tag) => {
			tagDB.upsert(tag, doc => {
				if (doc === {}) {
					return {_id: tag, count: 1};
				}
				doc.count++;
				return doc;
			}).catch(err => reject(err))
		});
	};

	return new Promise(function (resolve, reject) {

	});

};*/

export function modifyTags(item) {

	return (dispatch, getState) => {
		let previousTags = getState().data.files[fileIndex].tags;
		let subsequentTags = getState().temp.modifiedTags;

		//如果标签没有实质的变化，则直接关闭
		if(previousTags.sort().toString() === subsequentTags.sort().toString()) {
			dispatch(closeTagModal());
			// this.setState({visible: false, item: {}});
			return Promise.resolve();
		}

		//发送保存tag的action
		dispatch(saveTag());

		let videoDB = new PouchDB('videos');
		let tagDB = new PouchDB('tags');
		let _item = getState().data.files[fileIndex];

		//修改video的tags
		let saveFileTag = function() {
			videoDB.upsert(_item._id, doc => {
				doc.tags = subsequentTags;
				return doc;
			});
		};

		//根据修改前的tag改变count（-1），//如果为0，则删除
		let savePrevTags = function () {
			previousTags.forEach(tag => {
				tagDB.upsert(tag, doc => {
					doc.count--;
					// if(doc.count === 0) {
					// 	doc._deleted = true;
					// }
					return doc;
				})
			});
		};

		//根据修改后的tag改变count（+1），如果没有，则新建
		let saveSubsTags = function () {
			subsequentTags.forEach((tag) => {
				tagDB.upsert(tag, doc => {
					if (doc === {}) {
						return {_id: tag, count: 1};
					}
					doc.count++;
					return doc;
				}).catch(err => reject(err))
			});
		};


		return Promise.resolve().then(saveFileTag)
			.then(savePrevTags)
			.then(saveSubsTags)
			.then(() => dispatch(saveTagSuccess(fileIndex, tagIndex)));

	}
}

//改变Tag Select的值
export function changeTag(value) {
	return {type: CHANGE_TAG, value}
}

export function saveTag() {
	return {type: SAVE_TAG};
}

export function saveTagSuccess(fileIndex, tagIndex) {
	return {type: SAVE_TAG_SUCCESS, fileIndex, tagIndex}
}
