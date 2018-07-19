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
import styled from 'shim/styled-components';

import Icon from '../../../lib/presentation/primitives/icon';
import Editor from '../../../lib/presentation/structures/editor';

import ReferencesQuery from '../../../query/references';

const {React, PropTypes} = window.Sitegeist.Objects.runtime;
const {Component} = window.Sitegeist.Objects.runtime.React;

const Grid = styled.div`
	display: flex;
	flex-wrap: wrap;
`;

const GridItem = styled.div`
	width: 33.3333%;
	display: flex;
	align-items: center;
	margin-bottom: .4rem!important;

	* {
		display: inline-block;
		margin-right: .4rem!important;
	}
`;

window.Sitegeist.Objects.plugin.registerEditor('ReferencesCheckbox', class ReferencesCheckboxEditor extends Component {
	handleChange = event => {
		const {commit, value} = this.props;

		if (event.target.checked) {
			commit([...(value || []), event.target.value]);
		} else {
			commit((value || []).filter(identifier => identifier !== event.target.value));
		}
	};

	render() {
		const value = this.props.value || [];
		const options = this.props.options || {};

		return (
			<Editor {...this.props}>
				<Grid>
					<ReferencesQuery
						searchRootIdentifier={options.searchRootIdentifier}
						searchRootPath={options.searchRootPath}
						nodeType={options.nodeType}
					>
						{({references}) => references.map(reference => (
							<GridItem key={reference.identifier}>
								<input
									type="checkbox"
									onChange={this.handleChange}
									value={reference.identifier}
									checked={value.includes(reference.identifier)}
								/>
								<Icon className={reference.nodeType.icon}/>
								{reference.label}
							</GridItem>
						))}
					</ReferencesQuery>
				</Grid>
			</Editor>
		);
	}
});
