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

import Collection from '../../../core/util/collection';
import Transient from '../../../core/util/transient';
import Select from '../../../core/util/select';

import CollectionQuery from '../../../query/collection';

class CollectionEditor extends Component {
	render() {
		const {store, collection, select} = this.props;

		return (
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
		);
	}
}

export default class extends Component {
	render() {
		const {name, storeIdentifier, objectIdentifier, nodeType, ...props} = this.props;

		return (
			<CollectionQuery
				storeIdentifier={storeIdentifier}
				objectIdentifier={objectIdentifier}
				nodeType={nodeType}
				collectionName={name}
			>
				{({store}) => (
					<Collection>
						{collection => (
							<Select allItems={collection.map(item => ({name: item.identifier}))} allowEmpty>
								{select => (
									<CollectionEditor
										store={store}
										collection={collection}
										select={select}
										{...props}
									/>
								)}
							</Select>
						)}
					</Collection>
				)}
			</CollectionQuery>
		);
	}
}
