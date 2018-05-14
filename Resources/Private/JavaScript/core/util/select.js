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

export default class Select extends Component {
	static propTypes = {
		initial: PropTypes.string,
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
		onChange: () => {},
		children: () => {}
	};

	state = {
		selected: this.props.allowEmpty === true ?
			this.props.initial : (this.props.initial || this.props.allItems[0].name)
	};

	handleChange = () => {
		const {onChange, allItems} = this.props;
		const {selected} = this.state;
		const [selectedItem] = allItems.filter(item => item.name === selected);

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

		this.setState({selected: value}, this.handleChange);
	}

	clear = () => {
		if (this.props.allowEmpty) {
			this.setState({selected: null}, this.handleChange);
		}
	};

	isSelected = value => {
		return this.state.selected === value;
	}

	reset = () => {
		this.setState({
			selected: this.props.allowEmpty === true ?
				this.props.initial : (this.props.initial || this.props.allItems[0].name)
		}, this.handleChange);
	};

	render() {
		const {allItems} = this.props;
		const {select, clear, isSelected, reset} = this;
		const {selected} = this.state;
		const hasSelection = selected !== null;
		const [selectedItem] = allItems.filter(item => item.name === selected);

		return this.props.children({
			select,
			clear,
			isSelected,
			reset,
			hasSelection,
			allItems,
			selectedItem
		});
	}
}
