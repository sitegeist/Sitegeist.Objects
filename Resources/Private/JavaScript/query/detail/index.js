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

const GetDetailQuery = query/* GraphQL */`
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
					hasUnpublishedChanges
					previewUri
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
							editorOptions
						}
					}
				}
			}
		}
	}
`;

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
