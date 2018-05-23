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
import styled from 'shim/styled-components';

import History from '../../core/history';
import Confirm from '../../core/util/confirm';

import CreateObjectMutation from '../../mutation/createObject';
import UpdateObjectMutation from '../../mutation/updateObject';
import RemoveObjectMutation from '../../mutation/removeObject';
import PublishObjectsMutation from '../../mutation/publishObjects';
import DiscardObjectsMutation from '../../mutation/discardObjects';

import ButtonList from '../../ui/primitives/buttonList';
import Button from '../../ui/primitives/button';
import Icon from '../../ui/primitives/icon';

const Container = styled.div`
	display: flex;
	justify-content: space-between;
`;

export default class Operations extends Component {
	static propTypes = {
		object: PropTypes.shape({
			identifier: PropTypes.string,
			nodeType: PropTypes.shape({
				name: PropTypes.string.isRequired
			})
		}).isRequired,
		storeIdentifier: PropTypes.string.isRequired,
		transient: PropTypes.object.isRequired
	};

	reloadDetail = (history, storeIdentifier, objectIdentifier) => {
		/* @TODO: Flash Message */
		/**
		 * @TODO: Workaround as per
		 *        https://github.com/ReactTraining/react-router/issues/1982#issuecomment-314167564
		 *        Everybody seems to make their libraries defensive as hell nowadays... 🙄
		 *        I know it's wrong to do this at this point, but I do not have an alternative, since the
		 *        Apollo Cache Invalidation doesn't work properly.
		 */
		history.push(`/empty`);
		setTimeout(() => {
			history.replace(`/store/${storeIdentifier}/edit/${objectIdentifier}`);
		});
	}

	render() {
		const {object} = this.props;

		return (
			<Container>
				<ButtonList>
					{object.identifier ? this.renderSave() : this.renderCreate()}
					{object.identifier ? this.renderPublish() : null}
				</ButtonList>
				<ButtonList>
					{this.renderReset()}
					{object.identifier ? this.renderDiscard() : null}
					{object.identifier ? this.renderDelete() : null}
				</ButtonList>
			</Container>
		);
	}

	renderSave() {
		const {object, transient, storeIdentifier} = this.props;

		return (
			<History>
				{history => (
					<UpdateObjectMutation
						storeIdentifier={storeIdentifier}
						objectIdentifier={object.identifier}
						onCompleted={() => {
							/* @TODO: Flash Message */
							this.reloadDetail(history, storeIdentifier, object.identifier);
						}}
					>
						{updateObjectMutation => (
							<Button
								disabled={!transient.hasValues}
								onClick={() => updateObjectMutation.updateObject(transient.values)}
							>
								<Icon className="icon-save"/>
								Speichern
							</Button>
						)}
					</UpdateObjectMutation>
				)}
			</History>
		);
	}

	renderPublish() {
		const {storeIdentifier, transient, object} = this.props;

		if (transient.hasValues) {
			return this.renderSaveAndPublish();
		}

		return (
			<History>
				{history => (
					<PublishObjectsMutation
						storeIdentifier={storeIdentifier}
						objectIdentifiers={[object.identifier]}
						onCompleted={() => {
							/* @TODO: Flash Message */
							this.reloadDetail(history, storeIdentifier, object.identifier);
						}}
					>
						{({publishObjects}) => (
							/* @TODO: I18n */
							<Confirm
								question={`Wollen Sie ihre Änderungen an "${object.label}" wirklich veröffentlichen?`}
								onConfirm={publishObjects}
							>
								{confirm => (
									<Button
										onClick={confirm.show}
										disabled={!object.hasUnpublishedChanges}
									>
										<Icon className="icon-globe"/>
										{/* @TODO: I18n */}
										Veröffentlichen
									</Button>
								)}
							</Confirm>
						)}
					</PublishObjectsMutation>
				)}
			</History>
		);
	}

	renderSaveAndPublish() {
		const {storeIdentifier, transient, object} = this.props;

		return (
			<History>
				{history => (
					<PublishObjectsMutation
						storeIdentifier={storeIdentifier}
						objectIdentifiers={[object.identifier]}
						onCompleted={() => {
							/* @TODO: Flash Message */
							this.reloadDetail(history, storeIdentifier, object.identifier);
						}}
					>
						{publishObjectsMutation => (
							<UpdateObjectMutation
								storeIdentifier={storeIdentifier}
								objectIdentifier={object.identifier}
								onCompleted={publishObjectsMutation.publishObjects}
							>
								{updateObjectMutation => (
									/* @TODO: I18n */
									<Confirm
										question={`Wollen Sie ihre Änderungen an "${object.label}" wirklich veröffentlichen?`}
										onConfirm={() => updateObjectMutation.updateObject(transient.values)}
									>
										{confirm => (
											<Button
												onClick={confirm.show}
												disabled={!transient.hasValues && !object.hasUnpublishedChanges}
											>
												<Icon className="icon-globe"/>
												{/* @TODO: I18n */}
												Speichern & Veröffentlichen
											</Button>
										)}
									</Confirm>
								)}
							</UpdateObjectMutation>
						)}
					</PublishObjectsMutation>
				)}
			</History>
		);
	}

	renderDiscard() {
		const {storeIdentifier, transient, object} = this.props;

		return (
			<History>
				{history => (
					<DiscardObjectsMutation
						storeIdentifier={storeIdentifier}
						objectIdentifiers={[object.identifier]}
						onCompleted={() => {
							/* @TODO: Flash Message */
							this.reloadDetail(history, storeIdentifier, object.identifier);
						}}
					>
						{({discardObjects}) => (
							/* @TODO: I18n */
							<Confirm
								question={`Wollen Sie ihre Änderungen an "${object.label}" wirklich verwerfen?`}
								onConfirm={() => {
									transient.reset();
									discardObjects();
								}}
							>
								{confirm => (
									<Button
										className="neos-button-warning"
										onClick={confirm.show}
										disabled={!object.hasUnpublishedChanges}
									>
										<Icon className="icon-ban"/>
										{/* @TODO: I18n */}
										Verwerfen
									</Button>
								)}
							</Confirm>
						)}
					</DiscardObjectsMutation>
				)}
			</History>
		);
	}

	renderCreate() {
		const {object, transient, storeIdentifier} = this.props;

		return (
			<History>
				{history => (
					<CreateObjectMutation
						storeIdentifier={storeIdentifier}
						nodeType={object.nodeType.name}
						onCompleted={({store}) => {
							/* @TODO: Flash Message */
							this.reloadDetail(history, storeIdentifier, store.createObject.identifier);
						}}
					>
						{createObjectMutation => (
							<Button
								disabled={!transient.hasValues}
								onClick={() => createObjectMutation.createObject(transient.values)}
							>
								<Icon className="icon-plus"/>
								{/* @TODO: I18n */}
								Erstellen
							</Button>
						)}
					</CreateObjectMutation>
				)}
			</History>
		);
	}

	renderReset() {
		const {transient} = this.props;

		return (
			<Button disabled={!transient.hasValues} onClick={transient.reset}>
				<Icon className="icon-undo"/>
				{/* @TODO: I18n */}
				Zurücksetzen
			</Button>
		);
	}

	renderDelete() {
		const {object, storeIdentifier} = this.props;

		return (
			<History>
				{history => (
					<RemoveObjectMutation
						storeIdentifier={storeIdentifier}
						objectIdentifier={object.identifier}
						onCompleted={() => {
							/* @TODO: Flash Message */
							history.push(`/store/${storeIdentifier}`);
						}}
					>
						{removeObjectMutation => (
							<Confirm
								question={`Wollen Sie ${object.label} wirklich löschen?`}
								onConfirm={removeObjectMutation.removeObject}
							>
								{confirm => (
									<Button
										className="neos-button-danger"
										onClick={confirm.show}
									>
										<Icon className="icon-trash"/>
										{/* @TODO: I18n */}
										Löschen
									</Button>
								)}
							</Confirm>
						)}
					</RemoveObjectMutation>
				)}
			</History>
		);
	}
}
