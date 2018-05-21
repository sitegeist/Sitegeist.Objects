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
import uuid from 'uuid';
import {Container, Draggable} from 'react-smooth-dnd';
import styled from 'styled-components';

import Button from '../../../ui/primitives/button';
import Icon from '../../../ui/primitives/icon';
import Editor from '../../../ui/structures/editor';

import EditorManager from '../../../core/plugin/editorManager';

import Toggle from '../../../core/util/toggle';
import Transient from '../../../core/util/transient';

const {React, PropTypes} = window.Sitegeist.Objects.runtime;
const {Component} = window.Sitegeist.Objects.runtime.React;

import CollectionQuery from '../../../query/collection';
import EmptyCollectionItemQuery from '../../../query/collection/empty';

const Table = styled.div`
	> :nth-child(odd) {
		display: flex;

		> * {
			display: flex;
			align-items: center;
		}

		> :nth-child(1) {
			width: 15%;
			cursor: move;

			${Icon} {
				margin-right: 10px;
			}
		}

		> :nth-child(2) {
			width: 15%;
		}

		> :nth-child(3) {
			width: 70%;
		}
	}

	> :nth-child(even) {
		padding-left: 20px;
	}
`;

/**
 * @TODO: Overall Refactoring
 */
window.Sitegeist.Objects.plugin.registerEditor('Collection', class Collection extends Component {
	static propTypes = {
		name: PropTypes.string.isRequired,
		storeIdentifier: PropTypes.string.isRequired,
		objectIdentifier: PropTypes.string,
		nodeType: PropTypes.string,
		commit: PropTypes.func.isRequired,
		value: PropTypes.object
	};

	static defaultProps = {
		objectIdentifier: null,
		nodeType: null,
		value: null
	};

	state = {
		order: null
	};

	getValue = () => {
		return this.props.value || {
			update: [],
			remove: [],
			hide: [],
			show: [],
			add: []
		};
	}

	doCommit = value => {
		const {commit} = this.props;

		if (
			value.add.length ||
			value.update.length ||
			value.hide.length ||
			value.show.length ||
			value.remove.length
		) {
			commit(value);
		} else {
			commit(null);
		}
	}

	handleAdd = (order, nodeType) => {
		const value = this.getValue();
		const id = `added-${uuid.v4()}`;

		this.doCommit({
			...value,
			add: [
				...value.add,
				{
					id,
					nodeType,
					properties: {}
				}
			]
		});

		this.setState(state => ({
			order: [...(state.order || order), id]
		}));
	}

	handleUnAdd = id => {
		const value = this.getValue();

		this.doCommit({
			...value,
			add: value.add.filter(node => node.id !== id)
		});
	}

	handleMove = (order, fromIndex, toIndex) => {
		this.setState(state => {
			const values = [...(state.order || order)];
			values.splice(toIndex, 0, values.splice(fromIndex, 1)[0]);
			return {order: values};
		});
	}

	handleChange = (mode, id, {values: properties}) => {
		const value = this.getValue();

		if (value[mode].some(node => node.id === id)) {
			this.doCommit({
				...value,
				[mode]: value[mode].map(node => {
					if (node.id === id) {
						return {
							...node,
							properties
						};
					}

					return node;
				}, [])
			});
		} else {
			this.doCommit({
				...value,
				[mode]: [...value[mode], {id, properties}]
			});
		}
	};

	handleRemove = identifier => {
		const value = this.getValue();

		this.doCommit({
			...value,
			remove: [...value.remove, identifier]
		});
	}

	handleUnRemove = identifier => {
		const value = this.getValue();

		this.doCommit({
			...value,
			remove: value.remove.filter(removed => removed !== identifier)
		});
	}

	handleHide = identifier => {
		const value = this.getValue();

		this.doCommit({
			...value,
			hide: [...value.hide, identifier]
		});
	}

	handleUnHide = identifier => {
		const value = this.getValue();

		this.doCommit({
			...value,
			hide: value.hide.filter(hidden => hidden !== identifier)
		});
	}

	handleShow = identifier => {
		const value = this.getValue();

		this.doCommit({
			...value,
			show: [...value.show, identifier]
		});
	}

	handleUnShow = identifier => {
		const value = this.getValue();

		this.doCommit({
			...value,
			show: value.show.filter(shown => shown !== identifier)
		});
	}

	renderObjectDetail = (mode, id, objectDetail) => (
		<Toggle key={id}>
			{open => {
				const hasBeenRemoved = this.getValue().remove.some(removed => removed === id);
				const hasBeenHidden = this.getValue().hide.some(hidden => hidden === id);
				const hasBeenShown = this.getValue().show.some(shown => shown === id);
				const isHidden = (objectDetail.object.isHidden && !hasBeenShown) || hasBeenHidden;
				const transientState = this.getValue()[mode].filter(node => node.id === id)[0];

				return (
					<Table>
						<div style={{opacity: isHidden ? '.3' : '1'}}>
							<div>
								<Icon className={objectDetail.object.icon}/>
								{hasBeenRemoved ? <s>{objectDetail.object.label}</s> : objectDetail.object.label}
							</div>
							<div>
								{/* @TODO: Short View concept */}
								SHORT_VIEW
							</div>
							<div style={{width: '100%', textAlign: 'left'}}>
								<Button onClick={open.toggle}>
									{/* @TODO: Icons / Titles */}
									{open.is ? '-' : '+'}
								</Button>
								{/* @TODO: This is a desctructive operation - the user needs to confirm this */}
								<Button
									onClick={() => {
										if (hasBeenRemoved) {
											this.handleUnRemove(id);
										} else if (mode === 'add') {
											this.handleUnAdd(id);
										} else {
											this.handleRemove(id);
										}
									}}
								>
									{/* @TODO: Icons / Titles */}
									{hasBeenRemoved ? 'RESTORE' : 'REMOVE'}
								</Button>
								<Button
									onClick={() => {
										if (hasBeenHidden) {
											this.handleUnHide(id);
										} else if (isHidden) {
											this.handleShow(id);
										} else if (hasBeenShown) {
											this.handleUnShow(id);
										} else {
											this.handleHide(id);
										}
									}}
								>
									{/* @TODO: Icons / Titles */}
									{isHidden ? 'SHOW' : 'HIDE'}
								</Button>
							</div>
						</div>
						<Transient
							value={transientState ? transientState.properties : {}}
							onChange={properties => this.handleChange(mode, id, properties)}
						>
							{transient => open.is ? (
								<div style={{opacity: isHidden ? '.3' : '1'}}>
									{objectDetail.properties.map(property => (
										/* @TODO: ItemEditor concept */
										<EditorManager
											key={property.name}
											name={property.editor}
											property={property}
											transient={transient}
											storeIdentifier={this.props.storeIdentifier}
											objectIdentifier={this.props.objectIdentifier}
											nodeType={this.props.nodeType}
										/>
									))}
								</div>
							) : null}
						</Transient>
					</Table>
				);
			}}
		</Toggle>
	);

	render() {
		const {name, storeIdentifier, objectIdentifier, nodeType} = this.props;

		return (
			<CollectionQuery
				storeIdentifier={storeIdentifier}
				objectIdentifier={objectIdentifier}
				nodeType={nodeType}
				collectionName={name}
			>
				{({store}) => {
					//
					// @TODO: This doesn't seem safe
					//
					const order = this.state.order || store.objectDetail.collection.objectDetails
						.map(({object}) => object.identifier);

					return (
						<Editor {...this.props}>
							<Container
								onDrop={({removedIndex, addedIndex}) => {
									this.handleMove(order, removedIndex, addedIndex);
								}}
							>
								{order.map(orderIdentifier => {
									const staleObject = store.objectDetail.collection.objectDetails
										.filter(({object}) => object.identifier === orderIdentifier)[0];

									if (staleObject) {
										return (
											<Draggable key={orderIdentifier}>
												{this.renderObjectDetail('update', staleObject.object.identifier, staleObject)}
											</Draggable>
										);
									}

									const addedObject = this.props.value && this.props.value.add
										.filter(({id}) => id === orderIdentifier)[0];

									if (addedObject) {
										return (
											<EmptyCollectionItemQuery
												key={addedObject.id}
												storeIdentifier={storeIdentifier}
												objectIdentifier={objectIdentifier}
												nodeType={nodeType}
												itemNodeType={store.objectDetail.object.nodeType.allowedGrandChildNodeTypes[0].name}
												collectionName={name}
											>
												{({store}) => (
													<Draggable>
														{this.renderObjectDetail(
															'add',
															addedObject.id,
															store.objectDetail.collection.emptyObjectDetail
														)}
													</Draggable>
												)}
											</EmptyCollectionItemQuery>
										);
									}

									return null;
								})}
							</Container>
							<Button onClick={() => this.handleAdd(order, store.objectDetail.object.nodeType.allowedGrandChildNodeTypes[0].name)}>
								{/* @TODO: I18n */}
								Add
							</Button>
						</Editor>
					);
				}}
			</CollectionQuery>
		);
	}
});
