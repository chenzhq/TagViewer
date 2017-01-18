/**
 * Created by chen on 2017/1/12.
 */
import {combineReducers} from 'redux';
import {OPEN_FOLDER, FINISH_LOADING} from '../actions/actions';


const loadFiles = function (state = {}, action) {
	switch (action.type) {
		case OPEN_FOLDER:
			return {...state, loading: true};
		case FINISH_LOADING:
			return {...state, data: action.files, loading: false};
		default:
			return state;
	}
}

export default loadFiles;
