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
import {Query} from 'react-apollo';
import gql from 'graphql-tag';
import PropTypes from 'shim/prop-types';

export const GET_REFERENCE = gql`
	query getReference(
		$context: ContentContextInput!,
		$identifier: ID!
	) {
		reference(
			context: $context,
			identifier: $identifier
		) {
			nodeType {
				icon
			}
			identifier
			label
		}
	}
`;

const GetReferenceQuery = ({children, context, identifier}) => (
	<Query
		query={GET_REFERENCE}
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

GetReferenceQuery.propTypes = {
	context: PropTypes.shape({
		workspaceName: PropTypes.string.isRequired,
		invisibleContentShown: PropTypes.bool.isRequired,
		removedContentShown: PropTypes.bool.isRequired,
		inaccessibleContentShown: PropTypes.bool.isRequired
	}),
	identifier: PropTypes.string.isRequired,
	children: PropTypes.func
};

GetReferenceQuery.defaultProps = {
	/* @TODO: Better context handling */
	context: window.Sitegeist.Objects.contentContext,
	children: () => {}
};

export default GetReferenceQuery;
