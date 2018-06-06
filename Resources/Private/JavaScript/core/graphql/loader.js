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
import styled, {keyframes} from 'shim/styled-components';

import Icon from '../../lib/presentation/primitives/icon';
import Modal from '../../lib/presentation/primitives/modal';

const rotate360 = keyframes`
	from {
		transform: rotate(0deg);
	}

	to {
		transform: rotate(360deg);
	}
`;

const iconSize = 40;

const RotatingIcon = styled(Icon)`
	animation: ${rotate360} 1s linear infinite;
	font-size: ${iconSize}px!important;
	line-height: ${iconSize}px!important;
	width: ${iconSize}px!important;
	height: ${iconSize}px!important;
`;

const Spinner = () => (
	<RotatingIcon className="icon-circle-o-notch"/>
);

const Loader = () => (
	<Modal>
		<Spinner/>
	</Modal>
);

export default Loader;
