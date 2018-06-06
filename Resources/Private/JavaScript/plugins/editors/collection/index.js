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

import Button from '../../../ui/primitives/button';
import Icon from '../../../ui/primitives/icon';
import Editor from '../../../ui/structures/editor';
import DragAndDropList from '../../../ui/structures/dragAndDropList';

import Collection from '../../../core/util/collection';
import Select from '../../../core/util/select';

import CollectionQuery from '../../../query/collection';
import EmptyCollectionItemQuery from '../../../query/collection/empty';

import Detail from './detail';

window.Sitegeist.Objects.plugin.registerEditor('Collection', class CollectionEditor extends Component {
	static propTypes = {
		name: PropTypes.string.isRequired,
		options: PropTypes.object,
		storeIdentifier: PropTypes.string.isRequired,
		objectIdentifier: PropTypes.string,
		nodeType: PropTypes.string,
		commit: PropTypes.func.isRequired,
		value: PropTypes.object
	};

	static defaultProps = {
		options: {
			shortView: 'Label'
		},
		objectIdentifier: null,
		nodeType: null,
		value: null
	};

	handleChange = items => {
		const {commit} = this.props;

		commit({
			'@@sitegeist/objects/type': 'collection',
			payload: items
		});
	}

	render() {
		return (
			<Editor {...this.props}>
				{this.renderCollectionQuery()}
			</Editor>
		);
	}

	renderCollectionQuery() {
		const {name, storeIdentifier, objectIdentifier, nodeType} = this.props;

		return (
			<CollectionQuery
				storeIdentifier={storeIdentifier}
				objectIdentifier={objectIdentifier}
				nodeType={nodeType}
				collectionName={name}
			>
				{({store}) => this.renderCollection(store)}
			</CollectionQuery>
		);
	}

	renderCollection(store) {
		const {value} = this.props;
		const {objectDetails} = store.objectDetail.collection;

		return (
			<Collection
				onChange={this.handleChange}
				value={value && value.payload ? value.payload : objectDetails.map(objectDetail => ({
					identifier: objectDetail.object.identifier,
					payload: {
						icon: objectDetail.object.icon,
						nodeType: objectDetail.object.nodeType.name,
						label: objectDetail.object.label,
						isHidden: objectDetail.object.isHidden,
						properties: objectDetail.properties,
						transient: {}
					},
					modes: []
				}))}
			>
				{collection => this.renderSelect(store, collection)}
			</Collection>
		);
	}

	renderSelect(store, collection) {
		return (
			<Select allItems={collection.map(item => ({name: item.identifier}))} allowEmpty>
				{select => this.renderList(store, collection, select)}
			</Select>
		);
	}

	renderList(store, collection, select) {
		const {name, storeIdentifier, objectIdentifier, nodeType, options} = this.props;
		const [allowedNodeType] = store.objectDetail.object.nodeType.allowedGrandChildNodeTypes;

		return (
			<div>
				<DragAndDropList
					mappable={collection}
					renderKey={item => item.identifier}
					disabled={select.hasSelection}
					onDrop={({removedIndex, addedIndex}) => collection.moveItem(removedIndex, addedIndex)}
				>
					{item => (
						<Detail
							item={item}
							storeIdentifier={storeIdentifier}
							isOpen={select.isSelected(item.identifier)}
							onToggle={select.toggleSelect}
							shortView={options.shortView}
							shortViewOptions={options.shortViewOptions}
							nodeType={allowedNodeType}
							label=""
						/>
					)}
				</DragAndDropList>
				<EmptyCollectionItemQuery
					key={`collection-empty-${name}`}
					storeIdentifier={storeIdentifier}
					objectIdentifier={objectIdentifier}
					nodeType={nodeType}
					itemNodeType={allowedNodeType.name}
					collectionName={name}
				>
					{({store}) => {
						const {emptyObjectDetail} = store.objectDetail.collection;

						return (
							<Button
								onClick={() => select.toggleSelect(
									collection.addItem({
										nodeType: emptyObjectDetail.object.nodeType.name,
										label: emptyObjectDetail.object.label,
										properties: emptyObjectDetail.properties
									})
								)}
							>
								<Icon className="icon-plus"/>
								{/* @TODO: I18n */}
								{allowedNodeType.label} hinzufügen
							</Button>
						);
					}}
				</EmptyCollectionItemQuery>
			</div>
		);
	}
});
