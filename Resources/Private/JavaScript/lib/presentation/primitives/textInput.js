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
import styled from 'shim/styled-components';

const Container = styled.div`
	display: flex;
	flex-direction: column;
	height: 100%;

	label {
		flex-grow: 1;
		background-color: #3f3f3f;
		cursor: text!important;
		margin-bottom: 0!important;
	}

	input {
		width: 100%;
		flex-grow: 0;
	}

	input:focus + label {
		background-color: #fff;
	}
`;

const Input = ({id, ...props}) => (
	<Container>
		<input id={id} type="text" {...props}/>
		<label htmlFor={id}/>
	</Container>
);

const TextInput = styled(Input)`
`;

export default TextInput;
