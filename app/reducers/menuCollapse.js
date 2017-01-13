/**
 * Created by chen on 2017/1/13.
 */
import {MENU_COLLAPSE} from '../actions/actions';

export default function (state = false, action) {
	switch (action.type) {
		case MENU_COLLAPSE:
			return !action.isCollapsed;
		default:
			return state
	}
}
