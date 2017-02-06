/**
 * Created by chen on 2017/2/2.
 */
'use strict';

import {combineReducers} from 'redux';
import {CONFIRM_TAG_SEARCH} from '../actions/actions';

const tags = function(state = [], action) {
	switch (action.type) {
		case CONFIRM_TAG_SEARCH:
			console.log(action);
			return action.tags;
		default:
			return state;
	}
};

export default combineReducers({
	tags
})
