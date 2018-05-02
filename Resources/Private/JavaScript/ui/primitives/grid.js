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

const Grid = styled.div`
	display: flex;
	flex-flow: row wrap;
	justify-content: space-between;

	> *, &:after {
		content: "";
		width: calc(
			(100%/${props => props.itemsPerRow}) -
			(${props => props.itemsPerRow - 1}*16px/${props => props.itemsPerRow})
		);
	}
`;

Grid.propTypes = {
	itemsPerRow: PropTypes.number
};

Grid.defaultProps = {
	itemsPerRow: 3
};

export default Grid;
