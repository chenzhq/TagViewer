/**
 * Created by chen on 2017/1/12.
 */
"use strict";
import readDirRecur from '../utils/RecurFile'
import PouchDB from 'pouchdb/dist/pouchdb.min';
// PouchDB.plugin(require('pouchdb-find'));

export const OPEN_FOLDER = 'OPEN_FOLDER';
export const SEARCH_FILES = 'SEARCH_FILES';
export const MODIFY_TAGS = 'MODIFY_TAGS';
export const MENU_COLLAPSE = 'MENU_COLLAPSE';
export const FILES_LOADING = 'FILES_LOADING';
export const FINISH_LOADING = 'FINISH_LOADING';

export const OPEN_TAGMODAL = 'OPEN_TAGMODAL';


export function modifyTags(id) {
	return {type: MODIFY_TAGS, id};
}

export function collapseMenu(isCollapsed) {
	return {type: MENU_COLLAPSE, isCollapsed}
}

//开始加载
export function filesLoading() {
	return {type: FILES_LOADING};
}

//完成加载
export function finishLoading(files) {
	return {type: FINISH_LOADING, files}
}

//筛选出重复的（已经存在的）文件
const filterDuplicatedFiles = function (files) {
	let videoDB = new PouchDB('videos');
	videoDB.bulkDocs(files).then(results => {
		//The results are returned in the same order as the supplied “docs” array.
		for (let l = results.length, i = l - 1; i >= 0; --i) {
			if (results[i].error === true) {
				files.splice(i, 1);
			}
		}
		return files;
	}).catch((err) => {
		console.log(err)
	});
}

export function addFiles(path) {
	return dispatch => {

		dispatch(filesLoading());

		return readDirRecur(path, function (err, files) {
			if (err) {
				console.error(err);
			}
			dispatch(finishLoading(filterDuplicatedFiles(files)));
		})

	}
}

export function openTagModal(_id) {
	return {type: OPEN_TAGMODAL, _id}
}
