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

import Button from '../../lib/presentation/primitives/button';
import Icon from '../../lib/presentation/primitives/icon';

import PublishObjects from '../publishObjects';
import SaveObject from '../saveObject';

export default class SaveAndPublishObject extends Component {
	static propTypes = {
		store: PropTypes.shape({
			identifier: PropTypes.string.isRequired
		}).isRequired,
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
		const {store, object, renderAction, onCompleted, transient} = this.props;

		return (
			<PublishObjects
				store={store}
				objects={[object]}
				renderAction={publish => (
					<SaveObject
						store={store}
						object={object}
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
