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
import React from 'shim/react';
import PropTypes from 'shim/prop-types';
import styled from 'shim/styled-components';
import filesize from 'file-size';

import Button from '../primitives/button';
import ButtonList from '../primitives/buttonList';
import Icon from '../primitives/icon';
import FileIcon from '../primitives/fileIcon';

const Thumbnail = styled.img`
	width: 100px;
	height: 100px!important;
	object-fit: cover;
	user-drag: none;
	user-select: none;
	-moz-user-select: none;
	-webkit-user-drag: none;
	-webkit-user-select: none;
	-ms-user-select: none;
	pointer-events: none;
	cursor: move;
`;

const Card = styled.div`
	display: flex;

	> * {
		line-height: 24px;
	}

	> :first-child {
		cursor: move;
		width: 100px;
		padding: 0 10px;

		i {
			font-size: 100px !important;
			width: 100px !important;
			height: 100px !important;
		}
	}

	strong {
		font-weight: bold;
	}

	${ButtonList} {
		margin-top: 10px;
	}
`;

const MediaCard = ({thumbnailUri, mediaType, fileName, fileSize, onDelete, linkToMediaBrowser}) => (
	<Card>
		<div>
			{thumbnailUri && /image/.test(mediaType) ?
				<Thumbnail src={thumbnailUri} alt="Thumbnail" draggable={false}
					onDrag={event => {
						event.preventDefault();
					}}/> :
				<FileIcon mediaType={mediaType}/>
			}
		</div>
		<div>
			<div>
				<strong>Dateiname: </strong> {fileName}
			</div>

			<div>
				<strong>Dateigröße: </strong> {filesize(fileSize).human('si')}
			</div>

			<ButtonList>
				{onDelete ? (
					<Button onClick={onDelete}>
						<Icon className="icon-remove"/>
						{/* @TODO: I18n */}
						Entfernen
					</Button>
				) : null}

				{linkToMediaBrowser ? (
					<a
						href={linkToMediaBrowser}
						target="_blank"
					>
						<Button>
							<Icon className="icon-external-link"/>
							{/* @TODO: I18n */}
							In Media Browser bearbeiten
						</Button>
					</a>
				) : null}
			</ButtonList>
		</div>
	</Card>
);

MediaCard.propTypes = {
	thumbnailUri: PropTypes.string,
	mediaType: PropTypes.string.isRequired,
	fileName: PropTypes.string.isRequired,
	fileSize: PropTypes.number.isRequired,
	onDelete: PropTypes.func,
	linkToMediaBrowser: PropTypes.string
};

MediaCard.defaultProps = {
	thumbnailUri: null,
	onDelete: null,
	linkToMediaBrowser: null
};

export default MediaCard;
