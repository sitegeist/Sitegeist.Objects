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

export const registerFilterEditor = (name, component) => {
	window.Sitegeist.Objects.plugin.filterEditors[name] = component;
};

export default class FilterManager extends Component {
	static propTypes = {
		name: PropTypes.string.isRequired,
		onChange: PropTypes.func.isRequired,
		value: PropTypes.any
	};

	static defaultProps = {
		value: null
	};

	render() {
		const {name, value, onChange} = this.props;

		if (!(name in window.Sitegeist.Objects.plugin.filterEditors)) {
			throw new Error(`Could not find Filter Editor "${name}"`);
		}

		const Editor = window.Sitegeist.Objects.plugin.filterEditors[name];
		const editorProps = {
			commit: value => onChange(value),
			value
		};

		return (<Editor {...editorProps}/>);
	}
}
