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

const Container = styled.div`
	margin-bottom: 2em!important;
	flex: 1;
	width: 100%;
	max-width: 906px;
`;

const Label = styled.label`
`;

const Body = styled.div`
	position: relative;
`;

const Editor = ({id, label, children}) => (
	<Container>
		<Label htmlFor={id}>
			{label}:
		</Label>

		<Body>
			{children}
		</Body>
	</Container>
);

Editor.propTypes = {
	id: PropTypes.string.isRequired,
	label: PropTypes.string.isRequired,
	children: PropTypes.node.isRequired
};

export default Editor;
