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
import React, {Component} from 'shim/react';
import {BehaviorSubject} from 'rxjs';
import uuid from 'uuid';

import FlashMessage, {FlashMessageContainer} from './components';

const {flashMessages$} = window.Sitegeist.Objects;

export const publishFlashMessage = ({severity, message, timeout = 0}) => flashMessages$.next({
	id: uuid.v4(),
	severity,
	message,
	timeout
});

export default class FlashMessageManager extends Component {
	state = {
		flashMessages: []
	};

	componentDidMount() {
		flashMessages$.subscribe({
			next: flashMessage => {
				if (flashMessage) {
					this.setState(state => ({
						flashMessages: [...state.flashMessages, flashMessage]
					}));

					if (flashMessage.timeout) {
						setTimeout(() => this.handleCloseFlashMessage(flashMessage), flashMessage.timeout);
					}
				}
			}
		});
	}

	handleCloseFlashMessage(flashMessage) {
		this.setState(state => ({
			flashMessages: state.flashMessages.filter(({id}) => id !== flashMessage.id)
		}));
	}

	render() {
		return (
			<FlashMessageContainer>
				{this.state.flashMessages.map(flashMessage => (
					<FlashMessage
						key={flashMessage.id}
						onClose={() => this.handleCloseFlashMessage(flashMessage)}
						{...flashMessage}
					/>
				))}
			</FlashMessageContainer>
		);
	}
}
