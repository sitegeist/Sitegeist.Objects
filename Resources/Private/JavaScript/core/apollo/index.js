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
import {ApolloClient} from 'apollo-client';
import {HttpLink} from 'apollo-link-http';
import {InMemoryCache} from 'apollo-cache-inmemory';
import {ApolloProvider} from 'react-apollo';

//
// Use InMemoryCache for now
//
const apolloCache = new InMemoryCache();

export default class CoreApolloProvider extends Component {
	static propTypes = {
		csrfToken: PropTypes.string.isRequired,
		apiEndpoint: PropTypes.string.isRequired,
		children: PropTypes.node.isRequired
	};

	render() {
		const {csrfToken, apiEndpoint} = this.props;
		const client = new ApolloClient({
			link: new HttpLink({
				uri: apiEndpoint,
				headers: {
					'X-Flow-Csrftoken': csrfToken
				},
				credentials: 'include'
			}),
			cache: apolloCache
		});

		return (
			<ApolloProvider client={client}>
				{this.props.children}
			</ApolloProvider>
		);
	}
}
