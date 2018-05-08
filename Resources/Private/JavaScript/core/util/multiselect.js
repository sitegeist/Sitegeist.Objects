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

export default class MultiSelect extends Component {
	static propTypes = {
		initial: PropTypes.array,
		allItems: PropTypes.array,
		onChange: PropTypes.func,
		children: PropTypes.func
	};

	static defaultProps = {
		initial: [],
		allItems: [],
		onChange: () => {},
		children: () => {}
	};

	state = {
		allSelected: false,
		items: this.props.initial
	};

	handleChange = () => {
		const {onChange, allItems} = this.props;

		onChange({
			items: allItems.filter(this.has),
			allItems
		});
	}

	has = value => {
		return this.state.allSelected || this.state.items.includes(value);
	};

	select = value => {
		if (!this.props.allItems.includes(value)) {
			throw new Error(`${value} cannot be selected!`);
		}

		if (!this.has(value)) {
			this.setState(state => ({
				items: [...state.items, value]
			}), this.handleChange);
		}
	};

	selectAll = () => {
		this.setState({allSelected: true}, this.handleChange);
	};

	remove = value => {
		if (this.has(value)) {
			this.setState(state => ({
				items: [...state.items.filter(v => v !== value)]
			}), this.handleChange);
		}
	};

	removeAll = () => {
		this.setState({
			allSelected: false,
			items: []
		}, this.handleChange);
	}

	reset = () => {
		this.setState({
			allSelected: false,
			items: this.props.initial
		}, this.handleChange);
	}

	toggle = value => {
		if (this.has(value)) {
			this.remove(value);
		} else {
			this.select(value);
		}
	};

	toggleAll = () => {
		this.setState(state => ({
			allSelected: !state.allSelected
		}), this.handleChange);
	};

	render() {
		const {has, select, selectAll, remove, removeAll, reset, toggle, toggleAll} = this;
		const {allSelected, items} = this.state;

		return this.props.children({
			has,
			select,
			selectAll,
			remove,
			removeAll,
			reset,
			toggle,
			toggleAll,
			allSelected,
			items
		});
	}
}
