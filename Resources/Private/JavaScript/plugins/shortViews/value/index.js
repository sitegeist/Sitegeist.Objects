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
import React, {Component} from 'shim/react';

window.Sitegeist.Objects.plugin.registerShortView('Value', class Value extends Component {
	render() {
		const {properties, options} = this.props;

		return properties[options.property] || '---';
	}
});
