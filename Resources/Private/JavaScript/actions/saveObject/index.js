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
import invariant from 'invariant';

import History from '../../core/history';
import {publishFlashMessage} from '../../core/flashMessage';
import {mutation} from '../../core/graphql/gql';
import convertProperties from '../../core/plugin/converterManager';

import Button from '../../ui/primitives/button';
import Icon from '../../ui/primitives/icon';

const CreateObjectMutation = mutation/* GraphQL */`
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

const UpdateObjectMutation = mutation/* GraphQL */`
	mutation createObject(
		$context: ContentContextInput!,
		$storeIdentifier: ID!,
		$objectIdentifier: ID!,
		$properties: JSON!
	) {
		store(context: $context, identifier: $storeIdentifier) {
			object(identifier: $objectIdentifier) {
				update(properties: $properties) {
					nodeType {
						label
					}
					label
				}
			}
		}
	}
`;

export default class SaveObject extends Component {
	static propTypes = {
		storeIdentifier: PropTypes.string.isRequired,
		objectIdentifier: PropTypes.string,
		nodeTypeName: PropTypes.string,
		renderAction: PropTypes.func,
		onCreate: PropTypes.func,
		onUpdate: PropTypes.func,
		transient: PropTypes.object.isRequired
	};

	static defaultProps = {
		objectIdentifier: null,
		nodeTypeName: null,
		renderAction: (execute, {transient}) => (
			<Button
				disabled={!transient.hasValues}
				onClick={execute}
			>
				<Icon className="icon-save"/>
				{/* @TODO: I18n */}
				Speichern
			</Button>
		),
		onCreate: (store, {goTo}) => {
			publishFlashMessage({
				severity: 'success',
				/* @TODO: I18n */
				message: `"${store.createObject.label}" wurde erfolgreich erstellt.`,
				timeout: 5000
			});

			goTo(`/store/${store.identifier}/edit/${store.createObject.identifier}`);
		},
		onUpdate: (store, {goTo}) => {
			publishFlashMessage({
				severity: 'success',
				/* @TODO: I18n */
				message: `"${store.createObject.label}" wurde erfolgreich gespeichert.`,
				timeout: 5000
			});

			goTo(`/store/${store.identifier}/edit/${store.updateObject.identifier}`);
		}
	};

	handleSaveAction = async execute => {
		const {transient} = this.props;
		const properties = await convertProperties(transient.values);

		execute({properties});
	};

	render() {
		const {storeIdentifier, objectIdentifier, nodeTypeName, renderAction, onCreate, onUpdate} = this.props;

		invariant(objectIdentifier || nodeTypeName, 'Either objectIdentifier or nodeTypeName must be set!');

		return (
			<History>
				{history => objectIdentifier ? (
					<UpdateObjectMutation
						storeIdentifier={storeIdentifier}
						objectIdentifier={objectIdentifier}
						onCompleted={({store}) => onUpdate(store, history, this.props)}
					>
						{({execute}) => renderAction(() => this.handleSaveAction(execute), this.props)}
					</UpdateObjectMutation>
				) : (
					<CreateObjectMutation
						storeIdentifier={storeIdentifier}
						nodeType={nodeTypeName}
						onCompleted={({store}) => onCreate(store, history, this.props)}
					>
						{({execute}) => renderAction(() => this.handleSaveAction(execute), this.props)}
					</CreateObjectMutation>
				)}
			</History>
		);
	}
}
