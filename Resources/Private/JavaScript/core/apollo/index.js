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
import PropTypes from 'shim/prop-types';
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
			cache: apolloCache,
			/**
			 * @TODO: These options will disable the Apollo cache. The reason for this is the following issue:
			 *        https://github.com/apollographql/apollo-client/issues/1618
			 *        The current status of th issue (as of May 2018) looks pretty bad. Momentarily it appears to be
			 *        unlikely to be solved.
			 *        This might very well be a reason to replace Apollo entirely.
			 */
			defaultOptions: {
				watchQuery: {
					fetchPolicy: 'network-only',
					errorPolicy: 'ignore'
				},
				query: {
					fetchPolicy: 'network-only',
					errorPolicy: 'all'
				}
			}
		});

		return (
			<ApolloProvider client={client}>
				{this.props.children}
			</ApolloProvider>
		);
	}
}
