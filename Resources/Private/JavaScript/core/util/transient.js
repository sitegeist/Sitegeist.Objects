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
 * @TODO: The code looks fairly complex, simply because making this Component controllable
 *        introduces a lot of conditions. It's probably better to go the way via React's
 *        `getDerivedStateFromProps` lifecycle method to sync both state and props.
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

	state = {
		values: this.props.value || this.props.initial
	};

	handleChange = () => {
		const {onChange} = this.props;
		const {values} = this.state;

		onChange({values});
	};

	has = key => {
		const values = this.props.value || this.state.values;

		return ((key in values) && (values[key] !== undefined));
	};

	get = key => {
		const values = this.props.value || this.state.values;

		return values[key];
	};

	/**
	 * @TODO: Should be named `set`
	 */
	add = (key, value) => {
		this.setState(state => ({
			values: {
				...state.values,
				[key]: value
			}
		}), this.handleChange);
	};

	remove = key => {
		this.setState(state => ({
			values: {
				...state.values,
				[key]: undefined
			}
		}), this.handleChange);
	};

	reduce = reducer => {
		this.setState(state => ({
			values: reducer(state.values)
		}), this.handleChange);
	};

	reset = () => {
		this.setState({
			values: {}
		}, this.handleChange);
	};

	render() {
		const {has, get, add, remove, reduce, reset} = this;
		const values = this.props.value || this.state.values;
		const hasValues = Object.keys(values).filter(key => values[key] !== undefined).length > 0;

		return this.props.children({
			has,
			get,
			add,
			remove,
			reduce,
			reset,
			values,
			hasValues
		});
	}
}
