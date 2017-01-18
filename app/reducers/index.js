/**
 * Created by chen on 2017/1/12.
 */
import {combineReducers} from 'redux';
import menuCollapsed from './menuCollapse'
import loadFiles from './tableContent'

export default combineReducers({
	menuCollapsed,
	loadFiles
})
