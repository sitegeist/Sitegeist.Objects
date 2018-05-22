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
import moment from 'moment';

window.Sitegeist.Objects.plugin.registerShortView('DateRange', class DateRange extends Component {
	formatDate(date) {
		const {dateFormat} = this.props.options;

		return moment(date).locale('de').format(dateFormat);
	}

	render() {
		const {properties, options} = this.props;

		return `${this.formatDate(properties[options.fromProperty])} - ${this.formatDate(properties[options.toProperty])}`;
	}
});
