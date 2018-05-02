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
import React, {Component} from 'react';
import PropTypes from 'prop-types';

import ApolloProvider from '../apollo';

const {csrfToken$, apiEndpoint} = window.Sitegeist.Objects;

class Application extends Component {
	static propTypes = {
		children: PropTypes.node.isRequired
	};

	state = {
		csrfToken: window.Sitegeist.Objects.csrfToken
	};

	componentDidMount() {
		csrfToken$.subscribe({
			next: csrfToken => this.setState({csrfToken})
		});
	}

	render() {
		const {csrfToken} = this.state;

		return (
			<ApolloProvider csrfToken={csrfToken} apiEndpoint={apiEndpoint}>
				{this.props.children}
			</ApolloProvider>
		);
	}
}

export default Application;
