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
import PropTypes from 'shim/prop-types';

export const registerShortView = (name, component) => {
	window.Sitegeist.Objects.plugin.shortViews[name] = component;
};

export default class ShortViewManager extends Component {
	static propTypes = {
		name: PropTypes.string.isRequired,
		properties: PropTypes.object.isRequired,
		nodeType: PropTypes.shape({
			icon: PropTypes.string,
			label: PropTypes.string.isRequired
		}).isRequired,
		label: PropTypes.string.isRequired,
		options: PropTypes.object
	};

	static defaultProps = {
		options: {}
	};

	render() {
		const {name, options, properties, nodeType, label} = this.props;

		if (!(name in window.Sitegeist.Objects.plugin.shortViews)) {
			throw new Error(`Could not find Short View "${name}"`);
		}

		const ShortView = window.Sitegeist.Objects.plugin.shortViews[name];
		const shortViewProps = {options, properties, nodeType, label};

		return (<ShortView {...shortViewProps}/>);
	}
}
