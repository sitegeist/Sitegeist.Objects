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

export const GET_DETAIL = gql`
	query getDetail($context: ContentContextInput!, $storeIdentifier: ID!, $objectIdentifier: ID, $nodeType: String) {
		store(context: $context, identifier: $storeIdentifier) {
			objectDetail(nodeType: $nodeType, identifier: $objectIdentifier) {
				object {
					identifier
					parents {
						type
						identifier
						icon
						label
					}
					icon
					label
					nodeType {
						name
					}
				}
				tabs {
					name
					icon
					label
					groups {
						name
						icon
						label
						properties {
							name
							label
							value
							editor
						}
					}
				}
			}
		}
	}
`;

const GetDetailQuery = ({children, context, nodeType, storeIdentifier, objectIdentifier}) => (
	<Query
		query={GET_DETAIL}
		variables={{context, nodeType, storeIdentifier, objectIdentifier}}
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

GetDetailQuery.propTypes = {
	context: PropTypes.shape({
		workspaceName: PropTypes.string.isRequired,
		invisibleContentShown: PropTypes.bool.isRequired,
		removedContentShown: PropTypes.bool.isRequired,
		inaccessibleContentShown: PropTypes.bool.isRequired
	}),
	storeIdentifier: PropTypes.string.isRequired,
	nodeType: PropTypes.string,
	objectIdentifier: PropTypes.string,
	children: PropTypes.func
};

GetDetailQuery.defaultProps = {
	/* @TODO: Better context handling */
	context: window.Sitegeist.Objects.contentContext,
	nodeType: null,
	objectIdentifier: null,
	children: () => {}
};

export default GetDetailQuery;
