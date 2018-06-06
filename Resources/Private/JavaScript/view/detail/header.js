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

import Bar from '../../lib/presentation/primitives/bar';
import Icon from '../../lib/presentation/primitives/icon';
import Button from '../../lib/presentation/primitives/button';
import ButtonList from '../../lib/presentation/primitives/buttonList';

import PreviewObject from '../../actions/previewObject';

export default class Header extends Component {
	static propTypes = {
		tabs: PropTypes.arrayOf(PropTypes.shape({
			name: PropTypes.string.isRequired,
			isSelected: PropTypes.bool.isRequired,
			hasChanges: PropTypes.bool.isRequired,
			icon: PropTypes.string,
			label: PropTypes.string
		})).isRequired,
		object: PropTypes.object.isRequired
	};

	render() {
		const {tabs, object} = this.props;

		return (
			<Bar>
				<ButtonList>
					{tabs.map(tab => (
						<Button
							key={tab.name}
							className={tab.isSelected ? 'neos-active' : ''}
							onClick={tab.select}
							hasChanges={tab.hasChanges}
						>
							{tab.icon ? (<Icon className={tab.icon}/>) : null}
							{tab.label}
						</Button>
					))}
				</ButtonList>
				<ButtonList>
					<PreviewObject object={object}/>
				</ButtonList>
			</Bar>
		);
	}
}
