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
import React, {Component} from 'shim/react';
import PropTypes from 'shim/prop-types';
import styled from 'shim/styled-components';

import Icon from '../primitives/icon';

const List = styled.ul`
	list-style-type: circle;
	padding-left: 16px!important;
	margin: 16px 0!important;

	li {
		display: flex;
		align-items: center;
		margin-bottom: 8px;
	}

	${Icon} {
		margin-right: 10px;
	}
`;

export default class NodeList extends Component {
	static propTypes = {
		items: PropTypes.arrayOf(PropTypes.shape({
			identifier: PropTypes.string.isRequired,
			icon: PropTypes.string,
			label: PropTypes.string.isRequired,
		})).isRequired
	};

	render() {
		const {items} = this.props;

		return (
			<List>
				{items.map(item => (
					<li key={item.identifier}>
						<Icon className={item.icon}/>
						{item.label}
					</li>
				))}
			</List>
		);
	}
}
