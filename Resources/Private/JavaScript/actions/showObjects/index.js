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
import {publishFlashMessage} from '../../core/flashMessage';

import Button from '../../ui/primitives/button';
import Icon from '../../ui/primitives/icon';

const ShowObjectsMutation = mutation/* GraphQL */`
	mutation showObjects(
		$context: ContentContextInput!,
		$storeIdentifier: ID!,
		$objectIdentifiers: [ID!]!
	) {
		store(context: $context, identifier: $storeIdentifier) {
			objects(identifiers: $objectIdentifiers) {
				show {
					identifier
					label
				}
			}
		}
	}
`;

ShowObjectsMutation.defaultProps = {
	/* @TODO: Better context handling */
	context: window.Sitegeist.Objects.contentContext
};

export default class ShowObjects extends Component {
	static propTypes = {
		store: PropTypes.shape({
			identifier: PropTypes.string.isRequired
		}).isRequired,
		objects: PropTypes.arrayOf(PropTypes.shape({
			identifier: PropTypes.string.isRequired,
			icon: PropTypes.string,
			label: PropTypes.string.isRequired,
		})).isRequired,
		renderAction: PropTypes.func,
		onCompleted: PropTypes.func
	};

	static defaultProps = {
		renderAction: (execute, {objects}) => (
			<Button onClick={execute}>
				<Icon className="icon-eye"/>
				{/* @TODO: I18n */}
				Anzeigen{objects.length > 1 ? ` (${objects.length})` : ''}
			</Button>
		),
		onCompleted: (_, {goTo}, {objects, store}) => {
			publishFlashMessage({
				severity: 'success',
				/* @TODO: I18n */
				message: objects.length > 1 ?
					`${objects.length} Objekte wurden angezeigt.` :
					`"${objects[0].label}" wurde angezeigt.`,
				timeout: 5000
			});

			goTo(`/store/${store.identifier}`);
		}
	};

	render() {
		const {store, objects, renderAction, onCompleted} = this.props;

		return (
			<History>
				{history => (
					<ShowObjectsMutation
						storeIdentifier={store.identifier}
						objectIdentifiers={objects.map(object => object.identifier)}
						onCompleted={({store}) => onCompleted(store, history, this.props)}
					>
						{({execute}) => renderAction(() => execute(), this.props)}
					</ShowObjectsMutation>
				)}
			</History>
		);
	}
}
