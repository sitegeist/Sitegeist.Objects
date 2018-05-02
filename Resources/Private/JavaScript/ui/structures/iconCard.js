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
import PropTypes from 'prop-types';
import styled from 'styled-components';

import Icon from '../primitives/icon';
import Box from '../primitives/box';

const Card = styled(Box)`
	> header {
		padding: 1em!important;
		border-bottom: 1px solid rgba(0, 0, 0, .24);
	}

	${Icon} {
		margin-right: 16px!important;
	}
`;

const Body = styled.div`
	padding: 1em 1em 1em calc(3em + 4px)!important;
`;

const IconCard = ({children, icon, title}) => (
	<Card>
		<header>
			<h2>
				<Icon className={icon}/>
				{title}
			</h2>
		</header>
		<Body>
			{children}
		</Body>
	</Card>
);

IconCard.propTypes = {
	children: PropTypes.node.isRequired,
	icon: PropTypes.string.isRequired,
	title: PropTypes.string.isRequired
};

export default IconCard;
