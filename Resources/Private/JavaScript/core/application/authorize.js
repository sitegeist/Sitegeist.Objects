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
import PropTypes from 'shim/prop-types';

import Modal from '../../ui/primitives/modal';
import TextInput from '../../ui/primitives/textInput';
import Button from '../../ui/primitives/button';

import Transient from '../util/transient';
import {publishFlashMessage} from '../flashMessage';

export default class Authorize extends Component {
	static propTypes = {
		children: PropTypes.func.isRequired
	};

	state = {
		shouldShowLoginDialog: false,
		loginCallback: null
	};

	authorize = () => new Promise(resolve => {
		this.setState({
			shouldShowLoginDialog: true,
			loginCallback: resolve
		});
	});

	async login({username, password}) {
		const {loginCallback} = this.state;
		const body = new FormData();

		body.set(
			'__authentication[Neos][Flow][Security][Authentication][Token][UsernamePassword][username]',
			username
		);
		body.set(
			'__authentication[Neos][Flow][Security][Authentication][Token][UsernamePassword][password]',
			password
		);

		const response = await fetch(window.Sitegeist.Objects.loginEndpoint, {
			method: 'POST',
			credentials: 'include',
			body
		});

		if (response.ok) {
			try {
				const {success, csrfToken} = await response.json();

				if (success) {
					window.Sitegeist.Objects.csrfToken = csrfToken;

					loginCallback();

					this.setState({
						shouldShowLoginDialog: false,
						loginCallback: null
					});
					return;
				}
			} catch (err) {
				// Empty - Flow doesn't respond with JSON in case of unsuccessful login
			}
		}

		publishFlashMessage({
			severity: 'error',
			/* @TODO: I18n */
			message: `Ihr Nutzername oder Ihr Passwort war nicht korrekt.`
		});
	}

	render() {
		const {shouldShowLoginDialog} = this.state;

		return (
			<Fragment>
				{shouldShowLoginDialog ? (
					<Transient initial={{username: '', password: ''}}>
						{login => (
							<Modal>
								<form onSubmit={() => this.login(login.values)}>
									{/* @TODO: I18n */}
									<h2>Ihre Sitzung ist abgelaufen</h2>
									{/* @TODO: I18n */}
									<p>Bitte melden Sie sich erneut an</p>
									<br/>
									<br/>
									{/* @TODO: I18n */}
									<TextInput
										placeholder="Username"
										value={login.get('username')}
										onChange={e => login.add('username', e.target.value)}
									/>
									<br/>
									{/* @TODO: I18n */}
									<TextInput
										placeholder="Password"
										type="password"
										value={login.get('password')}
										onChange={e => login.add('password', e.target.value)}
									/>
									<br/>
									{/* @TODO: I18n */}
									<Button type="submit">Login</Button>
								</form>
							</Modal>
						)}
					</Transient>
				) : null}
				{this.renderChildren()}
			</Fragment>
		);
	}

	renderChildren() {
		const {children} = this.props;

		return children(this.authorize);
	}
}
