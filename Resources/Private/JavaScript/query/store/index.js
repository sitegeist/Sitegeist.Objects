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
import {Query} from 'react-apollo';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';

export const GET_STORE = gql`
	query getStore($context: ContentContextInput!, $identifier: ID!) {
		store(context: $context, identifier: $identifier) {
			identifier
			icon
			label
			title
			description
			parents {
				identifier
				icon
				label
			}
			objectIndex {
				tableHeads {
					name
					label
				}
				tableRows {
					object {
						identifier
						icon
						label
					}
					tableCells {
						value
					}
				}
			}
		}
	}
`;

const GetStoreQuery = ({children, context, identifier}) => (
	<Query
		query={GET_STORE}
		variables={{context, identifier}}
	>
		{({loading, error, data}) => {
			//
			// @TODO: Better load handling
			//
			if (loading) {
				return 'Loading...';
			}
			if (error) {
				return `Error: ${error}`;
			}

			return children(data);
		}}
	</Query>
);

GetStoreQuery.propTypes = {
	context: PropTypes.shape({
		workspaceName: PropTypes.string.isRequired,
		invisibleContentShown: PropTypes.bool.isRequired,
		removedContentShown: PropTypes.bool.isRequired,
		inaccessibleContentShown: PropTypes.bool.isRequired
	}),
	identifier: PropTypes.string.isRequired,
	children: PropTypes.func.isRequired
};

GetStoreQuery.defaultProps = {
	context: window.Sitegeist.Objects.contentContext
};

export default GetStoreQuery;
