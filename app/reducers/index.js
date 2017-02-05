/**
 * Created by chen on 2017/1/12.
 */
import {combineReducers} from 'redux';
import ui from './uiReducer'
import loadFiles from './tableContent'
import temp from './tempReducer';
import filter from './filterReducer';

export default combineReducers({
	ui,
	data: loadFiles,
	filter,
	temp
})
