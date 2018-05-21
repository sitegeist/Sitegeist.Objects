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
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import Modal from '../primitives/modal';
import Button from '../primitives/button';

const MediaBrowserFrame = styled.iframe`
	margin: 0 auto: !important;
	height: 80vh;
	width: 80vw;
	background-color: #222;
`;

export default class MediaBrowser extends Component {
	static propTypes = {
		onComplete: PropTypes.func.isRequired,
		onClose: PropTypes.func.isRequired
	};

	componentDidMount() {
		const {onComplete} = this.props;

		window.NeosMediaBrowserCallbacks = {
			assetChosen: assetIdentifier => {
                onComplete(assetIdentifier);
			}
		};
	}

	componentWillUnmount() {
		window.NeosMediaBrowserCallbacks = undefined;
	}

	render() {
		return (
			<Modal>
				<MediaBrowserFrame src={window.Sitegeist.Objects.mediaBrowserUrl}/>
				{/* @TODO: Icons / Titles */}
				<Button onClick={this.props.onClose}>CLOSE</Button>
			</Modal>
		);
	}
}
