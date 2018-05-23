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
import React, {Fragment, Component} from 'shim/react';
import PropTypes from 'shim/prop-types';
import {Link} from 'react-router-dom';

import ButtonList from '../../ui/primitives/buttonList';
import Button from '../../ui/primitives/button';
import Icon from '../../ui/primitives/icon';

import HideObjectsMutation from '../../mutation/hideObjects';
import ShowObjectsMutation from '../../mutation/showObjects';
import DiscardObjectsMutation from '../../mutation/discardObjects';
import PublishObjectsMutation from '../../mutation/publishObjects';
import CopyObjectMutation from '../../mutation/copyObject';
import History from '../../core/history';

export default class Operations extends Component {
	static propTypes = {
		selection: PropTypes.array.isRequired,
		storeIdentifier: PropTypes.string.isRequired
	};

	reloadStore = (history, storeIdentifier) => () => {
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
			history.replace(`/store/${storeIdentifier}`);
		});
	}

	render() {
		const {selection} = this.props;
		const hidableItems = selection.filter(item => !item.isHidden);
		const publishableItems = selection.filter(item => item.hasUnpublishedChanges);

		return selection[0] ? (
			<Fragment>
				<ButtonList>
					{selection.length === 1 ?
						this.renderEdit(selection[0]) : null
					}
					{selection.length === 1 ?
						this.renderCopy(selection[0]) : null
					}
					{selection.length === 1 && selection[0].previewUri ?
						this.renderPreview(selection[0]) : null
					}
					{hidableItems.length > 0 ?
						this.renderHide(hidableItems) : null
					}
					{hidableItems.length === 0 ?
						this.renderShow(selection) : null
					}
				</ButtonList>
				{publishableItems.length > 0 ? (
					<ButtonList>
						{this.renderPublish(publishableItems)}
						{this.renderDiscard(publishableItems)}
					</ButtonList>
				) : null}
			</Fragment>
		) : null;
	}

	renderEdit(item) {
		const {storeIdentifier} = this.props;

		return (
			<Link to={`/store/${storeIdentifier}/edit/${item.identifier}`}>
				<Button>
					<Icon className="icon-pencil"/>
					{/* @TODO: I18n */}
					Bearbeiten
				</Button>
			</Link>
		);
	}

	renderCopy(item) {
		const {storeIdentifier} = this.props;

		return (
			<History>
				{history => (
					<CopyObjectMutation
						storeIdentifier={storeIdentifier}
						objectIdentifier={item.identifier}
						onCompleted={({store}) => {
							const {copy} = store.object;
							history.push(`/store/${storeIdentifier}/edit/${copy.identifier}`);
						}}
					>
						{({result, copyObject}) => (
							<Button
								onClick={copyObject}
								disable={result.loading}
							>
								<Icon className="icon-copy"/>
								{/* @TODO: I18n */}
								Kopieren
							</Button>
						)}
					</CopyObjectMutation>
				)}
			</History>

		);
	}

	renderPreview(item) {
		return (
			<a href={item.previewUri} target="_blank">
				<Button>
					<Icon className="icon-pencil"/>
					{/* @TODO: I18n */}
					Vorschau
				</Button>
			</a>
		);
	}

	renderHide(hidableItems) {
		const {storeIdentifier} = this.props;

		return (
			<History>
				{history => (
					<HideObjectsMutation
						storeIdentifier={storeIdentifier}
						objectIdentifiers={hidableItems.map(item => item.identifier)}
						onCompleted={this.reloadStore(history, storeIdentifier)}
					>
						{({result, hideObjects}) => (
							<Button
								onClick={hideObjects}
								disable={result.loading}
							>
								<Icon className="icon-eye-close"/>
								{/* @TODO: I18n */}
								Verstecken{hidableItems.length > 1 ? ` (${hidableItems.length})` : ''}
							</Button>
						)}
					</HideObjectsMutation>
				)}
			</History>
		);
	}

	renderShow(showableItems) {
		const {storeIdentifier} = this.props;

		return (
			<History>
				{history => (
					<ShowObjectsMutation
						storeIdentifier={storeIdentifier}
						objectIdentifiers={showableItems.map(item => item.identifier)}
						onCompleted={this.reloadStore(history, storeIdentifier)}
					>
						{({result, showObjects}) => (
							<Button
								onClick={showObjects}
								disabled={result.loading}
							>
								<Icon className="icon-eye"/>
								{/* @TODO: I18n */}
								Anzeigen{showableItems.length > 1 ? ` (${showableItems.length})` : ''}
							</Button>
						)}
					</ShowObjectsMutation>
				)}
			</History>
		);
	}

	renderPublish(publishableItems) {
		const {storeIdentifier} = this.props;

		return (
			<History>
				{history => (
					<PublishObjectsMutation
						storeIdentifier={storeIdentifier}
						objectIdentifiers={publishableItems.map(item => item.identifier)}
						onCompleted={this.reloadStore(history, storeIdentifier)}
					>
						{({result, publishObjects}) => (
							<Button
								onClick={publishObjects}
								disabled={result.loading}
							>
								<Icon className="icon-globe"/>
								{/* @TODO: I18n */}
								Veröffentlichen{publishableItems.length > 1 ? ` (${publishableItems.length})` : ''}
							</Button>
						)}
					</PublishObjectsMutation>
				)}
			</History>
		);
	}

	renderDiscard(publishableItems) {
		const {storeIdentifier} = this.props;

		return (
			<History>
				{history => (
					<DiscardObjectsMutation
						storeIdentifier={storeIdentifier}
						objectIdentifiers={publishableItems.map(item => item.identifier)}
						onCompleted={this.reloadStore(history, storeIdentifier)}
					>
						{({result, discardObjects}) => (
							<Button
								onClick={discardObjects}
								className="neos-button-warning"
								disabled={result.loading}
							>
								<Icon className="icon-trash"/>
								{/* @TODO: I18n */}
								Verwerfen{publishableItems.length > 1 ? ` (${publishableItems.length})` : ''}
							</Button>
						)}
					</DiscardObjectsMutation>
				)}
			</History>
		);
	}
}
