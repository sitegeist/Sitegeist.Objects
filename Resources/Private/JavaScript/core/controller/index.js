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
import {Adopt} from 'react-adopt';

import History from '../history';

export default ({propTypes, components, mapProps}) => {
	const Controller = ({children, ...outsideProps}) => (
		<Adopt
			mapper={{
				history: <History/>
			}}
		>
			{({history}) => (
				<Adopt
					mapper={components(Object.assign({}, {history}, outsideProps))}
					mapProps={props => Object.assign({}, props, mapProps(props))}
				>
					{children}
				</Adopt>
			)}
		</Adopt>
	);

	Controller.propTypes = {
		...propTypes,
		children: PropTypes.func.isRequired
	};

	return Controller;
};
