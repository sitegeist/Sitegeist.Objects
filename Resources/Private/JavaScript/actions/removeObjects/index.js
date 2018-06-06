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
import React, {Component, Fragment} from 'shim/react';
import PropTypes from 'shim/prop-types';

import History from '../../core/history';
import {mutation} from '../../core/graphql/gql';
import Confirm from '../../core/util/confirm';
import {publishFlashMessage} from '../../core/flashMessage';

import Button from '../../ui/primitives/button';
import Icon from '../../ui/primitives/icon';
import NodeList from '../../ui/structures/nodeList';

const RemoveObjectsMutation = mutation/* GraphQL */`
	mutation removeObject(
		$context: ContentContextInput!,
		$storeIdentifier: ID!,
		$objectIdentifiers: [ID!]!
	) {
		store(context: $context, identifier: $storeIdentifier) {
			objects(identifier: $objectIdentifiers) {
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

export default class RemoveObject extends Component {
	static propTypes = {
		storeIdentifier: PropTypes.string.isRequired,
		items: PropTypes.arrayOf(PropTypes.shape({
			identifier: PropTypes.string.isRequired,
			icon: PropTypes.string,
			label: PropTypes.string.isRequired,
		})).isRequired,
		renderQuestion: PropTypes.func,
		renderAction: PropTypes.func,
		onCompleted: PropTypes.func
	};

	static defaultProps = {
		renderQuestion: ({items}) => items.length > 1 ? (
			<Fragment>
				{/* @TODO. I18n */}
				Möchten Sie die Objekte <NodeList items={items}/> wirklich löschen?
			</Fragment>
		) : (
			<Fragment>
				{/* @TODO. I18n */}
				Möchten Sie das Objekt <NodeList items={items}/> wirklich löschen?
			</Fragment>
		),
		renderAction: (execute, {items}) => (
			<Button
				className="neos-button-danger"
				onClick={execute}
			>
				<Icon className="icon-trash"/>
				{/* @TODO: I18n */}
				Löschen{items.length > 1 ? ` (${items.length})` : ''}
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
	};

	render() {
		const {storeIdentifier, items, renderQuestion, renderAction, onCompleted} = this.props;

		return (
			<History>
				{history => (
					<RemoveObjectsMutation
						storeIdentifier={storeIdentifier}
						objectIdentifiers={items.map(item => item.identifier)}
						onCompleted={({store}) => onCompleted(store, history, this.props)}
					>
						{({execute}) => (
							<Confirm
								question={renderQuestion(this.props)}
								onConfirm={() => execute()}
							>
								{confirm => renderAction(confirm, this.props)}
							</Confirm>
						)}
					</RemoveObjectsMutation>
				)}
			</History>
		);
	}
}
