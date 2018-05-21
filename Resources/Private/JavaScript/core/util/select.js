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
export default class Select extends Component {
	static propTypes = {
		initial: PropTypes.string,
		value: PropTypes.string,
		allItems: PropTypes.arrayOf(PropTypes.shape({
			name: PropTypes.string.isRequired,
			data: PropTypes.object
		})).isRequired,
		onChange: PropTypes.func,
		children: PropTypes.func,
		allowEmpty: PropTypes.bool
	};

	static defaultProps = {
		allowEmpty: false,
		initial: null,
		value: null,
		onChange: () => {},
		children: () => {}
	};

	state = {
		selected: this.getInitialValue()
	};

	getInitialValue() {
		if (this.props.value) {
			return null;
		}

		return this.props.allowEmpty === true ?
			this.props.initial : (this.props.initial || this.props.allItems[0].name);
	}

	getValue() {
		return this.props.value || this.state.selected || this.getInitialValue();
	}

	getSelectedItem(value = null) {
		const selected = value || this.getValue();
		const {allItems} = this.props;
		const [selectedItem] = allItems.filter(item => item.name === selected);

		return selectedItem;
	}

	handleChange = selected => {
		const {onChange, allItems} = this.props;
		const selectedItem = this.getSelectedItem(selected);

		onChange({
			allItems,
			selected,
			selectedItem
		});
	}

	select = value => {
		if (!this.props.allItems.some(({name}) => name === value)) {
			throw new Error(`${value} cannot be selected!`);
		}

		if (!this.props.value) {
			this.setState({selected: value});
		}

		this.handleChange(value);
	}

	clear = () => {
		if (!this.props.value && this.props.allowEmpty) {
			this.setState({selected: null}, this.handleChange);
		}
	};

	isSelected = value => {
		if (this.props.value) {
			return this.props.value === value;
		}

		return this.state.selected === value;
	}

	reset = () => {
		this.select(this.getInitialValue());
	};

	render() {
		const {allItems} = this.props;
		const {select, clear, isSelected, reset} = this;
		const value = this.getValue();
		const selectedItem = this.getSelectedItem();
		const hasSelection = selectedItem !== null;

		return this.props.children({
			select,
			clear,
			isSelected,
			reset,
			hasSelection,
			allItems,
			selectedItem,
			value
		});
	}
}
