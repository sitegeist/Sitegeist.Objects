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

export default class Toggle extends Component {
	static propTypes = {
		initial: PropTypes.bool.isRequired,
		children: PropTypes.func
	};

	static defaultProps = {
		children: () => null
	};

	state = {
		is: this.props.initial
	};

	toggle = () => {
		this.setState(state => ({is: !state.is}));
	};

	setTrue = () => {
		this.setState({is: true});
	}

	setFalse = () => {
		this.setState({is: false});
	}

	render() {
		return this.props.children({
			is: this.state.is,
			isNot: !this.state.is,
			toggle: this.toggle,
			setTrue: this.setTrue,
			setFalse: this.setFalse
		});
	}
}
