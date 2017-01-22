/**
 * Created by chen on 2017/1/12.
 */
import {combineReducers} from 'redux';
import {BEGIN_LOADING, FINISH_LOADING, OPEN_TAGMODAL, CLOSE_TAGMODAL
, SAVE_TAG_SUCCESS} from '../actions/actions';


const files = function (state = {}, action) {
	switch (action.type) {
		// case BEGIN_LOADING:
		// 	return {...state, loading: true};
		case FINISH_LOADING:
			return action.files;
		case SAVE_TAG_SUCCESS:
			return {...state, files: action.files};
		default:
			return state;
	}
};

const selectedItemIds = function (state = [], action) {
	switch (action.type) {
		case OPEN_TAGMODAL:
			return [action._id];
		case CLOSE_TAGMODAL:
			return [];
		default:
			return state;
	}
};

const tags = function (state = [], action) {
	switch (action.type) {
		case SAVE_TAG_SUCCESS:
			return action;
		default:
			return state;
	}
}

export default combineReducers({
	files,
	tags,
	selectedItemIds
});
