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
import uuid from 'uuid';
import {Component} from 'shim/react';
import PropTypes from 'shim/prop-types';

export default class Collection extends Component {
	static propTypes = {
		onChange: PropTypes.func,
		value: PropTypes.array, // eslint-disable-line react/no-unused-prop-types
		initialValue: PropTypes.array, // eslint-disable-line react/no-unused-prop-types
		children: PropTypes.func.isRequired
	};

	static defaultProps = {
		onChange: () => {},
		value: null,
		initialValue: []
	};

	static getDerivedStateFromProps = (props, state) => ({
		value: props.value || (state ? state.value : null)
	});

	state = {
		value: this.props.value || this.props.initialValue
	};

	addItem = payload => {
		const identifier = `added-${uuid.v4()}`;

		this.setState(state => ({
			value: [
				...state.value,
				{
					identifier,
					payload,
					modes: ['add']
				}
			]
		}), () => this.props.onChange(this.state.value));

		return identifier;
	};

	updateItem = (identifier, updateFunction) => this.setState(state => ({
		value: [
			...state.value.map(item => {
				if (item.identifier === identifier) {
					return {
						identifier,
						payload: updateFunction(item.payload),
						modes: item.modes.includes('update') ?
							item.modes : [...item.modes, 'update']
					};
				}

				return item;
			})
		]
	}), () => this.props.onChange(this.state.value));

	moveItem = (fromIndex, toIndex) => this.setState(state => {
		const value = [...state.value];
		const targetMode = toIndex > fromIndex ? 'after' : 'before';
		const moveReference = value[toIndex];
		const movedItem = value.splice(fromIndex, 1)[0];

		value.splice(toIndex, 0, {
			...movedItem,
			modes: [...movedItem.modes.filter(m => !m.startsWith('move-')), `move-${targetMode}`],
			moveReference: moveReference.identifier
		});

		return {value};
	}, () => this.props.onChange(this.state.value));

	toggleMode = (identifier, mode) => this.setState(state => ({
		value: [
			...state.value.map(item => {
				if (item.identifier === identifier) {
					return {
						...item,
						modes: item.modes.includes(mode) ?
							item.modes.filter(m => m !== mode) : [...item.modes, mode]
					};
				}

				return item;
			})
		]
	}), () => this.props.onChange(this.state.value));

	setMode = (identifier, mode) => this.setState(state => ({
		value: [
			...state.value.map(item => {
				if (item.identifier === identifier) {
					return {
						...item,
						modes: item.modes.includes(mode) ?
							item.modes : [...item.modes, mode]
					};
				}

				return item;
			})
		]
	}), () => this.props.onChange(this.state.value));

	unsetMode = (identifier, mode) => this.setState(state => ({
		value: [
			...state.value.map(item => {
				if (item.identifier === identifier) {
					return {
						...item,
						modes: item.modes.filter(m => m !== mode)
					};
				}

				return item;
			})
		]
	}), () => this.props.onChange(this.state.value));

	map = mapFunction => this.state.value.map(item => mapFunction({
		...item,
		update: (...args) => this.updateItem(item.identifier, ...args),
		toggleMode: (...args) => this.toggleMode(item.identifier, ...args),
		setMode: (...args) => this.setMode(item.identifier, ...args),
		unsetMode: (...args) => this.unsetMode(item.identifier, ...args),
		hasMode: mode => item.modes.includes(mode)
	}), () => this.props.onChange(this.state.value))

	render() {
		return this.props.children({
			addItem: this.addItem,
			updateItem: this.updateItem,
			moveItem: this.moveItem,
			toggleMode: this.toggleMode,
			setMode: this.setMode,
			unsetMode: this.unsetMode,
			map: this.map
		});
	}
}
