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
import {Component} from 'shim/react';
import PropTypes from 'shim/prop-types';

/**
 * @TODO: Better documentation
 */
export default class Transient extends Component {
	static propTypes = {
		onChange: PropTypes.func,
		children: PropTypes.func,
		value: PropTypes.object,
		initial: PropTypes.object
	};

	static defaultProps = {
		onChange: () => {},
		children: () => null,
		value: null,
		initial: {}
	};

	static getDerivedStateFromProps = (props, state) => ({
		values: props.value || (state ? state.values : {})
	});

	state = {
		values: this.props.value || this.props.initial
	};

	handleChange = () => {
		const {onChange} = this.props;
		const {values} = this.state;

		onChange({values});
	};

	has = key => {
		const {values} = this.state;

		return (values && (key in values) && (values[key] !== undefined));
	};

	hasValues = () => {
		const {values} = this.state;

		return Object.keys(values).filter(key => values[key] !== undefined).length > 0;
	}

	get = key => {
		if (this.has(key)) {
			const {values} = this.state;

			return values[key];
		}
	};

	set = (key, value) => this.setState(state => ({
		values: {
			...state.values,
			[key]: value
		}
	}), this.handleChange);

	/**
	 * @TODO: deprecate
	 */
	add = this.set

	remove = key => this.setState(state => ({
		values: {
			...state.values,
			[key]: undefined
		}
	}), this.handleChange);

	map = mapFunction => Object.keys(this.state.values)
		.map((key, index, keys) => mapFunction(this.state.values[key], key, index, keys, this.state.values));

	reduce = reducerFunction => this.setState(state => ({
		values: reducerFunction(state.values)
	}), this.handleChange);

	reset = () => this.setState({
		values: {}
	}, this.handleChange);

	render() {
		const {values} = this.state;

		return this.props.children({
			has: this.has,
			get: this.get,
			add: this.add,
			remove: this.remove,
			map: this.map,
			reduce: this.reduce,
			reset: this.reset,
			hasValues: this.hasValues(),
			values
		});
	}
}
