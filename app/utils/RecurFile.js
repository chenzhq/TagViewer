/**
 * Created by chen on 2017/01/06.
 */
const {readdir, stat, readdirSync, lstatSync} = require('fs');
const path = require('path');

import isVideo from './isVideo';

export function readdirRecur(_path, callback) {
	'use strict';
	let list = [];

	readdir(_path, function(err, files) {
		if (err) {
			return callback(err);
		}

		let pending = files.length;
		if (!pending) {
			// we are done, woop woop
			return callback(null, list);
		}

		files.forEach(function(file) {
			let filePath = path.join(_path, file);
			stat(filePath, function(_err, stats) {
				if (_err) {
					return callback(_err);
				}

				if (stats.isDirectory()) {
					readdirRecur(filePath, function (__err, res) {
						if (__err) {
							return callback(__err);
						}

						list = list.concat(res);
						pending -= 1;

						// event.sender.send('onedir-get', filePath);
						if (!pending) {
							return callback(null, list);
						}
					});
				} else if(isVideo(file)){
					console.log(file)
					let sizeKB = stats.size/1024;
					let video = {
						'_id': filePath,
						'name': file,
						'size': sizeKB > 1024 ? (sizeKB*1024).toFixed(2)+' MB' : sizeKB + ' KB',
						'tags': [],
						'times': 0,
						'description': ''
					};
					list.push(video);
					pending -= 1;
					// event.sender.send('onefile-get', filePath);
					if (!pending) {
						return callback(null, list);
					}
				}

			});
		});
	});
}

export function recursiveReaddirSync(_path) {
	console.log('begin read');
	let list = []
		, files = readdirSync(_path)
		, stats
		;

	files.forEach(function (file) {
		stats = lstatSync(path.join(_path, file));
		if(stats.isDirectory()) {
			list = list.concat(recursiveReaddirSync(path.join(_path, file)));
		} else if(isVideo(file)){
			let sizeKB = stats.size/1024;
			let video = {
				'_id': path.join(_path, file),
				'name': file,
				'size': sizeKB > 1024 ? (sizeKB/1024).toFixed(2)+' MB' : sizeKB.toFixed(2) + ' KB',
				'tags': [],
				'times': 0
			};
			list.push(video);
		}
	});
	console.log('end read');
	return list;
}
