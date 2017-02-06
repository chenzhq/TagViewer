/**
 * Created by chen on 2017/1/31.
 */
'use strict';

export const XorArray = function (prev, subs) {
	for(let i = 0, pLen = prev.length; i < pLen; ++i) {
		for(let j = 0, sLen = subs.length; j < sLen; ++j) {
			if(prev[i] === subs[j]) {
				prev.splice(i--, 1);
				subs.splice(j, 1);
				break;
			}
		}
	}
};

function isContained(a, b){
	if(!(a instanceof Array) || !(b instanceof Array)) return false;
	if(a.length < b.length) return false;
	var aStr = a.toString();
	// console.info(aStr);
	for(var i = 0, len = b.length; i < len; i++){
		// console.info(aStr.indexOf(b[i]));
		if(aStr.indexOf(b[i]) == -1) return false;
	}
	return true;
}

/*根据标签筛选files*/
export const filterByTags = function (files, tags) {
	if(tags.length === 0) {
		return Object.keys(files).map(key => (files[key]));
	}
	let res = [];
	Object.keys(files).forEach(key => {
		// console.log(files[key].tags, tags);
		if(isContained(files[key].tags, tags)) {
			// console.log('contain ', files[key]);
			// return files[key];
			res.push(files[key]);
		}
		// console.log(res);
		// return isContained(arr[index].tags, tags)
	})
	return res;
};
