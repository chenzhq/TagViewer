/**
 * Created by chen on 2017/2/1.
 */
'use strict';

import React, {PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {checkTag, filterByTag} from '../actions/actions';
import {Card, Checkbox, Tag, Tooltip, Button} from 'antd';
const CheckboxGroup = Checkbox.Group;

class TagPop extends React.Component {
	constructor(props) {
		super(props);
		const {dispatch} = props;

		this.checkboxChange = checkedTagName => {
			dispatch(checkTag(checkedTagName));
		}

		this.searchBtnClick = () => {

		}
	}

	render() {
		const {tags, tempTags} = this.props;
		const {checkboxChange,searchBtnClick} = this.props;
		const tempTagsDiv = (
			<div>
				{
					tempTags.map((tag) => {
						const isLongTag = tag.length > 10;
						const tagElem = (
							<Tag
								key={tag}>
								{isLongTag ? `${tag.slice(0, 10)}...` : tag}
							</Tag>
						);
						return isLongTag ? <Tooltip title={tag}>{tagElem}</Tooltip> : tagElem;
					})
				}
			</div>
		);
		return (
			<Card title={tempTagsDiv} extra={<a href="#">Clear</a>} style={{ width: 300 }}>
				<CheckboxGroup options={tags} onChange={(checkedTagName) => checkboxChange(checkedTagName)}/>
				<Button type="primary" icon="search" onClick={() => searchBtnClick(tempTags)}>搜索</Button>
			</Card>
		)
	}
}

const mapStateToProps = state => {
	const {temp, filter, data} = state;
	return {
		tags: Object.keys(data.tags).map(key => (data.tags[key]._id)),
		tempTags: temp.selectedTags,
		confirmTags: filter.selectedTags
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		dispatch: dispatch,
		checkboxChange: bindActionCreators(checkTag, dispatch),
		searchBtnClick: bindActionCreators(filterByTag, dispatch)
	}
}

TagPop.propTypes = {
	tags: PropTypes.arrayOf(PropTypes.string),
	tempTags: PropTypes.arrayOf(PropTypes.string),
	confirmTags: PropTypes.arrayOf(PropTypes.string),

	checkboxChange: PropTypes.func.isRequired,
	searchBtnClick: PropTypes.func.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(TagPop);
