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
import PropTypes from 'shim/prop-types';
import {Container, Draggable} from 'react-smooth-dnd';
import styled from 'shim/styled-components';

const AdjustStyles = styled.div`
	.smooth-dnd-container.vertical > .smooth-dnd-draggable-wrapper {
		overflow: visible;
	}

	.smooth-dnd-draggable-wrapper {
		cursor: move;
	}
`;

const DragAndDropList = ({mappable, renderKey, children, disabled, ...props}) => (
	<AdjustStyles>
		{disabled ? mappable.map(item => (<div key={renderKey(item)}>{children(item)}</div>)) : (
			<Container {...props}>
				{mappable.map(item => (
					<Draggable key={renderKey(item)}>
						{children(item)}
					</Draggable>
				))}
			</Container>
		)}
	</AdjustStyles>
);

DragAndDropList.propTypes = {
	mappable: PropTypes.oneOfType([
		PropTypes.array,
		PropTypes.shape({
			map: PropTypes.func.isRequired
		})
	]).isRequired,
	renderKey: PropTypes.func.isRequired,
	children: PropTypes.func.isRequired,
	disabled: PropTypes.bool
};

DragAndDropList.defaultProps = {
	disabled: false
};

export default DragAndDropList;
