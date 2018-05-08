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
import React, {Component} from 'react';
import PropTypes from 'prop-types';

export default class Condition extends Component {
	static propTypes = {
		condition: PropTypes.bool.isRequired,
		children: PropTypes.node.isRequired
	};

	render() {
		return this.props.condition && React.Children.only(this.props.children);
	}
}
