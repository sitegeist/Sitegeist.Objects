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
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Icon = styled.i`
	font-size: ${props => props.size * 16}px!important;
	width: ${props => props.size * 16}px!important;
	height: ${props => props.size * 16}px!important;
	line-height: ${props => props.size * 16}px!important;
	display: inline-flex!important;
	justify-content: center!important;
	align-items: center!important;
	overflow: hidden!important;
	vertical-align: center;
`;

Icon.propTypes = {
	size: PropTypes.number
};

Icon.defaultProps = {
	size: 1
};

export default Icon;
