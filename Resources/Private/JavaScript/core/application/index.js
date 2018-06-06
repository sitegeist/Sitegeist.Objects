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
import React, {Component, Fragment} from 'shim/react';
import PropTypes from 'shim/prop-types';

import FlashMessageManager from '../flashMessage';

class Application extends Component {
	static propTypes = {
		children: PropTypes.node.isRequired
	};

	render() {
		return (
			<Fragment>
				<FlashMessageManager/>
				{this.props.children}
			</Fragment>
		);
	}
}

export default Application;
