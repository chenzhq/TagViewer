/**
 * Created by chen on 2017/1/12.
 */
import {combineReducers} from 'redux';
import {INITIAL_TAGS, INITIAL_FILES, ADD_FILES, OPEN_TAGMODAL, CLOSE_TAGMODAL
, SAVE_TAG_SUCCESS} from '../actions/actions';


const files = function (state = {}, action) {
	switch (action.type) {
		// case BEGIN_LOADING:
		// 	return {...state, loading: true};
		case ADD_FILES:
		case INITIAL_FILES:
			// console.log(action);
			return{...state, ...{...action.files}};
		/*case INITIAL_FILES:
			return action.files;*/
		case SAVE_TAG_SUCCESS:
			return {...state, [action.itemId]: modifyItem(state[action.itemId], action)};
		default:
			return state;
	}
};

const modifyItem = function (item, action) {
	return {...item, tags: action.subsequentTags};
}

const selectedItemIds = function (state = [], action) {
	switch (action.type) {
		case OPEN_TAGMODAL:
			return [action.item._id];
		case CLOSE_TAGMODAL:
			return [];
		default:
			return state;
	}
};

const tags = function (state = {}, action) {
	switch (action.type) {
		//首次加载标签，直接返回数据库中的标签
		case INITIAL_TAGS:
			// console.log('初始化tags', action.tags);
			return action.tags;
		case SAVE_TAG_SUCCESS:
			//TODO: 不确定怎么使用对象展开式处理多个值
			// console.log(state);
			let _state = {...state};
			// console.log(_state);
			// console.log(action.previousTags);
			action.previousTags.forEach(tagName => {
				_state = {..._state, [tagName]: {_id: tagName, count: _state[tagName].count-1}}
			});
			// console.log(action.subsequentTags);
			action.subsequentTags.forEach(tagName => {
				_state = {..._state, [tagName]: {_id: tagName, count: _state[tagName] === undefined ? 1 : _state[tagName].count+1}}
			});
			return {..._state};
		default:
			return state;
	}
};


export default combineReducers({
	files,
	tags,
	selectedItemIds
});
