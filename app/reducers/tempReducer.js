/**
 * Created by chen on 2017/1/19.
 */
import {combineReducers} from 'redux';
import {CHANGE_TAG} from '../actions/actions';

const changeTag = function (state = [], action) {
	switch (action.type) {
		case CHANGE_TAG:
			return action.value;
		default:
			return state;
	}
};

export default combineReducers({
	modifiedTags: changeTag
})
