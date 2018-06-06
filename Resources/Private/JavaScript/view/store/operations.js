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

import HideObjects from '../../actions/hideObjects';
import ShowObjects from '../../actions/showObjects';
import DiscardObjects from '../../actions/discardObjects';
import PublishObjects from '../../actions/publishObjects';
import CopyObject from '../../actions/copyObject';

import ButtonList from '../../ui/primitives/buttonList';
import Button from '../../ui/primitives/button';
import Icon from '../../ui/primitives/icon';

/* @TODO: Ad-hoc styled component */
const Container = styled.div`
	display: flex;
	justify-content: space-between;
`;

export default class Operations extends Component {
	static propTypes = {
		selection: PropTypes.array.isRequired,
		storeIdentifier: PropTypes.string.isRequired,
		nodeTypeForCreation: PropTypes.string.isRequired
	};

	render() {
		const {selection, storeIdentifier, nodeTypeForCreation} = this.props;
		const hidableItems = selection.filter(item => !item.isHidden);
		const publishableItems = selection.filter(item => item.hasUnpublishedChanges);

		return (
			<Container>
				<ButtonList>
					{selection.length === 0 ? (
						<Link to={`/store/${storeIdentifier}/create/${nodeTypeForCreation}`}>
							<Button>
								<Icon className="icon-plus"/>
								{/* @TODO. I18n */}
								Neu erstellen
							</Button>
						</Link>
					) : null}

					{selection.length === 1 ? (
						<Link to={`/store/${storeIdentifier}/edit/${selection[0].identifier}`}>
							<Button>
								<Icon className="icon-pencil"/>
								{/* @TODO: I18n */}
								Bearbeiten
							</Button>
						</Link>
					) : null}

					{selection.length === 1 && selection[0].previewUri ? (
						<a href={selection[0].previewUri} target="_blank">
							<Button>
								<Icon className="icon-external-link"/>
								{/* @TODO: I18n */}
								Vorschau
							</Button>
						</a>
					) : null}

					{selection.length === 1 ? (
						<CopyObject
							storeIdentifier={storeIdentifier}
							object={selection[0]}
						/>
					) : null}

					{hidableItems.length > 0 ? (
						<HideObjects
							storeIdentifier={storeIdentifier}
							objects={hidableItems}
						/>
					) : null}

					{selection.length > 0 && hidableItems.length === 0 ? (
						<ShowObjects
							storeIdentifier={storeIdentifier}
							objects={selection}
						/>
					) : null}
				</ButtonList>
				<ButtonList>
					{publishableItems.length > 0 ? (
						<PublishObjects
							storeIdentifier={storeIdentifier}
							objects={publishableItems}
						/>
					) : null}

					{publishableItems.length > 0 ? (
						<DiscardObjects
							storeIdentifier={storeIdentifier}
							objects={publishableItems}
						/>
					) : null}
				</ButtonList>
			</Container>
		);
	}
}
