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
import TextAreaAutoSize from 'react-textarea-autosize';

const TextArea = styled(TextAreaAutoSize)`
	flex: 1;
	width: 100% !important;
`;

export default TextArea;
