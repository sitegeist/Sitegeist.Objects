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

import {publishFlashMessage} from '../../core/flashMessage';

import Button from '../../ui/primitives/button';
import Icon from '../../ui/primitives/icon';

import PublishObjects from '../publishObjects';
import SaveObject from '../saveObject';

export default class SaveAndPublishObject extends Component {
	static propTypes = {
		storeIdentifier: PropTypes.string.isRequired,
		object: PropTypes.shape({
			identifier: PropTypes.string.isRequired,
			label: PropTypes.string.isRequired,
			hasUnpublishedChanges: PropTypes.bool.isRequired
		}).isRequired,
		renderAction: PropTypes.func,
		onCompleted: PropTypes.func,
		transient: PropTypes.object.isRequired
	};

	static defaultProps = {
		renderAction: (execute, {transient, object}) => (
			<Button
				onClick={execute}
				disabled={!transient.hasValues && !object.hasUnpublishedChanges}
			>
				<Icon className="icon-globe"/>
				{/* @TODO: I18n */}
				Speichern & Veröffentlichen
			</Button>
		),
		onCompleted: (store, {goTo}, {object}) => {
			publishFlashMessage({
				severity: 'success',
				/* @TODO: I18n */
				message: `"${object.label}" wurde erfolgreich gespeichert.`,
				timeout: 5000
			});

			goTo(`/store/${store.identifier}/edit/${store.updateObject.identifier}`);
		}
	};

	render() {
		const {storeIdentifier, object, renderAction, onCompleted, transient} = this.props;

		return (
			<PublishObjects
				storeIdentifier={storeIdentifier}
				items={[object]}
				renderAction={publish => (
					<SaveObject
						storeIdentifier={storeIdentifier}
						objectIdentifier={object.identifier}
						transient={transient}
						renderAction={renderAction}
						onUpdate={publish}
					/>
				)}
				onCompleted={onCompleted}
			/>
		);
	}
}
