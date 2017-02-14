/**
 * Created by chen on 2017/1/12.
 */
import {createStore, applyMiddleware} from 'redux';
import PouchDB from 'pouchdb/dist/pouchdb.min';
import ReduxThunk from 'redux-thunk';
// import createLogger from 'redux-logger';
import rootReducer from '../reducers/index'
// import { normalize, schema } from 'normalizr';
PouchDB.plugin(require('pouchdb-find'));





const initialState = {
	data: {
		files: {},
		tags: {},
		selectedItemIds: []
	},
	filter: {
		tags: []
	},
	temp: {
		modifiedTags: [],
		//按标签搜索的缓存
		selectedTags: []
	},
	ui: {
		//表格加载
		tableLoading: false,
		//修改标签对话框
		tagModalVisible: false,
		//搜素标签气泡卡片
		tagPopoverVisible: false,
		menuCollapsed: false,
		tagConfirmLoading: false
	}
};

export default function configureStore() {
	const store = createStore(rootReducer, initialState, applyMiddleware(ReduxThunk));

	return store;
}
