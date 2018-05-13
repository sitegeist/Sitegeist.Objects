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
import styled from 'styled-components';
import PropTypes from 'prop-types';

const GroupContainer = styled.section`
	&:not(:last-child) {
		margin-bottom: 4em!important;
	}
`;

const GroupHeadline = styled.h2`
	position: relative;
	margin-bottom: 1em!important;
	width: 100%;
	overflow: hidden;

	&::after {
		content: '';
		position: absolute;
		top: 50%;
		width: 100%;
		margin-left: 10px;
		border-bottom: 1px solid #3f3f3f;
	}
`;

const Group = ({headline, children, ...props}) => (
	<GroupContainer key={headline} {...props}>
		<GroupHeadline>
			{headline}
		</GroupHeadline>
		{children}
	</GroupContainer>
);

Group.propTypes = {
	headline: PropTypes.node.isRequired,
	children: PropTypes.node.isRequired
};

export default Group;
