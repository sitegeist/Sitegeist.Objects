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

export const GET_REFERENCES = gql`
	query getReferences(
		$context: ContentContextInput!,
		$search: String!,
		$searchRoot: ID,
		$nodeType: String,
		$directChildrenOnly: Boolean
	) {
		references(
			context: $context,
			search: $search,
			searchRoot: $searchRoot,
			nodeType: $nodeType,
			directChildrenOnly: $directChildrenOnly
		) {
			nodeType {
				icon
			}
			identifier
			label
		}
	}
`;

const GetReferencesQuery = ({children, context, search, searchRoot, nodeType, directChildrenOnly}) => (
	<Query
		query={GET_REFERENCES}
		variables={{context, search, searchRoot, nodeType, directChildrenOnly}}
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

GetReferencesQuery.propTypes = {
	context: PropTypes.shape({
		workspaceName: PropTypes.string.isRequired,
		invisibleContentShown: PropTypes.bool.isRequired,
		removedContentShown: PropTypes.bool.isRequired,
		inaccessibleContentShown: PropTypes.bool.isRequired
	}),
	search: PropTypes.string.isRequired,
	searchRoot: PropTypes.string,
	nodeType: PropTypes.string,
	directChildrenOnly: PropTypes.bool,
	children: PropTypes.func
};

GetReferencesQuery.defaultProps = {
	/* @TODO: Better context handling */
	context: window.Sitegeist.Objects.contentContext,
	searchRoot: null,
	nodeType: null,
	directChildrenOnly: null,
	children: () => {}
};

export default GetReferencesQuery;
