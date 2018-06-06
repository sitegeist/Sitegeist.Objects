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
import styled from 'shim/styled-components';

import History from '../../core/history';
import {mutation} from '../../core/graphql/gql';
import Confirm from '../../core/util/confirm';
import {publishFlashMessage} from '../../core/flashMessage';

import Button from '../../ui/primitives/button';
import Icon from '../../ui/primitives/icon';
import NodeList from '../../ui/structures/nodeList';

const DiscardObjectsMutation = mutation/* GraphQL */`
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

DiscardObjectsMutation.defaultProps = {
	/* @TODO: Better context handling */
	context: window.Sitegeist.Objects.contentContext
};

export default class DiscardObjects extends Component {
	static propTypes = {
		storeIdentifier: PropTypes.string.isRequired,
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
				Möchten Sie die Objekte <NodeList nodes={objects}/> wirklich verwerfen?
			</Fragment>
		) : (
			<Fragment>
				{/* @TODO. I18n */}
				Möchten Sie das Objekt <NodeList nodes={objects}/> wirklich verwerfen?
			</Fragment>
		),
		renderAction: (execute, {objects}) => (
			<Button
				onClick={execute}
				className="neos-button-warning"
			>
				<Icon className="icon-trash"/>
				{/* @TODO: I18n */}
				Verwerfen{objects.length > 1 ? ` (${objects.length})` : ''}
			</Button>
		),
		onCompleted: (store, {goTo}, {objects, storeIdentifier}) => {
			publishFlashMessage({
				severity: 'success',
				/* @TODO: I18n */
				message: objects.length > 1 ?
					`${objects.length} Objekte wurden erfolgreich verworfen.` :
					`"${objects[0].label}" wurde erfolgreich verwerfen.`,
				timeout: 5000
			});

			goTo(`/store/${storeIdentifier}`);
		}
	}

	render() {
		const {storeIdentifier, objects, renderQuestion, renderAction, onCompleted} = this.props;

		return (
			<History>
				{history => (
					<DiscardObjectsMutation
						storeIdentifier={storeIdentifier}
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
					</DiscardObjectsMutation>
				)}
			</History>
		);
	}
}
