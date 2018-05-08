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
import styled from 'styled-components';

import Icon from './icon';

const Button = styled.button`
	display: inline-flex!important;
	align-items: center!important;

	${Icon} {
		margin-right: 10px;
	}
`;

export default Button;