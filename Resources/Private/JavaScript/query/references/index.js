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
import PropTypes from 'shim/prop-types';

import {query} from '../../core/graphql/gql';

const GetReferencesQuery = query/* GraphQL */`
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
			searchRootIdentifier: $searchRoot,
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
