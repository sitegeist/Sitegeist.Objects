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
		allowEmpty: PropTypes.bool,
		persistent: PropTypes.string
	};

	static defaultProps = {
		persistent: null,
		allowEmpty: false,
		initial: null,
		value: null,
		onChange: () => {},
		children: () => {}
	};

	static getDerivedStateFromProps = (props, state) => ({
		selected: state && 'selected' in state ? state.selected : (
			props.value || this.getInitialSelectionConsideringPersistentSelection()
		)
	});

	state = {
		selected: this.getInitialSelectionConsideringPersistentSelection()
	};

	getInitialSelectionConsideringPersistentSelection() {
		if (this.props.persistent) {
			const persistentSelection = window.sessionStorage.getItem(this.props.persistent);

			if (
				persistentSelection &&
				persistentSelection !== '"null"' &&
				this.getSelectedItem(persistentSelection)
			) {
				return persistentSelection;
			}
		}

		return this.getInitialSelection();
	}

	getInitialSelection() {
		if (this.props.value) {
			return this.props.value;
		}

		return this.props.allowEmpty === true ?
			this.props.initial : (this.props.initial || this.props.allItems[0].name);
	}

	getSelectedItem(value = null) {
		const selected = value || this.state.selected;
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

	select = selected => this.setState({
		selected
	}, () => this.handleChange(this.state.selected));

	toggleSelect = value => {
		if (this.isSelected(value)) {
			this.clear();
		} else {
			this.select(value);
		}
	};

	clear = () => {
		if (this.props.allowEmpty) {
			this.setState({selected: null}, () => this.handleChange(this.state.selected));
		}
	};

	isSelected = value => {
		const {selected} = this.state;

		return selected === value;
	}

	reset = () => {
		this.select(this.getInitialSelection());
	};

	render() {
		const {allItems} = this.props;
		const {selected} = this.state;
		const selectedItem = this.getSelectedItem();
		const hasSelection = Boolean(selectedItem);

		if (this.props.persistent) {
			window.sessionStorage.setItem(this.props.persistent, selected);
		}

		return this.props.children({
			select: this.select,
			clear: this.clear,
			isSelected: this.isSelected,
			reset: this.reset,
			toggleSelect: this.toggleSelect,
			value: selected, /* @TODO: deprecate */
			hasSelection,
			allItems,
			selectedItem,
			selected,
			map: mapFn => allItems.map(item => mapFn({
				...item,
				isSelected: this.isSelected(item.name),
				select: () => this.select(item.name)
			}))
		});
	}
}
