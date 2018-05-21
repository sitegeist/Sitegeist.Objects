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

/**
 * @TODO: Better documentation
 * @TODO: Children should always be a function!
 * @TODO: In fact: This was a bad idea to begin with. Condition should be
 *        removed entirely.
 */
export default class Condition extends Component {
	static propTypes = {
		condition: PropTypes.bool.isRequired,
		children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]).isRequired
	};

	render() {
		if (this.props.condition === true) {
			if (typeof this.props.children === 'function') {
				return this.props.children();
			}

			return React.Children.only(this.props.children);
		}

		return null;
	}
}
