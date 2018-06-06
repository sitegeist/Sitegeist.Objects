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

import Select from '../../core/util/select';

import Layout from '../../lib/presentation/layout';

import Header from './header';
import Group from './group';
import Operations from './operations';

/* @TODO: Ad-Hoc styled component */
const Body = styled.div`
	padding: 0 54px!important;
	display: ${props => props.isVisible ? 'block' : 'none'};
`;

export default class DetailView extends Component {
	static propTypes = {
		store: PropTypes.shape({
			identifier: PropTypes.string.isRequired
		}).isRequired,
		object: PropTypes.shape({
			identifier: PropTypes.string,
			icon: PropTypes.string,
			label: PropTypes.string,
			nodeType: PropTypes.shape({
				name: PropTypes.string.isRequired
			}).isRequired
		}).isRequired,
		tabs: PropTypes.array.isRequired,
		transient: PropTypes.object.isRequired
	};

	render() {
		const {store, object, tabs, transient} = this.props;

		return (
			<Select
				allItems={tabs}
				persistent={`detailView-tabs-${object.identifier}`}
			>
				{tabs => (
					<Layout
						renderHeader={() => (
							<Header
								tabs={tabs.map(tab => ({
									...tab,
									hasChanges: tab.groups.some(
										group => group.properties.some(
											property => Boolean(transient.get(property.name))
										)
									)
								}))}
								object={object}
							/>
						)}
						renderBody={() => tabs.map(tab => (
							<Body key={tab.name} isVisible={tab.isSelected}>
								{tab.groups.map(group => (
									<Group
										key={group.name}
										store={store}
										object={object}
										transient={transient}
										{...group}
									/>
								))}
							</Body>
						))}
						renderFooter={() => (
							<Operations
								store={store}
								object={object}
								transient={transient}
							/>
						)}
					/>
				)}
			</Select>
		);
	}
}
