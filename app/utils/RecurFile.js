/**
 * Created by chen on 2017/01/06.
 */
const {readdir, stat, readdirSync, lstatSync} = require("fs");
const path = require("path");

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
				} else {
					let video = {
						"_id": filePath,
						"name": file,
						"size": (stats.size/1024/1024).toFixed(2)+' MB',
						"tags": [],
						"times": 1
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
	let list = []
		, files = readdirSync(_path)
		, stats
		;

	files.forEach(function (file) {
		stats = lstatSync(path.join(_path, file));
		if(stats.isDirectory()) {
			list = list.concat(recursiveReaddirSync(path.join(_path, file)));
		} else {
			let video = {
				"_id": path.join(_path, file),
				"name": file,
				"size": (stats.size/1024/1024).toFixed(2)+' MB',
				"tags": [],
				"times": 0
			};
			list.push(video);
		}
	});
	return list;
}

