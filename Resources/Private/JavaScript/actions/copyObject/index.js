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
import React, {Component} from 'shim/react';
import PropTypes from 'shim/prop-types';

import History from '../../core/history';
import {mutation} from '../../core/graphql/gql';

import Button from '../../ui/primitives/button';
import Icon from '../../ui/primitives/icon';

const CopyObjectMutation = mutation/* GraphQL */`
	mutation copyObject(
		$context: ContentContextInput!,
		$storeIdentifier: ID!,
		$objectIdentifier: ID!
	) {
		store(context: $context, identifier: $storeIdentifier) {
			object(identifier: $objectIdentifier) {
				copy {
					nodeType {
						label
					}
					identifier
					label
				}
			}
		}
	}
`;

CopyObjectMutation.defaultProps = {
	/* @TODO: Better context handling */
	context: window.Sitegeist.Objects.contentContext
};

export default class CopyObject extends Component {
	static propTypes = {
		storeIdentifier: PropTypes.string.isRequired,
		object: PropTypes.shape({
			identifier: PropTypes.string.isRequired
		}).isRequired,
		renderAction: PropTypes.func,
		onCompleted: PropTypes.func
	};

	static defaultProps = {
		renderAction: execute => (
			<Button onClick={execute}>
				<Icon className="icon-copy"/>
				{/* @TODO: I18n */}
				Kopieren
			</Button>
		),
		onCompleted: (store, {goTo}) => goTo(`/store/${store.identifier}/edit/${store.object.copy.identifier}`)
	};

	render() {
		const {storeIdentifier, object, renderAction, onCompleted} = this.props;

		return (
			<History>
				{history => (
					<CopyObjectMutation
						storeIdentifier={storeIdentifier}
						objectIdentifier={object.identifier}
						onCompleted={({store}) => onCompleted({...store, identifier: storeIdentifier}, history)}
					>
						{({execute}) => renderAction(() => execute(), this.props)}
					</CopyObjectMutation>
				)}
			</History>
		);
	}
}
