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
import Dropzone from 'react-dropzone';

const UploadArea = styled.div`
	padding: 20px!important;
	border: 2px dashed #ccc;
`;

const UploadInput = ({allowMultiple, id, onChange}) => (
	<Dropzone
		style={{/*  */}}
		multiple={allowMultiple}
		onDrop={onChange}
		inputProps={{id}}
	>
		<UploadArea disablePreview>
			{/* @TODO: I18n */}
			Drop files here
		</UploadArea>
	</Dropzone>
);

UploadInput.propTypes = {
	allowMultiple: PropTypes.bool,
	id: PropTypes.string.isRequired,
	onChange: PropTypes.func.isRequired
};

UploadInput.defaultProps = {
	allowMultiple: false
};

export default UploadInput;
