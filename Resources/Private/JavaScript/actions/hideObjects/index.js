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

const HideObjectsMutation = mutation/* GraphQL */`
	mutation hideObjects(
		$context: ContentContextInput!,
		$storeIdentifier: ID!,
		$objectIdentifiers: [ID!]!
	) {
		store(context: $context, identifier: $storeIdentifier) {
			objects(identifiers: $objectIdentifiers) {
				hide {
					identifier
					label
				}
			}
		}
	}
`;

export default class HideObjects extends Component {
	static propTypes = {
		storeIdentifier: PropTypes.string.isRequired,
		items: PropTypes.arrayOf(PropTypes.shape({
			identifier: PropTypes.string.isRequired,
			icon: PropTypes.string,
			label: PropTypes.string.isRequired,
		})).isRequired,
		renderAction: PropTypes.func,
		onCompleted: PropTypes.func
	};

	static defaultProps = {
		renderAction: (execute, {items}) => (
			<Button onClick={execute}>
				<Icon className="icon-eye-close"/>
				{/* @TODO: I18n */}
				Verstecken{items.length > 1 ? ` (${items.length})` : ''}
			</Button>
		),
		onCompleted: (store, {goTo}, {items, storeIdentifier}) => {
			publishFlashMessage({
				severity: 'success',
				/* @TODO: I18n */
				message: items.length > 1 ?
					`${items.length} Objekte wurden versteckt.` :
					`"${items[0].label}" wurde versteckt.`,
				timeout: 5000
			});

			goTo(`/store/${storeIdentifier}`);
		}
	}

	render() {
		const {storeIdentifier, items, renderAction, onCompleted} = this.props;

		return (
			<History>
				{history => (
					<HideObjectsMutation
						storeIdentifier={storeIdentifier}
						objectIdentifiers={items.map(item => item.identifier)}
						onCompleted={({store}) => onCompleted(store, history, this.props)}
					>
						{({execute}) => renderAction(() => execute(), this.props)}
					</HideObjectsMutation>
				)}
			</History>
		);
	}
}
