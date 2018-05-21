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
import {Mutation} from 'react-apollo';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';

import convertProperties from '../../core/plugin/converterManager';

export const CREATE_OBJECT = gql`
	mutation createObject(
		$context: ContentContextInput!,
		$storeIdentifier: ID!,
		$nodeType: String!,
		$properties: JSON!
	) {
		store(context: $context, identifier: $storeIdentifier) {
			createObject(nodeType: $nodeType, properties: $properties) {
				nodeType {
					label
				}
				identifier
				label
			}
		}
	}
`;

const CreateObjectMutation = ({onCompleted, context, storeIdentifier, nodeType, children}) => (
	<Mutation mutation={CREATE_OBJECT} onCompleted={onCompleted}>
		{(mutation, {loading, called, data}) => children({
			result: {loading, called, data},
			createObject: async rawProperties => {
				const properties = await convertProperties(rawProperties);

				mutation({
					variables: {context, storeIdentifier, nodeType, properties}
				});
			}
		})}
	</Mutation>
);

CreateObjectMutation.propTypes = {
	onCompleted: PropTypes.func,
	context: PropTypes.shape({
		workspaceName: PropTypes.string.isRequired,
		invisibleContentShown: PropTypes.bool.isRequired,
		removedContentShown: PropTypes.bool.isRequired,
		inaccessibleContentShown: PropTypes.bool.isRequired
	}),
	storeIdentifier: PropTypes.string.isRequired,
	nodeType: PropTypes.string.isRequired,
	children: PropTypes.func
};

CreateObjectMutation.defaultProps = {
	/* @TODO: Better context handling */
	context: window.Sitegeist.Objects.contentContext,
	onCompleted: null,
	children: () => {}
};

export default CreateObjectMutation;
