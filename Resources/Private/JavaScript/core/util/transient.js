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
import {Component} from 'react';
import PropTypes from 'prop-types';

export default class Transient extends Component {
	static propTypes = {
		onChange: PropTypes.func,
		children: PropTypes.func
	};

	static defaultProps = {
		onChange: () => {},
		children: () => null
	};

	state = {
		values: {}
	};

	handleChange = () => {
		const {onChange} = this.props;
		const {values} = this.state;

		onChange({values});
	};

	has = key => {
		return (
			(key in this.state.values) &&
			(this.state.values[key] !== undefined)
		);
	};

	get = key => {
		return this.state.values[key];
	};

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

	reduce = (key, reducer) => {
		this.setState(state => ({
			values: {
				...state.values,
				[key]: reducer(state.values[key])
			}
		}), this.handleChange);
	};

	reset = () => {
		this.setState({
			values: {}
		}, this.handleChange);
	};

	render() {
		const {has, get, add, remove, reduce, reset} = this;
		const {values} = this.state;
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
