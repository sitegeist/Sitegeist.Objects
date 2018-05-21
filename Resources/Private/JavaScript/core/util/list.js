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

/**
 * @TODO: Better documentation
 * @TODO: The code looks fairly complex, simply because making this Component controllable
 *        introduces a lot of conditions. It's probably better to go the way via React's
 *        `getDerivedStateFromProps` lifecycle method to sync both state and props.
 */
export default class List extends Component {
	static propTypes = {
		onChange: PropTypes.func,
		onAdd: PropTypes.func,
		onRemove: PropTypes.func,
		onReplace: PropTypes.func,
		onMove: PropTypes.func,
		onClear: PropTypes.func,
		onReset: PropTypes.func,
		children: PropTypes.func,
		initial: PropTypes.array,
		value: PropTypes.array
	};

	static defaultProps = {
		onChange: () => {},
		onAdd: () => {},
		onRemove: () => {},
		onReplace: () => {},
		onMove: () => {},
		onClear: () => {},
		onReset: () => {},
		children: () => null,
		initial: [],
		value: null
	};

	state = {
		values: this.props.value || this.props.initial
	};

	handleAdd = (value, values) => {
		const {onAdd, onChange} = this.props;

		onAdd(value, values);
		onChange(values);
	}

	handleRemove = (value, index, values) => {
		const {onRemove, onChange} = this.props;

		onRemove(value, index, values);
		onChange(values);
	}

	handleReplace = (value, index, values) => {
		const {onReplace, onChange} = this.props;

		//
		// @TODO: Should give the new value as well
		//
		onReplace(value, index, values);
		onChange(values);
	}

	handleMove = (value, fromIndex, toIndex, values) => {
		const {onMove, onChange} = this.props;

		onMove(value, fromIndex, toIndex, values);
		onChange(values);
	};

	handleClear = () => {
		const {onClear, onChange} = this.props;

		onClear();
		onChange(this.state.values);
	};

	handleReset = () => {
		const {onReset, onClear, onChange} = this.props;

		onReset();

		if (!this.state.values.length) {
			onClear();
		}

		if (this.props.value) {
			onChange(this.props.value || this.props.initial);
		} else {
			onChange(this.state.values);
		}
	};

	add = value => {
		this.setState(state => ({
			values: [...(this.props.value || state.values), value]
		}), () => this.handleAdd(value, this.state.values));
	}

	remove = index => {
		const removedItem = (this.props.value || this.state.values)[index];

		this.setState(state => ({
			values: (this.props.value || state.values).filter((item, i) => i !== index)
		}), () => this.handleRemove(removedItem, index, this.state.values));
	}

	replace = (index, transformFunction) => {
		const replacedItem = (this.props.value || this.state.values)[index];

		this.setState(state => ({
			values: (this.props.value || state.values).map((item, i) => {
				if (i === index) {
					return transformFunction(item);
				}

				return item;
			})
		}), () => this.handleReplace(replacedItem, index, this.state.values));
	}

	move = (fromIndex, toIndex) => {
		const movedItem = (this.props.value || this.state.values)[fromIndex];

		this.setState(state => {
			const values = [...(this.props.value || state.values)];
			values.splice(toIndex, 0, values.splice(fromIndex, 1)[0]);
			console.log({values});
			return {values};
		}, () => this.handleMove(movedItem, fromIndex, toIndex, this.state.values));
	}

	clear = () => {
		this.setState({values: []}, () => this.handleClear());
	}

	reset = () => {
		this.setState({values: this.props.value || this.props.initial}, () => this.handleReset());
	}

	map = mapFunction => (this.props.value || this.state.values).map((value, index) => {
		return mapFunction({
			value,
			remove: () => this.remove(index),
			replace: (...args) => this.replace(index, ...args)
		});
	});

	render() {
		return this.props.children({
			add: this.add,
			remove: this.remove,
			move: this.move,
			clear: this.clear,
			reset: this.reset,
			map: this.map,
			isEmpty: !(this.props.value || this.state.values).length,
			isNotEmpty: Boolean((this.props.value || this.state.values).length),
			length: (this.props.value || this.state.values).length,
			values: this.props.value || this.state.values
		});
	}
}
