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
import React from 'react';
import PropTypes from 'prop-types';

import Icon from './icon';

const renderMediaTypeIconName = mediaType => {
	switch (mediaType) {
		case 'image/jpeg':
		case 'image/png':
		case 'image/gif':
			return 'icon-file-image-o';

		case 'video/ogg':
		case 'video/mp4':
			return 'icon-file-video-o';

		case 'application/zip':
		case 'application/gzip':
			return 'icon-file-archive-o';

		case 'application/pdf':
			return 'icon-file-pdf-o';

		case 'text/plain':
			return 'icon-file-text-o';

		case 'text/csv':
		case 'application/vnd.ms-excel':
		case 'application/vnd.oasis.opendocument.spreadsheet':
		case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
			return 'icon-file-excel-o';

		case 'application/msword':
		case 'application/vnd.oasis.opendocument.text':
		case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
			return 'icon-file-word-o';

		case 'application/vnd.ms-powerpoint':
		case 'application/vnd.oasis.opendocument.presentation':
		case 'application/vnd.openxmlformats-officedocument.presentationml.presentation':
			return 'icon-file-powerpoint-o';

		default:
			return 'icon-file-o';
	}
};

const FileIcon = ({mediaType}) => (
	<Icon className={renderMediaTypeIconName(mediaType)}/>
);

FileIcon.propTypes = {
	mediaType: PropTypes.string.isRequired
};

export default FileIcon;
