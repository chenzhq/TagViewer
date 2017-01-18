/**
 * Created by chen on 2017/1/13.
 */
import {combineReducers} from 'redux';
import {MENU_COLLAPSE} from '../actions/actions';

const menuCollapsed = function (state = false, action) {
	switch (action.type) {
		case MENU_COLLAPSE:
			return !action.isCollapsed;
		default:
			return state;
	}
};

export default combineReducers(
	menuCollapsed
)
