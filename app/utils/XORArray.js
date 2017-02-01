/**
 * Created by chen on 2017/1/31.
 */

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

