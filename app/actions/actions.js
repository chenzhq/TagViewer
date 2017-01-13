/**
 * Created by chen on 2017/1/12.
 */

export const OPEN_FOLDER = 'OPEN_FOLDER';
export const SEARCH_FILES = 'SEARCH_FILES';
export const MODIFY_TAGS = 'MODIFY_TAGS';
export const MENU_COLLAPSE = 'MENU_COLLAPSE';


export function searchFilse(files) {
	return {type: SEARCH_FILES, files};
}

export function modifyTags(id) {
	return {type: MODIFY_TAGS, id};
}

export function collapseMenu(isCollapsed) {
	return {type: MENU_COLLAPSE, isCollapsed}
}
