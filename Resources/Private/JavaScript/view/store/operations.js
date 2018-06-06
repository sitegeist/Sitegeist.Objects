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
import styled from 'shim/styled-components';

import History from '../../core/history';
import Confirm from '../../core/util/confirm';

import HideObjectsMutation from '../../mutation/hideObjects';
import ShowObjectsMutation from '../../mutation/showObjects';
import DiscardObjectsMutation from '../../mutation/discardObjects';
import PublishObjectsMutation from '../../mutation/publishObjects';
import CopyObjectMutation from '../../mutation/copyObject';

import ButtonList from '../../ui/primitives/buttonList';
import Button from '../../ui/primitives/button';
import Icon from '../../ui/primitives/icon';

const Container = styled.div`
	display: flex;
	justify-content: space-between;
`;

const List = styled.ul`
	list-style-type: circle;
	padding-left: 16px!important;
	margin: 16px 0!important;

	li {
		display: flex;
		align-items: center;
		margin-bottom: 8px;
	}

	${Icon} {
		margin-right: 10px;
	}
`;

export default class Operations extends Component {
	static propTypes = {
		selection: PropTypes.array.isRequired,
		storeIdentifier: PropTypes.string.isRequired,
		nodeTypeForCreation: PropTypes.string.isRequired
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

		return (
			<Container>
				<ButtonList>
					{selection.length === 0 ?
						this.renderCreate() : null
					}
					{selection.length === 1 ?
						this.renderEdit(selection[0]) : null
					}
					{selection.length === 1 && selection[0].previewUri ?
						this.renderPreview(selection[0]) : null
					}
					{selection.length === 1 ?
						this.renderCopy(selection[0]) : null
					}
					{hidableItems.length > 0 ?
						this.renderHide(hidableItems) : null
					}
					{selection.length > 0 && hidableItems.length === 0 ?
						this.renderShow(selection) : null
					}
				</ButtonList>
				<ButtonList>
					{publishableItems.length > 0 ?
						this.renderPublish(publishableItems) : null
					}
					{publishableItems.length > 0 ?
						this.renderDiscard(publishableItems) : null
					}
				</ButtonList>
			</Container>
		);
	}

	renderCreate() {
		const {storeIdentifier, nodeTypeForCreation} = this.props;

		return (
			<Link to={`/store/${storeIdentifier}/create/${nodeTypeForCreation}`}>
				<Button>
					{/* @TODO. I18n */}
					<Icon className="icon-plus"/>
					Neu erstellen
				</Button>
			</Link>
		);
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
						{({execute}) => (
							<Button onClick={execute}>
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
					<Icon className="icon-external-link"/>
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
						{({execute}) => (
							<Button onClick={() => execute()}>
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
						{({execute}) => (
							<Button onClick={() => execute()}>
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
						{({execute}) => (
							<Confirm
								question={
									<Fragment>
										{/* @TODO. I18n */}
										Möchten Sie die Objekte
										<List>
											{publishableItems.map(item => (
												<li key={item.identifier}>
													<Icon className={item.icon}/>
													{item.label}
												</li>
											))}
										</List>
										wirklich veröffentlichen?
									</Fragment>
								}
								onConfirm={() => execute()}
							>
								{confirm => (
									<Button onClick={confirm.show}>
										<Icon className="icon-globe"/>
										{/* @TODO: I18n */}
										Veröffentlichen{publishableItems.length > 1 ? ` (${publishableItems.length})` : ''}
									</Button>
								)}
							</Confirm>
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
						{({execute}) => (
							<Confirm
								question={
									<Fragment>
										{/* @TODO. I18n */}
										Möchten Sie die Objekte
										<List>
											{publishableItems.map(item => (
												<li key={item.identifier}>
													<Icon className={item.icon}/>
													{item.label}
												</li>
											))}
										</List>
										wirklich verwerfen?
									</Fragment>
								}
								onConfirm={() => execute()}
							>
								{confirm => (
									<Button
										onClick={confirm.show}
										className="neos-button-warning"
									>
										<Icon className="icon-trash"/>
										{/* @TODO: I18n */}
										Verwerfen{publishableItems.length > 1 ? ` (${publishableItems.length})` : ''}
									</Button>
								)}
							</Confirm>

						)}
					</DiscardObjectsMutation>
				)}
			</History>
		);
	}
}
