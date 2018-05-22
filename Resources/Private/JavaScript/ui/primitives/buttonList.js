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
import styled from 'shim/styled-components';

import Button from './button';

const ButtonList = styled.div`
	margin-bottom: 2em!important;

	${Button} {
		margin-right: 10px;
	}
`;

export default ButtonList;
