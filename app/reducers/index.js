/**
 * Created by chen on 2017/1/12.
 */
import {combineReducers} from 'redux';
import ui from './uiReducer'
import loadFiles from './tableContent'

export default combineReducers({
	ui,
	loadFiles
})
