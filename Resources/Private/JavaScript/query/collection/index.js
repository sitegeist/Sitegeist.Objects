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

const GetCollectionQuery = query/* GraphQL */`
	query getCollection(
		$context: ContentContextInput!,
		$storeIdentifier: ID!,
		$objectIdentifier: ID,
		$nodeType: String,
		$collectionName: String!
	) {
		store(context: $context, identifier: $storeIdentifier) {
			objectDetail(nodeType: $nodeType, identifier: $objectIdentifier) {
				object {
					nodeType {
						icon
						name
						label
						allowedGrandChildNodeTypes(name: $collectionName) {
							name
							label
						}
					}
				}
				collection(name: $collectionName) {
					objectDetails {
						object {
							isHidden
							identifier
							icon
							label
							nodeType {
								name
							}
						}
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

GetCollectionQuery.propTypes = {
	context: PropTypes.shape({
		workspaceName: PropTypes.string.isRequired,
		invisibleContentShown: PropTypes.bool.isRequired,
		removedContentShown: PropTypes.bool.isRequired,
		inaccessibleContentShown: PropTypes.bool.isRequired
	}),
	storeIdentifier: PropTypes.string.isRequired,
	objectIdentifier: PropTypes.string,
	nodeType: PropTypes.string,
	collectionName: PropTypes.string.isRequired,
	children: PropTypes.func
};

GetCollectionQuery.defaultProps = {
	/* @TODO: Better context handling */
	context: window.Sitegeist.Objects.contentContext,
	objectIdentifier: null,
	nodeType: null,
	children: () => {}
};

export default GetCollectionQuery;
