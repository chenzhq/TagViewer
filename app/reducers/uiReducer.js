/**
 * Created by chen on 2017/1/13.
 */
import {combineReducers} from 'redux';
import {MENU_COLLAPSE, BEGIN_LOADING, ADD_FILES, INITIAL_FILES, OPEN_TAGMODAL, CLOSE_TAGMODAL
, SAVE_TAG, SAVE_TAG_SUCCESS, CONFIRM_TAG_SEARCH, TAGPOP_VISIBLE} from '../actions/actions';

const menuCollapsed = function (state = false, action) {
	switch (action.type) {
		case MENU_COLLAPSE:
			return !action.isCollapsed;
		default:
			return state;
	}
};

const tagPopoverVisible = function (state = false, action) {
	switch (action.type) {
		case TAGPOP_VISIBLE:
			return !action.isVisible;
		default:
			return state;
	}
}

const tableLoading = function (state = false, action) {
	switch(action.type) {
		case BEGIN_LOADING:
			return true;
		case ADD_FILES:
		case INITIAL_FILES:
		case CONFIRM_TAG_SEARCH:
			return false;
		default:
			return state;
	}
};

const openTagModal = function (state = false, action) {
	switch (action.type) {
		case OPEN_TAGMODAL:
			return true;
		case CLOSE_TAGMODAL:
		case SAVE_TAG_SUCCESS:
			return false;
		default:
			return state;
	}
};

const tagConfirmLoading = function (state = false, action) {
	switch (action.type) {
		case SAVE_TAG:
			return true;
		case SAVE_TAG_SUCCESS:
			return false;
		default:
			return state;
	}
}

export default combineReducers({
	menuCollapsed,
	tableLoading,
	tagPopoverVisible,
	tagModalVisible: openTagModal,
	tagConfirmLoading
})
