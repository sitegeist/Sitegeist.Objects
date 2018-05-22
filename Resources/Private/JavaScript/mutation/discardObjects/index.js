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
import {Mutation} from 'react-apollo';
import gql from 'graphql-tag';
import PropTypes from 'shim/prop-types';

export const DISCARD_OBJECTS = gql`
	mutation discardObjects(
		$context: ContentContextInput!,
		$storeIdentifier: ID!,
		$objectIdentifiers: [ID!]!
	) {
		store(context: $context, identifier: $storeIdentifier) {
			objects(identifiers: $objectIdentifiers) {
				discard {
					nodeType {
						label
					}
					label
				}
			}
		}
	}
`;

const DiscardObjectsMutation = ({onCompleted, context, storeIdentifier, objectIdentifiers, children}) => (
	<Mutation mutation={DISCARD_OBJECTS} onCompleted={onCompleted}>
		{(mutation, {loading, called, data}) => children({
			result: {loading, called, data},
			discardObjects: () => mutation({
				variables: {context, storeIdentifier, objectIdentifiers}
			})
		})}
	</Mutation>
);

DiscardObjectsMutation.propTypes = {
	onCompleted: PropTypes.func,
	context: PropTypes.shape({
		workspaceName: PropTypes.string.isRequired,
		invisibleContentShown: PropTypes.bool.isRequired,
		removedContentShown: PropTypes.bool.isRequired,
		inaccessibleContentShown: PropTypes.bool.isRequired
	}),
	storeIdentifier: PropTypes.string.isRequired,
	objectIdentifiers: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
	children: PropTypes.func
};

DiscardObjectsMutation.defaultProps = {
	/* @TODO: Better context handling */
	context: window.Sitegeist.Objects.contentContext,
	onCompleted: null,
	children: () => {}
};

export default DiscardObjectsMutation;
