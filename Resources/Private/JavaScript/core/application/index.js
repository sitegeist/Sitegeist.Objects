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
import React, {Component, Fragment} from 'shim/react';
import moment from 'moment';
import PropTypes from 'shim/prop-types';

import FlashMessageManager from '../flashMessage';

const today = moment();
export const DateContext = React.createContext({
	today,
	lastChosenDate: null,
	setLastChosenDate: () => {}
});

class Application extends Component {
	static propTypes = {
		children: PropTypes.node.isRequired
	};

	state = {lastChosenDate: null};

	setLastChosenDate = lastChosenDate => this.setState({lastChosenDate});

	render() {
		return (
			<DateContext.Provider
				value={{
					today,
					lastChosenDate: this.state.lastChosenDate,
					setLastChosenDate: this.setLastChosenDate
				}}
			>
				<FlashMessageManager/>
				{this.props.children}
			</DateContext.Provider>
		);
	}
}

export default Application;
