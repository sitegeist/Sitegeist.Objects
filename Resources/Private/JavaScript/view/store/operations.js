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
import {Link} from 'react-router-dom';
import styled from 'shim/styled-components';

import CreateObject from '../../actions/createObject';
import EditObject from '../../actions/editObject';
import PreviewObject from '../../actions/previewObject';
import HideObjects from '../../actions/hideObjects';
import ShowObjects from '../../actions/showObjects';
import DiscardObjects from '../../actions/discardObjects';
import PublishObjects from '../../actions/publishObjects';
import CopyObject from '../../actions/copyObject';

import ButtonList from '../../lib/presentation/primitives/buttonList';
import Button from '../../lib/presentation/primitives/button';
import Icon from '../../lib/presentation/primitives/icon';

/* @TODO: Ad-hoc styled component */
const Container = styled.div`
	display: flex;
	justify-content: space-between;
`;

export default class Operations extends Component {
	static propTypes = {
		selection: PropTypes.array.isRequired,
		store: PropTypes.shape({
			identifier: PropTypes.string.isRequired
		}).isRequired,
		nodeTypeForCreation: PropTypes.string.isRequired
	};

	render() {
		const {selection, store, nodeTypeForCreation} = this.props;
		const hidableItems = selection.filter(item => !item.isHidden);
		const publishableItems = selection.filter(item => item.hasUnpublishedChanges);

		return (
			<Container>
				<ButtonList>
					{selection.length === 0 ? (
						<CreateObject store={store} nodeType={nodeTypeForCreation}/>
					) : null}

					{selection.length === 1 ? (
						<EditObject store={store} object={selection[0]}/>
					) : null}

					{selection.length === 1 && selection[0].previewUri ? (
						<PreviewObject object={selection[0]}/>
					) : null}

					{selection.length === 1 ? (
						<CopyObject store={store} object={selection[0]}/>
					) : null}

					{hidableItems.length > 0 ? (
						<HideObjects store={store} objects={hidableItems}/>
					) : null}

					{selection.length > 0 && hidableItems.length === 0 ? (
						<ShowObjects store={store} objects={selection}/>
					) : null}
				</ButtonList>
				<ButtonList>
					{publishableItems.length > 0 ? (
						<PublishObjects store={store} objects={publishableItems}/>
					) : null}

					{publishableItems.length > 0 ? (
						<DiscardObjects store={store} objects={publishableItems}/>
					) : null}
				</ButtonList>
			</Container>
		);
	}
}
