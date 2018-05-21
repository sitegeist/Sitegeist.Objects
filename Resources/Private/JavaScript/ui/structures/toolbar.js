/*
 * Copyright notice
 *
 * (c) 2018 Wilhelm Behncke <behncke@sitegeist.de>
 * All rights reserved
 *
 * This file is part of the Sitegeist/Objects project under GPL-3.0.
 *
 * For the full copyright and license information, please read the
 * LICENSE.md file that was distributed with this source code.
 */
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import Icon from '../../ui/primitives/icon';
import Button from '../../ui/primitives/button';

import SelectBox from './selectBox';

const ToolbarButton = styled(Button)`
	${props => props.isActive && `
		color: #00b5ff!important;
		&:hover {
			color: #fff!important;
		}
	`}
`;

const renderItem = item => {
	switch (item.type) {
		case 'button':
			return (
				<ToolbarButton
					key={item.name}
					isActive={item.isActive}
					onMouseDown={event => {
						event.preventDefault();
						item.action();
					}}
					title={item.label}
				>
					<Icon className={item.icon}/>
				</ToolbarButton>
			);

		case 'select': {
			const initialItem = item.items.filter(selectItem => selectItem.isActive)[0] || item.items[0];

			return (
				<SelectBox
					key={item.name}
					allItems={item.items.map(selectItem => ({
						name: selectItem.name,
						data: selectItem
					}))}
					value={initialItem.name}
					onChange={selectedItem => selectedItem.data.action()}
				/>
			);
		}

		default:
			throw new Error(`Cannot render Toolbar item of type "${item.type}"`);
	}
};

const Container = styled.div``;
const Group = styled.div`
	display: inline-block;
	margin-right: 5px!important;
`;

const Toolbar = ({groups, renderItem}) => (
	<Container>
		{groups.map(group => (
			<Group key={group.name}>
				{group.items.map(renderItem)}
			</Group>
		))}
	</Container>
);

Toolbar.defaultProps = {
	renderItem
};

export default Toolbar;
