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

import Button from '../../lib/presentation/primitives/button';
import Icon from '../../lib/presentation/primitives/icon';
import NodeList from '../../lib/presentation/structures/nodeList';

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

RemoveObjectsMutation.defaultProps = {
	/* @TODO: Better context handling */
	context: window.Sitegeist.Objects.contentContext
};

export default class RemoveObject extends Component {
	static propTypes = {
		store: PropTypes.shape({
			identifier: PropTypes.string.isRequired
		}).isRequired,
		objects: PropTypes.arrayOf(PropTypes.shape({
			identifier: PropTypes.string.isRequired,
			icon: PropTypes.string,
			label: PropTypes.string.isRequired,
		})).isRequired,
		renderQuestion: PropTypes.func,
		renderAction: PropTypes.func,
		onCompleted: PropTypes.func
	};

	static defaultProps = {
		renderQuestion: ({objects}) => objects.length > 1 ? (
			<Fragment>
				{/* @TODO. I18n */}
				Möchten Sie die Objekte <NodeList nodes={objects}/> wirklich löschen?
			</Fragment>
		) : (
			<Fragment>
				{/* @TODO. I18n */}
				Möchten Sie das Objekt <NodeList nodes={objects}/> wirklich löschen?
			</Fragment>
		),
		renderAction: (execute, {objects}) => (
			<Button
				className="neos-button-danger"
				onClick={execute}
			>
				<Icon className="icon-trash"/>
				{/* @TODO: I18n */}
				Löschen{objects.length > 1 ? ` (${objects.length})` : ''}
			</Button>
		),
		onCompleted: (_, {goTo}, {objects, store}) => {
			publishFlashMessage({
				severity: 'success',
				/* @TODO: I18n */
				message: objects.length > 1 ?
					`${objects.length} Objekte wurden versteckt.` :
					`"${objects[0].label}" wurde versteckt.`,
				timeout: 5000
			});

			goTo(`/store/${store.identifier}`);
		}
	};

	render() {
		const {store, objects, renderQuestion, renderAction, onCompleted} = this.props;

		return (
			<History>
				{history => (
					<RemoveObjectsMutation
						storeIdentifier={store.identifier}
						objectIdentifiers={objects.map(object => object.identifier)}
						onCompleted={({store}) => onCompleted(store, history, this.props)}
					>
						{({execute}) => (
							<Confirm
								question={renderQuestion(this.props)}
								onConfirm={() => execute()}
							>
								{confirm => renderAction(confirm.show, this.props)}
							</Confirm>
						)}
					</RemoveObjectsMutation>
				)}
			</History>
		);
	}
}
