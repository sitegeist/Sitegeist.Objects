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

import Box from './box';

const Message = styled(Box)`
	padding: 1em!important;
`;

Message.Text = styled.div`
	font-style: italic;
	margin-bottom: 1em!important;
`;

Message.Code = styled.pre`
	background-color: #444;
	padding: .6em!important;
`;

export default Message;
