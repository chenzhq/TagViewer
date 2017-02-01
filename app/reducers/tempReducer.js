/**
 * Created by chen on 2017/1/19.
 */
import {combineReducers} from 'redux';
import {CHANGE_TAG, SAVE_TAG_SUCCESS, OPEN_TAGMODAL} from '../actions/actions';

const changeTag = function (state = [], action) {
	switch (action.type) {
		case OPEN_TAGMODAL:
			return action.item.tags;
		case CHANGE_TAG:
			// console.log('change tag ', action.value);
			return action.value;
		case SAVE_TAG_SUCCESS:
			return [];
		default:
			return state;
	}
};

export default combineReducers({
	modifiedTags: changeTag
})
