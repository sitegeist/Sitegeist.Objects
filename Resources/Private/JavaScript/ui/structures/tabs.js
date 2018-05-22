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
import React from 'shim/react';
import PropTypes from 'shim/prop-types';

import Condition from '../../core/util/condition';
import Select from '../../core/util/select';

import Icon from '../../ui/primitives/icon';
import Button from '../../ui/primitives/button';
import ButtonList from '../../ui/primitives/buttonList';

const Tabs = ({tabs, children, persistent}) => (
	<Select allItems={tabs.map(({name, ...data}) => ({name, data}))} persistent={persistent}>
		{({isSelected, selectedItem, select}) => (
			<React.Fragment>
				{children({
					...selectedItem.data,
					name: selectedItem.name,
					renderTabsHeader: () => (
						<ButtonList>
							{tabs.map(tab => (
								<Button
									key={tab.name}
									className={isSelected(tab.name) ? 'neos-active' : ''}
									onClick={() => select(tab.name)}
								>
									<Condition condition={Boolean(tab.icon)}>
										<Icon className={tab.icon}/>
									</Condition>
									{tab.label}
								</Button>
							))}
						</ButtonList>
					)
				})}
			</React.Fragment>
		)}
	</Select>
);

Tabs.propTypes = {
	tabs: PropTypes.arrayOf(PropTypes.shape({
		name: PropTypes.string.isRequired,
		label: PropTypes.string.isRequired,
		icon: PropTypes.string
	})).isRequired,
	children: PropTypes.func.isRequired,
	persistent: PropTypes.string
};

Tabs.defaultProps = {
	persistent: null
};

export default Tabs;
