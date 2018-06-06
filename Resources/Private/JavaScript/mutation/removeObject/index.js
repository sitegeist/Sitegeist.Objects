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

import {mutation} from '../../core/graphql/gql';

const RemoveObjectMutation = mutation/* GraphQL */`
	mutation removeObject(
		$context: ContentContextInput!,
		$storeIdentifier: ID!,
		$objectIdentifier: ID!
	) {
		store(context: $context, identifier: $storeIdentifier) {
			object(identifier: $objectIdentifier) {
				remove {
					nodeType {
						label
					}
					label
				}
			}
		}
	}
`;

RemoveObjectMutation.propTypes = {
	onCompleted: PropTypes.func,
	context: PropTypes.shape({
		workspaceName: PropTypes.string.isRequired,
		invisibleContentShown: PropTypes.bool.isRequired,
		removedContentShown: PropTypes.bool.isRequired,
		inaccessibleContentShown: PropTypes.bool.isRequired
	}),
	storeIdentifier: PropTypes.string.isRequired,
	objectIdentifier: PropTypes.string.isRequired,
	children: PropTypes.func
};

RemoveObjectMutation.defaultProps = {
	/* @TODO: Better context handling */
	context: window.Sitegeist.Objects.contentContext,
	onCompleted: null,
	children: () => {}
};

export default RemoveObjectMutation;
