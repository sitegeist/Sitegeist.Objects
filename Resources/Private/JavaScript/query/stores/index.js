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

export const GET_STORES = gql`
	query getStores($context: ContentContextInput!) {
		stores(context: $context) {
			identifier
			icon
			label
			title
			description
		}
	}
`;

const GetStoresQuery = ({children, context}) => (
	<Query
		query={GET_STORES}
		variables={{context}}
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

GetStoresQuery.propTypes = {
	context: PropTypes.shape({
		workspaceName: PropTypes.string.isRequired,
		invisibleContentShown: PropTypes.bool.isRequired,
		removedContentShown: PropTypes.bool.isRequired,
		inaccessibleContentShown: PropTypes.bool.isRequired
	}),
	children: PropTypes.func.isRequired
};

GetStoresQuery.defaultProps = {
	context: window.Sitegeist.Objects.contentContext
};

export default GetStoresQuery;
